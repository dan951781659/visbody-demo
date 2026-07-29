import { AuthChannel } from "@/utils/authValidation";

const REGISTERED_EMAILS = new Set(["alyona@email.com"]);
const REGISTERED_PHONES = new Set(["13800138000"]);

export function isRegisteredAccount(identifier: string, channel: AuthChannel): boolean {
  if (channel === "email") {
    return REGISTERED_EMAILS.has(identifier.trim().toLowerCase());
  }
  return REGISTERED_PHONES.has(identifier.trim());
}
