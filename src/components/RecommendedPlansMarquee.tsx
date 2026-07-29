import { AutoScrollCardsMarquee } from "@/components/AutoScrollCardsMarquee";
import { formatLibraryValue } from "@/data/exploreLibrary";
import type { PlanItem } from "@/types/content";

type RecommendedPlansMarqueeProps = {
  plans: PlanItem[];
  onPressPlan: (plan: PlanItem) => void;
};

export function RecommendedPlansMarquee({
  plans,
  onPressPlan,
}: RecommendedPlansMarqueeProps) {
  return (
    <AutoScrollCardsMarquee
      items={plans.map((plan, index) => ({
        id: plan.id,
        title: plan.name,
        subtitle: plan.summary,
        meta: `${formatLibraryValue(plan.cycleWeeks)} · ${formatLibraryValue(plan.scene)}`,
        badge: index === 0 ? "推荐" : undefined,
        gradient: plan.gradient,
      }))}
      onPressItem={(item) => {
        const plan = plans.find((entry) => entry.id === item.id);
        if (plan) onPressPlan(plan);
      }}
    />
  );
}
