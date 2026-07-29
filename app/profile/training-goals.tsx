import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TrainingGoalsEditor } from "@/components/goals/TrainingGoalsEditor";
import { GlassButton } from "@/components/GlassButton";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { normalizeTrainingGoals } from "@/types/userGoals";
import { ColorPalette, layout, spacing, typography } from "@/theme";

export default function TrainingGoalsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { trainingGoals, updateTrainingGoals } = useUser();
  const [draft, setDraft] = useState(() => normalizeTrainingGoals(trainingGoals));

  const handleSave = () => {
    updateTrainingGoals(draft);
    showToast(authCopy.trainingGoals.saved);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="返回"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>{authCopy.trainingGoals.title}</Text>
          <Text style={styles.subtitle}>{authCopy.trainingGoals.subtitle}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TrainingGoalsEditor value={draft} onChange={setDraft} />

        <GlassButton onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>{authCopy.trainingGoals.save}</Text>
        </GlassButton>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  saveButton: {
    alignSelf: "stretch",
  },
  saveText: {
    ...typography.label,
    color: colors.accentText,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
