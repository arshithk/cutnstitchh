"use client";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = size === selectedSize;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isSelected
                  ? "border-accent-custom bg-accent-custom text-black shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                  : "border-border-custom/70 bg-card/70 text-foreground hover:border-accent-custom/60 hover:text-accent-custom"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
