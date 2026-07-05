"use client";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          CutnStitch
        </h1>

        <div className="flex flex-wrap items-center justify-end gap-5 text-sm text-white sm:gap-8 sm:text-base">
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
            className="rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:bg-yellow-300 sm:px-6"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}