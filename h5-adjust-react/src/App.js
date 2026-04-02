import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { HomePage } from "./pages/HomePage.js";
import { MyPage } from "./pages/MyPage.js";
import { BottomNav } from "./components/layout/BottomNav.js";
import { homeMock, myMock } from "./data/mockData.js";

const html = htm.bind(React.createElement);
const { useEffect, useMemo, useState } = React;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isDebugDemo() {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("debug") === "1";
  } catch {
    return false;
  }
}

export function App() {
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState("normal");
  const [outlineMode, setOutlineMode] = useState("with");
  const [homeData, setHomeData] = useState(clone(homeMock));
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    if (scenario === "empty") {
      setHomeData(null);
      const t = setTimeout(() => setLoading(false), 650);
      return () => clearTimeout(t);
    }
    const next = clone(homeMock);
    if (scenario === "no3d") {
      next.model3d.hasModel = false;
      next.trends = [];
    }
    if (outlineMode === "without") {
      next.trainingEntry = { status: "not_started" };
    }
    setHomeData(next);
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, [scenario, outlineMode]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 1400);
    return () => clearTimeout(timer);
  }, [toast]);

  const page = useMemo(() => {
    if (tab === "my") {
      return html`
        <${MyPage}
          data=${myMock}
          onOpenAssessmentList=${() => setToast("跳转：评估记录")}
          onOpenHealthProfile=${() => setToast("跳转：身体档案")}
          onOpenSettings=${() => setToast("跳转：设置")}
          onOpenHelp=${() => setToast("跳转：测试帮助")}
          onToast=${(m) => setToast(m)}
        />
      `;
    }
    return html`
      <${HomePage}
        loading=${loading}
        data=${homeData}
        onNavigateOutline=${() => setToast("跳转：训练大纲页")}
        onToast=${(m) => setToast(m)}
      />
    `;
  }, [tab, loading, homeData]);

  const routeLabel = tab === "my" ? "我的" : "首页";
  const showDebugPills = isDebugDemo();
  const showOutlineToggle = tab === "home" && scenario === "normal";

  return html`
    <main className="fx-appShell mx-auto min-h-screen w-full max-w-md pb-[max(5.5rem,env(safe-area-inset-bottom))]">
      <header className="fx-headerGlass sticky top-0 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-[15px] font-extrabold tracking-[0.08em] text-transparent">
            Fittrix-FX · H5
          </h1>
          <span className="fx-routeBadge px-2.5 py-1 text-[11px]">${routeLabel}</span>
        </div>
        ${showOutlineToggle &&
        html`
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-2.5">
            <span className="text-[10px] text-fxSub">预览：训练大纲</span>
            <button
              type="button"
              onClick=${() => setOutlineMode("with")}
              className=${`fx-pill px-2.5 py-1 text-xs ${outlineMode === "with" ? "fx-pill--active" : ""}`}
            >
              有
            </button>
            <button
              type="button"
              onClick=${() => setOutlineMode("without")}
              className=${`fx-pill px-2.5 py-1 text-xs ${outlineMode === "without" ? "fx-pill--active" : ""}`}
            >
              无（下一步建议）
            </button>
          </div>
        `}
        ${showDebugPills &&
        html`
          <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            <span className="mr-1 shrink-0 self-center text-[10px] text-fxSub">debug</span>
            ${[
              ["normal", "正常数据"],
              ["empty", "空状态"],
              ["no3d", "无模型/无趋势"],
            ].map(
              ([key, label]) => html`
                <button
                  key=${key}
                  onClick=${() => {
                    setScenario(key);
                  }}
                  className=${`fx-pill whitespace-nowrap px-3 py-1 text-xs ${scenario === key ? "fx-pill--active" : ""}`}
                >
                  ${label}
                </button>
              `,
            )}
          </div>
        `}
      </header>

      ${page}

      <${BottomNav} currentTab=${tab} onChange=${setTab} />

      ${toast &&
      html`
        <div className="fixed bottom-[max(5.5rem,env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs text-white shadow-lg">
          ${toast}
        </div>
      `}
    </main>
  `;
}
