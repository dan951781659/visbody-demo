<template>
  <div class="mail-page">
    <a-page-header :show-back="isCompose" @back="goList">
      <template #title>
        {{ isCompose ? '新建邮件' : '邮件通知管理' }}
      </template>
      <template #extra>
        <a-space>
          <a-button v-if="isCompose" @click="goList">返回列表</a-button>
          <a-button v-else type="primary" @click="createNotification">新建邮件</a-button>
        </a-space>
      </template>
    </a-page-header>

    <div v-if="!isCompose" class="page-section">
      <a-row :gutter="16" class="stat-row">
        <a-col v-for="item in statCards" :key="item.label" :xs="24" :sm="12" :xl="6">
          <a-card class="stat-card" :bordered="false">
            <div class="stat-label">{{ item.label }}</div>
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-meta">{{ item.meta }}</div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16" class="content-grid">
        <a-col :xs="24" :xl="15">
          <a-card title="邮件列表" class="full-height">
            <template #extra>
              <a-space>
                <a-tag color="arcoblue">抑制地址 {{ totalSuppressed }}</a-tag>
                <a-tag color="green">今日邮件 {{ todayCount }}</a-tag>
              </a-space>
            </template>

            <div class="filter-bar">
              <a-input
                v-model="filters.keyword"
                allow-clear
                placeholder="搜索邮件名称或标题"
              />
              <a-select v-model="filters.status" allow-clear placeholder="全部状态">
                <a-option value="草稿">草稿</a-option>
                <a-option value="发送中">发送中</a-option>
                <a-option value="部分失败">部分失败</a-option>
                <a-option value="已完成">已完成</a-option>
              </a-select>
              <a-select v-model="filters.type" allow-clear placeholder="全部类型">
                <a-option value="运营活动通知">运营活动通知</a-option>
                <a-option value="重大升级通知">重大升级通知</a-option>
                <a-option value="服务公告">服务公告</a-option>
              </a-select>
              <a-button @click="resetFilters">重置</a-button>
            </div>

            <a-table
              :columns="columns"
              :data="filteredTasks"
              :pagination="false"
              row-key="id"
              :row-class="rowClassName"
              @row-click="onRowClick"
            >
              <template #name="{ record }">
                <div class="table-title">{{ record.name }}</div>
                <div class="table-sub">{{ record.subject }}</div>
              </template>
              <template #type="{ record }">
                <a-tag :color="typeTagColor(record.type)">{{ record.type }}</a-tag>
              </template>
              <template #metrics="{ record }">
                <div class="table-title">{{ record.metrics.final }}</div>
                <div class="table-sub">
                  送达 {{ record.metrics.delivered }}
                  <span v-if="record.metrics.failed"> / 失败 {{ record.metrics.failed }}</span>
                </div>
              </template>
              <template #updatedAt="{ record }">
                <div class="table-title">{{ record.updatedAt }}</div>
                <div class="table-sub">
                  {{ record.audienceMode === 'all' ? '全部客户门店' : '指定门店' }}
                </div>
              </template>
              <template #status="{ record }">
                <a-tag :color="statusTagColor(record.status)">{{ record.status }}</a-tag>
              </template>
              <template #actions="{ record }">
                <a-space>
                  <a-link @click.stop="selectTask(record.id)">查看</a-link>
                  <a-link @click.stop="openCompose(record, record.status !== '草稿')">
                    {{ record.status === '草稿' ? '编辑' : '复制' }}
                  </a-link>
                  <a-link
                    v-if="record.status === '部分失败'"
                    status="warning"
                    @click.stop="retryFailed(record)"
                  >
                    重试
                  </a-link>
                </a-space>
              </template>
            </a-table>
          </a-card>
        </a-col>

        <a-col :xs="24" :xl="9">
          <a-card class="full-height">
            <template #title>
              <a-space>
                <a-tag :color="statusTagColor(selectedTask.status)">{{ selectedTask.status }}</a-tag>
                <a-tag :color="typeTagColor(selectedTask.type)">{{ selectedTask.type }}</a-tag>
              </a-space>
            </template>
            <template #extra>
              <a-space>
                <a-button
                  v-if="selectedTask.status === '部分失败'"
                  type="primary"
                  size="small"
                  @click="retryFailed(selectedTask)"
                >
                  重试失败地址
                </a-button>
                <a-button
                  v-if="selectedTask.status === '发送中'"
                  size="small"
                  @click="refreshSending(selectedTask)"
                >
                  刷新状态
                </a-button>
                <a-button
                  v-if="selectedTask.status === '草稿'"
                  size="small"
                  @click="openCompose(selectedTask, false)"
                >
                  继续编辑
                </a-button>
                <a-button
                  v-if="selectedTask.status !== '草稿'"
                  size="small"
                  @click="openCompose(selectedTask, true)"
                >
                  复制邮件
                </a-button>
              </a-space>
            </template>

            <div class="detail-title">{{ selectedTask.name }}</div>

            <a-descriptions :column="2" bordered size="medium" class="detail-desc">
              <a-descriptions-item label="收件人数">{{ selectedTask.metrics.final }}</a-descriptions-item>
              <a-descriptions-item label="成功送达">{{ selectedTask.metrics.delivered }}</a-descriptions-item>
              <a-descriptions-item label="失败地址">{{ selectedTask.metrics.failed }}</a-descriptions-item>
              <a-descriptions-item label="更新时间">{{ selectedTask.updatedAt }}</a-descriptions-item>
            </a-descriptions>

            <a-tabs v-model:active-key="detailTab" type="rounded">
              <a-tab-pane key="overview" title="概览">
                <a-row :gutter="12">
                  <a-col :span="8">
                    <a-card size="small" class="mini-card">
                      <div class="mini-value">{{ selectedTask.metrics.platform }}</div>
                      <div class="mini-label">平台门店邮箱</div>
                    </a-card>
                  </a-col>
                  <a-col :span="8">
                    <a-card size="small" class="mini-card">
                      <div class="mini-value">{{ selectedTask.metrics.external }}</div>
                      <div class="mini-label">外部有效邮箱</div>
                    </a-card>
                  </a-col>
                  <a-col :span="8">
                    <a-card size="small" class="mini-card">
                      <div class="mini-value">{{ selectedTask.metrics.suppressed }}</div>
                      <div class="mini-label">自动排除</div>
                    </a-card>
                  </a-col>
                </a-row>

                <a-list :bordered="false" class="simple-list">
                  <a-list-item>
                    <a-list-item-meta title="发送范围">
                      <template #description>
                        {{ selectedTask.audienceMode === 'all' ? '全部客户门店' : selectedStoreNames(selectedTask.selectedStores) }}
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                  <a-list-item>
                    <a-list-item-meta title="测试状态">
                      <template #description>
                        {{ selectedTask.testPassed ? '测试发送已通过，可直接复制或继续复用。' : '尚未执行测试发送。正式发送前需要先测试。' }}
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-tab-pane>

              <a-tab-pane key="failures" title="失败地址">
                <a-empty v-if="!selectedTask.failures.length" description="当前任务无失败地址" />
                <a-list v-else :bordered="false" class="simple-list">
                  <a-list-item v-for="item in selectedTask.failures" :key="item.email">
                    <a-list-item-meta :title="item.email" :description="item.reason" />
                  </a-list-item>
                </a-list>
              </a-tab-pane>

              <a-tab-pane key="logs" title="发送日志">
                <a-timeline>
                  <a-timeline-item v-for="item in selectedTask.logs" :key="`${selectedTask.id}-${item.time}-${item.text}`">
                    <div class="log-time">{{ item.time }}</div>
                    <div class="log-text">{{ item.text }}</div>
                  </a-timeline-item>
                </a-timeline>
              </a-tab-pane>
            </a-tabs>

            <div class="preview-box">
              <a-tag :color="typeTagColor(selectedTask.type)">{{ selectedTask.type }}</a-tag>
              <div class="preview-title">{{ selectedTask.subject }}</div>
              <div class="preview-copy">{{ selectedTask.preheader }}</div>
              <div class="preview-highlight">{{ selectedTask.body }}</div>
              <a-button
                v-if="selectedTask.cta && selectedTask.link"
                type="primary"
                size="small"
              >
                {{ selectedTask.cta }}
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div v-else class="page-section">
      <a-row :gutter="16">
        <a-col :xs="24" :xl="15">
          <a-card :title="draft.id ? '编辑邮件' : '新建邮件'">
            <template #extra>
              <a-tag :color="draft.id ? 'arcoblue' : 'gray'">{{ draft.id ? '编辑中' : '未发送' }}</a-tag>
            </template>

            <a-form layout="vertical">
              <a-typography-title :heading="6">发送对象</a-typography-title>
              <a-radio-group v-model="draft.audienceMode" type="button" @change="onAudienceModeChange">
                <a-radio value="all">全部客户门店</a-radio>
                <a-radio value="selected">指定门店</a-radio>
              </a-radio-group>

              <div class="store-check-list">
                <a-button
                  v-for="store in stores"
                  :key="store.id"
                  :type="draft.selectedStores.includes(store.id) ? 'primary' : 'outline'"
                  size="small"
                  @click="toggleStore(store.id)"
                >
                  {{ store.name }} · {{ store.recipients }}
                </a-button>
              </div>

              <a-form-item field="externalEmails" label="补充外部邮箱">
                <a-textarea
                  v-model="draftExternalText"
                  placeholder="每行一个邮箱地址"
                  :auto-size="{ minRows: 4, maxRows: 8 }"
                  @change="syncDraftExternal"
                />
                <template #extra>
                  外部邮箱会与平台门店邮箱合并去重，自动剔除无效地址与重复地址。
                </template>
              </a-form-item>

              <a-space class="block-actions">
                <a-button @click="importSample">导入示例邮箱</a-button>
                <a-button @click="clearExternal">清空外部邮箱</a-button>
              </a-space>

              <a-divider />

              <a-typography-title :heading="6">邮件内容</a-typography-title>
              <a-radio-group v-model="draft.type" type="button" @change="draft.testPassed = false">
                <a-radio value="运营活动通知">运营活动通知</a-radio>
                <a-radio value="重大升级通知">重大升级通知</a-radio>
                <a-radio value="服务公告">服务公告</a-radio>
              </a-radio-group>

              <a-form-item field="subject" label="邮件标题" required>
                <a-input v-model="draft.subject" @input="draft.testPassed = false" />
              </a-form-item>
              <a-form-item field="preheader" label="预览摘要">
                <a-input v-model="draft.preheader" @input="draft.testPassed = false" />
              </a-form-item>
              <a-form-item field="body" label="正文内容" required>
                <a-textarea
                  v-model="draft.body"
                  :auto-size="{ minRows: 6, maxRows: 10 }"
                  @input="draft.testPassed = false"
                />
              </a-form-item>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item field="cta" label="主按钮文案">
                    <a-input
                      v-model="draft.cta"
                      allow-clear
                      placeholder="可为空"
                      @input="draft.testPassed = false"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="link" label="落地页链接">
                    <a-input
                      v-model="draft.link"
                      allow-clear
                      placeholder="可为空"
                      @input="draft.testPassed = false"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-divider />

              <div class="compose-footer">
                <div class="compose-status">
                  <a-tag :color="draft.testPassed ? 'green' : 'orange'">
                    {{ draft.testPassed ? '测试已通过' : '测试未执行' }}
                  </a-tag>
                  <span>{{ draft.testPassed ? '可以正式发送' : '正式发送前需先测试发送' }}</span>
                </div>
                <a-space>
                  <a-button @click="goList">返回列表</a-button>
                  <a-button @click="saveDraft">保存草稿</a-button>
                  <a-button @click="sendTest">发送测试邮件</a-button>
                  <a-button type="primary" @click="sendFormal">正式发送</a-button>
                </a-space>
              </div>
            </a-form>
          </a-card>
        </a-col>

        <a-col :xs="24" :xl="9">
          <a-space direction="vertical" fill :size="16">
            <a-card>
              <template #title>
                <a-space>
                  <a-tag :color="draft.testPassed ? 'green' : 'orange'">{{ draft.testPassed ? '测试已通过' : '测试未执行' }}</a-tag>
                  <a-tag color="arcoblue">{{ draft.audienceMode === 'all' ? '全部客户门店' : '指定门店' }}</a-tag>
                </a-space>
              </template>

              <a-row :gutter="12">
                <a-col :span="12" v-for="item in draftSummaryCards" :key="item.label">
                  <div class="summary-card">
                    <div class="summary-label">{{ item.label }}</div>
                    <div class="summary-value">{{ item.value }}</div>
                    <div class="summary-meta">{{ item.meta }}</div>
                  </div>
                </a-col>
              </a-row>
            </a-card>

            <a-card title="邮件预览">
              <div class="preview-box">
                <a-tag :color="typeTagColor(draft.type)">{{ draft.type }}</a-tag>
                <div class="preview-title">{{ draft.subject || '未填写标题' }}</div>
                <div class="preview-copy">{{ draft.preheader || '预览摘要为空时，此处不展示额外说明。' }}</div>
                <div class="preview-highlight">{{ draft.body || '正文内容为空。' }}</div>
                <a-button
                  v-if="draft.cta && draft.link"
                  type="primary"
                  size="small"
                >
                  {{ draft.cta }}
                </a-button>
              </div>
            </a-card>

            <a-card title="测试发送记录">
              <a-empty v-if="!draft.logs.length" description="暂无测试记录" />
              <a-timeline v-else>
                <a-timeline-item v-for="item in draft.logs" :key="`${item.time}-${item.text}`">
                  <div class="log-time">{{ item.time }}</div>
                  <div class="log-text">{{ item.text }}</div>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </a-space>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue';
