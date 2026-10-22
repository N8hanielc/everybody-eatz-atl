import type { IllustrationKind } from "@/config/site";

/**
 * Consistent, brand-neutral product illustrations used whenever a real
 * product photo hasn't been added. They never show retailer or brand marks.
 */
export function GroceryIllustration({ kind, label }: { kind: IllustrationKind; label: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`Illustration: ${label}`}>
      <circle cx="100" cy="104" r="84" fill="#F8F3EA" />
      <ellipse cx="100" cy="176" rx="56" ry="7" fill="#2C1A12" opacity="0.08" />
      {kind === "can" && <Can />}
      {kind === "box" && <Box />}
      {kind === "pouch" && <Pouch />}
      {kind === "packet" && <Packet />}
    </svg>
  );
}

function Can() {
  return (
    <g>
      <rect x="62" y="52" width="76" height="120" rx="10" fill="#E5D7C5" />
      <ellipse cx="100" cy="54" rx="38" ry="9" fill="#F1E7D8" stroke="#D5C3AC" strokeWidth="2" />
      <rect x="62" y="80" width="76" height="62" fill="#777A50" />
      <rect x="62" y="80" width="76" height="4" fill="#5C5F3B" />
      <rect x="62" y="138" width="76" height="4" fill="#5C5F3B" />
      {/* green beans */}
      <g stroke="#F8F3EA" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M78 122 C 88 100, 100 98, 110 96" />
        <path d="M86 128 C 98 110, 110 106, 122 104" />
      </g>
      <path d="M64 168 H 136" stroke="#D5C3AC" strokeWidth="2" />
    </g>
  );
}

function Box() {
  return (
    <g>
      <rect x="58" y="44" width="84" height="126" rx="6" fill="#C86B32" />
      <rect x="58" y="44" width="14" height="126" rx="4" fill="#A4521F" opacity="0.5" />
      <rect x="76" y="62" width="56" height="16" rx="8" fill="#F8F3EA" />
      <rect x="76" y="86" width="56" height="54" rx="8" fill="#F1E7D8" />
      {/* stuffing crumbs */}
      <g fill="#A4521F">
        <rect x="86" y="100" width="9" height="9" rx="2" transform="rotate(12 90 104)" />
        <rect x="100" y="110" width="10" height="10" rx="2" transform="rotate(-8 105 115)" />
        <rect x="112" y="96" width="8" height="8" rx="2" transform="rotate(20 116 100)" />
        <rect x="92" y="120" width="8" height="8" rx="2" />
      </g>
      <g fill="#777A50">
        <circle cx="116" cy="124" r="3" />
        <circle cx="84" cy="114" r="2.5" />
      </g>
      <rect x="76" y="148" width="40" height="6" rx="3" fill="#F8F3EA" opacity="0.8" />
    </g>
  );
}

function Pouch() {
  return (
    <g>
      <path d="M62 56 H 138 L 144 164 C 144 170, 140 172, 134 172 H 66 C 60 172, 56 170, 56 164 Z" fill="#F1E7D8" stroke="#D5C3AC" strokeWidth="2" />
      <rect x="62" y="50" width="76" height="12" rx="3" fill="#E5D7C5" />
      <path d="M66 58 H 134" stroke="#C86B32" strokeWidth="2" strokeDasharray="4 4" />
      {/* bowl of mashed potatoes */}
      <path d="M72 116 H 128 C 128 136, 116 146, 100 146 C 84 146, 72 136, 72 116 Z" fill="#C86B32" />
      <path d="M76 116 C 78 100, 92 94, 100 98 C 108 92, 124 100, 124 116 Z" fill="#FFFFFF" />
      <rect x="96" y="104" width="10" height="7" rx="2" fill="#E9B949" />
      <rect x="80" y="76" width="40" height="8" rx="4" fill="#3A2115" opacity="0.75" />
    </g>
  );
}

function Packet() {
  return (
    <g>
      <path d="M66 46 H 134 V 172 H 66 Z" fill="#3A2115" />
      <path d="M66 46 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6 l 6 6 Z" fill="#3A2115" />
      <rect x="76" y="62" width="48" height="10" rx="5" fill="#E5D7C5" />
      {/* gravy boat */}
      <path d="M78 122 H 120 C 120 136, 110 142, 100 142 C 88 142, 78 136, 78 122 Z" fill="#F8F3EA" />
      <path d="M120 124 C 128 120, 132 114, 134 110" stroke="#F8F3EA" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M80 122 C 86 116, 112 116, 118 122 Z" fill="#A4521F" />
      <path d="M100 96 C 96 102, 104 106, 100 112" stroke="#E5D7C5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <rect x="76" y="152" width="32" height="6" rx="3" fill="#C86B32" />
    </g>
  );
}
