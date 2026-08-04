import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { defaultDevices, nearbyDevices as nearbyDevicesData, productLines } from "@/data/mockData";
import {
  cancelDeviceLoginSession,
  confirmDeviceLoginSession,
  createDeviceLoginSession,
  getActiveDeviceLoginSession,
  getDeviceLoginSessionById,
  markDeviceLoginScanned,
  refreshDeviceLoginSession,
  validateDeviceLoginSession as validateDeviceLoginSessionMock,
} from "@/data/deviceLoginMock";
import { buildTrainingReport, createDefaultPreset } from "@/data/trainingMock";
import {
  ActiveSession,
  ConnectionStatus,
  Device,
  DeviceLoginConfirmResult,
  DeviceLoginSession,
  DeviceLoginValidateResult,
  FreeTrainingType,
  NearbyDevice,
  PendingDeviceLogin,
  ProductId,
  ProductLineId,
  ProductLineOption,
  ProductOption,
  SessionStatus,
  TrainingPreset,
  TrainingReport,
} from "@/types/training";

type ReconnectResult = "connected" | "failed";

type TrainingContextValue = {
  productLines: ProductLineOption[];
  selectedProductLine: ProductLineOption;
  selectProductLine: (id: ProductLineId) => void;
  devices: Device[];
  selectedDevice: Device | undefined;
  selectedProduct: ProductOption;
  selectDevice: (deviceId: string) => void;
  reconnectDevice: (deviceId: string) => ReconnectResult;
  disconnectDevice: (deviceId: string) => void;
  addDevice: (name: string) => void;
  lastUsedDeviceId: string | null;
  nearbyDevices: NearbyDevice[];
  setSelectedProductId: (id: ProductId) => void;
  connectionStatus: ConnectionStatus;
  preset: TrainingPreset | null;
  activeSession: ActiveSession | null;
  lastReport: TrainingReport | null;
  selectTrainingType: (type: FreeTrainingType) => void;
  updatePreset: (patch: Partial<TrainingPreset>) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => TrainingReport | null;
  clearSession: () => void;
  pendingDeviceLogin: PendingDeviceLogin | null;
  deviceLoginSession: DeviceLoginSession | null;
  ensureDeviceLoginSession: () => DeviceLoginSession;
  refreshDeviceQrSession: () => DeviceLoginSession;
  syncDeviceLoginSession: () => DeviceLoginSession | null;
  scanDeviceQr: (sessionId?: string) => DeviceLoginValidateResult;
  validateDeviceLoginSession: (sessionId: string) => DeviceLoginValidateResult;
  confirmDeviceLogin: (
    sessionId: string,
    user: { userId: string; userNickname: string },
  ) => DeviceLoginConfirmResult;
  cancelDeviceLogin: (sessionId: string) => DeviceLoginValidateResult;
  setPendingDeviceLogin: (pending: PendingDeviceLogin | null) => void;
  clearPendingDeviceLogin: () => void;
};

const TrainingContext = createContext<TrainingContextValue | null>(null);

