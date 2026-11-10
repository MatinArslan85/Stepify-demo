import React from 'react';

interface Props {
  className?: string;
  variant?: 'happy' | 'motivated' | 'sad' | 'hero';
}

export const StepiAvatar = ({ className = "w-10 h-10", variant = 'happy' }: Props) => {
  if (variant === 'happy') {
    return (
      <svg viewBox="0 0 100 110" fill="none" className={className}>
        <ellipse cx="50" cy="48" rx="38" ry="36" fill="#0D1B2A"/>
        <path d="M34 16 Q24 4 18 2" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="16" cy="1" r="5" fill="#00A878"/>
        <path d="M66 16 Q76 4 82 2" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="84" cy="1" r="5" fill="#00A878"/>
        <ellipse cx="36" cy="44" rx="11" ry="12" fill="white"/>
        <ellipse cx="38" cy="46" rx="7" ry="8" fill="#0D1B2A"/>
        <ellipse cx="40" cy="44" rx="4" ry="4.5" fill="#1a6ef5"/>
        <ellipse cx="42" cy="42" rx="2" ry="2.5" fill="white"/>
        <ellipse cx="64" cy="44" rx="11" ry="12" fill="white"/>
        <ellipse cx="66" cy="46" rx="7" ry="8" fill="#0D1B2A"/>
        <ellipse cx="68" cy="44" rx="4" ry="4.5" fill="#1a6ef5"/>
        <ellipse cx="70" cy="42" rx="2" ry="2.5" fill="white"/>
        <ellipse cx="27" cy="56" rx="8" ry="5" fill="#FF8FAB" opacity=".5"/>
        <ellipse cx="73" cy="56" rx="8" ry="5" fill="#FF8FAB" opacity=".5"/>
        <path d="M32 60 Q50 78 68 60" stroke="#00A878" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="50" cy="94" rx="26" ry="20" fill="#0D1B2A"/>
        <ellipse cx="38" cy="107" rx="14" ry="6" fill="#00A878"/>
        <ellipse cx="62" cy="107" rx="14" ry="6" fill="#00A878"/>
      </svg>
    );
  }

  if (variant === 'motivated') {
    return (
      <svg viewBox="0 0 100 110" fill="none" className={className}>
        <ellipse cx="50" cy="48" rx="38" ry="36" fill="#0D1B2A"/>
        <path d="M34 16 Q24 4 18 2" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="16" cy="1" r="5" fill="#FFBE0B"/>
        <path d="M66 16 Q76 4 82 2" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="84" cy="1" r="5" fill="#FFBE0B"/>
        <ellipse cx="36" cy="42" rx="11" ry="12" fill="white"/>
        <ellipse cx="37" cy="40" rx="7" ry="8" fill="#0D1B2A"/>
        <ellipse cx="39" cy="38" rx="4" ry="4.5" fill="#1a6ef5"/>
        <ellipse cx="41" cy="36" rx="2" ry="2.5" fill="white"/>
        <ellipse cx="64" cy="42" rx="11" ry="12" fill="white"/>
        <ellipse cx="65" cy="40" rx="7" ry="8" fill="#0D1B2A"/>
        <ellipse cx="67" cy="38" rx="4" ry="4.5" fill="#1a6ef5"/>
        <ellipse cx="69" cy="36" rx="2" ry="2.5" fill="white"/>
        <ellipse cx="27" cy="56" rx="8" ry="5" fill="#FF8FAB" opacity=".5"/>
        <ellipse cx="73" cy="56" rx="8" ry="5" fill="#FF8FAB" opacity=".5"/>
        <path d="M36 62 Q50 74 64 62" stroke="#00A878" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M20 75 Q10 60 8 48" stroke="#0D1B2A" strokeWidth="10" strokeLinecap="round"/>
        <circle cx="8" cy="44" r="8" fill="#0D1B2A"/>
        <text x="4" y="26" fontSize="14" fill="#FFBE0B">⚡</text>
        <ellipse cx="58" cy="94" rx="26" ry="20" fill="#0D1B2A"/>
        <ellipse cx="44" cy="107" rx="14" ry="6" fill="#00A878"/>
        <ellipse cx="66" cy="107" rx="14" ry="6" fill="#007A5A"/>
      </svg>
    );
  }

  if (variant === 'sad') {
    return (
      <svg viewBox="0 0 100 110" fill="none" className={className}>
        <ellipse cx="50" cy="48" rx="38" ry="36" fill="#0D1B2A"/>
        <path d="M34 16 Q24 4 18 2" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="16" cy="1" r="5" fill="#00A878"/>
        <path d="M66 16 Q76 4 82 2" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="84" cy="1" r="5" fill="#00A878"/>
        <ellipse cx="36" cy="48" rx="11" ry="12" fill="white"/>
        <ellipse cx="37" cy="50" rx="7" ry="8" fill="#0D1B2A"/>
        <ellipse cx="39" cy="52" rx="4" ry="4.5" fill="#6B7280"/>
        <ellipse cx="41" cy="50" rx="2" ry="2.5" fill="white"/>
        <ellipse cx="64" cy="48" rx="11" ry="12" fill="white"/>
        <ellipse cx="65" cy="50" rx="7" ry="8" fill="#0D1B2A"/>
        <ellipse cx="67" cy="52" rx="4" ry="4.5" fill="#6B7280"/>
        <ellipse cx="69" cy="50" rx="2" ry="2.5" fill="white"/>
        <path d="M26 38 Q36 33 46 36" stroke="#E5A800" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M54 36 Q64 33 74 38" stroke="#E5A800" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M36 66 Q50 58 64 66" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <ellipse cx="30" cy="60" rx="3" ry="4" fill="#60A5FA" opacity=".7"/>
        <ellipse cx="50" cy="94" rx="26" ry="20" fill="#0D1B2A"/>
        <ellipse cx="38" cy="107" rx="14" ry="6" fill="#00A878"/>
        <ellipse cx="62" cy="107" rx="14" ry="6" fill="#00A878"/>
      </svg>
    );
  }

  // Hero
  return (
    <svg viewBox="0 0 100 110" fill="none" className={className}>
      <ellipse cx="50" cy="48" rx="38" ry="36" fill="#0D1B2A"/>
      <path d="M18 28 L26 14 L38 24 L50 10 L62 24 L74 14 L82 28" stroke="#FFBE0B" strokeWidth="3.5" strokeLinejoin="round" fill="none"/>
      <path d="M18 28 L82 28" stroke="#FFBE0B" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="50" cy="10" r="4" fill="#FFBE0B"/>
      <circle cx="26" cy="14" r="3" fill="#FFBE0B"/>
      <circle cx="74" cy="14" r="3" fill="#FFBE0B"/>
      <path d="M34 16 Q24 8 20 6" stroke="#0D1B2A" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="18" cy="5" r="4" fill="#00A878"/>
      <path d="M66 16 Q76 8 80 6" stroke="#0D1B2A" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="82" cy="5" r="4" fill="#00A878"/>
      <ellipse cx="36" cy="46" rx="11" ry="12" fill="white"/>
      <ellipse cx="38" cy="47" rx="7.5" ry="8" fill="#0D1B2A"/>
      <ellipse cx="40" cy="45" rx="4.5" ry="5" fill="#1a6ef5"/>
      <ellipse cx="42" cy="43" rx="2" ry="2.5" fill="white"/>
      <ellipse cx="64" cy="46" rx="11" ry="12" fill="white"/>
      <ellipse cx="66" cy="47" rx="7.5" ry="8" fill="#0D1B2A"/>
      <ellipse cx="68" cy="45" rx="4.5" ry="5" fill="#1a6ef5"/>
      <ellipse cx="70" cy="43" rx="2" ry="2.5" fill="white"/>
      <ellipse cx="27" cy="57" rx="8" ry="5" fill="#FF8FAB" opacity=".5"/>
      <ellipse cx="73" cy="57" rx="8" ry="5" fill="#FF8FAB" opacity=".5"/>
      <path d="M32 62 Q50 80 68 62" stroke="#00A878" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="50" cy="94" rx="26" ry="20" fill="#0D1B2A"/>
      <ellipse cx="38" cy="107" rx="14" ry="6" fill="#00A878"/>
      <ellipse cx="62" cy="107" rx="14" ry="6" fill="#007A5A"/>
      <text x="72" y="82" fontSize="12" fill="#FFBE0B">✨</text>
      <text x="10" y="80" fontSize="10" fill="#FFBE0B">✨</text>
    </svg>
  );
};
