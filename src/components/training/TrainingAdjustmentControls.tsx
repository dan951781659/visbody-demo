import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ResistanceDial } from "@/components/training/ResistanceDial";
import { SegmentControl } from "@/components/training/SegmentControl";
import {
  clampResistance,
  EQUIPMENT_LABELS,
  getAvailableModes,
  getResistanceBounds,
  MODE_LABELS,
} from "@/data/trainingMock";
import { useTheme } from "@/context/ThemeContext";
import { EquipmentType, MotorSide, ResistanceMode, TrainingPreset } from "@/types/training";
import { ColorPalette, spacing, typography } from "@/theme";

type TrainingAdjustmentControlsProps = {
  preset: TrainingPreset;
  onChange: (patch: Partial<TrainingPreset>) => void;
};

/** Shared resistance / mode / equipment controls used by free training and move follow. */
export function TrainingAdjustmentControls({
  preset,
  onChange,
}: TrainingAdjustmentControlsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isPilates = preset.trainingType === "pilates";
  const bounds = getResistanceBounds(preset.trainingType, preset.equipment);
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
      if (preset.activeSide === "left") onChange({ resistanceLeft: next });
      else onChange({ resistanceRight: next });
    } else {
      onChange({ resistanceBarbell: next });
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
    <View style={styles.wrap}>
      <Text style={styles.sectionLabel}>阻力调节</Text>
      {!isPilates && preset.equipment === "nonbarbell" ? (
        <View style={styles.sideRow}>
          <SegmentControl
            options={sideOptions}
            value={preset.activeSide}
            onChange={(side) => onChange({ activeSide: side })}
          />
        </View>
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
        onChange={(mode) => onChange({ mode: mode as ResistanceMode })}
      />

      {!isPilates ? (
        <>
          <Text style={[styles.sectionLabel, styles.sectionGap]}>器械选择</Text>
          <SegmentControl
            options={equipmentOptions}
            value={preset.equipment}
            onChange={(equipment) => onChange({ equipment })}
          />
        </>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    wrap: {
      gap: spacing.md,
    },
    sectionLabel: {
      ...typography.label,
      color: colors.textSecondary,
    },
    sectionGap: {
      marginTop: spacing.sm,
    },
    sideRow: {
      marginBottom: spacing.sm,
    },
  });
}
