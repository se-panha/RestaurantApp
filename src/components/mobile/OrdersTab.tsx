import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Receipt,
  Utensils,
  ShoppingBag,
  RotateCw,
  Zap,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/restaurant';
import { playSuccessChime } from '../../utils/audioChime';

interface OrdersTabProps {
  orders: Order[];
  onRepeatOrder?: (order: Order) => void;
  onAdvanceOrderStatus?: (orderId: string, nextStatus: OrderStatus) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onRepeatOrder,
  onAdvanceOrderStatus,
}) => {
  const [activeSegment, setActiveSegment] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter((o) => o.order_status !== 'completed' && o.order_status !== 'cancelled');
  const historyOrders = orders.filter((o) => o.order_status === 'completed' || o.order_status === 'cancelled');

  const displayedOrders = activeSegment === 'active' ? activeOrders : historyOrders;

  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Received by kitchen system' },
    { key: 'confirmed', label: 'Chef Confirmed', desc: 'Accepted by Executive Chef' },
    { key: 'preparing', label: 'Wok & Charcoal Searing', desc: 'Fresh ingredients simmering' },
    { key: 'ready', label: 'Plated & Ready', desc: 'Garnished & awaiting server' },
    { key: 'served', label: 'Served to Table / Picked Up', desc: 'Delivered to your party' },
    { key: 'completed', label: 'Completed', desc: 'Dining session settled' },
  ];

  const getStageIndex = (status: OrderStatus) => {
    return stages.findIndex((s) => s.key === status);
  };

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    placed: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'served',
    served: 'completed',
    completed: null,
    cancelled: null,
  };

  const handleSimulateNextStep = (orderId: string, currentStatus: OrderStatus) => {
    const next = nextStatusMap[currentStatus];
    if (next && onAdvanceOrderStatus) {
      onAdvanceOrderStatus(orderId, next);
      if (next === 'served' || next === 'ready') {
        playSuccessChime();
      }
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="px-5 pt-4">
        <h1 className="font-luxury text-2xl font-bold tracking-tight text-stone-900">
          Active Dining &amp; Receipts
        </h1>
        <p className="text-xs text-stone-600">Live kitchen progression &amp; dining order history</p>
      </div>

      {/* Segmented Tab */}
      <div className="px-5">
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveSegment('active')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSegment === 'active'
                ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Live Kitchen Orders</span>
            {activeOrders.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-amber-900 rounded-full text-[10px] font-bold shadow-xs">
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSegment('history')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSegment === 'history'
                ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dining History ({historyOrders.length})
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="py-14 px-4 text-center text-stone-500 space-y-2">
          <Receipt className="w-10 h-10 text-stone-400 mx-auto" />
          <p className="text-xs">No {activeSegment} dining orders found.</p>
        </div>
      ) : (
        <div className="px-5 space-y-4">
          {displayedOrders.map((order) => {
            const currentIndex = getStageIndex(order.order_status);
            const isDineIn = order.order_type === 'dine_in';
            const nextStatus = nextStatusMap[order.order_status];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm p-4.5 space-y-4"
              >
                {/* Order Meta Header */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-stone-900 font-mono">
                        {order.order_number}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider">
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1.5 font-medium">
                      <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-stone-700">
                        {isDineIn ? <Utensils className="w-3 h-3 text-amber-700" /> : <ShoppingBag className="w-3 h-3 text-amber-700" />}
                        {isDineIn ? `Table ${order.table_number}` : 'Takeaway Pickup'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-amber-800 font-mono">
                      ${order.total.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-emerald-700 uppercase font-semibold">
                      {order.payment_method.toUpperCase()} · {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Live Order Tracking Timeline */}
                {activeSegment === 'active' && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">Kitchen Display Tracking</span>
                      <span className="text-amber-800 font-mono flex items-center gap-1 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        Est. {order.estimated_minutes > 0 ? `${order.estimated_minutes}m prep` : 'Plating now!'}
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="space-y-2.5 pt-1 pl-1">
                      {stages.slice(0, 5).map((stage, idx) => {
                        const isDone = currentIndex > idx;
                        const isCurrent = currentIndex === idx;

                        return (
                          <div key={stage.key} className="flex items-start gap-3 relative">
                            {idx < 4 && (
                              <div
                                className={`absolute left-2.5 top-5 bottom-0 w-0.5 -mb-2.5 ${
                                  isDone ? 'bg-amber-600' : 'bg-stone-300'
                                }`}
                              ></div>
                            )}

                            <div className="relative z-10 shrink-0">
                              {isDone ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                              ) : isCurrent ? (
                                <div className="w-5 h-5 rounded-full terracotta-gradient-bg text-white flex items-center justify-center animate-pulse shadow-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-stone-300 bg-white flex items-center justify-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 -mt-0.5">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-xs font-semibold ${
                                    isCurrent ? 'text-amber-900 font-bold' : isDone ? 'text-stone-800' : 'text-stone-400'
                                  }`}
                                >
                                  {stage.label}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] text-amber-800 font-mono font-bold">Cooking</span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-500 leading-tight mt-0.5">
                                {stage.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Interactive Fast-Forward Simulation Bar */}
                    {nextStatus && (
                      <div className="pt-2 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => handleSimulateNextStep(order.id, order.order_status)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-700" />
                          <span>Simulate Next Stage: Advance to {nextStatus.toUpperCase()}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Items Summary Breakdown */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                    Dishes Selected
                  </div>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-stone-700">
                      <div>
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="text-stone-500 text-[10px] ml-1.5">({item.selectedSize.name})</span>
                        {item.selectedAddOns.length > 0 && (
                          <span className="text-[10px] text-amber-800 font-medium block">
                            +{item.selectedAddOns.map((a) => a.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-stone-600">${item.itemTotal.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.special_request && (
                    <div className="text-[11px] text-amber-900 italic bg-amber-50 p-2.5 rounded-xl mt-1 border border-amber-200">
                      Chef Note: "{order.special_request}"
                    </div>
                  )}
                </div>

                {/* Footer info & Re-order action */}
                <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-stone-500">
                    Subtotal: ${order.subtotal.toFixed(2)} · Tax: ${order.tax.toFixed(2)}
                    {order.tip ? ` · Tip: $${order.tip.toFixed(2)}` : ''}
                  </div>
                  {onRepeatOrder && (
                    <button
                      onClick={() => onRepeatOrder(order)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer border border-stone-300 shadow-xs"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
