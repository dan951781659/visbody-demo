import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import { VerificationCodeRow } from "@/components/auth/AuthFormParts";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useAuthVerification } from "@/context/AuthVerificationContext";
import { isRegisteredAccount } from "@/utils/authMock";
import {
  AuthChannel,
  validateCode,
  validateEmail,
  validatePhone,
} from "@/utils/authValidation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{ channel?: string }>();
  const channel: AuthChannel = params.channel === "phone" ? "phone" : "email";
  const { session, setVerifiedSession, clearVerification } = useAuthVerification();

  const [identifier, setIdentifier] = useState(
    session?.purpose === "reset" && session.channel === channel ? session.identifier : "",
  );
  const [code, setCode] = useState("");

  const loginBackPath = channel === "phone" ? "/login-phone-password" : "/login-email-password";

  const handleNext = () => {
    const idResult = channel === "phone" ? validatePhone(identifier) : validateEmail(identifier);
    if (!idResult.ok) {
      showToast(idResult.message);
      return;
    }

    const codeResult = validateCode(code);
    if (!codeResult.ok) {
      showToast(codeResult.message);
      return;
    }

    const trimmed = identifier.trim();
    if (!isRegisteredAccount(trimmed, channel)) {
      showToast(
        channel === "phone"
          ? authCopy.forgotPassword.phoneNotRegistered
          : authCopy.forgotPassword.emailNotRegistered,
      );
      return;
    }

    setVerifiedSession({
      purpose: "reset",
      identifier: trimmed,
      channel,
    });
    router.push(`/reset-password?channel=${channel}`);
  };

  return (
    <AuthScreen
      title={authCopy.forgotPassword.verifyTitle}
      subtitle={
        channel === "phone"
          ? authCopy.forgotPassword.phoneSubtitle
          : authCopy.forgotPassword.emailSubtitle
      }
      onBack={() => {
        clearVerification();
        router.replace(loginBackPath);
      }}
      variant="cinematic"
    >
      <View style={{ gap: 12 }}>
        <AuthField label={channel === "phone" ? authCopy.login.phone : authCopy.login.email}>
          <AuthInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder={
              channel === "phone"
                ? authCopy.login.phonePlaceholder
                : authCopy.login.emailPlaceholder
            }
            keyboardType={channel === "phone" ? "number-pad" : "email-address"}
            accessibilityLabel={channel === "phone" ? authCopy.login.phone : authCopy.login.email}
            icon={channel === "phone" ? "call-outline" : "mail-outline"}
          />
        </AuthField>

        <VerificationCodeRow
          target={identifier}
          channel={channel}
          value={code}
          onChangeText={setCode}
        />

        <AuthPrimaryButton label={authCopy.forgotPassword.next} onPress={handleNext} />
      </View>
    </AuthScreen>
  );
}
