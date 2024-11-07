import { NextRequest, NextResponse } from "next/server";
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

export function apiAuth(req: NextRequest) {
  const BACKEND_AUTH_USERNAME = process.env.BACKEND_AUTH_USERNAME || "";
  const BACKEND_AUTH_PASSWORD = process.env.BACKEND_AUTH_PASSWORD || "";

  const authHeader = req.headers.get("authorization");

  if (!authHeader) return false;

  const [type, credentials] = authHeader.split(" ");
  if (type !== "Basic" || !credentials) return false;

  const decodedCredentials = atob(credentials);
  const [username, password] = decodedCredentials.split(":");

  return (
    username === BACKEND_AUTH_USERNAME && password === BACKEND_AUTH_PASSWORD
  );
}
