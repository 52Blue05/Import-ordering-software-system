import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleCheck,
  Clock,
  Filter,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  Minus,
  MoreVertical,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Square,
  Trash2,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Wifi,
  X,
} from 'lucide-react';
import {
  fetchDashboard,
  fetchInventory,
  fetchNotifications,
  fetchOrders,
  mockDashboard,
} from './api.js';

const navigation = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'orders', label: 'Orders', icon: ShoppingCart },
  { key: 'inventory', label: 'Inventory', icon: Warehouse },
  { key: 'profile', label: 'Profile', icon: MapPin },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const statIcons = {
  Package,
  CircleCheck,
  CheckCircle2,
  CircleCheckBig: CheckCircle2,
  Clock,
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboard, setDashboard] = useState(mockDashboard);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchDashboard(),
      fetchOrders(),
      fetchInventory(),
      fetchNotifications(),
    ]).then(([dashboardData, orderData, inventoryData, notificationData]) => {
      if (!mounted) return;
      setDashboard(dashboardData);
      setOrders(orderData);
      setInventory(inventoryData);
      setNotifications(notificationData);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppShell activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'dashboard' && <DashboardPage dashboard={dashboard} />}
      {activePage === 'orders' && <OrdersPage orders={orders} />}
      {activePage === 'inventory' && <InventoryPage inventory={inventory} />}
      {activePage === 'profile' && <ProfilePage />}
      {activePage === 'notifications' && <NotificationsPage notifications={notifications} />}
      {activePage === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

function AppShell({ activePage, setActivePage, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-title">Import Order Management</div>
        <div className="topbar-user">
          <div className="user-copy">
            <span>John Doe</span>
            <small>Overseas Site</small>
          </div>
          <div className="avatar">J</div>
          <button className="window-control" aria-label="Minimize" title="Minimize">
            <Minus size={18} />
          </button>
          <button className="window-control" aria-label="Maximize" title="Maximize">
            <Square size={17} />
          </button>
          <button className="window-control" aria-label="Close" title="Close">
            <X size={20} />
          </button>
        </div>
      </header>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <LayoutDashboard size={20} />
          </div>
          <span>IOMS</span>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`nav-item ${activePage === item.key ? 'active' : ''}`}
                onClick={() => setActivePage(item.key)}
                type="button"
              >
                <Icon size={24} strokeWidth={2.3} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="logout-button" type="button">
          <LogOut size={23} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-content">{children}</main>

      <footer className="statusbar">
        <div className="status-left">
          <span className="status-dot" />
          <span>System Ready</span>
          <span className="divider" />
          <span>Role: Overseas Site</span>
        </div>
        <div className="status-right">
          <span>Last sync: 2026-04-05 14:32:15</span>
          <span className="divider" />
          <Wifi size={17} />
          <span>Connected</span>
        </div>
      </footer>

      <button className="help-button" type="button" aria-label="Help" title="Help">
        ?
      </button>
    </div>
  );
}

function DashboardPage({ dashboard }) {
  return (
    <section className="page dashboard-page">
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Overview of import order management system</p>
      </div>

      <div className="stats-grid">
        {dashboard.stats.map((stat) => {
          const Icon = statIcons[stat.icon] || Package;
          const ChangeIcon = stat.tone === 'danger' ? TrendingDown : TrendingUp;
          return (
            <article className="stat-card" key={stat.label}>
              <div className="stat-topline">
                <div className={`stat-icon ${stat.tone}`}>
                  <Icon size={27} />
                </div>
                <div className={`stat-change ${stat.tone}`}>
                  <ChangeIcon size={20} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <strong>{Number(stat.value).toLocaleString('en-US')}</strong>
              <span>{stat.label}</span>
            </article>
          );
        })}
      </div>

      <div className="chart-grid">
        <section className="chart-panel">
          <div className="panel-heading compact">
            <h2>Order Trends</h2>
            <p>Monthly orders and requests over time</p>
          </div>
          <LineChart data={dashboard.orderTrend} />
        </section>
        <section className="chart-panel">
          <div className="panel-heading compact">
            <h2>Order Status</h2>
            <p>Pending vs completed orders</p>
          </div>
          <BarChart data={dashboard.orderStatus} />
        </section>
      </div>
    </section>
  );
}

function OrdersPage({ orders }) {
  return (
    <section className="page table-page">
      <div className="data-panel">
        <div className="panel-heading">
          <h1>Orders</h1>
          <p>Track and manage all site orders</p>
        </div>
        <div className="table-wrap">
          <table className="data-table orders-table">
            <thead>
              <tr>
                <th>Order Code</th>
                <th>Submission Date</th>
                <th>Number of Merchandise Items</th>
                <th>Confirmation Status</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const statusLabel = labelize(order.status);
                return (
                  <tr key={`${order.orderCode}-${index}`}>
                    <td>{order.orderCode}</td>
                    <td>
                      <div className="date-cell">
                        <strong>{formatDate(order.submissionDate)}</strong>
                        {order.expiresIn && <small>Expires in {order.expiresIn}</small>}
                      </div>
                    </td>
                    <td>{order.itemCount}</td>
                    <td>{order.confirmationStatus}</td>
                    <td>
                      <span className={`status-chip ${statusClass(statusLabel)}`}>{statusLabel}</span>
                    </td>
                    <td>
                      <IconButton label="More actions">
                        <MoreVertical size={22} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function InventoryPage({ inventory }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(new Set());

  const filteredInventory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return inventory;

    return inventory.filter((item) => {
      return [item.merchandiseCode, item.merchandiseName, item.category, item.siteId]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [inventory, query]);

  const allSelected = filteredInventory.length > 0 && filteredInventory.every((item) => selected.has(item.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filteredInventory.map((item) => item.id)));
  };

  const toggleRow = (id) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  return (
    <section className="page table-page">
      <div className="data-panel inventory-panel">
        <div className="panel-heading split">
          <div>
            <h1>Inventory Management</h1>
            <p>Monitor warehouse inventory levels and locations</p>
          </div>
          <button className="primary-button" type="button">
            <Plus size={21} />
            <span>Add New</span>
          </button>
        </div>

        <div className="toolbar">
          <label className="search-field">
            <Search size={24} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by SKU, Name..."
            />
          </label>
          <button className="toolbar-button" type="button">
            <Filter size={22} />
            <span>Filter</span>
          </button>
          <IconButton label="Delete selected" disabled={selected.size === 0}>
            <Trash2 size={20} />
          </IconButton>
          <IconButton label="Refresh inventory">
            <RefreshCw size={20} />
          </IconButton>
        </div>

        <div className="table-wrap">
          <table className="data-table inventory-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all rows" />
                </th>
                <th>Merchandise Code</th>
                <th>Merchandise Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Last Updated Date</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleRow(item.id)}
                      aria-label={`Select ${item.merchandiseCode}`}
                    />
                  </td>
                  <td>{item.merchandiseCode}</td>
                  <td>{item.merchandiseName}</td>
                  <td>{Number(item.quantity).toLocaleString('en-US')}</td>
                  <td>{item.unit}</td>
                  <td>{formatDate(item.lastUpdatedDate)}</td>
                  <td>
                    <IconButton label="More actions">
                      <MoreVertical size={22} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ProfilePage() {
  return (
    <section className="page simple-page">
      <div className="data-panel simple-panel">
        <div className="panel-heading">
          <h1>Profile</h1>
          <p>Account and site assignment</p>
        </div>
        <div className="profile-grid">
          <InfoRow label="Name" value="John Doe" />
          <InfoRow label="Role" value="Overseas Site" />
          <InfoRow label="Department" value="Import Operations" />
          <InfoRow label="Assigned Site" value="Singapore Distribution Center" />
        </div>
      </div>
    </section>
  );
}

function NotificationsPage({ notifications }) {
  return (
    <section className="page simple-page">
      <div className="data-panel simple-panel">
        <div className="panel-heading">
          <h1>Notifications</h1>
          <p>Recent import, order, and inventory alerts</p>
        </div>
        <div className="notification-list">
          {notifications.map((notification) => (
            <article className={`notification-item ${notification.read ? '' : 'unread'}`} key={notification.id}>
              <NotificationIcon type={notification.type} />
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>{formatTimestamp(notification.timestamp)}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="page simple-page">
      <div className="data-panel simple-panel">
        <div className="panel-heading">
          <h1>Settings</h1>
          <p>Operational preferences</p>
        </div>
        <div className="settings-list">
          <SettingRow label="Automatic sync" value="Enabled" />
          <SettingRow label="Default currency" value="VND" />
          <SettingRow label="Approval workflow" value="Inspection required" />
        </div>
      </div>
    </section>
  );
}

function LineChart({ data }) {
  const width = 520;
  const height = 320;
  const pad = { left: 58, right: 28, top: 30, bottom: 52 };
  const values = data.flatMap((point) => [point.orders, point.importRequests || 0]);
  const maxValue = Math.max(1, ...values);
  const yMax = maxValue > 80 ? 100 : Math.ceil(maxValue / 5) * 5;
  const ticks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const toX = (index) => {
    if (data.length === 1) {
      return width / 2;
    }
    return pad.left + (index * (width - pad.left - pad.right)) / (data.length - 1);
  };
  const toY = (value) => height - pad.bottom - (value / yMax) * (height - pad.top - pad.bottom);

  const pathFor = (key) => data.map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(index)} ${toY(point[key] || 0)}`).join(' ');

  return (
    <div className="chart-canvas">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Order trend chart">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={toY(tick)} y2={toY(tick)} className="grid-line" />
            <text x={pad.left - 10} y={toY(tick) + 5} textAnchor="end" className="axis-label">
              {Math.round(tick)}
            </text>
          </g>
        ))}
        {data.map((point, index) => (
          <g key={point.label}>
            <line x1={toX(index)} x2={toX(index)} y1={pad.top} y2={height - pad.bottom} className="grid-line vertical" />
            <text x={toX(index)} y={height - 17} textAnchor="middle" className="axis-label">
              {point.label}
            </text>
          </g>
        ))}
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} className="axis-line" />
        <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} className="axis-line" />
        <path d={pathFor('importRequests')} className="line-path secondary" />
        <path d={pathFor('orders')} className="line-path primary" />
        {data.map((point, index) => (
          <circle key={`${point.label}-dot`} cx={toX(index)} cy={toY(point.orders)} r="5.2" className="line-dot" />
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const width = 520;
  const height = 320;
  const pad = { left: 58, right: 28, top: 30, bottom: 52 };
  const maxValue = Math.max(1, ...data.map((point) => point.value));
  const yMax = maxValue > 50 ? 60 : Math.ceil(maxValue / 5) * 5;
  const ticks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];
  const slot = (width - pad.left - pad.right) / Math.max(1, data.length);
  const barWidth = Math.min(22, slot * 0.38);
  const toY = (value) => height - pad.bottom - (value / yMax) * (height - pad.top - pad.bottom);

  return (
    <div className="chart-canvas">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Order status chart">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={toY(tick)} y2={toY(tick)} className="grid-line" />
            <text x={pad.left - 10} y={toY(tick) + 5} textAnchor="end" className="axis-label">
              {Math.round(tick)}
            </text>
          </g>
        ))}
        {data.map((point, index) => {
          const x = pad.left + index * slot + slot / 2;
          const y = toY(point.value);
          return (
            <g key={point.label}>
              <line x1={x} x2={x} y1={pad.top} y2={height - pad.bottom} className="grid-line vertical" />
              <rect x={x - barWidth / 2} y={y} width={barWidth} height={height - pad.bottom - y} rx="5" className="bar" />
              <text x={x} y={height - 17} textAnchor="middle" className="axis-label">
                {shortLabel(point.label)}
              </text>
            </g>
          );
        })}
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} className="axis-line" />
        <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} className="axis-line" />
      </svg>
    </div>
  );
}

function IconButton({ label, disabled = false, children }) {
  return (
    <button className="icon-button" type="button" aria-label={label} title={label} disabled={disabled}>
      {children}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function NotificationIcon({ type }) {
  const Icon = type === 'warning' ? AlertTriangle : type === 'success' ? CheckCircle2 : type === 'error' ? X : Info;
  return (
    <span className={`notification-icon ${type}`}>
      <Icon size={20} />
    </span>
  );
}

function labelize(value) {
  if (!value) return 'Pending';
  return String(value)
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function statusClass(status) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  if (['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'completed'].includes(key)) {
    return key;
  }
  return 'neutral';
}

function shortLabel(label) {
  const value = labelize(label);
  return value.length > 10 ? `${value.slice(0, 9)}.` : value;
}

function formatDate(value) {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

function formatTimestamp(value) {
  if (!value) return '-';
  return String(value).replace('T', ' ').slice(0, 16);
}

export default App;
