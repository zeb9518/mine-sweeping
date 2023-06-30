import React, {SVGProps} from "react";

export function MineExplosion(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path fill="currentColor"
            d="m287.586 15.297l3.504 110.963l31.537-110.963h-35.04zm-95.78.238l-1.75 236.047l-170.533-43.33L130.486 377.69l-88.77-5.174l114.432 112.357l-44.466-75.867L186.896 417l-51.748-109.94l110.114 79.956l-12.635-185.23l.002.003l75.212 170.57l75.816-89.95l-6.62 154.582l60.173-39.978l-20.388 79.486l75.756-142.787l-75.924 1.94L487.32 155.87l-131.402 73.08l-12.264-139.69l-65.41 140.336l-86.435-214.06h-.003zM45.503 44.095L39.355 75.94L154.285 218h.002l-77.6-166.836l-31.185-7.07zm422.27 24.776l-31.184 7.07l-43.738 107.37l81.068-82.59l-6.147-31.85zM279.208 403.61c-40.176 0-72.708 32.537-72.708 72.71c0 5.725.636 10.706 1.887 16.05c7.25-32.545 36.097-56.655 70.82-56.655c34.82 0 63.673 23.97 70.82 56.656c1.218-5.277 1.888-10.404 1.888-16.05c0-40.175-32.536-72.71-72.71-72.71z"></path>
    </svg>
  )
}

export function MineFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <mask id="ipTFlag0">
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
          <path d="M8 44h8m-4 0V4"></path>
          <path fill="#555" d="M40 6H12v16h28l-4-8l4-8Z"></path>
        </g>
      </mask>
      <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipTFlag0)"></path>
    </svg>
  )
}