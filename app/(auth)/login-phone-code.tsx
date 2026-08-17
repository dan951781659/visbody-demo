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
import { VerificationCodeRow } from "@/components/auth/AuthFormParts";
import { authCopy } from "@/data/authCopy";
import { useAuthLoginFlow } from "@/hooks/useAuthLoginFlow";
import { useToast } from "@/components/ToastProvider";
import { validateCode, validatePhone } from "@/utils/authValidation";

export default function LoginPhoneCodeScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { attemptAccountLogin } = useAuthLoginFlow();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);

  const handleLogin = () => {
    const phoneResult = validatePhone(phone);
    if (!phoneResult.ok) {
      showToast(phoneResult.message);
      return;
    }
    const codeResult = validateCode(code);
    if (!codeResult.ok) {
      showToast(codeResult.message);
      return;
    }
    attemptAccountLogin(phone, "phone", policyAgreed);
  };

  return (
    <AuthScreen
      title={authCopy.pages.phoneCode}
      titleAction={{
        label: authCopy.login.links.phonePassword,
        onPress: () => router.replace("/login-phone-password"),
      }}
      onBack={() => router.replace("/(tabs)/profile")}
      variant="cinematic"
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.login.phone}>
          <AuthInput
            value={phone}
            onChangeText={setPhone}
            placeholder={authCopy.login.phonePlaceholder}
            keyboardType="number-pad"
            accessibilityLabel={authCopy.login.phone}
            icon="call-outline"
          />
        </AuthField>

        <VerificationCodeRow
          target={phone}
          channel="phone"
          value={code}
          onChangeText={setCode}
        />

        <AuthPrimaryButton label={authCopy.login.submit} onPress={handleLogin} />

        <PolicyAgreement checked={policyAgreed} onToggle={() => setPolicyAgreed((prev) => !prev)} />

        <AuthFootLinks
          links={[
            {
              label: authCopy.login.links.accountPassword,
              onPress: () => router.replace("/login-email-password"),
            },
          ]}
        />
      </View>
    </AuthScreen>
  );
}
