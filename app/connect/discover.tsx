import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Action, Choices, Copy, useCopy } from '@/components/onboarding/DemoUI';
import { useExperience } from '@/context/ExperienceContext';
import { useTraining } from '@/context/TrainingContext';
export default function Discover() {
    const t = useCopy();
    const router = useRouter();
    const { request, platform } = useExperience();
    const { addDevice } = useTraining();
    const [scenario, setScenario] = useState('normal');
    const [stage, setStage] = useState('intro');
    const generation = useRef(0);
    const alive = useRef(true);
    useEffect(() => { alive.current = true; return () => { alive.current = false; generation.current++; }; }, []);
    async function search() { const token = ++generation.current; setStage('authorizing'); const allowed = await request('localNetwork'); if (!alive.current || token !== generation.current)
        return; if (!allowed) {
        setStage('denied');
        return;
    } if (scenario === 'wifi') {
        setStage('wifi');
        return;
    } setStage('searching'); setTimeout(() => { if (alive.current && token === generation.current)
        setStage(scenario === 'empty' ? 'empty' : 'list'); }, 1100); }
    function connect() { const token = ++generation.current; setStage('connecting'); setTimeout(() => { if (!alive.current || token !== generation.current)
        return; if (scenario === 'failure')
        setStage('failure');
    else {
        addDevice('MotionStation LAN');
        setStage('success');
    } }, 900); }
    const busy = ['authorizing', 'searching', 'connecting'].includes(stage);
    return <Page title={t('发现局域网设备', 'Find LAN devices')}><Copy>{t('请让手机与训练设备连接同一 Wi-Fi。无需蓝牙或定位权限。', 'Connect your phone and training device to the same Wi-Fi. Bluetooth and location access are not needed.')}</Copy><Copy>{platform === 'ios' ? t('首次发现设备时会询问本地网络访问权限。', 'Local network access is requested on first discovery.') : t('Android 13–16 普通局域网发现演示，不额外弹出 Wi-Fi 授权。', 'Android 13–16 ordinary LAN discovery demo. No additional Wi-Fi permission prompt.')}</Copy><Choices values={[['normal', t('正常', 'Normal')], ['wifi', t('Wi-Fi 关闭', 'Wi-Fi off')], ['empty', t('无设备', 'No devices')], ['failure', t('连接失败', 'Connection failure')]]} selected={scenario} onSelect={v => { generation.current++; setScenario(v); setStage('intro'); }}/><Copy>{t('以上为演示场景控制，不改变系统网络。', 'Scenario controls above do not change your system network.')}</Copy>{busy && <ActivityIndicator />}<Copy title>{({ intro: t('准备连接', 'Ready to connect'), authorizing: t('等待授权', 'Waiting for permission'), searching: t('正在搜索…', 'Searching…'), connecting: t('正在连接…', 'Connecting…'), denied: t('未获得本地网络权限', 'Local network access denied'), wifi: t('请连接 Wi-Fi', 'Connect to Wi-Fi'), empty: t('暂未发现设备', 'No devices found'), list: t('发现 1 台设备', '1 device found'), failure: t('连接未完成', 'Connection failed'), success: t('设备已连接', 'Device connected') })[stage]}</Copy>{stage === 'list' && <Action label="MotionStation LAN · 192.168.1.24" onPress={connect}/>}
{stage === 'wifi' && <Copy>{t('请在系统设置中开启 Wi-Fi，并确认与设备处于同一网络。切换“正常”场景可模拟恢复。', 'Enable Wi-Fi in system Settings and join the device’s network. Select Normal to simulate recovery.')}</Copy>}{stage === 'empty' && <Copy>{t('确认设备已开机、连接同一网络且未开启访客网络隔离。', 'Check device power, the shared network and guest network isolation.')}</Copy>}{stage === 'failure' && <Copy>{t('请确认设备在线后重试。可切换正常场景演示连接成功。', 'Check that the device is online and retry. Choose Normal to simulate success.')}</Copy>}{!busy && stage !== 'success' && <Action label={stage === 'denied' ? t('前往模拟设置', 'Open simulated Settings') : t('搜索 / 重试', 'Search / retry')} onPress={() => void search()}/>}
{stage === 'success' && <><Copy>{t('模拟设备已加入设备列表，可返回继续训练。', 'The simulated device was added to your device list.')}</Copy><Action label={t('查看设备', 'View devices')} onPress={() => router.replace('/devices')}/></>}</Page>;
}
