import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="login-email-password" />
      <Stack.Screen name="login-phone-password" />
      <Stack.Screen name="login-phone-code" />
      <Stack.Screen name="profile-completion" />
      <Stack.Screen name="training-goals-setup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="register" />
      <Stack.Screen name="register-password" />
    </Stack>
  );
}
