import clsx from "clsx";

const digitSegments: Record<string, string[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"]
};

const segmentRects = {
  a: { x: 5, y: 2, width: 14, height: 4 },
  b: { x: 19, y: 6, width: 4, height: 13 },
  c: { x: 19, y: 23, width: 4, height: 13 },
  d: { x: 5, y: 36, width: 14, height: 4 },
  e: { x: 1, y: 23, width: 4, height: 13 },
  f: { x: 1, y: 6, width: 4, height: 13 },
  g: { x: 5, y: 20, width: 14, height: 4 }
};

function SevenSegmentDigit({ value }: { value: string }) {
  const active = new Set(digitSegments[value] ?? []);

  return (
    <svg viewBox="0 0 24 42" className="h-4 w-2.5 shrink-0 md:h-5 md:w-3" aria-hidden="true">
      {(Object.keys(segmentRects) as Array<keyof typeof segmentRects>).map((segment) => {
        const rect = segmentRects[segment];

        return (
          <rect
            key={segment}
            {...rect}
            rx="2"
            className={clsx("fill-current transition-opacity", active.has(segment) ? "opacity-100" : "opacity-10")}
          />
        );
      })}
    </svg>
  );
}

function SevenSegmentColon() {
  return (
    <svg viewBox="0 0 8 42" className="h-4 w-1 shrink-0 md:h-5 md:w-1.5" aria-hidden="true">
      <circle cx="4" cy="15" r="2" className="fill-current" />
      <circle cx="4" cy="28" r="2" className="fill-current" />
    </svg>
  );
}

export function SevenSegmentTime({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center gap-px rounded-[4px] border border-accent/35 bg-[#061325]/72 px-1.5 py-0.5 text-accent shadow-[inset_0_0_18px_rgba(244,178,62,0.08),0_0_18px_rgba(244,178,62,0.12)] max-[380px]:scale-90 max-[380px]:origin-right",
        className
      )}
      dir="ltr"
      aria-label={value}
    >
      {Array.from(value).map((character, index) =>
        character === ":" ? <SevenSegmentColon key={`${character}-${index}`} /> : <SevenSegmentDigit key={`${character}-${index}`} value={character} />
      )}
    </span>
  );
}
