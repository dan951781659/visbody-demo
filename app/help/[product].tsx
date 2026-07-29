import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

const PRODUCT_TITLES: Record<string, string> = {
  motionstation: "MotionStation",
  visbody: "Visbody",
};

const HELP_CARDS = [
  {
    id: "how-to-connect",
    title: "如何连接",
    placeholder: "解决方案文档即将上线。请确认设备已开机并处于可被发现状态。",
    icon: "link-outline" as const,
  },
  {
    id: "not-found",
    title: "找不到设备",
    placeholder: "解决方案文档即将上线。请检查设备与手机是否在同一网络环境。",
    icon: "search-outline" as const,
  },
  {
    id: "timeout",
    title: "连接超时",
    placeholder: "解决方案文档即将上线。请靠近设备后重试，或重启设备后再连接。",
    icon: "time-outline" as const,
  },
];

export default function HelpProductScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { product } = useLocalSearchParams<{ product: string }>();
  const productName = PRODUCT_TITLES[product ?? ""] ?? "设备";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title} numberOfLines={1}>
          {productName} 连接帮助
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {HELP_CARDS.map((card) => (
          <GlassSurface key={card.id} contentStyle={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name={card.icon} size={22} color={colors.accent} />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
            <Text style={styles.cardBody}>{card.placeholder}</Text>
          </GlassSurface>
        ))}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentGlass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    flex: 1,
  },
  cardBody: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  });
}
