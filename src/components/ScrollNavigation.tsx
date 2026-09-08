"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ScrollNavigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show navigation if page has scrolled or is long enough to scroll
      setIsVisible(documentHeight > windowHeight + 100);
      setIsAtTop(scrollY < 120);
      setIsAtBottom(scrollY + windowHeight >= documentHeight - 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Top Floating Button: Scroll Up */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className={`fixed top-20 sm:top-22 left-1/2 -translate-x-1/2 z-40 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border-custom/80 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent-custom hover:bg-accent-custom hover:text-black focus:outline-none focus:ring-2 focus:ring-accent-custom/50 active:scale-95 ${
          isAtTop
            ? "opacity-0 pointer-events-none -translate-y-3 scale-90"
            : "opacity-90 hover:opacity-100 translate-y-0 scale-100"
        }`}
      >
        <ChevronUp size={20} className="transition-transform duration-200" />
      </button>

      {/* Bottom Floating Button: Scroll Down */}
      <button
        type="button"
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
        className={`fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border-custom/80 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent-custom hover:bg-accent-custom hover:text-black focus:outline-none focus:ring-2 focus:ring-accent-custom/50 active:scale-95 ${
          isAtBottom
            ? "opacity-0 pointer-events-none translate-y-3 scale-90"
            : "opacity-90 hover:opacity-100 translate-y-0 scale-100"
        }`}
      >
        <ChevronDown size={20} className="transition-transform duration-200 animate-bounce" />
      </button>
    </>
  );
}
