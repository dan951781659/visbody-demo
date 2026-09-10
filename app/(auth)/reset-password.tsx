import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useAuthVerification } from "@/context/AuthVerificationContext";
import {
  AuthChannel,
  validatePassword,
  validatePasswordMatch,
} from "@/utils/authValidation";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{ channel?: string }>();
  const channel: AuthChannel = params.channel === "phone" ? "phone" : "email";
  const { hasVerifiedSession, clearVerification } = useAuthVerification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const verifyBackPath =
    channel === "phone" ? "/forgot-password?channel=phone" : "/forgot-password?channel=email";
  const loginBackPath = channel === "phone" ? "/login-phone-password" : "/login-email-password";

  useEffect(() => {
    if (!hasVerifiedSession("reset", channel)) {
      router.replace(verifyBackPath);
    }
  }, [channel, hasVerifiedSession, router, verifyBackPath]);

  const handleSave = () => {
    if (!hasVerifiedSession("reset", channel)) {
      router.replace(verifyBackPath);
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

    showToast(authCopy.toast.passwordResetSuccess);
    clearVerification();
    setTimeout(() => {
      router.replace(loginBackPath);
    }, 900);
  };

  if (!hasVerifiedSession("reset", channel)) {
    return null;
  }

  return (
    <AuthScreen
      title={authCopy.forgotPassword.passwordTitle}
      subtitle={authCopy.forgotPassword.passwordSubtitle}
      onBack={() => router.replace(verifyBackPath)}
      variant="cinematic"
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.forgotPassword.newPassword}>
          <AuthInput
            value={password}
            onChangeText={setPassword}
            placeholder={authCopy.forgotPassword.newPasswordPlaceholder}
            secureTextEntry={!showPassword}
            showSecureToggle
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={authCopy.forgotPassword.newPassword}
            icon="lock-closed-outline"
          />
        </AuthField>

        <AuthField label={authCopy.forgotPassword.confirmPassword}>
          <AuthInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={authCopy.forgotPassword.confirmPasswordPlaceholder}
            secureTextEntry={!showConfirmPassword}
            showSecureToggle
            onToggleSecure={() => setShowConfirmPassword((prev) => !prev)}
            accessibilityLabel={authCopy.forgotPassword.confirmPassword}
            icon="lock-closed-outline"
          />
        </AuthField>

        <AuthPrimaryButton label={authCopy.forgotPassword.save} onPress={handleSave} />
      </View>
    </AuthScreen>
  );
}
