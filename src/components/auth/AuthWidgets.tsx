import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useAuthUi } from "@/components/auth/AuthScreen";
import { useAuthStyles } from "@/components/auth/authStyles";
import { useTheme } from "@/context/ThemeContext";
import { authCopy } from "@/data/authCopy";

type PolicyAgreementProps = {
  checked: boolean;
  onToggle: () => void;
};

export function PolicyAgreement({ checked, onToggle }: PolicyAgreementProps) {
  const router = useRouter();
  const authStyles = useAuthStyles();
  const { colors } = useTheme();
  const { variant } = useAuthUi();
  const cinematic = variant === "cinematic";

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="用户协议与隐私政策"
      onPress={onToggle}
      style={authStyles.policyRow}
    >
      <View
        style={[
          cinematic ? authStyles.cinematicCheckbox : authStyles.checkbox,
          checked && authStyles.checkboxChecked,
          cinematic && checked && { backgroundColor: colors.accent, borderColor: colors.accent },
        ]}
      >
        {checked ? (
          <Ionicons name="checkmark" size={14} color={colors.accentText} />
        ) : null}
      </View>
      <Text style={cinematic ? authStyles.cinematicPolicyText : authStyles.policyText}>
        {authCopy.policy.prefix}
        <Text onPress={(event) => { event.stopPropagation(); router.push("/legal?kind=terms"); }} style={cinematic ? authStyles.cinematicPolicyLink : authStyles.policyLink}>
          {authCopy.policy.userAgreement}
        </Text>
        {authCopy.policy.connector}
        <Text onPress={(event) => { event.stopPropagation(); router.push("/legal?kind=privacy"); }} style={cinematic ? authStyles.cinematicPolicyLink : authStyles.policyLink}>
          {authCopy.policy.privacyPolicy}
        </Text>
        {authCopy.policy.suffix}
      </Text>
    </Pressable>
  );
}