import {
  notificationTasks,
  sampleExternalEmails,
  stores,
  type AudienceMode,
  type NotificationStatus,
  type NotificationTask,
} from './mock';

const list = ref<NotificationTask[]>(structuredClone(notificationTasks));
const selectedTaskId = ref<string>(list.value[0]?.id || '');
const detailTab = ref('overview');
const isCompose = ref(false);
const draftExternalText = ref('');

const filters = reactive({
  keyword: '',
  status: '',
  type: '',
});

const createDefaultDraft = (): NotificationTask => ({
  id: '',
  name: '',
  type: '运营活动通知',
  status: '草稿',
  audienceMode: 'all',
  selectedStores: stores.map((item) => item.id),
  externalEmails: [],
  subject: 'WellnessHub 春季运营活动已上线，门店专属权益本周可领取',
  preheader: '已覆盖全部活跃门店与渠道邮箱，包含活动入口与权益说明。',
  body: '为了帮助门店提升春季获客转化，平台现已开放活动中心与物料支持包。完成报名后，可在后台查看门店参与条件、奖励规则与执行指南。',
  cta: '进入活动中心',
  link: 'https://wellnesshub.visbody.com/operations/campaign-center',
  updatedAt: '',
  testPassed: false,
  metrics: { platform: 0, external: 0, invalid: 0, duplicates: 0, suppressed: 0, final: 0, delivered: 0, failed: 0 },
  failures: [],
  logs: [],
});

