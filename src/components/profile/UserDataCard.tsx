import { StyleSheet, Text, View } from "react-native";
import { GlassSurface } from "@/components/GlassSurface";
import { DataMetricGrid } from "@/components/profile/DataMetricGrid";
import { SegmentedControl } from "@/components/profile/SegmentedControl";
import { UserDataSnapshot, UserDataTab } from "@/data/userMock";
import { colors, spacing, typography } from "@/theme";

type UserDataCardProps = {
  activeTab: UserDataTab;
  onTabChange: (tab: UserDataTab) => void;
  sportSnapshot: UserDataSnapshot;
  bodySnapshot: UserDataSnapshot;
};

const tabOptions = [
  { id: "sport" as const, label: "运动数据" },
  { id: "body" as const, label: "体测数据" },
];

export function UserDataCard({
  activeTab,
  onTabChange,
  sportSnapshot,
  bodySnapshot,
}: UserDataCardProps) {
  const snapshot = activeTab === "sport" ? sportSnapshot : bodySnapshot;

  return (
    <GlassSurface contentStyle={styles.card}>
      <SegmentedControl
        options={tabOptions}
        value={activeTab}
        onChange={onTabChange}
        accessibilityLabel="用户数据切换"
      />
      <Text style={styles.updatedAt}>
        {activeTab === "sport" ? "最近7天训练数据：" : `最近更新：${snapshot.updatedAt}`}
      </Text>
      <DataMetricGrid metrics={snapshot.metrics} />
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  updatedAt: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
