import { useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { colors, spacing, typography } from "@/theme";

type VideoPlayerScreenProps = {
  title: string;
  mediaUri?: string;
  immersive?: boolean;
  onClose: () => void;
};

export function VideoPlayerScreen({
  title,
  mediaUri,
  immersive = false,
  onClose,
}: VideoPlayerScreenProps) {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    async function lockOrientation() {
      if (!immersive || Platform.OS === "web") return;
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch {
        /* ignore unsupported platforms */
      }
    }

    lockOrientation();

    return () => {
      if (!immersive || Platform.OS === "web") return;
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, [immersive]);

  const hasMedia = Boolean(mediaUri);

  return (
    <SafeAreaView style={[styles.safeArea, immersive && styles.immersive]} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={onClose}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.playerWrap}>
        {hasMedia ? (
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: mediaUri! }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
        ) : (
          <View style={styles.fallback}>
            <Ionicons name="videocam-off-outline" size={42} color={colors.textMuted} />
            <Text style={styles.fallbackTitle}>视频暂不可用</Text>
            <Text style={styles.fallbackHint}>
              训练视频素材尚未添加。播放器已就绪，后续补充视频资源即可直接播放。
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  immersive: {
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    ...typography.subtitle,
    flex: 1,
    color: colors.textPrimary,
    textAlign: "center",
  },
  playerWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
  },
  fallbackTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  fallbackHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
