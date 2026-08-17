import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import { AuthFootLinks } from "@/components/auth/AuthFootLinks";
import { PolicyAgreement } from "@/components/auth/AuthWidgets";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { authCopy } from "@/data/authCopy";
import { useAuthLoginFlow } from "@/hooks/useAuthLoginFlow";
import { useToast } from "@/components/ToastProvider";
import { validateEmail, validatePassword } from "@/utils/authValidation";

export default function LoginEmailPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { attemptAccountLogin, attemptSocialLogin } = useAuthLoginFlow();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  const handleLogin = () => {
    const emailResult = validateEmail(email);
    if (!emailResult.ok) {
      showToast(emailResult.message);
      return;
    }
    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) {
      showToast(passwordResult.message);
      return;
    }
    attemptAccountLogin(email, "email", policyAgreed);
  };

  return (
    <AuthScreen
      title={authCopy.pages.emailPassword}
      titleAction={{
        label: authCopy.login.links.emailCode,
        onPress: () => router.replace("/login"),
      }}
      onBack={() => router.replace("/(tabs)/profile")}
      variant="cinematic"
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.login.email}>
          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder={authCopy.login.emailPlaceholder}
            keyboardType="email-address"
            accessibilityLabel={authCopy.login.email}
            icon="mail-outline"
          />
        </AuthField>

        <AuthField label={authCopy.login.password}>
          <AuthInput
            value={password}
            onChangeText={setPassword}
            placeholder={authCopy.login.passwordPlaceholder}
            secureTextEntry={!showPassword}
            showSecureToggle
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={authCopy.login.password}
            icon="lock-closed-outline"
          />
        </AuthField>

        <AuthPrimaryButton label={authCopy.login.submit} onPress={handleLogin} />

        <PolicyAgreement checked={policyAgreed} onToggle={() => setPolicyAgreed((prev) => !prev)} />

        <AuthFootLinks
          links={[
            {
              label: authCopy.login.links.phonePassword,
              onPress: () => router.push("/login-phone-password"),
            },
            {
              label: authCopy.login.forgotPassword,
              onPress: () => router.push("/forgot-password?channel=email"),
            },
          ]}
        />

        <AuthSocialButtons
          onGooglePress={() => attemptSocialLogin(policyAgreed)}
          onFacebookPress={() => attemptSocialLogin(policyAgreed)}
        />
      </View>
    </AuthScreen>
  );
}