const DEFAULT_DEVICE_ID = "ms-1024";
const DEFAULT_PRODUCT_LINE_ID: ProductLineId = "motionstation";

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [selectedProductLineId, setSelectedProductLineId] =
    useState<ProductLineId>(DEFAULT_PRODUCT_LINE_ID);
  const [devices, setDevices] = useState<Device[]>(defaultDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState(DEFAULT_DEVICE_ID);
  const [lastUsedDeviceId, setLastUsedDeviceId] = useState<string | null>(DEFAULT_DEVICE_ID);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [preset, setPreset] = useState<TrainingPreset | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [lastReport, setLastReport] = useState<TrainingReport | null>(null);
  const [pendingDeviceLogin, setPendingDeviceLoginState] = useState<PendingDeviceLogin | null>(null);
  const [deviceLoginSession, setDeviceLoginSession] = useState<DeviceLoginSession | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef<Map<string, number>>(new Map());

  const selectedProductLine = useMemo(
    () => productLines.find((line) => line.id === selectedProductLineId) ?? productLines[2],
    [selectedProductLineId],
  );

  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === selectedDeviceId) ?? devices[0],
    [devices, selectedDeviceId],
  );

  const selectedProduct = useMemo<ProductOption>(
    () => ({
      id: selectedProductLine.id,
      name: selectedProductLine.name,
      subtitle: selectedProductLine.subtitle,
    }),
    [selectedProductLine],
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const selectProductLine = useCallback((id: ProductLineId) => {
    setSelectedProductLineId(id);
  }, []);

  const selectDevice = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setLastUsedDeviceId(deviceId);
  }, []);

  const reconnectDevice = useCallback((deviceId: string): ReconnectResult => {
    const attempts = (reconnectAttemptsRef.current.get(deviceId) ?? 0) + 1;
    reconnectAttemptsRef.current.set(deviceId, attempts);

    if (attempts === 1) {
      return "failed";
    }

    setDevices((current) =>
      current.map((device) =>
        device.id === deviceId
          ? { ...device, connection: "connected", lastUsedLabel: undefined }
          : device,
      ),
    );
    reconnectAttemptsRef.current.set(deviceId, 0);
    setSelectedDeviceId(deviceId);
    setLastUsedDeviceId(deviceId);
    return "connected";
  }, []);

  const disconnectDevice = useCallback((deviceId: string) => {
    setDevices((current) => {
      const next = current.map((device) =>
        device.id === deviceId ? { ...device, connection: "offline" as const } : device,
      );
      const stillConnected = next.find((device) => device.connection === "connected");
      setSelectedDeviceId((currentId) => {
        if (currentId !== deviceId) return currentId;
        return stillConnected?.id ?? deviceId;
      });
      return next;
    });
    reconnectAttemptsRef.current.set(deviceId, 0);
  }, []);

  const addDevice = useCallback((name: string) => {
    setDevices((current) => {
      const existing = current.find((device) => device.name === name);
      if (existing) {
        setSelectedDeviceId(existing.id);
        setLastUsedDeviceId(existing.id);
        return current.map((device) =>
          device.id === existing.id ? { ...device, connection: "connected" } : device,
        );
      }

      const id = name.toLowerCase();
      const next: Device = {
        id,
        productId: "motionstation",
        name,
        subtitle: "",
        connection: "connected",
      };
      setSelectedDeviceId(id);
      setLastUsedDeviceId(id);
      return [...current, next];
    });
  }, []);

  const setSelectedProductId = useCallback((id: ProductId) => {
    if (id === "motionstation") {
      setSelectedProductLineId("motionstation");
    }
    setDevices((current) => {
      const match = current.find((d) => d.productId === id && d.connection === "connected");
      const fallback = current.find((d) => d.productId === id);
      const target = match ?? fallback;
      if (target) {
        setSelectedDeviceId(target.id);
      }
      return current;
    });
  }, []);

  const selectTrainingType = useCallback((type: FreeTrainingType) => {
    setPreset(createDefaultPreset(type));
    setConnectionStatus("disconnected");
  }, []);

  const updatePreset = useCallback((patch: Partial<TrainingPreset>) => {
    setPreset((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const startSession = useCallback(() => {
    if (!preset) return;
    setActiveSession({
      preset,
      status: "running",
      elapsedSeconds: 0,
      startedAt: Date.now(),
    });
    setConnectionStatus("connected");
  }, [preset]);

  const pauseSession = useCallback(() => {
    setActiveSession((current) =>
      current && current.status === "running" ? { ...current, status: "paused" } : current,
    );
  }, []);

  const resumeSession = useCallback(() => {
    setActiveSession((current) =>
      current && current.status === "paused" ? { ...current, status: "running" } : current,
    );
  }, []);

  const endSession = useCallback((): TrainingReport | null => {
    clearTimer();
    if (!activeSession) return null;
    const report = buildTrainingReport(activeSession.preset, activeSession.elapsedSeconds);
    setLastReport(report);
    setActiveSession(null);
    return report;
  }, [activeSession, clearTimer]);

  const clearSession = useCallback(() => {
    clearTimer();
    setActiveSession(null);
    setPreset(null);
    setConnectionStatus("disconnected");
  }, [clearTimer]);

  const syncDeviceLoginSession = useCallback(() => {
    const session = getActiveDeviceLoginSession();
    setDeviceLoginSession(session);
    return session;
  }, []);

  const ensureDeviceLoginSession = useCallback(() => {
    const current = getActiveDeviceLoginSession();
    if (current && (current.status === "active" || current.status === "scanned")) {
      setDeviceLoginSession(current);
      return current;
    }
    const created = createDeviceLoginSession();
    setDeviceLoginSession(created);
    return created;
  }, []);

  const refreshDeviceQrSession = useCallback(() => {
    const created = refreshDeviceLoginSession();
    setDeviceLoginSession(created);
    return created;
  }, []);

  const scanDeviceQr = useCallback((sessionId?: string): DeviceLoginValidateResult => {
    const targetId = sessionId ?? getActiveDeviceLoginSession()?.id ?? ensureDeviceLoginSession().id;
    const result = markDeviceLoginScanned(targetId);
    if (result.ok) {
      setDeviceLoginSession(result.session);
    } else {
      syncDeviceLoginSession();
    }
    return result;
  }, [ensureDeviceLoginSession, syncDeviceLoginSession]);

  const validateDeviceLoginSession = useCallback((sessionId: string): DeviceLoginValidateResult => {
    const result = validateDeviceLoginSessionMock(sessionId);
    if (result.ok) {
      setDeviceLoginSession(result.session);
    } else {
      const latest = getDeviceLoginSessionById(sessionId);
      if (latest) setDeviceLoginSession(latest);
    }
    return result;
  }, []);

  const confirmDeviceLogin = useCallback(
    (
      sessionId: string,
      user: { userId: string; userNickname: string },
    ): DeviceLoginConfirmResult => {
      const result = confirmDeviceLoginSession(sessionId, user);
      if (result.ok) {
        setDeviceLoginSession(result.session);
        addDevice(result.session.deviceName);
        setPendingDeviceLoginState(null);
      } else {
        syncDeviceLoginSession();
      }
      return result;
    },
    [addDevice, syncDeviceLoginSession],
  );

  const cancelDeviceLogin = useCallback((sessionId: string): DeviceLoginValidateResult => {
    const result = cancelDeviceLoginSession(sessionId);
    if (result.ok) {
      setDeviceLoginSession(result.session);
    } else {
      syncDeviceLoginSession();
    }
    setPendingDeviceLoginState(null);
    return result;
  }, [syncDeviceLoginSession]);

  const setPendingDeviceLogin = useCallback((pending: PendingDeviceLogin | null) => {
    setPendingDeviceLoginState(pending);
  }, []);

  const clearPendingDeviceLogin = useCallback(() => {
    setPendingDeviceLoginState(null);
  }, []);

  useEffect(() => {
    if (!activeSession || activeSession.status !== "running") {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveSession((current) => {
        if (!current || current.status !== "running") return current;
        return { ...current, elapsedSeconds: current.elapsedSeconds + 1 };
      });
    }, 1000);

    return clearTimer;
  }, [activeSession?.status, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo<TrainingContextValue>(
    () => ({
      productLines,
      selectedProductLine,
      selectProductLine,
      devices,
      selectedDevice,
      selectedProduct,
      selectDevice,
      reconnectDevice,
      disconnectDevice,
      addDevice,
      lastUsedDeviceId,
      nearbyDevices: nearbyDevicesData,
      setSelectedProductId,
      connectionStatus,
      preset,
      activeSession,
      lastReport,
      selectTrainingType,
      updatePreset,
      startSession,
      pauseSession,
      resumeSession,
      endSession,
      clearSession,
      pendingDeviceLogin,
      deviceLoginSession,
      ensureDeviceLoginSession,
      refreshDeviceQrSession,
      syncDeviceLoginSession,
      scanDeviceQr,
      validateDeviceLoginSession,
      confirmDeviceLogin,
      cancelDeviceLogin,
      setPendingDeviceLogin,
      clearPendingDeviceLogin,
    }),
    [
      selectedProductLine,
      selectProductLine,
      devices,
      selectedDevice,
      selectedProduct,
      selectDevice,
      reconnectDevice,
      disconnectDevice,
      addDevice,
      lastUsedDeviceId,
      setSelectedProductId,
      connectionStatus,
      preset,
      activeSession,
      lastReport,
      selectTrainingType,
      updatePreset,
      startSession,
      pauseSession,
      resumeSession,
      endSession,
      clearSession,
      pendingDeviceLogin,
      deviceLoginSession,
      ensureDeviceLoginSession,
      refreshDeviceQrSession,
      syncDeviceLoginSession,
      scanDeviceQr,
      validateDeviceLoginSession,
      confirmDeviceLogin,
      cancelDeviceLogin,
      setPendingDeviceLogin,
      clearPendingDeviceLogin,
    ],
  );

  return <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>;
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within TrainingProvider");
  }
  return context;
}

export function isSessionActive(status: SessionStatus | undefined): boolean {
  return status === "running" || status === "paused";
}
