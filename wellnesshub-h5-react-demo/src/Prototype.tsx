import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useDrag } from "@use-gesture/react";
import { LuSparkles, LuChartNoAxesCombined, LuFlame, LuDumbbell, LuGauge, LuClipboardList, LuPause, LuPlay } from "react-icons/lu";
import { useMobileDevice } from "./mobile/Device";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  ArrowLeftIcon,
  BarChartIcon,
  CheckCircledIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  EnvelopeClosedIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  FileTextIcon,
  GearIcon,
  GlobeIcon,
  HomeIcon,
  InfoCircledIcon,
  Link2Icon,
  LockClosedIcon,
  MobileIcon,
  MoonIcon,
  PersonIcon,
  ReloadIcon,
  Share2Icon,
  SunIcon,
  TargetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  BottomSheet,
  Carousel,
  KeyboardInput,
  MobileScroll,
  useKeyboard,
  useKeyboardInsets,
} from "./mobile";
import "./prototype.css";
import logoUrl from "../public/assets/visbody-logo.png?url";

type Locale = "zh" | "en" | "de" | "ar";
type Theme = "system" | "light" | "dark";
type Units = "metric" | "imperial";
type Mode = "emailCode" | "emailPassword" | "phonePassword" | "phoneCode";
type ModuleId =
  "composition" | "posture" | "balance" | "neck" | "hip" | "spine" | "girth";
