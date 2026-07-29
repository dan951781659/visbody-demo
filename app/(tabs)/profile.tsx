import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassButton } from "@/components/GlassButton";
import { GlassSurface } from "@/components/GlassSurface";
import { ActivePlanCard, SettingsMenuRow } from "@/components/profile/ProfileCards";
import { TrainingRecordRow } from "@/components/profile/TrainingRecordRow";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { UserDataCard } from "@/components/profile/UserDataCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import {
  activeTrainingPlan,
  bodyDataSnapshot,
  getRecentTrainingRecords,
  settingsMenuItems,
  sportDataSnapshot,
  UserDataTab,
} from "@/data/userMock";
import { authCopy } from "@/data/authCopy";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isLoggedIn, user, logout } = useUser();
  const { clearPendingDeviceLogin } = useTraining();
  const [dataTab, setDataTab] = useState<UserDataTab>("sport");
  const recentRecords = getRecentTrainingRecords(3);

  const showComingSoon = (feature: string) => {
    Alert.alert("即将上线", `${feature} 功能将在后续版本中提供。`);
  };

  const handleLoginPress = () => {
    router.push("/login");
  };

  const handleLogoutPress = () => {
    Alert.alert(authCopy.logout.title, authCopy.logout.message, [
      { text: authCopy.logout.cancel, style: "cancel" },
      {
        text: authCopy.logout.confirm,
        style: "destructive",
        onPress: () => {
          clearPendingDeviceLogin();
          logout();
          showToast(authCopy.toast.logoutSuccess);
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>我的</Text>

        {isLoggedIn && user ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="编辑个人信息"
            onPress={() => router.push("/profile/edit")}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <GlassSurface contentStyle={styles.profileHeader}>
              <UserAvatar
                initials={user.avatarInitials}
                backgroundColor={user.avatarColor}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.nickname}>{user.nickname}</Text>
                <Text style={styles.accountSummary}>{user.accountSummary}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </GlassSurface>
          </Pressable>
        ) : (
          <GlassSurface contentStyle={styles.guestHeader}>
            <UserAvatar initials="?" backgroundColor={colors.surfaceMuted} size={64} />
            <View style={styles.guestInfo}>
              <Text style={styles.guestTitle}>登录后同步训练与体测数据</Text>
              <Text style={styles.guestHint}>登录后可同步训练记录、体测数据与训练计划</Text>
              <View style={styles.authActions}>
                <GlassButton onPress={handleLoginPress} style={styles.authButton}>
                  <Text style={styles.primaryButtonText}>登录</Text>
                </GlassButton>
              </View>
            </View>
          </GlassSurface>
        )}

        {isLoggedIn ? (
          <>
            <View style={styles.section}>
              <SectionHeader title="用户数据" />
              <UserDataCard
                activeTab={dataTab}
                onTabChange={setDataTab}
                sportSnapshot={sportDataSnapshot}
                bodySnapshot={bodyDataSnapshot}
              />
            </View>

            <View style={styles.section}>
              <SectionHeader
                title="最近训练"
                actionLabel="全部记录"
                onActionPress={() => router.push("/profile/training-records")}
              />
              {recentRecords.map((record) => (
                <TrainingRecordRow
                  key={record.id}
                  record={record}
                  onPress={() => router.push(`/profile/training-record/${record.id}`)}
                />
              ))}
            </View>

            <View style={styles.section}>
              <SectionHeader title="当前训练计划" />
              <ActivePlanCard plan={activeTrainingPlan} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="查看全部计划"
                onPress={() => router.push("/plan")}
                style={({ pressed }) => [styles.adjustButton, pressed && styles.pressed]}
              >
                <GlassSurface contentStyle={styles.adjustContent}>
                  <Text style={styles.adjustText}>查看全部计划</Text>
                </GlassSurface>
              </Pressable>
            </View>

            <View style={[styles.section, styles.lastSection]}>
              <SectionHeader title="设置" />
              {settingsMenuItems.map((item) => (
                <SettingsMenuRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  onPress={() => {
                    if (item.id === "training-goals") {
                      router.push("/profile/training-goals");
                      return;
                    }
                    if (item.id === "color-scheme") {
                      router.push("/profile/color-scheme");
                      return;
                    }
                    showComingSoon(item.title);
                  }}
                />
              ))}
              <SettingsMenuRow
                title="退出登录"
                subtitle="退出当前账号"
                icon="log-out-outline"
                destructive
                onPress={handleLogoutPress}
              />
            </View>
          </>
        ) : (
          <View style={[styles.section, styles.lastSection]}>
            <SectionHeader title="设置" />
            <GlassSurface contentStyle={styles.guestSettings}>
              <Text style={styles.guestSettingsTitle}>登录后可查看完整数据</Text>
              <Text style={styles.guestSettingsHint}>训练记录、体测数据与训练计划将在登录后展示</Text>
            </GlassSurface>
            {settingsMenuItems
              .filter(
                (item) =>
                  item.id === "color-scheme" || item.id === "help" || item.id === "about",
              )
              .map((item) => (
                <SettingsMenuRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  onPress={() => {
                    if (item.id === "color-scheme") {
                      router.push("/profile/color-scheme");
                      return;
                    }
                    showComingSoon(item.title);
                  }}
                />
              ))}
          </View>
        )}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: layout.tabScreenBottomInset + spacing.xl,
  },
  pageTitle: {
    ...typography.hero,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  accountSummary: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  guestHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  guestInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  guestTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  guestHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  authActions: {
    marginTop: spacing.sm,
  },
  authButton: {
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    ...typography.label,
    color: colors.accentText,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  lastSection: {
    marginBottom: spacing.lg,
  },
  adjustButton: {
    marginTop: spacing.md,
  },
  adjustContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  adjustText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  guestSettings: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  guestSettingsTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  guestSettingsHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
