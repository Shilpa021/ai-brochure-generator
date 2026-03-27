"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BrochurePreview from "./BrochureViewer";

type Section = {
    type: string;
    content: string;
    url?: string;
};

const SECTION_ORDER = ["title", "tagline", "features", "description", "cta"] as const;
const ALLOWED_TYPES = new Set<string>(SECTION_ORDER);

export default function BrochureForm() {
    const [input, setInput] = useState("");
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(false);

    const toOrderedSections = (byType: Map<string, Section>) =>
        SECTION_ORDER
            .map((type) => byType.get(type))
            .filter((item): item is Section => Boolean(item));

    const handleGenerate = async () => {
        setSections([]);
        setLoading(true);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ prompt: input }),
            });
            if (!res.ok || !res.body) return;

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            const byType = new Map<string, Section>();
            let buffer = "";

            const pushSection = (line: string) => {
                try {
                    const parsed = JSON.parse(line) as Section;
                    if (!parsed?.type || !parsed?.content) return false;
                    if (!ALLOWED_TYPES.has(parsed.type)) return false;
                    byType.set(parsed.type, parsed);
                    return true;
                } catch {
                    return false;
                }
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const parts = buffer.split("\n");
                buffer = parts.pop() || "";

                let changed = false;
                for (const part of parts) {
                    if (pushSection(part)) changed = true;
                }

                if (changed) {
                    setSections(toOrderedSections(byType));
                }
            }

            const trailing = buffer.trim();
            if (trailing && pushSection(trailing)) {
                setSections(toOrderedSections(byType));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Textarea
                    placeholder="Describe your product (e.g. AI SaaS for recruiters)..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[120px] text-base"
                />

                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Generating..." : "Generate Brochure"}
                </Button>
            </div>

            {sections.length > 0 ? <BrochurePreview sections={sections} /> : <></>}

        </div>
    );
}