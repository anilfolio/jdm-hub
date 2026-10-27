"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export type LogoVariant = "horizontal" | "mark" | "app-icon";
export type LogoTheme = "light" | "dark";

export interface JDMHubLogoProps {
  /**
   * Logo layout variant:
   * - "horizontal": Official Primary Horizontal Logo (Mark + jdmhub + Tagline)
   * - "mark": Icon mark only (Hexagon with gear and diagonal arrows)
   * - "app-icon": Official white rounded squircle app icon tile
   */
  variant?: LogoVariant;
  /**
   * Visual theme:
   * - "light": Charcoal Black text (#200000) for white / light surfaces
   * - "dark": Crisp White text (#FFFFFF) for dark / slate / red surfaces
   */
  theme?: LogoTheme;
  /**
   * Preset sizing:
   * - "xs": Compact badge (~24px height)
   * - "sm": Small header / sidebar (~32px height)
   * - "md": Standard sticky header (~42px height)
   * - "lg": Prominent hero / footer (~52px height)
   * - "xl": Feature display (~68px height)
   * - "custom": Controlled by height / width or className
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "custom";
  /** Optional custom height in pixels */
  height?: number;
  /** Optional custom width in pixels */
  width?: number;
  /** Additional CSS classes */
  className?: string;
  /** If provided, wraps logo in a Next.js Link */
  href?: string;
  /** Accessible label */
  alt?: string;
  /** If true, uses Next.js Image component with the HD SVG asset instead of inline SVG */
  asImage?: boolean;
  /** Priority preloading when asImage is true */
  priority?: boolean;
}

// Exact official vector path for the Hexagon Gear Arrow brand mark
const OFFICIAL_MARK_PATH =
  "M 248.6 66.4 L 374.7 141.3 L 378.0 145.7 L 360.0 156.5 L 250.8 89.7 L 247.0 90.8 L 119.9 169.0 L 119.9 288.0 L 100.9 301.1 L 99.8 288.0 L 99.2 301.1 L 99.2 157.6 L 248.1 66.9 Z M 386.6 117.4 L 459.5 126.1 L 457.3 126.7 L 460.0 127.2 L 459.5 129.4 L 432.3 196.8 L 430.1 194.6 L 429.6 196.2 L 418.7 166.3 L 335.0 222.8 L 333.9 194.6 L 407.3 144.0 L 386.1 119.1 L 391.0 118.0 L 387.2 117.4 Z M 245.4 120.1 L 269.8 123.4 L 276.4 146.8 L 290.5 155.5 L 294.8 157.1 L 311.7 149.5 L 339.9 167.4 L 340.5 170.1 L 309.5 191.3 L 249.2 158.2 L 200.8 185.3 L 200.8 231.0 L 249.7 201.6 L 249.7 174.5 L 251.4 173.9 L 297.5 200.0 L 251.4 239.7 L 248.1 226.1 L 200.3 255.4 L 201.9 301.6 L 213.3 318.5 L 248.6 340.7 L 261.1 335.8 L 287.2 317.9 L 294.3 309.2 L 299.2 296.7 L 299.2 248.9 L 249.7 287.5 L 213.3 256.5 L 232.9 245.1 L 250.8 257.6 L 322.5 200.6 L 322.5 207.1 L 323.6 201.1 L 324.2 203.8 L 323.6 342.4 L 311.7 350.0 L 293.7 341.3 L 276.4 352.7 L 270.4 375.0 L 256.8 378.8 L 243.2 378.8 L 228.5 373.9 L 223.6 352.7 L 207.9 342.4 L 188.3 350.0 L 159.0 332.0 L 161.2 332.0 L 159.5 329.3 L 171.5 321.2 L 175.8 310.3 L 175.8 157.6 L 187.8 149.5 L 205.2 157.1 L 209.5 155.5 L 223.6 146.2 L 230.7 122.9 L 244.8 120.7 Z M 159.0 167.4 L 160.6 261.4 L 161.2 167.4 L 161.2 261.4 L 142.1 274.5 L 139.4 275.5 L 142.7 273.4 L 139.4 272.3 L 138.3 275.0 L 138.3 181.0 L 158.4 168.0 Z M 398.6 198.9 L 399.7 202.2 L 400.8 198.9 L 400.8 340.7 L 250.8 433.6 L 123.1 355.4 L 124.8 356.5 L 125.8 353.8 L 123.7 353.8 L 141.1 342.9 L 250.8 409.7 L 380.1 329.9 L 380.1 212.0 L 398.1 199.5 Z M 359.5 225.0 L 360.6 252.2 L 361.1 225.5 L 361.1 319.5 L 341.6 332.0 L 339.4 330.4 L 338.3 332.0 L 338.8 239.1 L 358.9 225.5 Z M 164.4 277.7 L 164.4 280.4 L 166.1 279.3 L 165.0 307.1 L 93.2 356.0 L 112.3 378.8 L 114.4 382.0 L 112.8 380.4 L 111.2 382.6 L 113.9 383.1 L 40.0 372.8 L 67.2 303.2 L 70.4 302.7 L 81.3 333.1 L 163.9 278.3 Z";

