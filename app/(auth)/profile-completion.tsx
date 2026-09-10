import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
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
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useAuthStyles } from "@/components/auth/authStyles";
import { useAuthVerification } from "@/context/AuthVerificationContext";
import { useUser } from "@/context/UserContext";
import { nicknameFromIdentifier } from "@/utils/authValidation";

export default function ProfileCompletionScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const authStyles = useAuthStyles();
  const { registerDraft, setRegisterDraft } = useUser();
  const { hasVerifiedSession } = useAuthVerification();

  useEffect(() => {
    if (!registerDraft) {
      router.replace(hasVerifiedSession("register") ? "/register-password" : "/login");
    }
  }, [hasVerifiedSession, registerDraft, router]);

  const defaultNickname =
    registerDraft?.profile?.nickname ??
    (registerDraft != null
      ? nicknameFromIdentifier(registerDraft.identifier, registerDraft.channel)
      : "");

  const [nickname, setNickname] = useState(defaultNickname);
  const [gender, setGender] = useState<"male" | "female">(
    registerDraft?.profile?.gender === "female" ? "female" : "male",
  );
  const [birthYear, setBirthYear] = useState(registerDraft?.profile?.birthYear ?? "");
  const [birthMonth, setBirthMonth] = useState(registerDraft?.profile?.birthMonth ?? "");
  const [birthDay, setBirthDay] = useState(registerDraft?.profile?.birthDay ?? "");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">(
    registerDraft?.profile?.heightUnit ?? "cm",
  );
  const [height, setHeight] = useState(registerDraft?.profile?.height ?? "");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    registerDraft?.profile?.weightUnit ?? "kg",
  );
  const [weight, setWeight] = useState(registerDraft?.profile?.weight ?? "");
  const [heightPlaceholder, setHeightPlaceholder] = useState(
    registerDraft?.profile?.heightUnit === "ft" ? "身高（ft）" : "身高（cm）",
  );
  const [weightPlaceholder, setWeightPlaceholder] = useState(
    registerDraft?.profile?.weightUnit === "lbs" ? "体重（lbs）" : "体重（kg）",
  );

  const yearOptions = useMemo(() => buildBirthYearOptions(), []);
  const monthOptions = useMemo(() => buildBirthMonthOptions(), []);
  const dayOptions = useMemo(() => buildBirthDayOptions(), []);

  const handleNext = () => {
    if (!registerDraft) {
      router.replace(hasVerifiedSession("register") ? "/register-password" : "/login");
      return;
    }
    if (!height.trim()) {
      showToast(authCopy.profileCompletion.requiredHeight);
      return;
    }
    if (!weight.trim()) {
      showToast(authCopy.profileCompletion.requiredWeight);
      return;
    }

    setRegisterDraft({
      ...registerDraft,
      profile: {
        nickname,
        gender,
        birthYear,
        birthMonth,
        birthDay,
        height,
        heightUnit,
        weight,
        weightUnit,
      },
    });
    router.push("/training-goals-setup");
  };

  if (!registerDraft) {
    return null;
  }

  return (
    <AuthScreen
      title={authCopy.profileCompletion.title}
      subtitle={authCopy.profileCompletion.subtitle}
      onBack={() => router.replace("/register-password")}
    >
      <View style={{ gap: 12 }}>
        <AuthField label={authCopy.profileCompletion.nickname}>
          <AuthInput
            value={nickname}
            onChangeText={setNickname}
            placeholder={authCopy.profileCompletion.nicknamePlaceholder}
            autoCapitalize="words"
            accessibilityLabel={authCopy.profileCompletion.nickname}
          />
        </AuthField>

        <AuthField label={authCopy.profileCompletion.genderRequired}>
          <GenderSelector value={gender} onChange={setGender} />
        </AuthField>

        <View style={authStyles.field}>
          <Text style={authStyles.label}>{authCopy.profileCompletion.birthday}</Text>
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

        <AuthField label={authCopy.profileCompletion.heightRequired}>
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
            accessibilityLabel={authCopy.profileCompletion.height}
          />
        </AuthField>

        <AuthField label={authCopy.profileCompletion.weightRequired}>
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
            accessibilityLabel={authCopy.profileCompletion.weight}
          />
        </AuthField>

        <AuthPrimaryButton label={authCopy.profileCompletion.next} onPress={handleNext} />
      </View>
    </AuthScreen>
  );
}
