import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function ContentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
  );
}