const draft = reactive<NotificationTask>(createDefaultDraft());

const columns: TableColumnData[] = [
  { title: '通知名称', dataIndex: 'name', slotName: 'name', width: 320 },
  { title: '类型', dataIndex: 'type', slotName: 'type', width: 140 },
  { title: '收件人数', dataIndex: 'metrics', slotName: 'metrics', width: 140 },
  { title: '更新时间', dataIndex: 'updatedAt', slotName: 'updatedAt', width: 190 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 120 },
  { title: '操作', dataIndex: 'actions', slotName: 'actions', width: 180, fixed: 'right' },
];

const nowString = () => `2026-04-11 ${new Date().toTimeString().slice(0, 8)}`;

const selectedTask = computed(() => {
  return list.value.find((item) => item.id === selectedTaskId.value) || list.value[0];
});

const filteredTasks = computed(() => {
  return list.value.filter((item) => {
    const keywordHit = !filters.keyword || item.name.includes(filters.keyword) || item.subject.includes(filters.keyword);
    const statusHit = !filters.status || item.status === filters.status;
    const typeHit = !filters.type || item.type === filters.type;
    return keywordHit && statusHit && typeHit;
  });
});

const totalSuppressed = computed(() => list.value.reduce((sum, item) => sum + item.metrics.suppressed, 0));
const todayCount = computed(() => list.value.filter((item) => item.updatedAt.startsWith('2026-04-11')).length);

