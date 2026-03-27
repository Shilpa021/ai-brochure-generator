"use client";

import { useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SectionRenderer } from "./SectionRenderer";
import { generateBrochurePDF } from "@/lib/pdfUtils";

type Section = {
    type: string;
    content: string;
    url?: string;
};

export default function BrochurePreview({ sections }: { sections: Section[] }) {
    const ref = useRef<HTMLDivElement>(null);

    const hasSections = useMemo(() => sections.length > 0, [sections]);

    const handlePremiumDownload = useCallback(() => {
        generateBrochurePDF(sections);
    }, [sections]);

    return (
        <div className="space-y-6">
            <div
                ref={ref}
                className="bg-slate-900/80 text-slate-100 p-6 rounded-xl space-y-6 shadow-lg ring-1 ring-slate-700"
            >
                {sections.map((sec, i) => (
                    <SectionRenderer key={i} section={sec} />
                ))}
            </div>

            {hasSections && (
                <div className="text-center hover:text-blue-400 cursor-pointer text-3xl">
                    <Button onClick={handlePremiumDownload}>
                        Download Premium PDF
                    </Button>
                </div>
            )}
        </div>
    );
}