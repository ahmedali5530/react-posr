import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
const DECIMAL_PLACES = import.meta.env.VITE_DECIMAL_PLACES;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const withCurrency = (amount: string | number | undefined) => {
  if (amount === undefined) {
    //just return currency symbol
    return (0)
      .toLocaleString(import.meta.env.VITE_LOCALE, {
        style: "currency",
        currency: import.meta.env.VITE_CURRENCY,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, "")
      .trim();
  }

  return new Intl.NumberFormat(import.meta.env.VITE_LOCALE, {
    style: "currency",
    currency: import.meta.env.VITE_CURRENCY,
    maximumFractionDigits: DECIMAL_PLACES,
  }).format(Number(amount));
};

export const formatNumber = (amount: string | number) => {
  return new Intl.NumberFormat(import.meta.env.VITE_LOCALE, {
    maximumFractionDigits: DECIMAL_PLACES,
    useGrouping: false
  }).format(Number(amount));
}

export const transformValue = {
  input: (value) =>
    value === null || isNaN(value) || value === 0 ? "" : value.toString(),
  output: (e) => {
    const output = parseInt(e.target.value);
    return isNaN(output) ? 0 : output;
  }
}
