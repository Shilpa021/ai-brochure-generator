import { buildPrompt } from "@/lib/prompt";

export async function POST(req: Request) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return new Response("Missing GROQ_API_KEY", { status: 500 });
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
        return new Response("Invalid prompt", { status: 400 });
    }

    const finalPrompt = buildPrompt(prompt);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: finalPrompt }],
            stream: true,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        return new Response(errorText || "Upstream generation failed", {
            status: res.status,
        });
    }

    if (!res.body) {
        return new Response("Upstream returned empty body", { status: 502 });
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let buffer = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;

                        if (line.includes("[DONE]")) {
                            controller.close();
                            return;
                        }

                        try {
                            const json = JSON.parse(line.replace("data: ", ""));
                            const content = json.choices?.[0]?.delta?.content;

                            if (content) {
                                controller.enqueue(encoder.encode(content));
                            }
                        } catch {
                            // Ignore malformed SSE chunks and continue streaming.
                        }
                    }
                }
            } catch {
                controller.error(new Error("Streaming failed"));
                return;
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}