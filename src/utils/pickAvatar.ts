import { ActionSheetIOS, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export type AvatarPickSource = "library" | "camera";

async function ensureLibraryPermission(): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) return true;
  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return requested.granted;
}

async function ensureCameraPermission(): Promise<boolean> {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.granted) return true;
  const requested = await ImagePicker.requestCameraPermissionsAsync();
  return requested.granted;
}

async function launchBySource(source: AvatarPickSource): Promise<string | null> {
  if (source === "library") {
    const granted = await ensureLibraryPermission();
    if (!granted) {
      Alert.alert("无法访问相册", "请在系统设置中允许访问照片后再试。");
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]?.uri) return null;
    return result.assets[0].uri;
  }

  if (Platform.OS === "web") {
    Alert.alert("暂不支持拍照", "网页端请使用从相册选择。");
    return null;
  }

  const granted = await ensureCameraPermission();
  if (!granted) {
    Alert.alert("无法使用相机", "请在系统设置中允许使用相机后再试。");
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });
  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
}

/** Shows an action sheet and returns a local image URI, or null if cancelled. */
export function pickAvatarImage(): Promise<string | null> {
  return new Promise((resolve) => {
    const handleChoice = async (source: AvatarPickSource | "cancel") => {
      if (source === "cancel") {
        resolve(null);
        return;
      }
      try {
        const uri = await launchBySource(source);
        resolve(uri);
      } catch {
        Alert.alert("选择失败", "无法获取图片，请稍后重试。");
        resolve(null);
      }
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["从相册选择", "拍照", "取消"],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) void handleChoice("library");
          else if (buttonIndex === 1) void handleChoice("camera");
          else void handleChoice("cancel");
        },
      );
      return;
    }

    Alert.alert("更换头像", "请选择图片来源", [
      { text: "从相册选择", onPress: () => void handleChoice("library") },
      { text: "拍照", onPress: () => void handleChoice("camera") },
      { text: "取消", style: "cancel", onPress: () => void handleChoice("cancel") },
    ]);
  });
}
