import DataTable from "../components/DataTable";
import DetailPanel from "../components/DetailPanel";
import SectionCard from "../components/SectionCard";
import StatStrip from "../components/StatStrip";
import { EmptyState } from "../components/StateBlock";

function Pill({ tone, text }) {
  return <span className={`pill ${tone}`}>{text}</span>;
}

function Funnel({ steps, tier }) {
  return (
    <div className="funnel">
      {steps.map((step) => {
        const locked = step.proOnly && tier === "basic";
        return (
          <div key={step.label} className={`funnel-step ${locked ? "locked" : ""}`}>
            <div className="label">{step.label}</div>
            <div className="funnel-value">{locked ? "—" : step.value}</div>
            <div className="delta">{locked ? "非 Pro 不展示此节点" : step.note}</div>
          </div>
        );
      })}
    </div>
  );
}

function MiniCards({ items }) {
  return (
    <div className="two-col">
      {items.map((item) => (
        <div key={item.title} className="mini-card">
          <h4>{item.title}</h4>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function ListStack({ items }) {
  return (
    <div className="list">
      {items.map((item) => (
        <div key={item.title} className="list-item">
          <div className="list-top">
            <strong>{item.title}</strong>
            {item.pill ? <Pill tone={item.pill.tone} text={item.pill.text} /> : null}
          </div>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function HQOverviewPage({ state, data, onStoreSelect }) {
  const selected = data.hqStoreRows.find((row) => row.id === state.selectedStore) || data.hqStoreRows[0];

  return (
    <>
      {state.tier === "basic" ? (
        <div className="info-banner">
          <strong>非 Pro 示意态</strong>
          <span>总部可继续看基础经营数据，AI 解读和训练大纲相关指标按锁定态展示。</span>
        </div>
      ) : null}

      <StatStrip
        tier={state.tier}
        items={[
          { label: "累计测评用户", value: "18,640", delta: "+8.4%", hint: "较上周期", tone: "blue" },
          { label: "本期新增测评", value: "1,248", delta: "+12.3%", hint: "门店新增到店", tone: "blue" },
          { label: "活跃用户", value: "7,860", delta: "+6.1%", hint: "近 30 天", tone: "teal" },
          { label: "复测用户", value: "2,316", delta: "+9.2%", hint: "本期完成复测", tone: "green" },
          { label: "复测达成率", value: "18.6%", delta: "+2.4pp", hint: "门店闭环效率", tone: "green" },
          { label: "高风险门店", value: "6", delta: "需干预", hint: "流失风险占比超阈值", tone: "red" },
          { label: "AI 渗透门店占比", value: "67%", delta: "+9pp", hint: "Pro 子门店内", tone: "purple", proOnly: true },
          { label: "子门店对比排行", value: "4 组", delta: "透明指标排序", hint: "支持下钻", tone: "orange" }
        ]}
      />

      <section className="panel-grid">
        <div className="stack">
          <SectionCard
            title="服务转化进度"
            subtitle="按服务阶段查看当前转化"
            extra={<Pill tone="blue" text="标准后台模式" />}
          >
            <Funnel
              tier={state.tier}
              steps={[
                { label: "已测评", value: "1,248", note: "本期非导入测评用户" },
                { label: "已生成训练大纲", value: "684", note: "训练大纲承接人数", proOnly: true },
                { label: "已复测", value: "232", note: "本期完成复测人数" }
              ]}
            />
          </SectionCard>

          <SectionCard
            title="高风险门店提醒"
            subtitle="按风险状态查看门店"
            extra={<button className="ghost-btn">导出名单</button>}
          >
            <div className="two-col">
              {data.hqStoreRows.map((row) => (
                <button key={row.id} className="select-card" onClick={() => onStoreSelect(row.id)}>
                  <div className="list-top">
                    <strong>{row.name}</strong>
                    <Pill tone={row.tone} text={row.status} />
                  </div>
                  <p>流失风险占比 {row.riskRatio}，待分配占比 {row.unassignedRatio}，待复测 {row.retestDue} 人。</p>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <DetailPanel
          title={selected.name}
          subtitle={`${selected.group} · 总部推荐关注门店`}
          sections={[
            {
              kv: [
                { label: "新增测评增长率", value: selected.newGrowth },
                { label: "活跃用户增长率", value: selected.activeGrowth },
                { label: "复测达成率", value: selected.retestRate },
                { label: "待分配用户占比", value: selected.unassignedRatio },
                { label: "流失风险用户占比", value: selected.riskRatio }
              ]
            },
            {
              title: "总部建议",
              bullets: [
                selected.note,
                "优先排查前台补绑和教练分配流程，再推进复测动作。",
                state.tier === "pro" ? "继续查看 AI 解读覆盖率和执行中大纲占比。" : "升级 Pro 后查看 AI 解读和训练大纲指标。"
              ]
            }
          ]}
        />
      </section>
    </>
  );
}

export function HQStoresPage({ state, data, onStoreSelect }) {
  const filtered = data.hqStoreRows.filter((row) => {
    const searchPass = !state.search || row.name.includes(state.search) || row.group.includes(state.search);
    const groupPass = state.group === "全部门店组" || row.group === state.group;
    return searchPass && groupPass;
  });
  const selected = filtered.find((row) => row.id === state.selectedStore) || filtered[0] || data.hqStoreRows[0];

  const columns = [
    {
      key: "store",
      label: "子门店",
      render: (row) => (
        <>
          <strong>{row.name}</strong>
          <div className="cell-sub">{row.group}</div>
        </>
      )
    },
    { key: "newGrowth", label: "新增测评增长率", render: (row) => row.newGrowth },
    { key: "activeGrowth", label: "活跃增长率", render: (row) => row.activeGrowth },
    { key: "retestRate", label: "复测达成率", render: (row) => row.retestRate },
    { key: "unassignedRatio", label: "待分配占比", render: (row) => row.unassignedRatio },
    { key: "riskRatio", label: "流失风险占比", render: (row) => row.riskRatio },
    { key: "archive", label: "档案完整度", render: (row) => row.archive },
    { key: "pendingBind", label: "待绑定报告", render: (row) => `${row.pendingBind} 份` },
    {
      key: "aiCoverage",
      label: "AI 解读覆盖率",
      render: (row) => (state.tier === "pro" ? row.aiCoverage : <span className="muted-lock">Pro</span>)
    },
    {
      key: "outlineRate",
      label: "执行中大纲占比",
      render: (row) => (state.tier === "pro" ? row.outlineRate : <span className="muted-lock">Pro</span>)
    }
  ];

  return (
    <>
      <StatStrip
        tier={state.tier}
        items={[
          { label: "高增长门店", value: "4", delta: "新增/活跃双增长", hint: "可复制对象", tone: "green" },
          { label: "高风险门店", value: "6", delta: "风险占比高", hint: "需总部介入", tone: "red" },
          { label: "承接薄弱门店", value: "5", delta: "待分配偏高", hint: "优先补承接", tone: "orange" },
          { label: "AI 使用不足门店", value: "7", delta: "覆盖率 < 35%", hint: "仅 Pro 子门店", tone: "purple", proOnly: true }
        ]}
      />

      <section className="panel-grid">
        <div className="stack">
          <SectionCard
            title="子门店透明指标排行"
            subtitle="按门店查看新增、复测、风险和承接指标"
            extra={<Pill tone="gray" text={`${filtered.length} 家门店`} />}
            flush
          >
            <DataTable columns={columns} rows={filtered} selectedId={selected.id} onSelect={onStoreSelect} />
          </SectionCard>

          <SectionCard title="门店状态" subtitle="按风险、承接和设备状态查看">
            <div className="status-grid">
              <div className="status-card">
                <strong>高风险门店</strong>
                <span>{data.hqStoreRows.filter((row) => Number.parseFloat(row.riskRatio) >= 15).length} 家</span>
              </div>
              <div className="status-card">
                <strong>复测偏弱</strong>
                <span>{data.hqStoreRows.filter((row) => Number.parseFloat(row.retestRate) < 15).length} 家</span>
              </div>
              <div className="status-card">
                <strong>待分配偏高</strong>
                <span>{data.hqStoreRows.filter((row) => Number.parseFloat(row.unassignedRatio) >= 10).length} 家</span>
              </div>
              <div className="status-card">
                <strong>待绑定偏高</strong>
                <span>{data.hqStoreRows.filter((row) => row.pendingBind >= 8).length} 家</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="总部优先问题" subtitle="适合在月会或区域复盘时快速定位问题类型">
            <MiniCards
              items={[
                { title: "增长放缓", text: "优先看新增测评增长率与活跃增长率同时为负的门店。" },
                { title: "承接断点", text: "优先看待分配占比高、待绑定报告多的门店。" },
                { title: "复测偏弱", text: "重点关注复测达成率低且待复测池大的门店。" },
                {
                  title: "AI 使用不足",
                  text: state.tier === "pro" ? "看 AI 解读覆盖率和执行中大纲占比是否双低。" : "非 Pro 不展示 AI 使用指标，仅保留基础运营字段。"
                }
              ]}
            />
          </SectionCard>
        </div>

        <DetailPanel
          title={selected.name}
          subtitle={`${selected.status} · ${selected.group}`}
          sections={[
            {
              kv: [
                { label: "新增测评增长率", value: selected.newGrowth },
                { label: "活跃用户增长率", value: selected.activeGrowth },
                { label: "复测达成率", value: selected.retestRate },
                { label: "待复测人数", value: `${selected.retestDue}` },
                { label: "待绑定报告", value: `${selected.pendingBind} 份` },
                { label: "档案完整度", value: selected.archive },
                { label: "AI 解读覆盖率", value: state.tier === "pro" ? selected.aiCoverage : "Pro" }
              ]
            },
            {
              title: "建议动作",
              bullets: [
                selected.note,
                "总部可直接下钻到门店名单：待分配、待复测、风险用户。",
                "对比同组门店，优先找增长低且承接弱的组合问题。"
              ]
            }
          ]}
        />
      </section>
    </>
  );
}

export function OwnerOverviewPage({ state, data, onOwnerSelect }) {
  const selected = data.ownerActionRows.find((row) => row.id === state.selectedOwner) || data.ownerActionRows[0];

  return (
    <>
      <StatStrip
        tier={state.tier}
        items={[
          { label: "累计测评用户", value: "4,620", delta: "+7.6%", hint: "当前门店累计", tone: "blue" },
          { label: "本期新增测评", value: "368", delta: "+14.2%", hint: "到店测评用户", tone: "blue" },
          { label: "活跃用户", value: "1,482", delta: "+5.4%", hint: "近 30 天有效行为", tone: "teal" },
          { label: "沉睡用户", value: "802", delta: "-3.1%", hint: "需唤醒", tone: "orange" },
          { label: "复测达成率", value: "21.3%", delta: "+1.8pp", hint: "门店闭环效率", tone: "green" },
          { label: "待分配用户", value: "52", delta: "承接缺口", hint: "需尽快分配", tone: "orange" },
          { label: "执行中大纲占比", value: "44%", delta: "+6pp", hint: "服务承接情况", tone: "purple", proOnly: true },
          { label: "今日重点动作", value: "18", delta: "可下钻名单", hint: "按优先级排序", tone: "red" }
        ]}
      />

      <section className="panel-grid">
        <div className="stack">
          <SectionCard title="服务转化进度" subtitle="馆主关注承接缺口和复测推进">
            <Funnel
              tier={state.tier}
              steps={[
                { label: "已测评", value: "368", note: "本期新增测评" },
                { label: "已生成训练大纲", value: "154", note: "仅 Pro 展示", proOnly: true },
                { label: "已复测", value: "78", note: "本期完成复测" }
              ]}
            />
          </SectionCard>

          <SectionCard title="重点人群池" subtitle="先看待复测、流失风险、高潜转化，再看档案缺失">
            <ListStack
              items={data.ownerActionRows.map((row) => ({
                title: row.user,
                pill: { tone: row.tone, text: row.tag },
                text: `${row.reason}；建议动作：${row.action}`
              }))}
            />
          </SectionCard>

          <SectionCard title="重点状态" subtitle="当前门店最需要处理的状态">
            <div className="status-grid">
              <div className="status-card">
                <strong>待分配</strong>
                <span>2 人</span>
              </div>
              <div className="status-card">
                <strong>待复测</strong>
                <span>1 人</span>
              </div>
              <div className="status-card">
                <strong>流失风险</strong>
                <span>1 人</span>
              </div>
              <div className="status-card">
                <strong>高潜转化</strong>
                <span>1 人</span>
              </div>
            </div>
          </SectionCard>
        </div>

        <DetailPanel
          title={selected.user}
          subtitle={`${selected.coach} · ${selected.tag}`}
          sections={[
            {
              kv: [
                { label: "最近测评时间", value: selected.latest },
                { label: "建议动作", value: selected.action },
                { label: "当前原因", value: selected.reason },
                { label: "补充说明", value: state.tier === "pro" ? selected.proNote : "当前套餐仅展示基础动作" }
              ]
            },
            {
              title: "馆主动作",
              bullets: ["先确认是否已分配到人。", "再看是否具备复测条件。", "对流失风险用户优先安排唤醒。"]
            }
          ]}
          actions={<button className="primary-btn" onClick={() => onOwnerSelect(selected.id)}>锁定查看</button>}
        />
      </section>
    </>
  );
}

export function OwnerAnalysisPage({ state, data, onOwnerSelect }) {
  const filtered = data.ownerActionRows.filter((row) => {
    const searchPass = !state.search || row.user.includes(state.search) || row.tag.includes(state.search);
    const coachPass = state.coach === "全部教练" || row.coach === state.coach;
    return searchPass && coachPass;
  });

  const selected = filtered.find((row) => row.id === state.selectedOwner) || filtered[0] || data.ownerActionRows[0];

  const columns = [
    {
      key: "user",
      label: "用户",
      render: (row) => (
        <>
          <strong>{row.user}</strong>
          <div className="cell-sub">{row.coach}</div>
        </>
      )
    },
    { key: "latest", label: "最近测评", render: (row) => row.latest },
    { key: "tag", label: "人群标签", render: (row) => <Pill tone={row.tone} text={row.tag} /> },
    { key: "reason", label: "触发原因", render: (row) => row.reason },
    { key: "action", label: "建议动作", render: (row) => row.action }
  ];

  return (
    <section className="panel-grid">
      <div className="stack">
        <SectionCard title="门店重点行动表" subtitle="所有主 KPI 都必须能下钻到用户名单" flush>
          {filtered.length ? (
            <DataTable columns={columns} rows={filtered} selectedId={selected.id} onSelect={onOwnerSelect} />
          ) : (
            <EmptyState title="没有匹配结果" text="尝试放宽教练筛选或修改搜索条件。" action={<button className="ghost-btn">重置筛选</button>} />
          )}
        </SectionCard>

        <SectionCard title="结构补充分析" subtitle="画像和标签用于辅助判断，不替代首页主 KPI">
          <MiniCards
            items={[
              { title: "性别分布", text: "女 61% · 男 39%" },
              { title: "年龄分布", text: "25-34 岁占比最高，为 42%" },
              { title: "目标分布", text: "减脂塑形最多，其次为健康管理和体态改善" },
              {
                title: "问题标签分布",
                text: state.tier === "pro" ? "体脂偏高、体态异常、腰腹围度异常是当前前三标签" : "非 Pro 可降级到手工标签；若无标签则展示空状态"
              }
            ]}
          />
        </SectionCard>
      </div>

      <DetailPanel
        title={selected.user}
        subtitle={`${selected.coach} · 门店优先动作`}
        sections={[
          {
            kv: [
              { label: "当前标签", value: selected.tag },
              { label: "建议动作", value: selected.action },
              { label: "最近测评", value: selected.latest },
              { label: "大纲 / AI 情况", value: state.tier === "pro" ? selected.proNote : "非 Pro 不展示 AI / 大纲状态" }
            ]
          },
          {
            title: "动作建议",
            bullets: ["先安排到负责人。", "判断是否具备复测条件。", "高潜转化用户优先推进套餐承接。"]
          }
        ]}
      />
    </section>
  );
}

export function CoachWorkbenchPage({ state, data, onCoachSelect }) {
  const selected = data.coachMembers.find((row) => row.id === state.selectedCoach) || data.coachMembers[0];

  return (
    <>
      <StatStrip
        tier={state.tier}
        items={[
          { label: "负责会员数", value: "186", delta: "+9.3%", hint: "当前归属用户", tone: "blue" },
          { label: "活跃会员", value: "82", delta: "+4.1%", hint: "近 30 天", tone: "teal" },
          { label: "待复测会员", value: "14", delta: "今日优先", hint: "需尽快推进", tone: "orange" },
          { label: "流失风险会员", value: "9", delta: "需唤醒", hint: "长期无行为", tone: "red" },
          { label: "高潜转化会员", value: "7", delta: "+2", hint: "近 10 天新测评", tone: "blue" },
          { label: "AI 解读覆盖率", value: "58%", delta: "+8pp", hint: "仅 Pro", tone: "purple", proOnly: true }
        ]}
      />

      <section className="panel-grid">
        <div className="stack">
          <SectionCard title="今日重点名单" subtitle="教练先看待办和转化，不看门店级宽泛指标">
            <ListStack
              items={data.coachMembers.map((row) => ({
                title: row.name,
                pill: { tone: row.tone, text: row.status },
                text: row.note
              }))}
            />
          </SectionCard>

          <SectionCard title="动作优先级" subtitle="先复测，再唤醒，再做高潜转化">
            <MiniCards
              items={[
                { title: "待复测", text: "适合与执行中大纲联动判断，优先处理执行 2 到 4 周用户。" },
                { title: "流失风险", text: "对 30 天以上无行为用户安排触达和复盘。" },
                { title: "高潜转化", text: "对新近测评用户尽快推进 AI 解读和大纲承接。" },
                { title: "持续改善", text: "沉淀为案例，提升复购和转介绍。 " }
              ]}
            />
          </SectionCard>
        </div>

        <DetailPanel
          title={selected.name}
          subtitle={`${selected.goal} · ${selected.status}`}
          sections={[
            {
              kv: [
                { label: "最新测评", value: selected.latest },
                { label: "风险等级", value: selected.risk },
                { label: "AI 解读", value: state.tier === "pro" ? selected.ai : "非 Pro 不显示" },
                { label: "训练大纲", value: state.tier === "pro" ? selected.outline : "非 Pro 不显示" }
              ]
            },
            { title: "跟进建议", bullets: [selected.note, "把今天第一通跟进电话留给待复测和流失风险用户。"] }
          ]}
          actions={<button className="primary-btn" onClick={() => onCoachSelect(selected.id)}>加入今日跟进</button>}
        />
      </section>
    </>
  );
}

export function CoachMembersPage({ state, data, onCoachSelect }) {
  const filtered = data.coachMembers.filter((row) => {
    const searchPass = !state.search || row.name.includes(state.search) || row.status.includes(state.search);
    const tagPass = state.tag === "全部状态" || row.status === state.tag;
    return searchPass && tagPass;
  });
  const selected = filtered.find((row) => row.id === state.selectedCoach) || filtered[0] || data.coachMembers[0];

  const columns = [
    {
      key: "member",
      label: "会员",
      render: (row) => (
        <>
          <strong>{row.name}</strong>
          <div className="cell-sub">{row.goal}</div>
        </>
      )
    },
    { key: "latest", label: "最新测评", render: (row) => row.latest },
    { key: "status", label: "当前状态", render: (row) => <Pill tone={row.tone} text={row.status} /> },
    { key: "risk", label: "风险等级", render: (row) => row.risk },
    { key: "ai", label: "AI 解读", render: (row) => (state.tier === "pro" ? row.ai : <span className="muted-lock">Pro</span>) },
    { key: "outline", label: "训练大纲", render: (row) => (state.tier === "pro" ? row.outline : <span className="muted-lock">Pro</span>) }
  ];

  return (
    <section className="panel-grid">
      <div className="stack">
        <SectionCard title="会员工作表" subtitle="围绕待办、复测和转化进行筛选与下钻" flush>
          {filtered.length ? (
            <DataTable columns={columns} rows={filtered} selectedId={selected.id} onSelect={onCoachSelect} />
          ) : (
            <EmptyState title="没有匹配用户" text="尝试切换状态筛选或清空搜索条件。" action={<button className="ghost-btn">重置筛选</button>} />
          )}
        </SectionCard>

        <SectionCard title="辅助判断区" subtitle="标签和改善趋势是辅助判断依据，不是首页核心 KPI">
          <div className="two-col">
            {state.tier === "pro" ? (
              <div className="mini-card">
                <h4>问题标签分布</h4>
                <p>体脂偏高 3 人，体态异常 2 人，腰腹围度异常 2 人。</p>
              </div>
            ) : (
              <EmptyState title="问题标签不可见" text="非 Pro 默认不展示 AI 结构化标签，可保留为手工标签入口。" />
            )}
            <div className="mini-card">
              <h4>持续改善用户</h4>
              <p>当前 1 人：赵晨，同类报告已连续改善 2 次。</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <DetailPanel
        title={selected.name}
        subtitle={selected.goal}
        sections={[
          {
            kv: [
              { label: "状态", value: selected.status },
              { label: "风险等级", value: selected.risk },
              { label: "AI 解读", value: state.tier === "pro" ? selected.ai : "非 Pro 不显示" },
              { label: "训练大纲", value: state.tier === "pro" ? selected.outline : "非 Pro 不显示" }
            ]
          },
          { body: selected.note }
        ]}
      />
    </section>
  );
}