type Profile = {
  nickname: string;
  gender: string;
  heightCm: number;
  weightKg: number;
  birthday: string;
};
type Metric = { label: string; value: string; tone?: "risk" | "good" | "warn" };
type ReportModule = {
  id: ModuleId;
  score: number;
  status: "good" | "attention" | "risk";
  metrics: Metric[];
  finding: string;
  advice: string;
};
type Report = {
  id: string;
  date: string;
  device: string;
  score: number;
  summary: string;
  modules: ReportModule[];
  modelAsset?: string | null;
  comparisonKey?: string;
};
type Route = { page: string; id?: string; type?: string; contentId?: string };
const K = {
  consent: "wellnesshub.consent.v1",
  locale: "wellnesshub.locale",
  theme: "wellnesshub.theme",
  units: "wellnesshub.units",
  profile: "wellnesshub.profile",
  reports: "wellnesshub.reports.v1",
  session: "wellnesshub.session.v1",
  training: "wellnesshub.training.v1",
};
const zh = {
  welcome: "欢迎使用",
  trust:
    "您的信任对我们至关重要。我们采用行业通行的技术与管理措施保护您的个人信息安全。",
  legal: "继续前，请阅读并同意《用户协议》《隐私政策》和《AI 免责声明》。",
  agree: "同意并继续",
  emailLogin: "邮箱密码登录",
  phoneLogin: "手机号密码登录",
  codeLogin: "验证码登录",
  email: "邮箱",
  phone: "手机号",
  password: "密码",
  code: "验证码",
  enterEmail: "请输入邮箱",
  enterPhone: "请输入手机号",
  enterPassword: "请输入密码",
  enterCode: "请输入 6 位验证码",
  signIn: "登录",
  switchPhone: "使用手机号密码登录",
  switchCode: "使用验证码登录",
  switchEmail: "返回邮箱密码登录",
  forgot: "忘记密码？",
  remember: "下次自动登录",
  other: "其他登录方式",
  create: "创建新账号",
  noAccount: "还没有账号？",
  register: "立即注册",
  getCode: "获取验证码",
  nickname: "昵称",
  gender: "性别",
  height: "身高",
  weight: "体重",
  birthday: "出生日期",
  male: "男",
  female: "女",
  private: "不便透露",
  metric: "公制",
  imperial: "英制",
  start: "开启旅程",
  home: "首页",
  me: "我的",
  reports: "评估记录",
  bodyProfile: "身体档案",
  settings: "设置",
  help: "测试帮助",
  latest: "最新评估结果",
  fullReport: "查看完整报告",
  core: "核心问题 / 亮点",
  issues: "核心问题",
  strengths: "核心亮点",
  history: "历史变化",
  training: "训练大纲",
  trainingPlan: "训练计划",
  next: "下一步建议",
  language: "语言",
  appearance: "外观模式",
  units: "单位设置",
  account: "账号安全",
  store: "切换门店",
  faq: "常见问题",
  about: "关于我们",
  system: "跟随系统",
  light: "浅色",
  dark: "深色",
  logout: "退出登录",
  logoutTitle: "确认退出登录？",
  logoutBody: "退出后需要重新登录，语言、外观和单位偏好会保留。",
  confirmLogout: "退出",
  save: "保存资料",
  saved: "资料已保存",
  demoOnly: "Demo 功能说明",
  demoDesc: "该入口已按线上结构保留，当前版本暂不连接真实后台服务。",
  close: "关闭",
  share: "分享",
  delete: "删除",
  cancel: "取消",
  confirmDelete: "确认删除",
  deleteTitle: "删除这份报告？",
  deleteBody: "删除后，该报告将从评估记录中移除，此操作无法撤销。",
  sendTitle: "发送报告到邮箱",
  sendDesc: "我们将把报告 PDF 和安全查看链接发送至该邮箱。",
  send: "发送报告",
  sending: "正在生成 PDF…",
  sent: "报告已发送",
  invalidEmail: "请输入有效邮箱地址",
  copied: "分享链接已复制",
  readOnly: "分享内容 · 只读",
  summary: "综合结论",
  actions: "调整建议",
  ai: "AI 报告解读",
  risks: "重点风险",
  disclaimer: "本内容仅供健康管理参考，不替代医疗诊断或治疗建议。",
  noReports: "暂无评估记录",
  invalidLogin: "请检查账号和密码。演示密码为 wellness1。",
  codeSent: "验证码已发送，演示验证码为 123456",
  demo: "本页面为本地交互 Demo，不会发送真实短信、邮件或上传健康数据。",
  showProfile: "显示用户信息",
  hideProfile: "隐藏用户信息",
  reportUpdatedAt: "历史报告更新时间",
  historyTrends: "历史趋势",
  weightTrend: "体重",
};
const en = {
  ...zh,
  welcome: "Welcome",
  trust:
    "Your trust matters. We use widely accepted technical and organizational safeguards to protect your personal information.",
  legal:
    "Before continuing, please review and accept the Terms of Service, Privacy Policy, and AI Disclaimer.",
  agree: "Agree and continue",
  emailLogin: "Email & password",
  phoneLogin: "Phone & password",
  codeLogin: "Verification code",
  email: "Email",
  phone: "Phone",
  password: "Password",
  code: "Code",
  enterEmail: "Enter your email",
  enterPhone: "Enter your phone number",
  enterPassword: "Enter your password",
  enterCode: "Enter the 6-digit code",
  signIn: "Sign in",
  switchPhone: "Use phone and password",
  switchCode: "Use verification code",
  switchEmail: "Back to email sign-in",
  forgot: "Forgot password?",
  remember: "Keep me signed in",
  other: "Other sign-in methods",
  create: "Create account",
  noAccount: "Don't have an account?",
  register: "Create account",
  getCode: "Get code",
  nickname: "Nickname",
  gender: "Gender",
  height: "Height",
  weight: "Weight",
  birthday: "Date of birth",
  male: "Male",
  female: "Female",
  private: "Prefer not to say",
  metric: "Metric",
  imperial: "Imperial",
  start: "Start my journey",
  home: "Home",
  me: "Me",
  reports: "Assessment records",
  bodyProfile: "Health profile",
  settings: "Settings",
  help: "Test help",
  latest: "Latest assessment",
  fullReport: "View full report",
  core: "Key findings",
  issues: "Issues",
  strengths: "Strengths",
  history: "Progress history",
  training: "Training outline",
  trainingPlan: "Training plan",
  next: "Next recommendation",
  language: "Language",
  appearance: "Appearance",
  units: "Units",
  account: "Account security",
  store: "Switch studio",
  faq: "FAQ",
  about: "About",
  system: "System",
  light: "Light",
  dark: "Dark",
  logout: "Sign out",
  logoutTitle: "Sign out?",
  logoutBody:
    "You will need to sign in again. Language, appearance, and unit preferences will be kept.",
  confirmLogout: "Sign out",
  save: "Save profile",
  saved: "Profile saved",
  demoOnly: "Demo information",
  demoDesc:
    "This entry mirrors the production structure but does not connect to live services in this demo.",
  close: "Close",
  share: "Share",
  delete: "Delete",
  cancel: "Cancel",
  confirmDelete: "Delete report",
  deleteTitle: "Delete this report?",
  deleteBody:
    "The report will be removed from your assessment history. This cannot be undone.",
  sendTitle: "Email report",
  sendDesc: "We will send a PDF and a secure viewing link to this address.",
  send: "Send report",
  sending: "Generating PDF…",
  sent: "Report sent",
  invalidEmail: "Enter a valid email address",
  copied: "Share link copied",
  readOnly: "Shared content · read only",
  summary: "Conclusion",
  actions: "Recommendations",
  ai: "AI interpretation",
  risks: "Key risks",
  disclaimer:
    "This content is for wellness management only and does not replace medical diagnosis or treatment.",
  noReports: "No assessment records",
  invalidLogin:
    "Check your account and password. The demo password is wellness1.",
  codeSent: "Code sent. The demo code is 123456.",
  demo: "This is a local interactive demo. It does not send real messages, emails, or health data.",
};
const de = {
  ...en,
  welcome: "Willkommen",
  agree: "Zustimmen und fortfahren",
  emailLogin: "E-Mail und Passwort",
  phoneLogin: "Telefon und Passwort",
  codeLogin: "Bestätigungscode",
  signIn: "Anmelden",
  create: "Konto erstellen",
  home: "Start",
  me: "Profil",
  reports: "Bewertungsverlauf",
  settings: "Einstellungen",
  language: "Sprache",
  appearance: "Darstellung",
  units: "Einheiten",
  system: "Systemstandard",
  light: "Hell",
  dark: "Dunkel",
  logout: "Abmelden",
  share: "Teilen",
  delete: "Löschen",
  training: "Trainingsübersicht",
};
const ar = {
  ...en,
  welcome: "مرحبًا بك",
  agree: "الموافقة والمتابعة",
  emailLogin: "البريد وكلمة المرور",
  phoneLogin: "الهاتف وكلمة المرور",
  codeLogin: "رمز التحقق",
  email: "البريد الإلكتروني",
  phone: "الهاتف",
  password: "كلمة المرور",
  code: "رمز التحقق",
  enterEmail: "أدخل بريدك الإلكتروني",
  enterPhone: "أدخل رقم الهاتف",
  enterPassword: "أدخل كلمة المرور",
  enterCode: "أدخل الرمز المكوّن من 6 أرقام",
  signIn: "تسجيل الدخول",
  switchPhone: "استخدام الهاتف وكلمة المرور",
  switchCode: "استخدام رمز التحقق",
  switchEmail: "العودة إلى تسجيل الدخول بالبريد",
  forgot: "هل نسيت كلمة المرور؟",
  remember: "تذكر تسجيل الدخول",
  other: "طرق تسجيل دخول أخرى",
  create: "إنشاء حساب",
  noAccount: "ليس لديك حساب؟",
  register: "إنشاء الحساب",
  getCode: "إرسال الرمز",
  nickname: "الاسم المستعار",
  gender: "الجنس",
  height: "الطول",
  weight: "الوزن",
  birthday: "تاريخ الميلاد",
  male: "ذكر",
  female: "أنثى",
  private: "أفضل عدم الإفصاح",
  metric: "متري",
  imperial: "إمبراطوري",
  start: "ابدأ رحلتي",
  home: "الرئيسية",
  me: "حسابي",
  reports: "سجل التقييمات",
  bodyProfile: "الملف الصحي",
  settings: "الإعدادات",
  language: "اللغة",
  appearance: "المظهر",
  units: "الوحدات",
  system: "النظام",
  light: "فاتح",
  dark: "داكن",
  logout: "تسجيل الخروج",
  share: "مشاركة",
  delete: "حذف",
  training: "مخطط التدريب",
  trainingPlan: "خطة التدريب",
  fullReport: "عرض التقرير الكامل",
  summary: "الخلاصة",
  actions: "التوصيات",
  ai: "تفسير التقرير بالذكاء الاصطناعي",
  risks: "المخاطر الرئيسية",
  cancel: "إلغاء",
  confirmDelete: "تأكيد الحذف",
  sendTitle: "إرسال التقرير بالبريد",
  send: "إرسال التقرير",
  readOnly: "محتوى مشترك · للقراءة فقط",
  demo: "هذا عرض تفاعلي محلي ولا يرسل رسائل أو بيانات صحية حقيقية.",
};
Object.assign(zh, {
  emailCodeLogin: "邮箱登录",
  emailCodeHint: "未注册的邮箱登录成功后将自动创建账号",
  phoneCodeHint: "验证码登录会产生短信费用，请优先使用邮箱登录",
  phonePasswordHint: "使用已注册手机号和密码登录。",
  switchEmailCode: "邮箱验证码登录",
  switchEmailPassword: "邮箱密码登录",
  switchPhoneCode: "手机验证码登录",
  switchPhonePassword: "手机密码登录",
  more: "更多登录方式",
  privacyAccept: "我已阅读并同意用户协议与隐私政策",
  google: "使用 Google 登录",
  facebook: "使用 Facebook 登录",
  guest: "游客体验",
  guestHint: "无需注册，使用示例数据浏览 WellnessHub",
  hideKeyboard: "收起键盘",
  scoreUnit: "分",
  measuredAt: "检测时间",
  device: "检测设备",
  phoneAuthTitle: "手机号登录",
});
Object.assign(en, {
  emailCodeLogin: "Email sign-in",
  emailCodeHint:
    "A new account will be created automatically if this email is not registered.",
  phoneCodeHint:
    "SMS verification may incur costs. Email sign-in is recommended.",
  phonePasswordHint:
    "Sign in with your registered phone number and password.",
  switchEmailCode: "Use an email code",
  switchEmailPassword: "Use email and password",
  switchPhoneCode: "Use a phone code",
  switchPhonePassword: "Use phone and password",
  more: "More sign-in options",
  privacyAccept:
    "I have read and accept the Terms of Service and Privacy Policy",
  google: "Continue with Google",
  facebook: "Continue with Facebook",
  guest: "Continue as guest",
  guestHint: "Explore WellnessHub with sample data—no registration required",
  hideKeyboard: "Hide keyboard",
  scoreUnit: "pts",
  measuredAt: "Measured",
  device: "Device",
  phoneAuthTitle: "Phone sign-in",
});
Object.assign(de, {
  trust:
    "Ihr Vertrauen ist uns wichtig. Wir schützen Ihre personenbezogenen Daten mit anerkannten technischen und organisatorischen Maßnahmen.",
  email: "E-Mail",
  phone: "Telefonnummer",
  password: "Passwort",
  code: "Bestätigungscode",
  enterEmail: "E-Mail-Adresse eingeben",
  enterPhone: "Telefonnummer eingeben",
  enterPassword: "Passwort eingeben",
  enterCode: "6-stelligen Code eingeben",
  forgot: "Passwort vergessen?",
  remember: "Angemeldet bleiben",
  other: "Andere Anmeldeoptionen",
  create: "Konto erstellen",
  noAccount: "Noch kein Konto?",
  register: "Konto erstellen",
  getCode: "Code senden",
  nickname: "Anzeigename",
  gender: "Geschlecht",
  height: "Körpergröße",
  weight: "Gewicht",
  birthday: "Geburtsdatum",
  male: "Männlich",
  female: "Weiblich",
  private: "Keine Angabe",
  metric: "Metrisch",
  imperial: "Imperial",
  start: "Reise beginnen",
  emailCodeLogin: "Anmeldung per E-Mail",
  emailCodeHint:
    "Ist diese E-Mail noch nicht registriert, wird automatisch ein Konto erstellt.",
  phoneCodeHint:
    "SMS können Kosten verursachen. Wir empfehlen die Anmeldung per E-Mail.",
  phonePasswordHint:
    "Mit Telefonnummer und Passwort anmelden. Die SMS-Option folgt auf der nächsten Seite.",
  switchEmailCode: "E-Mail-Code verwenden",
  switchEmailPassword: "E-Mail und Passwort verwenden",
  switchPhoneCode: "Telefon-Code verwenden",
  switchPhonePassword: "Telefon und Passwort verwenden",
  more: "Weitere Anmeldeoptionen",
  privacyAccept:
    "Ich akzeptiere die Nutzungsbedingungen und die Datenschutzrichtlinie",
  google: "Mit Google fortfahren",
  facebook: "Mit Facebook fortfahren",
  guest: "Als Gast fortfahren",
  guestHint: "WellnessHub ohne Registrierung mit Beispieldaten ansehen",
  hideKeyboard: "Tastatur schließen",
  scoreUnit: "Pkt.",
  measuredAt: "Gemessen",
  device: "Gerät",
  phoneAuthTitle: "Anmeldung per Telefon",
});
Object.assign(ar, {
  trust:
    "ثقتك مهمة لنا. نستخدم إجراءات تقنية وتنظيمية معتمدة لحماية معلوماتك الشخصية.",
  emailCodeLogin: "تسجيل الدخول بالبريد",
  emailCodeHint: "سيتم إنشاء حساب تلقائيًا إذا لم يكن البريد مسجلاً.",
  phoneCodeHint:
    "قد تترتب تكلفة على الرسائل. يُفضّل استخدام البريد الإلكتروني.",
  phonePasswordHint:
    "سجّل الدخول برقم الهاتف وكلمة المرور. خيار رمز الرسالة متاح في الصفحة التالية.",
  switchEmailCode: "استخدام رمز البريد",
  switchEmailPassword: "استخدام البريد وكلمة المرور",
  switchPhoneCode: "استخدام رمز الهاتف",
  switchPhonePassword: "استخدام الهاتف وكلمة المرور",
  more: "خيارات تسجيل دخول إضافية",
  privacyAccept: "قرأت شروط الاستخدام وسياسة الخصوصية وأوافق عليهما",
  google: "المتابعة باستخدام Google",
  facebook: "المتابعة باستخدام Facebook",
  guest: "المتابعة كزائر",
  guestHint: "استكشف WellnessHub ببيانات تجريبية من دون تسجيل",
  hideKeyboard: "إخفاء لوحة المفاتيح",
  scoreUnit: "نقطة",
  measuredAt: "وقت القياس",
  device: "الجهاز",
  phoneAuthTitle: "تسجيل الدخول بالهاتف",
});
Object.assign(zh, {
  legalIntro: "继续即表示您已阅读并同意",
  terms: "《用户协议》",
  privacy: "《隐私政策》",
  aiDisclaimer: "《AI 免责声明》",
  consentFootnote: "同意后，您仍可在设置中查看上述条款。",
  termsBody:
    "本 Demo 展示用户协议的打开与阅读流程。正式上线时将接入经法务审核的完整协议正文与版本记录。",
  privacyBody:
    "我们仅使用完成账号登录、身体评估与个性化建议所必需的信息。正式上线时将提供完整的数据处理、保存与删除说明。",
  aiDisclaimerBody:
    "AI 解读仅用于健康管理参考，不构成医疗诊断、治疗建议或紧急医疗服务。",
  moreHint: "手机号登录作为备用方式提供。",
  phonePasswordEntryHint: "使用手机号与密码继续",
  showPassword: "显示密码",
  hidePassword: "隐藏密码",
  resendCode: "重新获取",
  invalidEmailLogin: "请输入有效的邮箱地址。",
  emailPasswordHint: "使用已注册邮箱和密码登录。",
  invalidPhoneLogin: "请输入有效的手机号。",
  emptyPassword: "请输入密码。",
  wrongPassword: "密码不正确。演示密码为 wellness1。",
  wrongCode: "验证码不正确。演示验证码为 123456。",
  privacyRequired: "请先阅读并同意用户协议与隐私政策。",
  registerHint: "注册成功后，需要完善身体档案以生成个性化报告。",
  emailRegister: "邮箱注册",
  phoneRegister: "手机号注册",
  passwordRule: "至少 8 位字符",
  alreadyAccount: "已有账号？",
  returnLogin: "返回登录",
  profileHint: "这些信息将用于报告计算与个性化建议，请填写真实信息。",
  profileValidation: "请完整填写资料：年龄需为 13–100 岁。",
  dateFormat: "YYYY-MM-DD",
  resetPasswordHint: "密码找回为本地模拟流程。",
});
Object.assign(en, {
  legalIntro: "By continuing, you confirm that you have read and accept the",
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  aiDisclaimer: "AI Disclaimer",
  consentFootnote: "You can review these terms later in Settings.",
  termsBody:
    "This demo shows how the Terms are opened and reviewed. The production version will use the complete legally approved text and version history.",
  privacyBody:
    "We only use information needed for account access, body assessments, and personalized guidance. Production will include full processing, retention, and deletion details.",
  aiDisclaimerBody:
    "AI interpretation is for wellness guidance only and is not medical diagnosis, treatment advice, or emergency care.",
  moreHint: "Phone sign-in is available as a backup option.",
  phonePasswordEntryHint: "Continue with your phone number and password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  resendCode: "Resend",
  invalidEmailLogin: "Enter a valid email address.",
  emailPasswordHint: "Sign in with your registered email and password.",
  invalidPhoneLogin: "Enter a valid phone number.",
  emptyPassword: "Enter your password.",
  wrongPassword: "That password is incorrect. The demo password is wellness1.",
  wrongCode: "That code is incorrect. The demo code is 123456.",
  privacyRequired:
    "Accept the Terms of Service and Privacy Policy to continue.",
  registerHint:
    "After registration, complete your health profile for personalized reports.",
  emailRegister: "Email",
  phoneRegister: "Phone",
  passwordRule: "At least 8 characters",
  alreadyAccount: "Already have an account?",
  returnLogin: "Back to sign in",
  profileHint:
    "These details support report calculations and personalized guidance. Please enter accurate information.",
  profileValidation: "Complete all fields. Age must be between 13 and 100.",
  dateFormat: "YYYY-MM-DD",
  resetPasswordHint: "Password recovery is simulated in this demo.",
});
Object.assign(de, {
  legalIntro:
    "Mit dem Fortfahren bestätigen Sie, dass Sie Folgendes gelesen haben:",
  terms: "Nutzungsbedingungen",
  privacy: "Datenschutzrichtlinie",
  aiDisclaimer: "KI-Haftungsausschluss",
  consentFootnote:
    "Sie können diese Bedingungen später in den Einstellungen öffnen.",
  termsBody:
    "Diese Demo zeigt das Öffnen und Lesen der Nutzungsbedingungen. In der Produktversion wird der vollständige rechtlich geprüfte Text verwendet.",
  privacyBody:
    "Wir verwenden nur Daten, die für Anmeldung, Körperanalyse und persönliche Empfehlungen erforderlich sind.",
  aiDisclaimerBody:
    "KI-Auswertungen dienen nur dem Wohlbefinden und ersetzen keine medizinische Diagnose oder Behandlung.",
  moreHint: "Die Anmeldung per Telefon steht als Alternative zur Verfügung.",
  phonePasswordEntryHint: "Mit Telefonnummer und Passwort fortfahren",
  showPassword: "Passwort anzeigen",
  hidePassword: "Passwort ausblenden",
  resendCode: "Erneut senden",
  invalidEmailLogin: "Geben Sie eine gültige E-Mail-Adresse ein.",
  emailPasswordHint: "Mit registrierter E-Mail-Adresse und Passwort anmelden.",
  invalidPhoneLogin: "Geben Sie eine gültige Telefonnummer ein.",
  emptyPassword: "Geben Sie Ihr Passwort ein.",
  wrongPassword: "Das Passwort ist falsch. Demo-Passwort: wellness1.",
  wrongCode: "Der Code ist falsch. Demo-Code: 123456.",
  privacyRequired:
    "Akzeptieren Sie die Nutzungsbedingungen und die Datenschutzrichtlinie.",
  registerHint:
    "Ergänzen Sie nach der Registrierung Ihr Gesundheitsprofil für persönliche Berichte.",
  emailRegister: "E-Mail",
  phoneRegister: "Telefon",
  passwordRule: "Mindestens 8 Zeichen",
  alreadyAccount: "Sie haben bereits ein Konto?",
  returnLogin: "Zurück zur Anmeldung",
  profileHint:
    "Diese Angaben werden für Berichte und persönliche Empfehlungen verwendet.",
  profileValidation:
    "Füllen Sie alle Felder aus. Das Alter muss 13–100 Jahre betragen.",
  dateFormat: "JJJJ-MM-TT",
  resetPasswordHint:
    "Die Passwortwiederherstellung wird in dieser Demo simuliert.",
});
Object.assign(ar, {
  legalIntro: "بالمتابعة، فإنك تؤكد قراءة والموافقة على",
  terms: "شروط الاستخدام",
  privacy: "سياسة الخصوصية",
  aiDisclaimer: "إخلاء مسؤولية الذكاء الاصطناعي",
  consentFootnote: "يمكنك مراجعة هذه الشروط لاحقًا من الإعدادات.",
  termsBody:
    "يعرض هذا النموذج طريقة فتح شروط الاستخدام وقراءتها. سيحتوي الإصدار الفعلي على النص القانوني الكامل.",
  privacyBody:
    "نستخدم فقط المعلومات اللازمة لتسجيل الدخول والتقييمات والإرشادات المخصصة.",
  aiDisclaimerBody:
    "تفسير الذكاء الاصطناعي للإرشاد الصحي فقط ولا يُعد تشخيصًا أو علاجًا طبيًا.",
  moreHint: "يتوفر تسجيل الدخول بالهاتف كخيار بديل.",
  phonePasswordEntryHint: "المتابعة برقم الهاتف وكلمة المرور",
  showPassword: "إظهار كلمة المرور",
  hidePassword: "إخفاء كلمة المرور",
  resendCode: "إعادة الإرسال",
  invalidEmailLogin: "أدخل عنوان بريد إلكتروني صالحًا.",
  emailPasswordHint: "سجّل الدخول بالبريد المسجل وكلمة المرور.",
  invalidPhoneLogin: "أدخل رقم هاتف صالحًا.",
  emptyPassword: "أدخل كلمة المرور.",
  wrongPassword: "كلمة المرور غير صحيحة. كلمة مرور العرض: wellness1.",
  wrongCode: "الرمز غير صحيح. رمز العرض: 123456.",
  privacyRequired: "وافق على شروط الاستخدام وسياسة الخصوصية للمتابعة.",
  registerHint: "بعد التسجيل، أكمل ملفك الصحي للحصول على تقارير مخصصة.",
  emailRegister: "البريد الإلكتروني",
  phoneRegister: "الهاتف",
  passwordRule: "8 أحرف على الأقل",
  alreadyAccount: "لديك حساب بالفعل؟",
  returnLogin: "العودة إلى تسجيل الدخول",
  profileHint: "تُستخدم هذه البيانات لحساب التقارير وتقديم إرشادات مخصصة.",
  profileValidation: "أكمل جميع الحقول. يجب أن يكون العمر بين 13 و100 سنة.",
  dateFormat: "YYYY-MM-DD",
  resetPasswordHint: "استعادة كلمة المرور محاكاة في هذا العرض.",
});
Object.assign(zh, {
  age: "岁",
  mediumRisk: "中风险",
  conclusionTitle: "综合结论",
  priorityAdvice: "建议",
  subReports: "分项报告",
  subReportsHint: "快速打开你最关心的分项详情",
  attention: "需关注",
  normalExcellent: "正常/优秀",
  coreSub: "优先看到最值得行动的部分，也看见你的优势所在",
  historySub: "看清关键指标走势，把握身体变化节奏",
  viewAll: "查看全部",
  trendHint: "对比每次变化，更清楚进步方向",
  trainingSub: "基于您的测量报告、身体档案生成专属训练大纲",
  viewTraining: "查看完整训练大纲",
  rotateHint: "左右滑动旋转模型 · 双指缩放",
  viewDetails: "查看详情",
  bodyFatRate: "体脂率",
  muscleMass: "肌肉量",
  headForward: "头前引",
  shoulderBalance: "高低肩",
  waist: "腰围",
  hipGirth: "臀围",
  measurementReports: "测量与报告",
  bodyData: "身体数据",
  systemServices: "系统与服务",
  preferences: "偏好设置",
  accountBusiness: "账号与业务",
  support: "信息与支持",
  recordsCount: "条记录",
  showProfile: "显示用户信息",
  hideProfile: "隐藏用户信息",
  reportUpdatedAt: "历史报告更新时间",
  historyTrends: "历史趋势",
  weightTrend: "体重",
});
Object.assign(en, {
  age: "yrs",
  mediumRisk: "Medium risk",
  conclusionTitle: "Overall conclusion",
  priorityAdvice: "Recommendation",
  subReports: "Report sections",
  subReportsHint: "Open the section that matters most",
  attention: "Needs attention",
  normalExcellent: "Normal / strong",
  coreSub: "See the most actionable issues and your strongest results",
  historySub: "Track key metrics and understand your progress",
  viewAll: "View all",
  trendHint: "Compare assessments to see your progress",
  trainingSub:
    "A personalized outline based on your assessment and health profile",
  viewTraining: "View full training outline",
  rotateHint: "Swipe to rotate · Pinch to zoom",
  viewDetails: "View details",
  bodyFatRate: "Body fat",
  muscleMass: "Muscle mass",
  headForward: "Forward head",
  shoulderBalance: "Shoulder balance",
  waist: "Waist",
  hipGirth: "Hip girth",
  measurementReports: "Measurements & reports",
  bodyData: "Body data",
  systemServices: "System & services",
  preferences: "Preferences",
  accountBusiness: "Account & organization",
  support: "Information & support",
  recordsCount: "records",
  showProfile: "Show profile",
  hideProfile: "Hide profile",
  reportUpdatedAt: "Report updated",
  historyTrends: "History trends",
  weightTrend: "Weight",
});
Object.assign(de, {
  age: "J.",
  mediumRisk: "Mittleres Risiko",
  conclusionTitle: "Gesamtfazit",
  priorityAdvice: "Empfehlung",
  subReports: "Teilberichte",
  subReportsHint: "Öffnen Sie den wichtigsten Bericht",
  attention: "Beachten",
  normalExcellent: "Normal / sehr gut",
  coreSub: "Die wichtigsten Handlungsfelder und Stärken auf einen Blick",
  historySub: "Wichtige Messwerte und Fortschritte verfolgen",
  viewAll: "Alle anzeigen",
  trendHint: "Messungen vergleichen und Fortschritt erkennen",
  trainingSub: "Persönlicher Plan auf Basis von Messung und Gesundheitsprofil",
  viewTraining: "Vollständigen Trainingsplan ansehen",
  rotateHint: "Wischen zum Drehen · Zoomen mit zwei Fingern",
  viewDetails: "Details",
  bodyFatRate: "Körperfett",
  muscleMass: "Muskelmasse",
  headForward: "Kopfvorhaltung",
  shoulderBalance: "Schulterbalance",
  waist: "Taille",
  hipGirth: "Hüftumfang",
  measurementReports: "Messungen & Berichte",
  bodyData: "Körperdaten",
  systemServices: "System & Dienste",
  preferences: "Einstellungen",
  accountBusiness: "Konto & Organisation",
  support: "Information & Hilfe",
  recordsCount: "Einträge",
  showProfile: "Profil anzeigen",
  hideProfile: "Profil ausblenden",
  reportUpdatedAt: "Bericht aktualisiert",
  historyTrends: "Verlaufstrends",
  weightTrend: "Gewicht",
});
Object.assign(ar, {
  age: "سنة",
  mediumRisk: "خطر متوسط",
  conclusionTitle: "الخلاصة العامة",
  priorityAdvice: "التوصية",
  subReports: "أقسام التقرير",
  subReportsHint: "افتح القسم الأكثر أهمية لك",
  attention: "يحتاج إلى اهتمام",
  normalExcellent: "طبيعي / ممتاز",
  coreSub: "اطّلع على أهم النقاط القابلة للتنفيذ ونقاط القوة",
  historySub: "تتبّع المؤشرات الرئيسية وافهم تقدّمك",
  viewAll: "عرض الكل",
  trendHint: "قارن القياسات لمعرفة التقدّم",
  trainingSub: "مخطط مخصص وفق القياس والملف الصحي",
  viewTraining: "عرض مخطط التدريب الكامل",
  rotateHint: "اسحب للتدوير · قرّب بإصبعين",
  viewDetails: "عرض التفاصيل",
  bodyFatRate: "نسبة الدهون",
  muscleMass: "كتلة العضلات",
  headForward: "تقدّم الرأس",
  shoulderBalance: "توازن الكتفين",
  waist: "الخصر",
  hipGirth: "محيط الورك",
  measurementReports: "القياسات والتقارير",
  bodyData: "بيانات الجسم",
  systemServices: "النظام والخدمات",
  preferences: "التفضيلات",
  accountBusiness: "الحساب والمؤسسة",
  support: "المعلومات والدعم",
  recordsCount: "سجلات",
  showProfile: "إظهار الملف",
  hideProfile: "إخفاء الملف",
  reportUpdatedAt: "تحديث التقرير",
  historyTrends: "اتجاهات التاريخ",
  weightTrend: "الوزن",
});
Object.assign(zh, {
  leftArm: "左臂",
  rightArm: "右臂",
  leftLeg: "左腿",
  rightLeg: "右腿",
  normal: "正常",
  limited: "受限",
  abnormal: "异常",
  assessmentConclusion: "评估结论",
});
Object.assign(en, {
  leftArm: "Left arm",
  rightArm: "Right arm",
  leftLeg: "Left leg",
  rightLeg: "Right leg",
  normal: "Normal",
  limited: "Limited",
  abnormal: "Abnormal",
  assessmentConclusion: "Assessment conclusion",
});
Object.assign(de, {
  leftArm: "Linker Arm",
  rightArm: "Rechter Arm",
  leftLeg: "Linkes Bein",
  rightLeg: "Rechtes Bein",
  normal: "Normal",
  limited: "Eingeschränkt",
  abnormal: "Auffällig",
  assessmentConclusion: "Bewertungsfazit",
});
Object.assign(ar, {
  leftArm: "الذراع الأيسر",
  rightArm: "الذراع الأيمن",
  leftLeg: "الساق اليسرى",
  rightLeg: "الساق اليمنى",
  normal: "طبيعي",
  limited: "محدود",
  abnormal: "غير طبيعي",
  assessmentConclusion: "خلاصة التقييم",
});
Object.assign(zh, {
  targets: "关键目标",
  phases: "阶段路线",
  weekly: "周度框架",
  week: "第 {n} 周",
  weeklyFocus: "本周重点",
  weeklyAdvice: "建议保持每周 3 次训练，并在相同测量条件下记录变化。",
  executionProgress: "执行进度",
  dietPlan: "饮食计划",
  review: "进度复盘",
  pending: "待完成",
  completed: "已完成",
});
Object.assign(en, {
  targets: "Key targets",
  phases: "Program phases",
  weekly: "Weekly framework",
  week: "Week {n}",
  weeklyFocus: "This week's focus",
  weeklyAdvice:
    "Aim for three sessions per week and record changes under consistent conditions.",
  executionProgress: "Progress",
  dietPlan: "Nutrition plan",
  review: "Progress review",
  pending: "Pending",
  completed: "Completed",
});
Object.assign(de, {
  targets: "Ziele",
  phases: "Trainingsphasen",
  weekly: "Wochenplan",
  week: "Woche {n}",
  weeklyFocus: "Fokus dieser Woche",
  weeklyAdvice:
    "Drei Einheiten pro Woche; Veränderungen unter gleichen Bedingungen dokumentieren.",
  executionProgress: "Fortschritt",
  dietPlan: "Ernährungsplan",
  review: "Fortschrittscheck",
  pending: "Offen",
  completed: "Erledigt",
});
Object.assign(ar, {
  targets: "الأهداف الرئيسية",
  phases: "مراحل البرنامج",
  weekly: "الإطار الأسبوعي",
  week: "الأسبوع {n}",
  weeklyFocus: "تركيز هذا الأسبوع",
  weeklyAdvice:
    "استهدف ثلاث حصص أسبوعياً وسجّل التغيّرات في ظروف قياس متشابهة.",
  executionProgress: "التقدم",
  dietPlan: "خطة التغذية",
  review: "مراجعة التقدم",
  pending: "قيد الانتظار",
  completed: "مكتمل",
});
Object.assign(de, {
  legal:"Bitte lesen und akzeptieren Sie Nutzungsbedingungen, Datenschutz und KI-Hinweise.", switchPhone:"Telefon und Passwort verwenden", switchCode:"Bestätigungscode verwenden", switchEmail:"Zurück zur E-Mail-Anmeldung",
  bodyProfile:"Körperprofil", help:"Hilfe zur Messung", latest:"Letzte Bewertung", fullReport:"Vollständiger Bericht", core:"Erkenntnisse", issues:"Handlungsfelder", strengths:"Stärken", history:"Verlauf", trainingPlan:"Trainingsplan", next:"Nächster Schritt",
  account:"Kontosicherheit", store:"Studio wechseln", faq:"Häufige Fragen", about:"Über uns", logoutTitle:"Jetzt abmelden?", logoutBody:"Für den nächsten Besuch müssen Sie sich erneut anmelden. Sprache, Darstellung und Einheiten bleiben gespeichert.", confirmLogout:"Abmelden", save:"Profil speichern", saved:"Profil gespeichert",
  demoOnly:"Hinweis zur Demo", demoDesc:"Diese Funktion wird hier nur demonstriert und ist nicht mit einem Live-Dienst verbunden.", close:"Schließen", cancel:"Abbrechen", confirmDelete:"Bericht löschen", deleteTitle:"Diesen Bericht löschen?", deleteBody:"Der Bericht wird dauerhaft aus Ihrem Verlauf entfernt.",
  sendTitle:"Bericht per E-Mail", sendDesc:"Der Bericht wird als PDF und mit einem Ansichtslink an diese Adresse gesendet.", send:"Bericht senden", sending:"PDF wird erstellt…", sent:"Bericht gesendet", invalidEmail:"Gültige E-Mail-Adresse eingeben", copied:"Freigabelink kopiert", readOnly:"Geteilter Inhalt · nur lesen",
  summary:"Zusammenfassung", actions:"Empfehlungen", ai:"KI-Berichtsanalyse", risks:"Wichtige Risiken", disclaimer:"Nur zur Gesundheitsinformation. Kein Ersatz für medizinische Diagnose oder Behandlung.", noReports:"Noch keine Bewertungen", invalidLogin:"Bitte Zugangsdaten prüfen. Das Demo-Passwort lautet wellness1.", codeSent:"Code gesendet. Demo-Code: 123456.", demo:"Lokale interaktive Demo. Es werden keine echten Nachrichten, E-Mails oder Gesundheitsdaten versendet.", phonePasswordHint:"Mit registrierter Telefonnummer und Passwort anmelden."
});
Object.assign(ar, {
  legal:"يرجى قراءة شروط الاستخدام وسياسة الخصوصية وإخلاء مسؤولية الذكاء الاصطناعي والموافقة عليها.", help:"مساعدة القياس", latest:"آخر تقييم", core:"أهم النتائج", issues:"نقاط الاهتمام", strengths:"نقاط القوة", history:"سجل التقدم", next:"الخطوة التالية", account:"أمان الحساب", store:"تغيير المركز", faq:"الأسئلة الشائعة", about:"من نحن",
  logoutTitle:"هل تريد تسجيل الخروج؟", logoutBody:"ستحتاج إلى تسجيل الدخول مجددًا. ستُحفظ تفضيلات اللغة والمظهر والوحدات.", confirmLogout:"تسجيل الخروج", save:"حفظ الملف", saved:"تم حفظ الملف", demoOnly:"معلومات العرض التجريبي", demoDesc:"هذه الوظيفة للعرض فقط وغير متصلة بخدمة فعلية.", close:"إغلاق", deleteTitle:"هل تريد حذف هذا التقرير؟", deleteBody:"سيُحذف التقرير من سجلك نهائيًا ولا يمكن التراجع عن ذلك.",
  sendDesc:"سيُرسل التقرير بصيغة PDF مع رابط لعرضه إلى هذا البريد.", sending:"جارٍ إنشاء PDF…", sent:"تم إرسال التقرير", invalidEmail:"أدخل بريدًا إلكترونيًا صالحًا", copied:"تم نسخ رابط المشاركة", disclaimer:"لإدارة الصحة فقط، ولا يحل محل التشخيص أو العلاج الطبي.", noReports:"لا توجد تقييمات بعد", invalidLogin:"تحقق من بيانات الدخول. كلمة مرور العرض هي wellness1.", codeSent:"تم إرسال الرمز. رمز العرض هو 123456.", phonePasswordHint:"سجّل الدخول برقم الهاتف المسجّل وكلمة المرور."
});
const lang = { zh, en, de, ar };
const moduleNames: Record<Locale, Record<ModuleId, string>> = {
  zh: {
    composition: "身体成分",
    posture: "体态评估",
    balance: "平衡评估",
    neck: "颈部功能",
    hip: "臀型评估",
    spine: "脊柱评估",
    girth: "体围测量",
  },
  en: {
    composition: "Body composition",
    posture: "Posture",
    balance: "Balance",
    neck: "Neck function",
    hip: "Hip shape",
    spine: "Spine",
    girth: "Body girths",
  },
  de: {
    composition: "Körperzusammensetzung",
    posture: "Körperhaltung",
    balance: "Gleichgewicht",
    neck: "Nackenfunktion",
    hip: "Gesäßform",
    spine: "Wirbelsäule",
    girth: "Körperumfänge",
  },
  ar: {
    composition: "تكوين الجسم",
    posture: "القوام",
    balance: "التوازن",
    neck: "وظائف الرقبة",
    hip: "شكل الورك",
    spine: "العمود الفقري",
    girth: "محيطات الجسم",
  },
};
const metricLabels: Record<Locale, Record<ModuleId, string[]>> = {
  zh: {
    composition: [
      "体重",
      "去脂体重",
      "体脂肪",
      "肌肉量",
      "蛋白质",
      "体脂率",
      "BMI",
      "内脏脂肪等级",
    ],
    posture: ["头前引", "头侧歪", "左圆肩", "右圆肩", "高低肩", "骨盆前移"],
    balance: [
      "感官系统评价",
      "视觉感官评价",
      "COP 轨迹面积",
      "平均速度",
      "最大偏移",
    ],
    neck: ["颈椎前屈", "颈椎后伸", "左侧屈", "右侧屈", "左旋转", "右旋转"],
    hip: ["本次臀围", "上次臀围", "首次臀围", "当前臀型"],
    spine: ["脊柱结构异常", "异常程度", "重点区域", "疼痛风险"],
    girth: [
      "颈围",
      "左上臂围",
      "右上臂围",
      "胸围",
      "高腰围",
      "中腰围",
      "低腰围",
      "臀围",
      "左大腿围",
      "右大腿围",
    ],
  },
  en: {
    composition: [
      "Weight",
      "Lean mass",
      "Body fat",
      "Muscle mass",
      "Protein",
      "Body fat percentage",
      "BMI",
      "Visceral fat level",
    ],
    posture: [
      "Forward head",
      "Head tilt",
      "Left rounded shoulder",
      "Right rounded shoulder",
      "Shoulder asymmetry",
      "Pelvic translation",
    ],
    balance: [
      "Sensory system",
      "Visual system",
      "COP path area",
      "Average velocity",
      "Maximum displacement",
    ],
    neck: [
      "Neck flexion",
      "Neck extension",
      "Left lateral flexion",
      "Right lateral flexion",
      "Left rotation",
      "Right rotation",
    ],
    hip: [
      "Current hip girth",
      "Previous hip girth",
      "Baseline hip girth",
      "Current hip shape",
    ],
    spine: ["Spinal anomaly score", "Severity", "Focus area", "Pain risk"],
    girth: [
      "Neck girth",
      "Left upper arm",
      "Right upper arm",
      "Chest",
      "High waist",
      "Mid waist",
      "Low waist",
      "Hip girth",
      "Left thigh",
      "Right thigh",
    ],
  },
  de: {
    composition: [
      "Gewicht",
      "Fettfreie Masse",
      "Körperfett",
      "Muskelmasse",
      "Protein",
      "Körperfettanteil",
      "BMI",
      "Viszeralfett",
    ],
    posture: [
      "Kopfvorhaltung",
      "Kopfneigung",
      "Linke Rundschulter",
      "Rechte Rundschulter",
      "Schulterasymmetrie",
      "Beckenverschiebung",
    ],
    balance: [
      "Sensorisches System",
      "Visuelles System",
      "COP-Fläche",
      "Mittlere Geschwindigkeit",
      "Maximale Abweichung",
    ],
    neck: [
      "Nackenbeugung",
      "Nackenstreckung",
      "Linksneigung",
      "Rechtsneigung",
      "Linksdrehung",
      "Rechtsdrehung",
    ],
    hip: [
      "Aktueller Hüftumfang",
      "Vorheriger Hüftumfang",
      "Ausgangswert Hüfte",
      "Aktuelle Gesäßform",
    ],
    spine: ["Wirbelsäulenwert", "Schweregrad", "Fokusbereich", "Schmerzrisiko"],
    girth: [
      "Halsumfang",
      "Linker Oberarm",
      "Rechter Oberarm",
      "Brustumfang",
      "Obere Taille",
      "Mittlere Taille",
      "Untere Taille",
      "Hüftumfang",
      "Linker Oberschenkel",
      "Rechter Oberschenkel",
    ],
  },
  ar: {
    composition: [
      "الوزن",
      "الكتلة الخالية من الدهون",
      "دهون الجسم",
      "كتلة العضلات",
      "البروتين",
      "نسبة الدهون",
      "مؤشر كتلة الجسم",
      "مستوى الدهون الحشوية",
    ],
    posture: [
      "تقدّم الرأس",
      "ميل الرأس",
      "استدارة الكتف الأيسر",
      "استدارة الكتف الأيمن",
      "عدم تماثل الكتفين",
      "إزاحة الحوض",
    ],
    balance: [
      "النظام الحسي",
      "النظام البصري",
      "مساحة مسار الضغط",
      "متوسط السرعة",
      "أقصى انحراف",
    ],
    neck: [
      "ثني الرقبة",
      "مد الرقبة",
      "الميل الجانبي الأيسر",
      "الميل الجانبي الأيمن",
      "الدوران الأيسر",
      "الدوران الأيمن",
    ],
    hip: [
      "محيط الورك الحالي",
      "محيط الورك السابق",
      "المحيط الأساسي",
      "شكل الورك الحالي",
    ],
    spine: ["درجة اضطراب العمود", "درجة الشدة", "المنطقة الأهم", "خطر الألم"],
    girth: [
      "محيط الرقبة",
      "الذراع الأيسر",
      "الذراع الأيمن",
      "الصدر",
      "الخصر العلوي",
      "الخصر الأوسط",
      "الخصر السفلي",
      "محيط الورك",
      "الفخذ الأيسر",
      "الفخذ الأيمن",
    ],
  },
};
const modules: ReportModule[] = [
  {
    id: "composition",
    score: 47,
    status: "risk",
    metrics: [
      { label: "体重", value: "72.8 kg" },
      { label: "去脂体重", value: "42.1 kg" },
      { label: "体脂肪", value: "30.7 kg", tone: "risk" },
      { label: "肌肉量", value: "39.7 kg" },
      { label: "蛋白质", value: "8.3 kg" },
      { label: "体脂率", value: "42.1%", tone: "risk" },
      { label: "BMI", value: "24.6 kg/m²", tone: "risk" },
      { label: "内脏脂肪等级", value: "13.0", tone: "risk" },
    ],
    finding: "脂肪量高于建议区间，肌肉量不足，内脏脂肪风险需要优先关注。",
    advice:
      "建议减脂 20.9 kg、增加肌肉 12.6 kg；每周进行 3 次抗阻训练与 150 分钟中等强度有氧。",
  },
  {
    id: "posture",
    score: 62,
    status: "attention",
    metrics: [
      { label: "头前引", value: "3.8 cm", tone: "warn" },
      { label: "头侧歪", value: "2.4°" },
      { label: "左圆肩", value: "3.1 cm", tone: "warn" },
      { label: "右圆肩", value: "2.5 cm" },
      { label: "高低肩", value: "-11.4°", tone: "warn" },
      { label: "骨盆前移", value: "8.5 cm", tone: "risk" },
    ],
    finding: "头前引、圆肩、高低肩及骨盆前移存在不同程度偏离。",
    advice: "减少久坐，每日完成胸椎伸展、颈深屈肌和肩胛稳定练习。",
  },
  {
    id: "balance",
    score: 63,
    status: "attention",
    metrics: [
      { label: "感官系统评价", value: "优秀", tone: "good" },
      { label: "视觉感官评价", value: "较差", tone: "risk" },
      { label: "COP 轨迹面积", value: "32.83 mm²" },
      { label: "平均速度", value: "3.70 mm/s" },
      { label: "最大偏移", value: "3.15 mm" },
    ],
    finding: "本体感觉与前庭功能整合较好，但闭眼时的稳定能力需加强。",
    advice: "从扶墙单腿站立开始，每次 30 秒，每侧 3 组。",
  },
  {
    id: "neck",
    score: 58,
    status: "risk",
    metrics: [
      { label: "颈椎前屈", value: "24.8°", tone: "risk" },
      { label: "颈椎后伸", value: "39.7°", tone: "risk" },
      { label: "左侧屈", value: "43.4°", tone: "risk" },
      { label: "右侧屈", value: "36.6°", tone: "risk" },
      { label: "左旋转", value: "59.8°", tone: "risk" },
      { label: "右旋转", value: "56.9°", tone: "risk" },
    ],
    finding:
      "颈椎六项活动度均受限，可能与核心稳定不足、肌肉紧张或主动肌无力有关。",
    advice: "具体原因需要专业人士进一步筛查。",
  },
  {
    id: "hip",
    score: 78,
    status: "attention",
    metrics: [
      { label: "本次臀围", value: "143.7 cm" },
      { label: "上次臀围", value: "112.1 cm" },
      { label: "首次臀围", value: "115.6 cm" },
      { label: "当前臀型", value: "梨形臀" },
    ],
    finding: "梨形臀视觉感官上窄下宽，下臀肌肉和脂肪分布较多。",
    advice: "结合臀中肌、臀大肌强化和整体体脂管理。",
  },
  {
    id: "spine",
    score: 16,
    status: "risk",
    metrics: [
      { label: "脊柱结构异常", value: "16 分", tone: "risk" },
      { label: "异常程度", value: "中度异常", tone: "risk" },
      { label: "重点区域", value: "胸椎" },
      { label: "疼痛风险", value: "17 分", tone: "warn" },
    ],
    finding: "脊柱结构中度异常，胸椎是当前需要优先关注的区域。",
    advice: "建议专业矫正干预并定期复查评估。",
  },
  {
    id: "girth",
    score: 82,
    status: "good",
    metrics: [
      { label: "颈围", value: "40.2 cm" },
      { label: "左上臂围", value: "38.2 cm" },
      { label: "右上臂围", value: "39.2 cm" },
      { label: "胸围", value: "107.7 cm" },
      { label: "高腰围", value: "106.5 cm" },
      { label: "中腰围", value: "107.8 cm" },
      { label: "低腰围", value: "108.3 cm", tone: "risk" },
      { label: "臀围", value: "113.1 cm" },
      { label: "左大腿围", value: "65.8 cm" },
      { label: "右大腿围", value: "66.8 cm" },
    ],
    finding: "腰腹围度偏高，上下肢围度整体较为对称。",
    advice: "每两周在相同状态下复测并持续管理腰腹围度。",
  },
];
const seed: Report[] = [
  {
    id: "m60-20260810",
    date: "2026-08-10 16:09",
    device: "VISBODY M60",
    score: 82,
    summary: "体态表现整体可控，但代谢风险和下肢稳定仍需优先处理。",
    modules,
  },
  {
    id: "m60-20260806",
    date: "2026-08-06 16:52",
    device: "VISBODY M60",
    score: 79,
    summary: "综合表现较上次提升 3 分，体脂和腰腹围度仍需持续管理。",
    modules,
  },
  {
    id: "m60-20260723",
    date: "2026-07-23 13:49",
    device: "VISBODY M60",
    score: 76,
    summary: "首次测量已建立基线，建议从基础力量和日常活动习惯开始。",
    modules,
  },
];
const highlights = {
  issues: [
    {
      title: "体脂与内脏脂肪偏高",
      summary: "体脂率 42.1%，内脏脂肪等级 13，建议优先干预。",
      module: "composition",
    },
    {
      title: "颈部活动度受限",
      summary: "六个方向均低于理想范围，建议先评估再训练。",
      module: "neck",
    },
    {
      title: "胸椎结构需关注",
      summary: "结构异常评分 16 分，当前为中度异常。",
      module: "spine",
    },
  ],
  strengths: [
    {
      title: "感官系统平衡优秀",
      summary: "闭眼静态平衡的感官整合能力表现稳定。",
      module: "balance",
    },
    {
      title: "上下肢围度较对称",
      summary: "左右上臂与大腿围度差异处于可控范围。",
      module: "girth",
    },
  ],
};
const trendData = [
  {
    name: "综合评分",
    values: [74, 76, 77, 79, 80, 81, 82],
    dates: ["08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10"],
    unit: "分",
  },
  {
    name: "体脂率",
    values: [44.1, 43.8, 43.5, 43.2, 42.9, 42.5, 42.1],
    dates: ["08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10"],
    unit: "%",
  },
  {
    name: "肌肉量",
    values: [38.2, 38.5, 38.8, 39.0, 39.2, 39.5, 39.7],
    dates: ["08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10"],
    unit: "kg",
  },
  {
    name: "体重",
    values: [75.2, 74.8, 74.4, 74.0, 73.6, 73.2, 72.8],
    dates: ["08-04", "08-05", "08-06", "08-07", "08-08", "08-09", "08-10"],
    unit: "kg",
  },
];
function resolveReportModule(moduleId: ModuleId): ModuleId {
  return moduleId;
}
function calcAge(birthday: string) {
  const ms = Date.now() - new Date(birthday).getTime();
  return Math.max(0, Math.floor(ms / 31557600000));
}
const outline = {
  goal: "降低内脏脂肪与腹部围度，提升核心稳定和颈肩活动度。",
  title: "酒歌的体态塑形 4 周计划",
  heroDesc:
    "这份方案为体重 95.2 公斤、体脂率 34.7% 的酒歌设计，在不增加腰围负担的前提下稳健改善体态与饮食习惯。",
  status: "共 4 周 · 每周 4 次",
  metrics: [
    { label: "体脂率目标", value: "34.7% → 32%" },
    { label: "腰围目标", value: "104.3 → 99 cm" },
    { label: "体态重点", value: "体态优化" },
    { label: "预计可见变化", value: "约 4 周可见" },
  ],
  goals: [
    {
      name: "体态与腰腹调整",
      tag: "体态优化",
      tone: "",
      desc: "围绕脊柱中立与骨盆稳定展开训练，优先改善腰腹组织与圆肩姿态。",
    },
    {
      name: "素食营养适配",
      tag: "素食",
      tone: "orange",
      desc: "主食以低 GI 全谷物为主，搭配豆腐、鹰嘴豆等优质植物蛋白。",
    },
    {
      name: "控糖节奏配合",
      tag: "糖尿病",
      tone: "red",
      desc: "训练安排在餐后 60–90 分钟进行，帮助餐后血糖更平稳回落。",
    },
  ],
  phases: [
    {
      name: "呼吸与体态筑基",
      weeks: "第 1 周",
      tag: "",
      desc: "以腹式呼吸、山式站姿与脊柱序列为主，松开腰部松弛与胸椎紧张。",
    },
    {
      name: "核心唤醒与下肢激活",
      weeks: "第 2–3 周",
      tag: "purple",
      desc: "加入船式、桥式、深蹲与站立序列，提升核心稳定与基础代谢。",
    },
    {
      name: "整合收束与延续",
      weeks: "第 4 周",
      tag: "cyan",
      desc: "把前面三周的呼吸、体式串联成一段可长期执行的日常练习。",
    },
  ],
  nutritionKcal: 2465,
  nutrients: [
    { name: "蛋白质", target: "152 g", pct: 25, tip: "豆腐、纳豆、天贝、鹰嘴豆" },
    { name: "碳水化合物", target: "291 g", pct: 47, tip: "燕麦、糙米、藜麦、薯类" },
    { name: "脂肪", target: "77 g", pct: 28, tip: "橄榄油、牛油果、亚麻籽、核桃" },
    { name: "膳食纤维", target: "≥30 g", pct: 70, tip: "燕麦麸、奇亚籽、绿叶菜" },
    { name: "饮水", target: "1700 ml", pct: 68, tip: "白开水、无糖淡茶，分次补水" },
  ],
  weeks: [
    { label: "第 1 周", status: "当前阶段", focus: "呼吸与体态筑基" },
    { label: "第 2 周", status: "生成后解锁", focus: "核心与下肢激活" },
    { label: "第 3 周", status: "生成后解锁", focus: "稳定进阶" },
    { label: "第 4 周", status: "生成后解锁", focus: "整合收束" },
  ],
  review:
    "第 1 周先以腹式呼吸、脊柱序列和髋部松解为主，帮助重新建立起对中立位的感知，同时把作息与素食餐结构理顺。",
  days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  exercises: [
    { name: "腹式呼吸", rx: "3 组 × 8 次", tip: "建立核心启动感" },
    { name: "猫牛式", rx: "2 组 × 10 次", tip: "松开胸腰椎" },
    { name: "桥式", rx: "3 组 × 12 次", tip: "激活臀与后链" },
    { name: "箱式深蹲", rx: "3 组 × 10 次", tip: "下肢稳定发力" },
  ],
  meals: [
    { time: "07:30 早餐", name: "燕麦粥 + 豆腐干 + 莓果", tip: "低 GI 开胃，稳血糖" },
    { time: "12:30 午餐", name: "糙米饭 + 鹰嘴豆咖喱 + 绿叶菜", tip: "蛋白与纤维充足" },
    { time: "18:30 晚餐", name: "藜麦沙拉 + 烤时蔬 + 坚果", tip: "清淡收束，便于睡眠" },
  ],
};
const outlineByLocale: Record<
  Locale,
  typeof outline & { dietHeroTitle: string; dietHeroDesc: string; execIntro: string; strategyTags: string[] }
