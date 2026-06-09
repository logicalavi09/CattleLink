import Link from "next/link";
import type { CattleCategory } from "@/models/cattle";

import { categories } from "@/constants";

export function CategoryGrid({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="-mx-1 overflow-x-auto pb-2 lg:mx-0 lg:overflow-visible">
      <div className="flex min-w-max gap-4 px-1 lg:min-w-0 lg:grid lg:grid-cols-5 lg:px-0">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            category={category}
            Icon={category.icon}
            href={`/?category=${category.name.toLowerCase()}`}
            active={activeCategory === category.name.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  Icon,
  href,
  active,
}: {
  category: CattleCategory;
  Icon: CattleCategory["icon"];
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-[150px] flex-1 snap-start flex-col items-start gap-3 rounded-3xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? "border-brand-500 bg-brand-50 shadow-brand-200"
          : "border-brand-100 bg-white hover:border-brand-300"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className={`text-base font-semibold ${active ? "text-brand-800" : "text-ink-900"}`}>
          {category.name}
        </h3>
        <p className="mt-1 text-sm leading-5 text-slate-600">{category.description}</p>
      </div>
    </Link>
  );
}
