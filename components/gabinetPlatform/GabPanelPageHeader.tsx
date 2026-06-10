export function GabPanelPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-gab-sky/20 px-4 py-6 lg:px-8">
      <h1 className="text-xl font-bold text-gab-navy sm:text-2xl">{title}</h1>
      {description ? <p className="mt-1 text-[14px] text-slate-600">{description}</p> : null}
    </header>
  );
}
