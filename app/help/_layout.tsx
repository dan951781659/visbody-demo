import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function HelpLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[product]" />
    </Stack>
  );
}
