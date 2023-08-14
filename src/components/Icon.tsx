import React, { SVGProps } from "react";

export function MineExplosion(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="15" y="3" width="2" height="26" fill="black" />
      <rect x="29" y="15" width="2" height="26" transform="rotate(90 29 15)" fill="black" />
      <rect x="11" y="7" width="10" height="18" fill="black" />
      <rect x="25" y="11" width="10" height="18" transform="rotate(90 25 11)" fill="black" />
      <rect x="9" y="9" width="14" height="14" fill="black" />
      <rect x="23" y="7" width="2" height="2" fill="black" />
      <rect x="23" y="23" width="2" height="2" fill="black" />
      <rect x="7" y="7" width="2" height="2" fill="black" />
      <rect x="7" y="23" width="2" height="2" fill="black" />
      <rect x="11" y="11" width="4" height="4" fill="white" />
    </svg>
  )
}

export function MineFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"  {...props}>
      <rect x="16" y="6" width="2" height="19" fill="black" />
      <rect x="8" y="22" width="16" height="4" fill="#010000" />
      <rect x="12" y="20" width="8" height="2" fill="#010000" />
      <rect x="14" y="6" width="4" height="10" fill="#FC0D1B" />
      <rect x="10" y="8" width="4" height="6" fill="#FC0D1B" />
      <rect x="8" y="10" width="2" height="2" fill="#FC0D1B" />
    </svg>
  )
}