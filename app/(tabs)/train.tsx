import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProductLinePickerModal } from "@/components/training/ProductLinePickerModal";
import { ProductPickerModal } from "@/components/training/ProductPickerModal";
import { TrainingModeCard } from "@/components/training/TrainingModeCard";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { SectionHeader } from "@/components/SectionHeader";
import { useTraining } from "@/context/TrainingContext";
import { FREE_TRAINING_OPTIONS } from "@/data/trainingMock";
import { colors, layout, spacing, typography } from "@/theme";

export default function TrainScreen() {
  const router = useRouter();
  const {
    selectedProductLine,
    selectedDevice,
    productLines,
    selectProductLine,
    selectTrainingType,
  } = useTraining();
  const [lineVisible, setLineVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  const handleSelectTraining = (type: (typeof FREE_TRAINING_OPTIONS)[number]["id"]) => {
    selectTrainingType(type);
    router.push("/training/preset");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProductSwitcher
          productLine={selectedProductLine}
          connection={selectedDevice?.connection}
          onPressName={() => setLineVisible(true)}
          onPressLogo={() => setDeviceVisible(true)}
        />

        <SectionHeader title="自由训练" />
        <Text style={styles.hint}>选择训练模式后进入设备预设页面</Text>
        <View style={styles.modeList}>
          {FREE_TRAINING_OPTIONS.map((option) => (
            <TrainingModeCard
              key={option.id}
              option={option}
              onPress={() => handleSelectTraining(option.id)}
            />
          ))}
        </View>
      </ScrollView>

      <ProductLinePickerModal
        visible={lineVisible}
        productLines={productLines}
        selectedId={selectedProductLine.id}
        onSelect={selectProductLine}
        onClose={() => setLineVisible(false)}
      />
      <ProductPickerModal
        visible={deviceVisible}
        onClose={() => setDeviceVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: layout.tabScreenBottomInset + spacing.xl,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  modeList: {
    gap: spacing.md,
  },
});
