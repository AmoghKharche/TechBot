import fetch from "node-fetch";

import fs from "fs";

const TOPICS = [
  "Change Detection Internals",
  "Zone.js and NgZone Deep Dive",
  "OnPush Strategy Under the Hood",
  "Manual Change Detection with ChangeDetectorRef",
  "Dependency Injection Hierarchy",
  "Tree-shakable Providers",
  "Standalone Components Architecture",
  "Environment Injectors",
  "Custom Injection Tokens",
  "Multi Providers in DI",
  "Signals Internal Mechanics",
  "Signals vs RxJS Architecture",
  "Zone-less Angular Setup",
  "Dynamic Component Creation",
  "ViewContainerRef Advanced Usage",
  "Content Projection Internals",
  "ng-content vs ng-template",
  "Structural Directives Internals",
  "Building Custom Structural Directive",
  "HostBinding and HostListener Deep Dive",
  "ControlValueAccessor Advanced Patterns",
  "Reactive Forms Internal Architecture",
  "Async Validators Deep Dive",
  "Router Lifecycle Events",
  "Custom Route Reuse Strategy",
  "Preloading Strategies",
  "Lazy Loading Architecture",
  "Micro Frontend with Angular",
  "Module Federation Setup",
  "Angular Rendering Engine (Ivy)",
  "How Ivy Compiles Components",
  "Change Detection Algorithm Flow",
  "Angular Compiler Pipeline",
  "Standalone Routing APIs",
  "Functional Route Guards",
  "Functional Interceptors",
  "HTTP Interceptor Chaining",
  "Global Error Handling Strategy",
  "ApplicationRef and Bootstrap Process",
  "Zone Stability and Macro/Microtasks",
  "Performance Profiling Angular Apps",
  "Memoization in Angular",
  "Pure vs Impure Pipes",
  "Custom Pipe Optimization",
  "Angular SSR Architecture",
  "Hydration in Angular",
  "TransferState Usage",
  "Signals + Forms Integration",
  "DestroyRef and takeUntilDestroyed",
  "RxJS Interop Utilities",
  "Advanced RxJS Flattening Strategies",
  "Cold vs Hot Observables in Angular",
  "shareReplay Pitfalls",
  "Smart vs Dumb Component Pattern",
  "State Management Without NgRx",
  "Component Store Pattern",
  "NgRx Entity Deep Dive",
  "Optimizing Large Lists (CDK Virtual Scroll)",
  "CDK Overlay Internals",
  "Portals in Angular CDK",
  "Custom Angular Schematics",
  "Angular Builders",
  "Custom Web Components with Angular",
  "ElementRef vs Renderer2",
  "Security: DomSanitizer",
  "XSS Prevention Strategy",
  "Change Detection Detach/Reattach",
  "Manual Bootstrap Without NgModule",
  "PlatformRef Deep Dive",
  "Custom Preloading Strategy",
  "Advanced Template Type Checking",
  "Directive Composition API",
  "Standalone Pipes",
  "Standalone Directives",
  "Feature-based Folder Architecture",
  "Domain-driven Angular Architecture",
  "Nx Monorepo Architecture",
  "Module Boundary Enforcement",
  "Angular Animations Internals",
  "Route Data Resolvers",
  "Component Lifecycle Execution Order",
  "QueryList Internals",
  "ViewChild vs ContentChild Deep Dive",
  "Injector.create Advanced Usage",
  "Dynamic Forms Engine Architecture",
  "Optimistic UI Updates",
  "Progressive Enhancement Strategy",
  "Web Workers in Angular",
  "IndexedDB Integration Strategy",
  "Service Worker Internals",
  "PWA Architecture in Angular",
  "Angular DevTools Performance Insights",
  "Memory Leak Detection Strategy",
  "Signals Computed and Effects Deep Dive",
  "Input Signals API",
  "Zone-free Future of Angular",
  "Angular Roadmap Architecture Trends"
];


const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const topic = getNextTopic();

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
Teach me the following advanced Angular concept:

"${getNextTopic()}"

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

function getNextTopic() {
  const file = "./topicIndex.json";
  let index = 0;

  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file));
    index = data.index;
  }

  const topic = TOPICS[index % TOPICS.length];

  fs.writeFileSync(file, JSON.stringify({ index: index + 1 }));

  return topic;
}


async function main() {
  const concept = await generateAngularConcept();
  await sendMessage(concept);
}

main();
