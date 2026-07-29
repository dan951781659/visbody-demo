import { Pressable, Text, View } from "react-native";
import { useAuthStyles } from "@/components/auth/authStyles";
import { FacebookLogo, GoogleLogo } from "@/components/auth/SocialBrandIcons";
import { authCopy } from "@/data/authCopy";

type AuthSocialButtonsProps = {
  onGooglePress: () => void;
  onFacebookPress: () => void;
};

export function AuthSocialButtons({ onGooglePress, onFacebookPress }: AuthSocialButtonsProps) {
  const authStyles = useAuthStyles();

  return (
    <View style={authStyles.socialSection}>
      <Text style={authStyles.socialSeparator}>{authCopy.login.social.or}</Text>
      <View style={authStyles.socialRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={authCopy.login.social.google}
          onPress={onGooglePress}
          style={({ pressed }) => [authStyles.socialButton, pressed && { opacity: 0.88 }]}
        >
          <GoogleLogo size={18} />
          <Text style={authStyles.socialButtonText}>Google</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={authCopy.login.social.facebook}
          onPress={onFacebookPress}
          style={({ pressed }) => [authStyles.socialButton, pressed && { opacity: 0.88 }]}
        >
          <FacebookLogo size={18} />
          <Text style={authStyles.socialButtonText}>Facebook</Text>
        </Pressable>
      </View>
    </View>
  );
}
