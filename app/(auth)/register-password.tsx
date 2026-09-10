import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink";
import { PolicyAgreement } from "@/components/auth/AuthWidgets";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useAuthVerification } from "@/context/AuthVerificationContext";
import { useUser } from "@/context/UserContext";
import { validatePassword, validatePasswordMatch } from "@/utils/authValidation";

export default function RegisterPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { setRegisterDraft } = useUser();
  const { session, hasVerifiedSession, clearVerification } = useAuthVerification();

  const exitToLogin = () => {
    clearVerification();
    setRegisterDraft(null);
    router.replace("/login");
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  useEffect(() => {
    if (!hasVerifiedSession("register", "email")) {
      router.replace("/register");
    }
  }, [hasVerifiedSession, router]);

  const handleContinue = () => {
    if (!session || session.purpose !== "register") {
      router.replace("/register");
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
      identifier: session.identifier,
      channel: session.channel,
    });
    router.push("/profile-completion");
  };

  if (!hasVerifiedSession("register", "email")) {
    return null;
  }

  return (
    <AuthScreen
      title={authCopy.register.passwordTitle}
      subtitle={authCopy.register.passwordSubtitle}
      onBack={() => router.replace("/register")}
      variant="cinematic"
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.register.password}>
          <AuthInput
            value={password}
            onChangeText={setPassword}
            placeholder={authCopy.register.passwordPlaceholder}
            secureTextEntry={!showPassword}
            showSecureToggle
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={authCopy.register.password}
            icon="lock-closed-outline"
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
            icon="lock-closed-outline"
          />
        </AuthField>

        <PolicyAgreement checked={policyAgreed} onToggle={() => setPolicyAgreed((prev) => !prev)} />

        <AuthPrimaryButton label={authCopy.register.continue} onPress={handleContinue} />

        <AuthSwitchLink
          prefix={authCopy.register.hasAccount}
          actionLabel={authCopy.register.goLogin}
          onPress={exitToLogin}
        />
      </View>
    </AuthScreen>
  );
}
