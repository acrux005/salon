import { ClipboardList, ShieldCheck, ImageIcon, TestTube } from "lucide-react";

const features = [
  { icon: ClipboardList, title: "Indywidualny plan terapii" },
  { icon: TestTube, title: "Certyfikowane preparaty" },
  { icon: ShieldCheck, title: "Bezpieczne procedury" },
  { icon: ImageIcon, title: "Widoczne efekty" },
];

export function Features() {
  return (
    <section className="border-t border-neutral-200/60 bg-gradient-to-b from-neutral-50/80 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-pink-200/60 bg-white/80 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full border border-pink-200 flex items-center justify-center flex-shrink-0 bg-white">
                <Icon className="w-5 h-5 text-pink-400" />
              </div>
              <span className="text-sm font-medium text-[#1F1A1C]">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
