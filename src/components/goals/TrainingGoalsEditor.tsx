import { StyleSheet, View } from "react-native";
import { GlassSurface } from "@/components/GlassSurface";
import { NumericStepper } from "@/components/goals/NumericStepper";
import { GOAL_BOUNDS, TrainingGoals } from "@/types/userGoals";
import { spacing } from "@/theme";

type TrainingGoalsEditorProps = {
  value: TrainingGoals;
  onChange: (next: TrainingGoals) => void;
};

export function TrainingGoalsEditor({ value, onChange }: TrainingGoalsEditorProps) {
  return (
    <View style={styles.stack}>
      <GlassSurface contentStyle={styles.card}>
        <NumericStepper
          label="每日锻炼时长"
          value={value.dailyDurationMinutes}
          unit="分钟"
          min={GOAL_BOUNDS.duration.min}
          max={GOAL_BOUNDS.duration.max}
          step={GOAL_BOUNDS.duration.step}
          decreaseAccessibilityLabel="减少每日锻炼时长"
          increaseAccessibilityLabel="增加每日锻炼时长"
          onChange={(dailyDurationMinutes) => onChange({ ...value, dailyDurationMinutes })}
        />
      </GlassSurface>

      <GlassSurface contentStyle={styles.card}>
        <NumericStepper
          label="每日运动卡路里"
          value={value.dailyCaloriesKcal}
          unit="千卡"
          min={GOAL_BOUNDS.calories.min}
          max={GOAL_BOUNDS.calories.max}
          step={GOAL_BOUNDS.calories.step}
          decreaseAccessibilityLabel="减少每日运动卡路里"
          increaseAccessibilityLabel="增加每日运动卡路里"
          onChange={(dailyCaloriesKcal) => onChange({ ...value, dailyCaloriesKcal })}
        />
      </GlassSurface>

      <GlassSurface contentStyle={styles.card}>
        <NumericStepper
          label="每周运动频次"
          value={value.weeklyFrequency}
          unit="次"
          min={GOAL_BOUNDS.frequency.min}
          max={GOAL_BOUNDS.frequency.max}
          step={GOAL_BOUNDS.frequency.step}
          decreaseAccessibilityLabel="减少每周运动频次"
          increaseAccessibilityLabel="增加每周运动频次"
          onChange={(weeklyFrequency) => onChange({ ...value, weeklyFrequency })}
        />
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
});
