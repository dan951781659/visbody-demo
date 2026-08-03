import { useRouter } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { authCopy } from "@/data/authCopy";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { isRegisteredAccount } from "@/utils/authMock";
import { AuthChannel } from "@/utils/authValidation";

const HOME_REDIRECT_DELAY_MS = 900;

export function useAuthLoginFlow() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login, setRegisterDraft } = useUser();
  const { pendingDeviceLogin, validateDeviceLoginSession, clearPendingDeviceLogin } = useTraining();

  const requirePolicy = (policyAgreed: boolean) => {
    if (!policyAgreed) {
      showToast(authCopy.toast.policyRequired);
      return false;
    }
    return true;
  };

  const resumeDeviceLoginIfNeeded = () => {
    if (!pendingDeviceLogin) return false;

    const result = validateDeviceLoginSession(pendingDeviceLogin.sessionId);
    if (!result.ok) {
      clearPendingDeviceLogin();
      showToast(authCopy.expired.reasons[result.reason === "offline" ? "offline" : result.reason]);
      setTimeout(() => {
        router.replace(`/connect/expired?reason=${result.reason}`);
      }, HOME_REDIRECT_DELAY_MS);
      return true;
    }

    showToast(authCopy.toast.loginSuccess);
    setTimeout(() => {
      router.replace(`/connect/confirm?sessionId=${encodeURIComponent(result.session.id)}`);
    }, HOME_REDIRECT_DELAY_MS);
    return true;
  };

  const finishRegisteredLogin = () => {
    login();
    if (resumeDeviceLoginIfNeeded()) return;
    showToast(authCopy.toast.loginSuccess);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, HOME_REDIRECT_DELAY_MS);
  };

  const attemptAccountLogin = (identifier: string, channel: AuthChannel, policyAgreed: boolean) => {
    if (!requirePolicy(policyAgreed)) return;

    if (!isRegisteredAccount(identifier, channel)) {
      showToast(
        channel === "email" ? authCopy.toast.emailNotRegistered : authCopy.toast.phoneNotRegistered,
      );
      setRegisterDraft({ identifier: identifier.trim(), channel });
      setTimeout(() => {
        router.replace("/profile-completion");
      }, 700);
      return;
    }

    finishRegisteredLogin();
  };

  /** 第三方登录按钮仅展示，暂不接真实能力 */
  const attemptSocialLogin = (_policyAgreed: boolean) => {
    showToast(authCopy.toast.socialComingSoon);
  };

  return {
    requirePolicy,
    attemptAccountLogin,
    attemptSocialLogin,
  };
}