> = {
  zh: {
    ...outline,
    dietHeroTitle: "热量设计 · 燃料 × 消耗",
    dietHeroDesc: "本计划每日目标能量",
    execIntro: "每周四次、每次约 60 分钟，围绕脊柱与髋关节稳定设计。",
    strategyTags: ["呼吸筑基", "体态感知", "餐后控糖"],
  },
  en: {
    ...outline,
    title: "Jiuge Posture Shaping · 4 Weeks",
    heroDesc:
      "Built for Jiuge (95.2 kg, 34.7% body fat): improve posture and waist without adding abdominal load.",
    status: "4 weeks · 4 sessions / week",
    metrics: [
      { label: "Body fat target", value: "34.7% → 32%" },
      { label: "Waist target", value: "104.3 → 99 cm" },
      { label: "Posture focus", value: "Posture optimization" },
      { label: "Visible change", value: "~4 weeks" },
    ],
    goals: [
      {
        name: "Posture & waist",
        tag: "Priority",
        tone: "",
        desc: "Spine-neutral and pelvic stability work to improve waistline and rounded shoulders.",
      },
      {
        name: "Vegetarian nutrition",
        tag: "Diet",
        tone: "orange",
        desc: "Low-GI whole grains with tofu, chickpeas and other plant proteins.",
      },
      {
        name: "Glucose rhythm",
        tag: "Metabolic",
        tone: "red",
        desc: "Train 60–90 min after meals to smooth post-meal glucose curves.",
      },
    ],
    phases: [
      {
        name: "Breath & posture base",
        weeks: "Week 1",
        tag: "",
        desc: "Diaphragmatic breathing, mountain pose and spinal sequences to release tension.",
      },
      {
        name: "Core & lower-body activation",
        weeks: "Weeks 2–3",
        tag: "purple",
        desc: "Boat, bridge, squat and standing flows to raise core stability and metabolism.",
      },
      {
        name: "Integration & carry-over",
        weeks: "Week 4",
        tag: "cyan",
        desc: "Chain prior weeks into a sustainable daily practice you can keep.",
      },
    ],
    nutrients: [
      { name: "Protein", target: "152 g", pct: 25, tip: "Tofu, tempeh, chickpeas" },
      { name: "Carbs", target: "291 g", pct: 47, tip: "Oats, brown rice, quinoa" },
      { name: "Fat", target: "77 g", pct: 28, tip: "Olive oil, avocado, walnuts" },
      { name: "Fiber", target: "≥30 g", pct: 70, tip: "Oat bran, chia, leafy greens" },
      { name: "Water", target: "1700 ml", pct: 68, tip: "Plain water, unsweetened tea" },
    ],
    weeks: [
      { label: "Week 1", status: "Current", focus: "Breath & posture base" },
      { label: "Week 2", status: "Unlocks later", focus: "Core activation" },
      { label: "Week 3", status: "Unlocks later", focus: "Progressive build" },
      { label: "Week 4", status: "Unlocks later", focus: "Integration" },
    ],
    review:
      "Week 1 focuses on breath, spinal mobility and hip release while stabilizing vegetarian meal structure.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    exercises: [
      { name: "Diaphragmatic breath", rx: "3 × 8", tip: "Activate core brace" },
      { name: "Cat-cow", rx: "2 × 10", tip: "Thoracic mobility" },
      { name: "Glute bridge", rx: "3 × 12", tip: "Posterior chain" },
      { name: "Box squat", rx: "3 × 10", tip: "Lower-body stability" },
    ],
    meals: [
      { time: "07:30 Breakfast", name: "Oat porridge + tofu + berries", tip: "Low-GI start" },
      { time: "12:30 Lunch", name: "Brown rice + chickpea curry + greens", tip: "Protein & fiber" },
      { time: "18:30 Dinner", name: "Quinoa salad + roasted veg + nuts", tip: "Light finish" },
    ],
    dietHeroTitle: "Calorie design · fuel × burn",
    dietHeroDesc: "Daily energy target",
    execIntro: "Four ~60 min sessions per week focused on spine and hip stability.",
    strategyTags: ["Breath base", "Posture awareness", "Post-meal glucose"],
  },
  de: {
    ...outline,
    title: "Jiuge Haltung · 4 Wochen",
    heroDesc:
      "Für Jiuge (95,2 kg, 34,7 % Körperfett): Haltung und Taille verbessern ohne zusätzliche Bauchbelastung.",
    status: "4 Wochen · 4 Einheiten / Woche",
    metrics: [
      { label: "Körperfett-Ziel", value: "34,7 % → 32 %" },
      { label: "Taillen-Ziel", value: "104,3 → 99 cm" },
      { label: "Haltungsfokus", value: "Haltungsoptimierung" },
      { label: "Sichtbare Veränderung", value: "~4 Wochen" },
    ],
    goals: [
      {
        name: "Haltung & Taille",
        tag: "Priorität",
        tone: "",
        desc: "Wirbelsäulenneutralität und Beckenstabilität für Taille und Rundrücken.",
      },
      {
        name: "Vegetarische Ernährung",
        tag: "Ernährung",
        tone: "orange",
        desc: "Vollkorn mit niedrigem GI plus Tofu, Kichererbsen und pflanzlichem Protein.",
      },
      {
        name: "Zuckerrhythmus",
        tag: "Stoffwechsel",
        tone: "red",
        desc: "Training 60–90 Min. nach Mahlzeiten für stabilere Glukosekurven.",
      },
    ],
    phases: [
      {
        name: "Atem- & Haltungsbasis",
        weeks: "Woche 1",
        tag: "",
        desc: "Zwerchfellatmung, Bergpose und Wirbelsäulensequenzen zur Entspannung.",
      },
      {
        name: "Core & Unterkörper",
        weeks: "Woche 2–3",
        tag: "purple",
        desc: "Boot, Brücke, Kniebeuge und Stehsequenzen für Stabilität und Stoffwechsel.",
      },
      {
        name: "Integration",
        weeks: "Woche 4",
        tag: "cyan",
        desc: "Vorherige Wochen zu einer nachhaltigen Alltagsroutine verbinden.",
      },
    ],
    nutrients: [
      { name: "Protein", target: "152 g", pct: 25, tip: "Tofu, Tempeh, Kichererbsen" },
      { name: "Kohlenhydrate", target: "291 g", pct: 47, tip: "Hafer, Vollkornreis, Quinoa" },
      { name: "Fett", target: "77 g", pct: 28, tip: "Olivenöl, Avocado, Walnüsse" },
      { name: "Ballaststoffe", target: "≥30 g", pct: 70, tip: "Haferkleie, Chia, Blattgemüse" },
      { name: "Wasser", target: "1700 ml", pct: 68, tip: "Wasser, ungesüßter Tee" },
    ],
    weeks: [
      { label: "Woche 1", status: "Aktuell", focus: "Atem- & Haltungsbasis" },
      { label: "Woche 2", status: "Später", focus: "Core-Aktivierung" },
      { label: "Woche 3", status: "Später", focus: "Aufbau" },
      { label: "Woche 4", status: "Später", focus: "Integration" },
    ],
    review:
      "Woche 1: Atem, Wirbelsäulenmobilität und Hüftlösung; vegetarische Mahlzeiten strukturieren.",
    days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    exercises: [
      { name: "Zwerchfellatmung", rx: "3 × 8", tip: "Core aktivieren" },
      { name: "Katze-Kuh", rx: "2 × 10", tip: "Brustwirbelsäule" },
      { name: "Glute bridge", rx: "3 × 12", tip: "Posterior chain" },
      { name: "Box-Kniebeuge", rx: "3 × 10", tip: "Beinstabilität" },
    ],
    meals: [
      { time: "07:30 Frühstück", name: "Haferbrei + Tofu + Beeren", tip: "Niedriger GI" },
      { time: "12:30 Mittag", name: "Vollkornreis + Kichererbsen-Curry", tip: "Protein & Ballaststoffe" },
      { time: "18:30 Abend", name: "Quinoa-Salat + Ofengemüse", tip: "Leichtes Finish" },
    ],
    dietHeroTitle: "Kaloriendesign · Energie × Verbrauch",
    dietHeroDesc: "Tägliches Energieziel",
    execIntro: "Vier ~60-Min.-Einheiten pro Woche für Wirbelsäule und Hüftstabilität.",
    strategyTags: ["Atembasis", "Haltungsbewusstsein", "Glukose nach Mahlzeit"],
  },
  ar: {
    ...outline,
    title: "تشكيل وضعية Jiuge · 4 أسابيع",
    heroDesc:
      "مصمم لـ Jiuge (95.2 كغ، 34.7% دهون): تحسين الوضعية والخصر دون زيادة عبء البطن.",
    status: "4 أسابيع · 4 جلسات / أسبوع",
    metrics: [
      { label: "هدف دهون الجسم", value: "34.7% → 32%" },
      { label: "هدف محيط الخصر", value: "104.3 → 99 سم" },
      { label: "تركيز الوضعية", value: "تحسين الوضعية" },
      { label: "تغير مرئي", value: "~4 أسابيع" },
    ],
    goals: [
      {
        name: "الوضعية والخصر",
        tag: "أولوية",
        tone: "",
        desc: "استقرار العمود الفقري والحوض لتحسين الخصر والكتفين المدورين.",
      },
      {
        name: "تغذية نباتية",
        tag: "نظام غذائي",
        tone: "orange",
        desc: "حبوب كاملة منخفضة GI مع tofu والحمص وبروtein نباتي.",
      },
      {
        name: "إيقاع السكر",
        tag: "أيض",
        tone: "red",
        desc: "تدريب بعد 60–90 دقيقة من الوجبات لتثبيت منحنى الجلوكоз.",
      },
    ],
    phases: [
      {
        name: "أساس التنفس والوضعية",
        weeks: "الأسبوع 1",
        tag: "",
        desc: "تنفس حجابي، وضعية الجبل وتسلسلات العمود الفقري لإرخاء التوتر.",
      },
      {
        name: "تنشيط الجذع والسفلي",
        weeks: "الأسبوع 2–3",
        tag: "purple",
        desc: "وضعية القارب، الجسر، القرفصاء لتعزيز الاستقرار والأيض.",
      },
      {
        name: "دمج واستمرارية",
        weeks: "الأسبوع 4",
        tag: "cyan",
        desc: "ربط الأسابيع السابقة بممارسة يومية مستدامة.",
      },
    ],
    nutrients: [
      { name: "بروtein", target: "152 g", pct: 25, tip: "توفu، tempeh، حمص" },
      { name: "كربohydrates", target: "291 g", pct: 47, tip: "شوفان، أرز بني، quinoa" },
      { name: "دهون", target: "77 g", pct: 28, tip: "زيت زيتون، أفocado، جوز" },
      { name: "ألياف", target: "≥30 g", pct: 70, tip: "نخالة، chia، خضار" },
      { name: "ماء", target: "1700 ml", pct: 68, tip: "ماء، شاي بدون سكر" },
    ],
    weeks: [
      { label: "الأسبوع 1", status: "الحالي", focus: "أساس التنفس" },
      { label: "الأسبوع 2", status: "لاحقًا", focus: "تنشيط الجذع" },
      { label: "الأسبوع 3", status: "لاحقًا", focus: "تقدم" },
      { label: "الأسبوع 4", status: "لاحقًا", focus: "دمج" },
    ],
    review:
      "الأسبوع 1 يركز على التنفس وحركة العمود الفقري وإطلاق الورك مع هيكلة الوجبات النباتية.",
    days: ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"],
    exercises: [
      { name: "تنفس حجابي", rx: "3 × 8", tip: "تفعيل الجذع" },
      { name: "قط-بقرة", rx: "2 × 10", tip: "حركة صدرية" },
      { name: "جسر الورك", rx: "3 × 12", tip: "سلسلة خلفية" },
      { name: "قرفصاء صندوق", rx: "3 × 10", tip: "استقرار السفلي" },
    ],
    meals: [
      { time: "07:30 فطور", name: "شوفان + tofu + توت", tip: "GI منخفض" },
      { time: "12:30 غداء", name: "أرز بني + curry حمص", tip: "بروtein وألياف" },
      { time: "18:30 عشاء", name: "سلطة quinoa + خضار", tip: "وجبة خفيفة" },
    ],
    dietHeroTitle: "تصميم السعرات · وقود × حرق",
    dietHeroDesc: "هدف الطاقة اليومي",
    execIntro: "أربع جلسات ~60 دقيقة أسبوعيًا للعمود الفقري واستقرار الورك.",
    strategyTags: ["أساس التنفس", "وعي الوضعية", "سكر بعد الوجبة"],
  },
};
const planTasks = [
  { id: "squat", name: "箱式深蹲", sets: "3 组 × 10 次", duration: "12 分钟" },
  { id: "row", name: "弹力带划船", sets: "3 组 × 12 次", duration: "10 分钟" },
  { id: "deadbug", name: "死虫式", sets: "3 组 × 8 次", duration: "8 分钟" },
  { id: "balance", name: "单腿平衡", sets: "每侧 3 组", duration: "6 分钟" },
];
function saved<T>(k: string, d: T): T {
  try {
    const value = JSON.parse(localStorage.getItem(k) || "");
    return value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      d &&
      typeof d === "object" &&
      !Array.isArray(d)
      ? { ...d, ...value }
      : (value as T);
  } catch {
    return d;
  }
}
function parseRoute(): Route {
  const [path, query] = location.hash.replace(/^#\/?/, "").split("?");
  const p = path.split("/").filter(Boolean);
  const contentId = new URLSearchParams(query).get("content") || undefined;
  if (p[0] === "share") return { page: "share", type: p[1], id: p[2], contentId };
  if (p[0] === "history") return { page: "history" };
  if (p[0] === "reports" && p[2])
    return {
      page: modules.some((m) => m.id === p[2]) ? "report" : p[2],
      id: p[1],
      type: p[2],
      contentId,
    };
  if (p[0] === "reports" && p[1]) return { page: "report", id: p[1] };
  // Empty hash must resolve to home so BottomNav (home/me) stays visible after login.
  // Unauthenticated users still hit Auth via the !session gate below.
  return { page: p[0] || "home" };
}
function convert(v: string, u: Units) {
  return u === "metric"
    ? v
    : v
        .replace(/([\d.]+) kg/g, (_, n) => (+n * 2.20462).toFixed(1) + " lb")
        .replace(/([\d.]+) cm/g, (_, n) => (+n / 2.54).toFixed(1) + " in");
}

const HeaderHost = createContext<HTMLElement | null>(null);
export default function Prototype() {
  const [hash,setHash]=useState(location.hash);
  useEffect(()=>{const update=()=>setHash(location.hash);addEventListener("hashchange",update);return()=>removeEventListener("hashchange",update);},[]);
  return hash.startsWith("#/preview/") ? <PreviewPrototype /> : <UserPrototype />;
}

function UserPrototype() {
  const [headerHost, setHeaderHost] = useState<HTMLDivElement | null>(null);
  const { device } = useMobileDevice();
  const keyboard = useKeyboard();
  const { isKeyboardVisible, bottomInset } = useKeyboardInsets();
  const [route, setRoute] = useState(parseRoute);
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem(K.locale) as Locale) || "zh",
  );
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(K.theme) as Theme) || "system",
  );
  const [units, setUnits] = useState<Units>(
    () => (localStorage.getItem(K.units) as Units) || "metric",
  );
  const [consent, setConsent] = useState(
    () => localStorage.getItem(K.consent) === "true",
  );
  const [session, setSession] = useState(
    () => localStorage.getItem(K.session) === "true",
  );
  const [mode, setMode] = useState<Mode>("emailCode");
  const [showPass, setShowPass] = useState(false);
  const [reports, setReports] = useState<Report[]>(() =>
    saved(K.reports, seed),
  );
  const homeServices = useHomeServices();
  const [profile, setProfile] = useState<Profile>(() =>
    saved(K.profile, {
      nickname: "李若希",
      gender: "female",
      heightCm: 168,
      weightKg: 72.8,
      birthday: "1992-06-18",
    }),
  );
  const [moduleId, setModuleId] = useState<ModuleId>("composition");
  const [toast, setToast] = useState("");
  const [sheet, setSheet] = useState<
    "email" | "delete" | "logout" | "demo" | null
  >(null);
  const [mail, setMail] = useState("");
  const [mailState, setMailState] = useState("idle");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const T = (k: string) => (lang[locale] as Record<string, string>)[k] || k;
  const [systemDark, setSystemDark] = useState(() => matchMedia("(prefers-color-scheme:dark)").matches);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme:dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const dark =
    theme === "dark" ||
    (theme === "system" && systemDark);
  const matchingReport = reports.find(x => route.page === "share" ? route.id === `wh_${x.id}_8fd4c7` : x.id === route.id);
  const report = matchingReport || buildHomeOverview(reports).latest || seed[0];
  const homeResult = homeServices.results.find(r => r.id === route.contentId && r.reportId === matchingReport?.id && r.type === (route.page === "share" ? route.type : route.page));
  useEffect(() => {
    const f = () => setRoute(parseRoute());
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>('[data-testid="mobile-scroll"]')
        ?.scrollTo({ top: 0 }),
    );
  }, [route.page, route.id, route.type]);
  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    localStorage.setItem(K.locale, locale);
  }, [locale]);
  useEffect(() => localStorage.setItem(K.theme, theme), [theme]);
  useEffect(() => localStorage.setItem(K.units, units), [units]);
  useEffect(() => {
    if (!toast) return;
    const x = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(x);
  }, [toast]);
  const go = (p: string, opts?: { replace?: boolean }) => {
    keyboard.hide();
    const hash = p.startsWith("#") ? p : `#${p.startsWith("/") ? p : `/${p}`}`;
    if (opts?.replace) {
      history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
      setRoute(parseRoute());
      return;
    }
    location.hash = hash.slice(1);
  };
  const back = (fallback = "/home") => {
    keyboard.hide();
    if (history.length > 1) {
      history.back();
      return;
    }
    go(fallback, { replace: true });
  };
  const login = () => {
    localStorage.setItem(K.session, "true");
    localStorage.setItem("wellnesshub.session.role", "user");
    setSession(true);
    go("/home", { replace: true });
  };
  const guestLogin = () => {
    localStorage.setItem(K.session, "true");
    localStorage.setItem("wellnesshub.session.role", "guest");
    setSession(true);
    go("/home", { replace: true });
  };
  const logout = () => {
    localStorage.removeItem(K.session);
    localStorage.removeItem("wellnesshub.session.role");
    setSession(false);
    setMode("emailCode");
    setSheet(null);
    go("/", { replace: true });
  };
  const share = (type: string) => {
    const url = `${location.origin}${location.pathname}#/share/${type}/wh_${report.id}_8fd4c7${homeResult ? "?content=" + encodeURIComponent(homeResult.id) : ""}`;
    if (navigator.share)
      navigator.share({ title: "VISBODY WellnessHub", url }).catch(() => {});
    else
      navigator.clipboard
        .writeText(url)
        .then(() => setToast(T("copied")))
        .catch(() => setToast(url));
  };
  const remove = () => {
    const id = deleteId || report.id;
    const n = reports.filter((x) => x.id !== id);
    setReports(n);
    localStorage.setItem(K.reports, JSON.stringify(n));
    setSheet(null);
    go("/reports");
  };
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setMailState("error");
      return;
    }
    setMailState("sending");
    setTimeout(() => {
      setMailState("sent");
      setTimeout(() => setSheet(null), 900);
    }, 900);
  };
  const saveProfile = (x: Profile) => {
    setProfile(x);
    localStorage.setItem(K.profile, JSON.stringify(x));
    setToast(T("saved"));
  };
  let view: ReactNode;
  if (route.contentId && !homeResult && (session || route.page === "share"))
    view = <section className="m60-page"><Header title={homeText(locale,"reportTitle")} back={() => go("/home")} /><div className="home-empty"><p>{homeText(locale, homeServices.status === "loading" ? "serviceLoading" : homeServices.status === "error" ? "serviceError" : "missing")}</p>{homeServices.status === "error" && <button className="home-link" onClick={homeServices.retry}>{homeText(locale,"retry")}</button>}</div></section>;
  else if (route.id && !matchingReport && ["report","ai","training","share"].includes(route.page) && (session || route.page === "share"))
    view = <section className="m60-page"><Header title={homeText(locale,"reportTitle")} back={() => go("/reports")} /><div className="home-empty"><p>{homeText(locale,"noReport")}</p></div></section>;
  else if (route.page === "share")
    view =
      route.type === "ai" ? (
        <AIPage
          report={report}
          homeContent={homeResult?.ai?.[locale]}
          T={T}
          locale={locale}
          share={() => share("ai")}
          readOnly
        />
      ) : route.type === "training" ? (
        <TrainingOutline
          homeContent={homeResult?.training?.[locale]}
          T={T}
          locale={locale}
          go={go}
          share={() => share("training")}
          readOnly
        />
      ) : (
        <M60Report
          report={report}
          profile={profile}
          locale={locale}
          units={units}
          active={moduleId}
          setActive={setModuleId}
          T={T}
          share={() => share("report")}
          readOnly
        />
      );
  else if (!consent)
    view = (
      <Consent
        T={T}
        locale={locale}
        theme={theme}
        setLocale={setLocale}
        setTheme={setTheme}
        agree={() => {
          localStorage.setItem(K.consent, "true");
          setConsent(true);
        }}
      />
    );
  else if (!session && route.page !== "register" && route.page !== "profile")
    view = (
      <Auth
        T={T}
        locale={locale}
        theme={theme}
        setLocale={setLocale}
        setTheme={setTheme}
        mode={mode}
        setMode={setMode}
        showPass={showPass}
        setShowPass={setShowPass}
        error={error}
        setError={setError}
        register={() => go("/register")}
        login={login}
        guestLogin={guestLogin}
        toast={setToast}
      />
    );
  else if (route.page === "register")
    view = (
      <Register
        T={T}
        back={() => back("/")}
        done={() => {
          setProfile({
            nickname: "",
            gender: "",
            heightCm: 168,
            weightKg: 65,
            birthday: "",
          });
          go("/profile", { replace: true });
        }}
      />
    );
  else if (route.page === "profile")
    view = (
      <ProfilePage
        T={T}
        data={profile}
        units={units}
        setUnits={setUnits}
        save={saveProfile}
        done={() => {
          localStorage.setItem(K.session, "true");
          setSession(true);
          go("/home", { replace: true });
        }}
        back={session ? () => back("/me") : undefined}
      />
    );
  else if (route.page === "home")
    view = (
      <SourceHome
        T={T}
        locale={locale}
        profile={profile}
        reports={reports}
        services={homeServices}
        units={units}
        go={go}
      />
    );
  else if (route.page === "me")
    view = (
      <SourceMe
        T={T}
        locale={locale}
        profile={profile}
        reports={reports}
        units={units}
        go={go}
      />
    );
  else if (route.page === "settings")
    view = (
      <Settings
        T={T}
        locale={locale}
        setLocale={setLocale}
        theme={theme}
        setTheme={setTheme}
        units={units}
        setUnits={setUnits}
        go={go}
        back={() => back("/me")}
        demo={() => setSheet("demo")}
        logout={() => setSheet("logout")}
      />
    );
  else if (route.page === "reports")
    view = (
      <Reports
        locale={locale}
        reports={reports}
        T={T}
        go={go}
        back={() => back("/me")}
        del={(id: string) => {
          setDeleteId(id);
          setSheet("delete");
        }}
      />
    );
  else if (route.page === "history")
    view = (
      <HistoryTrendsPage
        T={T}
        locale={locale}
        units={units}
        back={() => back("/home")}
      />
    );
  else if (route.page === "report")
    view = (
      <M60Report
        report={report}
        profile={profile}
        locale={locale}
        units={units}
        active={moduleId}
        setActive={setModuleId}
        T={T}
        back={() => back("/reports")}
        share={() => share("report")}
        email={() => setSheet("email")}
        go={go}
      />
    );
  else if (route.page === "ai")
    view = (
      <AIPage
        report={report}
        homeContent={homeResult?.ai?.[locale]}
        T={T}
        locale={locale}
        back={() => back(`/reports/${report.id}`)}
        share={() => share("ai")}
      />
    );
  else if (route.page === "training")
    view = (
      <TrainingOutline
        homeContent={homeResult?.training?.[locale]}
        T={T}
        locale={locale}
        go={go}
        back={() => back(`/reports/${report.id}`)}
        share={() => share("training")}
      />
    );
  else if (route.page === "plan")
    view = (
      <TrainingPlan
        T={T}
        locale={locale}
        back={() => back(`/reports/${report.id}/training`)}
      />
    );
  else
    view = (
      <SourceHome
        T={T}
        locale={locale}
        profile={profile}
        reports={reports}
        services={homeServices}
        units={units}
        go={go}
      />
    );
  const nav = session && (route.page === "home" || route.page === "me");
  const sheetOpen = sheet !== null;
  return (
    <div
      className={`wh-app ${dark ? "wh-dark" : "wh-light"}${sheetOpen ? " sheet-open" : ""}${session && route.page === "home" ? " is-home" : ""}`}
      data-locale={locale}
      style={
        {
          "--app-safe-top": `${device.geometry.safeArea.top}px`,
          "--app-safe-bottom": `${device.platform === "ios" ? device.geometry.safeArea.bottom : 0}px`,
        } as React.CSSProperties
      }
    >
      <div className="app-header-host" ref={setHeaderHost} />
      <HeaderHost.Provider value={headerHost}>
      <MobileScroll className="app-screen">
        <main
          className={`screen-content ${nav ? "with-nav" : ""} ${session ? "fx-shell" : ""}`}
        >
          {view}
        </main>
      </MobileScroll>
      </HeaderHost.Provider>
      {nav && <BottomNav page={route.page} T={T} go={go} />}{" "}
      {isKeyboardVisible && (
        <button
          type="button"
          className="keyboard-dismiss"
          style={{ bottom: Math.max(bottomInset + 10, 18) }}
          onClick={() => keyboard.hide()}
          aria-label={T("hideKeyboard")}
        >
          <ChevronDownIcon />
          <span>{T("hideKeyboard")}</span>
        </button>
      )}
      {toast && (
        <div className="toast">
          <CheckCircledIcon />
          {toast}
        </div>
      )}
      <BottomSheet
        open={sheet === "email"}
        onOpenChange={(o) => !o && setSheet(null)}
        title={T("sendTitle")}
        description={T("sendDesc")}
        snap={0.55}
      >
        <form className="sheet-form" onSubmit={send}>
          <label>
            {T("email")}
            <KeyboardInput
              value={mail}
              onChange={(e) => {
                setMail(e.target.value);
                setMailState("idle");
              }}
              placeholder="name@example.com"
              inputMode="email"
            />
          </label>
          {mailState === "error" && (
            <p className="form-error">{T("invalidEmail")}</p>
          )}
          <div className="sheet-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setSheet(null)}
            >
              {T("cancel")}
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={mailState === "sending"}
            >
              {mailState === "sending"
                ? T("sending")
                : mailState === "sent"
                  ? T("sent")
                  : T("send")}
            </button>
          </div>
        </form>
      </BottomSheet>
      <BottomSheet
        open={sheet === "delete"}
        onOpenChange={(o) => !o && setSheet(null)}
        title={T("deleteTitle")}
        description={T("deleteBody")}
        snap={0.42}
      >
        <div className="sheet-actions">
          <button className="secondary-btn" onClick={() => setSheet(null)}>
            {T("cancel")}
          </button>
          <button className="danger-btn" onClick={remove}>
            <TrashIcon />
            {T("confirmDelete")}
          </button>
        </div>
      </BottomSheet>
      <BottomSheet
        open={sheet === "logout"}
        onOpenChange={(o) => !o && setSheet(null)}
        title={T("logoutTitle")}
        description={T("logoutBody")}
        snap={0.4}
      >
        <div className="sheet-actions">
          <button className="secondary-btn" onClick={() => setSheet(null)}>
            {T("cancel")}
          </button>
          <button className="danger-btn" onClick={logout}>
            {T("confirmLogout")}
          </button>
        </div>
      </BottomSheet>
      <BottomSheet
        open={sheet === "demo"}
        onOpenChange={(o) => !o && setSheet(null)}
        title={T("demoOnly")}
        description={T("demoDesc")}
        snap={0.38}
      >
        <button className="primary-btn" onClick={() => setSheet(null)}>
          {T("close")}
        </button>
      </BottomSheet>
    </div>
  );
}

