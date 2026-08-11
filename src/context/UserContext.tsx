import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { mockUser, UserProfile } from "@/data/userMock";
import { colors } from "@/theme";
import {
  DEFAULT_TRAINING_GOALS,
  normalizeTrainingGoals,
  TrainingGoals,
} from "@/types/userGoals";
import { AuthChannel, getInitials, nicknameFromIdentifier } from "@/utils/authValidation";

export const AVATAR_THEME_BLUE = colors.blue;

export type ProfileDraftFields = {
  nickname: string;
  gender: "male" | "female" | "other";
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  height: string;
  heightUnit: "cm" | "ft";
  weight: string;
  weightUnit: "kg" | "lbs";
};

export type RegisterDraft = {
  identifier: string;
  channel: AuthChannel;
  profile?: ProfileDraftFields;
};

export type ProfileCompletionInput = ProfileDraftFields & {
  trainingGoals?: Partial<TrainingGoals>;
};

export type ProfileUpdateInput = ProfileDraftFields;

type UserContextValue = {
  isLoggedIn: boolean;
  user: UserProfile | null;
  trainingGoals: TrainingGoals;
  registerDraft: RegisterDraft | null;
  setRegisterDraft: (draft: RegisterDraft | null) => void;
  login: () => void;
  completeRegistration: (profile: ProfileCompletionInput) => void;
  updateProfile: (profile: ProfileUpdateInput) => void;
  updateTrainingGoals: (goals: TrainingGoals) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

const SESSION_STORAGE_KEY = "motionstation.auth.session";

function createDefaultLoggedInUser(): UserProfile {
  return { ...mockUser, avatarColor: AVATAR_THEME_BLUE, avatarUri: undefined };
}

function persistSession(loggedIn: boolean) {
  AsyncStorage.setItem(SESSION_STORAGE_KEY, loggedIn ? "loggedIn" : "loggedOut").catch(
    () => undefined,
  );
}

function buildProfileFields(
  profile: ProfileDraftFields,
  nickname: string,
  existing?: UserProfile | null,
): UserProfile {
  return {
    id: existing?.id ?? `user-${Date.now()}`,
    nickname,
    avatarInitials: getInitials(nickname),
    avatarColor: AVATAR_THEME_BLUE,
    avatarUri: undefined,
    accountSummary: existing?.accountSummary ?? "MotionStation 会员 · 新注册账号",
    gender: profile.gender,
    birthYear: profile.birthYear,
    birthMonth: profile.birthMonth,
    birthDay: profile.birthDay,
    height: profile.height,
    heightUnit: profile.heightUnit,
    weight: profile.weight,
    weightUnit: profile.weightUnit,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(createDefaultLoggedInUser);
  const [trainingGoals, setTrainingGoals] = useState<TrainingGoals>(DEFAULT_TRAINING_GOALS);
  const [registerDraft, setRegisterDraft] = useState<RegisterDraft | null>(null);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(SESSION_STORAGE_KEY)
      .then((stored) => {
        if (cancelled || stored !== "loggedOut") return;
        setIsLoggedIn(false);
        setUser(null);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(() => {
    setUser(createDefaultLoggedInUser());
    setTrainingGoals(DEFAULT_TRAINING_GOALS);
    setIsLoggedIn(true);
    setRegisterDraft(null);
    persistSession(true);
  }, []);

  const completeRegistration = useCallback(
    (profile: ProfileCompletionInput) => {
      const fallback =
        registerDraft != null
          ? nicknameFromIdentifier(registerDraft.identifier, registerDraft.channel)
          : mockUser.nickname;
      const nickname = profile.nickname.trim() || fallback;
      setUser(buildProfileFields(profile, nickname));
      setTrainingGoals(normalizeTrainingGoals(profile.trainingGoals));
      setIsLoggedIn(true);
      setRegisterDraft(null);
      persistSession(true);
    },
    [registerDraft],
  );

  const updateProfile = useCallback((profile: ProfileUpdateInput) => {
    setUser((current) => {
      if (!current) return current;
      const nickname = profile.nickname.trim() || current.nickname;
      return buildProfileFields(profile, nickname, current);
    });
  }, []);

  const updateTrainingGoals = useCallback((goals: TrainingGoals) => {
    setTrainingGoals(normalizeTrainingGoals(goals));
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setTrainingGoals(DEFAULT_TRAINING_GOALS);
    setRegisterDraft(null);
    persistSession(false);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      trainingGoals,
      registerDraft,
      setRegisterDraft,
      login,
      completeRegistration,
      updateProfile,
      updateTrainingGoals,
      logout,
    }),
    [
      isLoggedIn,
      user,
      trainingGoals,
      registerDraft,
      login,
      completeRegistration,
      updateProfile,
      updateTrainingGoals,
      logout,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
