export interface Brochure {
    title: string;
    tagline: string;
    sections: {
        heading: string;
        content: string;
    }[];
    cta: string;
}