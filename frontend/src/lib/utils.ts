import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import schedule from 'node-schedule';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}