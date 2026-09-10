import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { useTheme } from "@/context/ThemeContext";
import { spacing } from "@/theme";

type ReportActionIconsProps = {
  saving?: boolean;
  onSaveLongImage?: () => void;
};

export function ReportActionIcons({ saving = false, onSaveLongImage }: ReportActionIconsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <GlassIconButton
        accessibilityLabel={saving ? "正在保存长图" : "保存长图到本地"}
        disabled={saving || !onSaveLongImage}
        onPress={onSaveLongImage}
      >
        <Ionicons
          name={saving ? "hourglass-outline" : "download-outline"}
          size={20}
          color={saving || !onSaveLongImage ? colors.textMuted : colors.textPrimary}
        />
      </GlassIconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
