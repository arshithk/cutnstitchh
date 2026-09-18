"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-3 text-white">Something went wrong!</h2>
      <p className="text-sm text-neutral-400 mb-6 max-w-md">
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#c49f27] transition shadow-md"
      >
        Try again
      </button>
    </div>
  );
}
