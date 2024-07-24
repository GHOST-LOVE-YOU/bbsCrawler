import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function floorToSequence(floor: string): number {
  switch (floor) {
    case "楼主":
      return 0;
    case "沙发":
      return 1;
    case "板凳":
      return 2;
  }
  const match = floor.match(/第(\d+)楼/);
  if (match) {
    return parseInt(match[1], 10);
  }
  throw new Error("Invalid floor description");
}