const statCards = computed(() => {
  const sentTasks = list.value.filter((item) => item.status !== '草稿');
  const finalTotal = sentTasks.reduce((sum, item) => sum + item.metrics.final, 0);
  const delivered = sentTasks.reduce((sum, item) => sum + item.metrics.delivered, 0);
  const retry = list.value.reduce((sum, item) => sum + item.metrics.failed, 0);
  const rate = finalTotal ? `${((delivered / finalTotal) * 100).toFixed(1)}%` : '0.0%';

  return [
    { label: '通知总数', value: list.value.length, meta: `草稿 ${list.value.filter((item) => item.status === '草稿').length} / 已发 ${sentTasks.length}` },
    { label: '今日发送人数', value: finalTotal, meta: '含平台门店邮箱和外部补充邮箱' },
    { label: '平均送达率', value: rate, meta: '按正式发送通知实时计算' },
    { label: '待重试地址', value: retry, meta: '失败地址支持一键重试' },
  ];
});

const draftMetrics = computed(() => computeDraftMetrics(draft));
const draftSummaryCards = computed(() => [
  { label: '平台门店邮箱', value: draftMetrics.value.platform, meta: draft.audienceMode === 'all' ? '全量门店' : '指定门店汇总' },
  { label: '外部有效邮箱', value: draftMetrics.value.external, meta: '去重后有效地址' },
  { label: '自动排除', value: draftMetrics.value.suppressed, meta: '无效、重复、抑制' },
  { label: '最终发送数', value: draftMetrics.value.final, meta: '正式发送目标数' },
]);

