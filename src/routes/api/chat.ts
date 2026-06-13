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

        const system = `You are Kanishka Mogha's CV assistant. Answer ONLY using the CV content below.
If a question is not related to Kanishka's professional background, skills, experience, or this CV,
politely say you can only answer questions about Kanishka's CV. Keep answers concise, factual, and warm.
Use markdown when helpful (short lists, bold). Never invent facts not present in the CV.

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
