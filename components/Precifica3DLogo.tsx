'use client';

import React from 'react';

interface Precifica3DLogoProps {
  size?: number;
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
}

/**
 * Logo profissional do Precifica3D em SVG puro
 *
 * Design: Cubo 3D (impressora) + Cifrão ($) integrado
 * Cores: Laranja/Âmbar (gradient)
 * Variants: full (quadrado), icon (só ícone), horizontal (logo + texto)
 */
export default function Precifica3DLogo({
  size = 64,
  variant = 'full',
  className = ''
}: Precifica3DLogoProps) {

  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="logoGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Cubo 3D (representa impressora 3D) */}
        <g>
          {/* Face frontal */}
          <path
            d="M 50 20 L 80 35 L 80 65 L 50 80 Z"
            fill="url(#logoGradient)"
            opacity="0.9"
          />
          {/* Face lateral */}
          <path
            d="M 50 20 L 20 35 L 20 65 L 50 80 Z"
            fill="url(#logoGradientDark)"
            opacity="0.8"
          />
          {/* Face superior */}
          <path
            d="M 50 20 L 80 35 L 50 50 L 20 35 Z"
            fill="url(#logoGradient)"
            opacity="1"
          />

          {/* Símbolo $ integrado (precificação) */}
          <g transform="translate(50, 50)">
            {/* Linha vertical do $ */}
            <rect
              x="-2"
              y="-25"
              width="4"
              height="50"
              fill="#FFFFFF"
              rx="2"
            />
            {/* S superior */}
            <path
              d="M -10 -15 Q -10 -20 -5 -20 L 5 -20 Q 10 -20 10 -15 Q 10 -10 5 -10 L -5 -10 Q -10 -10 -10 -5"
              stroke="#FFFFFF"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* S inferior */}
            <path
              d="M 10 5 Q 10 10 5 10 L -5 10 Q -10 10 -10 15 Q -10 20 -5 20 L 5 20 Q 10 20 10 15"
              stroke="#FFFFFF"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    );
  }

  if (variant === 'horizontal') {
    return (
      <svg
        width={size * 3}
        height={size}
        viewBox="0 0 300 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logoGradientH" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="logoGradientDarkH" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Ícone */}
        <g>
          {/* Face frontal */}
          <path
            d="M 50 20 L 80 35 L 80 65 L 50 80 Z"
            fill="url(#logoGradientH)"
            opacity="0.9"
          />
          {/* Face lateral */}
          <path
            d="M 50 20 L 20 35 L 20 65 L 50 80 Z"
            fill="url(#logoGradientDarkH)"
            opacity="0.8"
          />
          {/* Face superior */}
          <path
            d="M 50 20 L 80 35 L 50 50 L 20 35 Z"
            fill="url(#logoGradientH)"
            opacity="1"
          />

          {/* Símbolo $ */}
          <g transform="translate(50, 50)">
            <rect x="-2" y="-25" width="4" height="50" fill="#FFFFFF" rx="2" />
            <path
              d="M -10 -15 Q -10 -20 -5 -20 L 5 -20 Q 10 -20 10 -15 Q 10 -10 5 -10 L -5 -10 Q -10 -10 -10 -5"
              stroke="#FFFFFF"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 10 5 Q 10 10 5 10 L -5 10 Q -10 10 -10 15 Q -10 20 -5 20 L 5 20 Q 10 20 10 15"
              stroke="#FFFFFF"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Texto */}
        <g transform="translate(110, 50)">
          <text
            x="0"
            y="0"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="32"
            fontWeight="900"
            fill="currentColor"
            dominantBaseline="middle"
          >
            Precifica3D
          </text>
          <text
            x="0"
            y="22"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="12"
            fontWeight="700"
            fill="url(#logoGradientH)"
            dominantBaseline="middle"
            letterSpacing="2"
          >
            PRO
          </text>
        </g>
      </svg>
    );
  }

  // Variant 'full' (default)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
        <linearGradient id="logoGradientDarkFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#logoGradientFull)"
        filter="url(#shadow)"
      />

      {/* Cubo 3D */}
      <g transform="translate(0, 5)">
        {/* Face frontal */}
        <path
          d="M 50 15 L 75 27.5 L 75 52.5 L 50 65 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        {/* Face lateral */}
        <path
          d="M 50 15 L 25 27.5 L 25 52.5 L 50 65 Z"
          fill="#FFFFFF"
          opacity="0.7"
        />
        {/* Face superior */}
        <path
          d="M 50 15 L 75 27.5 L 50 40 L 25 27.5 Z"
          fill="#FFFFFF"
          opacity="1"
        />

        {/* Símbolo $ */}
        <g transform="translate(50, 42)">
          <rect x="-1.5" y="-18" width="3" height="36" fill="url(#logoGradientDarkFull)" rx="1.5" />
          <path
            d="M -7 -10 Q -7 -14 -4 -14 L 4 -14 Q 7 -14 7 -10 Q 7 -7 4 -7 L -4 -7 Q -7 -7 -7 -4"
            stroke="url(#logoGradientDarkFull)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 7 4 Q 7 7 4 7 L -4 7 Q -7 7 -7 10 Q -7 14 -4 14 L 4 14 Q 7 14 7 10"
            stroke="url(#logoGradientDarkFull)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Badge PRO */}
      <g transform="translate(50, 85)">
        <rect
          x="-15"
          y="-6"
          width="30"
          height="12"
          rx="6"
          fill="#FFFFFF"
        />
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8"
          fontWeight="900"
          fill="url(#logoGradientDarkFull)"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="0.5"
        >
          PRO
        </text>
      </g>
    </svg>
  );
}
