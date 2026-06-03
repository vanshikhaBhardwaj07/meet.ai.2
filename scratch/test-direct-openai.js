import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

// Sanity check: print key prefix to verify no stray quotes were loaded
console.log("Key prefix (first 15 chars):", JSON.stringify(openAiApiKey.substring(0, 15)));
console.log("Key length:", openAiApiKey.length);

function testDirect(model) {
  const url = `wss://api.openai.com/v1/realtime?model=${model}`;
  console.log(`\nConnecting directly to OpenAI Realtime for model: ${model}...`);

  const ws = new WebSocket(url, [], {
    finishRequest: (request) => {
      request.setHeader("Authorization", `Bearer ${openAiApiKey}`);
      request.setHeader("OpenAI-Beta", "realtime=v1"); // Required header
      request.end();
    },
  });

  ws.on("open", () => {
    console.log(`[${model}] ✅ WebSocket connection opened successfully!`);
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === "error") {
      console.error(`[${model}] ❌ Error message:`, JSON.stringify(msg, null, 2));
    } else {
      console.log(`[${model}] ✅ Received message type: ${msg.type}`);
    }
    ws.close();
  });

  ws.on("error", (err) => {
    console.error(`[${model}] ❌ WebSocket error:`, err.message);
  });

  ws.on("close", (code, reason) => {
    console.log(`[${model}] Closed. Code: ${code}, Reason: ${reason.toString()}`);
  });
}

testDirect("gpt-4o-realtime-preview-2024-12-17");
setTimeout(() => testDirect("gpt-4o-realtime-preview"), 5000);

