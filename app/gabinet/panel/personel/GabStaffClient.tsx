"use client";

import { useState } from "react";
import { deleteGabStaffAction, saveGabStaffAction } from "@/app/actions/gabinetSettings";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type StaffRow = {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  active: boolean;
};

const emptyForm = { id: "", name: "", phone: "", role: "doctor" };

export function GabStaffClient({ staff }: { staff: StaffRow[] }) {
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState(emptyForm);

  function startEdit(s: StaffRow) {
    setForm({ id: s.id, name: s.name, phone: s.phone ?? "", role: s.role });
    setMsg("");
  }

  function cancelEdit() {
    setForm(emptyForm);
  }

  async function saveStaff(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    fd.set("active", "true");
    const res = await saveGabStaffAction(fd);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    window.location.reload();
  }

  async function toggleActive(row: StaffRow) {
    const fd = new FormData();
    fd.set("id", row.id);
    fd.set("name", row.name);
    fd.set("phone", row.phone ?? "");
    fd.set("role", row.role);
    fd.set("active", row.active ? "false" : "true");
    await saveGabStaffAction(fd);
    window.location.reload();
  }

  async function remove(id: string) {
    if (!confirm("Usunąć / dezaktywować personel?")) return;
    await deleteGabStaffAction(id);
    window.location.reload();
  }

  return (
    <>
      <GabPanelPageHeader title="Personel" description="Lekarze i specjaliści widoczni w kalendarzu i rezerwacji online." />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/ustawienia" className="text-[14px] text-gab-sky hover:underline">
          ← Ustawienia
        </GabLink>
        <ul className="mt-6 space-y-2">
          {staff.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gab-sky/15 bg-white px-4 py-3">
              <div>
                <p className="font-medium text-gab-navy">
                  {s.name} {!s.active && <span className="text-[12px] text-slate-400">(nieaktywny)</span>}
                </p>
                <p className="text-[13px] text-slate-500">{s.role}{s.phone ? ` · ${s.phone}` : ""}</p>
              </div>
              <div className="flex gap-2 text-[12px]">
                <GabLink href={`/panel/personel/${s.id}/godziny`} className="text-gab-sky hover:underline">
                  Godziny
                </GabLink>
                <button type="button" onClick={() => startEdit(s)} className="text-gab-sky hover:underline">
                  Edytuj
                </button>
                <button type="button" onClick={() => toggleActive(s)} className="text-gab-sky hover:underline">
                  {s.active ? "Dezaktywuj" : "Aktywuj"}
                </button>
                <button type="button" onClick={() => remove(s.id)} className="text-red-600 hover:underline">
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={saveStaff} className="mt-8 max-w-md space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
          <h2 className="font-semibold text-gab-navy">{form.id ? "Edycja personelu" : "Dodaj osobę"}</h2>
          {msg && <p className="text-[14px] text-red-700">{msg}</p>}
          <input className="gab-input" required placeholder="Imię i nazwisko" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="gab-input" placeholder="Telefon" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <select className="gab-input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="doctor">Lekarz</option>
            <option value="hygienist">Higienistka</option>
            <option value="assistant">Asystent</option>
            <option value="specialist">Specjalista</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="gab-btn-primary flex-1">{form.id ? "Zapisz" : "Dodaj"}</button>
            {form.id && (
              <button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px]">
                Anuluj
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
