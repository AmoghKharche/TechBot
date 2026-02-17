import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendMessage(text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "Markdown"
    }),
  });
}

function buildDailyMessage() {
  const today = new Date().toDateString();

  return `
🚀 *Daily Tech Growth* (${today})

🅰️ Angular Focus:
Learn how Change Detection works internally.

🧠 Backend Concept:
Deep dive into Event Loop in Node.js.

📐 System Design:
Understand Load Balancer vs Reverse Proxy.

💻 Mini Task:
Create a custom Angular directive today.

🔥 Stay consistent. Compound knowledge daily.
  `;
}

async function main() {
  const message = buildDailyMessage();
  await sendMessage(message);
}

main();
