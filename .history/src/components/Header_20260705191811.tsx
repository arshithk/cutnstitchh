"use client";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black px-8 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-3xl font-bold text-white">CutnStitch</h1>

        <div className="flex items-center gap-8 text-base text-white">
          <a href="#about" className="transition hover:text-yellow-400">
            About
          </a>

          <a href="#industries" className="transition hover:text-yellow-400">
            Industries
          </a>

          <a href="#contact" className="transition hover:text-yellow-400">
            Contact
          </a>

          <a
            href="#contact"
            className="ml-4 rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}