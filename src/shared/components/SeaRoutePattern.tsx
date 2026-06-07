import clsx from "clsx";

const routes = [
  "M84 260C222 174 376 146 532 176C664 202 748 272 878 288C1038 308 1152 226 1288 132",
  "M42 420C188 340 344 318 514 354C682 390 798 476 972 468C1112 462 1202 402 1324 318",
  "M184 116C324 166 454 220 590 214C742 208 850 132 1000 118C1114 108 1206 136 1292 188",
  "M118 548C292 486 444 484 596 534C716 574 824 626 980 612C1114 600 1214 544 1328 490"
];

const ports = [
  { x: 182, y: 224 },
  { x: 370, y: 158 },
  { x: 858, y: 288 },
  { x: 1110, y: 232 },
  { x: 704, y: 386 },
  { x: 1012, y: 466 }
];

export function SeaRoutePattern({ className }: { className?: string }) {
  return (
    <div className={clsx("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg
        className="absolute left-1/2 top-1/2 h-[132%] min-h-[430px] w-[1360px] max-w-none -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1360 680"
        fill="none"
      >
        <defs>
          <pattern id="khoobrooz-sea-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" className="stroke-current" strokeWidth="0.8" opacity="0.18" />
          </pattern>
          <filter id="khoobrooz-route-glow" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1360" height="680" fill="url(#khoobrooz-sea-grid)" opacity="0.22" />

        <g className="stroke-current" strokeLinecap="round" strokeLinejoin="round" opacity="0.16">
          <path d="M-20 168C180 96 360 96 540 154C716 210 870 232 1044 170C1168 126 1266 126 1380 174" strokeWidth="1.2" />
          <path d="M-28 526C178 462 366 458 560 512C738 560 914 578 1100 518C1214 482 1292 474 1388 500" strokeWidth="1.2" />
          <path d="M102 84C242 276 246 458 150 664" strokeWidth="0.9" />
          <path d="M1230 52C1112 212 1098 408 1224 660" strokeWidth="0.9" />
        </g>

        <g filter="url(#khoobrooz-route-glow)">
          {routes.map((route, index) => (
            <path
              key={route}
              d={route}
              className={index % 2 === 0 ? "stroke-current" : "stroke-[#f4b23e]"}
              strokeWidth={index % 2 === 0 ? 1.8 : 1.2}
              strokeLinecap="round"
              strokeDasharray={index % 2 === 0 ? "12 16" : "2 12"}
              opacity={index % 2 === 0 ? 0.34 : 0.3}
            />
          ))}
        </g>

        <g>
          {ports.map((port) => (
            <g key={`${port.x}-${port.y}`} transform={`translate(${port.x} ${port.y})`}>
              <circle r="11" fill="#f4b23e" opacity="0.1" />
              <circle r="3.5" className="fill-current" opacity="0.54" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
