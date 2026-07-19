"use client";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">CutnStitch</h1>

        <div className="flex items-center gap-3 text-sm text-white">
          <a href="#about">About</a>
          <a href="#industries">Industries</a>
          <a href="#contact">Contact</a>

          <a
            href="#contact"
            className="rounded-lg bg-yellow-400 px-3 py-2 font-semibold text-black"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}