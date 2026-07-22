import React, { forwardRef } from 'react';

// 1. Definisikan Interface untuk Props (TypeScript)
export interface XTwitterLogoIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  background?: string;
  opacity?: number;
  rotation?: number;
  shadow?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  padding?: number;
}

// 2. Gunakan Generics pada forwardRef <TipeRef, TipeProps>
const XTwitterLogoIcon = forwardRef<SVGSVGElement, XTwitterLogoIconProps>(({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
  className,
  style,
  ...props
}, ref) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined,
        ...style
      }}
      {...props}
    >
      <path d="M17.27 22.464L1.5 1.536h5.23L22.5 22.464zm4.488-20.928l-8.313 8.915M2.242 22.464l8.307-8.908"/>
    </svg>
  );
});

XTwitterLogoIcon.displayName = 'XTwitterLogoIcon';

export default XTwitterLogoIcon;