// US numbers become "(828) 555-1234"; international numbers must start with "+".
export function normalizePhone(input: string): string | null {
  const raw = input.trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) return normalizePhone(digits.slice(1));
  if (raw.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}

// Digits-only form for tel: and sms: links.
export function phoneHref(formatted: string): string {
  return formatted.startsWith("+") ? formatted : `+1${formatted.replace(/\D/g, "")}`;
}
