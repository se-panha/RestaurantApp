import React, { useState } from 'react';
import {
  ChefHat,
  Receipt,
  CalendarCheck,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  QrCode,
  DollarSign,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { Order, Reservation, Table, OrderStatus, TableStatus } from '../../types/restaurant';
import { playSuccessChime } from '../../utils/audioChime';

interface AdminPortalProps {
  orders: Order[];
  reservations: Reservation[];
  tables: Table[];
  onAdvanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onUpdateTableStatus: (tableId: string, status: TableStatus) => void;
  onCheckInReservation: (bookingId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  reservations,
  tables,
  onAdvanceOrderStatus,
  onUpdateTableStatus,
  onCheckInReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'tables'>('orders');
  const [scannedQrInput, setScannedQrInput] = useState('');
  const [checkInFeedback, setCheckInFeedback] = useState<string | null>(null);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.order_status !== 'completed' && o.order_status !== 'cancelled').length;
  const confirmedReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    placed: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'served',
    served: 'completed',
    completed: null,
    cancelled: null,
  };

  const handleAdvance = (orderId: string, next: OrderStatus) => {
    onAdvanceOrderStatus(orderId, next);
    playSuccessChime();
  };

  const handleSimulateQrScan = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = scannedQrInput.trim();
    const found = reservations.find((r) => r.booking_id === clean || r.qr_code_data.includes(clean));
    if (found) {
      onCheckInReservation(found.booking_id);
      playSuccessChime();
      setCheckInFeedback(`✓ Guest Checked In! Seat Assigned: ${found.table_number} (${found.guest_count} Diners)`);
      setScannedQrInput('');
      setTimeout(() => setCheckInFeedback(null), 4000);
    } else {
      setCheckInFeedback('❌ Invalid QR code or Booking ID not found.');
      setTimeout(() => setCheckInFeedback(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Title Header in Crisp White Card */}
      <div className="bg-white/95 rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-widest">
            <ChefHat className="w-4 h-4 text-emerald-700" />
            <span>Part 2: Restaurant Management System (Admin &amp; Staff KDS)</span>
          </div>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Kitchen Display &amp; Maitre D' Portal
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Control live order statuses, table seating, and QR check-ins in real time. Advancements reflect immediately on customer mobile apps.
          </p>
        </div>

        {/* Live Metrics Row */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-right shadow-xs">
            <span className="text-[10px] text-stone-500 uppercase block font-semibold">Total Revenue</span>
            <span className="text-sm font-bold text-emerald-700 font-mono">${totalRevenue.toFixed(2)}</span>
          </div>

          <div className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-right shadow-xs">
            <span className="text-[10px] text-stone-500 uppercase block font-semibold">Live Cooking</span>
            <span className="text-sm font-bold text-amber-700 font-mono">{activeOrdersCount}</span>
          </div>

          <div className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-right shadow-xs">
            <span className="text-[10px] text-stone-500 uppercase block font-semibold">Seated Passes</span>
            <span className="text-sm font-bold text-sky-700 font-mono">{confirmedReservationsCount}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'terracotta-gradient-bg text-white shadow-sm shadow-amber-900/15'
              : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Active Kitchen Orders ({activeOrdersCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'reservations'
              ? 'terracotta-gradient-bg text-white shadow-sm shadow-amber-900/15'
              : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Door Host Arrival Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tables'
              ? 'terracotta-gradient-bg text-white shadow-sm shadow-amber-900/15'
              : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Floor Plan Table Manager</span>
        </button>
      </div>

      {/* 1. ORDERS BOARD */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Kitchen Display System (KDS) — Click button to advance status for live customer tracking</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => {
              const nextStatus = nextStatusMap[order.order_status];
              const isCompleted = order.order_status === 'completed';

              return (
                <div
                  key={order.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isCompleted
                      ? 'bg-stone-50/80 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-stone-900">
                        {order.order_number}
                      </span>
                      <div className="text-[11px] text-stone-500 mt-0.5 font-medium">
                        {order.order_type === 'dine_in' ? `Table ${order.table_number}` : 'Takeaway Pickup'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold font-mono text-amber-800">
                        ${order.total.toFixed(2)}
                      </span>
                      <div className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                        {order.order_status}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-3 space-y-1.5 text-xs">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-stone-700">
                        <span>
                          <strong className="text-stone-900">{item.quantity}x</strong> {item.product.name} ({item.selectedSize.name})
                        </span>
                        <span className="text-stone-500 font-mono">${item.itemTotal.toFixed(2)}</span>
                      </div>
                    ))}
                    {order.special_request && (
                      <div className="p-2.5 bg-amber-50 rounded-xl text-[11px] text-amber-900 italic border border-amber-200">
                        "{order.special_request}"
                      </div>
                    )}
                  </div>

                  {/* Staff Advance Button */}
                  <div className="pt-2 border-t border-stone-200">
                    {nextStatus ? (
                      <button
                        onClick={() => handleAdvance(order.id, nextStatus)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Advance to: {nextStatus.toUpperCase()}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="text-center text-xs text-stone-500 py-1 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Order Completed &amp; Settled</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. RESERVATIONS & DOOR QR SCANNER */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-800" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Maitre D' Arrival QR Scanner
              </h3>
            </div>
            <p className="text-xs text-stone-600">
              When arriving patrons present their booking QR code, scan or enter the Booking ID (e.g. <code className="text-amber-800 font-mono font-bold">RES-000125</code>):
            </p>

            <form onSubmit={handleSimulateQrScan} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={scannedQrInput}
                onChange={(e) => setScannedQrInput(e.target.value)}
                placeholder="Scan or type RES-000125..."
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 font-mono focus:outline-none focus:border-amber-600 shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                Check-in Guest
              </button>
            </form>

            {checkInFeedback && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-semibold">
                {checkInFeedback}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-200 font-bold text-xs text-stone-900">
              Upcoming Reservations ({reservations.length})
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-600 font-mono text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Type &amp; Table</th>
                    <th className="p-3.5">Date / Time</th>
                    <th className="p-3.5">Guests</th>
                    <th className="p-3.5">Deposit</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Host Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-amber-800">{res.booking_id}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-stone-900">{res.table_number}</span>
                        <span className="text-[10px] text-stone-500 block capitalize">{res.reservation_type}</span>
                      </td>
                      <td className="p-3.5">{res.reservation_date} at {res.reservation_time}</td>
                      <td className="p-3.5 font-mono">{res.guest_count} Diners</td>
                      <td className="p-3.5 font-mono text-emerald-700 font-semibold">
                        {res.deposit_amount > 0 ? `$${res.deposit_amount.toFixed(2)} (Paid)` : 'None'}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {res.status === 'confirmed' ? (
                          <button
                            onClick={() => onCheckInReservation(res.booking_id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          >
                            Door Check-in
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-500 font-medium">Checked-in</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TABLE FLOOR MANAGER */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
            <span>Click any table to cycle status (Available → Occupied → Reserved → Cleaning)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Available</span>
              <span className="flex items-center gap-1 text-rose-800 font-semibold"><span className="w-2 h-2 rounded-full bg-rose-600"></span> Occupied</span>
              <span className="flex items-center gap-1 text-amber-800 font-semibold"><span className="w-2 h-2 rounded-full bg-amber-600"></span> Reserved</span>
              <span className="flex items-center gap-1 text-sky-800 font-semibold"><span className="w-2 h-2 rounded-full bg-sky-600"></span> Cleaning</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {tables.map((table) => {
              const statusColors: Record<TableStatus, string> = {
                available: 'border-emerald-300 bg-emerald-50/70 text-emerald-950',
                occupied: 'border-rose-300 bg-rose-50/70 text-rose-950',
                reserved: 'border-amber-300 bg-amber-50/70 text-amber-950',
                cleaning: 'border-sky-300 bg-sky-50/70 text-sky-950',
              };

              const nextStatusCycle: Record<TableStatus, TableStatus> = {
                available: 'occupied',
                occupied: 'cleaning',
                cleaning: 'available',
                reserved: 'occupied',
              };

              return (
                <div
                  key={table.id}
                  onClick={() => onUpdateTableStatus(table.id, nextStatusCycle[table.status])}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all hover:scale-102 shadow-xs ${statusColors[table.status]}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-extrabold text-stone-900 font-mono">{table.table_number}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-stone-200 uppercase font-bold text-stone-800 shadow-xs">
                      {table.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-700 mt-1 font-medium">{table.area_name}</div>
                  {table.ambiance_description && (
                    <div className="text-[10px] text-stone-500 line-clamp-1 mt-1 italic">
                      "{table.ambiance_description}"
                    </div>
                  )}
                  <div className="text-[10px] text-stone-500 mt-2 flex justify-between pt-1 border-t border-stone-200">
                    <span>Capacity: {table.capacity}p</span>
                    <span className="text-amber-800 font-bold hover:underline">Cycle status ↻</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
