import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthScreen,
} from "@/components/auth/AuthScreen";
import {
  buildBirthDayOptions,
  buildBirthMonthOptions,
  buildBirthYearOptions,
  GenderSelector,
  SelectField,
  UnitToggle,
} from "@/components/auth/AuthFormParts";
import { useAuthStyles } from "@/components/auth/authStyles";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { AVATAR_THEME_BLUE, useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { getInitials } from "@/utils/authValidation";
import { ColorPalette, spacing, typography } from "@/theme";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const authStyles = useAuthStyles();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user, updateProfile } = useUser();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [gender, setGender] = useState<"male" | "female" | "other">(user?.gender ?? "female");
  const [birthYear, setBirthYear] = useState(user?.birthYear ?? "");
  const [birthMonth, setBirthMonth] = useState(user?.birthMonth ?? "");
  const [birthDay, setBirthDay] = useState(user?.birthDay ?? "");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">(user?.heightUnit ?? "cm");
  const [height, setHeight] = useState(user?.height ?? "");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(user?.weightUnit ?? "kg");
  const [weight, setWeight] = useState(user?.weight ?? "");
  const [heightPlaceholder, setHeightPlaceholder] = useState(
    user?.heightUnit === "ft" ? "身高（ft）" : "身高（cm）",
  );
  const [weightPlaceholder, setWeightPlaceholder] = useState(
    user?.weightUnit === "lbs" ? "体重（lbs）" : "体重（kg）",
  );

  const yearOptions = useMemo(() => buildBirthYearOptions(), []);
  const monthOptions = useMemo(() => buildBirthMonthOptions(), []);
  const dayOptions = useMemo(() => buildBirthDayOptions(), []);

  const previewInitials = getInitials(nickname.trim() || user?.nickname || "?");

  const handleSave = () => {
    if (!height.trim()) {
      showToast(authCopy.profileCompletion.requiredHeight);
      return;
    }
    if (!weight.trim()) {
      showToast(authCopy.profileCompletion.requiredWeight);
      return;
    }

    updateProfile({
      nickname,
      gender,
      birthYear,
      birthMonth,
      birthDay,
      height,
      heightUnit,
      weight,
      weightUnit,
    });

    showToast(authCopy.toast.profileUpdated);
    setTimeout(() => {
      router.back();
    }, 600);
  };

  if (!user) {
    return null;
  }

  return (
    <AuthScreen
      title={authCopy.personalInfo.title}
      subtitle={authCopy.personalInfo.subtitle}
      onBack={() => router.back()}
      showLocaleSwitcher={false}
    >
      <View style={{ gap: 12 }}>
        <View style={styles.avatarBlock}>
          <UserAvatar
            initials={previewInitials}
            backgroundColor={AVATAR_THEME_BLUE}
            size={88}
          />
          <View style={styles.avatarMeta}>
            <Text style={styles.avatarLabel}>{authCopy.personalInfo.avatar}</Text>
            <Text style={styles.avatarHint}>{authCopy.personalInfo.avatarHint}</Text>
          </View>
        </View>

        <AuthField label={authCopy.personalInfo.nickname}>
          <AuthInput
            value={nickname}
            onChangeText={setNickname}
            placeholder={authCopy.personalInfo.nicknamePlaceholder}
            autoCapitalize="words"
            accessibilityLabel={authCopy.personalInfo.nickname}
          />
        </AuthField>

        <AuthField label={authCopy.personalInfo.gender}>
          <GenderSelector value={gender} onChange={setGender} />
        </AuthField>

        <View style={authStyles.field}>
          <Text style={authStyles.label}>{authCopy.personalInfo.birthday}</Text>
          <View style={authStyles.dateRow}>
            <SelectField
              label={authCopy.profileCompletion.year}
              value={birthYear}
              options={yearOptions}
              placeholder={authCopy.profileCompletion.year}
              onSelect={setBirthYear}
            />
            <SelectField
              label={authCopy.profileCompletion.month}
              value={birthMonth}
              options={monthOptions}
              placeholder={authCopy.profileCompletion.month}
              onSelect={setBirthMonth}
            />
            <SelectField
              label={authCopy.profileCompletion.day}
              value={birthDay}
              options={dayOptions}
              placeholder={authCopy.profileCompletion.day}
              onSelect={setBirthDay}
            />
          </View>
        </View>

        <AuthField label={authCopy.personalInfo.height}>
          <UnitToggle
            active={heightUnit}
            options={[
              { value: "cm", label: "cm", placeholder: "身高（cm）" },
              { value: "ft", label: "ft", placeholder: "身高（ft）" },
            ]}
            onChange={(value, placeholder) => {
              setHeightUnit(value as "cm" | "ft");
              setHeightPlaceholder(placeholder);
            }}
          />
          <AuthInput
            value={height}
            onChangeText={setHeight}
            placeholder={heightPlaceholder}
            keyboardType="number-pad"
            accessibilityLabel={authCopy.personalInfo.height}
          />
        </AuthField>

        <AuthField label={authCopy.personalInfo.weight}>
          <UnitToggle
            active={weightUnit}
            options={[
              { value: "kg", label: "kg", placeholder: "体重（kg）" },
              { value: "lbs", label: "lbs", placeholder: "体重（lbs）" },
            ]}
            onChange={(value, placeholder) => {
              setWeightUnit(value as "kg" | "lbs");
              setWeightPlaceholder(placeholder);
            }}
          />
          <AuthInput
            value={weight}
            onChangeText={setWeight}
            placeholder={weightPlaceholder}
            keyboardType="number-pad"
            accessibilityLabel={authCopy.personalInfo.weight}
          />
        </AuthField>

        <AuthPrimaryButton label={authCopy.personalInfo.save} onPress={handleSave} />
      </View>
    </AuthScreen>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    avatarBlock: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
      marginBottom: spacing.sm,
    },
    avatarMeta: {
      flex: 1,
      gap: 4,
    },
    avatarLabel: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    avatarHint: {
      ...typography.caption,
      color: colors.textSecondary,
    },
  });
}
