import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const contractAddress = "0x4aC24F13fc39Fd72856bA5d09eE16a097C12565b";
export const deviceId = "Node_Provider_1";
