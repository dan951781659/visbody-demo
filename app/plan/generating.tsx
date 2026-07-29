import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GenerationProgress } from "@/components/plan/GenerationProgress";
import { colors, layout, spacing, typography } from "@/theme";

export default function GeneratingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>生成训练大纲</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GenerationProgress />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
});
