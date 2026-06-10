"use client";

import { useState } from "react";
import { Printer, FileDown } from "lucide-react";
import { updateOrderStatusAction } from "@/app/panel/actions/orders";

type OrderItem = { id: string; name: string; pricePlz: number; quantity: number };
type Order = {
  id: string;
  publicNumber: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  type: string;
  deliveryAddress: string | null;
  scheduledDate: string;
  scheduledSlot: string;
  status: string;
  totalPlz: number;
  note: string | null;
  createdAt: Date;
  items: OrderItem[];
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nowe",
  confirmed: "Potwierdzone",
  preparing: "W przygotowaniu",
  ready: "Gotowe",
  completed: "Zrealizowane",
  cancelled: "Anulowane",
};

function orderLabel(order: Order): string {
  return order.publicNumber ?? `#${order.id.slice(0, 8)}`;
}

function getOrderPrintHtml(order: Order): string {
  const label = orderLabel(order);
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Zamówienie ${label}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
    h1 { font-size: 1.25rem; margin: 0 0 1rem 0; border-bottom: 2px solid #ea580c; padding-bottom: 0.5rem; }
    p, li { margin: 0.25rem 0; }
    ul { list-style: none; padding: 0; margin: 0.5rem 0; }
    li { padding: 0.25rem 0; border-bottom: 1px solid #e7e5e4; }
    .total { font-weight: 700; font-size: 1.125rem; margin-top: 1rem; color: #ea580c; }
    .note { background: #fffbeb; padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem; font-size: 0.875rem; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Zamówienie ${label}</h1>
  <p><strong>${order.customerName}</strong></p>
  <p>Tel: ${order.customerPhone}</p>
  ${order.customerEmail ? `<p>Email: ${order.customerEmail}</p>` : ""}
  <p>Termin: ${order.scheduledDate} · ${order.scheduledSlot}</p>
  <p>${order.type === "delivery" ? "Dostawa" : "Odbiór"}</p>
  ${order.deliveryAddress ? `<p>Adres: ${order.deliveryAddress}</p>` : ""}
  <ul>
    ${order.items.map((i) => `<li>${i.name} × ${i.quantity} — ${(i.pricePlz * i.quantity).toFixed(2)} zł</li>`).join("")}
  </ul>
  <p class="total">Razem: ${order.totalPlz.toFixed(2)} zł</p>
  ${order.note ? `<p class="note">Uwagi: ${order.note}</p>` : ""}
</body>
</html>`;
}

function printOrder(order: Order) {
  const html = getOrderPrintHtml(order);
  const w = window.open("", "_blank", "width=500,height=600");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 150);
}

function downloadOrderHtml(order: Order) {
  const html = getOrderPrintHtml(order);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = orderLabel(order).replace(/[^a-zA-Z0-9_-]+/g, "_");
  a.download = `zamowienie-${safe}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OrdersList({ orders }: { orders: Order[] }) {
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("");

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  async function handleStatusChange(orderId: string, newStatus: string) {
    setError("");
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.ok) window.location.reload();
    else setError(res.error);
  }

  if (orders.length === 0) {
    return <p className="mt-6 text-stone-600">Brak zamówień.</p>;
  }

  return (
    <div className="mt-6">
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setFilter("")} className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === "" ? "bg-zamow-orange-600 text-white" : "bg-stone-200 text-stone-700"}`}>Wszystkie</button>
        {["new", "confirmed", "preparing", "ready", "completed", "cancelled"].map((s) => (
          <button key={s} type="button" onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === s ? "bg-zamow-orange-600 text-white" : "bg-stone-200 text-stone-700"}`}>{STATUS_LABELS[s] ?? s}</button>
        ))}
      </div>
      <ul className="space-y-4">
        {filtered.map((order) => (
          <li key={order.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zamow-orange-600">Zamówienie {orderLabel(order)}</p>
                <p className="mt-0.5 font-medium text-stone-900">{order.customerName} · {order.customerPhone}</p>
                <p className="text-sm text-stone-600">{order.scheduledDate} {order.scheduledSlot} · {order.type === "delivery" ? "Dostawa" : "Odbiór"}</p>
                {order.deliveryAddress && <p className="text-sm text-stone-600">Adres: {order.deliveryAddress}</p>}
                <p className="mt-1 text-sm font-medium text-zamow-orange-600">{order.totalPlz} zł</p>
                {order.note && <p className="mt-1 text-sm text-stone-500">Uwagi: {order.note}</p>}
                <ul className="mt-2 text-sm text-stone-600">
                  {order.items.map((i) => (
                    <li key={i.id}>{i.name} × {i.quantity} — {i.pricePlz * i.quantity} zł</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${order.status === "new" ? "bg-amber-100 text-amber-800" : order.status === "completed" ? "bg-green-100 text-green-800" : order.status === "cancelled" ? "bg-stone-200 text-stone-600" : "bg-blue-100 text-blue-800"}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => printOrder(order)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                    title="Drukuj"
                  >
                    <Printer className="h-4 w-4" />
                    Drukuj
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadOrderHtml(order)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                    title="Pobierz plik do druku"
                  >
                    <FileDown className="h-4 w-4" />
                    Plik
                  </button>
                </div>
                {order.status !== "completed" && order.status !== "cancelled" && (
                  <select
                    value=""
                    onChange={(e) => { const v = e.target.value; if (v) handleStatusChange(order.id, v); }}
                    className="rounded-lg border border-stone-300 px-2 py-1.5 text-sm"
                  >
                    <option value="">Zmień status…</option>
                    <option value="confirmed">Potwierdzone</option>
                    <option value="preparing">W przygotowaniu</option>
                    <option value="ready">Gotowe</option>
                    <option value="completed">Zrealizowane</option>
                    <option value="cancelled">Anulowane</option>
                  </select>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
