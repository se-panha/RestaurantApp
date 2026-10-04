import React, { useState } from 'react';
import {
  Layers,
  GitBranch,
  Database,
  Download,
  Copy,
  Check,
  Code2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Server,
  Smartphone,
  CreditCard,
  Bell,
  HardDrive,
  Search,
} from 'lucide-react';

export type DiagramTab = 'architecture' | 'process_flow' | 'erd';

interface DiagramsWorkspaceProps {
  currentTab: DiagramTab;
  onChangeTab: (tab: DiagramTab) => void;
  onExportDrawio: () => void;
}

export const DiagramsWorkspace: React.FC<DiagramsWorkspaceProps> = ({
  currentTab,
  onChangeTab,
  onExportDrawio,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('flutter_app');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [erdSearch, setErdSearch] = useState<string>('');

  const postgresSqlSchema = `-- =====================================================================
-- Restaurant Reservation & Ordering Mobile Application
-- Production PostgreSQL Relational Schema (Normalized)
-- Generated for Diagrams.net Specification Suite
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUISINES TABLE
CREATE TABLE cuisines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    local_name VARCHAR(150),
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cuisine_id UUID NOT NULL REFERENCES cuisines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS TABLE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    cuisine_id UUID NOT NULL REFERENCES cuisines(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    local_name VARCHAR(150),
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    spice_level INT DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    dietary_tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FAVORITES TABLE (Composite Primary/Unique Key)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_favorite UNIQUE(user_id, product_id)
);

-- 6. TABLES / SEATING TABLE
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number VARCHAR(30) UNIQUE NOT NULL,
    table_type VARCHAR(50) NOT NULL, -- standard | window | private_room | outdoor
    capacity INT NOT NULL,
    status VARCHAR(30) DEFAULT 'available', -- available | occupied | reserved | cleaning
    x_pos INT,
    y_pos INT,
    ambiance_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type VARCHAR(30) NOT NULL, -- dine_in | takeaway
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    takeaway_time VARCHAR(50),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    tip NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(30) DEFAULT 'placed', -- placed | confirmed | preparing | ready | served | completed | cancelled
    payment_status VARCHAR(30) DEFAULT 'unpaid', -- unpaid | paid | refunded
    payment_method VARCHAR(50), -- cash | khqr | credit_card
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    selected_size VARCHAR(50) DEFAULT 'Regular',
    selected_add_ons JSONB DEFAULT '[]'::jsonb,
    selected_spice_level INT DEFAULT 1,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. RESERVATIONS TABLE
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    reservation_type VARCHAR(50) NOT NULL, -- table | private_room | event | whole_restaurant
    reservation_date DATE NOT NULL,
    reservation_time VARCHAR(20) NOT NULL,
    guest_count INT NOT NULL CHECK (guest_count > 0),
    special_request TEXT,
    extra_services JSONB DEFAULT '[]'::jsonb,
    deposit_amount NUMERIC(10, 2) DEFAULT 0.00,
    deposit_paid BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'confirmed', -- pending | confirmed | cancelled | checked_in
    qr_code_data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. PAYMENTS TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- khqr | card | cash
    payment_status VARCHAR(30) DEFAULT 'success', -- pending | success | failed | refunded
    transaction_reference VARCHAR(150),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR HIGH-TRAFFIC REALTIME RESTAURANT QUERIES
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_cuisine ON products(cuisine_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(postgresSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Scope Disclaimer banner in clean white card */}
      <div className="p-4.5 rounded-3xl bg-white/95 border border-amber-300 text-stone-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm shadow-amber-900/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl terracotta-gradient-bg text-white flex items-center justify-center shrink-0 shadow-xs">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-stone-900 font-bold">Part 1 Scope:</strong> UI/UX design &amp; interactive prototype on white canvas.
            <span className="mx-2 opacity-40">·</span>
            <strong className="text-stone-900 font-bold">Future Implementation Proposal:</strong> Flutter / Dart Mobile App, Laravel 11 REST API, PostgreSQL Relational Database, Bakong KHQR, and Firebase FCM.
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-300/80 cursor-pointer shadow-xs transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-800" />
            <span>View SQL DDL</span>
          </button>

          <button
            onClick={onExportDrawio}
            className="px-3.5 py-1.5 terracotta-gradient-bg hover:brightness-105 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-900/15 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .drawio</span>
          </button>
        </div>
      </div>

      {/* 3 Tabs + Zoom Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onChangeTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'architecture'
                ? 'terracotta-gradient-bg text-white font-bold shadow-sm shadow-amber-900/15'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:border-amber-300 shadow-xs'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>01 — System Architecture</span>
          </button>

          <button
            onClick={() => onChangeTab('process_flow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'process_flow'
                ? 'terracotta-gradient-bg text-white font-bold shadow-sm shadow-amber-900/15'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:border-amber-300 shadow-xs'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>02 — System Process Flow</span>
          </button>

          <button
            onClick={() => onChangeTab('erd')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'erd'
                ? 'terracotta-gradient-bg text-white font-bold shadow-sm shadow-amber-900/15'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:border-amber-300 shadow-xs'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>03 — Logical Data Model (ERD)</span>
          </button>
        </div>

        {/* Interactive Diagram Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <span className="text-[11px] font-mono mr-1 font-semibold">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
            className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-950 shadow-xs cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
            className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-950 shadow-xs cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-950 shadow-xs cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: 01 — SYSTEM ARCHITECTURE
          ========================================================================= */}
      {currentTab === 'architecture' && (
        <div className="space-y-6">
          <div
            className="bg-white/95 rounded-3xl border border-stone-200/90 p-6 shadow-sm relative overflow-hidden transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono text-amber-800 uppercase tracking-widest font-bold">
                Page 1 of 3: diagrams.net
              </span>
              <h2 className="font-luxury text-2xl font-extrabold text-stone-900 mt-0.5">
                Proposed Future System Architecture
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-xl mx-auto">
                Full-stack topology connecting Customer Mobile Application, Laravel 11 Backend, PostgreSQL, and External Payment / Push Services
              </p>
            </div>

            {/* Architecture Canvas Visual */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Actor: Customer */}
              <div className="flex justify-center">
                <div
                  onClick={() => setSelectedNode('customer_actor')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all bg-white shadow-xs ${
                    selectedNode === 'customer_actor'
                      ? 'border-amber-600 ring-2 ring-amber-600/20 text-stone-900'
                      : 'border-stone-200 text-stone-700 hover:border-amber-400'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl terracotta-gradient-bg text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    👤
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">RESTAURANT PATRON / DINER</div>
                    <div className="text-[10px] text-stone-500">Mobile Device User (Android / iOS Flutter)</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center -my-3">
                <div className="w-0.5 h-6 bg-stone-300"></div>
              </div>

              {/* Container 1: Customer Mobile App (Flutter) */}
              <div
                onClick={() => setSelectedNode('flutter_app')}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                  selectedNode === 'flutter_app'
                    ? 'border-amber-600 ring-2 ring-amber-600/20'
                    : 'border-stone-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 tracking-wide">
                        CUSTOMER MOBILE APPLICATION
                      </h3>
                      <span className="text-[11px] text-sky-800 font-mono font-semibold">
                        Flutter 3.x / Dart (Cross-Platform iOS &amp; Android)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-mono font-bold border border-amber-300">
                    Part 1 Focus
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {['Home', 'Menu', 'Booking', 'Orders', 'Profile'].map((mod) => (
                    <div
                      key={mod}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center"
                    >
                      <div className="text-xs font-bold text-stone-800">{mod}</div>
                      <div className="text-[9px] text-stone-500 font-mono mt-0.5">Thumb View</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow with HTTPS REST API / JSON protocol label */}
              <div className="flex flex-col items-center -my-2">
                <div className="w-0.5 h-4 bg-stone-300"></div>
                <div className="px-3 py-1 rounded-full bg-white border border-stone-200 text-[10px] font-mono font-bold text-stone-700 shadow-xs">
                  HTTPS / REST API (JSON)
                </div>
                <div className="w-0.5 h-4 bg-stone-300"></div>
              </div>

              {/* Container 2: Laravel Backend */}
              <div
                onClick={() => setSelectedNode('laravel_backend')}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                  selectedNode === 'laravel_backend'
                    ? 'border-amber-600 ring-2 ring-amber-600/20'
                    : 'border-stone-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 tracking-wide">
                        LARAVEL BACKEND
                      </h3>
                      <span className="text-[11px] text-red-800 font-mono font-semibold">
                        PHP 8.3 / Laravel 11 (REST API, Sanctum Auth, Eloquent ORM)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-red-100 text-red-900 font-mono font-bold border border-red-300">
                    API Gateway Core
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {[
                    'Authentication',
                    'Menu & Product',
                    'Cart & Checkout',
                    'Order Management',
                    'Reservation Mgt',
                    'Table Availability',
                    'Payment Integration',
                    'User / Profile',
                    'Notification Engine',
                    'Staff RBAC Gateways'
                  ].map((sub) => (
                    <div key={sub} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-[11px] font-semibold text-stone-800 line-clamp-1">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection down to DB & External Services */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* External: Payment KHQR */}
                <div
                  onClick={() => setSelectedNode('khqr_service')}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                    selectedNode === 'khqr_service'
                      ? 'border-amber-600 ring-2 ring-amber-600/20'
                      : 'border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded-md bg-red-100 text-red-700">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900">Payment Provider</h4>
                  </div>
                  <p className="text-[11px] text-stone-800 font-semibold">Bakong KHQR / NBC Gateway</p>
                  <span className="text-[10px] text-stone-500 block mt-1 font-mono">Deep Link &amp; Webhooks</span>
                </div>

                {/* Database: PostgreSQL */}
                <div
                  onClick={() => setSelectedNode('postgresql_db')}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                    selectedNode === 'postgresql_db'
                      ? 'border-amber-600 ring-2 ring-amber-600/20'
                      : 'border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                      <HardDrive className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900">PostgreSQL DB</h4>
                  </div>
                  <p className="text-[11px] text-stone-800 font-semibold">10 Relational Tables</p>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold block mt-1">SQL / Eloquent ORM</span>
                </div>

                {/* External: Firebase FCM */}
                <div
                  onClick={() => setSelectedNode('fcm_service')}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                    selectedNode === 'fcm_service'
                      ? 'border-amber-600 ring-2 ring-amber-600/20'
                      : 'border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1 rounded-md bg-amber-100 text-amber-700">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900">Push Notifications</h4>
                  </div>
                  <p className="text-[11px] text-stone-800 font-semibold">Firebase FCM (Cloud)</p>
                  <span className="text-[10px] text-stone-500 block mt-1 font-mono">Order &amp; Booking Alerts</span>
                </div>
              </div>

              {/* Part 2: Restaurant Management System Linkage */}
              <div
                onClick={() => setSelectedNode('admin_system')}
                className={`p-4.5 rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-emerald-50/70 ${
                  selectedNode === 'admin_system'
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                    : 'border-emerald-400/80 hover:border-emerald-600'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      Admin
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        PART 2: RESTAURANT MANAGEMENT SYSTEM (Web / Tablet KDS)
                      </h4>
                      <p className="text-[11px] text-stone-600">
                        Kitchen Display System (KDS), Table Seating, Status Advancements (Preparing → Ready), Inventory &amp; Reports
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                    Shares Same Laravel Backend
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Node Inspector Details Panel */}
          {selectedNode && (
            <div className="bg-white/95 rounded-3xl border border-stone-200/90 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>Architecture Specification Details: {selectedNode.replace('_', ' ').toUpperCase()}</span>
                </h3>
                <span className="text-xs text-stone-500 font-mono">Ref: Spec Section 3 &amp; 4</span>
              </div>

              {selectedNode === 'flutter_app' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">Tech Stack</strong>
                    <p>Flutter SDK 3.x, Dart 3.x, Provider/Bloc for state management, Dio for HTTP networking, CachedNetworkImage, QR Flutter for check-in generation.</p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">5 Navigation Pillars</strong>
                    <p>Home (Greetings, Banners, Cuisines), Menu (Hierarchical categories &amp; items), Booking (Visual Table layout), Orders (Live tracking), Profile (Settings &amp; favs).</p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">Authentication &amp; Security</strong>
                    <p>JWT / Laravel Sanctum Bearer tokens stored in Flutter Secure Storage; encrypted local persistence for customer session.</p>
                  </div>
                </div>
              )}

              {selectedNode === 'laravel_backend' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">API Framework</strong>
                    <p>Laravel 11, PHP 8.3, RESTful JSON resource controllers with FormRequest validation and API resource transformations.</p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">Key API Routes</strong>
                    <p className="font-mono text-[11px] text-amber-800 font-semibold">POST /api/v1/auth/login<br />GET /api/v1/menu/cuisines<br />POST /api/v1/orders<br />POST /api/v1/reservations/check-availability</p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">Business Invariants</strong>
                    <p>Enforces table conflict detection, deposit requirement rules ($20 for VIP/events), inventory availability checks, and order lifecycle transitions.</p>
                  </div>
                </div>
              )}

              {selectedNode === 'postgresql_db' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">Relational Structure</strong>
                    <p>10 core tables with 3rd normal form (3NF) design, foreign keys with referential actions (CASCADE on user deletion, SET NULL on soft relations).</p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">ACID Transactions</strong>
                    <p>Checkout and reservation booking operations wrapped in database transactions to guarantee no double-booking of tables or inventory de-synchronization.</p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-2xl space-y-1 border border-stone-200">
                    <strong className="text-stone-900 block font-bold">Indexes</strong>
                    <p>B-Tree indexes on reservation_date, user_id, order_status, and composite unique constraints on favorites(user_id, product_id).</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: 02 — SYSTEM PROCESS FLOW
          ========================================================================= */}
      {currentTab === 'process_flow' && (
        <div className="space-y-6">
          <div
            className="bg-white/95 rounded-3xl border border-stone-200/90 p-6 shadow-sm space-y-6 transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className="text-center">
              <span className="text-[11px] font-mono text-amber-800 uppercase tracking-widest font-bold">
                Page 2 of 3: diagrams.net
              </span>
              <h2 className="font-luxury text-2xl font-extrabold text-stone-900 mt-0.5">
                Complete Customer System Process Flowchart
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-xl mx-auto">
                Visual flowchart adhering to standard flowchart symbols: Rounded Start/End, Rectangles for Screens/Actions, Diamonds for Decision Points
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Phase 1 */}
              <div className="p-5 rounded-3xl bg-stone-50/80 border border-stone-200 space-y-3">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Phase 1: Entry &amp; Authentication Flow</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  <div className="px-3.5 py-1.5 rounded-full bg-emerald-700 text-white font-bold shadow-xs">
                    ● START
                  </div>
                  <span className="text-stone-400 font-bold">→</span>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 shadow-xs font-semibold">
                    Splash Screen
                  </div>
                  <span className="text-stone-400 font-bold">→</span>
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-bold flex items-center gap-1 shadow-xs">
                    <span>◆ Already Logged In?</span>
                  </div>
                  <span className="text-stone-400 font-bold">→</span>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 shadow-xs font-semibold">
                    Onboarding / Login / Register
                  </div>
                  <span className="text-stone-400 font-bold">→</span>
                  <div className="px-3.5 py-1.5 rounded-xl terracotta-gradient-bg text-white font-bold shadow-xs">
                    HOME DASHBOARD
                  </div>
                </div>
              </div>

              {/* Phase 2: Dual Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branch A: Food Ordering */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      <span>Branch A: Food Ordering Process</span>
                    </h3>
                    <span className="text-[10px] text-stone-500 font-mono font-semibold">8 Major Stages</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { step: '01', title: 'Open Menu & Choose Cuisine', desc: 'Khmer, Western, Chinese, Drinks' },
                      { step: '02', title: 'Choose Category & Product List', desc: 'Appetizers, Main Dishes, Soups, etc.' },
                      { step: '03', title: 'Product Details & Add-ons', desc: 'Portion size, spice level, extras' },
                      { step: '04', title: 'Add to Cart & View Cart', desc: 'Bill splitter, tip, promo coupon' },
                      { step: '05', title: 'Checkout: Order Type', desc: 'Dine-in (Table #) vs Takeaway' },
                      { step: '06', title: 'Payment Method Decision', desc: 'Cash vs KHQR Online vs Credit Card', diamond: true },
                      { step: '07', title: 'Payment Processing & Verification', desc: 'Scan Bakong QR / Chime Confirmation', diamond: true },
                      { step: '08', title: 'Order Confirmation & Live Tracking', desc: 'Placed → Confirmed → Preparing → Ready → Completed' },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className={`p-2.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                          item.diamond
                            ? 'bg-amber-50/80 border-amber-300 text-stone-800'
                            : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold text-amber-800 shrink-0">
                          {item.step}
                        </span>
                        <div>
                          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                            {item.diamond && <span className="text-amber-700 font-bold">◆</span>}
                            <span>{item.title}</span>
                          </div>
                          <div className="text-[11px] text-stone-500">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Branch B: Table Reservation */}
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Branch B: Table &amp; VIP Reservation</span>
                    </h3>
                    <span className="text-[10px] text-stone-500 font-mono font-semibold">8 Major Stages</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { step: '01', title: 'Choose Reservation Type', desc: 'Window Table, VIP Suite, Event' },
                      { step: '02', title: 'Select Date, Time & Guests', desc: 'Interactive calendar & slot stepper' },
                      { step: '03', title: 'Check Availability Decision', desc: 'Is table/room available at requested time?', diamond: true },
                      { step: '04', title: 'Architectural Floor Plan Selection', desc: 'Visual CAD seats (T01-T05, VIP-02)' },
                      { step: '05', title: 'Extra Services & Special Request', desc: 'Birthday decoration, cake, projector' },
                      { step: '06', title: 'Booking Summary & Deposit Check', desc: 'Deposit required for VIP / Events? ($20)', diamond: true },
                      { step: '07', title: 'Deposit Payment (if required)', desc: 'KHQR scan or counter hold' },
                      { step: '08', title: 'Booking Confirmation & QR Code', desc: 'Generates RES-000125 QR for arrival check-in' },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className={`p-2.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                          item.diamond
                            ? 'bg-emerald-50/80 border-emerald-300 text-stone-800'
                            : 'bg-stone-50 border-stone-200 text-stone-700'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold text-emerald-800 shrink-0">
                          {item.step}
                        </span>
                        <div>
                          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                            {item.diamond && <span className="text-emerald-700 font-bold">◆</span>}
                            <span>{item.title}</span>
                          </div>
                          <div className="text-[11px] text-stone-500">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: 03 — LOGICAL DATA MODEL (ERD)
          ========================================================================= */}
      {currentTab === 'erd' && (
        <div className="space-y-6">
          <div
            className="bg-white/95 rounded-3xl border border-stone-200/90 p-6 shadow-sm space-y-6 transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] font-mono text-amber-800 uppercase tracking-widest font-bold">
                  Page 3 of 3: diagrams.net
                </span>
                <h2 className="font-luxury text-2xl font-extrabold text-stone-900 mt-0.5">
                  Logical Data Model (ERD) — 10 Entities
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Relational entities with Crow's Foot cardinality, Primary Keys (PK), Foreign Keys (FK), and Data Types
                </p>
              </div>

              {/* Search filter for tables */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={erdSearch}
                    onChange={(e) => setErdSearch(e.target.value)}
                    placeholder="Filter entities..."
                    className="bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 font-mono shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Visual ERD Entity Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'USERS', entity: 'Entity 1', border: 'border-stone-300', header: 'bg-stone-100 text-stone-900', fields: ['🔑 id (UUID, PK)', 'name (VARCHAR 120)', 'email (VARCHAR 255, UNIQUE)', 'phone (VARCHAR 32)', 'password_hash (VARCHAR 255)', 'profile_image (TEXT)', 'created_at, updated_at'] },
                { name: 'CUISINES', entity: 'Entity 2', border: 'border-amber-300', header: 'bg-amber-100 text-amber-950', fields: ['🔑 id (UUID, PK)', 'slug (VARCHAR 64, UNIQUE)', 'name (VARCHAR 100)', 'local_name (VARCHAR 150)', 'description (TEXT)'] },
                { name: 'CATEGORIES', entity: 'Entity 3', border: 'border-amber-300', header: 'bg-amber-100 text-amber-950', fields: ['🔑 id (UUID, PK)', '🔗 cuisine_id (UUID, FK → CUISINES)', 'name (VARCHAR 100)', 'description (TEXT)', 'display_order (INT)'] },
                { name: 'PRODUCTS', entity: 'Entity 4', border: 'border-emerald-300', header: 'bg-emerald-100 text-emerald-950', fields: ['🔑 id (UUID, PK)', '🔗 category_id (UUID, FK → CATEGORIES)', '🔗 cuisine_id (UUID, FK → CUISINES)', 'name (VARCHAR 150)', 'price (NUMERIC 10,2)', 'spice_level (INT)', 'image_url (TEXT)', 'is_available (BOOLEAN)'] },
                { name: 'FAVORITES', entity: 'Entity 5', border: 'border-rose-300', header: 'bg-rose-100 text-rose-950', fields: ['🔑 id (UUID, PK)', '🔗 user_id (UUID, FK → USERS)', '🔗 product_id (UUID, FK → PRODUCTS)', 'created_at (TIMESTAMP)', 'UNIQUE(user_id, product_id)'] },
                { name: 'TABLES', entity: 'Entity 6', border: 'border-cyan-300', header: 'bg-cyan-100 text-cyan-950', fields: ['🔑 id (UUID, PK)', 'table_number (VARCHAR 30, UNIQUE)', 'table_type (VARCHAR 50)', 'capacity (INT)', 'status (VARCHAR 30)', 'ambiance_description (TEXT)'] },
                { name: 'ORDERS', entity: 'Entity 7', border: 'border-purple-300', header: 'bg-purple-100 text-purple-950', fields: ['🔑 id (UUID, PK)', '🔗 user_id (UUID, FK → USERS)', 'order_number (VARCHAR 50, UNIQUE)', 'order_type (VARCHAR 30)', '🔗 table_id (UUID, FK → TABLES)', 'subtotal, discount, tax, tip', 'total (NUMERIC 10,2)', 'order_status, payment_status'] },
                { name: 'ORDER_ITEMS', entity: 'Entity 8', border: 'border-purple-300', header: 'bg-purple-100 text-purple-950', fields: ['🔑 id (UUID, PK)', '🔗 order_id (UUID, FK → ORDERS)', '🔗 product_id (UUID, FK → PRODUCTS)', 'selected_size (VARCHAR 50)', 'selected_add_ons (JSONB)', 'selected_spice_level (INT)', 'quantity (INT), unit_price, subtotal'] },
                { name: 'RESERVATIONS', entity: 'Entity 9', border: 'border-amber-300', header: 'bg-amber-100 text-amber-950', fields: ['🔑 id (UUID, PK)', 'booking_id (VARCHAR 50, UNIQUE)', '🔗 user_id (UUID, FK → USERS)', '🔗 table_id (UUID, FK → TABLES)', 'reservation_type (VARCHAR 50)', 'reservation_date, time, guest_count', 'deposit_amount, deposit_paid', 'status, qr_code_data'] },
                { name: 'PAYMENTS', entity: 'Entity 10', border: 'border-emerald-300', header: 'bg-emerald-100 text-emerald-950', fields: ['🔑 id (UUID, PK)', '🔗 user_id (UUID, FK → USERS)', '🔗 order_id (UUID, FK → ORDERS)', '🔗 reservation_id (UUID, FK → RESERVATIONS)', 'amount (NUMERIC 10,2)', 'payment_method, payment_status', 'transaction_reference (VARCHAR 150)'] },
              ]
                .filter((item) =>
                  erdSearch.trim()
                    ? item.name.toLowerCase().includes(erdSearch.toLowerCase()) ||
                      item.fields.some((f) => f.toLowerCase().includes(erdSearch.toLowerCase()))
                    : true
                )
                .map((entity) => (
                  <div key={entity.name} className={`rounded-3xl bg-white border ${entity.border} overflow-hidden text-xs shadow-xs`}>
                    <div className={`px-4 py-2.5 font-bold flex justify-between border-b ${entity.header}`}>
                      <span>{entity.name}</span>
                      <span className="font-mono text-[10px] opacity-75">{entity.entity}</span>
                    </div>
                    <div className="p-3.5 space-y-1 font-mono text-[11px] text-stone-700">
                      {entity.fields.map((f, i) => (
                        <div key={i} className={f.includes('🔑') ? 'text-amber-800 font-bold' : f.includes('🔗') ? 'text-sky-700 font-semibold' : ''}>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SQL DDL Modal in Crisp Light Dialog */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-amber-100 text-amber-800">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">PostgreSQL 16 Production DDL Script</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySqlToClipboard}
                  className="px-3 py-1.5 terracotta-gradient-bg text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:brightness-105 cursor-pointer shadow-xs"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto no-scrollbar font-mono text-[11px] text-stone-800 bg-stone-50 border-t border-stone-200">
              <pre className="whitespace-pre-wrap">{postgresSqlSchema}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
