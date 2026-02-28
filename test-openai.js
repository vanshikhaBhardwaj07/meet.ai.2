import OpenAI from "openai";

async function testOpenAI() {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello" }],
    });

    console.log("✅ Success! OpenAI responded:");
    console.log(res.choices[0].message);
  } catch (err) {
    console.error("❌ Error calling OpenAI:", err);
  }
}

testOpenAI();
