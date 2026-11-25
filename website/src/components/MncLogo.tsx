"use client";

import React, { useId } from "react";

interface MncLogoProps {
  className?: string;
  ariaLabel?: string;
}

/**
 * Official First-Generation MiniChain Coin (MNC) & MiniChain Brand Emblem
 * - Deep Navy Coin Face: #101D35
 * - Gold Double Concentric Ring (Solid + 72-Dash): #D9B66C
 * - Central Geometric Double-Layer M: #EAC77B
 * - Exterior: 100% Transparent
 */
export function MncLogo({ className = "h-9 w-9", ariaLabel }: MncLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `mnc-face-${uid}`;
  const clipId = `mnc-base-${uid}`;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#132340" />
          <stop offset="72%" stopColor="#101D35" />
          <stop offset="100%" stopColor="#0B1528" />
        </radialGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="512" height="353" />
        </clipPath>
      </defs>

      <circle cx="256" cy="256" r="248" fill={`url(#${gradId})`} />

      <circle cx="256" cy="256" r="227" stroke="#D9B66C" strokeWidth="8.5" />
      <circle
        cx="256"
        cy="256"
        r="204.5"
        stroke="#D9B66C"
        strokeWidth="3.6"
        strokeDasharray="7.138 10.708"
      />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M 133 372 L 133 162 L 256 279 L 379 162 L 379 372"
          stroke="#EAC77B"
          strokeWidth="27"
          strokeLinejoin="round"
          strokeLinecap="butt"
        />
        <path
          d="M 169 372 L 169 255 L 256 338 L 343 255 L 343 372"
          stroke="#E2C074"
          strokeWidth="8.2"
          strokeLinejoin="round"
          strokeLinecap="butt"
        />
      </g>
    </svg>
  );
}
