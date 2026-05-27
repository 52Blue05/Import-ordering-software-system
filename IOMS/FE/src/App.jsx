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
  createInventoryItem,
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

  const handleCreateInventoryItem = async (item) => {
    const payload = {
      merchandiseCode: item.merchandiseCode,
      merchandiseName: item.merchandiseName,
      quantity: Number(item.quantity),
      unit: item.unit,
      lastUpdatedDate: item.lastUpdatedDate,
      notes: item.notes,
    };

    try {
      const savedItem = await createInventoryItem(payload);
      setInventory((current) => [savedItem, ...current]);
      return savedItem;
    } catch (error) {
      if (error.httpStatus) {
        throw error;
      }
      const localItem = {
        id: Date.now(),
        merchandiseCode: payload.merchandiseCode,
        merchandiseName: payload.merchandiseName,
        quantity: payload.quantity,
        unit: payload.unit,
        lastUpdatedDate: payload.lastUpdatedDate,
        notes: payload.notes,
      };
      setInventory((current) => [localItem, ...current]);
      return localItem;
    }
  };

  const handleUpdateInventoryItem = (updatedItem) => {
    setInventory((current) => current.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  return (
    <AppShell activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'dashboard' && <DashboardPage dashboard={dashboard} />}
      {activePage === 'orders' && <OrdersPage orders={orders} />}
      {activePage === 'inventory' && (
        <InventoryPage
          inventory={inventory}
          onCreateInventoryItem={handleCreateInventoryItem}
          onUpdateInventoryItem={handleUpdateInventoryItem}
        />
      )}
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

      <RecentActivity activities={dashboard.recentActivity || []} />
    </section>
  );
}

