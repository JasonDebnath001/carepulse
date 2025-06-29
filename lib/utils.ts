import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatDateTime = (
  dateInput: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  let dateObj: Date;
  if (typeof dateInput === "string") {
    dateObj = new Date(dateInput);
  } else {
    dateObj = dateInput;
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  };

  return {
    date: dateObj.toLocaleDateString(undefined, dateOptions),
    time: dateObj.toLocaleTimeString(undefined, timeOptions),
    dateTime: `${dateObj.toLocaleDateString(
      undefined,
      dateOptions
    )} ${dateObj.toLocaleTimeString(undefined, timeOptions)}`,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
