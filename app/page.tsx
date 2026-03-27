import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-linear-to-b from-slate-950 to-slate-900">
      <div className="lg-p-80 sm:p-20">
        <h1 className="text-5xl font-bold mb-4">
          AI Brochure Generator
        </h1>

        <p className="text-lg text-slate-300 mb-6 max-w-xl">
          Instantly generate beautiful marketing brochures using AI.
          Streamed in real-time and exportable as premium PDFs.
        </p>

        <Link
          href="/brochure"
          className="bg-slate-100 text-slate-900 px-6 py-3 rounded-lg hover:bg-white hover:text-black transition hover:py-4 hover:px-7"
        >
          Try It Now
        </Link>
      </div>

      <footer className="text-center text-sm text-gray-500 hover:text-white">
        <Link
          href={"https://shilparana-portfolio.vercel.app/"}>
            © {new Date().getFullYear()} Shilpa Rana
        </Link>
      </footer>
    </main>
  );
}