import { Pressable, Text, View } from "react-native";
import { useAuthUi } from "@/components/auth/AuthScreen";
import { useAuthStyles } from "@/components/auth/authStyles";

type AuthSwitchLinkProps = {
  prefix: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthSwitchLink({ prefix, actionLabel, onPress }: AuthSwitchLinkProps) {
  const authStyles = useAuthStyles();
  const { variant } = useAuthUi();
  const cinematic = variant === "cinematic";

  return (
    <View style={authStyles.switchLinkRow}>
      <Text style={cinematic ? authStyles.cinematicSwitchPrefix : authStyles.switchLinkPrefix}>
        {prefix}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${prefix}${actionLabel}`}
        onPress={onPress}
        hitSlop={8}
        style={({ pressed }) => [pressed && { opacity: 0.75 }]}
      >
        <Text style={cinematic ? authStyles.cinematicSwitchAction : authStyles.switchLinkAction}>
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}
