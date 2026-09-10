import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useAuthStyles } from "@/components/auth/authStyles";
import { useAuthUi } from "@/components/auth/AuthScreen";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { AuthChannel, validateEmail, validatePhone } from "@/utils/authValidation";

type VerificationCodeRowProps = {
  target: string;
  channel?: AuthChannel;
  value: string;
  onChangeText: (value: string) => void;
  codeLabel?: string;
  placeholder?: string;
};

const COUNTDOWN_SECONDS = 60;

export function VerificationCodeRow({
  target,
  channel = "email",
  value,
  onChangeText,
  codeLabel = authCopy.login.code,
  placeholder = authCopy.login.codePlaceholder,
}: VerificationCodeRowProps) {
  const { showToast } = useToast();
  const authStyles = useAuthStyles();
  const { variant } = useAuthUi();
  const cinematic = variant === "cinematic";
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    const result = channel === "phone" ? validatePhone(target) : validateEmail(target);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    setCountdown(COUNTDOWN_SECONDS);
    showToast(authCopy.toast.codeSent);
  };

  const sendLabel = countdown > 0 ? `${countdown}s` : authCopy.login.sendCode;
  const disabled = countdown > 0;

  return (
    <View style={authStyles.field}>
      <Text style={cinematic ? authStyles.cinematicLabel : authStyles.label}>{codeLabel}</Text>
      <View style={cinematic ? authStyles.cinematicInputShell : authStyles.inputRow}>
        {cinematic ? <Ionicons name="keypad-outline" size={18} color="rgba(255,255,255,0.55)" /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType="number-pad"
          maxLength={4}
          accessibilityLabel={codeLabel}
          style={cinematic ? authStyles.cinematicInput : [authStyles.input, authStyles.inputFlex]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={authCopy.login.sendCode}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={handleSendCode}
          style={[
            cinematic ? authStyles.cinematicSecondaryButton : authStyles.secondaryButton,
            disabled && authStyles.secondaryButtonDisabled,
          ]}
        >
          <Text
            style={
              cinematic ? authStyles.cinematicSecondaryButtonText : authStyles.secondaryButtonText
            }
          >
            {sendLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type UnitToggleProps = {
  options: { value: string; label: string; placeholder: string }[];
  active: string;
  onChange: (value: string, placeholder: string) => void;
};

export function UnitToggle({ options, active, onChange }: UnitToggleProps) {
  const authStyles = useAuthStyles();
  return (
    <View style={authStyles.unitToggle}>
      {options.map((option) => {
        const isActive = active === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value, option.placeholder)}
            style={[authStyles.unitButton, isActive && authStyles.unitButtonActive]}
          >
            <Text style={[authStyles.unitButtonText, isActive && authStyles.unitButtonTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  onSelect: (value: string) => void;
};

export function SelectField({ label, value, options, placeholder, onSelect }: SelectFieldProps) {
  const authStyles = useAuthStyles();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={authStyles.datePart}>
      <Text style={authStyles.sublabel}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen((prev) => !prev)}
        style={authStyles.selectButton}
      >
        <Text style={authStyles.selectButtonText}>{selected?.label ?? placeholder}</Text>
      </Pressable>
      {open ? (
        <View style={{ gap: 4, marginTop: 4, maxHeight: 160 }}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              onPress={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              style={authStyles.selectButton}
            >
              <Text style={authStyles.selectButtonText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type Gender = "male" | "female";

export function GenderSelector({
  value,
  onChange,
}: {
  value: Gender | "other";
  onChange: (value: Gender) => void;
}) {
  const authStyles = useAuthStyles();
  const selected: Gender = value === "other" ? "female" : value;
  const options: { value: Gender; label: string }[] = [
    { value: "male", label: authCopy.profileCompletion.genderOptions.male },
    { value: "female", label: authCopy.profileCompletion.genderOptions.female },
  ];

  return (
    <View style={authStyles.genderRow}>
      {options.map((option) => {
        const isActive = selected === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            style={[authStyles.genderOption, isActive && authStyles.genderOptionActive]}
          >
            <Text
              style={[authStyles.genderOptionText, isActive && authStyles.genderOptionTextActive]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function buildBirthYearOptions(): SelectOption[] {
  const currentYear = new Date().getFullYear();
  const options: SelectOption[] = [];
  for (let year = currentYear; year >= currentYear - 100; year -= 1) {
    options.push({ value: String(year), label: String(year) });
  }
  return options;
}

export function buildBirthMonthOptions(): SelectOption[] {
  return authCopy.profileCompletion.monthLabels.map((label, index) => ({
    value: String(index + 1).padStart(2, "0"),
    label,
  }));
}

export function buildBirthDayOptions(): SelectOption[] {
  return Array.from({ length: 31 }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return { value: day, label: day };
  });
}