function Logo() {
  const [failed,setFailed]=useState(false);
  return failed
    ? <span className="brand-logo brand-logo-fallback" role="img" aria-label="VISBODY">VISBODY</span>
    : <img className="brand-logo" src={logoUrl} alt="VISBODY" onError={()=>setFailed(true)} />;
}
function Prefs(p: any) {
  return (
    <div className="prefs">
      <select
        aria-label={p.T("language")}
        value={p.locale}
        onChange={(e) => p.setLocale(e.target.value)}
      >
        <option value="zh">简体中文</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="ar">العربية</option>
      </select>
      <select
        aria-label={p.T("appearance")}
        value={p.theme}
        onChange={(e) => p.setTheme(e.target.value)}
      >
        <option value="system">{p.T("system")}</option>
        <option value="light">{p.T("light")}</option>
        <option value="dark">{p.T("dark")}</option>
      </select>
    </div>
  );
}
function Consent(p: any) {
  const [legalOpen, setLegalOpen] = useState<
    "terms" | "privacy" | "aiDisclaimer" | null
  >(null);
  const legalBody = legalOpen ? p.T(`${legalOpen}Body`) : "";
  return (
    <section className="auth-page consent-page">
      <Prefs {...p} />
      <div className="consent-content">
        <Logo />
        <h1>{p.T("welcome")}</h1>
        <p>{p.T("trust")}</p>
        <p className="legal-copy">
          {p.T("legalIntro")}{" "}
          {(["terms", "privacy", "aiDisclaimer"] as const).map((key, i) => (
            <span key={key}>
              {i > 0 && " · "}
              <button type="button" onClick={() => setLegalOpen(key)}>
                {p.T(key)}
              </button>
            </span>
          ))}
        </p>
        <button className="primary-btn" onClick={p.agree}>
          {p.T("agree")}
        </button>
        <small className="consent-footnote">{p.T("consentFootnote")}</small>
      </div>
      <BottomSheet
        open={Boolean(legalOpen)}
        onOpenChange={(open) => !open && setLegalOpen(null)}
        title={legalOpen ? p.T(legalOpen) : ""}
        snap={0.45}
      >
        <div className="legal-sheet-copy">
          <InfoCircledIcon />
          <p>{legalBody}</p>
        </div>
      </BottomSheet>
    </section>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <div className="text-field">{children}</div>
    </label>
  );
}
function LoginAssistRow({mode,T,changeMode,forgot}:{mode:Mode;T:(key:string)=>string;changeMode:(mode:Mode)=>void;forgot:()=>void}) {
  const left = mode === "emailCode"
    ? <button type="button" onClick={()=>changeMode("emailPassword")}>{T("switchEmailPassword")}</button>
    : mode === "emailPassword"
      ? <button type="button" onClick={()=>changeMode("emailCode")}>{T("switchEmailCode")}</button>
      : mode === "phonePassword"
        ? <button type="button" className="assist-muted" onClick={()=>changeMode("phoneCode")}>{T("switchPhoneCode")}</button>
        : <button type="button" onClick={()=>changeMode("phonePassword")}>{T("switchPhonePassword")}</button>;
  const right = mode === "emailPassword" || mode === "phonePassword"
    ? <button type="button" className="assist-forgot" onClick={forgot}>{T("forgot")}</button>
    : <span className="assist-spacer" aria-hidden="true" />;
  return <div className="login-assist-row">{left}{right}</div>;
}
function Auth(p: any) {
  const keyboard=useKeyboard();
  const [moreOpen, setMoreOpen] = useState(false);
  const [account, setAccount] = useState("");
  const [credential, setCredential] = useState("");
  const [accepted, setAccepted] = useState(true);
  const [remember, setRemember] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const isEmail = p.mode === "emailCode" || p.mode === "emailPassword";
  const isCode = p.mode === "emailCode" || p.mode === "phoneCode";
  const label = isEmail ? p.T("emailCodeLogin") : p.T("phoneAuthTitle");
  const hint =
    p.mode === "emailCode"
      ? p.T("emailCodeHint")
      : p.mode === "emailPassword"
        ? p.T("emailPasswordHint")
        : p.mode === "phonePassword"
          ? p.T("phonePasswordHint")
          : p.T("phoneCodeHint");
  useEffect(() => {
    if (!seconds) return;
    const timer = window.setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);
  const changeMode = (next: Mode) => {
    keyboard.hide();
    p.setError("");
    setMoreOpen(false);
    setAccount("");
    setCredential("");
    setSeconds(0);
    p.setMode(next);
  };
  const requestCode = () => {
    if (seconds) return;
    setSeconds(60);
    p.toast(p.T("codeSent"));
  };
  const validate = () => {
    const value = account.trim();
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return p.T("invalidEmailLogin");
    if (!isEmail && !/^\d{7,15}$/.test(value.replace(/[\s-]/g, "")))
      return p.T("invalidPhoneLogin");
    if (!accepted) return p.T("privacyRequired");
    if (!isCode && !credential) return p.T("emptyPassword");
    if (isCode && credential !== "123456") return p.T("wrongCode");
    if (!isCode && credential !== "wellness1") return p.T("wrongPassword");
    return "";
  };
  return (
    <section className="auth-page login-page" data-auth-mode={p.mode}>
      <Prefs {...p} />
      <Logo />
      <p className="auth-kicker">WellnessHub</p>
      <h1>{label}</h1>
      <p className="auth-hint">{hint}</p>
      <form
        className="auth-form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const nextError = validate();
          if (nextError) p.setError(nextError);
          else p.login();
        }}
      >
        {isEmail ? (
          <Field label={p.T("email")}>
            <EnvelopeClosedIcon />
            <KeyboardInput
              name={`${p.mode}-account`}
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                p.setError("");
              }}
              placeholder={p.T("enterEmail")}
              inputMode="email"
            />
          </Field>
        ) : (
          <Field label={p.T("phone")}>
            <MobileIcon />
            <button
              type="button"
              className="dial"
              aria-label={`${p.T("phone")} +86`}
            >
              +86 <ChevronDownIcon />
            </button>
            <KeyboardInput
              name={`${p.mode}-account`}
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                p.setError("");
              }}
              placeholder={p.T("enterPhone")}
              inputMode="tel"
            />
          </Field>
        )}
        <Field label={isCode ? p.T("code") : p.T("password")}>
          {isCode ? <EnvelopeClosedIcon /> : <LockClosedIcon />}
          <KeyboardInput
            name={isCode ? "code" : "password"}
            value={credential}
            onChange={(e) => {
              setCredential(e.target.value);
              p.setError("");
            }}
            type={p.showPass || isCode ? "text" : "password"}
            placeholder={isCode ? p.T("enterCode") : p.T("enterPassword")}
            inputMode={isCode ? "numeric" : undefined}
          />
          {isCode ? (
            <button
              type="button"
              className="inline-action"
              disabled={seconds > 0}
              onClick={requestCode}
            >
              {seconds ? `${seconds}s` : p.T("getCode")}
            </button>
          ) : (
            <button
              type="button"
              className="eye"
              onClick={() => p.setShowPass(!p.showPass)}
              aria-label={p.T(p.showPass ? "hidePassword" : "showPassword")}
            >
              {p.showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          )}
        </Field>
        <LoginAssistRow mode={p.mode} T={p.T} changeMode={changeMode} forgot={()=>p.toast(p.T("resetPasswordHint"))} />
        <div className="form-error-slot" aria-live="polite">
          {p.error && <p className="form-error">{p.error}</p>}
        </div>
        <label className="privacy-check">
          <input
            name="privacy"
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              p.setError("");
            }}
          />
          <span>{p.T("privacyAccept")}</span>
        </label>
        <button className="primary-btn">{p.T("signIn")}</button>
        <label className="remember-check">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>{p.T("remember")}</span>
        </label>
      </form>
      <button type="button" className="guest-cta" onClick={p.guestLogin}>
        <PersonIcon />
        <span>
          <b>{p.T("guest")}</b>
          <small>{p.T("guestHint")}</small>
        </span>
        <ChevronRightIcon />
      </button>
      <p className="auth-register-row">
        <span>{p.T("noAccount")}</span>
        <button
          type="button"
          className="auth-text-link"
          onClick={p.register}
        >
          {p.T("create")}
        </button>
      </p>
      <div className="auth-alt-block">
        <div className="divider">{p.T("other")}</div>
        <div className="auth-alt-icons" role="group" aria-label={p.T("other")}>
          <button
            type="button"
            className="alt-icon-btn"
            onClick={p.login}
            aria-label={p.T("google")}
          >
            <FcGoogle aria-hidden="true" />
          </button>
          <button
            type="button"
            className="alt-icon-btn alt-icon-btn--facebook"
            onClick={p.login}
            aria-label={p.T("facebook")}
          >
            <FaFacebookF aria-hidden="true" />
          </button>
          {p.mode === "emailPassword" && (
            <button
              type="button"
              className="alt-icon-btn"
              onClick={() => {
                keyboard.hide();
                setMoreOpen(true);
              }}
              aria-label={p.T("more")}
            >
              <DotsHorizontalIcon />
            </button>
          )}
          {(p.mode === "phoneCode" || p.mode === "phonePassword") && (
            <button
              type="button"
              className="alt-icon-btn"
              onClick={() => changeMode("emailCode")}
              aria-label={p.T("emailCodeLogin")}
            >
              <EnvelopeClosedIcon />
            </button>
          )}
        </div>
      </div>
      <p className="demo-note">{p.T("demo")}</p>
      <BottomSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        title={p.T("more")}
        description={p.T("moreHint")}
        snap={0.32}
      >
        <button
          type="button"
          className="phone-password-entry"
          onClick={() => changeMode("phonePassword")}
        >
          <span className="phone-entry-icon">
            <MobileIcon />
          </span>
          <span>
            <b>{p.T("phoneLogin")}</b>
            <small>{p.T("phonePasswordEntryHint")}</small>
          </span>
          <ChevronRightIcon />
        </button>
      </BottomSheet>
    </section>
  );
}
function Register({ T, back, done }: any) {
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [nickname, setNickname] = useState("");
  const [account, setAccount] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!seconds) return;
    const timer = window.setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);
  const accountValid =
    channel === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.trim())
      : /^\d{7,15}$/.test(account.replace(/[\s-]/g, ""));
  const valid =
    nickname.trim().length >= 2 &&
    accountValid &&
    code === "123456" &&
    password.length >= 8 &&
    accepted;
  const changeChannel = (next: "email" | "phone") => {
    setChannel(next);
    setAccount("");
    setCode("");
    setSeconds(0);
  };
  return (
    <section className="auth-page compact registration-page">
      <Header title={T("create")} back={back} />
      <Logo />
      <p className="flow-hint">{T("registerHint")}</p>
      <div className="unit-toggle register-channel">
        <button
          type="button"
          className={channel === "email" ? "active" : ""}
          aria-pressed={channel === "email"}
          onClick={() => changeChannel("email")}
        >
          <EnvelopeClosedIcon />
          {T("emailRegister")}
        </button>
        <button
          type="button"
          className={channel === "phone" ? "active" : ""}
          aria-pressed={channel === "phone"}
          onClick={() => changeChannel("phone")}
        >
          <MobileIcon />
          {T("phoneRegister")}
        </button>
      </div>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) done();
        }}
      >
        <Field label={T("nickname")}>
          <PersonIcon />
          <KeyboardInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={T("nickname")}
          />
        </Field>
        <Field label={T(channel)}>
          {channel === "email" ? <EnvelopeClosedIcon /> : <MobileIcon />}
          {channel === "phone" && <span className="dial static">+86</span>}
          <KeyboardInput
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            inputMode={channel === "email" ? "email" : "tel"}
            placeholder={T(channel === "email" ? "enterEmail" : "enterPhone")}
          />
        </Field>
        <Field label={T("code")}>
          <LockClosedIcon />
          <KeyboardInput
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
          />
          <button
            type="button"
            className="inline-action"
            disabled={!accountValid || seconds > 0}
            onClick={() => setSeconds(60)}
          >
            {seconds ? `${seconds}s` : T("getCode")}
          </button>
        </Field>
        <Field label={T("password")}>
          <LockClosedIcon />
          <KeyboardInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder={T("enterPassword")}
          />
          <button
            type="button"
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={T(showPassword ? "hidePassword" : "showPassword")}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        </Field>
        <p className="field-help">{T("passwordRule")}</p>
        <label className="privacy-check register-privacy">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>{T("privacyAccept")}</span>
        </label>
        <button className="primary-btn" disabled={!valid}>
          {T("register")}
        </button>
      </form>
      <div className="return-login">
        <span>{T("alreadyAccount")}</span>
        <button type="button" onClick={back}>
          {T("returnLogin")}
        </button>
      </div>
    </section>
  );
}
function ProfilePage({ T, data, units, setUnits, save, done, back }: any) {
  const [x, setX] = useState<Profile>(data);
  const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(x.birthday);
  const dateParts = dateMatch ? x.birthday.split("-").map(Number) : null;
  const birthDate = dateParts
    ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
    : null;
  const now = new Date();
  const exactDate = Boolean(
    birthDate &&
    dateParts &&
    birthDate.getFullYear() === dateParts[0] &&
    birthDate.getMonth() === dateParts[1] - 1 &&
    birthDate.getDate() === dateParts[2],
  );
  const dateLimit = (yearsAgo: number) => {
    const value = new Date(
      now.getFullYear() - yearsAgo,
      now.getMonth(),
      now.getDate(),
    );
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  };
  const age = birthDate
    ? now.getFullYear() -
      birthDate.getFullYear() -
      (now <
      new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        ? 1
        : 0)
    : -1;
  const valid =
    x.nickname.trim().length >= 2 &&
    Boolean(x.gender) &&
    Number.isFinite(x.heightCm) &&
    x.heightCm >= 100 &&
    x.heightCm <= 230 &&
    Number.isFinite(x.weightKg) &&
    x.weightKg >= 30 &&
    x.weightKg <= 300 &&
    exactDate &&
    age >= 13 &&
    age <= 100;
  return (
    <section className="product-page profile-edit">
      <Header title={T("bodyProfile")} back={back} />
      <Logo />
      <p className="flow-hint profile-hint">{T("profileHint")}</p>
      <div className="unit-toggle">
        <button
          type="button"
          className={units === "metric" ? "active" : ""}
          aria-pressed={units === "metric"}
          onClick={() => setUnits("metric")}
        >
          {T("metric")}
        </button>
        <button
          type="button"
          className={units === "imperial" ? "active" : ""}
          aria-pressed={units === "imperial"}
          onClick={() => setUnits("imperial")}
        >
          {T("imperial")}
        </button>
      </div>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          save(x);
          done();
        }}
      >
        <Field label={T("nickname")}>
          <PersonIcon />
          <KeyboardInput
            value={x.nickname}
            onChange={(e) => setX({ ...x, nickname: e.target.value })}
            placeholder={T("nickname")}
          />
        </Field>
        <div className="field-group">
          <span>{T("gender")}</span>
          <div className="choice-row">
            {["male", "female", "private"].map((g) => (
              <button
                type="button"
                key={g}
                className={x.gender === g ? "active" : ""}
                onClick={() => setX({ ...x, gender: g })}
              >
                {T(g)}
              </button>
            ))}
          </div>
        </div>
        <Field label={`${T("height")} · ${units === "metric" ? "cm" : "in"}`}>
          <BarChartIcon />
          <KeyboardInput
            inputMode="decimal"
            value={
              units === "metric"
                ? x.heightCm
                : Math.round((x.heightCm / 2.54) * 10) / 10
            }
            onChange={(e) =>
              setX({
                ...x,
                heightCm:
                  units === "metric" ? +e.target.value : +e.target.value * 2.54,
              })
            }
          />
        </Field>
        <Field label={`${T("weight")} · ${units === "metric" ? "kg" : "lb"}`}>
          <BarChartIcon />
          <KeyboardInput
            inputMode="decimal"
            value={
              units === "metric"
                ? x.weightKg
                : Math.round(x.weightKg * 2.20462 * 10) / 10
            }
            onChange={(e) =>
              setX({
                ...x,
                weightKg:
                  units === "metric"
                    ? +e.target.value
                    : +e.target.value / 2.20462,
              })
            }
          />
        </Field>
        <Field label={T("birthday")}>
          <KeyboardInput
            type="date"
            value={x.birthday}
            onChange={(e) => setX({ ...x, birthday: e.target.value })}
            inputMode="numeric"
            min={dateLimit(100)}
            max={dateLimit(13)}
            placeholder={T("dateFormat")}
          />
        </Field>
        {!valid && (
          <p className="profile-validation">{T("profileValidation")}</p>
        )}
        <button className="primary-btn" disabled={!valid}>
          {back ? T("save") : T("start")}
        </button>
      </form>
    </section>
  );
}
function Header({
  title,
  back,
  actions,
  logo = false,
}: {
  title: string;
  back?: () => void;
  actions?: ReactNode;
  logo?: boolean;
}) {
  const host = useContext(HeaderHost);
  if (!host) return null;
  return createPortal(
    <header className={`app-header ${logo ? "app-header-brand" : "app-header-page"}`}>
      {back ? (
        <button className="icon-btn" onClick={back} aria-label={`← ${title}`}>
          <ArrowLeftIcon />
        </button>
      ) : logo ? (
        <Logo />
      ) : (
        <span />
      )}
      <strong>{title}</strong>
      <div className="header-actions">{actions}</div>
    </header>, host
  );
}
function BottomNav({ page, T, go }: any) {
  return (
    <nav className="bottom-nav">
      <button
        className={page === "home" ? "active" : ""}
        onClick={() => go("/home", { replace: true })}
      >
        <HomeIcon />
        <span>{T("home")}</span>
      </button>
      <button
        className={page === "me" ? "active" : ""}
        onClick={() => go("/me", { replace: true })}
      >
        <PersonIcon />
        <span>{T("me")}</span>
      </button>
    </nav>
  );
}


