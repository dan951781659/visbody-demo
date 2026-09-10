import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import { VerificationCodeRow } from "@/components/auth/AuthFormParts";
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useAuthVerification } from "@/context/AuthVerificationContext";
import { useUser } from "@/context/UserContext";
import { isRegisteredAccount } from "@/utils/authMock";
import { validateCode, validateEmail } from "@/utils/authValidation";

export default function RegisterScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { setRegisterDraft } = useUser();
  const { session, setVerifiedSession, clearVerification } = useAuthVerification();

  const exitToLogin = () => {
    clearVerification();
    setRegisterDraft(null);
    router.replace("/login");
  };

  const [email, setEmail] = useState(
    session?.purpose === "register" && session.channel === "email" ? session.identifier : "",
  );
  const [code, setCode] = useState("");

  const handleNext = () => {
    const emailResult = validateEmail(email);
    if (!emailResult.ok) {
      showToast(emailResult.message);
      return;
    }

    const codeResult = validateCode(code);
    if (!codeResult.ok) {
      showToast(codeResult.message);
      return;
    }

    const trimmedEmail = email.trim();
    if (isRegisteredAccount(trimmedEmail, "email")) {
      showToast(authCopy.register.emailAlreadyRegistered);
      return;
    }

    setVerifiedSession({
      purpose: "register",
      identifier: trimmedEmail,
      channel: "email",
    });
    setRegisterDraft({
      identifier: trimmedEmail,
      channel: "email",
    });
    router.push("/register-password");
  };

  return (
    <AuthScreen
      title={authCopy.register.title}
      subtitle={authCopy.register.subtitle}
      onBack={exitToLogin}
      variant="cinematic"
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.register.email}>
          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder={authCopy.register.emailPlaceholder}
            keyboardType="email-address"
            accessibilityLabel={authCopy.register.email}
            icon="mail-outline"
          />
        </AuthField>

        <VerificationCodeRow
          target={email}
          channel="email"
          value={code}
          onChangeText={setCode}
          codeLabel={authCopy.register.code}
        />

        <AuthPrimaryButton label={authCopy.register.next} onPress={handleNext} />

        <AuthSwitchLink
          prefix={authCopy.register.hasAccount}
          actionLabel={authCopy.register.goLogin}
          onPress={exitToLogin}
        />
      </View>
    </AuthScreen>
  );
}
