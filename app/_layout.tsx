import { ExperienceProvider } from "@/context/ExperienceContext";
import { WelcomeGate } from "@/components/onboarding/WelcomeGate";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts, ArchivoBlack_400Regular } from "@expo-google-fonts/archivo-black";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "@/components/ToastProvider";
import { PlanStartCoordinator } from "@/components/plan/PlanStartCoordinator";
import { MoveStartCoordinator } from "@/components/training/MoveStartCoordinator";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { PlanProvider } from "@/context/PlanContext";
import { AuthVerificationProvider } from "@/context/AuthVerificationContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TrainingProvider } from "@/context/TrainingContext";
import { UserProvider } from "@/context/UserContext";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden in some environments.
});

function RootNavigator() {
  const { colors, isReady } = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    ArchivoBlack_400Regular,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && isReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError, isReady]);

  // reload 时字体加载偶发超时，避免一直卡在启动页
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => undefined);
    }, 3500);
    return () => clearTimeout(timeout);
  }, []);

  if ((!fontsLoaded && !fontError) || !isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <LocaleProvider>
      <ExperienceProvider><WelcomeGate>
      <UserProvider>
        <AuthVerificationProvider>
          <TrainingProvider>
            <PlanProvider>
              <FavoriteProvider>
                <ToastProvider>
                  <PlanStartCoordinator />
                  <MoveStartCoordinator />
                  <StatusBar style="light" />
                  <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="plan" />
                    <Stack.Screen name="training" />
                    <Stack.Screen name="help" />
                    <Stack.Screen name="connect" />
                    <Stack.Screen name="content" />
                    <Stack.Screen name="player" />
                    <Stack.Screen name="preview" />
                  </Stack>
                </ToastProvider>
              </FavoriteProvider>
            </PlanProvider>
          </TrainingProvider>
        </AuthVerificationProvider>
      </UserProvider>
    </WelcomeGate></ExperienceProvider>
    </LocaleProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
