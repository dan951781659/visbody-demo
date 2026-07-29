import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GlassButton } from "@/components/GlassButton";
import { GlassSurface } from "@/components/GlassSurface";
import { ResistanceDial } from "@/components/training/ResistanceDial";
import { SegmentControl } from "@/components/training/SegmentControl";
import {
  clampResistance,
  EQUIPMENT_LABELS,
  getAvailableModes,
  getResistanceBounds,
  MODE_LABELS,
  TRAINING_TYPE_LABELS,
} from "@/data/trainingMock";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { EquipmentType, MotorSide, ResistanceMode } from "@/types/training";
import { ColorPalette, spacing, typography } from "@/theme";

type PresetFormProps = {
  searching?: boolean;
  onStartPress: () => void;
};

export function PresetForm({ searching = false, onStartPress }: PresetFormProps) {
  const { preset, updatePreset } = useTraining();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const bounds = useMemo(() => {
    if (!preset) return { min: 1, max: 100, step: 1 };
    return getResistanceBounds(preset.trainingType, preset.equipment);
  }, [preset]);

  if (!preset) return null;

  const isPilates = preset.trainingType === "pilates";
  const modes = getAvailableModes(preset.trainingType);
  const currentResistance =
    isPilates || preset.equipment === "nonbarbell"
      ? preset.activeSide === "left"
        ? preset.resistanceLeft
        : preset.resistanceRight
      : preset.resistanceBarbell;

  const adjustResistance = (delta: number) => {
    const next = clampResistance(currentResistance + delta, bounds);
    if (isPilates || preset.equipment === "nonbarbell") {
      if (preset.activeSide === "left") {
        updatePreset({ resistanceLeft: next });
      } else {
        updatePreset({ resistanceRight: next });
      }
    } else {
      updatePreset({ resistanceBarbell: next });
    }
  };

  const modeOptions = modes.map((mode) => ({
    value: mode,
    label: MODE_LABELS[mode],
  }));

  const equipmentOptions: { value: EquipmentType; label: string }[] = [
    { value: "barbell", label: EQUIPMENT_LABELS.barbell },
    { value: "nonbarbell", label: EQUIPMENT_LABELS.nonbarbell },
  ];

  const sideOptions: { value: MotorSide; label: string }[] = [
    { value: "left", label: "左侧" },
    { value: "right", label: "右侧" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <GlassSurface contentStyle={styles.card}>
        <Text style={styles.trainingType}>{TRAINING_TYPE_LABELS[preset.trainingType]}</Text>
        <Text style={styles.sectionLabel}>阻力调节</Text>
        {!isPilates && preset.equipment === "nonbarbell" ? (
          <SegmentControl
            options={sideOptions}
            value={preset.activeSide}
            onChange={(side) => updatePreset({ activeSide: side })}
          />
        ) : null}
        <ResistanceDial
          value={currentResistance}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          onIncrease={() => adjustResistance(bounds.step)}
          onDecrease={() => adjustResistance(-bounds.step)}
        />

        <Text style={[styles.sectionLabel, styles.sectionGap]}>模式选择</Text>
        <SegmentControl
          options={modeOptions}
          value={preset.mode}
          onChange={(mode) => updatePreset({ mode: mode as ResistanceMode })}
        />

        {!isPilates ? (
          <>
            <Text style={[styles.sectionLabel, styles.sectionGap]}>器械选择</Text>
            <SegmentControl
              options={equipmentOptions}
              value={preset.equipment}
              onChange={(equipment) => updatePreset({ equipment })}
            />
          </>
        ) : null}
      </GlassSurface>

      <GlassButton onPress={onStartPress} style={styles.startButton}>
        <Text style={styles.startText}>{searching ? "正在搜索设备…" : "开始训练"}</Text>
      </GlassButton>
    </ScrollView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  trainingType: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  sectionGap: {
    marginTop: spacing.sm,
  },
  startButton: {
    marginTop: spacing.sm,
  },
  startText: {
    ...typography.subtitle,
    color: colors.accentText,
    textAlign: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  });
}
