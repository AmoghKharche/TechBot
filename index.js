import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateAngularConcept() {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 1800,
        messages: [
          {
            role: "system",
            content: `
You are a senior Angular architect mentoring a mid-level Angular developer.
You teach with depth, clarity, and practical architecture thinking.
You NEVER give shallow answers.
You ALWAYS complete all requested sections.
            `
          },
          {
            role: "user",
            content: `
Give me ONE advanced Angular concept.

Rules:
- Must fill ALL sections.
- Response between 1500 and 2500 characters.
- Concise but complete.
- Use Telegram Markdown.
- Wrap code inside triple backticks.
- No emojis.

Structure:

*Title*

*Why it matters*
- 3 to 4 bullet points

*Detailed explanation*
- 4 to 6 bullet points

*Types (if any)*

*Step-by-step implementation*
1. Step one
2. Step two
3. Step three

*Code example*
\`\`\`ts
// realistic example
\`\`\`

*Common mistakes*
- 3 mistakes

*Advanced insight*
- Deep architectural tip
            `
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return "OpenAI API error.";
    }

    return data.choices?.[0]?.message?.content || "No response generated today.";
  } catch (err) {
    console.error("Generation error:", err);
    return "Failed to generate Angular concept today.";
  }
}

async function sendMessage(text) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown",
          disable_web_page_preview: true
        })
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram Error:", data);
    } else {
      console.log("Message sent successfully.");
    }

  } catch (err) {
    console.error("Telegram send error:", err);
  }
}

async function main() {
  const concept = await generateAngularConcept();
  await sendMessage(concept);
}

main();
