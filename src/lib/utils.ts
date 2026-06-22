import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "ZAR"): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function generateReferenceNumber(prefix = "MMS"): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export function generateStudentNumber(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, "0");
  return `MMS${year}${random}`;
}

export function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pw = "MMS#";
  for (let i = 0; i < 6; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  return `MMS-CERT-${year}-${random}`;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
  return `INV-${year}-${random}`;
}

export function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
  return `RCT-${year}-${random}`;
}
