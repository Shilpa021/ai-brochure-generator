import BrochureForm from "@/components/BrochureForm";

export default function Page() {
    return (
        <main className="min-h-screen bg-linear-to-b from-slate-950 to-slate-900">
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-4xl font-bold mb-2 text-center">
                    AI Brochure Generator
                </h1>

                <p className="text-center text-slate-300 mb-8">
                    Generate stunning marketing content in seconds
                </p>

                <BrochureForm />
            </div>
        </main>
    );
}