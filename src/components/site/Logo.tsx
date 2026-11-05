export function ZordanMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path d="M24 3 44 13v22L24 45 4 35V13Z" stroke="currentColor" strokeWidth="1.2" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M8 ${17 + i * 3.6} 24 ${25 + i * 3.6} 40 ${17 + i * 3.6}`} stroke="currentColor" strokeWidth="1.6" />
      ))}
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <ZordanMark className="h-9 w-9" />
      <span className="leading-none">
        <span className="block font-sans text-lg font-semibold tracking-[0.18em]">ZORDAN</span>
        <span className="label-mono block text-[0.55rem] opacity-70">Engenharia</span>
      </span>
    </span>
  );
}
