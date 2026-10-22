/**
 * Minimal line-art harvest still life (pumpkin, wheat and leaves) used in the hero.
 * Pure SVG — no external image, so it can never break after deployment.
 */
export function HarvestIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Illustration of a pumpkin with wheat and autumn leaves"
    >
      {/* soft backdrop */}
      <circle cx="210" cy="210" r="190" fill="#F1E7D8" />
      <circle cx="210" cy="210" r="190" fill="none" stroke="#E5D7C5" strokeWidth="2" />

      {/* wheat stalks */}
      <g stroke="#777A50" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M128 300 C 120 230, 118 180, 122 120" />
        <path d="M292 300 C 300 230, 304 190, 300 132" />
      </g>
      <g fill="#777A50" opacity="0.85">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`l${i}`}>
            <ellipse cx={116} cy={132 + i * 22} rx="6" ry="12" transform={`rotate(-28 116 ${132 + i * 22})`} />
            <ellipse cx={130} cy={130 + i * 22} rx="6" ry="12" transform={`rotate(28 130 ${130 + i * 22})`} />
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`r${i}`}>
            <ellipse cx={294} cy={144 + i * 22} rx="6" ry="12" transform={`rotate(-28 294 ${144 + i * 22})`} />
            <ellipse cx={308} cy={142 + i * 22} rx="6" ry="12" transform={`rotate(28 308 ${142 + i * 22})`} />
          </g>
        ))}
      </g>

      {/* pumpkin */}
      <g>
        <ellipse cx="210" cy="276" rx="104" ry="72" fill="#C86B32" />
        <ellipse cx="168" cy="276" rx="52" ry="70" fill="#D27A42" />
        <ellipse cx="252" cy="276" rx="52" ry="70" fill="#D27A42" />
        <ellipse cx="210" cy="276" rx="40" ry="72" fill="#C86B32" />
        <g fill="none" stroke="#A4521F" strokeWidth="2.5" opacity="0.6">
          <path d="M170 210 C 150 240, 150 312, 170 344" />
          <path d="M250 210 C 270 240, 270 312, 250 344" />
          <path d="M210 205 L 210 348" />
        </g>
        {/* stem */}
        <path d="M204 210 C 204 192, 210 180, 222 172 L 228 180 C 218 188, 216 198, 216 210 Z" fill="#5C5F3B" />
        {/* vine curl */}
        <path d="M222 190 C 240 176, 262 186, 254 202 C 248 212, 236 204, 244 198" fill="none" stroke="#777A50" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* leaves */}
      <path
        d="M96 324 C 96 292, 120 272, 156 270 C 154 304, 132 324, 96 324 Z"
        fill="#777A50"
      />
      <path d="M96 324 L 146 280" stroke="#F1E7D8" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M324 328 C 322 296, 298 278, 262 278 C 266 310, 288 328, 324 328 Z"
        fill="#A4521F"
      />
      <path d="M324 328 L 272 286" stroke="#F1E7D8" strokeWidth="2" strokeLinecap="round" />

      {/* ground line */}
      <path d="M90 352 H 330" stroke="#E5D7C5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
