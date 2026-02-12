
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'graphic' | 'korean';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", variant = 'graphic' }) => {
  if (variant === 'korean') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 240 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="120" cy="85" r="65" fill="url(#sunGrad)" />
          <path d="M70 45 A 70 70 0 0 1 170 45" fill="none" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" />
          <path d="M170 45 L158 40 M170 45 L165 58" fill="none" stroke="#1c1917" strokeWidth="5" strokeLinecap="round" />
          <text x="120" y="105" textAnchor="middle" style={{ fontStyle: 'normal', fontWeight: 900, fontSize: '46px', fontFamily: '"Noto Serif KR", serif' }} fill="#1c1917">
            굿모닝송도
          </text>
          <path id="curve" d="M 50,140 Q 120,185 190,140" fill="transparent" />
          <text style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '3px' }} fill="#1c1917">
            <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
              RUNNING CLUB
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#fcd34d', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="200" cy="180" r="150" fill="url(#skyGrad)" />
        <path d="M85 220 L85 175 L115 175 L115 145 L145 145 L145 195 L175 195 L175 135 L205 135 L205 215 L245 215 L245 75 L285 75 L285 205 L315 205 L315 185 L345 185 L345 220 Z" fill="#312e2b" />
        <rect x="75" y="215" width="250" height="10" fill="#312e2b" />
        <text x="200" y="300" textAnchor="middle" style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '105px', fontStyle: 'italic', fontWeight: 'bold' }} fill="#1c1917">
          Goodsong
        </text>
        <path d="M90 315 Q 200 335 310 315" fill="none" stroke="#1c1917" strokeWidth="6" strokeLinecap="round" />
        <path id="curveLower" d="M 80,360 Q 200,420 320,360" fill="transparent" />
        <text style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '4px' }} fill="#1c1917">
          <textPath xlinkHref="#curveLower" startOffset="50%" textAnchor="middle">
            RUNNING CLUB
          </textPath>
        </text>
      </svg>
    </div>
  );
};
