import clsx from "clsx";

const landPaths = [
  "M150 205l24-28 34-13 43 10 33 24 24 4 28 24-8 31-31 14-31-6-26 23-43 8-29 30-41-3-24-28-27-43 7-36Z",
  "M286 346l34 16 24 33-4 43-25 33-9 43 15 45-21 41-34-8-18-45 9-42 15-36-4-35-22-34 5-32 35-26Z",
  "M492 184l40-23 52-7 40 15 36 30 50 8 34-12 49 12 45 30 34 46-10 45-44 32-58 8-54-9-46 11-43 30-47-2-32-35-18-43-38-25-33-39-7-70Z",
  "M650 398l38 25 23 44-4 49-24 47-10 48-23 37-34-9-12-45-24-39-2-49 20-45 27-33 25-30Z",
  "M790 234l58-26 75-5 62 17 56 39 61 9 44-12 48 19 28 42-4 45-43 34-68 15-66-7-54 13-55 33-58-5-40-36-32-53-16-52-32-60Z",
  "M1007 455l46-13 50 17 31 38 4 52-24 44-37 30-14 45-35 17-28-22-1-48-22-38-13-44 12-47 31-31Z",
  "M1128 142l34-9 32 14 13 30-17 27-36 5-27-20-8-26 9-21Z"
];

export function WorldMapPattern({ className }: { className?: string }) {
  return (
    <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg
        className="absolute left-1/2 top-1/2 h-[138%] min-h-[480px] w-[1320px] max-w-none -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1320 680"
        fill="none"
      >
        <defs>
          <pattern id="khoobrooz-atlas-dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <filter id="khoobrooz-soft-map" x="-6%" y="-6%" width="112%" height="112%">
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>

        <g className="stroke-current" strokeWidth="0.8" opacity="0.13">
          {[160, 280, 400, 520, 640, 760, 880, 1000, 1120].map((x) => (
            <path key={`lng-${x}`} d={`M${x} 76C${x - 26} 236 ${x - 24} 452 ${x} 620`} />
          ))}
          {[140, 230, 320, 410, 500, 590].map((y) => (
            <path key={`lat-${y}`} d={`M80 ${y}C300 ${y - 34} 520 ${y + 28} 730 ${y}C900 ${y - 23} 1080 ${y + 12} 1240 ${y}`} />
          ))}
        </g>

        <g className="fill-current" opacity="0.13" filter="url(#khoobrooz-soft-map)">
          {landPaths.map((path) => (
            <path key={`fill-${path}`} d={path} />
          ))}
        </g>

        <g fill="url(#khoobrooz-atlas-dots)" opacity="0.5" filter="url(#khoobrooz-soft-map)">
          {landPaths.map((path) => (
            <path key={`dots-${path}`} d={path} />
          ))}
        </g>

        <g className="stroke-current" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" opacity="0.48">
          {landPaths.map((path) => (
            <path key={`outline-${path}`} d={path} />
          ))}
        </g>

        <g className="stroke-current" strokeWidth="1.1" opacity="0.18">
          <path d="M96 242c210-58 430-62 660-6 158 38 318 34 480-14" />
          <path d="M100 474c202-48 406-45 612 10 155 42 310 37 466-13" />
          <path d="M176 126c156 42 320 45 492 9 156-32 314-20 475 35" />
        </g>
      </svg>
    </div>
  );
}
