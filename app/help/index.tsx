import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

const HELP_PRODUCTS = [
  {
    id: "motionstation",
    name: "MotionStation",
    subtitle: "智能训练运动站",
    icon: "barbell-outline" as const,
  },
];

export default function HelpIndexScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>连接帮助</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hint}>请选择产品型号查看对应连接帮助</Text>
        {HELP_PRODUCTS.map((product) => (
          <Pressable
            key={product.id}
            accessibilityRole="button"
            accessibilityLabel={`${product.name} 连接帮助`}
            onPress={() => router.push(`/help/${product.id}`)}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <GlassSurface contentStyle={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name={product.icon} size={24} color={colors.accent} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{product.name}</Text>
                <Text style={styles.cardSubtitle}>{product.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </GlassSurface>
          </Pressable>
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
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accentGlass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
