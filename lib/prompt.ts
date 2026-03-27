export const buildPrompt = (input: string) => `
Create a marketing brochure.

Return ONLY JSON lines (no explanation).
Each line must be valid JSON.
Return exactly 5 lines, in this exact order, with each type appearing once.
Do not add extra description lines or any additional section types.

Format:
{"type":"title","content":"..."}
{"type":"tagline","content":"..."}
{"type":"features","content":"feature1, feature2, feature3, feature4"}
{"type":"description","content":"..."}
{"type":"cta","content":"...","url":"https://example.com"}

User input:
${input}
`;