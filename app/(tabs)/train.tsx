import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TrainingModeCard } from "@/components/training/TrainingModeCard";
import { useTraining } from "@/context/TrainingContext";
import { useLocale } from "@/context/LocaleContext";
import { FREE_TRAINING_OPTIONS } from "@/data/trainingMock";
import { colors, layout, spacing } from "@/theme";

export default function TrainScreen() {
  const router = useRouter();
  const { selectTrainingType, selectedDevice } = useTraining();
  const { language } = useLocale();
  const en = language === "en";
  const connected = selectedDevice?.connection === "connected";

  const handleSelectTraining = (type: (typeof FREE_TRAINING_OPTIONS)[number]["id"]) => {
    selectTrainingType(type);
    router.push("/training/preset");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <Text style={styles.eyebrow}>MOTIONSTATION</Text>
          <Text style={styles.pageTitle}>{en ? "Free Training" : "自由训练"}</Text>
          <Text style={styles.hint}>{en ? "Choose a scene. Make the training yours." : "选择训练场景，设置你的训练"}</Text>
          <Pressable accessibilityRole="button"
            accessibilityLabel={connected ? (en ? "Manage connected device" : "管理已连接设备") : (en ? "Connect device" : "连接设备")}
            onPress={() => router.push(connected ? "/devices" : "/connect/discover")}
            style={({ pressed }) => [styles.deviceRow, pressed && { opacity: 0.7 }]}
          >
            <View style={[styles.dot, { backgroundColor: connected ? "#64D7AF" : "#7C8792" }]} />
            <View style={styles.deviceCopy}>
              <Text style={styles.deviceLabel}>{connected ? (en ? "DEVICE CONNECTED" : "设备已连接") : (en ? "NO DEVICE CONNECTED" : "设备未连接")}</Text>
              <Text style={styles.deviceName}>{connected ? selectedDevice?.name : (en ? "Connect device" : "连接设备")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={17} color="#909AA4" />
          </Pressable>
          <View style={styles.modeList}>
            {FREE_TRAINING_OPTIONS.map((option) => (
              <TrainingModeCard key={option.id} option={option} onPress={() => handleSelectTraining(option.id)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: layout.screenPadding, paddingTop: 20, paddingBottom: layout.tabScreenBottomInset + spacing.xl },
  inner: { width: "100%", maxWidth: 760, alignSelf: "center" },
  eyebrow: { fontSize: 10, lineHeight: 15, letterSpacing: 2.4, fontWeight: "600", color: "#758393", marginBottom: 7 },
  pageTitle: { fontSize: 30, lineHeight: 38, fontWeight: "700", letterSpacing: -0.7, color: "#FFFFFF" },
  hint: { fontSize: 14, lineHeight: 21, color: "#909AA4", marginTop: 7, marginBottom: 18 },
  deviceRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, marginBottom: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#20272E" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  deviceCopy: { flex: 1 },
  deviceLabel: { fontSize: 9, lineHeight: 14, letterSpacing: 1, color: "#909AA4" },
  deviceName: { fontSize: 13, lineHeight: 19, color: "#DDE2E7", marginTop: 2 },
  modeList: { gap: 12 },
});
