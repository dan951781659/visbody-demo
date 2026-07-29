import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useAuthStyles } from "@/components/auth/authStyles";
import { useTheme } from "@/context/ThemeContext";
import { authCopy } from "@/data/authCopy";

type PolicyAgreementProps = {
  checked: boolean;
  onToggle: () => void;
};

export function PolicyAgreement({ checked, onToggle }: PolicyAgreementProps) {
  const authStyles = useAuthStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="用户协议与隐私政策"
      onPress={onToggle}
      style={authStyles.policyRow}
    >
      <View style={[authStyles.checkbox, checked && authStyles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color={colors.accentText} /> : null}
      </View>
      <Text style={authStyles.policyText}>
        {authCopy.policy.prefix}
        <Text style={authStyles.policyLink}>{authCopy.policy.userAgreement}</Text>
        {authCopy.policy.connector}
        <Text style={authStyles.policyLink}>{authCopy.policy.privacyPolicy}</Text>
        {authCopy.policy.suffix}
      </Text>
    </Pressable>
  );
}
