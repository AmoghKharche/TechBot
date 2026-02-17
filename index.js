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
                    You are a senior Angular architect teaching a mid-level Angular developer.
                    
                    Give me ONE advanced Angular concept.
                    
                    IMPORTANT RULES:
                    - Keep total response under 3000 characters.
                    - Use SHORT paragraphs.
                    - Use bullet points instead of long blocks.
                    - Use Telegram Markdown formatting.
                    - Wrap code examples inside triple backticks.
                    - Do NOT use emojis.
                    - Avoid basic topics.
                    
                    Structure:
                    
                    *Title*
                    
                    *Why it matters*
                    
                    *Detailed explanation*
                    - short points
                    
                    *Types (if any)*
                    
                    *Step-by-step implementation*
                    1.
                    2.
                    3.
                    
                    *Code example*
                    \`\`\`ts
                    // example
                    \`\`\`
                    
                    *Common mistakes*
                    
                    *Advanced insight*
                    `
                    
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200
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

