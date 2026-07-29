import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import { PolicyAgreement } from "@/components/auth/AuthWidgets";
import { VerificationCodeRow } from "@/components/auth/AuthFormParts";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { authCopy } from "@/data/authCopy";
import { useAuthLoginFlow } from "@/hooks/useAuthLoginFlow";
import { useToast } from "@/components/ToastProvider";
import { validateCode, validateEmail } from "@/utils/authValidation";

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { attemptAccountLogin, attemptSocialLogin } = useAuthLoginFlow();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);

  const handleLogin = () => {
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
    attemptAccountLogin(email, "email", policyAgreed);
  };

  return (
    <AuthScreen
      title={authCopy.login.title}
      titleAction={{
        label: authCopy.login.links.emailPassword,
        onPress: () => router.push("/login-email-password"),
      }}
      onBack={() => router.replace("/(tabs)/profile")}
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.login.email}>
          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder={authCopy.login.emailPlaceholder}
            keyboardType="email-address"
            accessibilityLabel={authCopy.login.email}
          />
        </AuthField>

        <VerificationCodeRow target={email} channel="email" value={code} onChangeText={setCode} />

        <AuthPrimaryButton label={authCopy.login.submit} onPress={handleLogin} />

        <PolicyAgreement checked={policyAgreed} onToggle={() => setPolicyAgreed((prev) => !prev)} />

        <AuthSocialButtons
          onGooglePress={() => attemptSocialLogin(policyAgreed)}
          onFacebookPress={() => attemptSocialLogin(policyAgreed)}
        />
      </View>
    </AuthScreen>
  );
}
