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
You are a senior Angular architect mentoring a mid-level Angular developer.

Give me ONE advanced Angular concept.

VERY IMPORTANT:
- You MUST fill ALL sections below.
- Each section must contain meaningful detailed content.
- Do NOT stop after the first section.
- Keep response between 1500 and 2500 characters.
- Use concise but complete explanations.
- Use Telegram Markdown.
- Wrap code inside triple backticks.
- Do NOT use emojis.

Structure:

*Title*

*Why it matters*
- 3 to 4 bullet points

*Detailed explanation*
- 4 to 6 bullet points explaining internal behavior

*Types (if any)*
- Explain properly or say "Not applicable"

*Step-by-step implementation*
1. Step one explained
2. Step two explained
3. Step three explained

*Code example*
\`\`\`ts
// realistic example
\`\`\`

*Common mistakes*
- 3 real-world mistakes

*Advanced insight*
- Deep architectural tip
`

                    
                  }
                ]
              }
            ],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1500,
                topP: 0.95
              }
              
          })
        }
      );
  
      const data = await response.json();
  
      if (data.error) {
        console.error("Gemini Error:", data.error);
        return "Gemini API error.";
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text 
        || "No response generated today.";
  
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
          text: text,
          parse_mode: "Markdown"
        }),
      }
    );
  
    const data = await response.json();
    console.log("Telegram response:", data);
  }
  

async function main() {
  const concept = await generateAngularConcept();
  await sendMessage(concept);
}

main();

