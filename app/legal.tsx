import { useLocalSearchParams } from 'expo-router';
import { Page, useCopy } from '@/components/onboarding/DemoUI';
import { LegalContent } from '@/components/onboarding/WelcomeGate';
export default function LegalPage() { const { kind } = useLocalSearchParams(); const t = useCopy(); return <Page title={kind === 'terms' ? t('用户协议', 'Terms of Use') : t('隐私政策', 'Privacy Policy')}><LegalContent kind={kind === 'terms' ? 'terms' : 'privacy'}/></Page>; }
