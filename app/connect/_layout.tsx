import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function ConnectLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="qr" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="device-qr" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="expired" />
    </Stack>
  );
}
