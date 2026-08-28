import React from 'react';
import TechXptSvgLogo from './TechXptSvgLogo';

export default function Logo({ size = "default", showTagline = true, className = "" }) {
  const isCompact = size === "small";

  return (
    <TechXptSvgLogo 
      width={isCompact ? 92 : 142}
      height={isCompact ? 42 : 64}
      showTagline={showTagline && !isCompact}
      className={className}
    />
  );
}
