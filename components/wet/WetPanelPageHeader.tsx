export function WetPanelPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-wet-teal-100 px-4 py-6 lg:px-8">
      <h1 className="text-xl font-bold text-wet-navy sm:text-2xl">{title}</h1>
      {description ? <p className="mt-1 text-[14px] text-wet-navy-muted">{description}</p> : null}
    </header>
  );
}
