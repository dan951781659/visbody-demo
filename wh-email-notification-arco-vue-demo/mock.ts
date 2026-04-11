export type NotificationType = '运营活动通知' | '重大升级通知' | '服务公告';
export type NotificationStatus = '草稿' | '发送中' | '部分失败' | '已完成';
export type AudienceMode = 'all' | 'selected';

export interface StoreOption {
  id: string;
  name: string;
  recipients: number;
  suppressed: number;
}

export interface NotificationFailure {
  email: string;
  reason: string;
}

export interface NotificationLog {
  time: string;
  text: string;
}

export interface NotificationMetrics {
  platform: number;
  external: number;
  invalid: number;
  duplicates: number;
  suppressed: number;
  final: number;
  delivered: number;
  failed: number;
}

export interface NotificationTask {
  id: string;
  name: string;
  type: NotificationType;
  status: NotificationStatus;
  audienceMode: AudienceMode;
  selectedStores: string[];
  externalEmails: string[];
  subject: string;
  preheader: string;
  body: string;
  cta: string;
  link: string;
  updatedAt: string;
  testPassed: boolean;
  metrics: NotificationMetrics;
  failures: NotificationFailure[];
  logs: NotificationLog[];
}

export const stores: StoreOption[] = [
  { id: 'sg', name: '新加坡旗舰店', recipients: 186, suppressed: 3 },
  { id: 'syd', name: '悉尼 City Hub', recipients: 174, suppressed: 2 },
  { id: 'dubai', name: '迪拜 Mall Branch', recipients: 132, suppressed: 1 },
  { id: 'la', name: '洛杉矶 West Studio', recipients: 208, suppressed: 4 },
  { id: 'london', name: '伦敦 Central Lab', recipients: 241, suppressed: 4 },
  { id: 'toronto', name: '多伦多 North Point', recipients: 248, suppressed: 3 },
];

export const sampleExternalEmails = [
  'ops-partner@wellnesshub.global',
  'owner-demo@partnerstudio.com',
  'owner-demo@partnerstudio.com',
  'launch-guest@fitalliance.io',
  'invalid-email',
];

export const notificationTasks: NotificationTask[] = [
  {
    id: 'task-001',
    name: '春季活动首发通知',
    type: '运营活动通知',
    status: '部分失败',
    audienceMode: 'all',
    selectedStores: stores.map((item) => item.id),
    externalEmails: ['ops-partner@wellnesshub.global', 'launch-guest@fitalliance.io'],
    subject: 'WellnessHub 春季运营活动已上线，门店专属权益本周可领取',
    preheader: '已覆盖全部活跃门店与渠道邮箱，包含活动入口与权益说明。',
    body: '为了帮助门店提升春季获客转化，平台现已开放活动中心与物料支持包。完成报名后，可在后台查看门店参与条件、奖励规则与执行指南。',
    cta: '进入活动中心',
    link: 'https://wellnesshub.visbody.com/operations/campaign-center',
    updatedAt: '2026-04-11 14:30:00',
    testPassed: true,
    metrics: { platform: 1189, external: 2, invalid: 0, duplicates: 0, suppressed: 29, final: 1162, delivered: 1148, failed: 14 },
    failures: [
      { email: 'owner@weststudio.co', reason: 'Mailbox full，建议 6 小时后重试。' },
      { email: 'marketing@fitalliance.io', reason: 'Remote server temporary rejected，当前位于重试池。' },
      { email: 'hello@partnerstudio.com', reason: 'Domain throttled，需要稍后重试。' },
    ],
    logs: [
      { time: '2026-04-11 13:40:12', text: '测试邮件已发送到 8 个测试邮箱。' },
      { time: '2026-04-11 14:30:00', text: '正式任务开始发送，队列已提交第三方发信服务。' },
      { time: '2026-04-11 14:41:05', text: '检测到 14 个地址发送失败，状态更新为部分失败。' },
    ],
  },
  {
    id: 'task-002',
    name: '北美维护升级通知',
    type: '重大升级通知',
    status: '已完成',
    audienceMode: 'selected',
    selectedStores: ['la', 'toronto'],
    externalEmails: [],
    subject: 'WellnessHub 北美区维护升级通知',
    preheader: '维护窗口、影响范围与恢复时间已同步。',
    body: '平台将在北美时区周日晚执行系统升级，期间报告查看与活动中心入口可能短暂不可用。维护结束后会自动恢复，门店无需手动处理。',
    cta: '查看维护说明',
    link: 'https://wellnesshub.visbody.com/operations/maintenance',
    updatedAt: '2026-04-10 09:00:00',
    testPassed: true,
    metrics: { platform: 456, external: 0, invalid: 0, duplicates: 0, suppressed: 7, final: 449, delivered: 449, failed: 0 },
    failures: [],
    logs: [
      { time: '2026-04-09 18:02:16', text: '测试邮件通过，内容与链接校验正常。' },
      { time: '2026-04-10 09:00:00', text: '正式发送完成，449 个地址全部送达。' },
    ],
  },
  {
    id: 'task-003',
    name: '新门店 onboarding 资料包',
    type: '服务公告',
    status: '草稿',
    audienceMode: 'selected',
    selectedStores: ['sg', 'dubai'],
    externalEmails: ['bd@newpartner.io'],
    subject: 'WellnessHub 新门店资料包已准备完成',
    preheader: '包含后台入口、初始配置与上线检查清单。',
    body: '欢迎加入 WellnessHub。资料包中已包含后台操作入口、门店配置清单、活动中心开启步骤和客服对接方式，便于门店快速开始使用。',
    cta: '',
    link: '',
    updatedAt: '2026-04-11 11:10:00',
    testPassed: false,
    metrics: { platform: 318, external: 1, invalid: 0, duplicates: 0, suppressed: 4, final: 315, delivered: 0, failed: 0 },
    failures: [],
    logs: [{ time: '2026-04-11 11:10:00', text: '草稿已创建，等待测试发送。' }],
  },
];
