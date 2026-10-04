/**
 * Restaurant Reservation & Ordering Mobile Application
 * Full-Stack Interactive Suite & Diagrams.net Specification Workspace
 */
import React, { useState, useEffect } from 'react';
import { Header, ActiveAppView, ThemeColor, PatternStyle } from './components/common/Header';
import { MobileShell, MobileNavTab } from './components/mobile/MobileShell';
import { HomeTab } from './components/mobile/HomeTab';
import { MenuTab } from './components/mobile/MenuTab';
import { ProductDetailModal } from './components/mobile/ProductDetailModal';
import { CartModal } from './components/mobile/CartModal';
import { CheckoutModal } from './components/mobile/CheckoutModal';
import { PaymentKHQRModal } from './components/mobile/PaymentKHQRModal';
import { BookingTab } from './components/mobile/BookingTab';
import { BookingConfirmationModal } from './components/mobile/BookingConfirmationModal';
import { OrdersTab } from './components/mobile/OrdersTab';
import { ProfileTab } from './components/mobile/ProfileTab';
import { SearchTab } from './components/mobile/SearchTab';
import { DiagramsWorkspace, DiagramTab } from './components/diagrams/DiagramsWorkspace';
import { AdminPortal } from './components/admin/AdminPortal';
import { FigmaExportModal } from './components/common/FigmaExportModal';
import { FigmaShowcaseView } from './components/figma/FigmaShowcaseView';
import { downloadDrawioFile } from './utils/drawioExport';
import {
  CURRENT_USER,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  TABLES,
  PRODUCTS,
} from './data/restaurantData';
import {
  Product,
  CartItem,
  Order,
  Reservation,
  Table,
  User,
  OrderStatus,
  TableStatus,
  OrderType,
  PaymentMethod,
} from './types/restaurant';

