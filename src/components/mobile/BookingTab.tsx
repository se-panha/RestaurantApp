import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  ChevronRight,
  Compass,
  Wine,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Check,
  Info
} from 'lucide-react';
import {
  ReservationType,
  Table,
  ExtraReservationService,
  Reservation
} from '../../types/restaurant';
import { TABLES, EXTRA_SERVICES } from '../../data/restaurantData';
import { playTapChime, playSuccessChime } from '../../utils/audioChime';

interface BookingTabProps {
  onConfirmBooking: (booking: Omit<Reservation, 'id' | 'created_at'>) => void;
  myReservations: Reservation[];
  onViewReservationDetails: (reservation: Reservation) => void;
}

export const BookingTab: React.FC<BookingTabProps> = ({
  onConfirmBooking,
  myReservations,
  onViewReservationDetails,
}) => {
  const [reservationType, setReservationType] = useState<ReservationType>('table');
  const [reservationDate, setReservationDate] = useState('2026-10-15');
  const [reservationTime, setReservationTime] = useState('7:00 PM');
  const [guestCount, setGuestCount] = useState(4);
  const [selectedTable, setSelectedTable] = useState<Table | null>(TABLES[1]); // default T02 (4 diners)
  const [selectedExtras, setSelectedExtras] = useState<ExtraReservationService[]>([]);
  const [specialRequest, setSpecialRequest] = useState('');
  const [capacityWarning, setCapacityWarning] = useState<string | null>(null);

  // Deposit Policy: ALWAYS REQUIRED on all bookings to eliminate no-shows and guaranteed table hold
  // $10.00 per guest minimum table guarantee, or $50 for VIP suite / $80 for event buyout
  const baseRatePerGuest = 10.00;
  const minTableDeposit = reservationType === 'private_room'
    ? 50.00
    : reservationType === 'event'
    ? 80.00
    : 20.00;

  const tableDeposit = Math.max(minTableDeposit, guestCount * baseRatePerGuest);
  const extrasDeposit = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const depositAmount = tableDeposit + extrasDeposit;
  const isDepositRequired = true; // Always required for real restaurant protection

  const timeSlots = [
    '11:30 AM', '12:00 PM', '1:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
  ];

  const dates = [
    { label: 'Today', value: '2026-10-03' },
    { label: 'Tomorrow', value: '2026-10-04' },
    { label: 'Fri, Oct 10', value: '2026-10-10' },
    { label: 'Wed, Oct 15', value: '2026-10-15' },
    { label: 'Sat, Oct 18', value: '2026-10-18' },
  ];

  // Smart Party Size Stepper with Auto-Allocation
  const handleGuestCountChange = (newCount: number) => {
    playTapChime();
    const count = Math.max(1, Math.min(20, newCount));
    setGuestCount(count);
    setCapacityWarning(null);

    // If currently selected table is too small for the new party size, auto-switch to a suitable table!
    if (selectedTable && selectedTable.capacity < count) {
      const suitable = TABLES.find(
        (t) => t.status === 'available' && t.capacity >= count
      );
      if (suitable) {
        setSelectedTable(suitable);
      } else {
        setSelectedTable(null);
        setCapacityWarning(`Party size is ${count} diners. Please choose a banquet table or VIP suite.`);
      }
    }
  };

  const toggleExtra = (extra: ExtraReservationService) => {
    playTapChime();
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  // Table selection with strict capacity enforcement
  const handleTableClick = (table: Table) => {
    if (table.status !== 'available') return;

    // Check if table is too small for party size
    if (table.capacity < guestCount) {
      playTapChime();
      setCapacityWarning(
        `Table ${table.table_number} seats max ${table.capacity} diners, but your party has ${guestCount} diners. Please choose a table that fits ${guestCount}+ guests.`
      );
      return;
    }

    playTapChime();
    setCapacityWarning(null);
    setSelectedTable(table);
  };

  const handleProceedBooking = () => {
    if (!selectedTable) return;
    if (selectedTable.capacity < guestCount) {
      setCapacityWarning(`Selected table cannot accommodate ${guestCount} guests.`);
      return;
    }

    playSuccessChime();
    const bookingId = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrData = `${bookingId}|${selectedTable.table_number}|${reservationDate}|${reservationTime}|${guestCount}`;

    onConfirmBooking({
      booking_id: bookingId,
      user_id: 'usr_001',
      table_id: selectedTable.id,
      table_number: selectedTable.table_number,
      reservation_type: reservationType,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      guest_count: guestCount,
      extra_services: selectedExtras,
      special_request: specialRequest.trim() ? specialRequest.trim() : undefined,
      deposit_amount: depositAmount,
      deposit_required: isDepositRequired,
      deposit_paid: true,
      status: 'confirmed',
      qr_code_data: qrData,
    });
  };

  // Helper to render chair indicator dots around table
  const renderChairs = (count: number) => {
    return (
      <div className="flex items-center justify-center gap-1 mt-1">
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
        ))}
        {count > 8 && <span className="text-[8px] font-bold">+</span>}
      </div>
    );
  };

  // Group tables for clear floor plan architecture
  const riversideTables = TABLES.filter((t) => t.area_name === 'Window Area');
  const mainHallTables = TABLES.filter((t) => t.area_name === 'Main Dining Hall');
  const vipSuites = TABLES.filter((t) => t.table_type === 'vip_room');

  return (
    <div className="space-y-5 pb-24 bg-white">
      {/* Header */}
      <div className="px-5 pt-4">
        <h1 className="font-luxury text-2xl font-bold tracking-tight text-stone-900">
          Table &amp; Suite Reservations
        </h1>
        <p className="text-xs text-stone-600">
          Select your table on the floor plan with guaranteed arrival check-in QR pass
        </p>
      </div>

      {/* Active Existing Reservation Banner */}
      {myReservations.length > 0 && (
        <div className="px-5">
          <div
            onClick={() => onViewReservationDetails(myReservations[0])}
            className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl terracotta-gradient-bg text-white flex items-center justify-center font-bold text-xs shadow-xs">
                QR
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Upcoming: {myReservations[0].booking_id}</span>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] rounded font-bold">
                    Confirmed
                  </span>
                </div>
                <div className="text-[11px] text-amber-800 font-mono font-medium">
                  {myReservations[0].reservation_date} · {myReservations[0].reservation_time} ({myReservations[0].table_number})
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-700" />
          </div>
        </div>
      )}

      {/* 1. Choose Reservation Ambience */}
      <div className="px-5 space-y-2">
        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          1. Reservation Ambience
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: 'table', title: 'Window Table', desc: 'Riverfront views & dining hall' },
            { id: 'private_room', title: 'Private VIP Suite', desc: 'Sound-isolated acoustic rooms' },
            { id: 'event', title: 'Special Celebration', desc: 'Anniversary, banquet setups' },
            { id: 'whole_restaurant', title: 'Estate Buyout', desc: 'Full pavilion exclusivity' },
          ].map((type) => {
            const isSelected = reservationType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  playTapChime();
                  setReservationType(type.id as ReservationType);
                  if (type.id === 'private_room') {
                    const vip = TABLES.find((t) => t.table_type === 'vip_room' && t.status === 'available');
                    if (vip) setSelectedTable(vip);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all shadow-xs ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50 text-stone-900 ring-2 ring-amber-600/20'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-bold">{type.title}</div>
                <div className="text-[10px] text-stone-500 mt-0.5 leading-snug">{type.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Select Date, Time & Party Size */}
      <div className="px-5 space-y-3">
        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          2. Calendar &amp; Party Size
        </label>

        {/* Date Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {dates.map((d) => {
            const isSelected = reservationDate === d.value;
            return (
              <button
                key={d.value}
                onClick={() => {
                  playTapChime();
                  setReservationDate(d.value);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Time Selector */}
        <div className="grid grid-cols-5 gap-1.5">
          {timeSlots.map((time) => {
            const isSelected = reservationTime === time;
            return (
              <button
                key={time}
                onClick={() => {
                  playTapChime();
                  setReservationTime(time);
                }}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>

        {/* Party Size Stepper with Strict Capacity Feedback */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <Users className="w-4 h-4 text-amber-700" />
              <span>Party Size (Number of Diners):</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGuestCountChange(guestCount - 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-100 shadow-xs cursor-pointer active:scale-95"
              >
                -
              </button>
              <span className="text-sm font-extrabold text-stone-900 font-mono w-8 text-center">
                {guestCount}
              </span>
              <button
                onClick={() => handleGuestCountChange(guestCount + 1)}
                className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-100 shadow-xs cursor-pointer active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-200/80 pt-1.5">
            <span>Guaranteed Seat Deposit:</span>
            <span className="font-mono font-bold text-amber-900">
              ${depositAmount.toFixed(2)} (100% credited to your dinner bill)
            </span>
          </div>
        </div>

        {/* Capacity Warning Banner if user attempts undersized table */}
        {capacityWarning && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-amber-900">Seating Capacity Alert</div>
              <p className="text-[11px] leading-snug">{capacityWarning}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Visual Restaurant Floor Plan & CAD Architecture */}
      <div className="px-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>3. Floor Plan Table Architecture</span>
          </label>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Fits
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Too Small
            </span>
            <span className="flex items-center gap-1 text-stone-400">
              <span className="w-2 h-2 rounded-full bg-stone-300"></span> Busy
            </span>
          </div>
        </div>

        {/* Blueprint Container */}
        <div className="p-4 rounded-3xl bg-[#fdfbf7] border border-stone-200 floor-blueprint-light space-y-4 shadow-xs">
          
          {/* Section A: Tonle Sap Riverside Window Tables (T01 - T05) */}
          <div className="space-y-2">
            <div className="w-full text-center py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-[10px] text-sky-900 font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-xs">
              <span>≈ Tonle Sap Riverfront Sunset Windows ≈</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {riversideTables.map((tbl) => {
                const isSelected = selectedTable?.id === tbl.id;
                const isAvail = tbl.status === 'available';
                const fitsParty = tbl.capacity >= guestCount;

                return (
                  <button
                    key={tbl.id}
                    onClick={() => handleTableClick(tbl)}
                    disabled={!isAvail}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-xs ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-600/30 font-bold'
                        : !isAvail
                        ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                        : !fitsParty
                        ? 'border-amber-300/80 bg-amber-50/40 text-stone-500 hover:border-amber-400'
                        : 'border-emerald-500 bg-emerald-50/80 text-emerald-950 hover:border-emerald-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold font-mono">{tbl.table_number}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      )}
                    </div>

                    <div className="text-[10px] mt-0.5 font-medium">
                      {!isAvail ? (
                        <span className="text-stone-400">Occupied</span>
                      ) : !fitsParty ? (
                        <span className="text-amber-700 font-bold">Max {tbl.capacity} (Too small)</span>
                      ) : (
                        <span className="text-emerald-800 font-semibold">{tbl.capacity} Diners (Fits ✓)</span>
                      )}
                    </div>

                    {renderChairs(tbl.capacity)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Main Dining Hall & Grand Banquets (M01, M02, M03) */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-800 uppercase tracking-wider">
              <span>Main Dining Hall &amp; Grand Banquets</span>
              <span className="text-[10px] text-stone-500 font-normal">Large gatherings</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mainHallTables.map((tbl) => {
                const isSelected = selectedTable?.id === tbl.id;
                const isAvail = tbl.status === 'available';
                const fitsParty = tbl.capacity >= guestCount;
                const isM03 = tbl.table_number === 'M03';

                return (
                  <button
                    key={tbl.id}
                    onClick={() => handleTableClick(tbl)}
                    disabled={!isAvail}
                    className={`${isM03 ? 'col-span-2' : ''} p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-xs ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-600/30 font-bold'
                        : !isAvail
                        ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                        : !fitsParty
                        ? 'border-amber-300/80 bg-amber-50/40 text-stone-500 hover:border-amber-400'
                        : 'border-emerald-500 bg-emerald-50/80 text-emerald-950 hover:border-emerald-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold font-mono">{tbl.table_number}</span>
                      {isM03 && (
                        <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[9px] rounded font-bold uppercase">
                          Lazy Susan Turntable
                        </span>
                      )}
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      )}
                    </div>

                    <div className="text-[10px] mt-0.5 font-medium">
                      {!isAvail ? (
                        <span className="text-stone-400">Reserved</span>
                      ) : !fitsParty ? (
                        <span className="text-amber-700 font-bold">Max {tbl.capacity} Diners (Too small)</span>
                      ) : (
                        <span className="text-emerald-800 font-semibold">
                          {isM03 ? `Grand Banquet · Up to ${tbl.capacity} Diners (Fits ✓)` : `${tbl.capacity} Diners (Fits ✓)`}
                        </span>
                      )}
                    </div>

                    {renderChairs(tbl.capacity)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section C: Sound-Isolated Private VIP Suites */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-amber-700" />
                <span>Private VIP Suites (Sound-Isolated)</span>
              </span>
              <span className="text-[10px] text-stone-500 font-normal">Dedicated Butler</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {vipSuites.map((vip) => {
                const isSelected = selectedTable?.id === vip.id;
                const isAvail = vip.status === 'available';
                const fitsParty = vip.capacity >= guestCount;

                return (
                  <button
                    key={vip.id}
                    onClick={() => handleTableClick(vip)}
                    disabled={!isAvail}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-xs ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-600/30 font-bold'
                        : !isAvail
                        ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                        : !fitsParty
                        ? 'border-amber-300/80 bg-amber-50/40 text-stone-500 hover:border-amber-400'
                        : 'border-emerald-500 bg-emerald-50/80 text-emerald-950 hover:border-emerald-600'
                    }`}
                  >
                    <span className="text-xs font-extrabold font-mono">{vip.table_number}</span>
                    <div className="text-[10px] mt-0.5 font-medium">
                      {!isAvail ? (
                        <span className="text-stone-400">Reserved</span>
                      ) : (
                        <span className="text-emerald-800 font-semibold">{vip.capacity} Diners (Executive)</span>
                      )}
                    </div>
                    {renderChairs(vip.capacity)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Table Detail Card */}
        {selectedTable && (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs animate-in fade-in">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">
                Selected: <strong className="text-amber-900 font-mono text-sm">{selectedTable.table_number}</strong> ({selectedTable.area_name})
              </span>
              <span className="text-[11px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-100 rounded-md">
                ✓ Accommodates up to {selectedTable.capacity} Diners
              </span>
            </div>
            {selectedTable.ambiance_description && (
              <p className="text-[11px] text-stone-600 italic">
                "{selectedTable.ambiance_description}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4. Celebration & Table Setups (Optional Add-ons) */}
      <div className="px-5 space-y-2">
        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>4. Celebration &amp; Table Setups (Optional Add-ons)</span>
          </span>
          <span className="text-[10px] text-stone-500 font-normal">Optional</span>
        </label>
        <p className="text-[11px] text-stone-500">
          Personalize your arrival with romantic table decor, celebration cake, or presentation equipment:
        </p>

        <div className="space-y-2">
          {EXTRA_SERVICES.map((srv) => {
            const isChecked = selectedExtras.some((e) => e.id === srv.id);
            return (
              <div
                key={srv.id}
                onClick={() => toggleExtra(srv)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors shadow-xs ${
                  isChecked
                    ? 'border-amber-600 bg-amber-50 text-stone-900 ring-1 ring-amber-500/20'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>{srv.name}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </div>
                  <div className="text-[10px] text-stone-500">{srv.description}</div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 shrink-0 ml-2">
                  {srv.price === 0 ? 'Complimentary' : `+$${srv.price.toFixed(2)}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Special Cooking or Seating Note */}
      <div className="px-5 space-y-1.5">
        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          5. Special Dietary or Seating Requests
        </label>
        <input
          type="text"
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          placeholder="e.g. Birthday cake served at 8:00 PM, quiet corner seat"
          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-inner"
        />
      </div>

      {/* 6. Booking Overview & Guarantee Deposit (Always Required) */}
      <div className="px-5 space-y-2">
        <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          6. Booking Overview &amp; Guarantee Deposit
        </label>
        
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Reservation Ambience</span>
            <span className="font-semibold text-stone-900 capitalize">{reservationType.replace('_', ' ')}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Date &amp; Arrival Time</span>
            <span className="font-semibold text-stone-900">{reservationDate} at {reservationTime}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Reserved Table</span>
            <span className="font-bold text-amber-900 font-mono">
              {selectedTable ? `${selectedTable.table_number} (${selectedTable.area_name})` : 'Please choose table'}
            </span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Party Size</span>
            <span className="font-semibold text-stone-900">{guestCount} Diners</span>
          </div>

          {selectedExtras.length > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Celebration Setups ({selectedExtras.length})</span>
              <span className="text-amber-800 font-mono font-medium">
                +${extrasDeposit.toFixed(2)}
              </span>
            </div>
          )}

          {/* Deposit Breakdown */}
          <div className="pt-2 border-t border-stone-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-900">Guaranteed Table Deposit:</span>
                <p className="text-[10px] text-stone-500">
                  ${baseRatePerGuest.toFixed(2)} / guest · 100% credited to your dinner bill
                </p>
              </div>
              <span className="font-mono text-base font-extrabold text-amber-800">
                ${depositAmount.toFixed(2)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Bill Credit:</strong> This ${depositAmount.toFixed(2)} deposit holds your table and will be deducted from your final dining bill upon arrival.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <button
          onClick={handleProceedBooking}
          disabled={!selectedTable || selectedTable.capacity < guestCount}
          className="w-full py-3.5 terracotta-gradient-bg hover:brightness-105 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-900/15 active:scale-[0.98] cursor-pointer disabled:opacity-40"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Booking &amp; Pay ${depositAmount.toFixed(2)} Deposit Pass</span>
        </button>
      </div>
    </div>
  );
};
