import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Smartphone, ShieldCheck } from 'lucide-react';
import { playSuccessChime } from '../../utils/audioChime';

interface PaymentKHQRModalProps {
  isOpen: boolean;
  amount: number;
  orderNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentKHQRModal: React.FC<PaymentKHQRModalProps> = ({
  isOpen,
  amount,
  orderNumber,
  onSuccess,
  onCancel,
}) => {
  if (!isOpen) return null;

  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    if (status !== 'pending') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const handleSimulatePayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      playSuccessChime();
      setTimeout(() => {
        onSuccess();
      }, 1400);
    }, 900);
  };

  const handleSimulateFail = () => {
    setStatus('failed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-[32px] overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-[11px] rounded-md tracking-wider shadow-xs">
              KHQR
            </div>
            <span className="text-[11px] font-semibold text-stone-700">National Bank of Cambodia</span>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'pending' && (
          <>
            {/* Merchant Details */}
            <div className="text-center space-y-1">
              <h3 className="font-luxury text-xl font-bold text-stone-900 tracking-tight">
                Amok &amp; Basil Pavilion
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">Bill #{orderNumber} · Phnom Penh</p>
              <div className="pt-1">
                <span className="text-2xl font-extrabold text-amber-800 font-mono">
                  ${amount.toFixed(2)}
                </span>
                <span className="text-[11px] text-stone-500 font-mono ml-2">
                  (~{(amount * 4100).toLocaleString()} KHR)
                </span>
              </div>
            </div>

            {/* Simulated KHQR Visual Code Container */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-4 text-center mx-auto w-56 shadow-sm">
              <div className="border-[3px] border-red-600 rounded-2xl p-2 relative bg-white">
                <svg viewBox="0 0 100 100" className="w-full h-auto text-slate-950">
                  <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="12" width="11" height="11" fill="currentColor" />

                  <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="77" y="12" width="11" height="11" fill="currentColor" />

                  <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                  <rect x="36" y="8" width="5" height="18" fill="currentColor" />
                  <rect x="46" y="12" width="18" height="5" fill="currentColor" />
                  <rect x="40" y="22" width="8" height="8" fill="currentColor" />

                  <rect x="10" y="38" width="16" height="5" fill="currentColor" />
                  <rect x="8" y="48" width="22" height="6" fill="currentColor" />

                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#dc2626" />
                  <circle cx="50" cy="50" r="7" fill="white" />

                  <rect x="70" y="36" width="6" height="22" fill="currentColor" />
                  <rect x="82" y="42" width="10" height="6" fill="currentColor" />

                  <rect x="38" y="70" width="18" height="6" fill="currentColor" />
                  <rect x="44" y="82" width="24" height="6" fill="currentColor" />
                  <rect x="72" y="72" width="8" height="16" fill="currentColor" />
                  <rect x="86" y="78" width="8" height="10" fill="currentColor" />
                </svg>

                <div className="mt-1 text-[9px] font-bold text-red-600 tracking-wider">
                  BAKONG KHQR
                </div>
              </div>

              <div className="mt-2 text-[10px] text-stone-600 font-semibold flex items-center justify-center gap-1">
                <Smartphone className="w-3 h-3 text-red-600" />
                <span>ABA · ACLEDA · Wing · Canadia</span>
              </div>
            </div>

            {/* Expiry countdown */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 font-mono">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-700" />
              <span>
                QR Code valid for {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Simulation triggers */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Scan &amp; Pay (Instant Chime)</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateFail}
                className="w-full py-1 text-[11px] text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Simulate Payment Declined
              </button>
            </div>
          </>
        )}

        {status === 'processing' && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-amber-700 animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-stone-900">Verifying Bakong Network...</h4>
            <p className="text-xs text-stone-500">Authenticating with National Bank Gateway</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-10 text-center space-y-2.5 animate-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-luxury text-xl font-bold text-stone-900">Payment Verified</h4>
            <div className="p-3 rounded-2xl bg-stone-50 border border-emerald-300 text-xs space-y-1 text-stone-700">
              <div className="text-emerald-700 font-mono font-bold">
                TXN-BKNG-{Date.now().toString().slice(-6)}
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Amount Settled: ${amount.toFixed(2)} USD
              </p>
            </div>
            <p className="text-[11px] text-stone-500">Connecting to Live Kitchen Display...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="py-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="text-sm font-bold text-stone-900">Payment Unsuccessful</h4>
            <p className="text-xs text-stone-500">
              The banking authorization was cancelled or expired.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStatus('pending')}
                className="flex-1 py-2 terracotta-gradient-bg text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Retry KHQR
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Change Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