// Home v0.2: presentation data only. No entitlement or payment inference.
// HOME_DOMAIN_START
type HomeMetricId = "score" | "fat" | "muscle" | "weight";
type HomeTrendPoint = { reportId: string; measuredAt: string; value: number; unit: string; comparisonKey: string };
type HomeOverview = { latest?: Report; reports: Report[]; concerns: ReportModule[]; trends: Record<HomeMetricId, HomeTrendPoint[]> };
type HomeLocalized<T> = Record<Locale, T>;
type HomeAIContent = { summary: string; risks: string[]; strengths: string[]; actions: string[] };
type HomeServiceResult = {
  id: string; reportId: string; type: "ai" | "training"; generatedAt: string;
  summary: HomeLocalized<string>;
  ai?: HomeLocalized<HomeAIContent>;
  training?: HomeLocalized<(typeof outlineByLocale)[Locale]>;
};
type HomeServiceSummary = {
  type: "ai" | "training"; state: "available" | "historical" | "empty";
  result?: HomeServiceResult; report?: Report;
};
type PreviewScenario = "none" | "ai" | "training" | "both";
function previewServiceTypes(scenario: PreviewScenario): HomeServiceResult["type"][] {
  return scenario === "both" ? ["ai","training"] : scenario === "ai" ? ["ai"] : scenario === "training" ? ["training"] : [];
}
const homeMetricSpec: Record<HomeMetricId, { label: string; unit: string }> = {
  score: { label: "综合评分", unit: "score" }, fat: { label: "体脂率", unit: "%" },
  muscle: { label: "肌肉量", unit: "kg" }, weight: { label: "体重", unit: "kg" },
};
const homeModuleOrder: ModuleId[] = ["composition", "posture", "balance", "neck", "hip", "spine", "girth"];
const homeSeverity = { good: 0, attention: 1, risk: 2 };
function homeTimestamp(date: string) { return Date.parse(date.replace(" ", "T")); }
function homeComparisonKey(report: Report) { return report.device + ":" + (report.comparisonKey ?? "legacy-m60-v1"); }
function homeMetricValue(report: Report, id: HomeMetricId): number | undefined {
  if (id === "score") return typeof report.score === "number" && Number.isFinite(report.score) ? report.score : undefined;
  const metric = report.modules.find(m => m.id === "composition")?.metrics.find(m => m.label === homeMetricSpec[id].label);
  if (!metric) return undefined;
  const match = metric.value.trim().match(/^(-?\d+(?:\.\d+)?)\s*(kg|%)$/);
  if (!match || match[2] !== homeMetricSpec[id].unit) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}
function buildHomeOverview(records: Report[]): HomeOverview {
  const reports = records.filter(r => Number.isFinite(homeTimestamp(r.date))).slice().sort((a, b) => homeTimestamp(b.date) - homeTimestamp(a.date));
  const latest = reports[0];
  const concerns = (latest?.modules ?? []).filter(m => m.status !== "good").slice().sort((a,b) =>
    homeSeverity[b.status] - homeSeverity[a.status] || homeModuleOrder.indexOf(a.id) - homeModuleOrder.indexOf(b.id)).slice(0,3);
  const trends = Object.fromEntries((Object.keys(homeMetricSpec) as HomeMetricId[]).map(id => [
    id, reports.filter(r => latest && homeComparisonKey(r) === homeComparisonKey(latest)).map(r => ({
      reportId: r.id, measuredAt: r.date, value: homeMetricValue(r,id), unit: homeMetricSpec[id].unit, comparisonKey: homeComparisonKey(r),
    })).filter((p): p is HomeTrendPoint => p.value !== undefined).reverse(),
  ])) as HomeOverview["trends"];
  return { reports, latest, concerns, trends };
}
function isHomeServiceResult(value: unknown): value is HomeServiceResult {
  if (!value || typeof value !== "object") return false;
  const r = value as HomeServiceResult;
  if (typeof r.id !== "string" || !r.id || typeof r.reportId !== "string" || !r.reportId || typeof r.generatedAt !== "string" || !Number.isFinite(homeTimestamp(r.generatedAt)) || !["ai","training"].includes(r.type)) return false;
  return (["zh","en","de","ar"] as Locale[]).every(locale => {
    if (!r.summary || typeof r.summary[locale] !== "string") return false;
    if (r.type === "ai") {
      const c = r.ai?.[locale];
      return !!c && typeof c.summary === "string" && [c.risks,c.strengths,c.actions].every(items => Array.isArray(items) && items.every(i => typeof i === "string"));
    }
    const c = r.training?.[locale];
    // A heading alone cannot certify an existing personalised outline.
    return !!c && typeof c.title === "string" && typeof c.heroDesc === "string" &&
      ["metrics","goals","phases","weeks","days","exercises","meals","nutrients","strategyTags"].every(key => Array.isArray((c as unknown as Record<string,unknown>)[key])) &&
      typeof c.dietHeroTitle === "string" && typeof c.dietHeroDesc === "string" && typeof c.execIntro === "string";
  });
}
function homeServiceSummary(type: HomeServiceResult["type"], overview: HomeOverview, results: HomeServiceResult[]): HomeServiceSummary {
  const linked = results.filter(r => r.type === type && isHomeServiceResult(r) && overview.reports.some(p => p.id === r.reportId))
    .sort((a,b) => homeTimestamp(b.generatedAt) - homeTimestamp(a.generatedAt));
  const result = linked.find(r => r.reportId === overview.latest?.id) ?? linked[0];
  const report = overview.reports.find(p => p.id === result?.reportId);
  return result && report ? { type, state: report.id === overview.latest?.id ? "available" : "historical", result, report } : { type, state: "empty" };
}
function homeModelAsset(report: Report): string | undefined {
  if (report.modelAsset === null) return undefined;
  // Known legacy Demo asset is explicitly associated with this measurement only.
  const asset = report.modelAsset ?? (report.id === "m60-20260810" ? "/assets/h5-source/skin.obj" : undefined);
  return asset?.startsWith("/assets/") && !asset.includes("..") ? asset : undefined;
}
// HOME_DOMAIN_END

const homeWords = {
  overview: ["最近测量概况","Latest assessment","Letzte Messung","أحدث قياس"],
  full: ["查看完整报告","Full report","Vollständiger Bericht","التقرير الكامل"],
  measured: ["测量于","Measured","Gemessen am","تاريخ القياس"],
  reportScore: ["本次报告评分","Report score","Berichtswert","نتيجة التقرير"],
  measuredOnly: ["基于最近测量，不代表实时身体状态。","Based on your latest measurement, not live health data.","Basiert auf der letzten Messung, nicht auf Echtzeitdaten.","استناداً إلى أحدث قياس، وليس إلى بيانات صحية آنية."],
  focusIntro: ["本次重点关注：","Focus areas: ","Schwerpunkte: ","مجالات الاهتمام: "],
  noConcerns: ["本次已测项目未发现需重点关注项。","No priority flags in the measured items.","Keine vorrangigen Auffälligkeiten in den gemessenen Bereichen.","لا توجد ملاحظات ذات أولوية ضمن العناصر المقاسة."],
  noReport: ["还没有测量记录","No assessments yet","Noch keine Messungen","لا توجد قياسات بعد"],
  reportTitle: ["测量报告","Assessment report","Messbericht","تقرير القياس"],
  startHint: ["在设备上完成测量后，扫码查看报告。这里将汇总你的测量结果和变化。","Complete a device assessment and scan its QR code. Your results and changes will appear here.","Nach einer Messung am Gerät den QR-Code scannen. Hier erscheinen Ergebnisse und Veränderungen.","أكمل القياس على الجهاز ثم امسح رمز QR. ستظهر هنا نتائجك وتغيراتها."],
  records: ["评估记录","Assessments","Messverlauf","سجل القياسات"],
  noModel: ["该次测量暂无 3D 模型","No 3D model for this assessment","Kein 3D-Modell für diese Messung","لا يوجد نموذج ثلاثي الأبعاد لهذا القياس"],
  modelError: ["模型暂时无法加载","Model unavailable","Modell nicht verfügbar","النموذج غير متاح"],
  pauseRotation: ["暂停自动旋转","Pause rotation","Drehung pausieren","إيقاف الدوران"],
  resumeRotation: ["继续自动旋转","Resume rotation","Drehung fortsetzen","متابعة الدوران"],
  retry: ["重试","Retry","Erneut versuchen","إعادة المحاولة"],
  services: ["我的服务","My services","Meine Leistungen","خدماتي"],
  servicesSub: ["解读与训练大纲，独立查看。","Interpretation and training, available independently.","Auswertung und Training – unabhängig voneinander.","التفسير والتدريب متاحان بشكل مستقل."],
  ai: ["AI 报告解读","AI interpretation","KI-Auswertung","تفسير التقرير بالذكاء الاصطناعي"],
  training: ["个性化训练大纲","Personalised training outline","Persönlicher Trainingsrahmen","خطة تدريب مخصصة"],
  noAI: ["暂无已生成的解读","No interpretation yet","Noch keine Auswertung","لا يوجد تفسير مُنشأ بعد"],
  noTraining: ["暂无已生成的大纲","No training outline yet","Noch kein Trainingsrahmen","لا توجد خطة مُنشأة بعد"],
  notGenerated: ["尚未生成","Not generated","Noch nicht erstellt","لم يتم الإنشاء"],
  aiHint: ["解释测量结果，帮助理解关注项。","Understand your results and areas to watch.","Ergebnisse und Auffälligkeiten besser verstehen.","لفهم نتائج القياس والمجالات التي تستحق الاهتمام."],
  trainingHint: ["结合报告与健康档案，不需要先做 AI 解读。","Uses your report and health profile. AI interpretation is not required.","Nutzt Bericht und Gesundheitsprofil. Keine KI-Auswertung erforderlich.","تعتمد على التقرير والملف الصحي؛ لا تتطلب تفسيراً بالذكاء الاصطناعي."],
  info: ["服务说明","About this service","Zur Leistung","عن الخدمة"],
  infoAI: ["AI 解读是独立于基础测量报告的服务。门店已生成的结果可直接查看。当前 Demo 未接入真实生成或付费服务，未关联的样例不作为个人结果。","AI interpretation is separate from your basic report. Results generated by your centre can be viewed directly. This Demo has no live generation or payments; unlinked samples are not personal results.","Die KI-Auswertung ist eine separate Leistung. Vom Studio erstellte Ergebnisse sind direkt einsehbar. Dieses Demo hat keine echte Generierung oder Zahlung; nicht zugeordnete Beispiele sind keine persönlichen Ergebnisse.","التفسير خدمة مستقلة عن تقرير القياس الأساسي. يمكن عرض النتائج التي أنشأها المركز مباشرة. لا يدعم هذا العرض الإنشاء أو الدفع الفعلي، ولا تُعد الأمثلة غير المرتبطة نتائج شخصية."],
  infoTraining: ["训练大纲基于测量报告和完整健康档案，可独立于 AI 解读生成。昵称、身高和体重等基础资料不等于完整健康档案。当前仅展示已关联结果，不提供生成或支付。","An outline uses your assessment and complete health profile, independently of AI interpretation. Basic details such as nickname, height and weight are not a complete health profile. Only linked results are shown; generation and payment are not connected.","Der Trainingsrahmen nutzt Messbericht und vollständiges Gesundheitsprofil, unabhängig von der KI-Auswertung. Name, Größe und Gewicht allein sind kein Gesundheitsprofil. Nur zugeordnete Ergebnisse werden angezeigt; keine Generierung oder Zahlung.","تستند الخطة إلى القياس وملف صحي مكتمل، بشكل مستقل عن التفسير. الاسم والطول والوزن وحدها لا تكوّن ملفاً صحياً مكتملاً. تُعرض النتائج المرتبطة فقط؛ الإنشاء والدفع غير متصلين."],
  available: ["已生成","Ready","Verfügbar","جاهز"],
  historical: ["历史结果","Earlier result","Früheres Ergebnis","نتيجة سابقة"],
  historicalHint: ["来自历史报告，尚未基于最新测量更新。","From an earlier report; not updated for the latest assessment.","Aus einem früheren Bericht, noch nicht für die letzte Messung aktualisiert.","من تقرير سابق؛ لم تُحدَّث وفق أحدث قياس."],
  source: ["来源报告","Source report","Quellbericht","التقرير المصدر"],
  viewAI: ["查看解读","View interpretation","Auswertung ansehen","عرض التفسير"],
  viewTraining: ["查看大纲","View outline","Trainingsrahmen ansehen","عرض الخطة"],
  serviceLoading: ["正在读取服务状态…","Loading service status…","Leistungsstatus wird geladen…","جارٍ تحميل حالة الخدمات…"],
  serviceError: ["服务状态读取失败，暂不判断是否已生成。","Service status unavailable. Existing results have not been marked as missing.","Leistungsstatus nicht verfügbar. Vorhandene Ergebnisse werden nicht als fehlend eingestuft.","تعذر تحميل حالة الخدمات؛ لم تُصنف النتائج على أنها غير موجودة."],
  concerns: ["重点关注","Areas to watch","Im Blick behalten","مجالات تستحق الاهتمام"],
  concernsSub: ["查看关键结果，详细依据在报告中。","Key findings, with full detail in your report.","Wichtige Ergebnisse – Details stehen im Bericht.","النتائج الأساسية، والتفاصيل في التقرير."],
  details: ["查看详情","View details","Details ansehen","عرض التفاصيل"],
  risk: ["重点关注","Priority","Priorität","أولوية"],
  attention: ["需关注","Attention","Beachten","يستحق الاهتمام"],
  good: ["表现良好","Good result","Gutes Ergebnis","نتيجة جيدة"],
  same: ["与上次评估等级一致","Same assessment category as before","Gleiche Bewertungskategorie wie zuvor","نفس فئة التقييم السابق"],
  improved: ["较上次评估等级改善","Assessment category improved","Bewertungskategorie verbessert","تحسنت فئة التقييم"],
  worsened: ["较上次需更多关注","More attention than previously","Mehr Aufmerksamkeit als zuvor nötig","يستحق اهتماماً أكبر من السابق"],
  findingRisk: ["该项目在报告中标记为重点关注，查看详情了解具体指标。","This item is flagged as a priority in your report. View its measurements.","Dieser Bereich ist im Bericht als Priorität markiert. Messwerte in den Details ansehen.","وُضع هذا العنصر ضمن الأولويات في التقرير. اعرض القياسات للتفاصيل."],
  findingAttention: ["该项目存在需关注的测量结果，详细数据以报告为准。","Some measurements need attention. See the report for details.","Einige Messwerte benötigen Aufmerksamkeit. Details im Bericht.","توجد قياسات تستحق الاهتمام. التفاصيل في التقرير."],
  strengths: ["值得保持的表现","Positive findings","Positive Ergebnisse","نتائج إيجابية"],
  strengthsSub: ["来自已测项目的良好结果，不代表所有项目均正常。","Positive results from measured items, not a judgement on every area.","Gute Ergebnisse einzelner Messbereiche, keine Gesamtbewertung.","نتائج إيجابية لعناصر مقاسة، وليست حكماً على جميع المجالات."],
  noStrengths: ["本次暂无可展示的良好评估项。","No positive assessment items to show yet.","Derzeit keine positiven Bewertungsmerkmale verfügbar.","لا توجد عناصر تقييم إيجابية لعرضها حالياً."],
  trends: ["历史变化","Changes over time","Veränderungen","التغيرات عبر الوقت"],
  trendsSub: ["同设备型号、同指标口径的测量对比。","Compare measurements with the same device model and metric definition.","Vergleich mit gleichem Gerätemodell und gleicher Messdefinition.","مقارنة قياسات من نفس طراز الجهاز وتعريف المؤشر."],
  score: ["综合评分","Overall score","Gesamtwert","النتيجة الإجمالية"],
  fat: ["体脂率","Body fat","Körperfett","نسبة الدهون"],
  muscle: ["肌肉量","Muscle mass","Muskelmasse","كتلة العضلات"],
  weight: ["体重","Weight","Gewicht","الوزن"],
  scoreUnit: ["分","pts","Pkt.","نقطة"],
  missing: ["暂无数据","No data","Keine Daten","لا توجد بيانات"],
  single: ["再次测量后可查看变化。","Measure again to see changes.","Nach einer weiteren Messung sind Veränderungen sichtbar.","أعد القياس لعرض التغيرات."],
  flat: ["较上次持平","Unchanged","Unverändert","دون تغيير"],
  delta: ["较上次","Since previous","Seit letzter Messung","مقارنة بالسابق"],
  viewPoint: ["查看该次报告","View this report","Diesen Bericht ansehen","عرض هذا التقرير"],
  firstPoint: ["该指标的首次可比测量","First comparable measurement","Erste vergleichbare Messung","أول قياس قابل للمقارنة"],
  excluded: ["部分记录口径不同，未并入趋势。","Some records use different definitions and are excluded.","Abweichende Messdefinitionen wurden ausgeschlossen.","استُبعدت بعض السجلات لاختلاف تعريف القياس."],
  recentSeven: ["展示最近 7 次可比测量","Showing 7 recent comparable measurements","Die letzten 7 vergleichbaren Messungen","آخر 7 قياسات قابلة للمقارنة"],
  basic: ["基础评估结果","Basic assessment results","Grundlegende Messergebnisse","نتائج التقييم الأساسية"],
  demo: ["本地 Demo · 示例测量数据，非实时健康监测。","Local Demo · Sample assessments, not live health monitoring.","Lokales Demo · Beispieldaten, keine Echtzeit-Gesundheitsüberwachung.","عرض محلي · قياسات تجريبية وليست مراقبة صحية آنية."],
  preview: ["演示预览","Demo preview","Demo-Vorschau","معاينة تجريبية"],
  exitPreview: ["退出预览","Exit preview","Vorschau verlassen","الخروج من المعاينة"],
  previewMissing: ["该预览场景不存在","This preview scenario does not exist","Diese Vorschau ist nicht verfügbar","سيناريو المعاينة غير موجود"],
  previewReadOnly: ["只读示例，不会读取或修改个人数据。","Read-only sample. Personal data is neither read nor changed.","Schreibgeschütztes Beispiel. Persönliche Daten werden weder gelesen noch geändert.","مثال للعرض فقط؛ لا تتم قراءة البيانات الشخصية أو تعديلها."],
} satisfies Record<string, [string,string,string,string]>;
type HomeWord = keyof typeof homeWords;
function homeText(locale: Locale, key: HomeWord) { return homeWords[key][(["zh","en","de","ar"] as Locale[]).indexOf(locale)]; }
function homeValue(value: number, metric: HomeMetricId, units: Units, locale: Locale) {
  if (metric === "score") return value + " " + homeText(locale,"scoreUnit");
  if (homeMetricSpec[metric].unit === "kg") return convert(value.toFixed(1) + " kg", units);
  return value.toFixed(1) + "%";
}
function homeModuleIcon(id: ModuleId) {
  return id === "composition" ? <LuFlame /> : id === "spine" ? <TargetIcon /> : id === "girth" ? <BarChartIcon /> : id === "balance" ? <LuGauge /> : <PersonIcon />;
}
function homeModuleAccent(id: ModuleId) {
  if (id === "composition" || id === "hip") return "accent-orange";
  if (id === "spine" || id === "posture") return "accent-violet";
  if (id === "neck" || id === "balance") return "accent-cyan";
  return "accent-brand";
}
function homeFinding(module: ReportModule, locale: Locale) {
  const index = (["zh","en","de","ar"] as Locale[]).indexOf(locale);
  if (module.id === "composition") {
    const value = module.metrics.find(m=>m.label === "内脏脂肪等级")?.value;
    if (value) return ["内脏脂肪等级：", "Visceral fat level: ", "Viszeralfett-Stufe: ", "مستوى الدهون الحشوية: "][index] + value;
  }
  if (module.id === "neck") {
    const count = module.metrics.filter(m=>m.tone === "risk" || m.tone === "warn").length;
    return [count+" 项活动度测量被报告标记为需关注。",count+" mobility measurements are flagged in the report.",count+" Beweglichkeitsmessungen sind im Bericht auffällig.","وُضعت علامة اهتمام على "+count+" قياسات للحركة في التقرير."][index];
  }
  if (module.id === "spine") {
    const area = module.metrics.find(m=>m.label === "重点区域")?.value;
    if (area === "胸椎") return ["报告标记的重点区域：胸椎。","Area flagged in the report: thoracic spine.","Markierter Bereich: Brustwirbelsäule.","المنطقة المحددة في التقرير: الفقرات الصدرية."][index];
  }
  return homeText(locale,module.status === "risk" ? "findingRisk" : "findingAttention");
}
// Named exports support isolated QA fixtures; not a scenario switch in the app.
export { seed as homeSampleReports, outlineByLocale as homeSampleOutlines };
const homeServicesKey = "wellnesshub.home-services.v1";
function useHomeServices() {
  const [state,setState] = useState<{ status: "loading" | "ready" | "error"; results: HomeServiceResult[] }>({status:"loading",results:[]});
  const [attempt,setAttempt] = useState(0);
  const retry = () => setAttempt(n => n + 1);
  useEffect(() => {
    setState({status:"loading",results:[]});
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(homeServicesKey);
        const data: unknown = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(data) || !data.every(isHomeServiceResult)) throw new Error("Invalid service records");
        setState({status:"ready",results:data});
      } catch { setState({status:"error",results:[]}); }
    }, 180);
    return () => clearTimeout(timer);
  }, [attempt]);
  useEffect(() => {
    const update = (e: StorageEvent) => { if (e.key === homeServicesKey) retry(); };
    window.addEventListener("storage",update);
    return () => window.removeEventListener("storage",update);
  }, []);
  return { ...state, retry };
}

