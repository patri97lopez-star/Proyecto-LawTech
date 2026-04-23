/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function LawTechLogo({ size = 48 }: { size?: number }) {
  return (
    <div 
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center select-none"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef1b8" />
            <stop offset="25%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#8a6d1c" />
            <stop offset="75%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#fef1b8" />
          </linearGradient>

          <filter id="goldBevel" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.3" in="SourceAlpha" result="blur" />
            <feSpecularLighting surfaceScale="3" specularConstant="1.5" specularExponent="35" lightingColor="#fff" in="blur" result="spec">
              <fePointLight x="-50" y="-50" z="150" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="in" />
          </filter>

          <filter id="subtleGlow">
            <feGaussianBlur stdDeviation="0.8" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Triple Border Circular Frame */}
        <circle cx="50" cy="50" r="48.5" stroke="url(#goldPlate)" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="46" stroke="url(#goldPlate)" strokeWidth="1.2" filter="url(#goldBevel)" />
        <circle cx="50" cy="50" r="44.5" stroke="url(#goldPlate)" strokeWidth="0.5" />
        
        {/* Intricate border dots */}
        {[...Array(90)].map((_, i) => (
          <circle 
            key={i}
            cx={50 + 47.2 * Math.cos((i * 4 * Math.PI) / 180)} 
            cy={50 + 47.2 * Math.sin((i * 4 * Math.PI) / 180)} 
            r="0.35" 
            fill="#d4af37" 
          />
        ))}

        {/* Deep Black Background with subtle texture feel */}
        <circle cx="50" cy="50" r="44" fill="#050505" />

        {/* Tech Nodes / Circuitry Grids (Corners) */}
        <g fill="#d4af37" opacity="0.3">
          {[...Array(4)].map((_, r) => [...Array(2)].map((_, c) => (
            <circle key={`l-${r}-${c}`} cx={32 + c*2.5} cy={42 + r*2.5} r="0.4" />
          )))}
          {[...Array(4)].map((_, r) => [...Array(2)].map((_, c) => (
            <circle key={`r-${r}-${c}`} cx={64 + c*2.5} cy={42 + r*2.5} r="0.4" />
          )))}
        </g>

        {/* High-density circuitry paths */}
        <g stroke="#d4af37" strokeWidth="0.25" opacity="0.6" strokeLinecap="round">
          {/* Leading to top scales */}
          <path d="M40 30 L35 30 L35 45 M60 30 L65 30 L65 45" />
          <path d="M42 22 L42 18 L35 18 M58 22 L58 18 L65 18" />
          {/* Branching behind gavel */}
          <path d="M28 55 L22 55 L22 65 M72 55 L78 55 L78 65" />
          <path d="M45 62 L40 62 L40 68 M55 62 L60 62 L60 68" />
          {/* Junction points */}
          <circle cx="40" cy="30" r="0.6" fill="#d4af37" />
          <circle cx="60" cy="30" r="0.6" fill="#d4af37" />
          <circle cx="35" cy="45" r="0.6" fill="#d4af37" />
          <circle cx="65" cy="45" r="0.6" fill="#d4af37" />
        </g>

        {/* Elevated Scales of Justice */}
        <g transform="translate(50, 35) scale(0.7)" stroke="url(#goldPlate)" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#goldBevel)">
          <path d="M0 -18 L0 30" strokeWidth="3" />
          {/* Geometric connector */}
          <path d="M-4 -6 L4 -6 L7 0 L4 6 L-4 6 L-7 0 Z" fill="url(#goldPlate)" stroke="none" />
          {/* Main arched beam */}
          <path d="M-40 3 C-22 -8, 22 -8, 40 3" strokeWidth="3.5" />
          {/* Hanging scale plates with detail */}
          <g transform="translate(-40, 3)">
            <path d="M0 0 L-15 28 L15 28 Z" strokeWidth="0.6" fill="#d4af37" fillOpacity="0.1" />
            <path d="M-18 28 L18 28" strokeWidth="5" />
          </g>
          <g transform="translate(40, 3)">
            <path d="M0 0 L-15 28 L15 28 Z" strokeWidth="0.6" fill="#d4af37" fillOpacity="0.1" />
            <path d="M-18 28 L18 28" strokeWidth="5" />
          </g>
        </g>

        {/* Master Gavel (Mallet) - Dynamic angle */}
        <g transform="translate(51, 50) rotate(-35)" filter="url(#subtleGlow)">
          <rect x="-18" y="-9" width="36" height="18" rx="2" fill="url(#goldPlate)" filter="url(#goldBevel)" />
          <rect x="-19" y="-4" width="38" height="8" fill="#000" opacity="0.4" /> {/* Embossed Band */}
          <rect x="-4" y="9" width="8" height="42" rx="4" fill="url(#goldPlate)" filter="url(#goldBevel)" />
          {/* Texture lines on head */}
          <path d="M-14 -9 L-14 9 M14 -9 L14 9" stroke="#000" strokeWidth="0.5" opacity="0.3" />
          <path d="M-10 -9 L-10 9 M10 -9 L10 9" stroke="#000" strokeWidth="0.3" opacity="0.1" />
        </g>

        {/* Brand Container and Title */}
        <path d="M20 68 L80 68 L84 90 L16 90 Z" fill="#030303" stroke="url(#goldPlate)" strokeWidth="1" />
        <text 
          x="50" 
          y="83" 
          textAnchor="middle" 
          fill="url(#goldPlate)" 
          fontSize="15" 
          fontWeight="1000" 
          letterSpacing="2"
          filter="url(#goldBevel)"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          LAWTECH
        </text>

        {/* Detailed Ornate Bottom Base */}
        <g transform="translate(50, 94) scale(0.85)" opacity="0.9" filter="url(#goldBevel)">
          <path d="M-15 0 L0 6 L15 0" stroke="url(#goldPlate)" strokeWidth="1.2" />
          <path d="M0 6 L0 -3" stroke="url(#goldPlate)" strokeWidth="1.5" />
          <circle cx="0" cy="-4" r="1.5" fill="url(#goldPlate)" />
        </g>
      </svg>
    </div>
  );
}