export default function App() {
  // Top Level Navigation & Theme State
  const [activeView, setActiveView] = useState<ActiveAppView>('mobile_app');
  const [diagramTab, setDiagramTab] = useState<DiagramTab>('architecture');
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);
  const [themeColor, setThemeColor] = useState<ThemeColor>('saffron');
  const [patternStyle, setPatternStyle] = useState<PatternStyle>('motif');

  const patternClassMap: Record<PatternStyle, string> = {
    motif: 'pattern-culinary-motif',
    bistro: 'pattern-bistro-check',
    herbs: 'pattern-botanical-herb',
    porcelain: 'pattern-porcelain-clean',
  };

  // Mobile App Navigation Tab
  const [activeMobileTab, setActiveMobileTab] = useState<MobileNavTab>('home');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('khmer');

  // App Data State (Persisted in localStorage for future visits)
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('ab_user');
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ab_orders');
      if (!saved) return INITIAL_ORDERS;
      const parsed: Order[] = JSON.parse(saved);
      return parsed.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image_url: item.product.image_url?.replace('/src/assets/images/', '/assets/images/'),
          },
        })),
      }));
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('ab_reservations');
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [tables, setTables] = useState<Table[]>(TABLES);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ab_favorites');
      return saved ? JSON.parse(saved) : ['prod_fish_amok', 'prod_signature_drink'];
    } catch {
      return ['prod_fish_amok', 'prod_signature_drink'];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ab_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map((item) => ({
        ...item,
        product: {
          ...item.product,
          image_url: item.product.image_url?.replace('/src/assets/images/', '/assets/images/'),
        },
      }));
    } catch {
      return [];
    }
  });

  // Sync state changes automatically to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ab_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('ab_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ab_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.warn('Could not save reservations', e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('ab_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('ab_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart', e);
    }
  }, [cart]);
  const [cartSummary, setCartSummary] = useState<{
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    splitCount: number;
    perPersonTotal: number;
    selectedTable?: string;
    orderType?: 'dine_in' | 'takeaway';
  } | undefined>(undefined);

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isKhqrOpen, setIsKhqrOpen] = useState(false);
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);
  const [latestConfirmedReservation, setLatestConfirmedReservation] = useState<Reservation | null>(null);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<{
    orderNumber: string;
    total: number;
    orderData: any;
  } | null>(null);

  // Toggle Favorite
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Add Item to Cart
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => [...prev, newItem]);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.itemTotal / item.quantity;
            return {
              ...item,
              quantity: newQty,
              itemTotal: singleUnitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Quick 1-tap add to cart with audio chime
  const handleQuickAddToCart = (product: Product) => {
    const existing = cart.find(
      (item) => item.product.id === product.id && item.selectedSize.id === (product.sizes[0]?.id || 'regular')
    );
    if (existing) {
      handleUpdateQuantity(existing.id, 1);
    } else {
      const newItem: CartItem = {
        id: `${product.id}_${Date.now()}`,
        product,
        selectedSize: product.sizes[0] || { id: 'regular', name: 'Regular', priceDelta: 0 },
        selectedAddOns: [],
        selectedSpiceLevel: product.spice_level || 0,
        quantity: 1,
        itemTotal: product.price,
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  // Place Order flow
  const handlePlaceOrder = (orderData: {
    orderType: OrderType;
    tableNumber?: string;
    paymentMethod: PaymentMethod;
    specialRequest: string;
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    splitCount: number;
    total: number;
  }) => {
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    if (orderData.paymentMethod === 'khqr') {
      setPendingOrderDetails({
        orderNumber,
        total: orderData.total,
        orderData,
      });
      setIsCheckoutOpen(false);
      setIsKhqrOpen(true);
    } else {
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        order_number: orderNumber,
        user_id: user.id,
        order_type: orderData.orderType,
        table_number: orderData.tableNumber,
        items: [...cart],
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        tax: orderData.tax,
        tip: orderData.tip,
        split_count: orderData.splitCount,
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        payment_status: 'paid',
        order_status: 'confirmed',
        special_request: orderData.specialRequest || undefined,
        created_at: new Date().toISOString(),
        estimated_minutes: 20,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setIsCheckoutOpen(false);
      setActiveMobileTab('orders');
    }
  };

  // KHQR Payment Success Callback
  const handleKhqrSuccess = () => {
    if (!pendingOrderDetails) return;
    const { orderNumber, orderData, total } = pendingOrderDetails;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      order_number: orderNumber,
      user_id: user.id,
      order_type: orderData.orderType,
      table_number: orderData.tableNumber,
      items: [...cart],
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      tax: orderData.tax,
      tip: orderData.tip,
      split_count: orderData.splitCount,
      total,
      payment_method: 'khqr',
      payment_status: 'paid',
      order_status: 'confirmed',
      special_request: orderData.specialRequest || undefined,
      created_at: new Date().toISOString(),
      estimated_minutes: 20,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsKhqrOpen(false);
    setPendingOrderDetails(null);
    setActiveMobileTab('orders');
  };

  // Confirm Reservation
  const handleConfirmBooking = (bookingData: Omit<Reservation, 'id' | 'created_at'>) => {
    const newReservation: Reservation = {
      ...bookingData,
      id: `res_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setTables((prev) =>
      prev.map((t) => (t.id === bookingData.table_id ? { ...t, status: 'reserved' } : t))
    );

    setReservations((prev) => [newReservation, ...prev]);
    setLatestConfirmedReservation(newReservation);
  };

  // Staff Portal Actions
  const handleAdvanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: nextStatus } : o))
    );
  };

  const handleUpdateTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));
  };

  const handleCheckInReservation = (bookingId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.booking_id === bookingId ? { ...r, status: 'checked_in' } : r))
    );
  };

  const handleHeaderViewChange = (view: ActiveAppView) => {
    setActiveView(view);
    if (view === 'architecture') setDiagramTab('architecture');
    if (view === 'process_flow') setDiagramTab('process_flow');
    if (view === 'erd') setDiagramTab('erd');
  };

  const activeOrdersCount = orders.filter(
    (o) => o.order_status !== 'completed' && o.order_status !== 'cancelled'
  ).length;

  return (
    <div className={`min-h-screen ${patternClassMap[patternStyle]} text-stone-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white transition-all duration-300`}>
      {/* Top Header Bar */}
      <Header
        activeView={activeView}
        setActiveView={handleHeaderViewChange}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isDeviceFrame={isDeviceFrame}
        setIsDeviceFrame={setIsDeviceFrame}
        onExportDrawio={() => downloadDrawioFile()}
        onOpenFigmaExport={() => setIsFigmaModalOpen(true)}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        patternStyle={patternStyle}
        setPatternStyle={setPatternStyle}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col">
        {/* VIEW 1: CUSTOMER MOBILE APP (Part 1 Focus) */}
        {activeView === 'mobile_app' && (
          <div className="flex-1 py-4 sm:py-6 px-2 flex items-center justify-center">
            <MobileShell
              activeTab={activeMobileTab}
              setActiveTab={setActiveMobileTab}
              isDeviceFrame={isDeviceFrame}
              activeOrderCount={activeOrdersCount}
            >
              {activeMobileTab === 'home' && (
                <HomeTab
                  user={user}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onSelectCuisine={(slug) => {
                    setSelectedCuisine(slug);
                    setActiveMobileTab('menu');
                  }}
                  onNavigateToBooking={() => setActiveMobileTab('booking')}
                  onNavigateToMenu={() => setActiveMobileTab('menu')}
                  onNavigateToSearch={() => setActiveMobileTab('search')}
                  onNavigateToProfile={() => setActiveMobileTab('profile')}
                  onAddToCart={handleQuickAddToCart}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {activeMobileTab === 'menu' && (
                <MenuTab
                  selectedCuisine={selectedCuisine}
                  setSelectedCuisine={setSelectedCuisine}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
                  cartTotal={cart.reduce((s, i) => s + i.itemTotal, 0)}
                  cart={cart}
                  onQuickAdd={handleQuickAddToCart}
                  onOpenCart={() => setIsCartOpen(true)}
                />
              )}

              {/* CENTER SEARCH TAB (Now fully rendered when user taps Search in footer) */}
              {activeMobileTab === 'search' && (
                <SearchTab
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={(p) => {
                    const newItem: CartItem = {
                      id: `${p.id}_${Date.now()}`,
                      product: p,
                      selectedSize: p.sizes[0] || { id: 'regular', name: 'Regular', priceDelta: 0 },
                      selectedAddOns: [],
                      selectedSpiceLevel: p.spice_level || 0,
                      quantity: 1,
                      itemTotal: p.price,
                    };
                    setCart((prev) => [...prev, newItem]);
                  }}
                  onNavigateToMenu={() => setActiveMobileTab('menu')}
                />
              )}

              {activeMobileTab === 'booking' && (
                <BookingTab
                  onConfirmBooking={handleConfirmBooking}
                  myReservations={reservations}
                  onViewReservationDetails={(r) => setLatestConfirmedReservation(r)}
                />
              )}

              {activeMobileTab === 'orders' && (
                <OrdersTab
                  orders={orders}
                  onRepeatOrder={(order) => {
                    setCart((prev) => [...prev, ...order.items]);
                    setIsCartOpen(true);
                  }}
                  onAdvanceOrderStatus={handleAdvanceOrderStatus}
                />
              )}

              {activeMobileTab === 'profile' && (
                <ProfileTab
                  user={user}
                  onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                  favorites={favorites}
                  reservations={reservations}
                  orders={orders}
                  onNavigateToOrders={() => setActiveMobileTab('orders')}
                  onNavigateToReservations={() => setActiveMobileTab('booking')}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              )}
            </MobileShell>
          </div>
        )}

        {/* VIEW 2, 3, 4: DIAGRAMS.NET SPECIFICATION WORKSPACE */}
        {(activeView === 'architecture' || activeView === 'process_flow' || activeView === 'erd') && (
          <DiagramsWorkspace
            currentTab={diagramTab}
            onChangeTab={(t) => {
              setDiagramTab(t);
              if (t === 'architecture') setActiveView('architecture');
              if (t === 'process_flow') setActiveView('process_flow');
              if (t === 'erd') setActiveView('erd');
            }}
            onExportDrawio={() => downloadDrawioFile()}
          />
        )}

        {/* VIEW 5: RESTAURANT MANAGEMENT SYSTEM */}
        {activeView === 'admin_portal' && (
          <AdminPortal
            orders={orders}
            reservations={reservations}
            tables={tables}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onUpdateTableStatus={handleUpdateTableStatus}
            onCheckInReservation={handleCheckInReservation}
          />
        )}

        {/* VIEW 6: FIGMA SHOWCASE (All 6 Screens Side-by-Side Artboard) */}
        {activeView === 'figma_showcase' && (
          <FigmaShowcaseView
            user={user}
            orders={orders}
            reservations={reservations}
            tables={tables}
            favorites={favorites}
            cart={cart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleQuickAddToCart}
            onToggleFavorite={handleToggleFavorite}
            onConfirmBooking={handleConfirmBooking}
            onRepeatOrder={(order) => {
              setCart((prev) => [...prev, ...order.items]);
              setIsCartOpen(true);
            }}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          />
        )}
      </div>

      {/* Global Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(summary) => {
          setCartSummary(summary);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        user={user}
        cartSummary={cartSummary}
        onSaveCard={(card) => setUser((prev) => ({ ...prev, saved_card: card }))}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Bakong KHQR Payment Simulation Modal */}
      {pendingOrderDetails && (
        <PaymentKHQRModal
          isOpen={isKhqrOpen}
          amount={pendingOrderDetails.total}
          orderNumber={pendingOrderDetails.orderNumber}
          onSuccess={handleKhqrSuccess}
          onCancel={() => {
            setIsKhqrOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* Reservation Confirmed with QR Check-in Modal */}
      {latestConfirmedReservation && (
        <BookingConfirmationModal
          reservation={latestConfirmedReservation}
          onClose={() => setLatestConfirmedReservation(null)}
          onViewAllReservations={() => {
            setLatestConfirmedReservation(null);
            setActiveMobileTab('booking');
          }}
        />
      )}
      {/* Figma Export & Design Hand-off Guide Modal */}
      <FigmaExportModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
        liveUrl="https://ais-pre-zma2kqfoy7a5qrskbvta4t-933834213837.asia-east1.run.app"
      />
    </div>
  );
}

