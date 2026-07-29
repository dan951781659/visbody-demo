import { Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

type UserAvatarProps = {
  initials: string;
  backgroundColor?: string;
  size?: number;
  imageUri?: string | null;
};

export function UserAvatar({
  initials,
  backgroundColor = colors.green,
  size = 72,
  imageUri,
}: UserAvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: "hidden",
  },
  initials: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: "700",
  },
});
