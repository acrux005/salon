"use client";

import { useState } from "react";
import { addGabClinicMemberAction, removeGabClinicMemberAction } from "@/app/actions/gabinetSettings";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type MemberRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export function GabTeamClient({ members }: { members: MemberRow[] }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "reception" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("email", form.email);
    fd.set("password", form.password);
    fd.set("role", form.role);
    const res = await addGabClinicMemberAction(fd);
    setLoading(false);
    if (!res.ok) setErr(res.error);
    else {
      setMsg("Dodano użytkownika zespołu.");
      window.location.reload();
    }
  }

  async function remove(id: string) {
    if (!confirm("Usunąć konto zespołu?")) return;
    const res = await removeGabClinicMemberAction(id);
    if (!res.ok) setErr(res.error);
    else window.location.reload();
  }

  return (
    <>
      <GabPanelPageHeader
        title="Zespół"
        description="Dodatkowe konta recepcji — logowanie tym samym adresem co właściciel, osobne hasło."
      />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/ustawienia" className="text-[14px] text-gab-sky hover:underline">
          ← Ustawienia
        </GabLink>

        <ul className="mt-6 space-y-2">
          {members.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gab-sky/15 bg-white px-4 py-3">
              <div>
                <p className="font-medium text-gab-navy">{m.name}</p>
                <p className="text-[13px] text-slate-500">
                  {m.email} · {m.role === "admin" ? "Administrator" : "Recepcja"}
                </p>
              </div>
              <button type="button" onClick={() => remove(m.id)} className="text-[13px] text-red-600 hover:underline">
                Usuń
              </button>
            </li>
          ))}
          {members.length === 0 && <li className="text-[14px] text-slate-500">Brak dodatkowych kont — tylko właściciel.</li>}
        </ul>

        <form onSubmit={addMember} className="mt-8 max-w-md space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
          <h2 className="font-semibold text-gab-navy">Nowe konto</h2>
          {msg && <p className="text-[14px] text-green-700">{msg}</p>}
          {err && <p className="text-[14px] text-red-700">{err}</p>}
          <input className="gab-input" required placeholder="Imię" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input type="email" className="gab-input" required placeholder="E-mail logowania" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input type="password" minLength={10} className="gab-input" required placeholder="Hasło (min. 10 znaków)" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <select className="gab-input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="reception">Recepcja</option>
            <option value="admin">Administrator</option>
          </select>
          <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
            {loading ? "Dodaję…" : "Dodaj użytkownika"}
          </button>
        </form>
      </div>
    </>
  );
}
