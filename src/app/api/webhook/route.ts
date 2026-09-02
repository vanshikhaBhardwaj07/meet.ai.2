export const runtime = "nodejs";
process.env.WS_NO_BUFFER_UTIL = "true";
process.env.WS_NO_UTF_8_VALIDATE = "true";

import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

const activeAgents = new Map<string, { disconnect: () => void }>();

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or API key" },
            { status: 400 }
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "cancelled")),
                )
            );

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        // Only update to active if it's not already active or processing
        if (existingMeeting.status !== "active" && existingMeeting.status !== "processing") {
            await db
                .update(meetings)
                .set({
                    status: "active",
                    startedAt: new Date(),
                })
                .where(eq(meetings.id, existingMeeting.id));
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const call = streamVideo.video.call("default", meetingId);

        console.log("Connecting agent to OpenAI Realtime...");
        try {
            // Uses OpenAI's GA Realtime API. The Beta API shape was removed on
            // 2026-05-12 and the gpt-4o-realtime-preview models were retired on
            // 2026-05-07, so this requires @stream-io/openai-realtime-api >= 0.4.0
            // (GA-native client) and @stream-io/node-sdk >= 0.7.61.
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id,
                model: "gpt-realtime",
            });

            // turn_detection MUST be set explicitly: the GA client's
            // DEFAULT_SESSION_CONFIG uses `turn_detection: null`, which disables
            // voice activity detection — the agent connects but never takes a
            // turn, so it stays silent for the whole call.
            realtimeClient.updateSession({
                instructions: existingAgent.instructions,
                turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 700,
                },
            });

            // Diagnostic: log the OpenAI side of the conversation. speech_started
            // proves audio is reaching OpenAI; response.created proves it is
            // answering. Remove once the agent is confirmed working.
            realtimeClient.on("realtime.event", (e) => {
                const { source, event } = e as {
                    source: string;
                    event: Record<string, unknown>;
                };
                const type = event?.type as string;
                if (type === "error") {
                    console.error("[realtime ERROR]", JSON.stringify(event));
                } else if (
                    [
                        "session.created",
                        "session.updated",
                        "input_audio_buffer.speech_started",
                        "input_audio_buffer.speech_stopped",
                        "response.created",
                        "response.done",
                    ].includes(type)
                ) {
                    console.log(`[realtime:${source}] ${type}`);
                }
            });

            activeAgents.set(meetingId, realtimeClient);
            console.log("Agent connected successfully");
        } catch (error) {
            const errObj = error as Record<string, unknown>;
            console.error("Failed to connect OpenAI Realtime:", JSON.stringify(error, null, 2));
            if (errObj?.error) {
                const inner = errObj.error as Record<string, unknown>;
                console.error("  → Error type:", inner.type, "| Code:", inner.code, "| Message:", inner.message);
            }
        }

    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        // Rely on session_ended to fully disconnect the agent

    } else if (eventType === "call.session_ended") {
        const event = payload as CallEndedEvent; 
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const client = activeAgents.get(meetingId);
        if (client) {
            client.disconnect();
            activeAgents.delete(meetingId);
            console.log("Agent disconnected for meeting:", meetingId);
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));

    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting){
            return NextResponse.json({ error: "Meeting not Found"}, {status:404});
        }
        await inngest.send({
            name:"meetings/processing",
            data:{
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            }
        })
    

    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId));
    }

    return NextResponse.json({ status: "ok" });
}
