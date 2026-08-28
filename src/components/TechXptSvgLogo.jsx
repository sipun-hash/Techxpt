import React from 'react';

/**
 * Exact Vector SVG paths matching the TECHXPT brand identity provided.
 */
export default function TechXptSvgLogo({ 
  width = 240, 
  height = 115, 
  className = "", 
  animated = false,
  showTagline = true,
  style = {}
}) {
  return (
    <div 
      className={`techxpt-svg-container ${className}`}
      style={{ 
        display: 'inline-flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        lineHeight: 1,
        ...style 
      }}
    >
      <svg 
        version="1.0" 
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 332.000000 160.000000" 
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <g 
          transform="translate(0.000000,160.000000) scale(0.100000,-0.100000)" 
          stroke="none"
        >
          {/* 1. T Monogram Block (Red) */}
          <path 
            d="M627 1318 c-52 -68 -93 -124 -92 -126 2 -2 91 -3 199 -2 l196 1 0 -376 0 -375 150 0 150 0 2 373 3 372 162 2 161 2 118 -120 c65 -65 121 -119 124 -119 4 0 47 44 98 98 l91 99 -141 146 -140 147 -493 0 -494 0 -94 -122z"
            fill="#FF2424"
          />

          {/* 2. Speed stripe 1 (Red) */}
          <path 
            d="M2299 1153 c-234 -238 -335 -347 -483 -523 -147 -175 326 308 537 548 97 111 176 202 174 202 -2 0 -104 -102 -228 -227z"
            fill="#FF2424"
          />

          {/* 3. Speed stripe 2 (Theme text color / White in dark mode) */}
          <path 
            d="M2178 1183 c-149 -151 -457 -492 -572 -634 -26 -32 102 99 339 347 157 164 433 474 422 474 -2 0 -87 -84 -189 -187z"
            fill="currentColor"
            style={{ color: 'var(--text-primary)' }}
          />

          {/* 4. X Right Leg (Theme text color / Black in light mode, White in dark mode) */}
          <path 
            d="M2225 904 c-417 -449 -441 -477 -271 -322 l139 127 131 -135 131 -135 192 3 192 3 -224 230 c-123 127 -224 235 -224 242 -1 9 168 223 257 326 8 9 13 17 11 17 -2 0 -152 -160 -334 -356z"
            fill="currentColor"
            style={{ color: 'var(--text-primary)' }}
          />

          {/* 5. T in TECH (Red) */}
          <path 
            d="M116 338 l-26 -33 67 -5 67 -5 1 -115 0 -115 43 -3 42 -3 0 120 0 121 58 0 c54 0 58 2 80 35 l22 35 -164 0 -165 0 -25 -32z"
            fill="#FF2424"
          />

          {/* 6. E in TECH (Red) */}
          <path 
            d="M510 215 l0 -155 143 0 144 0 27 38 26 37 -125 3 -125 3 0 24 c0 25 1 25 94 25 94 0 95 0 116 30 l21 30 -115 0 -116 0 0 25 c0 25 0 25 99 25 l99 0 26 35 27 35 -170 0 -171 0 0 -155z"
            fill="#FF2424"
          />

          {/* 7. C in TECH (Red) */}
          <path 
            d="M975 356 c-17 -7 -44 -28 -59 -47 -26 -30 -28 -39 -24 -96 3 -49 9 -68 28 -89 43 -45 78 -57 185 -62 l101 -4 27 35 c15 20 27 38 27 41 0 3 -54 6 -120 6 -115 0 -122 1 -145 25 -32 31 -32 66 -1 102 23 27 29 28 122 32 101 3 106 5 135 54 9 16 1 17 -118 17 -84 -1 -139 -5 -158 -14z"
            fill="#FF2424"
          />

          {/* 8. H in TECH (Red) */}
          <path 
            d="M1310 214 l0 -155 42 3 41 3 1 60 1 60 93 3 92 3 0 -66 0 -66 43 3 42 3 3 153 3 152 -46 0 -45 0 0 -55 0 -56 -92 3 -93 3 0 53 1 52 -43 0 -43 0 0 -156z"
            fill="#FF2424"
          />

          {/* 9. X in XPT (Red) */}
          <path 
            d="M1970 295 l75 -75 -80 -80 -80 -80 51 0 c47 0 53 3 99 50 27 27 54 50 60 50 6 0 33 -22 60 -50 48 -49 50 -50 109 -50 l61 0 -83 83 -83 83 78 72 78 71 -55 1 c-52 0 -57 -2 -102 -47 l-48 -47 -48 47 c-46 45 -50 47 -107 47 l-59 0 74 -75z"
            fill="#FF2424"
          />

          {/* 10. P in XPT (Red) */}
          <path 
            d="M2402 340 c-12 -16 -22 -32 -22 -35 0 -3 57 -5 126 -5 129 0 164 -8 164 -38 0 -37 -20 -42 -162 -42 l-138 0 0 -80 0 -80 39 0 c39 0 40 1 43 40 l3 41 105 2 c122 3 156 15 185 69 18 35 19 40 5 80 -23 65 -56 78 -206 78 l-120 0 -22 -30z"
            fill="#FF2424"
          />

          {/* 11. T in XPT (Red) */}
          <path 
            d="M2816 338 l-26 -33 67 -5 67 -5 1 -115 0 -115 43 -3 42 -3 0 120 0 121 58 0 c54 0 58 2 80 35 l22 35 -164 0 -165 0 -25 -32z"
            fill="#FF2424"
          />
        </g>
      </svg>

      {/* Subtitle Tagline */}
      {showTagline && (
        <span 
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: 'clamp(7px, 1.2vw, 9px)',
            letterSpacing: '0.24em',
            color: 'var(--text-primary)',
            fontWeight: 400,
            textTransform: 'uppercase',
            marginTop: '4px',
            paddingLeft: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          PARTNER FOR YOUR FUTURE
        </span>
      )}
    </div>
  );
}
