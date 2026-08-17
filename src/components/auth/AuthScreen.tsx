import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useAuthStyles } from "@/components/auth/authStyles";
import { authCopy } from "@/data/authCopy";
import { AppLanguage, useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { getAtmosphereGradient } from "@/theme";

export type AuthUiVariant = "default" | "cinematic";

type AuthUiContextValue = {
  variant: AuthUiVariant;
};

const AuthUiContext = createContext<AuthUiContextValue>({ variant: "default" });

export function useAuthUi() {
  return useContext(AuthUiContext);
}

type AuthTitleAction = {
  label: string;
  onPress: () => void;
};

type AuthScreenProps = {
  title: string;
  subtitle?: string;
  titleAction?: AuthTitleAction;
  children: ReactNode;
  onBack?: () => void;
  showLocaleSwitcher?: boolean;
  variant?: AuthUiVariant;
};

export function AuthScreen({
  title,
  subtitle,
  titleAction,
  children,
  onBack,
  showLocaleSwitcher = true,
  variant = "default",
}: AuthScreenProps) {
  const authStyles = useAuthStyles();
  const { colors, schemeId } = useTheme();
  const atmosphereGradient = getAtmosphereGradient(schemeId);
  const { languageOptions, languageLabel, setLanguage } = useLocale();
  const cinematic = variant === "cinematic";
  const logoOpacity = useRef(new Animated.Value(cinematic ? 0 : 1)).current;
  const cardOpacity = useRef(new Animated.Value(cinematic ? 0 : 1)).current;
  const cardTranslate = useRef(new Animated.Value(cinematic ? 36 : 0)).current;

  useEffect(() => {
    if (!cinematic) return;

    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled) return;
      if (reduceMotion) {
        logoOpacity.setValue(1);
        cardOpacity.setValue(1);
        cardTranslate.setValue(0);
        return;
      }

      Animated.sequence([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 520,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslate, {
            toValue: 0,
            duration: 520,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });

    return () => {
      cancelled = true;
    };
  }, [cardOpacity, cardTranslate, cinematic, logoOpacity]);

  const openLanguagePicker = () => {
    Alert.alert(authCopy.locale.languageTitle, undefined, [
      ...languageOptions.map((option) => ({
        text: option.label,
        onPress: () => setLanguage(option.id as AppLanguage),
      })),
      { text: "取消", style: "cancel" as const },
    ]);
  };

  const header = (
    <View style={authStyles.headerBar}>
      <View style={authStyles.headerBarRow}>
        {onBack ? (
          <GlassIconButton accessibilityLabel="返回" onPress={onBack}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </GlassIconButton>
        ) : (
          <View style={{ width: 44 }} />
        )}

        {showLocaleSwitcher ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={authCopy.locale.languageTitle}
            onPress={openLanguagePicker}
            style={({ pressed }) => [authStyles.localeButton, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="language-outline" size={16} color={colors.textPrimary} />
            <Text style={authStyles.localeButtonText}>{languageLabel}</Text>
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
    </View>
  );

  const titleBlock = (
    <View>
      {cinematic && title === authCopy.login.title ? (
        titleAction ? (
          <View style={[authStyles.titleRow, { justifyContent: "flex-end" }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={titleAction.label}
              onPress={titleAction.onPress}
              hitSlop={8}
              style={({ pressed }) => [authStyles.titleAction, pressed && { opacity: 0.75 }]}
            >
              <Text style={authStyles.cinematicTitleActionText}>{titleAction.label}</Text>
            </Pressable>
          </View>
        ) : null
      ) : (
        <>
          <View style={authStyles.titleRow}>
            <Text
              style={[
                cinematic ? authStyles.cinematicTitle : authStyles.title,
                authStyles.titleFlex,
              ]}
            >
              {title}
            </Text>
            {titleAction ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={titleAction.label}
                onPress={titleAction.onPress}
                hitSlop={8}
                style={({ pressed }) => [authStyles.titleAction, pressed && { opacity: 0.75 }]}
              >
                <Text
                  style={cinematic ? authStyles.cinematicTitleActionText : authStyles.titleActionText}
                >
                  {titleAction.label}
                </Text>
              </Pressable>
            ) : null}
          </View>
          {subtitle ? (
            <Text style={cinematic ? authStyles.cinematicSubtitle : authStyles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );

  const content = (
    <AuthUiContext.Provider value={{ variant }}>
      {cinematic ? (
        <>
          <Animated.View style={[authStyles.cinematicLogoWrap, { opacity: logoOpacity }]}>
            <Text style={authStyles.cinematicGreeting}>{authCopy.login.title}</Text>
          </Animated.View>
          <Animated.View
            style={[
              authStyles.cinematicCard,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslate }],
              },
            ]}
          >
            {titleBlock}
            {children}
          </Animated.View>
        </>
      ) : (
        <GlassSurface contentStyle={authStyles.card}>
          {titleBlock}
          {children}
        </GlassSurface>
      )}
    </AuthUiContext.Provider>
  );

  const body = (
    <KeyboardAvoidingView
      style={cinematic ? authStyles.cinematicFlex : authStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={cinematic ? authStyles.cinematicScroll : authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (cinematic) {
    return (
      <LinearGradient colors={[...atmosphereGradient]} style={authStyles.screen}>
        <SafeAreaView style={authStyles.cinematicFlex} edges={["top", "bottom"]}>
          {header}
          {body}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={authStyles.screen} edges={["top", "bottom"]}>
      {header}
      {body}
    </SafeAreaView>
  );
}

type AuthFieldProps = {
  label: string;
  children: ReactNode;
};

export function AuthField({ label, children }: AuthFieldProps) {
  const authStyles = useAuthStyles();
  const { variant } = useAuthUi();
  return (
    <View style={authStyles.field}>
      <Text style={variant === "cinematic" ? authStyles.cinematicLabel : authStyles.label}>
        {label}
      </Text>
      {children}
    </View>
  );
}

type AuthInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words";
  accessibilityLabel: string;
  onToggleSecure?: () => void;
  showSecureToggle?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function AuthInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  accessibilityLabel,
  onToggleSecure,
  showSecureToggle,
  icon,
}: AuthInputProps) {
  const authStyles = useAuthStyles();
  const { variant } = useAuthUi();
  const cinematic = variant === "cinematic";
  const iconColor = cinematic ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.65)";

  return (
    <View style={cinematic ? authStyles.cinematicInputShell : authStyles.inputRow}>
      {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={accessibilityLabel}
        style={cinematic ? authStyles.cinematicInput : [authStyles.input, authStyles.inputFlex]}
      />
      {showSecureToggle ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={secureTextEntry ? "显示密码" : "隐藏密码"}
          onPress={onToggleSecure}
          style={({ pressed }) => [{ padding: 8 }, pressed && { opacity: 0.8 }]}
        >
          <Ionicons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={iconColor}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export function AuthPrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const authStyles = useAuthStyles();
  const { variant } = useAuthUi();
  const cinematic = variant === "cinematic";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        cinematic ? authStyles.cinematicPrimaryButton : authStyles.primaryButton,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text
        style={cinematic ? authStyles.cinematicPrimaryButtonText : authStyles.primaryButtonText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function AuthLinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  const authStyles = useAuthStyles();
  const { variant } = useAuthUi();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={authStyles.linkButton}
    >
      <Text style={variant === "cinematic" ? authStyles.cinematicLinkText : authStyles.linkText}>
        {label}
      </Text>
    </Pressable>
  );
}

export function AuthSeparator({ label }: { label: string }) {
  const authStyles = useAuthStyles();
  return <Text style={authStyles.separator}>{label}</Text>;
}
