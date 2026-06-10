"use client";

import { useMemo, useRef, useState } from "react";
import {
  MAX_INTEREST_TAGS,
  RANDKI_INTEREST_CATEGORIES,
  RANDKI_INTEREST_TAG_SUGGESTIONS,
  getCategoryLabel,
  normalizeInterestTag,
  searchInterestSuggestions,
  type InterestTagCategory,
} from "@/lib/randki/interestTags";

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export function RandkiInterestPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const atMax = value.length >= MAX_INTEREST_TAGS;

  const suggestions = useMemo(
    () => (open && !atMax ? searchInterestSuggestions(query, value, 8) : []),
    [query, value, open, atMax]
  );

  function addTag(raw: string) {
    const tag = normalizeInterestTag(raw);
    if (!tag) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    if (value.length >= MAX_INTEREST_TAGS) return;
    onChange([...value, tag]);
    setQuery("");
    setOpen(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function toggleSuggested(tag: string) {
    if (value.includes(tag)) removeTag(tag);
    else addTag(tag);
  }

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-randki-muted">
        Rzeczy które tworzą Ciebie — nie checklista. Max {MAX_INTEREST_TAGS} tagów, własne też OK.
      </p>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-gradient-to-br from-rose-50 to-violet-50 px-3 py-1.5 text-[13px] font-medium text-rose-900 shadow-sm transition hover:border-rose-300"
              title="Usuń"
            >
              {tag}
              <span className="text-[11px] text-rose-400 group-hover:text-rose-600">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          className="randki-input w-full"
          placeholder={atMax ? "Masz max tagów — usuń jeden, żeby dodać" : "Wpisz własny tag, np. nocne spacery…"}
          value={query}
          disabled={atMax}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions[0]) addTag(suggestions[0].tag);
              else if (query.trim()) addTag(query);
            }
            if (e.key === "Escape") setOpen(false);
          }}
        />
        {open && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-rose-100 bg-white py-1 shadow-lg">
            {suggestions.map(({ tag, category }) => (
              <li key={tag}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-rose-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addTag(tag)}
                >
                  <span>{tag}</span>
                  <span className="text-[10px] uppercase tracking-wide text-randki-muted">{getCategoryLabel(category)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {RANDKI_INTEREST_CATEGORIES.map((cat) => (
        <CategoryRow
          key={cat.id}
          category={cat.id}
          label={cat.label}
          hint={cat.hint}
          tags={RANDKI_INTEREST_TAG_SUGGESTIONS[cat.id]}
          selected={value}
          disabled={atMax}
          onToggle={toggleSuggested}
        />
      ))}
    </div>
  );
}

function CategoryRow({
  category,
  label,
  hint,
  tags,
  selected,
  disabled,
  onToggle,
}: {
  category: InterestTagCategory;
  label: string;
  hint: string;
  tags: readonly string[];
  selected: string[];
  disabled: boolean;
  onToggle: (tag: string) => void;
}) {
  void category;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-randki-muted">
        {label} <span className="font-normal normal-case tracking-normal text-randki-muted/70">· {hint}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              disabled={disabled && !active}
              onClick={() => onToggle(tag)}
              className={`rounded-full px-2.5 py-1 text-[12px] transition ${
                active
                  ? "bg-rose-600 text-white shadow-sm"
                  : disabled
                    ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                    : "border border-rose-100 bg-white text-rose-800 hover:border-rose-300 hover:bg-rose-50"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