function parsePreviewHash(hash = location.hash) {
  const [path,query] = hash.replace(/^#\/?/,"").split("?");
  const parts = path.split("/").filter(Boolean);
  const scenario = parts[0] === "preview" ? parts[1] : undefined;
  const valid = scenario === "none" || scenario === "ai" || scenario === "training" || scenario === "both";
  const inner = parts.slice(2);
  return { scenario, valid, route: valid ? parsePreviewRoute(inner,query) : {page:"invalid"} as Route };
}
function parsePreviewRoute(parts:string[],query?:string):Route {
  const contentId = new URLSearchParams(query).get("content") || undefined;
  if (parts[0] === "reports" && parts[2]) return {page:modules.some(m=>m.id===parts[2])?"report":parts[2],id:parts[1],type:parts[2],contentId};
  if (parts[0] === "reports" && parts[1]) return {page:"report",id:parts[1]};
  return {page:parts[0] || "home"};
}
const previewSummary:Record<"ai"|"training",HomeLocalized<string>> = {
  ai:{zh:"已结合本次测量整理重点关注项、优势与行动建议。",en:"Key findings, strengths and actions have been prepared for this assessment.",de:"Schwerpunkte, Stärken und nächste Schritte wurden für diese Messung aufbereitet.",ar:"تم إعداد أبرز النتائج ونقاط القوة والخطوات العملية لهذا القياس."},
  training:{zh:"已根据测量报告与示例健康档案生成四周训练大纲。",en:"A four-week outline was created from the assessment and sample health profile.",de:"Aus Messung und Beispiel-Gesundheitsprofil wurde ein vierwöchiger Rahmen erstellt.",ar:"تم إعداد خطة لأربعة أسابيع استناداً إلى القياس والملف الصحي التجريبي."},
};
const previewAI:HomeLocalized<HomeAIContent> = {
  zh:{summary:"本次测量建议优先理解体脂与颈部活动度结果，并结合完整报告判断后续安排。",risks:["体脂相关指标在本次报告中被标记为需关注","部分颈部活动度测量需要进一步查看"],strengths:["平衡评估中的感官系统结果表现良好"],actions:["查看原始测量依据","结合自身情况咨询专业人员"]},
  en:{summary:"Review body-fat and neck-mobility findings first, then use the full report to plan next steps.",risks:["Body-fat related values are flagged for attention","Some neck-mobility measurements need review"],strengths:["Sensory-system results in the balance assessment are positive"],actions:["Review the underlying measurements","Discuss relevant findings with a qualified professional"]},
  de:{summary:"Zuerst Körperfett- und Nackenbeweglichkeitswerte prüfen und anschließend den vollständigen Bericht einbeziehen.",risks:["Körperfettwerte sind als auffällig markiert","Einige Nackenbeweglichkeitswerte sollten geprüft werden"],strengths:["Die sensorischen Ergebnisse der Balancebewertung sind positiv"],actions:["Messgrundlagen ansehen","Relevante Ergebnisse fachlich besprechen"]},
  ar:{summary:"راجع أولاً نتائج الدهون وحركة الرقبة، ثم ارجع إلى التقرير الكامل لتحديد الخطوات التالية.",risks:["مؤشرات الدهون تستحق الاهتمام","بعض قياسات حركة الرقبة تحتاج إلى مراجعة"],strengths:["نتائج النظام الحسي في تقييم التوازن جيدة"],actions:["مراجعة القياسات الأصلية","مناقشة النتائج ذات الصلة مع مختص"]},
};
const previewTrainingData = Object.fromEntries(((["zh","en","de","ar"] as Locale[]).map(locale=>{
  const text={
    zh:{title:"四周个性化训练大纲",desc:"基于本次测量与示例健康档案生成。",status:"共 4 周",goal:"建立稳定运动习惯",phases:[["呼吸与体态筑基","第 1 周"],["核心唤醒与下肢激活","第 2–3 周"],["整合收束与复测准备","第 4 周"]]},
    en:{title:"Four-week personalised training outline",desc:"Created from this assessment and a sample health profile.",status:"4 weeks",goal:"Build a consistent exercise habit",phases:[["Breathing and posture foundations","Week 1"],["Core awareness and lower-body activation","Weeks 2–3"],["Consolidation and reassessment preparation","Week 4"]]},
    de:{title:"Persönlicher Vier-Wochen-Trainingsrahmen",desc:"Aus dieser Messung und einem Beispiel-Gesundheitsprofil erstellt.",status:"4 Wochen",goal:"Eine regelmäßige Bewegungsroutine aufbauen",phases:[["Atmung und Haltungsgrundlagen","Woche 1"],["Rumpfwahrnehmung und Unterkörperaktivierung","Wochen 2–3"],["Festigung und Vorbereitung der Folgemessung","Woche 4"]]},
    ar:{title:"خطة تدريب مخصصة لأربعة أسابيع",desc:"أُنشئت استناداً إلى هذا القياس وملف صحي تجريبي.",status:"4 أسابيع",goal:"بناء عادة حركة منتظمة",phases:[["أساسيات التنفس والقوام","الأسبوع 1"],["وعي الجذع وتنشيط الجزء السفلي","الأسبوعان 2–3"],["الدمج والاستعداد لإعادة القياس","الأسبوع 4"]]},
  }[locale];
  return [locale,{title:text.title,heroDesc:text.desc,status:text.status,metrics:[],goals:[{name:text.goal,tag:"",tone:"",desc:text.desc}],phases:text.phases.map(([name,weeks])=>({name,weeks,tag:"",desc:""})),nutritionKcal:0,nutrients:[],weeks:[],review:"",days:[],exercises:[],meals:[],dietHeroTitle:"",dietHeroDesc:"",execIntro:"",strategyTags:[]}];
}))) as unknown as HomeLocalized<(typeof outlineByLocale)[Locale]>;
function previewServices(scenario:PreviewScenario,report:Report) {
  const results:HomeServiceResult[]=[];
  if (previewServiceTypes(scenario).includes("ai")) results.push({id:"preview-ai",reportId:report.id,type:"ai",generatedAt:report.date,summary:previewSummary.ai,ai:previewAI});
  if (previewServiceTypes(scenario).includes("training")) results.push({id:"preview-training",reportId:report.id,type:"training",generatedAt:report.date,summary:previewSummary.training,training:previewTrainingData});
  return {status:"ready" as const,results,retry:()=>{}};
}
function PreviewTrainingDetail({locale,back,share}:{locale:Locale;back:()=>void;share:()=>void}) {
  const copy={
    zh:{title:"个性化训练大纲",tag:"已生成",intro:"该示例大纲由本次测量报告与已填写的示例健康档案生成，不依赖 AI 报告解读。",goal:"训练目标",goalText:"建立稳定运动习惯，循序改善核心控制与下肢稳定。",phases:"四周安排",items:[["第 1 周","呼吸与体态筑基"],["第 2–3 周","核心唤醒与下肢激活"],["第 4 周","整合收束与复测准备"]],note:"演示内容仅用于说明产品结构，不构成医疗或训练处方。"},
    en:{title:"Personalised training outline",tag:"Ready",intro:"This sample uses the assessment and a completed sample health profile. It does not depend on AI interpretation.",goal:"Training goal",goalText:"Build a consistent exercise habit and progressively support core control and lower-body stability.",phases:"Four-week structure",items:[["Week 1","Breathing and posture foundations"],["Weeks 2–3","Core awareness and lower-body activation"],["Week 4","Consolidation and reassessment preparation"]],note:"Demo content illustrates the product structure and is not medical or exercise prescription."},
    de:{title:"Persönlicher Trainingsrahmen",tag:"Verfügbar",intro:"Dieses Beispiel nutzt die Messung und ein ausgefülltes Beispiel-Gesundheitsprofil, unabhängig von der KI-Auswertung.",goal:"Trainingsziel",goalText:"Eine regelmäßige Bewegungsroutine aufbauen und Rumpfkontrolle sowie Unterkörperstabilität schrittweise unterstützen.",phases:"Vier-Wochen-Struktur",items:[["Woche 1","Atmung und Haltungsgrundlagen"],["Wochen 2–3","Rumpfwahrnehmung und Unterkörperaktivierung"],["Woche 4","Festigung und Vorbereitung der Folgemessung"]],note:"Demo-Inhalte zeigen nur die Produktstruktur und sind keine medizinische oder trainingsbezogene Verordnung."},
    ar:{title:"خطة تدريب مخصصة",tag:"جاهز",intro:"يعتمد هذا المثال على القياس وملف صحي تجريبي مكتمل، ولا يعتمد على تفسير الذكاء الاصطناعي.",goal:"هدف التدريب",goalText:"بناء عادة حركة منتظمة ودعم التحكم بالجذع وثبات الجزء السفلي تدريجياً.",phases:"هيكل أربعة أسابيع",items:[["الأسبوع 1","أساسيات التنفس والقوام"],["الأسبوعان 2–3","وعي الجذع وتنشيط الجزء السفلي"],["الأسبوع 4","الدمج والاستعداد لإعادة القياس"]],note:"محتوى العرض يوضح بنية المنتج فقط ولا يمثل وصفة طبية أو تدريبية."},
  }[locale];
  return <section className="fx-detail training-page preview-training-detail"><Header title={copy.title} back={back} actions={<button className="icon-btn" onClick={share} aria-label={copy.title}><Share2Icon/></button>}/><div className="readonly-banner">{homeText(locale,"previewReadOnly")}</div><div className="training-v2"><section className="training-hero"><span className="home-status ready">{copy.tag}</span><h1>{copy.title}</h1><p>{copy.intro}</p></section><section className="training-panel"><SectionTitle title={copy.goal} icon={<TargetIcon/>} accent="accent-emerald"/><p>{copy.goalText}</p></section><section className="training-panel"><SectionTitle title={copy.phases} icon={<LuClipboardList/>} accent="accent-emerald"/><div className="preview-phase-list">{copy.items.map(([weeks,title])=><div key={weeks}><span>{weeks}</span><strong>{title}</strong></div>)}</div></section><p className="report-disclaimer">{copy.note}</p></div></section>;
}
function PreviewPrototype() {
  const [locationKey,setLocationKey]=useState(location.hash);
  const parsed=parsePreviewHash(locationKey);
  const locale=((localStorage.getItem(K.locale) as Locale)||"zh");
  const theme=((localStorage.getItem(K.theme) as Theme)||"system");
  const [systemDark,setSystemDark]=useState(()=>matchMedia("(prefers-color-scheme:dark)").matches);
  const {device}=useMobileDevice();
  const [headerHost,setHeaderHost]=useState<HTMLDivElement|null>(null);
  const [moduleId,setModuleId]=useState<ModuleId>("composition");
  const [toast,setToast]=useState("");
  useEffect(()=>{const update=()=>setLocationKey(location.hash);addEventListener("hashchange",update);return()=>removeEventListener("hashchange",update);},[]);
  useEffect(()=>{const media=matchMedia("(prefers-color-scheme:dark)");const update=()=>setSystemDark(media.matches);media.addEventListener("change",update);return()=>media.removeEventListener("change",update);},[]);
  useEffect(()=>{document.documentElement.dir=locale==="ar"?"rtl":"ltr";document.documentElement.lang=locale;},[locale]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(""),1800);return()=>clearTimeout(timer);},[toast]);
  const dark=theme==="dark"||(theme==="system"&&systemDark);
  const scenario=(parsed.valid?parsed.scenario:"none") as PreviewScenario;
  const report=seed.find(item=>item.id==="m60-20260810") ?? seed[0];
  const reports=seed.slice();
  const profile:Profile={nickname:{zh:"示例用户",en:"Sample user",de:"Beispielnutzer",ar:"مستخدم تجريبي"}[locale],gender:"female",heightCm:168,weightKg:72.8,birthday:"1992-06-18"};
  const T=(key:string)=>(lang[locale] as Record<string,string>)[key]||key;
  const prefix=`/preview/${scenario}`;
  const go=(path:string)=>{const clean=path.replace(/^#?\/?/,"");location.hash=`${prefix}/${clean||"home"}`;};
  const back=()=>go("home");
  const share=()=>{const url=location.href;navigator.clipboard?.writeText(url).then(()=>setToast(T("copied"))).catch(()=>setToast(url));};
  useEffect(()=>{if(parsed.route.page==="report"&&parsed.route.type&&modules.some(m=>m.id===parsed.route.type))setModuleId(parsed.route.type as ModuleId);},[parsed.route.page,parsed.route.type]);
  let view:ReactNode;
  if(!parsed.valid) view=<section className="home-overview-page"><div className="home-empty"><InfoCircledIcon/><h1>{homeText(locale,"previewMissing")}</h1><button className="home-link" onClick={()=>{location.hash="/home"}}>{homeText(locale,"exitPreview")}</button></div></section>;
  else if(parsed.route.page==="ai" && (scenario==="ai"||scenario==="both")) view=<AIPage report={report} homeContent={previewAI[locale]} T={T} locale={locale} back={back} share={share} readOnly/>;
  else if(parsed.route.page==="training" && (scenario==="training"||scenario==="both")) view=<PreviewTrainingDetail locale={locale} back={back} share={share}/>;
  else if(parsed.route.page==="report") view=<M60Report report={report} profile={profile} locale={locale} units="metric" active={moduleId} setActive={setModuleId} T={T} back={back} share={share} go={go} readOnly/>;
  else if(parsed.route.page==="home") view=<><div className="preview-banner"><span><InfoCircledIcon/>{homeText(locale,"preview")}</span><button onClick={()=>{location.hash="/home"}}>{homeText(locale,"exitPreview")}</button></div><SourceHome T={T} locale={locale} profile={profile} reports={reports} units="metric" go={go} services={previewServices(scenario,report)}/></>;
  else view=<section className="home-overview-page"><div className="home-empty"><p>{homeText(locale,"previewReadOnly")}</p><button className="home-link" onClick={back}>{homeText(locale,"overview")}</button></div></section>;
  const nav=parsed.valid&&parsed.route.page==="home";
  return <div className={`wh-app ${dark?"wh-dark":"wh-light"} preview-shell${nav?" is-home":""}`} data-locale={locale} style={{"--app-safe-top":`${device.geometry.safeArea.top}px`,"--app-safe-bottom":`${device.platform==="ios"?device.geometry.safeArea.bottom:0}px`} as CSSProperties}><div className="app-header-host" ref={setHeaderHost}/><HeaderHost.Provider value={headerHost}><MobileScroll className="app-screen"><main className={`screen-content ${nav?"with-nav":""} fx-shell`}>{parsed.valid&&parsed.route.page!=="home"&&<div className="preview-banner preview-banner-detail"><span><InfoCircledIcon/>{homeText(locale,"preview")}</span><button onClick={()=>{location.hash="/home"}}>{homeText(locale,"exitPreview")}</button></div>}{view}</main></MobileScroll></HeaderHost.Provider>{nav&&<BottomNav page="home" T={T} go={(path:string)=>path==="/home"?go("home"):go("preview-info")}/>} {toast&&<div className="toast"><CheckCircledIcon/>{toast}</div>}</div>;
}

function BodyModel({ report, T, locale }: { report: Report; T: (key: string) => string; locale: Locale }) {
  const mount = useRef<HTMLDivElement>(null);
  const asset = homeModelAsset(report);
  const [failed,setFailed] = useState(false);
  const [attempt,setAttempt] = useState(0);
  const reducedMotion = useRef(matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [userPaused,setUserPaused] = useState(reducedMotion.current);
  const userPausedRef = useRef(userPaused);
  const rotationUpdateRef = useRef<() => void>(()=>{});
  useEffect(() => { userPausedRef.current = userPaused; rotationUpdateRef.current(); },[userPaused]);
  useEffect(() => {
    setFailed(false);
    if (!asset || !mount.current) return;
    const el = mount.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({alpha:true,antialias:true}); }
    catch { setFailed(true); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35,el.clientWidth / Math.max(el.clientHeight,1),0.1,100);
    camera.position.set(0,0,3.25);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(el.clientWidth,el.clientHeight);
    el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xdaf6ff,0x17264d,2.2));
    const light = new THREE.DirectionalLight(0x78dfff,2.3);
    light.position.set(3,5,4); scene.add(light);
    const controls = new OrbitControls(camera,renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 2.2; controls.maxDistance = 5;
    controls.autoRotateSpeed = 2; controls.enableDamping = true;
    let disposed = false, frame = 0, interacting = false, visible = true, resumeTimer = 0;
    const updateRotation = () => {
      controls.autoRotate = !userPausedRef.current && !interacting && visible && !document.hidden;
    };
    rotationUpdateRef.current = updateRotation;
    const onStart = () => { interacting = true; window.clearTimeout(resumeTimer); updateRotation(); };
    const onEnd = () => {
      interacting = false;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(updateRotation,3000);
    };
    controls.addEventListener("start",onStart);
    controls.addEventListener("end",onEnd);
    const onVisibility = () => updateRotation();
    document.addEventListener("visibilitychange",onVisibility);
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      updateRotation();
    },{threshold:.05});
    observer.observe(el);
    updateRotation();
    const release = (obj: THREE.Object3D) => obj.traverse(c => {
      if (c instanceof THREE.Mesh) { c.geometry.dispose(); (Array.isArray(c.material) ? c.material : [c.material]).forEach(m => m.dispose()); }
    });
    new OBJLoader().load(asset,obj => {
      if (disposed) { release(obj); return; }
      obj.traverse(c => {
        if (c instanceof THREE.Mesh) {
          (Array.isArray(c.material) ? c.material : [c.material]).forEach(m => m.dispose());
          c.material = new THREE.MeshStandardMaterial({color:0x72b7d8,roughness:0.3,metalness:0.15});
        }
      });
      const size = new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3());
      obj.scale.setScalar(1.84 / Math.max(size.x,size.y,size.z));
      obj.position.sub(new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3()));
      scene.add(obj);
    }, undefined, () => { if (!disposed) setFailed(true); });
    const ro = new ResizeObserver(() => {
      const width=el.clientWidth, height=el.clientHeight;
      if (!width || !height) return;
      camera.aspect=width/height; camera.updateProjectionMatrix(); renderer.setSize(width,height);
    });
    ro.observe(el);
    const clock = new THREE.Clock();
    const run = () => { frame=requestAnimationFrame(run); controls.update(clock.getDelta()); renderer.render(scene,camera); };
    run();
    return () => { disposed=true; rotationUpdateRef.current=()=>{}; window.clearTimeout(resumeTimer); cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange",onVisibility); controls.removeEventListener("start",onStart); controls.removeEventListener("end",onEnd); ro.disconnect(); controls.dispose(); release(scene); renderer.dispose(); el.replaceChildren(); };
  },[asset,attempt]);
  if (!asset) return <div className="home-model-empty"><PersonIcon /><p>{homeText(locale,"noModel")}</p></div>;
  return <div className="home-model">
    <div ref={mount} className="three-model" role="img" aria-label={"3D · " + report.date} />
    {!failed && <button type="button" className="home-rotation-toggle" aria-pressed={userPaused} aria-label={homeText(locale,userPaused?"resumeRotation":"pauseRotation")} onClick={()=>setUserPaused(value=>!value)}>
      {userPaused?<LuPlay />:<LuPause />}<span>{homeText(locale,userPaused?"resumeRotation":"pauseRotation")}</span>
    </button>}
    {failed ? <div className="home-model-error" role="status"><p>{homeText(locale,"modelError")}</p><button className="home-link" onClick={() => setAttempt(n=>n+1)}><ReloadIcon />{homeText(locale,"retry")}</button></div>
      : <p className="home-model-hint">{T("rotateHint")}</p>}
  </div>;
}
function ModelCanvas() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mount.current) return;
    const el = mount.current,
      scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(
        33,
        el.clientWidth / el.clientHeight,
        0.1,
        100,
      );
    camera.position.set(0, 0, 4.3);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xe9fbff, 0x102346, 2.6));
    const light = new THREE.DirectionalLight(0x55c8ff, 2.8);
    light.position.set(3, 4, 4);
    scene.add(light);
    let model: THREE.Object3D | undefined,
      frame = 0;
    new OBJLoader().load("/assets/h5-source/skin.obj", (obj) => {
      obj.traverse((c: any) => {
        if (c.isMesh)
          c.material = new THREE.MeshStandardMaterial({
            color: 0x7bc7e6,
            roughness: 0.32,
            metalness: 0.12,
            transparent: true,
            opacity: 0.9,
          });
      });
      const size = new THREE.Box3()
        .setFromObject(obj)
        .getSize(new THREE.Vector3());
      obj.scale.setScalar(2.15 / Math.max(size.x, size.y, size.z));
      const box = new THREE.Box3().setFromObject(obj);
      obj.position.sub(box.getCenter(new THREE.Vector3()));
      obj.rotation.y = 0.2;
      model = obj;
      scene.add(obj);
    });
    const run = () => {
      frame = requestAnimationFrame(run);
      if (model) model.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    run();
    const ro = new ResizeObserver(() => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.dispose();
      el.replaceChildren();
    };
  }, []);
  return <div ref={mount} className="report-model-canvas" />;
}
function SourceHome({ T, locale, profile, reports, units, go, services }: {
  T: (key:string)=>string; locale:Locale; profile:Profile; reports:Report[]; units:Units;
  go:(path:string)=>void; services:ReturnType<typeof useHomeServices>;
}) {
  const h = (key:HomeWord)=>homeText(locale,key);
  const overview = buildHomeOverview(reports);
  const latest = overview.latest;
  const [info,setInfo] = useState<"ai"|"training"|null>(null);
  const [expanded,setExpanded] = useState(false);
  const primaryLabel: Record<ModuleId,[string,string,string,string]> = {
    composition:["体脂率","Body fat","Körperfett","نسبة الدهون"],
    posture:["头前引","Forward head","Kopfvorhaltung","تقدم الرأس"],
    neck:["颈椎前屈","Neck flexion","Nackenbeugung","ثني الرقبة"],
    spine:["结构异常评分","Structural deviation score","Struktureller Abweichungswert","درجة الانحراف الهيكلي"],
    hip:["本次臀围","Hip girth","Hüftumfang","محيط الورك"],
    balance:["COP 轨迹面积","COP area","COP-Fläche","مساحة مسار مركز الضغط"],
    girth:["颈围","Neck girth","Halsumfang","محيط الرقبة"],
  };
  const primaryMetric = (m:ReportModule) => m.metrics.find(x => x.label === ({
    composition:"体脂率",posture:"头前引",neck:"颈椎前屈",spine:"脊柱结构异常",hip:"本次臀围",balance:"COP 轨迹面积",girth:"颈围",
  }[m.id]));
  const formatMetric = (value:string) => convert(value.replace(/\s*分$/, " " + h("scoreUnit")),units);
  const previous = overview.reports.find(r=>r.id !== latest?.id && latest && homeComparisonKey(r) === homeComparisonKey(latest));
  const strengths = (latest?.modules ?? []).flatMap<{module:ReportModule;metric:Metric|undefined}>(m => {
    const positive = m.metrics.find(x=>x.tone === "good");
    if (positive) return [{ module:m, metric:positive }];
    return m.status === "good" ? [{ module:m, metric:undefined }] : [];
  }).slice(0,2);
  const nickname = profile.nickname === "New User" ? ({zh:"新用户",en:"New user",de:"Neuer Nutzer",ar:"مستخدم جديد"}[locale]) : profile.nickname;
  return <section className="home-overview-page" data-version="0.2.1">
    {!latest ? <div className="home-empty">
      <IconTile><LuChartNoAxesCombined /></IconTile><h1>{h("noReport")}</h1><p>{h("startHint")}</p>
      <button className="home-link" onClick={()=>go("/reports")}>{h("records")}<ChevronRightIcon /></button>
    </div> : <section className="home-overview-card" aria-labelledby="home-overview-title">
      <div className="home-heading"><h2 id="home-overview-title">{h("overview")}</h2>
        <button className="home-link" onClick={()=>go("/reports/"+latest.id)}>{h("full")}<ChevronRightIcon /></button>
      </div>
      <div className="home-identity">
        <div><strong>{nickname}</strong><span>{latest.device}</span><time dateTime={latest.date.replace(" ","T")}>{h("measured")} {latest.date}</time></div>
        {homeMetricValue(latest,"score") !== undefined && <div className="home-report-score"><span>{h("reportScore")}</span><strong>{latest.score}<small>/100</small></strong></div>}
      </div>
      <p className="home-result-summary">{!latest.modules.length ? h("missing") : overview.concerns.length ? h("focusIntro") + overview.concerns.map(m=>moduleNames[locale][m.id]).join(locale==="zh"?"、":" · ") : h("noConcerns")}</p>
      <BodyModel key={latest.id} report={latest} T={T} locale={locale} />
      <div className="home-core-metrics">
        {(["fat","muscle","weight"] as HomeMetricId[]).map(metric => {
          const value=homeMetricValue(latest,metric);
          return <button key={metric} onClick={()=>go("/reports/"+latest.id+"/composition")} disabled={value===undefined}>
            <span>{h(metric)}</span><strong dir="ltr">{value===undefined ? "—" : homeValue(value,metric,units,locale)}</strong>
          </button>;
        })}
      </div>
      <p className="home-footnote">{h("measuredOnly")}</p>
    </section>}

    <section className="home-section-v2" aria-labelledby="home-services-title">
      <div className="home-heading"><h2 id="home-services-title"><IconTile accent="accent-violet"><LuClipboardList /></IconTile>{h("services")}</h2></div>
      <p className="home-section-sub">{h("servicesSub")}</p>
      {services.status === "loading" ? <div className="home-service-state" role="status" aria-busy="true">{h("serviceLoading")}</div>
        : services.status === "error" ? <div className="home-service-state" role="alert"><p>{h("serviceError")}</p><button className="home-link" onClick={services.retry}><ReloadIcon />{h("retry")}</button></div>
        : <div className="home-service-grid">{(["ai","training"] as const).map(type=>{
          const summary=homeServiceSummary(type,overview,services.results);
          const result=summary.result;
          return <article className="home-service-card" key={type} data-service={type} data-state={summary.state}>
            <div className="home-service-title"><IconTile accent={type==="ai"?"accent-violet":"accent-emerald"}>{type==="ai"?<LuSparkles />:<LuDumbbell />}</IconTile><h3>{h(type)}</h3>
              <span className={`home-status ${result?"ready":"empty"}`}>{h(result?(summary.state==="historical"?"historical":"available"):"notGenerated")}</span>
            </div>
            <p className="home-service-summary">{result ? result.summary[locale] : h(type==="ai"?"aiHint":"trainingHint")}</p>
            {summary.report && <p className="home-service-note">{h("source")} · {summary.report.date}</p>}
            {summary.state==="historical" && <p className="home-service-note">{h("historicalHint")}</p>}
            <button className="home-link" onClick={()=>result ? go("/reports/"+result.reportId+"/"+type+"?content="+encodeURIComponent(result.id)) : setInfo(type)}>
              {h(result?(type==="ai"?"viewAI":"viewTraining"):"info")}<ChevronRightIcon />
            </button>
          </article>;
        })}</div>}
    </section>

    {latest && <section className="home-section-v2" aria-labelledby="home-concerns-title">
      <div className="home-heading"><h2 id="home-concerns-title"><IconTile accent="accent-orange"><TargetIcon /></IconTile>{h("concerns")}</h2></div>
      <p className="home-section-sub">{h("concernsSub")}</p>
      <div className="home-concern-list">
        {overview.concerns.length===0 && <p className="home-service-state">{h(latest.modules.length ? "noConcerns" : "missing")}</p>}
        {overview.concerns.map(m=>{
          const metric=primaryMetric(m);
          const prior=previous?.modules.find(x=>x.id===m.id);
          const change=prior ? homeSeverity[m.status]-homeSeverity[prior.status] : undefined;
          return <article key={m.id} className="home-concern">
            <div className="home-heading"><h3><IconTile accent={homeModuleAccent(m.id)}>{homeModuleIcon(m.id)}</IconTile>{moduleNames[locale][m.id]}</h3>
              <button className="home-link" onClick={()=>go("/reports/"+latest.id+"/"+m.id)}>{h("details")}<ChevronRightIcon /></button></div>
            <div className="home-finding-value"><span>{primaryLabel[m.id][(["zh","en","de","ar"] as Locale[]).indexOf(locale)]}</span>
              <strong dir="ltr">{metric ? formatMetric(metric.value) : "—"}</strong><span className={"home-status "+m.status}>{h(m.status)}</span></div>
            <p>{homeFinding(m,locale)}</p>
            {change !== undefined && <div className="home-comparison"><span>{h(change===0?"same":change<0?"improved":"worsened")}</span><time>{previous?.date.slice(0,10)}</time></div>}
          </article>;
        })}
      </div>
      <div className="home-strengths">
        <button className="home-strengths-toggle" onClick={()=>setExpanded(x=>!x)} aria-expanded={expanded} aria-controls="home-strengths-content">
          <span><CheckCircledIcon />{h("strengths")}</span><ChevronDownIcon className={expanded?"expanded":""} />
        </button>
        <p>{h(strengths.length ? "strengthsSub" : "noStrengths")}</p>
        {expanded && <div id="home-strengths-content" className="home-strengths-results">
          {strengths.map(({module:m,metric})=><button key={m.id} onClick={()=>go("/reports/"+latest.id+"/"+m.id)}>
            <span>{moduleNames[locale][m.id]}{metric && <small>{metric.label === "感官系统评价" ? ({zh:"感官系统评价",en:"Sensory assessment",de:"Sensorische Bewertung",ar:"التقييم الحسي"}[locale]) : h("basic")}</small>}</span>
            <strong>{metric ? h("good") : m.score+" "+h("scoreUnit")}<ChevronRightIcon /></strong>
          </button>)}
        </div>}
      </div>
    </section>}
    <section className="home-section-v2" aria-labelledby="home-trends-title">
      <div className="home-heading"><h2 id="home-trends-title"><IconTile accent="accent-cyan"><LuChartNoAxesCombined /></IconTile>{h("trends")}</h2>
        <button className="home-link" onClick={()=>go("/reports")}>{h("records")}<ChevronRightIcon /></button></div>
      <p className="home-section-sub">{h("trendsSub")}</p>
      <HomeTrends key={overview.reports.map(r=>r.id+":"+r.date).join("|")} overview={overview} units={units} locale={locale} go={go} />
    </section>
    <p className="home-demo-note"><InfoCircledIcon />{h("demo")}</p>
    <BottomSheet open={info!==null} onOpenChange={open=>{if(!open)setInfo(null);}} title={h(info==="training"?"training":"ai")}>
      <div className="home-service-explanation"><p>{h(info==="training"?"infoTraining":"infoAI")}</p></div>
    </BottomSheet>
  </section>;
}