function parseEmails(text: string) {
  return text
    .split(/[\n,;\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function computeDraftMetrics(task: NotificationTask) {
  const scopedStores = task.audienceMode === 'all'
    ? stores
    : stores.filter((item) => task.selectedStores.includes(item.id));
  const platform = scopedStores.reduce((sum, item) => sum + item.recipients, 0);
  const suppressedBase = scopedStores.reduce((sum, item) => sum + item.suppressed, 0);
  const rawExternal = task.externalEmails;
  const uniqueExternal = [...new Set(rawExternal)];
  const duplicates = rawExternal.length - uniqueExternal.length;
  const invalid = uniqueExternal.filter((item) => !isEmailValid(item)).length;
  const external = uniqueExternal.filter((item) => isEmailValid(item)).length;
  const suppressed = suppressedBase + duplicates + invalid;
  return {
    platform,
    external,
    invalid,
    duplicates,
    suppressed,
    final: Math.max(platform + external - suppressed, 0),
    delivered: 0,
    failed: 0,
  };
}

function selectedStoreNames(ids: string[]) {
  return stores.filter((item) => ids.includes(item.id)).map((item) => item.name).join('、');
}

function statusTagColor(status: NotificationStatus) {
  if (status === '已完成') return 'green';
  if (status === '部分失败') return 'orange';
  if (status === '发送中') return 'arcoblue';
  return 'gray';
}

function typeTagColor(type: string) {
  if (type === '重大升级通知') return 'red';
  if (type === '服务公告') return 'green';
  return 'arcoblue';
}

function rowClassName(record: NotificationTask) {
  return record.id === selectedTaskId.value ? 'selected-row' : '';
}

function selectTask(id: string) {
  selectedTaskId.value = id;
}

function onRowClick(record: NotificationTask) {
  selectTask(record.id);
}

function resetFilters() {
  filters.keyword = '';
  filters.status = '';
  filters.type = '';
}

function resetDraft() {
  Object.assign(draft, createDefaultDraft());
  draftExternalText.value = '';
}

function syncDraftExternal() {
  draft.externalEmails = parseEmails(draftExternalText.value);
  draft.testPassed = false;
}

function onAudienceModeChange(value: string | number | boolean) {
  const mode = value as AudienceMode;
  draft.audienceMode = mode;
  draft.selectedStores = mode === 'all' ? stores.map((item) => item.id) : [stores[0].id];
  draft.testPassed = false;
}

function toggleStore(storeId: string) {
  if (draft.audienceMode === 'all') {
    Message.info('当前为全部客户门店模式，切换为指定门店后可单独选择。');
    return;
  }

  const exists = draft.selectedStores.includes(storeId);
  if (exists) {
    if (draft.selectedStores.length === 1) {
      Message.warning('至少保留一个门店。');
      return;
    }
    draft.selectedStores = draft.selectedStores.filter((item) => item !== storeId);
  } else {
    draft.selectedStores = [...draft.selectedStores, storeId];
  }
  draft.testPassed = false;
}

function createNotification() {
  resetDraft();
  isCompose.value = true;
}

function goList() {
  isCompose.value = false;
}

function openCompose(task: NotificationTask, duplicate: boolean) {
  Object.assign(draft, structuredClone(task));
  draft.id = duplicate ? '' : task.id;
  draft.name = duplicate ? '' : task.name;
  draft.logs = duplicate ? [] : structuredClone(task.logs);
  draft.testPassed = duplicate ? false : task.testPassed;
  draftExternalText.value = draft.externalEmails.join('\n');
  isCompose.value = true;
}

function importSample() {
  draftExternalText.value = sampleExternalEmails.join('\n');
  syncDraftExternal();
  Message.info('已导入示例邮箱。');
}

function clearExternal() {
  draftExternalText.value = '';
  syncDraftExternal();
  Message.info('外部邮箱已清空。');
}

function saveDraft() {
  if (!draft.subject.trim() || !draft.body.trim()) {
    Message.warning('标题和正文不能为空。');
    return;
  }
  draft.externalEmails = parseEmails(draftExternalText.value);
  draft.metrics = draftMetrics.value;
  draft.status = '草稿';
  draft.updatedAt = nowString();
  draft.logs = [{ time: nowString(), text: '草稿已保存。' }, ...draft.logs];

  const payload: NotificationTask = structuredClone({
    ...draft,
    id: draft.id || `task-${Date.now()}`,
    name: draft.name || draft.subject.slice(0, 18),
  });

  upsertTask(payload);
  isCompose.value = false;
  Message.success('草稿已保存。');
}

function sendTest() {
  if (!draft.subject.trim() || !draft.body.trim()) {
    Message.warning('请先填写标题和正文。');
    return;
  }
  draft.externalEmails = parseEmails(draftExternalText.value);
  draft.testPassed = true;
  draft.logs = [{ time: nowString(), text: '测试邮件已发送到 8 个测试邮箱，文案与链接校验通过。' }, ...draft.logs];
  Message.success('测试邮件发送成功。');
}

function sendFormal() {
  if (!draft.testPassed) {
    Message.warning('正式发送前请先测试发送。');
    return;
  }
  draft.externalEmails = parseEmails(draftExternalText.value);
  const metrics = draftMetrics.value;
  const willFail = metrics.final > 900;

  const payload: NotificationTask = structuredClone({
    ...draft,
    id: draft.id || `task-${Date.now()}`,
    name: draft.name || draft.subject.slice(0, 18),
    status: willFail ? '部分失败' : '已完成',
    updatedAt: nowString(),
    metrics: {
      ...metrics,
      delivered: willFail ? Math.max(metrics.final - 12, 0) : metrics.final,
      failed: willFail ? Math.min(12, metrics.final) : 0,
    },
    failures: willFail
      ? [
          { email: 'owner@weststudio.co', reason: 'Mailbox full，建议稍后重试。' },
          { email: 'service@partnermail.io', reason: 'Remote server temporary rejected。' },
          { email: 'hello@fitalliance.io', reason: 'Temporary throttled。' },
        ]
      : [],
    logs: [
      { time: nowString(), text: willFail ? '正式发送完成，存在 12 个失败地址。' : '正式发送完成，全部地址送达成功。' },
      ...draft.logs,
    ],
  });

  upsertTask(payload);
  isCompose.value = false;
  Message.success(willFail ? '发送完成，存在失败地址。' : '发送完成，全部送达。');
}

function retryFailed(task: NotificationTask) {
  if (!task.metrics.failed) {
    Message.info('当前通知没有失败地址。');
    return;
  }
  task.status = '已完成';
  task.metrics.delivered = task.metrics.final;
  task.metrics.failed = 0;
  task.failures = [];
  task.updatedAt = nowString();
  task.logs.unshift({ time: nowString(), text: '失败地址重试完成，当前通知已全部送达。' });
  Message.success('失败地址重试完成。');
}

function refreshSending(task: NotificationTask) {
  if (task.status !== '发送中') {
    Message.info('当前通知不在发送中。');
    return;
  }
  task.status = '已完成';
  task.metrics.delivered = task.metrics.final;
  task.updatedAt = nowString();
  task.logs.unshift({ time: nowString(), text: '手动刷新后，通知状态已更新为全部完成。' });
  Message.success('通知状态已刷新。');
}

function upsertTask(task: NotificationTask) {
  const index = list.value.findIndex((item) => item.id === task.id);
  if (index >= 0) {
    list.value[index] = task;
  } else {
    list.value.unshift(task);
  }
  selectedTaskId.value = task.id;
}
</script>

<style scoped>
.mail-page {
  min-height: 100%;
  background: #f6f8fb;
}

.page-section {
  padding: 0 24px 24px;
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card,
.full-height {
  height: 100%;
}

.stat-label,
.summary-label,
.mini-label {
  color: rgb(var(--gray-6));
  font-size: 12px;
}

.stat-value,
.summary-value,
.mini-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
  color: rgb(var(--gray-9));
}

.stat-meta,
.summary-meta,
.table-sub,
.log-time {
  margin-top: 6px;
  color: rgb(var(--gray-6));
  font-size: 12px;
}

.content-grid {
  margin-top: 0;
}

.filter-bar {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 16px;
}

.table-title {
  font-weight: 600;
  color: rgb(var(--gray-9));
}

.detail-title,
.preview-title {
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--gray-9));
}

.detail-desc {
  margin: 16px 0;
}

.mini-card,
.summary-card {
  border: 1px solid rgb(var(--gray-3));
  border-radius: 12px;
  padding: 12px;
  background: #f9fbff;
}

.simple-list {
  margin-top: 12px;
}

.log-text,
.preview-copy {
  color: rgb(var(--gray-6));
  line-height: 1.7;
}

.preview-box {
  margin-top: 16px;
  border: 1px solid rgb(var(--gray-3));
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #fafcff);
  padding: 16px;
}

.preview-highlight {
  margin: 14px 0 16px;
  border-radius: 12px;
  background: #f8fbff;
  border: 1px solid rgb(var(--gray-3));
  padding: 14px;
  line-height: 1.7;
}

.store-check-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 14px 0 6px;
}

.block-actions {
  margin-top: 8px;
}

.compose-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.compose-status {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgb(var(--gray-7));
  font-size: 13px;
}

:deep(.selected-row > td) {
  background: rgba(var(--arcoblue-1), 0.9);
}

@media (max-width: 1280px) {
  .filter-bar {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
