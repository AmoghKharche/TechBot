const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateAngularConcept() {
    try {
      const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
  Avoid basic topics.
  Use clean formatting.
                    `
                  }
                ]
              }
            ]
          })
        }
      );
  
      const data = await response.json();
  
      if (data.error) {
        console.error("Gemini Error:", data.error);
        return "Gemini API error. Check logs.";
      }
  
      if (!data.candidates?.length) {
        return "No response generated today.";
      }
  
      return data.candidates[0].content.parts[0].text;
  
    } catch (err) {
      return "Failed to generate Angular concept today.";
    }
  }
  
  

  async function sendMessage(text) {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text.substring(0, 4000) // Telegram limit
        }),
      }
    );
  
    const data = await response.json();
  }
  

async function main() {
  const concept = await generateAngularConcept();
  await sendMessage(concept);
}

main();

