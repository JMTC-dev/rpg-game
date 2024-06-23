import React from "react";

export const SkeletonSvg: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg viewBox='0 0 16 16' className='w-16 h-16' {...props}>
    <rect x='6' y='2' width='4' height='6' fill='#FFFFFF' />
    <rect x='6' y='0' width='4' height='2' fill='#FFFFFF' />
    <rect x='6' y='8' width='2' height='3' fill='#FFFFFF' />
    <rect x='8' y='8' width='2' height='3' fill='#FFFFFF' />
    <rect x='4' y='2' width='2' height='4' fill='#FFFFFF' />
    <rect x='10' y='2' width='2' height='4' fill='#FFFFFF' />
    <rect x='6' y='3' width='4' height='1' fill='#000000' />
    <rect x='6' y='5' width='4' height='1' fill='#000000' />
  </svg>
);
