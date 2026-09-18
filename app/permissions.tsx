import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Action, Choices, Copy, LegalLink, Page, useCopy } from '@/components/onboarding/DemoUI';
import { DemoPermission, permissionName, useExperience } from '@/context/ExperienceContext';
import { useLocale } from '@/context/LocaleContext';
export default function Permissions() {
    const e = useExperience();
    const t = useCopy();
    const router = useRouter();
    const locale = useLocale();
    const [bluetooth, setBluetooth] = useState(true);
    const [message, setMessage] = useState('');
    const [resetConfirm, setResetConfirm] = useState(false);
    useEffect(() => setMessage(''), [locale.language, e.platform, bluetooth]);
    const permissions: DemoPermission[] = e.platform === 'ios' ? ['camera', 'localNetwork', 'bluetooth', 'photosAdd'] : ['camera', 'bluetooth'];
    return <Page title={t('权限与流程演示', 'Permissions & demo')}><Copy>{t('所有授权状态均为模拟，不代表手机的真实系统权限。', 'All permission states are simulated, not your phone’s actual permissions.')}</Copy><Choices values={[['android', 'Android'], ['ios', 'iOS']]} selected={e.platform} onSelect={e.setPlatform}/><Choices values={[['zh', '中文'], ['en', 'English']]} selected={locale.language} onSelect={locale.setLanguage}/><Choices values={[['CN', t('中国', 'China')], ['US', t('海外', 'International')]]} selected={locale.region} onSelect={locale.setRegion}/>{permissions.map(p => <View key={p} style={{ gap: 10, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#ffffff20' }}><Copy>{permissionName(p, e.platform, t)} · {e.status(p) === 'granted' ? t('已允许', 'Allowed') : e.status(p) === 'denied' ? t('已拒绝', 'Denied') : t('未询问', 'Not requested')}</Copy><Action label={t('体验授权流程', 'Try permission flow')} onPress={() => void e.request(p)}/><Choices values={[['unknown', t('重置', 'Reset')], ['denied', t('拒绝', 'Deny')], ['granted', t('模拟设置开启', 'Enable in demo')]]} selected={e.status(p)} onSelect={s => e.setPermission(p, s)}/></View>)}<Copy title>{t('蓝牙独立场景', 'Bluetooth scenario')}</Copy><Action secondary label={bluetooth ? t('蓝牙开关：开（模拟）', 'Bluetooth: on (simulated)') : t('蓝牙开关：关（模拟）', 'Bluetooth: off (simulated)')} onPress={() => setBluetooth(!bluetooth)}/><Action label={t('搜索蓝牙设备', 'Search Bluetooth devices')} onPress={async () => { if (!bluetooth) {
        setMessage(t('请先在系统设置开启蓝牙。权限授权不能代替开启蓝牙。', 'Turn on Bluetooth in Settings. Granting access does not turn Bluetooth on.'));
        return;
    } if (await e.request('bluetooth'))
        setMessage(t('已发现 MotionStation BLE（模拟）。此场景不影响局域网连接。', 'Found MotionStation BLE (simulated). LAN connection is independent.'));
    else
        setMessage(t('蓝牙访问已拒绝，可继续使用其他功能。', 'Bluetooth access denied. Other features remain available.')); }}/>{!!message && <Copy>{message}</Copy>}<Action label={t('发现局域网设备', 'Discover LAN devices')} onPress={() => router.push('/connect/discover')}/><Action secondary label={t('头像与报告授权演示', 'Avatar & report demo')} onPress={() => router.push('/media-demo')}/><Action secondary label={t('安装流程演示', 'Installation demo')} onPress={() => router.push('/installation')}/><LegalLink label={t('用户协议', 'Terms of Use')} onPress={() => router.push('/legal?kind=terms')}/><LegalLink label={t('隐私政策', 'Privacy Policy')} onPress={() => router.push('/legal?kind=privacy')}/><Action secondary label={t('重置首次启动与模拟权限', 'Reset welcome & demo permissions')} onPress={() => setResetConfirm(true)}/>{resetConfirm && <><Copy>{t('仅清除协议与模拟权限状态，保留训练数据。重置后将回到欢迎页。', 'Only agreement and simulated permissions will be cleared. Training data is retained. You will return to Welcome.')}</Copy><Action label={t('确认重置', 'Confirm reset')} onPress={() => { e.reset(); }}/><Action secondary label={t('取消', 'Cancel')} onPress={() => setResetConfirm(false)}/></>}{!!e.error && <Copy>{t('无法保存到本地存储，刷新后可能需要重新选择。', 'Local storage is unavailable; choices may reset on refresh.')}</Copy>}</Page>;
}
