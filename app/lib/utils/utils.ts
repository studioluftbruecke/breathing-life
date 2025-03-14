import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function triangleWave(x: number) {
  return (2 / Math.PI) * Math.asin(Math.sin(x));
}


export const isValidNumber = (value: number) => {
  return typeof value === 'number' && !isNaN(value) && value !== null && value !== undefined;
}

export const isHexColor = (color: string) => {  
  const reg=/^#[0-9A-F]{6}[0-9a-f]{0,2}$/i;
  return reg.test(color)
}
