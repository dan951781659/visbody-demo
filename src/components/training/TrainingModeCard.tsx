import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FreeTrainingOption } from "@/types/training";
import { useLocale } from "@/context/LocaleContext";

type TrainingModeCardProps = {
  option: FreeTrainingOption;
  onPress: () => void;
};

export function TrainingModeCard({ option, onPress }: TrainingModeCardProps) {
  const { language } = useLocale();
  const copy = language === "en" ? option.en : option;
  const [imageFailed, setImageFailed] = useState(false);
  const [imageWidth, setImageWidth] = useState(358);
  const action = language === "en" ? "Set up training" : "设置训练";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${copy.title}, ${copy.subtitle}, ${action}`}
      onPress={onPress}
      onLayout={({ nativeEvent }) => setImageWidth(Math.min(nativeEvent.layout.width, 440))}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {!imageFailed && (
        <Image source={option.image} resizeMode="cover" style={[styles.image, { width: imageWidth, height: imageWidth / 1.5 }]}
          onError={() => setImageFailed(true)} accessible={false} />
      )}
      <LinearGradient
        colors={["rgba(7,11,15,0.94)", "rgba(7,11,15,0.60)", "rgba(7,11,15,0.06)"]}
        locations={[0, 0.5, 1]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill} pointerEvents="none"
      />
      <LinearGradient colors={["transparent", "rgba(7,11,15,0.78)"]}
        style={StyleSheet.absoluteFill} pointerEvents="none" />
      <View style={styles.copy}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.features}>{copy.features}</Text>
        <View style={styles.action}>
          <Text style={styles.actionText}>{action}</Text>
          <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, overflow: "hidden", minHeight: 176, backgroundColor: "#151D24", justifyContent: "space-between", padding: 20 },
  image: { position: "absolute", top: 0, right: 0,  },
  copy: { width: "66%", paddingBottom: 22 },
  title: { fontSize: 23, lineHeight: 29, fontWeight: "700", color: "#FFFFFF", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, lineHeight: 19, color: "#CED3D8", marginTop: 7 },
  footer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 10 },
  features: { flex: 1, fontSize: 11, lineHeight: 17, color: "#ADB7C1" },
  action: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 0 },
  actionText: { fontSize: 12, lineHeight: 18, fontWeight: "600", color: "#FFFFFF" },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
});
