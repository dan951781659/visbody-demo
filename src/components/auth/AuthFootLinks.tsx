import { View } from "react-native";
import { AuthLinkButton } from "@/components/auth/AuthScreen";
import { useAuthStyles } from "@/components/auth/authStyles";

export type AuthFootLink = {
  label: string;
  onPress: () => void;
};

export function AuthFootLinks({ links }: { links: AuthFootLink[] }) {
  const authStyles = useAuthStyles();
  return (
    <View style={authStyles.footLinksWrap}>
      {links.map((link) => (
        <AuthLinkButton key={link.label} label={link.label} onPress={link.onPress} />
      ))}
    </View>
  );
}
