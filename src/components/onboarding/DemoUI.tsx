import { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';
export function useCopy() { const { language } = useLocale(); return (zh: string, en: string) => language === 'en' ? en : zh; }
export function Copy({ children, title = false }: {
    children: ReactNode;
    title?: boolean;
}) { const { colors } = useTheme(); return <Text style={{ color: title ? colors.textPrimary : colors.textSecondary, fontSize: title ? 30 : 15, lineHeight: title ? 38 : 24, fontWeight: title ? '700' : '400' }}>{children}</Text>; }
export function Action({ label, onPress, secondary = false, disabled = false }: {
    label: string;
    onPress: () => void;
    secondary?: boolean;
    disabled?: boolean;
}) { const { colors } = useTheme(); return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => ({ padding: 16, borderRadius: 16, backgroundColor: secondary ? colors.surface : colors.accent, opacity: disabled ? .4 : pressed ? .7 : 1 })}><Text style={{ color: secondary ? colors.textPrimary : colors.accentText, textAlign: 'center', fontSize: 16, fontWeight: '600' }}>{label}</Text></Pressable>; }
export function Page({ title, children, back = true }: {
    title: string;
    children: ReactNode;
    back?: boolean;
}) { const { colors } = useTheme(); const router = useRouter(); const t = useCopy(); return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}><ScrollView contentContainerStyle={{ padding: 24, gap: 20, width: '100%', maxWidth: 560, alignSelf: 'center', flexGrow: 1 }}>{back && <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={{ color: colors.accent, paddingVertical: 8 }}>{t('‹ 返回', '‹ Back')}</Text></Pressable>}<Text style={{ color: colors.accent, fontSize: 12, letterSpacing: 3 }}>MOTIONSTATION</Text><Copy title>{title}</Copy>{children}</ScrollView></SafeAreaView>; }
export function Choices<T extends string>({ values, selected, onSelect }: {
    values: [
        T,
        string
    ][];
    selected: T;
    onSelect: (v: T) => void;
}) { return <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{values.map(([value, label]) => <View key={value} style={{ flexGrow: 1 }}><Action label={label} secondary={value !== selected} onPress={() => onSelect(value)}/></View>)}</View>; }

export function LegalLink({ label, onPress }: { label: string; onPress: () => void }) { return <Text accessibilityRole="link" onPress={onPress} style={{color:'#409CFF',fontSize:15,lineHeight:24}}>{label}</Text>; }
