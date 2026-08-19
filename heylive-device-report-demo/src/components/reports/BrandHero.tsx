import heyliveLogo from "@/assets/heylive-logo.png";

export function BrandHero() {
  return (
    <header className="relative isolate h-[188px] overflow-hidden bg-white text-[#20191a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_10%,rgba(227,25,55,0.13),transparent_27%),linear-gradient(90deg,#ffffff_0%,#ffffff_72%,#f3e4e1_100%)]" />
      <div className="absolute -right-12 top-8 h-40 w-40 rotate-45 border border-[#7b6064]/10" />
      <div className="absolute -right-2 top-16 h-28 w-28 rotate-45 border border-[#e31937]/25" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e31937]/55 to-transparent" />

      <div className="relative flex h-full flex-col justify-between px-5 pb-5 pt-4">
        <div
          className="flex h-[68px] w-[284px] items-center overflow-hidden"
          aria-label="HEYLIVE 好奈"
        >
          <img src={heyliveLogo} alt="HEYLIVE 好·奈" className="h-auto w-full object-contain" />
        </div>

        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#7f676a]">
            Personalized Sleep Support
          </p>
          <h1 className="text-[27px] font-semibold tracking-[0.05em] text-[#20191a]">
            AI 睡眠专家分析报告
          </h1>
          <div className="mt-2 h-[3px] w-10 bg-[#e31937]" />
        </div>
      </div>
    </header>
  );
}
