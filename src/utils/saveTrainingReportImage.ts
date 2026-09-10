import { Platform } from "react-native";
import type { RefObject } from "react";
import type { View } from "react-native";

export type SaveReportImageResult =
  | { ok: true }
  | {
      ok: false;
      reason: "unsupported" | "permission_denied" | "capture_failed" | "save_failed";
      message: string;
    };

export async function saveTrainingReportLongImage(
  captureRef: RefObject<View | null>,
): Promise<SaveReportImageResult> {
  if (Platform.OS === "web") {
    return {
      ok: false,
      reason: "unsupported",
      message: "当前环境不支持保存到相册，请在 iOS 或 Android 设备上使用",
    };
  }

  if (!captureRef.current) {
    return { ok: false, reason: "capture_failed", message: "报告内容尚未准备好，请稍后重试" };
  }

  try {
    const MediaLibrary = await import("expo-media-library");
    const ViewShot = await import("react-native-view-shot");

    const permission = await MediaLibrary.requestPermissionsAsync(true);
    if (!permission.granted) {
      return {
        ok: false,
        reason: "permission_denied",
        message: "需要相册权限才能保存长图，请在系统设置中开启",
      };
    }

    const uri = await ViewShot.captureRef(captureRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });

    await MediaLibrary.saveToLibraryAsync(uri);
    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: "save_failed",
      message: "保存失败，请稍后重试",
    };
  }
}
