import { StreamClient } from "@stream-io/node-sdk";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

async function testRealtime() {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamSecret = process.env.STREAM_VIDEO_SECRET_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (!streamApiKey || !streamSecret || !openAiApiKey) {
    console.error("Missing credentials in .env file");
    return;
  }

  console.log("Stream API Key:", streamApiKey);
  console.log("OpenAI API Key (prefix):", openAiApiKey.substring(0, 15) + "...");

  const streamClient = new StreamClient(streamApiKey, streamSecret);
  const callId = "test_call_id_" + Math.random().toString(36).substring(7);
  const agentUserId = "test_agent_user";

  const token = streamClient.generateCallToken({
    user_id: agentUserId,
    call_cids: [`default:${callId}`],
  });

  const params = new URLSearchParams({
    call_type: "default",
    call_id: callId,
    api_key: streamApiKey,
  });

  const url = `wss://video.stream-io-api.com/video/connect_agent?${params.toString()}`;
  console.log("Connecting to:", url);

  const ws = new WebSocket(url, [], {
    finishRequest: (request) => {
      request.setHeader("Authorization", `Bearer ${openAiApiKey}`);
      request.setHeader("Stream-Authorization", token);
      request.end();
    },
  });

  ws.on("open", () => {
    console.log("WebSocket connection opened successfully!");
  });

  ws.on("message", (data) => {
    console.log("Received message:", data.toString());
  });

  ws.on("error", (err) => {
    console.error("WebSocket error event:", err);
  });

  ws.on("close", (code, reason) => {
    console.log(`WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`);
  });
}

testRealtime();
