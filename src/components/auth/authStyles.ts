import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

export function createAuthStyles(colors: ColorPalette) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  headerBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  localeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surfaceElevated,
  },
  localeButtonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  localeButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  card: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titleFlex: {
    flex: 1,
  },
  titleAction: {
    flexShrink: 0,
    paddingVertical: spacing.xs,
  },
  titleActionText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "600",
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  separator: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  sublabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  inputFlex: {
    flex: 1,
  },
  primaryButton: {
    marginTop: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },
  primaryButtonText: {
    ...typography.subtitle,
    color: colors.accentText,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
    minWidth: 108,
  },
  secondaryButtonDisabled: {
    opacity: 0.55,
  },
  secondaryButtonText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  linkButton: {
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.caption,
    color: colors.accent,
  },
  footLinksWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  switchLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  switchLinkPrefix: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  switchLinkAction: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "600",
  },
  socialSection: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  socialSeparator: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surfaceElevated,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  socialButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  quickLoginCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surfaceElevated,
  },
  quickLoginAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLoginAvatarText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  quickLoginMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  quickLoginName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  quickLoginHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  methodTabs: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  methodTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  methodTabActive: {
    backgroundColor: colors.surfaceElevated,
  },
  methodTabText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  methodTabTextActive: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  policyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  policyText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  policyLink: {
    color: colors.accent,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dateRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  datePart: {
    flex: 1,
    gap: spacing.xs,
  },
  selectButton: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
    justifyContent: "center",
  },
  selectButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  unitToggle: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  unitButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  unitButtonActive: {
    backgroundColor: colors.accentGlass,
    borderColor: colors.accent,
  },
  unitButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  unitButtonTextActive: {
    color: colors.accent,
    fontWeight: "600",
  },
  genderRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  genderOptionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentGlass,
  },
  genderOptionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  genderOptionTextActive: {
    color: colors.accent,
    fontWeight: "600",
  },
  scanEntryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surfaceElevated,
  },
  scanEntryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentGlass,
  },
  scanEntryMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  scanEntryTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  scanEntryHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scanBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.xxl,
  },
  scanHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  scanFrame: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  scanFrameCorner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: colors.accent,
  },
  scanFrameCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scanFrameCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  scanFrameCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  scanFrameCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanQrPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  scanLine: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.9,
  },
});
}

export function useAuthStyles() {
  const { colors } = useTheme();
  return useMemo(() => createAuthStyles(colors), [colors]);
}
