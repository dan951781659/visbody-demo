import { Stack } from "expo-router";

export default function TrainingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="preset" />
      <Stack.Screen name="session" />
      <Stack.Screen name="plan-session" />
      <Stack.Screen name="move-session" />
      <Stack.Screen name="report" />
    </Stack>
  );
}
