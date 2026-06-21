import clsx from "clsx";

export function BrandLogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={clsx("shrink-0", className)}
      viewBox="0 0 64 64"
      role="img"
      aria-label="نشان خوبروز"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="14" fill="#07172B" />
      <circle cx="32" cy="32" r="22" stroke="#F4B23E" strokeWidth="3" />
      <circle cx="32" cy="32" r="15" stroke="#D7E7F4" strokeWidth="2" opacity="0.55" />
      <path d="M24 40l8-22 8 22-8-5-8 5Z" fill="#F4B23E" />
      <path d="M18 45h28" stroke="#D7E7F4" strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      <circle cx="32" cy="32" r="3" fill="#07172B" />
    </svg>
  );
}
