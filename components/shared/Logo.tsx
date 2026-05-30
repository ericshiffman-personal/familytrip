// Tiny Suitcase brand marks — inlined as React components so Playfair Display
// 800 renders correctly from the page font (external <img> SVGs can't access page fonts).

// ─── Color wordmark (light backgrounds) ──────────────────────────────────────
// Ratio is 600:150 = 4:1. Default height 40px → width 160px.
export function WordmarkLogo({
  className,
  height = 40,
}: {
  className?: string;
  height?: number;
}) {
  const width = height * 4;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 600 150"
      aria-label="Tiny Suitcase"
      className={className}
    >
      <g transform="translate(6,28) scale(0.78)">
        {/* Large suitcase */}
        <rect fill="#1B2E4B" x="14" y="50" width="50" height="46" rx="11" />
        <path
          stroke="#1B2E4B"
          d="M31 51 V44 Q31 38 37 38 H41 Q47 38 47 44 V51"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line stroke="#BFE3F8" x1="19" y1="65" x2="59" y2="65" strokeWidth="2.3" strokeLinecap="round" />
        {/* Small suitcase */}
        <rect fill="#1B2E4B" x="72" y="64" width="34" height="32" rx="8.5" />
        <path
          stroke="#D95F3B"
          d="M83 65 V60 Q83 55.5 87.5 55.5 H90.5 Q95 55.5 95 60 V65"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line stroke="#BFE3F8" x1="77" y1="76" x2="101" y2="76" strokeWidth="2" strokeLinecap="round" />
        {/* Location pin */}
        <path fill="#D95F3B" d="M84 11 C90 11 94.5 15.5 94.5 21 C94.5 28 84 37 84 37 C84 37 73.5 28 73.5 21 C73.5 15.5 78 11 84 11 Z" />
        <circle fill="#FFFFFF" cx="84" cy="21" r="3.2" />
      </g>
      <text
        x="142"
        y="100"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="800"
        fontSize="70"
        letterSpacing="-1"
        fill="#1B2E4B"
      >
        Tiny Suitcase
      </text>
    </svg>
  );
}

// ─── White wordmark (dark / coral backgrounds) ───────────────────────────────
export function WordmarkLogoWhite({
  className,
  height = 40,
}: {
  className?: string;
  height?: number;
}) {
  const width = height * 4;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 600 150"
      aria-label="Tiny Suitcase"
      className={className}
    >
      <g transform="translate(6,28) scale(0.78)">
        {/* Large suitcase */}
        <rect fill="#FFFFFF" x="14" y="50" width="50" height="46" rx="11" />
        <path
          stroke="#FFFFFF"
          d="M31 51 V44 Q31 38 37 38 H41 Q47 38 47 44 V51"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line stroke="#FFFFFF" x1="19" y1="65" x2="59" y2="65" strokeWidth="2.3" strokeLinecap="round" />
        {/* Small suitcase */}
        <rect fill="#FFFFFF" x="72" y="64" width="34" height="32" rx="8.5" />
        <path
          stroke="#FFFFFF"
          d="M83 65 V60 Q83 55.5 87.5 55.5 H90.5 Q95 55.5 95 60 V65"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line stroke="#FFFFFF" x1="77" y1="76" x2="101" y2="76" strokeWidth="2" strokeLinecap="round" />
        {/* Location pin */}
        <path fill="#FFFFFF" d="M84 11 C90 11 94.5 15.5 94.5 21 C94.5 28 84 37 84 37 C84 37 73.5 28 73.5 21 C73.5 15.5 78 11 84 11 Z" />
        <circle fill="#1B2E4B" cx="84" cy="21" r="3.2" />
      </g>
      <text
        x="142"
        y="100"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="800"
        fontSize="70"
        letterSpacing="-1"
        fill="#FFFFFF"
      >
        Tiny Suitcase
      </text>
    </svg>
  );
}

// ─── Standalone icon mark (square, no text) ───────────────────────────────────
// Color version for light backgrounds.
export function IconMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-label="Tiny Suitcase"
      className={className}
    >
      {/* Large suitcase */}
      <rect fill="#1B2E4B" x="14" y="50" width="50" height="46" rx="11" />
      <path
        stroke="#1B2E4B"
        d="M31 51 V44 Q31 38 37 38 H41 Q47 38 47 44 V51"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line stroke="#BFE3F8" x1="19" y1="65" x2="59" y2="65" strokeWidth="2.3" strokeLinecap="round" />
      {/* Small suitcase */}
      <rect fill="#1B2E4B" x="72" y="64" width="34" height="32" rx="8.5" />
      <path
        stroke="#D95F3B"
        d="M83 65 V60 Q83 55.5 87.5 55.5 H90.5 Q95 55.5 95 60 V65"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line stroke="#BFE3F8" x1="77" y1="76" x2="101" y2="76" strokeWidth="2" strokeLinecap="round" />
      {/* Location pin */}
      <path fill="#D95F3B" d="M84 11 C90 11 94.5 15.5 94.5 21 C94.5 28 84 37 84 37 C84 37 73.5 28 73.5 21 C73.5 15.5 78 11 84 11 Z" />
      <circle fill="#FFFFFF" cx="84" cy="21" r="3.2" />
    </svg>
  );
}

// ─── White icon mark (dark / coral backgrounds) ───────────────────────────────
export function IconMarkWhite({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-label="Tiny Suitcase"
      className={className}
    >
      {/* Large suitcase */}
      <rect fill="#FFFFFF" x="14" y="50" width="50" height="46" rx="11" />
      <path
        stroke="#FFFFFF"
        d="M31 51 V44 Q31 38 37 38 H41 Q47 38 47 44 V51"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line stroke="#FFFFFF" x1="19" y1="65" x2="59" y2="65" strokeWidth="2.3" strokeLinecap="round" />
      {/* Small suitcase */}
      <rect fill="#FFFFFF" x="72" y="64" width="34" height="32" rx="8.5" />
      <path
        stroke="#FFFFFF"
        d="M83 65 V60 Q83 55.5 87.5 55.5 H90.5 Q95 55.5 95 60 V65"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line stroke="#FFFFFF" x1="77" y1="76" x2="101" y2="76" strokeWidth="2" strokeLinecap="round" />
      {/* Location pin */}
      <path fill="#FFFFFF" d="M84 11 C90 11 94.5 15.5 94.5 21 C94.5 28 84 37 84 37 C84 37 73.5 28 73.5 21 C73.5 15.5 78 11 84 11 Z" />
      <circle fill="#1B2E4B" cx="84" cy="21" r="3.2" />
    </svg>
  );
}
