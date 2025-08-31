import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { age, gender, emotion } = req.body || {};
    if (typeof age === "undefined" || !gender || !emotion) {
      return res.status(400).json({ error: "Missing age/gender/emotion" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `The user is ${gender}, around ${age} years old, and looks ${emotion}. Write a short, friendly, single-sentence message.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = (completion.choices?.[0]?.message?.content || "Hello!").trim();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
