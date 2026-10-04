import React from 'react';
import { X, CheckCircle2, Calendar, MapPin, Users } from 'lucide-react';
import { Reservation } from '../../types/restaurant';

interface BookingConfirmationModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onViewAllReservations: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  reservation,
  onClose,
  onViewAllReservations,
}) => {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-[32px] overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Top Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Icon & Header */}
        <div className="text-center space-y-1.5">
          <div className="w-13 h-13 rounded-2xl terracotta-gradient-bg text-white mx-auto flex items-center justify-center shadow-md shadow-amber-900/15">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="font-luxury text-2xl font-bold text-stone-900 tracking-tight">
            Reservation Confirmed
          </h2>
          <div className="inline-block px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-mono text-xs font-bold shadow-xs">
            Pass ID: {reservation.booking_id}
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-4 text-center mx-auto w-56 shadow-sm">
          <div className="border-[3px] border-stone-900 rounded-2xl p-2 bg-white relative">
            <svg viewBox="0 0 100 100" className="w-full h-auto text-slate-950">
              <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="12" y="12" width="11" height="11" fill="currentColor" />

              <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="77" y="12" width="11" height="11" fill="currentColor" />

              <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
              <rect x="12" y="77" width="11" height="11" fill="currentColor" />

              <rect x="36" y="8" width="6" height="22" fill="currentColor" />
              <rect x="46" y="16" width="18" height="6" fill="currentColor" />
              <rect x="10" y="38" width="24" height="6" fill="currentColor" />
              <rect x="70" y="36" width="22" height="6" fill="currentColor" />
              <rect x="40" y="40" width="20" height="20" rx="4" fill="#c2410c" />

              <circle cx="50" cy="50" r="5" fill="white" />

              <rect x="38" y="70" width="18" height="6" fill="currentColor" />
              <rect x="44" y="82" width="24" height="6" fill="currentColor" />
              <rect x="72" y="72" width="8" height="16" fill="currentColor" />
            </svg>
          </div>
          <div className="mt-2 text-[10px] text-stone-600 font-bold uppercase tracking-widest">
            Present QR code at Arrival Foyer
          </div>
        </div>

        {/* Reservation Details Card */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-stone-700">
            <span className="flex items-center gap-1.5 text-stone-500">
              <Calendar className="w-3.5 h-3.5 text-amber-700" /> Date &amp; Time
            </span>
            <span className="font-semibold text-stone-900 font-mono">
              {reservation.reservation_date} · {reservation.reservation_time}
            </span>
          </div>

          <div className="flex items-center justify-between text-stone-700">
            <span className="flex items-center gap-1.5 text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-amber-700" /> Table Allocation
            </span>
            <span className="font-bold text-amber-800 font-mono">{reservation.table_number}</span>
          </div>

          <div className="flex items-center justify-between text-stone-700">
            <span className="flex items-center gap-1.5 text-stone-500">
              <Users className="w-3.5 h-3.5 text-amber-700" /> Party Size
            </span>
            <span className="font-semibold text-stone-900">{reservation.guest_count} Diners</span>
          </div>

          {reservation.deposit_amount > 0 && (
            <div className="pt-2 border-t border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-emerald-800 font-medium">
                <span>Guaranteed Deposit (Paid):</span>
                <span className="font-mono font-bold">${reservation.deposit_amount.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 leading-snug">
                ✓ <strong>100% Credited:</strong> Present this QR pass to your server upon arrival to deduct ${reservation.deposit_amount.toFixed(2)} from your final bill.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onViewAllReservations}
            className="w-full py-2.5 terracotta-gradient-bg hover:brightness-105 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-amber-900/15 cursor-pointer text-center"
          >
            View in My Reservations
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-100 text-stone-700 hover:text-stone-950 hover:bg-stone-200 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
