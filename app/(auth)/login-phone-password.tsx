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
import { validatePassword, validatePhone } from "@/utils/authValidation";

export default function LoginPhonePasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { attemptAccountLogin, attemptSocialLogin } = useAuthLoginFlow();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  const handleLogin = () => {
    const phoneResult = validatePhone(phone);
    if (!phoneResult.ok) {
      showToast(phoneResult.message);
      return;
    }
    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) {
      showToast(passwordResult.message);
      return;
    }
    attemptAccountLogin(phone, "phone", policyAgreed);
  };

  return (
    <AuthScreen
      title={authCopy.pages.phonePassword}
      titleAction={{
        label: authCopy.login.links.phoneCode,
        onPress: () => router.push("/login-phone-code"),
      }}
      onBack={() => router.replace("/(tabs)/profile")}
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.login.phone}>
          <AuthInput
            value={phone}
            onChangeText={setPhone}
            placeholder={authCopy.login.phonePlaceholder}
            keyboardType="number-pad"
            accessibilityLabel={authCopy.login.phone}
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
          />
        </AuthField>

        <AuthPrimaryButton label={authCopy.login.submit} onPress={handleLogin} />

        <PolicyAgreement checked={policyAgreed} onToggle={() => setPolicyAgreed((prev) => !prev)} />

        <AuthFootLinks
          links={[
            {
              label: authCopy.login.links.emailCode,
              onPress: () => router.replace("/login"),
            },
            {
              label: authCopy.login.forgotPassword,
              onPress: () => router.push("/forgot-password?channel=phone"),
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
