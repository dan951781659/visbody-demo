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
import {
  AuthChannel,
  validateCode,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
} from "@/utils/authValidation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{ channel?: string }>();
  const channel: AuthChannel = params.channel === "phone" ? "phone" : "email";

  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
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
    setTimeout(() => {
      router.replace(channel === "phone" ? "/login-phone-password" : "/login-email-password");
    }, 900);
  };

  return (
    <AuthScreen
      title={authCopy.forgotPassword.title}
      onBack={() =>
        router.replace(channel === "phone" ? "/login-phone-password" : "/login-email-password")
      }
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
          />
        </AuthField>

        <VerificationCodeRow
          target={identifier}
          channel={channel}
          value={code}
          onChangeText={setCode}
        />

        <AuthField label={authCopy.forgotPassword.newPassword}>
          <AuthInput
            value={password}
            onChangeText={setPassword}
            placeholder={authCopy.forgotPassword.newPasswordPlaceholder}
            secureTextEntry={!showPassword}
            showSecureToggle
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={authCopy.forgotPassword.newPassword}
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
          />
        </AuthField>

        <AuthPrimaryButton label={authCopy.forgotPassword.save} onPress={handleSave} />
      </View>
    </AuthScreen>
  );
}
