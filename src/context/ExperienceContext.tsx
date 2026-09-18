import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Text, View } from 'react-native';
import { useTheme } from './ThemeContext';
import { useLocale } from './LocaleContext';
import { Action, Copy, useCopy } from '@/components/onboarding/DemoUI';
export type DemoPermission = 'camera' | 'localNetwork' | 'bluetooth' | 'photosAdd';
export type PermissionStatus = 'unknown' | 'granted' | 'denied';
export type DemoPlatform = 'android' | 'ios';
export const AGREEMENT_VERSION = '2026-09-18';
const KEY = 'motionstation.experience-demo.v1';
type State = {
    consent: string | null;
    platform: DemoPlatform;
    permissions: Record<string, PermissionStatus>;
};
type Context = State & {
    ready: boolean;
    error: string;
    accept: () => void;
    reset: () => void;
    setPlatform: (p: DemoPlatform) => void;
    status: (p: DemoPermission) => PermissionStatus;
    setPermission: (p: DemoPermission, s: PermissionStatus) => void;
    request: (p: DemoPermission) => Promise<boolean>;
};
const Context = createContext<Context | null>(null);
export function permissionName(p: DemoPermission, platform: DemoPlatform, t: (a: string, b: string) => string) { return ({ camera: t('相机', 'Camera'), localNetwork: t('本地网络', 'Local network'), bluetooth: platform === 'ios' ? t('蓝牙', 'Bluetooth') : t('附近设备（蓝牙）', 'Nearby devices (Bluetooth)'), photosAdd: t('仅添加照片', 'Add photos only') })[p]; }
export function ExperienceProvider({ children }: {
    children: ReactNode;
}) {
    const [state, setState] = useState<State>({ consent: null, platform: Platform.OS === 'ios' ? 'ios' : 'android', permissions: {} });
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('');
    const [prompt, setPrompt] = useState<DemoPermission | null>(null);
    const [stage, setStage] = useState<'system' | 'settings'>('system');
    const pending = useRef<((v: boolean) => void) | null>(null);
    const t = useCopy();
    const { colors } = useTheme();
    const { language, region, setLanguage, setRegion } = useLocale();
    useEffect(() => { let alive = true; AsyncStorage.getItem(KEY).then(raw => { if (!alive || !raw)
        return; const data = JSON.parse(raw); setState({ consent: data.consent === AGREEMENT_VERSION ? data.consent : null, platform: data.platform === 'ios' ? 'ios' : 'android', permissions: Object.fromEntries(Object.entries(data.permissions || {}).filter(([k, v]) => /^(ios|android):(camera|localNetwork|bluetooth|photosAdd)$/.test(k) && ['unknown', 'denied', 'granted'].includes(String(v)))) as State['permissions'] }); if (['zh', 'en'].includes(data.language))
        setLanguage(data.language); if (['CN', 'US'].includes(data.region))
        setRegion(data.region); }).catch(() => { if (alive)
        setError('storage'); }).finally(() => { if (alive)
        setReady(true); }); return () => { alive = false; pending.current?.(false); }; }, []);
    // Serialize writes so a fast consent/reset sequence cannot restore stale state.
    const writes = useRef(Promise.resolve());
    useEffect(() => { if (!ready)
        return; writes.current = writes.current.then(() => AsyncStorage.setItem(KEY, JSON.stringify({ ...state, language, region }))).catch(() => setError('storage')); }, [state, language, region, ready]);
    const status = (p: DemoPermission) => state.permissions[`${state.platform}:${p}`] || 'unknown';
    const setPermission = (p: DemoPermission, s: PermissionStatus) => setState(old => ({ ...old, permissions: { ...old.permissions, [`${old.platform}:${p}`]: s } }));
    const finish = (allowed: boolean) => { if (prompt)
        setPermission(prompt, allowed ? 'granted' : 'denied'); setPrompt(null); pending.current?.(allowed); pending.current = null; };
    const request = (p: DemoPermission): Promise<boolean> => { if (state.platform === 'android' && (p === 'localNetwork' || p === 'photosAdd'))
        return Promise.resolve(true); if (status(p) === 'granted')
        return Promise.resolve(true); if (pending.current)
        return Promise.resolve(false); setStage(status(p) === 'denied' ? 'settings' : 'system'); setPrompt(p); return new Promise(resolve => { pending.current = resolve; }); };
    const reason = prompt ? ({ camera: t('用于扫描训练设备二维码或拍摄头像。仅在你使用这些功能时访问相机。', 'Use your camera to scan device QR codes or take a profile photo, only when you choose these features.'), localNetwork: t('用于发现并连接与你处于同一 Wi-Fi 网络中的训练设备，不需要位置权限。', 'Discover and connect to training devices on the same Wi-Fi network. Location access is not needed.'), bluetooth: t('用于发现并连接附近的蓝牙训练设备。局域网连接不依赖此权限。', 'Discover and connect to nearby Bluetooth training devices. LAN connection does not require this access.'), photosAdd: t('将你选择的训练报告保存到照片图库，不读取其他照片。', 'Save the training report you choose to your photo library without reading other photos.') })[prompt] : '';
    return <Context.Provider value={{ ...state, ready, error, status, setPermission, request, accept: () => setState(s => ({ ...s, consent: AGREEMENT_VERSION })), reset: () => { pending.current?.(false); pending.current = null; setPrompt(null); setState(s => ({ ...s, consent: null, permissions: {} })); }, setPlatform: platform => { pending.current?.(false); pending.current = null; setPrompt(null); setState(s => ({ ...s, platform })); } }}>
{ready ? children : <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}><ActivityIndicator color={colors.accent}/></View>}
<Modal visible={!!prompt} transparent animationType="fade" onRequestClose={() => finish(false)}><View style={{ flex: 1, backgroundColor: '#000b', justifyContent: 'center', padding: 24 }}><View style={{ backgroundColor: colors.surfaceElevated, borderRadius: state.platform === 'ios' ? 24 : 28, padding: 24, gap: 18, maxWidth: 430, width: '100%', alignSelf: 'center' }}><Text style={{ color: colors.accent }}>{stage === 'settings' ? t('模拟系统设置 · ', 'Simulated Settings · ') : t('系统授权演示 · ', 'System permission demo · ')}{state.platform === 'ios' ? 'iOS' : 'Android'}</Text><Copy title>{prompt ? permissionName(prompt, state.platform, t) : ''}</Copy><Copy>{stage === 'settings' ? t('此前已拒绝。可在模拟设置中开启，也可以返回继续使用其他功能。', 'Previously denied. Enable access in simulated Settings or return to other features.') : reason}</Copy>{<Action label={stage === 'settings' ? t('模拟开启并返回', 'Simulate enable & return') : t('允许', 'Allow')} onPress={() => finish(true)}/>}<Action secondary label={stage === 'settings' ? t('返回', 'Back') : t('不允许', 'Don’t allow')} onPress={() => finish(false)}/></View></View></Modal>
</Context.Provider>;
}
export function useExperience() { const context = useContext(Context); if (!context)
    throw new Error('ExperienceProvider missing'); return context; }
