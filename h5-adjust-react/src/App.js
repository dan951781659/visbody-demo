import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { BottomNav } from "./components/layout/BottomNav.js";
import { HomePage } from "./pages/HomePage.js";
import { MyPage } from "./pages/MyPage.js";
import { TrainingOutlinePage } from "./pages/TrainingOutlinePage.js";
import { TrainingPlanPage } from "./pages/TrainingPlanPage.js";
import { homeMock, myMock, outlineMock, trainingMock } from "./data/mockData.js";

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
  const [route, setRoute] = useState("home"); // home | my | outline | training
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState("normal"); // normal | empty | no3d
  const [homeData, setHomeData] = useState(clone(homeMock));
  const [outlineData, setOutlineData] = useState(clone(outlineMock));
  const [trainingData, setTrainingData] = useState(clone(trainingMock));
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, [scenario]);

  useEffect(() => {
    setLoading(true);
    if (scenario === "normal") {
      setHomeData(clone(homeMock));
      setOutlineData(clone(outlineMock));
      setTrainingData(clone(trainingMock));
    } else if (scenario === "empty") {
      setHomeData(null);
      setOutlineData(clone(outlineMock));
      setTrainingData({ ...clone(trainingMock), plan: { ...trainingMock.plan, status: "not_started" } });
    } else if (scenario === "no3d") {
      const next = clone(homeMock);
      next.model3d.hasModel = false;
      next.trends = [];
      setHomeData(next);
      setOutlineData(clone(outlineMock));
      setTrainingData(clone(trainingMock));
    }
  }, [scenario]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 1400);
    return () => clearTimeout(timer);
  }, [toast]);

  const page = useMemo(() => {
    if (route === "outline") {
      return html`
        <${TrainingOutlinePage}
          data=${outlineData}
          onBack=${() => setRoute(tab)}
          onGoPlan=${() => setRoute("training")}
        />
      `;
    }

    if (route === "training") {
      return html`
        <${TrainingPlanPage}
          data=${trainingData}
          onBackHome=${() => setRoute("outline")}
          onToast=${(m) => setToast(m)}
          onToggleTask=${(taskId) => {
            setTrainingData((prev) => {
              if (!prev?.trainingTabs?.train) return prev;
              const next = clone(prev);
              next.trainingTabs.train = next.trainingTabs.train.map((t) =>
                t.id === taskId ? { ...t, status: t.status === "done" ? "pending" : "done" } : t,
              );
              return next;
            });
          }}
        />
      `;
    }
    if (tab === "my") {
      return html`
        <${MyPage}
          data=${myMock}
          onNavigateOutline=${() => setRoute("outline")}
          onNavigatePlan=${() => setRoute("training")}
          onToast=${(m) => setToast(m)}
        />
      `;
    }
    return html`
      <${HomePage}
        loading=${loading}
        data=${homeData}
        onNavigateOutline=${() => setRoute("outline")}
        onToast=${(m) => setToast(m)}
      />
    `;
  }, [route, tab, loading, homeData, outlineData, trainingData]);

  const showDebugPills = isDebugDemo();

  return html`
    <main className="mx-auto min-h-screen w-full max-w-md">
      <header className="sticky top-0 z-20 border-b border-fxLine bg-[#070d1f]/85 px-4 py-3 backdrop-blur-[12px]">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-base font-extrabold tracking-wide text-transparent">
            Fittrix-FX · H5
          </h1>
          <span className="text-xs text-fxSub">
            ${route === "training" ? "训练计划" : route === "outline" ? "训练大纲" : tab === "home" ? "首页" : "我的"}
          </span>
        </div>
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
                    setRoute(tab);
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

      ${route === tab &&
      html`
        <${BottomNav}
          currentTab=${tab}
          onChange=${(nextTab) => {
            setTab(nextTab);
            setRoute(nextTab);
          }}
        />
      `}

      ${toast &&
      html`
        <div className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-xs text-white">
          ${toast}
        </div>
      `}
    </main>
  `;
}

