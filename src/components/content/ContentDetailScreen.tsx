import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ContentDetailActions } from "@/components/content/ContentDetailActions";
import { ContentMoreMenu } from "@/components/content/ContentMoreMenu";
import { ContentTagRow } from "@/components/content/ContentTagRow";
import { DetailAccordion } from "@/components/content/DetailAccordion";
import { PlanScheduleBrowser } from "@/components/content/PlanScheduleBrowser";
import { GlassIconButton } from "@/components/GlassIconButton";
import { useTheme } from "@/context/ThemeContext";
import { formatLibraryValue, getItemById } from "@/data/exploreLibrary";
import type { LibraryTab } from "@/types/content";
import { ColorPalette, layout, spacing, typography } from "@/theme";
import type { MetaChipStyle } from "@/theme/metaChip";

type ContentDetailScreenProps = {
  type: LibraryTab;
  id: string;
};

type DetailTag = { label: string; value: string; style: MetaChipStyle };

export function ContentDetailScreen({ type, id }: ContentDetailScreenProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const item = useMemo(() => getItemById(type, id), [type, id]);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>未找到内容</Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.emptyAction}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isPlan = item.kind === "plan";
  const description = isPlan ? item.intro : item.description;
  const previewText =
    expanded || description.length <= 120
      ? description
      : `${description.slice(0, 120).trim()}...`;

  const tags: DetailTag[] =
    item.kind === "plan"
      ? [
          { label: "场景", value: formatLibraryValue(item.scene), style: "Scene" },
          { label: "周期", value: formatLibraryValue(item.cycleWeeks), style: "Cycle" },
          { label: "频次", value: formatLibraryValue(item.sessionsPerWeek), style: "Count" },
          { label: "难度", value: formatLibraryValue(item.difficulty), style: "Difficulty" },
          { label: "目标", value: formatLibraryValue(item.targetArea), style: "Muscles" },
          ...(item.isPersonalized
            ? [{ label: "计划类型", value: "个性化", style: "Personalized" as const }]
            : []),
        ]
      : [
          { label: "场景", value: formatLibraryValue(item.scene), style: "Scene" },
          { label: "难度", value: formatLibraryValue(item.difficulty), style: "Difficulty" },
          { label: "器械", value: formatLibraryValue(item.equipment), style: "Equipment" },
          { label: "目标", value: formatLibraryValue(item.targetArea), style: "Muscles" },
          ...(item.kind === "move" && item.supportsAi
            ? [{ label: "AI", value: "支持", style: "AI" as const }]
            : item.kind === "aiMove"
              ? [{ label: "AI", value: "指导", style: "AI" as const }]
              : []),
        ];

  const openPreview = () => {
    router.push({
      pathname: "/preview/[id]",
      params: { id: item.id, type, title: item.name },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrap}>
          <LinearGradient colors={item.gradient} style={styles.hero} />
          <SafeAreaView edges={["top"]} style={styles.heroOverlay}>
            <View style={styles.heroControls}>
              <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
              </GlassIconButton>
              <GlassIconButton
                accessibilityLabel="更多选项"
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
              </GlassIconButton>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{item.name}</Text>
          {item.kind !== "plan" ? (
            <Text style={styles.instructor}>
              {item.kind === "aiMove" ? "AI 指导训练" : "动作库"}
            </Text>
          ) : null}

          <Text style={styles.metaLine}>
            {isPlan
              ? `${formatLibraryValue(item.cycleWeeks)} · ${formatLibraryValue(item.sessionsPerWeek)} · ${formatLibraryValue(item.scene)}`
              : `${item.durationMinutes ?? 10} 分钟 · ${formatLibraryValue(item.scene)} · ${formatLibraryValue(item.difficulty)}`}
          </Text>

          <ContentTagRow tags={tags} />
          {!isPlan ? (
            <ContentDetailActions
              onPreview={openPreview}
              startTrainingDisabled
              primaryNotice={
                item.kind === "aiMove"
                  ? "AI 动作需要借助设备相机进行动作识别"
                  : undefined
              }
            />
          ) : null}

          <Text style={styles.description}>{previewText}</Text>
          {description.length > 120 ? (
            <Pressable accessibilityRole="button" onPress={() => setExpanded((value) => !value)}>
              <Text style={styles.moreLink}>{expanded ? "收起" : "更多"}</Text>
            </Pressable>
          ) : null}

          {item.kind === "plan" ? (
            <View style={styles.section}>
              <PlanScheduleBrowser schedule={item.schedule} />
            </View>
          ) : (
            <View style={styles.section}>
              <DetailAccordion
                items={[
                  {
                    id: "keypoints",
                    title: "执行要点",
                    defaultOpen: true,
                    content: item.keyPoints.map((point) => (
                      <Text key={point} style={styles.bullet}>
                        • {point}
                      </Text>
                    )),
                  },
                  {
                    id: "breathing",
                    title: "呼吸",
                    content: <Text style={styles.bullet}>{item.breathing}</Text>,
                  },
                  {
                    id: "mistakes",
                    title: "常见错误",
                    content: item.commonMistakes.map((mistake) => (
                      <Text key={mistake} style={styles.bullet}>
                        • {mistake}
                      </Text>
                    )),
                  },
                  {
                    id: "installation",
                    title: "安装示意",
                    content: <Text style={styles.bullet}>暂无安装示意</Text>,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <ContentMoreMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: layout.bottomNavHeight,
  },
  heroWrap: {
    height: 320,
    backgroundColor: colors.surface,
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
  },
  heroControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  body: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
  },
  instructor: {
    ...typography.subtitle,
    fontSize: 18,
    color: colors.accent,
  },
  metaLine: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  moreLink: {
    ...typography.label,
    color: colors.textPrimary,
  },
  section: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  bullet: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  emptyAction: {
    ...typography.body,
    color: colors.accent,
  },
  });
}
