import jsPDF from "jspdf";

type Section = {
    type: string;
    content: string;
    url?: string;
};

type RGB = [number, number, number];

const BRAND: {
    name: string;
    primary: RGB;
    accent: RGB;
    text: RGB;
    light: RGB;
} = {
    name: "An AI generated PDF by SR",
    primary: [15, 23, 42],
    accent: [59, 130, 246],
    text: [33, 37, 41],
    light: [240, 244, 248],
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT_LIMIT = 270;
const MARGIN_X = 20;
const CONTENT_START_Y = 30;
const CTA_X = 50;
const CTA_WIDTH = 110;
const CTA_HEIGHT = 14;

const normalizeUrl = (value?: string) => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
};

export const generateBrochurePDF = (sections: Section[]) => {
    const doc = new jsPDF("p", "mm", "a4");
    const contentWidth = PAGE_WIDTH - MARGIN_X * 2;
    let y = CONTENT_START_Y;

    const drawHeader = () => {
        doc.setFillColor(...BRAND.primary);
        doc.rect(0, 0, PAGE_WIDTH, 20, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(BRAND.name, 25, 13);

        doc.setTextColor(...BRAND.text);
    };

    const setTextStyle = (color: RGB, size: number, bold = false) => {
        doc.setTextColor(...color);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
    };

    const addText = (text: string, color: RGB, size: number, bold = false) => {
        setTextStyle(color, size, bold);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, MARGIN_X, y);

        y += lines.length * (size * 0.5);
    };

    drawHeader();

    for (const sec of sections) {
        const content = sec.content?.trim();
        if (!content) continue;

        switch (sec.type) {
            case "title":
                addText(content, BRAND.primary, 26, true);
                y += 6;
                break;

            case "tagline":
                addText(content, BRAND.accent, 14);
                y += 8;
                break;

            case "description":
                addText(content, BRAND.text, 12);
                y += 8;
                break;

            case "features":
                setTextStyle(BRAND.text, 14, true);
                doc.text("Key Features", MARGIN_X, y);
                y += 6;

                setTextStyle(BRAND.text, 12);
                content.split(",").forEach((f) => {
                    doc.text(`• ${f.trim()}`, MARGIN_X + 4, y);
                    y += 6;
                });

                y += 6;
                break;

            case "cta":
                y += 10;
                const ctaUrl = normalizeUrl(sec.url);

                // CTA button
                doc.setFillColor(...BRAND.accent);
                doc.roundedRect(CTA_X, y - 6, CTA_WIDTH, CTA_HEIGHT, 4, 4, "F");

                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);

                doc.text(content, PAGE_WIDTH / 2, y + 2, {
                    align: "center",
                });

                if (ctaUrl) {
                    // Make the full CTA button clickable in the PDF.
                    doc.link(CTA_X, y - 6, CTA_WIDTH, CTA_HEIGHT, { url: ctaUrl });
                }

                doc.setTextColor(...BRAND.text);
                break;

            default:
                continue;
        }

        doc.setDrawColor(...BRAND.light);
        y += 8;

        if (y > PAGE_HEIGHT_LIMIT) {
            doc.addPage();
            drawHeader();
            y = CONTENT_START_Y;
        }
    }

    doc.save("branded-brochure.pdf");
};