import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  Alert,
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
};

export function AuthScreen({
  title,
  subtitle,
  titleAction,
  children,
  onBack,
  showLocaleSwitcher = true,
}: AuthScreenProps) {
  const authStyles = useAuthStyles();
  const { colors } = useTheme();
  const { languageOptions, languageLabel, setLanguage } = useLocale();

  const openLanguagePicker = () => {
    Alert.alert(authCopy.locale.languageTitle, undefined, [
      ...languageOptions.map((option) => ({
        text: option.label,
        onPress: () => setLanguage(option.id as AppLanguage),
      })),
      { text: "取消", style: "cancel" as const },
    ]);
  };

  return (
    <SafeAreaView style={authStyles.screen} edges={["top", "bottom"]}>
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

      <KeyboardAvoidingView
        style={authStyles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlassSurface contentStyle={authStyles.card}>
            <View>
              <View style={authStyles.titleRow}>
                <Text style={[authStyles.title, authStyles.titleFlex]}>{title}</Text>
                {titleAction ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={titleAction.label}
                    onPress={titleAction.onPress}
                    hitSlop={8}
                    style={({ pressed }) => [authStyles.titleAction, pressed && { opacity: 0.75 }]}
                  >
                    <Text style={authStyles.titleActionText}>{titleAction.label}</Text>
                  </Pressable>
                ) : null}
              </View>
              {subtitle ? <Text style={authStyles.subtitle}>{subtitle}</Text> : null}
            </View>
            {children}
          </GlassSurface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthFieldProps = {
  label: string;
  children: ReactNode;
};

export function AuthField({ label, children }: AuthFieldProps) {
  const authStyles = useAuthStyles();
  return (
    <View style={authStyles.field}>
      <Text style={authStyles.label}>{label}</Text>
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
}: AuthInputProps) {
  const authStyles = useAuthStyles();
  return (
    <View style={authStyles.inputRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={accessibilityLabel}
        style={[authStyles.input, authStyles.inputFlex]}
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
            color="rgba(255,255,255,0.65)"
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [authStyles.primaryButton, pressed && { opacity: 0.9 }]}
    >
      <Text style={authStyles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function AuthLinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  const authStyles = useAuthStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={authStyles.linkButton}
    >
      <Text style={authStyles.linkText}>{label}</Text>
    </Pressable>
  );
}

export function AuthSeparator({ label }: { label: string }) {
  const authStyles = useAuthStyles();
  return <Text style={authStyles.separator}>{label}</Text>;
}
