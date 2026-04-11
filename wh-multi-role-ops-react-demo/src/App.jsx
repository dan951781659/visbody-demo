import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import AppShell from "./components/AppShell";
import FilterBar from "./components/FilterBar";
import { LoadingState } from "./components/StateBlock";
import {
  coachOptions,
  dateOptions,
  groupOptions,
  roles
} from "./config/roles";
import {
  coachMembers,
  hqStoreRows,
  initialState,
  ownerActionRows
} from "./mock/data";
import {
  CoachMembersPage,
  CoachWorkbenchPage,
  HQOverviewPage,
  HQStoresPage,
  OwnerAnalysisPage,
  OwnerOverviewPage
} from "./pages/rolePages";

const datasets = {
  hqStoreRows,
  ownerActionRows,
  coachMembers
};

export default function App() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const deferredSearch = useDeferredValue(state.search);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  function mutateWithLoading(mutator) {
    setLoading(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      startTransition(() => {
        setState((previous) => mutator(previous));
        setLoading(false);
      });
    }, 220);
  }

  function changeRole(nextRole) {
    if (nextRole === state.role) return;
    mutateWithLoading((previous) => ({
      ...previous,
      role: nextRole,
      page: roles[nextRole].pages[0].key,
      search: ""
    }));
  }

  function changePage(nextPage) {
    if (nextPage === state.page) return;
    mutateWithLoading((previous) => ({ ...previous, page: nextPage }));
  }

  function changeTier(nextTier) {
    if (nextTier === state.tier) return;
    mutateWithLoading((previous) => ({ ...previous, tier: nextTier }));
  }

  function changeDate(nextDate) {
    if (nextDate === state.date) return;
    mutateWithLoading((previous) => ({ ...previous, date: nextDate }));
  }

  const roleMeta = roles[state.role];
  const pageMeta = roleMeta.pages.find((page) => page.key === state.page);
  const pageState = { ...state, search: deferredSearch };

  let filters = [];
  if (state.role === "hq") {
    filters = [
      { key: "group", value: state.group, options: groupOptions, onChange: (value) => setState((prev) => ({ ...prev, group: value })) }
    ];
  } else if (state.role === "owner") {
    filters = [
      { key: "coach", value: state.coach, options: coachOptions, onChange: (value) => setState((prev) => ({ ...prev, coach: value })) }
    ];
  } else {
    filters = [];
  }

  let content = null;
  if (loading) {
    content = <LoadingState />;
  } else if (state.role === "hq" && state.page === "overview") {
    content = <HQOverviewPage state={pageState} data={datasets} onStoreSelect={(id) => setState((prev) => ({ ...prev, selectedStore: id }))} />;
  } else if (state.role === "hq" && state.page === "stores") {
    content = <HQStoresPage state={pageState} data={datasets} onStoreSelect={(id) => setState((prev) => ({ ...prev, selectedStore: id }))} />;
  } else if (state.role === "owner" && state.page === "overview") {
    content = <OwnerOverviewPage state={pageState} data={datasets} onOwnerSelect={(id) => setState((prev) => ({ ...prev, selectedOwner: id }))} />;
  } else if (state.role === "owner" && state.page === "analysis") {
    content = <OwnerAnalysisPage state={pageState} data={datasets} onOwnerSelect={(id) => setState((prev) => ({ ...prev, selectedOwner: id }))} />;
  } else if (state.role === "coach" && state.page === "workbench") {
    content = <CoachWorkbenchPage state={pageState} data={datasets} onCoachSelect={(id) => setState((prev) => ({ ...prev, selectedCoach: id }))} />;
  } else if (state.role === "coach" && state.page === "member") {
    content = <CoachMembersPage state={pageState} data={datasets} onCoachSelect={(id) => setState((prev) => ({ ...prev, selectedCoach: id }))} />;
  } else {
    content = <CoachWorkbenchPage state={pageState} data={datasets} onCoachSelect={(id) => setState((prev) => ({ ...prev, selectedCoach: id }))} />;
  }

  return (
    <AppShell
      roles={roles}
      currentRole={state.role}
      currentPage={state.page}
      onRoleChange={changeRole}
      onPageChange={changePage}
    >
      <header className="workspace-head">
        <div>
          <h1 className="page-title">{pageMeta.label}</h1>
          <div className="page-sub">{roleMeta.principle} · {pageMeta.subtitle}</div>
        </div>
        <div className="workspace-status">
          <span className="tiny-pill">{roleMeta.label}</span>
          <span className="tiny-pill">{state.tier === "pro" ? "Pro 全量指标" : "非 Pro 基础指标"}</span>
        </div>
      </header>

      <FilterBar
        search={state.search}
        onSearchChange={(value) => setState((prev) => ({ ...prev, search: value.trimStart() }))}
        dateOptions={dateOptions}
        activeDate={state.date}
        onDateChange={changeDate}
        filters={filters}
        tier={state.tier}
        onTierChange={changeTier}
        onRefresh={() => mutateWithLoading((previous) => previous)}
      />

      <div className="content">{content}</div>
    </AppShell>
  );
}
