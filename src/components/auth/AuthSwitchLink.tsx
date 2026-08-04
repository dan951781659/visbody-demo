import { Pressable, Text, View } from "react-native";
import { useAuthStyles } from "@/components/auth/authStyles";

type AuthSwitchLinkProps = {
  prefix: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthSwitchLink({ prefix, actionLabel, onPress }: AuthSwitchLinkProps) {
  const authStyles = useAuthStyles();

  return (
    <View style={authStyles.switchLinkRow}>
      <Text style={authStyles.switchLinkPrefix}>{prefix}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${prefix}${actionLabel}`}
        onPress={onPress}
        hitSlop={8}
        style={({ pressed }) => [pressed && { opacity: 0.75 }]}
      >
        <Text style={authStyles.switchLinkAction}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
