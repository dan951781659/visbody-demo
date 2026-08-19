interface ReportTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

/** 共用 tab：白底，下划线高亮（来自体态报告页 SubTabs 风格） */
export function ReportTabs({ tabs, active, onChange }: ReportTabsProps) {
  return (
    <div className="bg-white border-b border-border">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 py-2.5">
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className="relative px-3 py-1 text-[14px] whitespace-nowrap flex-shrink-0"
            >
              <span className={isActive ? "text-sky-600 font-semibold" : "text-slate-500"}>
                {t}
              </span>
              {isActive && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-6 h-[2px] rounded-full bg-sky-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