function OrdersPage({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <section className={`page table-page ${selectedOrder ? 'with-drawer' : ''}`}>
      <div className="workspace-grid">
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
                    <tr className={selectedOrder?.orderCode === order.orderCode ? 'selected-row' : ''} key={`${order.orderCode}-${index}`}>
                      <td>{order.orderCode}</td>
                      <td>
                        <div className="date-cell">
                          <strong>{formatDate(order.submissionDate)}</strong>
                          {order.expiresIn && <small>Expires in {order.expiresIn}</small>}
                        </div>
                      </td>
                      <td>{order.itemCount}</td>
                      <td>{labelize(order.confirmationStatus)}</td>
                      <td>
                        <span className={`status-chip ${statusClass(statusLabel)}`}>{statusLabel}</span>
                      </td>
                      <td>
                        <IconButton label="Open order details" onClick={() => setSelectedOrder(order)}>
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

        {selectedOrder && <OrderDetailsDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      </div>
    </section>
  );
}

function InventoryPage({ inventory, onCreateInventoryItem, onUpdateInventoryItem }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState(null);

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
    <section className={`page table-page ${selectedItem ? 'with-drawer' : ''}`}>
      <div className="workspace-grid">
        <div className="data-panel inventory-panel">
          <div className="panel-heading split">
            <div>
              <h1>Inventory Management</h1>
              <p>Monitor warehouse inventory levels and locations</p>
            </div>
            <button className="primary-button" type="button" onClick={() => setFormMode({ type: 'create' })}>
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
                  <tr className={selectedItem?.id === item.id ? 'selected-row' : ''} key={item.id}>
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
                      <IconButton label="Open inventory details" onClick={() => setSelectedItem(item)}>
                        <MoreVertical size={22} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedItem && (
          <InventoryDetailsDrawer
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={() => setFormMode({ type: 'edit', item: selectedItem })}
          />
        )}
      </div>

      {formMode && (
        <InventoryFormModal
          mode={formMode.type}
          item={formMode.item}
          onClose={() => setFormMode(null)}
          onSubmit={async (values) => {
            if (formMode.type === 'edit') {
              const updatedItem = { ...formMode.item, ...values, quantity: Number(values.quantity) };
              onUpdateInventoryItem(updatedItem);
              setSelectedItem(updatedItem);
              setFormMode(null);
              return;
            }

            const createdItem = await onCreateInventoryItem(values);
            setSelectedItem(createdItem);
            setFormMode(null);
          }}
        />
      )}
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

function RecentActivity({ activities }) {
  const rows = activities.length > 0 ? activities : [
    { id: 1, tone: 'orange', title: 'New import request created', actor: 'John Doe', time: '2 hours ago' },
    { id: 2, tone: 'blue', title: 'Order #1234 approved', actor: 'Jane Smith', time: '4 hours ago' },
  ];

  return (
    <section className="recent-panel">
      <div className="panel-heading compact">
        <h2>Recent Activity</h2>
        <p>Latest updates and actions</p>
      </div>
      <div className="activity-list">
        {rows.map((activity) => (
          <article className="activity-row" key={activity.id}>
            <span className={`activity-dot ${activity.tone}`} />
            <div className="activity-copy">
              <strong>{activity.title}</strong>
              <span>by {activity.actor}</span>
            </div>
            <time>{activity.time}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrderDetailsDrawer({ order, onClose }) {
  const confirmationStatus = labelize(order.confirmationStatus);
  const status = labelize(order.status);
  const merchandiseItems = buildOrderItems(order);

  return (
    <aside className="details-drawer">
      <div className="drawer-header">
        <h2>Order Details</h2>
        <button className="drawer-close" type="button" aria-label="Close order details" title="Close" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="drawer-body">
        <DetailField label="Order Code" value={order.orderCode} />
        <DetailField label="Submission Date" value={formatDate(order.submissionDate)} />
        <DetailField label="Number of Merchandise Items" value={order.itemCount} />
        <DetailField label="Confirmation Status" value={confirmationStatus} />
        <DetailField label="Status" value={status} />

        <div className="drawer-section">
          <h3>Merchandise Items</h3>
          <div className="drawer-table-wrap">
            <table className="drawer-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Expected Date</th>
                </tr>
              </thead>
              <tbody>
                {merchandiseItems.map((item) => (
                  <tr key={item.code}>
                    <td>
                      <strong>{item.code}</strong>
                      <span>{item.name}</span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.expectedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="drawer-actions">
        <OrderActionButtons confirmationStatus={confirmationStatus} />
      </div>
    </aside>
  );
}

function OrderActionButtons({ confirmationStatus }) {
  const key = confirmationStatus.toLowerCase();

  if (key === 'pending') {
    return (
      <>
        <button className="drawer-action approve" type="button">Approve Order</button>
        <button className="drawer-action reject" type="button">Reject Order</button>
      </>
    );
  }

  if (key === 'rejected') {
    return (
      <>
        <button className="drawer-action reject" type="button">View Rejection Reason</button>
        <button className="drawer-action secondary" type="button">View Full History</button>
      </>
    );
  }

  return (
    <>
      <button className="drawer-action primary" type="button">Edit Details</button>
      <button className="drawer-action secondary" type="button">View Full History</button>
    </>
  );
}

function InventoryDetailsDrawer({ item, onClose, onEdit }) {
  return (
    <aside className="details-drawer">
      <div className="drawer-header">
        <h2>Inventory Details</h2>
        <button className="drawer-close" type="button" aria-label="Close inventory details" title="Close" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="drawer-body">
        <DetailField label="Merchandise Code" value={item.merchandiseCode} />
        <DetailField label="Merchandise Name" value={item.merchandiseName} />
        <DetailField label="Quantity" value={Number(item.quantity).toLocaleString('en-US')} />
        <DetailField label="Unit" value={item.unit} />
        <DetailField label="Last Updated Date" value={formatDate(item.lastUpdatedDate)} />

        <div className="drawer-section">
          <h3>Activity Timeline</h3>
          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <strong>Order created</strong>
              <small>John Doe - 2 hours ago</small>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-actions">
        <button className="drawer-action primary" type="button" onClick={onEdit}>Edit Details</button>
        <button className="drawer-action secondary" type="button">View Full History</button>
      </div>
    </aside>
  );
}

function InventoryFormModal({ mode, item, onClose, onSubmit }) {
  const [values, setValues] = useState(() => ({
    merchandiseCode: item?.merchandiseCode || '',
    merchandiseName: item?.merchandiseName || '',
    quantity: item?.quantity || '',
    unit: item?.unit || '',
    lastUpdatedDate: formatDate(item?.lastUpdatedDate) === '-' ? '' : formatDate(item?.lastUpdatedDate),
    notes: item?.notes || item?.location || '',
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      window.alert('Unable to save inventory item. Please check the entered data or backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="inventory-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <h2>{mode === 'edit' ? 'Edit Inventory Item' : 'Add Inventory Item'}</h2>
            <p>{mode === 'edit' ? 'Update inventory item details' : 'Fill in the details to add inventory'}</p>
          </div>
          <button className="drawer-close" type="button" aria-label="Close form" title="Close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <FormField label="Merchandise Code" required>
            <input
              value={values.merchandiseCode}
              onChange={(event) => updateField('merchandiseCode', event.target.value)}
              required
            />
          </FormField>
          <FormField label="Merchandise Name" required>
            <input
              value={values.merchandiseName}
              onChange={(event) => updateField('merchandiseName', event.target.value)}
              required
            />
          </FormField>
          <FormField label="Quantity" required>
            <input
              min="0"
              type="number"
              value={values.quantity}
              onChange={(event) => updateField('quantity', event.target.value)}
              required
            />
          </FormField>
          <FormField label="Unit" required>
            <select value={values.unit} onChange={(event) => updateField('unit', event.target.value)} required>
              <option value="">Select Unit</option>
              <option value="pcs">pcs</option>
              <option value="box">box</option>
              <option value="kg">kg</option>
              <option value="set">set</option>
              <option value="carton">carton</option>
            </select>
          </FormField>
          <FormField label="Last Updated Date" required>
            <input
              type="date"
              value={values.lastUpdatedDate}
              onChange={(event) => updateField('lastUpdatedDate', event.target.value)}
              required
            />
          </FormField>
          <FormField className="full-span" label="Notes">
            <textarea value={values.notes} onChange={(event) => updateField('notes', event.target.value)} />
          </FormField>
        </div>

        <div className="modal-actions">
          <button className="modal-button secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="modal-button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, required = false, className = '', children }) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label} {required && <b>*</b>}</span>
      {children}
    </label>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="detail-field">
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

function LineChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
  const activePoint = hoveredIndex == null ? null : data[hoveredIndex];
  const activeX = hoveredIndex == null ? 0 : toX(hoveredIndex);
  const tooltipX = Math.min(width - 140, activeX + 14);
  const tooltipY = activePoint ? Math.max(28, toY(Math.max(activePoint.orders || 0, activePoint.importRequests || 0)) + 12) : 0;
  const hitWidth = (width - pad.left - pad.right) / Math.max(1, data.length);

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
        <path d={pathFor('orders')} className="line-path orders-line" />
        <path d={pathFor('importRequests')} className="line-path requests-line" />
        {data.map((point, index) => (
          <g key={`${point.label}-dots`}>
            <circle cx={toX(index)} cy={toY(point.orders)} r="5.2" className="line-dot orders-dot" />
            <circle cx={toX(index)} cy={toY(point.importRequests || 0)} r="5.2" className="line-dot requests-dot" />
          </g>
        ))}
        {activePoint && (
          <g className="chart-tooltip">
            <line x1={activeX} x2={activeX} y1={pad.top} y2={height - pad.bottom} className="chart-hover-line" />
            <rect x={tooltipX} y={tooltipY} width="112" height="112" rx="8" />
            <text x={tooltipX + 14} y={tooltipY + 29}>{activePoint.label}</text>
            <text x={tooltipX + 14} y={tooltipY + 61}>orders : {activePoint.orders}</text>
            <text x={tooltipX + 14} y={tooltipY + 93} className="tooltip-blue">requests : {activePoint.importRequests || 0}</text>
          </g>
        )}
        {data.map((point, index) => (
          <rect
            key={`${point.label}-hit`}
            x={toX(index) - hitWidth / 2}
            y={pad.top}
            width={hitWidth}
            height={height - pad.top - pad.bottom}
            className="chart-hit-area"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const normalizedData = normalizeBarData(data);
  const width = 520;
  const height = 320;
  const pad = { left: 58, right: 28, top: 30, bottom: 52 };
  const maxValue = Math.max(1, ...normalizedData.flatMap((point) => [point.pending, point.completed]));
  const yMax = maxValue > 50 ? 60 : Math.ceil(maxValue / 5) * 5;
  const ticks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];
  const slot = (width - pad.left - pad.right) / Math.max(1, normalizedData.length);
  const barWidth = Math.min(26, slot * 0.28);
  const toY = (value) => height - pad.bottom - (value / yMax) * (height - pad.top - pad.bottom);
  const activePoint = hoveredIndex == null ? null : normalizedData[hoveredIndex];
  const activeX = hoveredIndex == null ? 0 : pad.left + hoveredIndex * slot + slot / 2;
  const tooltipX = Math.min(width - 150, activeX + 14);
  const tooltipY = activePoint ? Math.max(30, toY(Math.max(activePoint.pending, activePoint.completed)) + 24) : 0;

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
        {normalizedData.map((point, index) => {
          const x = pad.left + index * slot + slot / 2;
          const pendingY = toY(point.pending);
          const completedY = toY(point.completed);
          return (
            <g key={point.label}>
              {hoveredIndex === index && (
                <rect x={x - slot / 2 + 6} y={pad.top} width={slot - 12} height={height - pad.top - pad.bottom} className="bar-hover-zone" />
              )}
              <line x1={x} x2={x} y1={pad.top} y2={height - pad.bottom} className="grid-line vertical" />
              <rect x={x - barWidth - 4} y={pendingY} width={barWidth} height={height - pad.bottom - pendingY} rx="5" className="bar pending-bar" />
              <rect x={x + 4} y={completedY} width={barWidth} height={height - pad.bottom - completedY} rx="5" className="bar completed-bar" />
              <text x={x} y={height - 17} textAnchor="middle" className="axis-label">
                {shortLabel(point.label)}
              </text>
              <rect
                x={x - slot / 2}
                y={pad.top}
                width={slot}
                height={height - pad.top - pad.bottom}
                className="chart-hit-area"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} className="axis-line" />
        <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} className="axis-line" />
        {activePoint && (
          <g className="chart-tooltip">
            <rect x={tooltipX} y={tooltipY} width="126" height="112" rx="8" />
            <text x={tooltipX + 14} y={tooltipY + 29}>{activePoint.label}</text>
            <text x={tooltipX + 14} y={tooltipY + 61} className="tooltip-orange">pending : {activePoint.pending}</text>
            <text x={tooltipX + 14} y={tooltipY + 93} className="tooltip-green">completed : {activePoint.completed}</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function IconButton({ label, disabled = false, onClick, children }) {
  return (
    <button className="icon-button" type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}>
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

function normalizeBarData(data) {
  if (!data.length) return [];
  if ('pending' in data[0] || 'completed' in data[0]) {
    return data.map((point) => ({
      label: point.label,
      pending: Number(point.pending || 0),
      completed: Number(point.completed || 0),
    }));
  }

  return data.map((point) => {
    const label = labelize(point.label);
    const key = label.toLowerCase();
    return {
      label,
      pending: key.includes('pending') || key.includes('confirmed') ? Number(point.value || 0) : 0,
      completed: key.includes('delivered') || key.includes('completed') || key.includes('shipped') ? Number(point.value || 0) : 0,
    };
  });
}

function buildOrderItems(order) {
  if (order.items?.length) return order.items;

  const count = Math.max(1, Number(order.itemCount || 1));
  return Array.from({ length: Math.min(count, 5) }, (_, index) => ({
    code: `PRD-${2000 + index * 5 + (Number(String(order.orderCode).replace(/\D/g, '').slice(-1)) || 0)}`,
    name: ['Wireless Headphones', 'Office Desk Chair', 'Cotton T-Shirt', 'Industrial Printer', 'Smart Watch'][index % 5],
    quantity: 147 + index * 23 + count,
    unit: ['pcs', 'box', 'kg', 'carton', 'set'][index % 5],
    expectedDate: `2026-05-${String(index + 1).padStart(2, '0')}`,
  }));
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
