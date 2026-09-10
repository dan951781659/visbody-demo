import { Stack } from "expo-router";
import { colors } from "@/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit" />
      <Stack.Screen name="training-goals" />
      <Stack.Screen name="training-records" />
      <Stack.Screen name="training-record/[id]" />
    </Stack>
  );
}