const SIZE_PRESETS = {
  horizontal: {
    xs: { h: 26, w: 92 },
    sm: { h: 34, w: 120 },
    md: { h: 42, w: 148 },
    lg: { h: 52, w: 183 },
    xl: { h: 68, w: 240 },
  },
  mark: {
    xs: { h: 24, w: 24 },
    sm: { h: 32, w: 32 },
    md: { h: 42, w: 42 },
    lg: { h: 52, w: 52 },
    xl: { h: 64, w: 64 },
  },
  "app-icon": {
    xs: { h: 24, w: 24 },
    sm: { h: 34, w: 34 },
    md: { h: 42, w: 42 },
    lg: { h: 52, w: 52 },
    xl: { h: 64, w: 64 },
  },
};

export function JDMHubLogo({
  variant = "horizontal",
  theme = "light",
  size = "md",
  height,
  width,
  className = "",
  href,
  alt = "JDMHUB Automotive Procurement",
  asImage = false,
  priority = false,
}: JDMHubLogoProps) {
  // Resolve dimensions
  const dims =
    size === "custom"
      ? {
        h: height || 52,
        w: width || (variant === "horizontal" ? 168 : 56),
      }
      : {
        h: height ?? SIZE_PRESETS[variant][size].h,
        w: width ?? SIZE_PRESETS[variant][size].w,
      };

  // If raster/external image mode is requested, use high-definition SVG or HD PNG
  if (asImage) {
    const src =
      variant === "horizontal"
        ? theme === "dark"
          ? "/images/jdmhub-horizontal-logo-dark.svg"
          : "/images/jdmhub-horizontal-logo.svg"
        : variant === "mark"
          ? "/images/jdmhub-mark.svg"
          : "/images/jdmhub-app-icon.svg";

    const imgNode = (
      <Image
        src={src}
        alt={alt}
        width={dims.w * 2}
        height={dims.h * 2}
        priority={priority}
        style={{
          width: `${dims.w}px`,
          height: `${dims.h}px`,
          objectFit: "contain",
        }}
        className={`select-none transition-transform duration-200 ${className}`}
      />
    );

    if (href) {
      return (
        <Link
          href={href}
          className="inline-flex items-center shrink-0 transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
          aria-label={alt}
        >
          {imgNode}
        </Link>
      );
    }
    return <div className="inline-flex items-center shrink-0">{imgNode}</div>;
  }

  // Pure Vector Inline Rendering: 100% infinite resolution, zero blur, zero latency
  let svgContent: React.ReactNode = null;

  if (variant === "horizontal") {
    const textColor = theme === "dark" ? "#FFFFFF" : "#200000";
    const lineOpacity = theme === "dark" ? 0.9 : 1.0;
    const tagOpacity = theme === "dark" ? 0.95 : 1.0;

    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 740 210"
        style={{
          width: `${dims.w}px`,
          height: `${dims.h}px`,
        }}
        className={`select-none overflow-visible ${className}`}
        aria-label={alt}
        role="img"
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@700;800;900&display=swap');
              .jdmhub-brand-text {
                font-family: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 800;
                font-size: 132px;
                letter-spacing: -2.5px;
              }
              .jdmhub-tagline-text {
                font-family: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 800;
                font-size: 30px;
                text-transform: uppercase;
              }
            `}
          </style>
        </defs>

        {/* Official Brand Mark on Left */}
        <g transform="translate(18, 14) scale(0.44)">
          <path d={OFFICIAL_MARK_PATH} fill="#e20c0c" fillRule="evenodd" />
        </g>

        {/* Wordmark: jdm in Brand Red #EC002E, hub in Charcoal #200000 or White #FFFFFF */}
        <text x="250" y="132" className="jdmhub-brand-text">
          <tspan fill="#e20c0c">jdm</tspan>
          <tspan fill={textColor}>{`hub`}</tspan>
        </text>

        {/* Baseline Divider Line spanning from j to b */}
        <line
          x1="242"
          y1="177"
          x2="730"
          y2="177"
          stroke={textColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={lineOpacity}
        />

        {/* Tagline: AUTOMOTIVE PROCUREMENT tracked to match baseline line */}
        <text
          x="242"
          y="210"
          fill={textColor}
          className="jdmhub-tagline-text"
          opacity={tagOpacity}
          textLength="500"
          lengthAdjust="spacing"
        >
          AUTOMOTIVE PROCUREMENT
        </text>
      </svg>
    );
  } else if (variant === "mark") {
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        style={{
          width: `${dims.w}px`,
          height: `${dims.h}px`,
        }}
        className={`select-none ${className}`}
        aria-label={alt}
        role="img"
      >
        <path d={OFFICIAL_MARK_PATH} fill="#EC002E" fillRule="evenodd" />
      </svg>
    );
  } else if (variant === "app-icon") {
    svgContent = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{
          width: `${dims.w}px`,
          height: `${dims.h}px`,
        }}
        className={`select-none shadow-sm ${className}`}
        aria-label={alt}
        role="img"
      >
        {/* Rounded white squircle tile */}
        <rect
          x="20"
          y="20"
          width="472"
          height="472"
          rx="108"
          ry="108"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="6"
        />
        {/* Centered official mark */}
        <g transform="translate(68, 68) scale(0.75)">
          <path d={OFFICIAL_MARK_PATH} fill="#EC002E" fillRule="evenodd" />
        </g>
      </svg>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center shrink-0 transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
        aria-label={alt}
      >
        {svgContent}
      </Link>
    );
  }

  return <div className="inline-flex items-center shrink-0">{svgContent}</div>;
}

export default JDMHubLogo;
