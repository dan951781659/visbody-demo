import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { MultiSelectField } from "@/components/plan/MultiSelectField";
import { StepDots } from "@/components/plan/StepDots";
import { useTheme } from "@/context/ThemeContext";
import { PROFILE_STEP_COUNT, profileSteps } from "@/data/planMock";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

type FormValues = Record<string, string | string[]>;

function createInitialValues(): FormValues {
  const values: FormValues = {};
  profileSteps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.type === "multi" || field.type === "single") {
        values[field.key] = [];
      } else {
        values[field.key] = "";
      }
    });
  });
  return values;
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>(createInitialValues);

  const step = profileSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === PROFILE_STEP_COUNT - 1;

  const setTextValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setArrayValue = (key: string, value: string[]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      router.push("/plan/generating");
      return;
    }
    setStepIndex((prev) => Math.min(PROFILE_STEP_COUNT - 1, prev + 1));
  };

  const handleBack = () => {
    if (isFirst) {
      router.back();
      return;
    }
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={handleBack}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.headerTitle}>完善身体档案</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlassSurface contentStyle={styles.card}>
            <View>
              <Text style={styles.stepBadge}>{`第 ${stepIndex + 1} / ${PROFILE_STEP_COUNT} 步`}</Text>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.subtitle}>{step.subtitle}</Text>
            </View>

            <View style={styles.fields}>
              {step.fields.map((field) => {
                if (field.type === "multi" || field.type === "single") {
                  return (
                    <MultiSelectField
                      key={field.key}
                      label={field.required ? `${field.label} *` : field.label}
                      placeholder={field.placeholder}
                      mode={field.type}
                      value={(values[field.key] as string[]) ?? []}
                      onChange={(next) => setArrayValue(field.key, next)}
                    />
                  );
                }

                return (
                  <View key={field.key} style={styles.field}>
                    <Text style={styles.label}>
                      {field.label}
                      {field.required ? " *" : ""}
                    </Text>
                    <TextInput
                      value={(values[field.key] as string) ?? ""}
                      onChangeText={(text) => setTextValue(field.key, text)}
                      placeholder={field.placeholder}
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      multiline={field.multiline}
                      accessibilityLabel={field.label}
                      style={[styles.input, field.multiline && styles.inputMultiline]}
                    />
                  </View>
                );
              })}
            </View>
          </GlassSurface>
        </ScrollView>

        <View style={styles.footer}>
          <StepDots total={PROFILE_STEP_COUNT} current={stepIndex} />
          <View style={[styles.actions, isFirst && styles.actionsCentered]}>
            {!isFirst ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="上一步"
                onPress={handleBack}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryButtonText}>上一步</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isLast ? "生成训练大纲" : "下一步"}
              onPress={handleNext}
              style={({ pressed }) => [
                styles.primaryButton,
                isFirst && styles.primaryButtonCentered,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>{isLast ? "生成训练大纲" : "下一步"}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
  },
  card: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  stepBadge: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  fields: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.glassBorder,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionsCentered: {
    justifyContent: "center",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassHighlight,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },
  secondaryButtonText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  primaryButton: {
    flex: 1.4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },
  primaryButtonCentered: {
    flex: 0,
    alignSelf: "center",
    minWidth: 200,
    paddingHorizontal: spacing.xxxl,
  },
  primaryButtonText: {
    ...typography.subtitle,
    color: colors.accentText,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
