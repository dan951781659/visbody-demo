import { Action as DemoAction, useCopy } from "@/components/onboarding/DemoUI";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  APP_EDITION_LABELS,
  APP_VERSION,
  AppEdition,
  bodyDataSnapshot,
  getRecentTrainingRecords,
  settingsMenuItems,
  trainingRecords,
  UserDataTab,
} from "@/data/userMock";
import { authCopy } from "@/data/authCopy";
import { ColorPalette, getAtmosphereGradient, layout, radius, spacing, typography } from "@/theme";
import { confirmAction } from "@/utils/confirmAction";
import { buildRecentSevenDaySportSnapshot } from "@/utils/trainingRecordStats";

const APP_EDITION_KEY = "motionstation.appEdition";

type AboutPanel = "menu" | "version" | "edition";

export default function ProfileScreen() {
  const router = useRouter();
  const t = useCopy();
  const { showToast } = useToast();
  const { colors, schemeId } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const atmosphereGradient = getAtmosphereGradient(schemeId);
  const { isLoggedIn, user, logout } = useUser();
  const { clearPendingDeviceLogin } = useTraining();
  const [dataTab, setDataTab] = useState<UserDataTab>("sport");
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [aboutPanel, setAboutPanel] = useState<AboutPanel>("menu");
  const [appEdition, setAppEdition] = useState<AppEdition>("standard");
  const recentRecords = getRecentTrainingRecords(3);
  const sportSnapshot = useMemo(
    () => buildRecentSevenDaySportSnapshot(trainingRecords),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(APP_EDITION_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored === "standard" || stored === "overseas") {
          setAppEdition(stored);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoginPress = () => {
    router.push("/login");
  };

  const handleLogoutPress = () => {
    confirmAction({
      title: authCopy.logout.title,
      message: authCopy.logout.message,
      confirmLabel: authCopy.logout.confirm,
      cancelLabel: authCopy.logout.cancel,
      destructive: true,
      onConfirm: () => {
        clearPendingDeviceLogin();
        logout();
        showToast(authCopy.toast.logoutSuccess);
        router.replace("/login");
      },
    });
  };

  const openAbout = () => {
    setAboutPanel("menu");
    setAboutVisible(true);
  };

  const closeAbout = () => {
    setAboutVisible(false);
    setAboutPanel("menu");
  };

  const selectEdition = (edition: AppEdition) => {
    setAppEdition(edition);
    AsyncStorage.setItem(APP_EDITION_KEY, edition).catch(() => undefined);
    showToast(`已切换为${APP_EDITION_LABELS[edition]}`);
  };

  const handleSettingsPress = (itemId: string) => {
    if (itemId === "favorites") {
      router.push("/content/favorites");
      return;
    }
    if (itemId === "training-goals") {
      router.push("/profile/training-goals");
      return;
    }
    if (itemId === "privacy") {
      router.push("/legal?kind=privacy");
      return;
    }
    if (itemId === "about") {
      openAbout();
    }
  };

  const guestSettings = settingsMenuItems.filter(
    (item) => item.id === "favorites" || item.id === "about",
  );

  return (
    <LinearGradient colors={[...atmosphereGradient]} style={styles.safeArea}>
      <SafeAreaView style={styles.transparent} edges={["top"]}>
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
                  sportSnapshot={sportSnapshot}
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
                <DemoAction secondary label={t("权限与流程演示", "Permissions & demo")} onPress={() => router.push("/permissions")} />
                {settingsMenuItems.map((item) => (
                  <SettingsMenuRow
                    key={item.id}
                    title={
                      item.id === "about"
                        ? `${item.title}（${APP_EDITION_LABELS[appEdition]}）`
                        : item.title
                    }
                    icon={item.icon}
                    onPress={() => handleSettingsPress(item.id)}
                  />
                ))}
                <SettingsMenuRow
                  title="退出登录"
                  icon="log-out-outline"
                  destructive
                  onPress={handleLogoutPress}
                />
              </View>
            </>
          ) : (
            <View style={[styles.section, styles.lastSection]}>
              <SectionHeader title="设置" />
                <DemoAction secondary label={t("权限与流程演示", "Permissions & demo")} onPress={() => router.push("/permissions")} />
              <GlassSurface contentStyle={styles.guestSettings}>
                <Text style={styles.guestSettingsTitle}>登录后可查看完整数据</Text>
                <Text style={styles.guestSettingsHint}>训练记录、体测数据与训练计划将在登录后展示</Text>
              </GlassSurface>
              {guestSettings.map((item) => (
                <SettingsMenuRow
                  key={item.id}
                  title={
                    item.id === "about"
                      ? `${item.title}（${APP_EDITION_LABELS[appEdition]}）`
                      : item.title
                  }
                  icon={item.icon}
                  onPress={() => handleSettingsPress(item.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        transparent
        visible={privacyVisible}
        animationType="fade"
        onRequestClose={() => setPrivacyVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>隐私与安全</Text>
            <Text style={styles.modalBody}>
              此处内容为用户隐私协议。我们重视你的个人信息保护，仅在提供训练与设备服务所必需的范围内处理数据。完整协议将在正式版本中提供。
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="关闭"
              onPress={() => setPrivacyVisible(false)}
              style={({ pressed }) => [styles.modalPrimary, pressed && styles.pressed]}
            >
              <Text style={styles.modalPrimaryText}>知道了</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={aboutVisible} animationType="fade" onRequestClose={closeAbout}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            {aboutPanel === "menu" ? (
              <>
                <Text style={styles.modalTitle}>关于 APP</Text>
                <Text style={styles.modalHint}>当前版本：{APP_EDITION_LABELS[appEdition]}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="版本信息"
                  onPress={() => setAboutPanel("version")}
                  style={({ pressed }) => [styles.aboutRow, pressed && styles.pressed]}
                >
                  <Text style={styles.aboutRowTitle}>版本信息</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="切换版本"
                  onPress={() => setAboutPanel("edition")}
                  style={({ pressed }) => [styles.aboutRow, pressed && styles.pressed]}
                >
                  <View style={styles.aboutRowCopy}>
                    <Text style={styles.aboutRowTitle}>切换版本</Text>
                    <Text style={styles.aboutRowMeta}>{APP_EDITION_LABELS[appEdition]}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="关闭"
                  onPress={closeAbout}
                  style={({ pressed }) => [styles.modalSecondary, pressed && styles.pressed]}
                >
                  <Text style={styles.modalSecondaryText}>关闭</Text>
                </Pressable>
              </>
            ) : null}

            {aboutPanel === "version" ? (
              <>
                <Text style={styles.modalTitle}>版本信息</Text>
                <Text style={styles.modalBody}>当前 App 版本为 {APP_VERSION}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="返回"
                  onPress={() => setAboutPanel("menu")}
                  style={({ pressed }) => [styles.modalPrimary, pressed && styles.pressed]}
                >
                  <Text style={styles.modalPrimaryText}>返回</Text>
                </Pressable>
              </>
            ) : null}

            {aboutPanel === "edition" ? (
              <>
                <Text style={styles.modalTitle}>切换版本</Text>
                <Text style={styles.modalHint}>当前：{APP_EDITION_LABELS[appEdition]}</Text>
                {(["standard", "overseas"] as AppEdition[]).map((edition) => {
                  const selected = appEdition === edition;
                  return (
                    <Pressable
                      key={edition}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={APP_EDITION_LABELS[edition]}
                      onPress={() => selectEdition(edition)}
                      style={({ pressed }) => [
                        styles.editionRow,
                        selected && styles.editionRowSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.editionRowText,
                          selected && styles.editionRowTextSelected,
                        ]}
                      >
                        {APP_EDITION_LABELS[edition]}
                      </Text>
                      {selected ? (
                        <Ionicons name="checkmark" size={18} color={colors.accentText} />
                      ) : null}
                    </Pressable>
                  );
                })}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="返回"
                  onPress={() => setAboutPanel("menu")}
                  style={({ pressed }) => [styles.modalSecondary, pressed && styles.pressed]}
                >
                  <Text style={styles.modalSecondaryText}>返回</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    transparent: {
      flex: 1,
      backgroundColor: "transparent",
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
    modalBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    modalPanel: {
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: spacing.lg,
      gap: spacing.md,
    },
    modalTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    modalBody: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    modalHint: {
      ...typography.caption,
      color: colors.textMuted,
    },
    modalPrimary: {
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
    },
    modalPrimaryText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    modalSecondary: {
      minHeight: 44,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    modalSecondaryText: {
      ...typography.label,
      color: colors.textPrimary,
    },
    aboutRow: {
      minHeight: 52,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    aboutRowCopy: {
      flex: 1,
      gap: 2,
    },
    aboutRowTitle: {
      ...typography.body,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    aboutRowMeta: {
      ...typography.caption,
      fontSize: 13,
      color: colors.accent,
    },
    editionRow: {
      minHeight: 48,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    editionRowSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    editionRowText: {
      ...typography.body,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    editionRowTextSelected: {
      color: colors.accentText,
    },
  });
}
