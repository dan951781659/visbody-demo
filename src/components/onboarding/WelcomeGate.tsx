import { ReactNode, useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { useExperience } from '@/context/ExperienceContext';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Action, Choices, Copy, LegalLink, Page, useCopy } from './DemoUI';
export function LegalContent({ kind }: {
    kind: 'terms' | 'privacy';
}) { const t = useCopy(); const { region } = useLocale(); return <><Copy>{t('示例文本 · 2026-09-18 · ', 'Sample text · 2026-09-18 · ')}{region === 'CN' ? t('中国版', 'China edition') : t('海外版', 'International edition')}</Copy><Copy>{t('以下仅为交互原型示例，并非正式发布政策。上线前须替换为实际运营主体、数据处理规则、保存期限及联系渠道。', 'This is prototype copy, not a release policy. Replace it with the actual operator, data practices, retention periods and contact details before launch.')}</Copy>{kind === 'terms' ? <><Copy title>{t('服务与使用', 'Service & use')}</Copy><Copy>{t('MotionStation 提供训练内容、训练记录及设备连接体验。请根据自身能力使用设备，遵循设备说明。演示数据不代表真实训练结果。', 'MotionStation provides training content, records and device connections. Train within your abilities and follow equipment instructions. Demo data does not represent real training results.')}</Copy><Copy title>{t('你的选择', 'Your choices')}</Copy><Copy>{t('你可以阅读全部条款后决定是否继续。不同意时停留在欢迎页；同意协议不会自动授予相机、蓝牙或本地网络权限。', 'Read the terms before deciding to continue. Declining keeps you on the welcome screen. Agreement does not automatically grant camera, Bluetooth or local network access.')}</Copy></> : <><Copy title>{t('数据与权限', 'Data & permissions')}</Copy><Copy>{t('账号资料、训练记录和设备连接信息用于对应服务。相机用于扫码及拍照；本地网络用于发现同网设备；蓝牙仅用于蓝牙连接；保存报告仅添加照片。权限在使用功能时单独请求。', 'Account details, training records and connection information support the corresponding services. Camera access supports scanning and photos; local network access discovers LAN devices; Bluetooth supports Bluetooth connections; report saving adds photos only. Access is requested when needed.')}</Copy><Copy title>{t('管理与撤回', 'Manage & withdraw')}</Copy><Copy>{t('可以在系统设置管理权限。拒绝单项权限只影响对应功能。本 Demo 将协议状态与模拟授权状态保存在本机；重置演示会清除这些状态，不清除其他训练数据。', 'Manage permissions in system Settings. Denying one permission affects only that feature. This demo stores agreement and simulated permission choices locally. Resetting the demo clears these choices, not other training data.')}</Copy><Copy>{region === 'CN' ? t('中国版正式政策需说明个人信息处理、用户权利及联系渠道。', 'The China release policy must describe personal information processing, user rights and contact channels.') : t('海外正式政策需按实际发行地区说明数据处理、跨境传输及用户权利；语言选择不会自动改变发行地区。', 'The international policy must explain processing, international transfers and user rights for each release market. Language selection does not change the region.')}</Copy></>}</>; }
export function WelcomeGate({ children }: {
    children: ReactNode;
}) {
    const experience = useExperience();
    const { language, setLanguage, region, setRegion } = useLocale();
    const { colors } = useTheme();
    const t = useCopy();
    const [visible, setVisible] = useState(true);
    const [legal, setLegal] = useState<'terms' | 'privacy' | null>(null);
    useEffect(() => { if (!experience.consent) {
        setVisible(true);
        setLegal(null);
    } }, [experience.consent]);
    if (experience.consent)
        return <>{children}</>;
    if (legal)
        return <Page title={legal === 'terms' ? t('用户协议', 'Terms of Use') : t('隐私政策', 'Privacy Policy')} back={false}><Action secondary label={t('‹ 返回协议说明', '‹ Back to agreement')} onPress={() => setLegal(null)}/><LegalContent kind={legal}/></Page>;
    return <Page title={t('每一次运动，\n都有新的可能。', 'Make your\nnext move.')} back={false}><View style={{ paddingVertical: 38 }}><Text style={{ fontSize: 92, fontWeight: '900', color: colors.accent }}>M.</Text><Copy>{t('连接训练设备，开启你的运动旅程。', 'Connect your equipment. Begin your training journey.')}</Copy></View><Choices values={[['zh', '中文'], ['en', 'English']]} selected={language} onSelect={setLanguage}/><Choices values={[['CN', t('中国', 'China')], ['US', t('海外', 'International')]]} selected={region} onSelect={setRegion}/><Action label={t('阅读协议并开始', 'Read & get started')} onPress={() => setVisible(true)}/><Copy>{t('不同意时可停留在此页面，不会申请设备权限。', 'You can stay here without agreeing. No device permissions will be requested.')}</Copy>{!!experience.error && <Copy>{t('本地存储不可用，当前选择可能无法保留。', 'Local storage is unavailable. Your choices may not be retained.')}</Copy>}<Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}><View style={{ flex: 1, backgroundColor: '#000b', justifyContent: 'center', padding: 24 }}><View style={{ backgroundColor: colors.surfaceElevated, borderRadius: 24, padding: 24, gap: 16, width: '100%', maxWidth: 440, alignSelf: 'center' }}><Copy title>{t('欢迎使用 MotionStation', 'Welcome to MotionStation')}</Copy><Copy>{t('开始前，请阅读', 'Before you begin, review our ')}<LegalLink label={t('《用户协议》', 'Terms of Use')} onPress={() => setLegal('terms')}/>{t('与', ' and ')}<LegalLink label={t('《隐私政策》', 'Privacy Policy')} onPress={() => setLegal('privacy')}/>{t('，了解服务内容、数据用途和你的选择。相机、蓝牙与本地网络权限将在使用相关功能时单独询问。', ' to understand the service, data use and your choices. Camera, Bluetooth and local network access are requested separately when needed.')}</Copy><Action label={t('同意并继续', 'Agree & continue')} onPress={experience.accept}/><Action secondary label={t('不同意', 'Disagree')} onPress={() => setVisible(false)}/></View></View></Modal></Page>;
}
