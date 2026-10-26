import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CurrencyCode } from "@/types/veloceops";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const symbols: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const sym = symbols[currency] || '$';
  return sym + amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatShortCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const symbols: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const sym = symbols[currency] || '$';
  return sym + amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
}
