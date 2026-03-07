import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns "Good morning 🌅", "Good afternoon ☀️", or "Good evening 🌙" based on local time */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning 🌅"
  if (hour < 17) return "Good afternoon ☀️"
  return "Good evening 🌙"
}
