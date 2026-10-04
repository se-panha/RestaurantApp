/**
 * Diagrams.net (.drawio XML) Multi-Page Generator
 * Exports Page 1 (System Architecture), Page 2 (System Process Flow), Page 3 (Logical Data Model ERD)
 */

export function generateDrawioXml(): string {
  return `<mxfile host="app.diagrams.net" modified="2026-10-03T00:00:00.000Z" agent="AmokBasilArchitect" version="24.7.17">
  <!-- PAGE 1: 01 — SYSTEM ARCHITECTURE -->
  <diagram id="arch_page" name="01 — System Architecture">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#0f172a" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- Header Title Note -->
        <mxCell id="h1" value="Proposed Future System Architecture&#xa;Part 1 Scope: UI/UX design &amp; interactive prototype in Figma&#xa;Future Implementation: Flutter/Dart, Laravel REST API, PostgreSQL, KHQR &amp; FCM" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#f8fafc;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="250" y="20" width="670" height="50" as="geometry" />
        </mxCell>

        <!-- Customer Actor -->
        <mxCell id="act_cust" value="CUSTOMER&#xa;(Android / iOS Device)" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fontColor=#ffffff;strokeColor=#f59e0b;fillColor=#1e293b;" vertex="1" parent="1">
          <mxGeometry x="560" y="90" width="40" height="70" as="geometry" />
        </mxCell>

        <!-- Container: Customer Mobile App (Flutter) -->
        <mxCell id="c_flutter" value="CUSTOMER MOBILE APPLICATION (Flutter / Dart)&#xa;&#xa;[ Home ]  |  [ Menu ]  |  [ Booking ]  |  [ Orders ]  |  [ Profile ]" style="rounded=1;whiteSpace=wrap;html=1;arcSize=10;fillColor=#1e293b;strokeColor=#38bdf8;fontColor=#f8fafc;fontSize=13;fontStyle=1;verticalAlign=top;spacingTop=15;" vertex="1" parent="1">
          <mxGeometry x="280" y="200" width="600" height="100" as="geometry" />
        </mxCell>

        <!-- Connector: Customer to App -->
        <mxCell id="e_cust_app" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#f59e0b;strokeWidth=2;" edge="1" parent="1" source="act_cust" target="c_flutter">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Connector: App to Laravel Backend (HTTPS / REST API / JSON) -->
        <mxCell id="e_app_backend" value="HTTPS&#xa;REST API / JSON&#xa;(Bearer Token)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#f59e0b;strokeWidth=2;fontColor=#f59e0b;fontSize=11;" edge="1" parent="1" source="c_flutter" target="c_laravel">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Container: Laravel Backend -->
        <mxCell id="c_laravel" value="LARAVEL BACKEND (PHP 8.3 / REST API)&#xa;&#xa;Authentication  ·  Menu &amp; Product  ·  Cart &amp; Checkout  ·  Order Management&#xa;Reservation Management  ·  Table Availability  ·  Payment  ·  User / Profile  ·  Notification" style="rounded=1;whiteSpace=wrap;html=1;arcSize=10;fillColor=#1e293b;strokeColor=#ef4444;fontColor=#f8fafc;fontSize=13;fontStyle=1;verticalAlign=top;spacingTop=15;" vertex="1" parent="1">
          <mxGeometry x="260" y="370" width="640" height="120" as="geometry" />
        </mxCell>

        <!-- Container: PostgreSQL Database -->
        <mxCell id="c_postgres" value="POSTGRESQL RELATIONAL DATABASE&#xa;&#xa;users  ·  cuisines  ·  categories  ·  products  ·  favorites&#xa;orders  ·  order_items  ·  tables  ·  reservations  ·  payments" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#1e293b;strokeColor=#10b981;fontColor=#f8fafc;fontSize=12;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="380" y="550" width="400" height="120" as="geometry" />
        </mxCell>

        <!-- Connector: Laravel to Postgres -->
        <mxCell id="e_lar_pg" value="SQL / Eloquent ORM" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#10b981;strokeWidth=2;fontColor=#10b981;fontSize=11;" edge="1" parent="1" source="c_laravel" target="c_postgres">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- External: Payment Provider KHQR -->
        <mxCell id="c_khqr" value="Payment Provider&#xa;Bakong KHQR / NBC&#xa;Deep Link &amp; Webhooks" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#f8fafc;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="100" y="560" width="160" height="80" as="geometry" />
        </mxCell>

        <!-- Connector: Laravel to KHQR -->
        <mxCell id="e_lar_khqr" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#f43f5e;strokeWidth=2;" edge="1" parent="1" source="c_laravel" target="c_khqr">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- External: Firebase Push Notifications -->
        <mxCell id="c_fcm" value="Push Notifications&#xa;Firebase FCM (Cloud)&#xa;Order &amp; Booking Alerts" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#fbbf24;fontColor=#f8fafc;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="900" y="560" width="160" height="80" as="geometry" />
        </mxCell>

        <!-- Connector: Laravel to FCM -->
        <mxCell id="e_lar_fcm" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#fbbf24;strokeWidth=2;" edge="1" parent="1" source="c_laravel" target="c_fcm">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Future Part 2 Management App -->
        <mxCell id="c_mgmt" value="PART 2: MANAGEMENT APP (Admin / Staff)&#xa;Products  ·  Orders  ·  Reservations  ·  Tables  ·  Reports" style="rounded=1;whiteSpace=wrap;html=1;strokeDasharray=3 3;fillColor=#064e3b;strokeColor=#34d399;fontColor=#ffffff;fontSize=12;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="380" y="720" width="400" height="60" as="geometry" />
        </mxCell>

        <!-- Connector: Mgmt App to Laravel -->
        <mxCell id="e_mgmt_lar" value="REST API" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#34d399;strokeWidth=2;fontColor=#34d399;" edge="1" parent="1" source="c_mgmt" target="c_laravel">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="820" y="750" />
              <mxPoint x="820" y="450" />
            </Array>
          </mxGeometry>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>

  <!-- PAGE 2: 02 — SYSTEM PROCESS FLOW -->
  <diagram id="flow_page" name="02 — System Process Flow">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#0f172a" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <mxCell id="flow_title" value="Complete Customer System Process Flowchart&#xa;Standard symbols: Rounded Start/End, Rectangles for Actions, Diamonds for Decisions" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#f8fafc;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="300" y="20" width="560" height="40" as="geometry" />
        </mxCell>

        <!-- Flow Nodes -->
        <mxCell id="f_start" value="START" style="rounded=1;whiteSpace=wrap;html=1;arcSize=50;fillColor=#10b981;strokeColor=#059669;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="530" y="80" width="100" height="40" as="geometry" />
        </mxCell>

        <mxCell id="f_splash" value="Splash &amp; Onboarding" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#64748b;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="510" y="150" width="140" height="40" as="geometry" />
        </mxCell>

        <mxCell id="f_d_auth" value="Logged In?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#f59e0b;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="530" y="220" width="100" height="70" as="geometry" />
        </mxCell>

        <mxCell id="f_home" value="HOME DASHBOARD&#xa;Greetings · Cuisines · Offers · Quick CTA" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#38bdf8;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="490" y="320" width="180" height="50" as="geometry" />
        </mxCell>

        <!-- Branch 1: Menu & Ordering -->
        <mxCell id="f_menu" value="1. Menu &amp; Cuisines&#xa;(Khmer, Western, Chinese, Drinks)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="180" y="410" width="180" height="45" as="geometry" />
        </mxCell>

        <mxCell id="f_prod" value="2. Product Details&#xa;Portion Size, Add-ons &amp; Notes" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="180" y="480" width="180" height="45" as="geometry" />
        </mxCell>

        <mxCell id="f_cart" value="3. Cart &amp; Checkout&#xa;Dine-in (Table #) vs Takeaway" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="180" y="550" width="180" height="45" as="geometry" />
        </mxCell>

        <mxCell id="f_d_pay" value="Payment&#xa;Success?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#f59e0b;" vertex="1" parent="1">
          <mxGeometry x="220" y="620" width="100" height="70" as="geometry" />
        </mxCell>

        <mxCell id="f_track" value="4. Order Tracking&#xa;Placed → Confirmed → Preparing → Ready" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="170" y="720" width="200" height="45" as="geometry" />
        </mxCell>

        <!-- Branch 2: Table & VIP Reservation -->
        <mxCell id="f_res" value="1. Reservation Type &amp; Time&#xa;Table, VIP Room, Event (Guests)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="780" y="410" width="190" height="45" as="geometry" />
        </mxCell>

        <mxCell id="f_d_avail" value="Table&#xa;Available?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#10b981;" vertex="1" parent="1">
          <mxGeometry x="825" y="480" width="100" height="70" as="geometry" />
        </mxCell>

        <mxCell id="f_floor" value="2. Visual Floor Plan&#xa;Select Table T01-T05 or VIP-02" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="780" y="570" width="190" height="45" as="geometry" />
        </mxCell>

        <mxCell id="f_qr" value="3. Booking Confirmation&#xa;Arrival QR Code Check-in RES-000125" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#ffffff;" vertex="1" parent="1">
          <mxGeometry x="770" y="640" width="210" height="45" as="geometry" />
        </mxCell>

        <mxCell id="f_completed" value="COMPLETED" style="rounded=1;whiteSpace=wrap;html=1;arcSize=50;fillColor=#10b981;strokeColor=#059669;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="525" y="750" width="110" height="40" as="geometry" />
        </mxCell>

        <!-- Edges -->
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#94a3b8;" edge="1" parent="1" source="f_start" target="f_splash" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#94a3b8;" edge="1" parent="1" source="f_splash" target="f_d_auth" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#94a3b8;" edge="1" parent="1" source="f_d_auth" target="f_home" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#f59e0b;" edge="1" parent="1" source="f_home" target="f_menu" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#f59e0b;" edge="1" parent="1" source="f_menu" target="f_prod" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#f59e0b;" edge="1" parent="1" source="f_prod" target="f_cart" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#f59e0b;" edge="1" parent="1" source="f_cart" target="f_d_pay" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#10b981;" edge="1" parent="1" source="f_d_pay" target="f_track" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#10b981;" edge="1" parent="1" source="f_home" target="f_res" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#10b981;" edge="1" parent="1" source="f_res" target="f_d_avail" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#10b981;" edge="1" parent="1" source="f_d_avail" target="f_floor" />
        <mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#10b981;" edge="1" parent="1" source="f_floor" target="f_qr" />
      </root>
    </mxGraphModel>
  </diagram>

  <!-- PAGE 3: 03 — LOGICAL DATA MODEL (ERD) -->
  <diagram id="erd_page" name="03 — Logical Data Model (ERD)">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#0f172a" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <mxCell id="erd_title" value="Logical Data Model (ERD) — 10 Entities&#xa;Relational Schema: USERS, CUISINES, CATEGORIES, PRODUCTS, FAVORITES, ORDERS, ORDER_ITEMS, TABLES, RESERVATIONS, PAYMENTS" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=14;fontColor=#f8fafc;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="150" y="20" width="870" height="40" as="geometry" />
        </mxCell>

        <!-- USERS -->
        <mxCell id="erd_users" value="USERS&#xa;----------------&#xa;PK id: UUID&#xa;name: VARCHAR&#xa;email: VARCHAR&#xa;phone: VARCHAR&#xa;password_hash: VARCHAR&#xa;profile_image: TEXT" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#6366f1;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="80" y="80" width="160" height="150" as="geometry" />
        </mxCell>

        <!-- ORDERS -->
        <mxCell id="erd_orders" value="ORDERS&#xa;----------------&#xa;PK id: UUID&#xa;FK user_id: UUID&#xa;order_number: VARCHAR&#xa;order_type: VARCHAR&#xa;FK table_id: UUID&#xa;total: NUMERIC&#xa;order_status: VARCHAR" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#a855f7;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="320" y="80" width="170" height="170" as="geometry" />
        </mxCell>

        <!-- ORDER_ITEMS -->
        <mxCell id="erd_items" value="ORDER_ITEMS&#xa;----------------&#xa;PK id: UUID&#xa;FK order_id: UUID&#xa;FK product_id: UUID&#xa;quantity: INT&#xa;unit_price: NUMERIC&#xa;subtotal: NUMERIC" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#a855f7;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="560" y="80" width="160" height="150" as="geometry" />
        </mxCell>

        <!-- PRODUCTS -->
        <mxCell id="erd_products" value="PRODUCTS&#xa;----------------&#xa;PK id: UUID&#xa;FK category_id: UUID&#xa;FK cuisine_id: UUID&#xa;name: VARCHAR&#xa;price: NUMERIC&#xa;image_url: TEXT&#xa;is_available: BOOLEAN" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="800" y="80" width="170" height="170" as="geometry" />
        </mxCell>

        <!-- CATEGORIES -->
        <mxCell id="erd_categories" value="CATEGORIES&#xa;----------------&#xa;PK id: UUID&#xa;FK cuisine_id: UUID&#xa;name: VARCHAR&#xa;description: TEXT" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="800" y="310" width="170" height="120" as="geometry" />
        </mxCell>

        <!-- CUISINES -->
        <mxCell id="erd_cuisines" value="CUISINES&#xa;----------------&#xa;PK id: UUID&#xa;slug: VARCHAR&#xa;name: VARCHAR&#xa;description: TEXT" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="800" y="490" width="170" height="120" as="geometry" />
        </mxCell>

        <!-- RESERVATIONS -->
        <mxCell id="erd_res" value="RESERVATIONS&#xa;----------------&#xa;PK id: UUID&#xa;FK user_id: UUID&#xa;FK table_id: UUID&#xa;booking_id: VARCHAR&#xa;reservation_date: DATE&#xa;guest_count: INT&#xa;deposit_amount: NUMERIC&#xa;status: VARCHAR&#xa;qr_code_data: TEXT" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#f59e0b;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="80" y="320" width="170" height="200" as="geometry" />
        </mxCell>

        <!-- TABLES -->
        <mxCell id="erd_tables" value="TABLES&#xa;----------------&#xa;PK id: UUID&#xa;table_number: VARCHAR&#xa;table_type: VARCHAR&#xa;capacity: INT&#xa;status: VARCHAR" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#06b6d4;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="320" y="340" width="160" height="140" as="geometry" />
        </mxCell>

        <!-- PAYMENTS -->
        <mxCell id="erd_pay" value="PAYMENTS&#xa;----------------&#xa;PK id: UUID&#xa;FK user_id: UUID&#xa;FK order_id: UUID&#xa;FK reservation_id: UUID&#xa;amount: NUMERIC&#xa;payment_method: VARCHAR&#xa;payment_status: VARCHAR&#xa;transaction_ref: VARCHAR" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#10b981;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="220" y="570" width="180" height="190" as="geometry" />
        </mxCell>

        <!-- FAVORITES -->
        <mxCell id="erd_fav" value="FAVORITES&#xa;----------------&#xa;PK id: UUID&#xa;FK user_id: UUID&#xa;FK product_id: UUID&#xa;created_at: TIMESTAMP" style="shape=table;startSize=25;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#1e293b;strokeColor=#f43f5e;fontColor=#ffffff;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="540" y="340" width="160" height="120" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

export function downloadDrawioFile(filename = 'restaurant_reservation_ordering_spec.drawio'): void {
  const xmlContent = generateDrawioXml();
  const blob = new Blob([xmlContent], { type: 'application/vnd.jgraph.mxfile;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
