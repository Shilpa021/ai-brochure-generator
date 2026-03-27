import { memo, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Section = {
    type: "title" | "tagline" | "features" | "description" | "cta" | string;
    content: string;
    url?: string;
};

const resolveCtaUrl = (value?: string) => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
};

export const SectionRenderer = memo(function SectionRenderer({ section }: { section: Section }) {
    const featureList = useMemo(
        () =>
            section.type === "features"
                ? section.content
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean)
                : [],
        [section.type, section.content]
    );

    const ctaUrl = useMemo(
        () => (section.type === "cta" ? resolveCtaUrl(section.url) : ""),
        [section.type, section.url]
    );

    const handleCtaClick = useCallback(() => {
        if (!ctaUrl) return;
        window.open(ctaUrl, "_blank", "noopener,noreferrer");
    }, [ctaUrl]);

    switch (section.type) {
        case "title":
            return (
                <Card className="p-6 shadow-md rounded-2xl">
                    <CardContent>
                        <h1 className="text-4xl font-bold tracking-tight">
                            {section.content}
                        </h1>
                    </CardContent>
                </Card>
            );

        case "tagline":
            return (
                <p className="text-lg text-muted-foreground text-center">
                    {section.content}
                </p>
            );

        case "features":
            return (
                <div className="grid  gap-4 sm:grid-cols-2">
                    {featureList.map((feature) => (
                        <Card
                            key={feature}
                            className="p-4 rounded-xl hover:shadow-lg transition"
                        >
                            <CardContent className="flex items-center justify-between">
                                <span>{feature}</span>
                                <Badge>Feature</Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );

        case "description":
            return (
                <Card className="p-5 rounded-xl">
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {section.content}
                        </p>
                    </CardContent>
                </Card>
            );

        case "cta":
            return (
                <div className="text-center hover:text-blue-400 cursor-pointer p-0 mx-0 my-auto">
                    <Button
                        size="lg"
                        className="rounded-full px-8"
                        onClick={handleCtaClick}
                        disabled={!ctaUrl}
                    >
                        {section.content}
                    </Button>
                </div>
            );

        default:
            return null;
    }
});