function HomeTrends({overview,units,locale,go}:{overview:HomeOverview;units:Units;locale:Locale;go:(p:string)=>void}) {
  const ids:HomeMetricId[]=["score","fat","muscle","weight"];
  const [metric,setMetric]=useState<HomeMetricId>(()=>ids.find(id=>overview.trends[id].length)??"score");
  const h=(key:HomeWord)=>homeText(locale,key);
  return <div className="home-trends">
    <div className="home-metric-tabs" role="group" aria-label={h("trends")}>
      {ids.map(id=><button key={id} aria-pressed={metric===id} onClick={()=>setMetric(id)}>{h(id)}</button>)}
    </div>
    <HomeTrendPlot key={metric} metric={metric} points={overview.trends[metric]} units={units} locale={locale} go={go} />
    {overview.latest && overview.reports.some(r=>homeComparisonKey(r)!==homeComparisonKey(overview.latest!)) && <p className="home-footnote">{h("excluded")}</p>}
  </div>;
}
function HomeTrendPlot({metric,points,units,locale,go}:{metric:HomeMetricId;points:HomeTrendPoint[];units:Units;locale:Locale;go:(p:string)=>void}) {
  const visible=points.slice(-7);
  const [selected,setSelected]=useState(visible.length-1);
  const current=visible[selected];
  const h=(key:HomeWord)=>homeText(locale,key);
  const gradientId=useId().replace(/:/g,"");
  if (!current) return <div className="home-trend-empty"><BarChartIcon /><p>{h("missing")}</p></div>;
  const previous=points[points.findIndex(p=>p.reportId===current.reportId)-1];
  const delta=previous ? current.value-previous.value : undefined;
  const max=Math.max(...visible.map(p=>p.value)), min=Math.min(...visible.map(p=>p.value));
  const coords=visible.map((p,i)=>({x:26+(visible.length===1?124:i*248/(visible.length-1)),y:max===min?80:120-(p.value-min)/(max-min)*80}));
  const line=coords.map(p=>p.x+","+p.y).join(" ");
  const selectedCoord=coords[selected];
  const choose=(i:number)=>setSelected(Math.max(0,Math.min(i,visible.length-1)));
  return <div className="home-trend-card">
    <div className="home-trend-head"><IconTile accent={metric==="fat"?"accent-orange":metric==="muscle"?"accent-emerald":"accent-brand"}>{metric==="score"?<LuGauge />:metric==="fat"?<LuFlame />:metric==="muscle"?<LuDumbbell />:<BarChartIcon />}</IconTile>
      <div><h3>{h(metric)}</h3><time>{current.measuredAt}</time></div><strong dir="ltr" aria-live="polite">{homeValue(current.value,metric,units,locale)}</strong></div>
    {visible.length>1 ? <svg className="home-trend-svg" viewBox="0 0 300 154" aria-hidden="true">
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".2"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
      {[40,80,120].map(y=><line key={y} x1="26" x2="274" y1={y} y2={y} stroke="currentColor" strokeOpacity=".13" strokeDasharray="3 5"/>)}
      <polygon points={"26,140 "+line+" 274,140"} fill={"url(#"+gradientId+")"} />
      <polyline points={line} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <line x1={selectedCoord.x} x2={selectedCoord.x} y1={20} y2={140} stroke="currentColor" strokeDasharray="3 4" strokeOpacity=".4"/>
      {coords.map((p,i)=><g key={visible[i].reportId}><circle cx={p.x} cy={p.y} r={selected===i?6:4} fill="currentColor" stroke="var(--home-surface)" strokeWidth="2"/><circle cx={p.x} cy={p.y} r="22" fill="transparent" onClick={()=>choose(i)} style={{cursor:"pointer"}}/></g>)}
    </svg> : <p className="home-single">{h("single")}</p>}
    <Carousel className="home-date-carousel" contentClassName="home-date-track" ariaLabel={h("measured")}>
      {visible.map((p,i)=><button key={p.reportId} type="button" aria-pressed={selected===i} aria-label={p.measuredAt+" · "+homeValue(p.value,metric,units,locale)} onClick={()=>choose(i)}
        onKeyDown={e=>{
          const movement=locale==="ar"?-1:1;
          const next=e.key==="ArrowRight"?i+movement:e.key==="ArrowLeft"?i-movement:e.key==="Home"?0:e.key==="End"?visible.length-1:null;
          if(next!==null){e.preventDefault();choose(next);const buttons=e.currentTarget.parentElement?.querySelectorAll("button");buttons?.[Math.max(0,Math.min(next,visible.length-1))]?.focus();}
        }}>{p.measuredAt.slice(5,10)}</button>)}
    </Carousel>
    <div className="home-trend-footer"><p aria-live="polite">{delta===undefined?h("firstPoint"):Math.abs(delta)<0.00001?h("flat"):h("delta")+" "+(delta>0?"+":"−")+homeValue(Math.abs(delta),metric,units,locale)}</p>
      <button className="home-link" onClick={()=>go("/reports/"+current.reportId)}>{h("viewPoint")}<ChevronRightIcon /></button></div>
    {points.length>7 && <p className="home-footnote">{h("recentSeven")}</p>}
  </div>;
}
function IconTile({ children, accent }: { children: ReactNode; accent?: string }) {
  return <span className={`icon-tile${accent ? ` ${accent}` : ""}`} aria-hidden="true">{children}</span>;
}
function SectionTitle({ title, sub, action, onClick, icon = <LuClipboardList />, accent }: any) {
  return (
    <div className="section-title">
      <div>
        <h2><IconTile accent={accent}>{icon}</IconTile>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action && <button onClick={onClick}>{action}</button>}
    </div>
  );
}
function InteractiveTrendChart({
  values,
  dates,
  unit,
  units,
  T,
  formatValue,
  onSelect,
}: {
  values: number[];
  dates: string[];
  unit: string;
  units?: Units;
  T: (k: string) => string;
  formatValue?: (v: number) => string;
  onSelect?: (index: number) => void;
}) {
  const gid = useId().replace(/:/g, "");
  const points = values.slice(0, 7);
  const labels = (dates.length ? dates : points.map((_, i) => `08-${String(4 + i).padStart(2, "0")}`)).slice(0, 7);
  const [selected, setSelected] = useState(points.length - 1);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 300;
  const h = 120;
  const padX = 24;
  const padTop = 28;
  const padBottom = 20;
  const chartW = w - padX * 2;
  const chartH = h - padTop - padBottom;
  const coords = points.map((v, i) => {
    const x = padX + (points.length === 1 ? chartW / 2 : (i * chartW) / (points.length - 1));
    const y = padTop + chartH - ((v - min) / (max - min || 1)) * chartH;
    return { x, y, v };
  });
  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = `${padX},${h - padBottom} ${line} ${padX + chartW},${h - padBottom}`;
  const fmt =
    formatValue ||
    ((v: number) =>
      unit === "kg"
        ? convert(`${v} kg`, units || "metric")
        : `${v}${unit === "分" ? T("scoreUnit") : unit}`);
  const selectedPt = coords[selected];
  const choose = (i: number) => {
    setSelected(i);
    onSelect?.(i);
  };
  useEffect(() => {
    onSelect?.(selected);
  }, []);
  return (
    <div className="interactive-trend">
      <div className="trend-tooltip" key={selected} aria-live="polite">
        <strong>{fmt(points[selected])}</strong>
        <span>{labels[selected]}</span>
      </div>
      <svg
        className="trend-plot"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`${T("history")}: ${fmt(points[selected])}`}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={padX + chartW}
            y1={padTop + chartH * t}
            y2={padTop + chartH * t}
            stroke="currentColor"
            opacity="0.12"
            strokeDasharray="3 4"
          />
        ))}
        {selectedPt && (
          <line
            className="trend-guide"
            x1={selectedPt.x}
            x2={selectedPt.x}
            y1={padTop}
            y2={h - padBottom}
          />
        )}
        <polygon points={area} fill={`url(#${gid})`} />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x}
              cy={c.y}
              r={selected === i ? 6 : 4}
              fill="currentColor"
              stroke="var(--surface)"
              strokeWidth="2"
            />
            <circle
              cx={c.x}
              cy={c.y}
              r="14"
              fill="transparent"
              className="trend-hit"
              onClick={() => choose(i)}
            />
          </g>
        ))}
        {selectedPt && (
          <text
            x={Math.min(Math.max(selectedPt.x, 28), w - 28)}
            y={Math.max(selectedPt.y - 12, 14)}
            textAnchor="middle"
            className="trend-value-label"
          >
            {fmt(points[selected])}
          </text>
        )}
      </svg>
      <div className="trend-dates">
        {labels.map((d, i) => (
          <button
            key={`${d}-${i}`}
            type="button"
            aria-pressed={selected === i}
            onClick={() => choose(i)}
          >
            <span>{d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function TrendCard({ data, index, units, T, locale }: any) {
  const [selected, setSelected] = useState(
    Math.max(0, Math.min(6, data.values.length - 1)),
  );
  return (
    <div className="trend-card">
      <div>
        <span
          className={`trend-icon t${index} ${index === 0 ? "accent-cyan" : index === 1 ? "accent-orange" : "accent-emerald"}`}
        >
          {index === 0 ? <LuGauge /> : index === 1 ? <LuFlame /> : <LuDumbbell />}
        </span>
        <div>
          <b>
            {index === 0
              ? T("latest")
              : index === 1
                ? T("bodyFatRate")
                : T("muscleMass")}
          </b>
          <small>{T("trendHint")}</small>
        </div>
      </div>
      <InteractiveTrendChart
        values={data.values}
        dates={data.dates}
        unit={data.unit}
        units={units}
        T={T}
        onSelect={setSelected}
      />
      <p className="trend-comparison">
        {(() => {
          const vals = data.values.slice(0, 7);
          const val = vals[selected];
          const prev = vals[selected - 1];
          if (selected <= 0 || prev == null)
            return (
              {
                zh: "首次记录",
                en: "First record",
                de: "Erste Messung",
                ar: "أول قياس",
              } as Record<string, string>
            )[locale];
          const delta = Math.abs(val - prev);
          const sign = val >= prev ? "+" : "−";
          return `${({ zh: "较上次", en: "Since previous", de: "Seit letzter Messung", ar: "مقارنة بالسابق" } as Record<string, string>)[locale]}: ${
            data.unit === "kg"
              ? convert(`${delta.toFixed(1)} kg`, units)
              : `${delta.toFixed(1)}${data.unit === "分" ? "" : data.unit}`
          } ${sign}`;
        })()}
      </p>
    </div>
  );
}
function HistoryTrendsPage({ T, locale, units, back }: any) {
  const [metric, setMetric] = useState(0);
  const data = trendData[metric];
  const titles = [T("latest"), T("bodyFatRate"), T("muscleMass"), T("weightTrend")];
  return (
    <section className="m60-page history-page">
      <Header title={T("historyTrends")} back={back} />
      <div
        className="segmented history-metric-tabs"
        data-count="4"
        style={
          {
            "--seg-index": metric,
            "--seg-count": 4,
          } as CSSProperties
        }
      >
        {titles.map((label, i) => (
          <button
            key={label}
            type="button"
            className={metric === i ? "active" : ""}
            onClick={() => setMetric(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="home-section history-chart-card">
        <div className="section-title">
          <div>
            <h2>
              <IconTile accent="accent-cyan">
                <LuChartNoAxesCombined />
              </IconTile>
              {titles[metric]}
            </h2>
            <p>{T("historySub")}</p>
          </div>
        </div>
        <InteractiveTrendChart
          values={data.values}
          dates={data.dates}
          unit={data.unit}
          units={units}
          T={T}
        />
      </div>
    </section>
  );
}
function SourceMe({ T, locale, profile, reports, units, go }: any) {
  return (
    <section className="source-page me-page">
      <div className="source-profile">
        <div className="avatar">{profile.nickname[0]}</div>
        <div>
          <h1>{profile.nickname === "New User" ? ({zh:"新用户",en:"New user",de:"Neuer Nutzer",ar:"مستخدم جديد"} as Record<string,string>)[locale] : profile.nickname}</h1>
          <p>138****1792</p>
        </div>
      </div>
      <p className="group-label">{T("measurementReports")}</p>
      <button className="assessment-entry" onClick={() => go("/reports")}>
        <span className="entry-icon">
          <FileTextIcon />
        </span>
        <b>{T("reports")}</b>
        <em>
          {reports.length} {T("recordsCount")} ›
        </em>
        <div>
          <small>{reports[0]?.date}</small>
          <span>{reports[0]?.device}</span>
          <p className="assessment-tags">{(["composition", "posture", "girth"] as ModuleId[]).map(id => <span key={id} data-module={id}>{moduleNames[locale as Locale][id]}</span>)}</p>
        </div>
      </button>
      <p className="group-label">{T("bodyData")}</p>
      <Menu
        icon={<PersonIcon />}
        accent="accent-emerald"
        title={T("bodyProfile")}
        sub={`${convert(`${profile.heightCm} cm`, units)} · ${convert(`${profile.weightKg} kg`, units)} · ${profile.birthday}`}
        onClick={() => go("/profile")}
      />
      <p className="group-label">{T("systemServices")}</p>
      <div className="menu-panel">
        <Menu
          icon={<GearIcon />}
          accent="accent-violet"
          title={T("settings")}
          sub={`${T("language")} · ${T("appearance")} · ${T("units")}`}
          onClick={() => go("/settings")}
        />
        <Menu
          icon={<InfoCircledIcon />}
          accent="accent-orange"
          title={T("help")}
          sub={T("demoDesc")}
          onClick={() => go("/settings")}
        />
      </div>
    </section>
  );
}
function Menu({ icon, title, sub, onClick, accent }: any) {
  return (
    <button className="menu-item" onClick={onClick}>
      <span className={`menu-icon${accent ? ` ${accent}` : ""}`}>{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{sub}</small>
      </span>
      <ChevronRightIcon />
    </button>
  );
}
function Settings({
  T,
  locale,
  setLocale,
  theme,
  setTheme,
  units,
  setUnits,
  go,
  back,
  demo,
  logout,
}: any) {
  return (
    <section className="settings-page">
      <Header title={T("settings")} back={back} />
      <p className="group-label">{T("accountBusiness")}</p>
      <Menu
        icon={<PersonIcon />}
        accent="accent-rose"
        title={T("account")}
        sub={`${T("email")} · ${T("phone")} · ${T("password")}`}
        onClick={demo}
      />
      <Menu
        icon={<ReloadIcon />}
        accent="accent-cyan"
        title={T("store")}
        sub="VISBODY Wellness Center"
        onClick={demo}
      />
      <p className="group-label">{T("preferences")}</p>
      <SettingRow icon={<GlobeIcon />} title={T("language")}>
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="zh">简体中文</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="ar">العربية</option>
        </select>
      </SettingRow>
      <SettingRow
        icon={theme === "dark" ? <MoonIcon /> : <SunIcon />}
        title={T("appearance")}
      >
        <div className="mini-toggle">
          {(["system", "light", "dark"] as Theme[]).map((x) => (
            <button
              key={x}
              className={theme === x ? "active" : ""}
              onClick={() => setTheme(x)}
            >
              {T(x)}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow icon={<BarChartIcon />} title={T("units")}>
        <div className="mini-toggle">
          <button
            className={units === "metric" ? "active" : ""}
            onClick={() => setUnits("metric")}
          >
            {T("metric")}
          </button>
          <button
            className={units === "imperial" ? "active" : ""}
            onClick={() => setUnits("imperial")}
          >
            {T("imperial")}
          </button>
        </div>
      </SettingRow>
      <p className="group-label">{T("support")}</p>
      <Menu
        icon={<InfoCircledIcon />}
        accent="accent-violet"
        title={T("faq")}
        sub={T("demoDesc")}
        onClick={demo}
      />
      <Menu
        icon={<Link2Icon />}
        accent="accent-orange"
        title={T("about")}
        sub="VISBODY WellnessHub · v1.0.0"
        onClick={demo}
      />
      <button className="logout-btn" onClick={logout}>
        {T("logout")}
      </button>
    </section>
  );
}
function SettingRow({ icon, title, children }: any) {
  return (
    <div className="setting-row">
      <span className="menu-icon">{icon}</span>
      <b>{title}</b>
      <div>{children}</div>
    </div>
  );
}
function Reports({ reports, T, go, back, del, locale }: any) {
  return (
    <section className="product-page reports-page">
      <Header title={T("reports")} back={back} />
      {reports.length ? (
        reports.map((r: Report) => (
          <SwipeReportRow
            key={r.id}
            report={r}
            locale={locale}
            T={T}
            onOpen={() => go(`/reports/${r.id}`)}
            onDelete={() => del(r.id)}
          />
        ))
      ) : (
        <div className="empty">
          <FileTextIcon />
          <p>{T("noReports")}</p>
        </div>
      )}
    </section>
  );
}

function SwipeReportRow({
  report: r,
  locale,
  T,
  onOpen,
  onDelete,
}: {
  report: Report;
  locale: Locale;
  T: (k: string) => string;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const ACTION_WIDTH = 72;
  const [offset, setOffset] = useState(0);
  const openRef = useRef(false);
  const dragMoved = useRef(false);
  const bind = useDrag(
    ({ movement: [mx], last, cancel, axis, memo }) => {
      if (axis === "y") {
        cancel();
        return memo;
      }
      const start = typeof memo === "number" ? memo : openRef.current ? -ACTION_WIDTH : 0;
      const next = Math.min(0, Math.max(-ACTION_WIDTH, start + mx));
      if (Math.abs(mx) > 6) dragMoved.current = true;
      setOffset(next);
      if (last) {
        const shouldOpen = next < -ACTION_WIDTH * 0.45;
        openRef.current = shouldOpen;
        setOffset(shouldOpen ? -ACTION_WIDTH : 0);
        window.setTimeout(() => {
          dragMoved.current = false;
        }, 0);
      }
      return start;
    },
    {
      axis: "x",
      filterTaps: true,
      threshold: 8,
      pointer: { touch: true },
    },
  );
  return (
    <div className="report-swipe-row">
      <div className="report-swipe-actions">
        <button
          type="button"
          className="report-swipe-delete"
          onClick={onDelete}
        >
          <TrashIcon />
          {T("delete")}
        </button>
      </div>
      <article
        className={`report-row report-swipe-front${openRef.current || offset < -8 ? " is-dragging" : ""}`}
        style={{
          transform: `translateX(${offset}px)${offset < -8 ? " scale(0.99)" : ""}`,
        }}
        {...bind()}
      >
        <button
          className="report-main"
          onClick={() => {
            if (dragMoved.current || openRef.current) {
              openRef.current = false;
              setOffset(0);
              return;
            }
            onOpen();
          }}
        >
          <div className="report-score">{r.score}</div>
          <div>
            <strong>{r.date}</strong>
            <small>{r.device}</small>
            <p>
              {r.modules
                .slice(0, 3)
                .map((m) => moduleNames[locale as Locale][m.id])
                .join(" · ")}
            </p>
          </div>
          <ChevronRightIcon />
        </button>
      </article>
    </div>
  );
}

function M60Report({
  report,
  profile,
  locale,
  units,
  active,
  setActive,
  T,
  back,
  share,
  email,
  go,
  readOnly,
}: any) {
  const requestedModule = parseRoute().type;
  const [profileVisible, setProfileVisible] = useState(false);
  const moduleCarouselRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const m = requestedModule as ModuleId;
    if (modules.some((x) => x.id === m)) setActive(m);
  }, [requestedModule]);
  useEffect(() => {
    const root = moduleCarouselRef.current;
    if (!root) return;
    const btn = root.querySelector("button.active") as HTMLElement | null;
    btn?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);
  const mod: ReportModule =
    report.modules.find((x: ReportModule) => x.id === active) ||
    report.modules[0];
  const age = profile ? calcAge(profile.birthday) : 0;
  if (!mod) return <section className="m60-page"><Header title={homeText(locale,"reportTitle")} back={back} /><div className="home-empty"><p>{homeText(locale,"missing")}</p></div></section>;
  return (
    <section className={`m60-page${readOnly ? "" : " has-ai-dock"}`}>
      <Header
        title={
          {
            zh: "测量报告",
            en: "Assessment report",
            de: "Messbericht",
            ar: "تقرير القياس",
          }[locale as Locale]
        }
        back={back}
        actions={
          <>
            {!readOnly && (
              <button
                className="icon-btn"
                onClick={email}
                aria-label={T("sendTitle")}
              >
                <EnvelopeClosedIcon />
              </button>
            )}
            <button
              className="icon-btn"
              onClick={share}
              aria-label={T("share")}
            >
              <Share2Icon />
            </button>
          </>
        }
      />
      {readOnly && (
        <div className="readonly">
          <Link2Icon />
          {T("readOnly")}
        </div>
      )}
      <div className="m60-user">
        <div className="m60-user-top">
          <dl>
            <div>
              <dt>{T("measuredAt")}</dt>
              <dd>{report.date}</dd>
            </div>
            <div>
              <dt>{T("reportUpdatedAt")}</dt>
              <dd>
                {report.updatedAt ||
                  report.date.replace(/\d{2}:\d{2}:\d{2}/, "11:21:11")}
              </dd>
            </div>
          </dl>
          {profile && (
            <button
              type="button"
              className="icon-btn profile-toggle"
              onClick={() => setProfileVisible((v) => !v)}
              aria-label={
                profileVisible ? T("hideProfile") : T("showProfile")
              }
              aria-pressed={profileVisible}
              aria-expanded={profileVisible}
            >
              {profileVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          )}
        </div>
        {profile && (
          <div
            className={`m60-user-profile-wrap${profileVisible ? " is-open" : ""}`}
          >
            <div className="m60-user-profile" aria-hidden={!profileVisible}>
              <span>
                <small>{T("nickname")}</small>
                <b>
                  {profile.nickname === "New User"
                    ? (
                        {
                          zh: "新用户",
                          en: "New user",
                          de: "Neuer Nutzer",
                          ar: "مستخدم جديد",
                        } as Record<string, string>
                      )[locale]
                    : profile.nickname}
                </b>
              </span>
              <span>
                <small>{T("height")}</small>
                <b>{convert(`${profile.heightCm} cm`, units)}</b>
              </span>
              <span>
                <small>{T("age")}</small>
                <b>
                  {age} {T("age")}
                </b>
              </span>
              <span>
                <small>{T("weight")}</small>
                <b>{convert(`${profile.weightKg} kg`, units)}</b>
              </span>
            </div>
          </div>
        )}
      </div>
      <div ref={moduleCarouselRef}>
        <Carousel className="module-carousel" contentClassName="module-track">
          {report.modules.map((x: ReportModule) => (
            <button
              key={x.id}
              type="button"
              className={x.id === active ? "active" : ""}
              onClick={() => setActive(x.id)}
            >
              {moduleNames[locale as Locale][x.id]}
            </button>
          ))}
        </Carousel>
      </div>
      <div key={mod.id} className="m60-module-body">
      <div className="m60-heading">
        <span>
          {mod.status === "good"
            ? T("normalExcellent")
            : mod.status === "risk"
              ? T("attention")
              : T("mediumRisk")}
        </span>
        <h1>{moduleNames[locale as Locale][mod.id as ModuleId]}</h1>
        <strong>
          {mod.score}
          <small>{T("scoreUnit")}</small>
        </strong>
      </div>
      <ModuleVisual id={mod.id} T={T} locale={locale} />
      <MetricSection mod={mod} units={units} locale={locale} T={T} />
      <div className="m60-copy">
        <h2>{T("summary")}</h2>
        <p>
          {locale === "zh"
            ? mod.finding
            : `${moduleNames[locale as Locale][mod.id]} · ${T("attention")}`}
        </p>
      </div>
      <div className="m60-copy advice">
        <h2>{T("actions")}</h2>
        <p>{locale === "zh" ? mod.advice : T("trainingSub")}</p>
      </div>
      </div>
      {!readOnly && go && (
        <div className="report-ai-dock">
          <button
            type="button"
            className="report-ai-btn"
            onClick={() => go(`/reports/${report.id}/ai`)}
          >
            <FileTextIcon />
            {T("ai")}
          </button>
        </div>
      )}
    </section>
  );
}
function MetricSection({ mod, units, locale, T }: any) {
  const valueCopy: Record<string, Record<string,string>> = {
    "优秀":{en:"Excellent",de:"Sehr gut",ar:"ممتاز"}, "较差":{en:"Poor",de:"Schwach",ar:"ضعيف"},
    "梨形臀":{en:"Pear-shaped",de:"Birnenförmig",ar:"شكل كمثري"},
    "中度异常":{en:"Moderate deviation",de:"Mittlere Abweichung",ar:"انحراف متوسط"},
    "胸椎":{en:"Thoracic spine",de:"Brustwirbelsäule",ar:"الفقرات الصدرية"}
  };
  const metric = (x: Metric, index: number) => ({
    ...x,
    value: locale === "zh" ? x.value : valueCopy[x.value]?.[locale] || x.value.replace("分",T("scoreUnit")),
    label: metricLabels[locale as Locale][mod.id as ModuleId][index] || x.label,
  });
  if (mod.id === "composition")
    return (
      <>
        <ReportSubhead title={moduleNames[locale as Locale].composition} />
        <div className="m60-metrics two">
          {mod.metrics.slice(0, 5).map((x: Metric, i: number) => (
            <MetricCard key={x.label} x={metric(x, i)} units={units} T={T} />
          ))}
        </div>
        <ReportSubhead title={T("summary")} />
        <div className="range-stack">
          {mod.metrics.slice(5).map((x: Metric, i: number) => (
            <RangeMetric
              key={x.label}
              x={metric(x, i + 5)}
              value={[92, 74, 88][i]}
              T={T}
            />
          ))}
        </div>
        <ReportSubhead title={T("viewDetails")} />
        <SegmentBody T={T} />
        <ReportSubhead title={T("history")} />
        <MiniHistory T={T} />
      </>
    );
  if (mod.id === "posture")
    return (
      <>
        <ReportSubhead title={T("viewDetails")} />
        <div className="posture-list">
          {mod.metrics.map((x: Metric, i: number) => (
            <PostureItem key={x.label} x={metric(x, i)} index={i} T={T} />
          ))}
        </div>
      </>
    );
  if (mod.id === "neck")
    return (
      <>
        <ReportSubhead title={T("latest")} />
        <div className="neck-grid">
          {mod.metrics.map((x: Metric, i: number) => (
            <NeckCard key={x.label} x={metric(x, i)} index={i} T={T} />
          ))}
        </div>
      </>
    );
  if (mod.id === "hip")
    return (
      <>
        <ReportSubhead title={moduleNames[locale as Locale].hip} />
        <HipTypes T={T} locale={locale} />
        <div className="m60-metrics two">
          {mod.metrics.map((x: Metric, i: number) => (
            <MetricCard key={x.label} x={metric(x, i)} units={units} T={T} />
          ))}
        </div>
      </>
    );
  if (mod.id === "spine")
    return (
      <>
        <SpineScore T={T} />
        <ReportSubhead title={T("risks")} />
        <div className="risk-bar">
          <b>{moduleNames[locale as Locale].spine}</b>
          <strong>
            17
            <small>
              {T("scoreUnit")} · {T("mediumRisk")}
            </small>
          </strong>
          <span />
        </div>
      </>
    );
  return (
    <div className="m60-metrics two">
      {mod.metrics.map((x: Metric, i: number) => (
        <MetricCard key={x.label} x={metric(x, i)} units={units} T={T} />
      ))}
    </div>
  );
}
function ReportSubhead({ title }: any) {
  return <h2 className="report-subhead">{title}</h2>;
}
function MetricCard({ x, units, T }: any) {
  return (
    <div className="m60-metric">
      <small>{x.label}</small>
      <strong className={x.tone || ""}>{convert(x.value, units)}</strong>
      <span>
        {x.tone === "risk" ? T?.("attention") : T?.("normalExcellent")}
      </span>
    </div>
  );
}
function RangeMetric({ x, value, T }: any) {
  return (
    <div className="range-metric">
      <div>
        <b>{x.label}</b>
        <strong className={x.tone || ""}>{x.value}</strong>
      </div>
      <div className="range-labels">
        <span>{T?.("attention")}</span>
        <span>{T?.("normalExcellent")}</span>
        <span>{T?.("attention")}</span>
      </div>
      <div className="range-track">
        <i style={{ left: `${value}%` }} />
      </div>
    </div>
  );
}
function ModuleVisual({
  id,
  T,
  locale,
}: {
  id: ModuleId;
  T: (key: string) => string;
  locale: Locale;
}) {
  if (id === "posture")
    return (
      <div className="grid-stage">
        <img src="/assets/h5-source/body-model.png" />
        <span className="axis vertical" />
        <span className="axis horizontal" />
      </div>
    );
  if (id === "balance")
    return (
      <div className="balance-visual">
        <strong>
          63<small>{T("scoreUnit")}</small>
        </strong>
        <p>{T("mediumRisk")}</p>
        <div className="balance-axis">
          <i />
        </div>
      </div>
    );
  if (id === "neck")
    return (
      <div className="neck-hero">
        <img src="/assets/m60/shape/headForward-2.png" />
        <span>{moduleNames[locale].neck}</span>
      </div>
    );
  if (id === "hip")
    return (
      <div className="hip-hero">
        <img src="/assets/m60/posture/posture8.png" />
        <b>{moduleNames[locale].hip}</b>
      </div>
    );
  if (id === "spine")
    return (
      <div className="spine-hero">
        <ModelCanvas />
        <div className="spine-line" />
        <span>C7</span>
        <span>G</span>
        <span>S1</span>
      </div>
    );
  if (id === "girth")
    return (
      <div className="girth-hero">
        <ModelCanvas />
        <i />
        <i />
        <i />
        <i />
      </div>
    );
  return (
    <div className="composition-hero">
      <ModelCanvas />
      <div>
        <b>47</b>
        <span>{moduleNames[locale].composition}</span>
      </div>
    </div>
  );
}
function SegmentBody({ T }: any) {
  return (
    <div className="segment-body">
      <div>
        <MetricCard
          x={{ label: T("leftArm"), value: "2.30 kg", tone: "risk" }}
          units="metric"
          T={T}
        />
        <MetricCard
          x={{ label: T("leftLeg"), value: "4.00 kg", tone: "risk" }}
          units="metric"
          T={T}
        />
      </div>
      <img src="/assets/m60/common/body-dark.png" />
      <div>
        <MetricCard
          x={{ label: T("rightArm"), value: "2.10 kg", tone: "risk" }}
          units="metric"
          T={T}
        />
        <MetricCard
          x={{ label: T("rightLeg"), value: "4.10 kg", tone: "risk" }}
          units="metric"
          T={T}
        />
      </div>
    </div>
  );
}
function MiniHistory({ T }: any) {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: T("bodyFatRate"), data: trendData[1] },
    { label: T("weightTrend"), data: trendData[3] },
    { label: T("muscleMass"), data: trendData[2] },
  ];
  const active = tabs[tab] || tabs[0];
  return (
    <div className="history-chart">
      <div className="chart-tabs">
        {tabs.map((x, i) => (
          <button
            key={x.label}
            type="button"
            className={tab === i ? "active" : ""}
            onClick={() => setTab(i)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <InteractiveTrendChart
        values={active.data.values}
        dates={active.data.dates}
        unit={active.data.unit}
        T={T}
      />
    </div>
  );
}
function PostureItem({ x, index, T }: any) {
  const pics = [
    "headForward-2.png",
    "headSlant-3.png",
    "roundShoulderLeft-2.png",
    "roundShoulderRight-2.png",
    "shoulderHeightAsymmetry-3.png",
    "pelvisForwardBackward-1.png",
  ];
  return (
    <article className="posture-item">
      <div>
        <h3>{x.label}</h3>
        <strong>{x.value}</strong>
      </div>
      <p>{T("trainingSub")}</p>
      <div>
        <img src={`/assets/m60/shape/${pics[index]}`} />
        <img src={`/assets/m60/shape/${pics[Math.max(0, index - 1)]}`} />
      </div>
      <div className="status-spectrum">
        <span>{T("normal")}</span>
        <span>{T("mediumRisk")}</span>
        <span>{T("abnormal")}</span>
      </div>
    </article>
  );
}
function NeckCard({ x, index, T }: any) {
  return (
    <div className="neck-card">
      <div>
        <small>{x.label}</small>
        <strong>{x.value}</strong>
        <em>{T("limited")}</em>
      </div>
      <img
        src={`/assets/m60/shape/${index % 2 ? "headSlant-3.png" : "headForward-2.png"}`}
      />
      <div className="neck-scale">
        <span />
        <i style={{ left: `${22 + index * 9}%` }} />
      </div>
      <footer>
        <span>{T("limited")}</span>
        <span>{T("normal")}</span>
        <span>{T("abnormal")}</span>
      </footer>
    </div>
  );
}
function HipTypes({ T, locale }: any) {
  return (
    <div className="hip-types">
      {(locale === "zh"
        ? ["方形臀", "梨形臀", "倒三角形臀", "圆形臀", "蜜桃臀"]
        : [1, 2, 3, 4, 5].map(
            (n) => `${moduleNames[locale as Locale].hip} ${n}`,
          )
      ).map((x, i) => (
        <div className={i === 1 ? "active" : ""} key={x}>
          <img src="/assets/m60/posture/posture8.png" />
          <b>{x}</b>
          <p>{i === 1 ? T("attention") : T("viewDetails")}</p>
        </div>
      ))}
    </div>
  );
}
function SpineScore({ T }: any) {
  return (
    <div className="spine-score">
      <div className="score-donut">
        <strong>
          16<small>{T("scoreUnit")}</small>
        </strong>
        <span>{T("mediumRisk")}</span>
      </div>
      <div>
        <small>{T("assessmentConclusion")}</small>
        <p>{T("trainingSub")}</p>
      </div>
    </div>
  );
}
function AIPage({ report, T, locale, back, share, readOnly, homeContent }: any) {
  const copy: Record<
    Locale,
    { summary: string; risks: string[]; strengths: string[]; actions: string[] }
  > = {
    zh: {
      summary: report.summary,
      risks: [
        "体脂率与内脏脂肪等级偏高",
        "颈椎六项活动度均受限",
        "胸椎结构异常需专业筛查",
      ],
      strengths: [
        "感官系统平衡评价优秀",
        "上下肢围度整体较为对称",
        "近期综合评分持续提升",
      ],
      actions: [
        "每周 3 次渐进式抗阻训练",
        "每天进行颈肩与胸椎灵活性练习",
        "4 周后使用同一设备复测",
      ],
    },
    en: {
      summary:
        "Overall posture is manageable, while metabolic risk and lower-limb stability need priority attention.",
      risks: [
        "Body fat and visceral fat are above the recommended range",
        "Neck mobility is limited in all six directions",
        "Thoracic structure requires professional screening",
      ],
      strengths: [
        "Sensory balance is strong",
        "Limb girths are broadly symmetrical",
        "The overall score is improving",
      ],
      actions: [
        "Complete progressive resistance training three times a week",
        "Practice neck, shoulder and thoracic mobility daily",
        "Repeat the assessment on the same device in four weeks",
      ],
    },
    de: {
      summary:
        "Die Haltung ist insgesamt kontrollierbar; Stoffwechselrisiko und Beinstabilität brauchen Priorität.",
      risks: [
        "Körperfett und Viszeralfett liegen über dem Zielbereich",
        "Die Nackenbeweglichkeit ist in allen Richtungen eingeschränkt",
        "Die Brustwirbelsäule sollte fachlich untersucht werden",
      ],
      strengths: [
        "Die sensorische Balance ist gut",
        "Die Umfangswerte sind weitgehend symmetrisch",
        "Der Gesamtwert verbessert sich",
      ],
      actions: [
        "Dreimal pro Woche progressives Krafttraining",
        "Täglich Mobilität für Nacken, Schultern und Brustwirbelsäule",
        "In vier Wochen mit demselben Gerät erneut messen",
      ],
    },
    ar: {
      summary:
        "القوام مستقر إجمالاً، مع ضرورة إعطاء الأولوية لمخاطر الأيض وثبات الأطراف السفلية.",
      risks: [
        "الدهون الكلية والحشوية أعلى من النطاق الموصى به",
        "حركة الرقبة محدودة في الاتجاهات الستة",
        "تحتاج بنية الفقرات الصدرية إلى فحص متخصص",
      ],
      strengths: [
        "التوازن الحسي جيد",
        "محيطات الأطراف متقاربة",
        "النتيجة العامة تتحسن",
      ],
      actions: [
        "تدريب مقاومة تدريجي ثلاث مرات أسبوعياً",
        "تمارين يومية لحركة الرقبة والكتفين والصدر",
        "إعادة القياس على الجهاز نفسه بعد أربعة أسابيع",
      ],
    },
  };
  const c = homeContent || copy[locale as Locale];
  return (
    <section className="m60-page">
      <Header
        title={T("ai")}
        back={back}
        actions={
          <button className="icon-btn" onClick={share} aria-label={T("share")}>
            <Share2Icon />
          </button>
        }
      />
      {readOnly && (
        <div className="readonly">
          <Link2Icon />
          {T("readOnly")}
        </div>
      )}
      <div className="ai-hero">
        <span>{T("ai")}</span>
        <h1>
          {report.score}
          <small>/100</small>
        </h1>
        <p>{c.summary}</p>
      </div>
      <Analysis title={T("risks")} tone="risk" items={c.risks} />
      <Analysis title={T("strengths")} tone="good" items={c.strengths} />
      <Analysis title={T("actions")} tone="action" items={c.actions} />
      <p className="disclaimer">
        <InfoCircledIcon />
        {T("disclaimer")}
      </p>
    </section>
  );
}
function Analysis({ title, tone, items }: any) {
  return (
    <section className={`analysis ${tone}`}>
      <h2><IconTile>{tone === "risk" ? <InfoCircledIcon /> : tone === "good" ? <LuSparkles /> : <LuClipboardList />}</IconTile>{title}</h2>
      {items.map((x: string, i: number) => (
        <div key={x}>
          <span>{i + 1}</span>
          <p>{x}</p>
        </div>
      ))}
    </section>
  );
}
function TrainingOutline({ T, locale, go, back, share, readOnly, homeContent }: any) {
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState(0);
  const [planTab, setPlanTab] = useState<"train" | "diet">("train");
  const o: (typeof outlineByLocale)[Locale] = homeContent || outlineByLocale[locale as Locale] || outlineByLocale.zh;
  const dayKind =
    locale === "zh"
      ? ["训练", "恢复", "训练", "恢复", "训练", "恢复", "恢复"]
      : locale === "de"
        ? ["Training", "Erholung", "Training", "Erholung", "Training", "Erholung", "Erholung"]
        : locale === "ar"
          ? ["تدريب", "استشفاء", "تدريب", "استشفاء", "تدريب", "استشفاء", "استشفاء"]
          : ["Train", "Recovery", "Train", "Recovery", "Train", "Recovery", "Recovery"];
  return (
    <section className="fx-detail training-page">
      <Header
        title={T("training")}
        back={back}
        actions={
          <button className="icon-btn" onClick={share} aria-label={T("share")}>
            <Share2Icon />
          </button>
        }
      />
      {readOnly && (
        <div className="readonly">
          <Link2Icon />
          {T("readOnly")}
        </div>
      )}
      <div className="training-v2">
        <div className="training-v2-hero">
          <div className="eyebrow">WELLNESSHUB · {T("training")}</div>
          <h1>{o.title}</h1>
          <p>{o.heroDesc}</p>
          <span className="status-pill">{o.status}</span>
          <div className="training-v2-metrics">
            {o.metrics.map((m) => (
              <div key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <article className="training-v2-panel">
          <h2>
            <IconTile accent="accent-emerald">
              <TargetIcon />
            </IconTile>
            {T("targets")}
          </h2>
          {o.goals.map((g) => (
            <div key={g.name} className={`training-v2-goal ${g.tone}`}>
              <div className="training-v2-goal-top">
                <b>{g.name}</b>
                <span className={`training-v2-tag ${g.tone}`}>{g.tag}</span>
              </div>
              <p>{g.desc}</p>
            </div>
          ))}
        </article>

        <article className="training-v2-panel">
          <h2>
            <IconTile accent="accent-violet">
              <LuClipboardList />
            </IconTile>
            {T("phases")}
          </h2>
          <div className="training-v2-phases">
            {o.phases.map((p) => (
              <div key={p.name} className="training-v2-phase">
                <div className="training-v2-phase-top">
                  <b>
                    <span className="training-v2-week-chip">{p.weeks}</span>
                    {p.name}
                  </b>
                  {p.tag ? (
                    <span className={`training-v2-tag ${p.tag}`}>{T("phases")}</span>
                  ) : null}
                </div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="training-v2-panel">
          <h2>
            <IconTile accent="accent-orange">
              <LuFlame />
            </IconTile>
            {T("dietPlan")}
          </h2>
          <div className="training-v2-diet-hero">
            <h3>{o.dietHeroTitle}</h3>
            <p>
              {o.dietHeroDesc}{" "}
              <strong>
                {o.nutritionKcal}
                {locale === "zh" ? " 千卡" : locale === "de" ? " kcal" : " kcal"}
              </strong>
              {locale === "zh"
                ? "，结合体态优化与血糖稳定需求做结构化营养设计。"
                : locale === "de"
                  ? " — strukturiert für Haltung und stabile Glukose."
                  : locale === "ar"
                    ? " — منظّم للوضعية واستقرار الجلوكоз."
                    : " — structured for posture and glucose stability."}
            </p>
          </div>
          {o.nutrients.map((n) => (
            <div key={n.name} className="training-v2-nutrient">
              <div className="training-v2-nutrient-top">
                <b>{n.name}</b>
                <span>{n.target}</span>
              </div>
              <div className="training-v2-bar">
                <i style={{ width: `${n.pct}%` }} />
              </div>
              <small>{n.tip}</small>
            </div>
          ))}
        </article>

        <article className="training-v2-panel">
          <h2>
            <IconTile accent="accent-cyan">
              <LuDumbbell />
            </IconTile>
            {T("weekly")}
          </h2>
          <p className="execution-intro">{o.execIntro}</p>
          <div className="training-v2-weeks">
            {o.weeks.map((w, i) => (
              <button
                key={w.label}
                type="button"
                className={`training-v2-week${week === i ? " active" : ""}`}
                onClick={() => setWeek(i)}
              >
                <b>{w.label}</b>
                <small>{w.status}</small>
              </button>
            ))}
          </div>
          <div className="training-v2-review">
            <div>
              <span className="training-v2-tag">{T("weeklyFocus")}</span>
              <h3>{o.weeks[week].focus}</h3>
              <p>{o.review}</p>
            </div>
            <div className="strategy-tags">
              {o.strategyTags.map((t) => (
                <span key={t} className="training-v2-tag cyan">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="training-v2-day-nav">
            {o.days.map((d, i) => (
              <button
                key={d}
                type="button"
                className={`training-v2-day${day === i ? " active" : ""}`}
                onClick={() => setDay(i)}
              >
                <strong>{d}</strong>
                <small>{dayKind[i]}</small>
              </button>
            ))}
          </div>
          <div className="training-v2-plan-tabs">
            <button
              type="button"
              className={planTab === "train" ? "active" : ""}
              onClick={() => setPlanTab("train")}
            >
              {T("trainingPlan")}
            </button>
            <button
              type="button"
              className={`diet${planTab === "diet" ? " active" : ""}`}
              onClick={() => setPlanTab("diet")}
            >
              {T("dietPlan")}
            </button>
          </div>
          {planTab === "train" ? (
            <div className="training-v2-exercise-grid">
              {o.exercises.map((ex, i) => (
                <div key={ex.name} className="training-v2-exercise">
                  <span className="ex-icon">{i + 1}</span>
                  <div>
                    <h4>{ex.name}</h4>
                    <p>{ex.tip}</p>
                    <div className="rx">{ex.rx}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {o.meals.map((m) => (
                <div key={m.time} className="training-v2-meal">
                  <span className="meal-time">{m.time}</span>
                  <strong>{m.name}</strong>
                  <p>{m.tip}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        {!readOnly && (
          <button
            className="training-v2-cta"
            onClick={() => go("/reports/m60-20260810/plan")}
          >
            {T("trainingPlan")}
            <ChevronRightIcon />
          </button>
        )}
        <p className="disclaimer">
          <InfoCircledIcon />
          {T("disclaimer")}
        </p>
      </div>
    </section>
  );
}
function TrainingPlan({ T, locale, back }: any) {
  const [done, setDone] = useState<string[]>(() => saved(K.training, [])),
    [tab, setTab] = useState("train");
  const toggle = (id: string) => {
    const n = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(n);
    localStorage.setItem(K.training, JSON.stringify(n));
  };
  return (
    <section className="fx-detail">
      <Header title={T("trainingPlan")} back={back} />
      <div className="training-banner">
        <span>{T("week").replace("{n}", "3")}</span>
        <h1>{T("trainingPlan")}</h1>
        <p>
          {T("executionProgress")}{" "}
          {Math.round((done.length / planTasks.length) * 100)}%
        </p>
        <div className="progress">
          <i style={{ width: `${(done.length / planTasks.length) * 100}%` }} />
        </div>
      </div>
      <div
        className="segmented"
        data-count="3"
        style={
          {
            "--seg-index": tab === "train" ? 0 : tab === "diet" ? 1 : 2,
            "--seg-count": 3,
          } as CSSProperties
        }
      >
        <button
          className={tab === "train" ? "active" : ""}
          onClick={() => setTab("train")}
        >
          {T("trainingPlan")}
        </button>
        <button
          className={tab === "diet" ? "active" : ""}
          onClick={() => setTab("diet")}
        >
          {T("dietPlan")}
        </button>
        <button
          className={tab === "review" ? "active" : ""}
          onClick={() => setTab("review")}
        >
          {T("review")}
        </button>
      </div>
      {tab === "train" ? (
        <div className="task-list">
          {planTasks.map((x) => (
            <button
              key={x.id}
              onClick={() => toggle(x.id)}
              className={done.includes(x.id) ? "done" : ""}
            >
              <span>
                <b>
                  {locale === "zh"
                    ? x.name
                    : `${T("training")} ${planTasks.indexOf(x) + 1}`}
                </b>
                <small>
                  {locale === "zh"
                    ? `${x.sets} · ${x.duration}`
                    : T("weeklyAdvice")}
                </small>
              </span>
              <em>{done.includes(x.id) ? T("completed") : T("pending")}</em>
            </button>
          ))}
        </div>
      ) : tab === "diet" ? (
        <div className="plan-copy">
          <h3>{T("dietPlan")}</h3>
          <p>{T("weeklyAdvice")}</p>
        </div>
      ) : (
        <div className="plan-copy">
          <h3>{T("review")}</h3>
          <p>{T("weeklyAdvice")}</p>
        </div>
      )}
    </section>
  );
}
