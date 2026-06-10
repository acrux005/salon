import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 font-[var(--font-sans)] text-[13px] text-neutral-500"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>›</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-pink-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#6F5E64]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
