import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FreeTrainingOption } from "@/types/training";
import { colors, radius, spacing, typography } from "@/theme";

type TrainingModeCardProps = {
  option: FreeTrainingOption;
  onPress: () => void;
};

export function TrainingModeCard({ option, onPress }: TrainingModeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient colors={option.gradient} style={styles.gradient}>
        <View style={styles.iconWrap}>
          <Ionicons name={option.icon} size={24} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.subtitle}>{option.subtitle}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    minHeight: 120,
  },
  gradient: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "flex-end",
    minHeight: 120,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: "rgba(255,255,255,0.75)",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
