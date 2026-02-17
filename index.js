const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateAngularConcept() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
Give me ONE advanced Angular concept.

Format:
Title
Why it matters
Detailed explanation
Types (if any)
Step-by-step implementation
Code example
Common mistakes
Advanced insight

Keep it under 3500 characters.
No emojis.
Use clean formatting for Telegram.
Avoid very basic topics.
                `
              }
            ]
          }
        ]
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function sendMessage(text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    }),
  });
}

async function main() {
  const concept = await generateAngularConcept();
  await sendMessage(concept);
}

main();
