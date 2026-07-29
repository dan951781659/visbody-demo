import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { AuthPrimaryButton, AuthScreen } from "@/components/auth/AuthScreen";
import { TrainingGoalsEditor } from "@/components/goals/TrainingGoalsEditor";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { DEFAULT_TRAINING_GOALS } from "@/types/userGoals";

export default function TrainingGoalsSetupScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { registerDraft, completeRegistration } = useUser();
  const { pendingDeviceLogin, validateDeviceLoginSession, clearPendingDeviceLogin } = useTraining();
  const [trainingGoals, setTrainingGoals] = useState(DEFAULT_TRAINING_GOALS);

  useEffect(() => {
    if (!registerDraft?.profile) {
      router.replace("/profile-completion");
    }
  }, [registerDraft, router]);

  const finishRegistration = () => {
    if (!registerDraft?.profile) {
      router.replace("/profile-completion");
      return;
    }

    completeRegistration({
      ...registerDraft.profile,
      trainingGoals,
    });

    if (pendingDeviceLogin) {
      const result = validateDeviceLoginSession(pendingDeviceLogin.sessionId);
      if (!result.ok) {
        clearPendingDeviceLogin();
        showToast(authCopy.toast.registrationSuccess);
        setTimeout(() => {
          router.replace(`/connect/expired?reason=${result.reason}`);
        }, 900);
        return;
      }
      showToast(authCopy.toast.registrationSuccess);
      setTimeout(() => {
        router.replace(`/connect/confirm?sessionId=${encodeURIComponent(result.session.id)}`);
      }, 900);
      return;
    }

    showToast(authCopy.toast.registrationSuccess);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 900);
  };

  if (!registerDraft?.profile) {
    return null;
  }

  return (
    <AuthScreen
      title={authCopy.trainingGoalsSetup.title}
      subtitle={authCopy.trainingGoalsSetup.subtitle}
      onBack={() => router.replace("/profile-completion")}
    >
      <View style={{ gap: 16 }}>
        <TrainingGoalsEditor value={trainingGoals} onChange={setTrainingGoals} />
        <AuthPrimaryButton label={authCopy.trainingGoalsSetup.finish} onPress={finishRegistration} />
      </View>
    </AuthScreen>
  );
}
