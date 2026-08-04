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
import { PolicyAgreement } from "@/components/auth/AuthWidgets";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useUser } from "@/context/UserContext";
import {
  validateCode,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/authValidation";

export default function RegisterScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { setRegisterDraft } = useUser();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);

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

    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) {
      showToast(passwordResult.message);
      return;
    }

    const matchResult = validatePasswordMatch(password, confirmPassword);
    if (!matchResult.ok) {
      showToast(matchResult.message);
      return;
    }

    if (!policyAgreed) {
      showToast(authCopy.toast.policyRequired);
      return;
    }

    setRegisterDraft({
      identifier: email.trim(),
      channel: "email",
    });
    router.push("/profile-completion");
  };

  return (
    <AuthScreen
      title={authCopy.register.title}
      subtitle={authCopy.register.subtitle}
      onBack={() => router.replace("/login")}
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.register.email}>
          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder={authCopy.register.emailPlaceholder}
            keyboardType="email-address"
            accessibilityLabel={authCopy.register.email}
          />
        </AuthField>

        <VerificationCodeRow
          target={email}
          channel="email"
          value={code}
          onChangeText={setCode}
          codeLabel={authCopy.register.code}
        />

        <AuthField label={authCopy.register.password}>
          <AuthInput
            value={password}
            onChangeText={setPassword}
            placeholder={authCopy.register.passwordPlaceholder}
            secureTextEntry={!showPassword}
            showSecureToggle
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={authCopy.register.password}
          />
        </AuthField>

        <AuthField label={authCopy.register.confirmPassword}>
          <AuthInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={authCopy.register.confirmPasswordPlaceholder}
            secureTextEntry={!showConfirmPassword}
            showSecureToggle
            onToggleSecure={() => setShowConfirmPassword((prev) => !prev)}
            accessibilityLabel={authCopy.register.confirmPassword}
          />
        </AuthField>

        <PolicyAgreement checked={policyAgreed} onToggle={() => setPolicyAgreed((prev) => !prev)} />

        <AuthPrimaryButton label={authCopy.register.next} onPress={handleNext} />

        <AuthSwitchLink
          prefix={authCopy.register.hasAccount}
          actionLabel={authCopy.register.goLogin}
          onPress={() => router.replace("/login")}
        />
      </View>
    </AuthScreen>
  );
}
