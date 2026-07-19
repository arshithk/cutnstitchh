"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-white">
          CutnStitch
        </Link>

        <nav className="hidden gap-7 text-sm text-gray-300 md:flex">
          <Link href="#about" className="hover:text-yellow-400">
            About
          </Link>

          <Link href="#industries" className="hover:text-yellow-400">
            Industries
          </Link>

          <Link href="#contact" className="hover:text-yellow-400">
            Contact
          </Link>
        </nav>

        <a
          href="#contact"
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          Get a Quote
        </a>
      </div>
    </header>
  );
}