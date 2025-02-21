import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function triangleWave(x: number) {
  return (2 / Math.PI) * Math.asin(Math.sin(x));
}