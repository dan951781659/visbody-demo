import { authCopy } from "@/data/authCopy";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{4}$/;
const PHONE_PATTERN = /^1\d{10}$/;

export type ValidationResult = { ok: true } | { ok: false; message: string };

export type AuthChannel = "email" | "phone";

export function validateEmail(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, message: authCopy.validation.required };
  if (!EMAIL_PATTERN.test(trimmed)) return { ok: false, message: authCopy.validation.invalidEmail };
  return { ok: true };
}

export function validatePhone(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, message: authCopy.validation.required };
  if (!PHONE_PATTERN.test(trimmed)) return { ok: false, message: authCopy.validation.invalidPhone };
  return { ok: true };
}

export function validateCode(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, message: authCopy.validation.required };
  if (!CODE_PATTERN.test(trimmed)) return { ok: false, message: authCopy.validation.invalidCode };
  return { ok: true };
}

export function validatePassword(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, message: authCopy.validation.required };
  if (trimmed.length < 6) return { ok: false, message: authCopy.validation.passwordMin };
  return { ok: true };
}

export function validatePasswordMatch(password: string, confirm: string): ValidationResult {
  if (password !== confirm) return { ok: false, message: authCopy.toast.passwordMismatch };
  return { ok: true };
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.slice(0, 1).toUpperCase();
}

export function nicknameFromIdentifier(identifier: string, channel: AuthChannel): string {
  if (channel === "email") {
    const local = identifier.trim().split("@")[0];
    return local || "运动达人";
  }
  const phone = identifier.trim();
  return phone.length >= 4 ? `用户${phone.slice(-4)}` : "运动达人";
}
