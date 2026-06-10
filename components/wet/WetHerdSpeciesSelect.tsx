import { speciesCategories, catalogForHerdSelect } from "@/lib/vet/species";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
};

export function WetHerdSpeciesSelect({ value, onChange, className = "wet-input mt-1", required }: Props) {
  const entries = catalogForHerdSelect();
  const categories = speciesCategories(entries);

  return (
    <select
      className={className}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
    >
      {categories.map((cat) => (
        <optgroup key={cat} label={cat}>
          {entries
            .filter((s) => s.category === cat)
            .map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}
