import sidianMattress from "@/assets/heylive-sidian-mattress.jpg";
import berlinProMattress from "@/assets/heylive-berlin-pro-mattress-clean.png";
import louisVilanMattress from "@/assets/heylive-louis-vilan-mattress.jpg";

type MattressProduct = {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  specification: string;
  firmness: string;
  priceLevel: number;
  label: string;
  bmiRange: string;
};

const MATTRESS_PRODUCTS: MattressProduct[] = [
  {
    id: "sidian",
    name: "斯蒂安",
    image: sidianMattress,
    imageAlt: "好奈斯蒂安床垫",
    specification: "1.8 × 2.0 × 30 cm",
    firmness: "软",
    priceLevel: 3,
    label: "绿色标签",
    bmiRange: "16–24",
  },
  {
    id: "berlin-pro",
    name: "柏林-Pro",
    image: berlinProMattress,
    imageAlt: "好奈柏林-Pro床垫",
    specification: "1.8 × 2.0 × 28 cm",
    firmness: "偏软",
    priceLevel: 3,
    label: "绿色标签",
    bmiRange: "16–24",
  },
  {
    id: "louis-vilan",
    name: "路易威兰",
    image: louisVilanMattress,
    imageAlt: "好奈路易威兰床垫",
    specification: "1.8 × 2.0 × 29 cm",
    firmness: "柔软贴合",
    priceLevel: 3,
    label: "绿色标签",
    bmiRange: "16–24",
  },
];

function MattressProductCard({ product }: { product: MattressProduct }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_14px_36px_rgba(80,18,28,0.08)]">
      <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-[#fbfaf8] px-2">
        <img src={product.image} alt={product.imageAlt} className="h-full w-full object-contain" />
        <div className="absolute right-3 top-3 rounded-full border border-emerald-200 bg-emerald-50/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          {product.label}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#c9152f]">
              HEYLIVE MATTRESS
            </div>
            <h3 className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">
              {product.name}
            </h3>
          </div>
          <div className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-right">
            <div className="text-[10px] text-red-400">适配 BMI</div>
            <div className="mt-0.5 text-[16px] font-bold tabular-nums text-[#c9152f]">
              {product.bmiRange}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            {product.specification}
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
            {product.firmness}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            价格等级 {product.priceLevel}
          </span>
        </div>
      </div>
    </article>
  );
}

export function MattressRecommendation() {
  return (
    <section className="mt-5" aria-labelledby="mattress-recommendation-title">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-[14px] text-[#c9152f]">
          ✦
        </span>
        <div>
          <h2 id="mattress-recommendation-title" className="text-[16px] font-semibold text-slate-800">
            床垫推荐
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">基于 BMI、体态与睡眠偏好综合匹配</p>
        </div>
      </div>

      <div className="space-y-4">
        {MATTRESS_PRODUCTS.map((product) => (
          <MattressProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
