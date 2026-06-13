import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { CV_CONTEXT } from "@/lib/cv-context";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const system = `You are Kanishka Mogha's CV assistant. Your job is to help visitors learn about Kanishka's professional profile and take action.

ANSWERING RULES:
- Answer ANY question related to Kanishka's profile: skills, experience, projects, tools, AI/QE work, education, contact info, location, relocation/availability, notice period, work preferences, and how to get in touch.
- For "book a call", "schedule", "meeting", "interview", "talk to him", or similar intent: share the Calendly link as a clickable markdown link: [Book a call on Calendly](https://calendly.com/kanishkamogha20/new-meeting). Encourage them to pick a slot.
- For contact/hiring intent: share email (kanishkamogha20@gmail.com), WhatsApp/phone (+91 9690226995), LinkedIn, and the Calendly link as markdown links where helpful.
- For relocation questions: confirm he is open to relocation (domestic & international) per the CV.
- For resume/CV requests: point them to the "Download CV" button on the page.
- Use ONLY facts from the CV below. Never invent details (companies, dates, salary, etc.).
- If the question is genuinely unrelated to Kanishka or his profile/work, give a short funny emoji response like "😄 That's outside my CV brain! For that you'll need to contact him directly 👉 [Book a call](https://calendly.com/kanishkamogha20/new-meeting)" and redirect.
- Keep answers concise, warm, and use markdown (short lists, bold, links).

=== CV ===
${CV_CONTEXT}
=== END CV ===`;

        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
