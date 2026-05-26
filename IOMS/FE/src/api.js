const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/ioms/api';

const clone = (value) => JSON.parse(JSON.stringify(value));

async function request(path, fallback) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 1200);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch {
    return clone(fallback);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const fetchDashboard = () => request('/dashboard', mockDashboard);
export const fetchOrders = () => request('/orders', mockOrders);
export const fetchInventory = () => request('/inventory', mockInventory);
export const fetchNotifications = () => request('/notifications', mockNotifications);

export const mockDashboard = {
  stats: [
    { label: 'Total Import Requests', value: 384, change: '+12%', icon: 'Package', tone: 'success' },
    { label: 'Total Orders', value: 342, change: '+8%', icon: 'CircleCheck', tone: 'success' },
    { label: 'Pending Orders', value: 42, change: '-5%', icon: 'Clock', tone: 'danger' },
    { label: 'Completed Orders', value: 300, change: '+15%', icon: 'CheckCircle2', tone: 'success' },
  ],
  orderTrend: [
    { label: 'Jan', orders: 45, importRequests: 38 },
    { label: 'Feb', orders: 52, importRequests: 44 },
    { label: 'Mar', orders: 61, importRequests: 51 },
    { label: 'Apr', orders: 58, importRequests: 55 },
    { label: 'May', orders: 69, importRequests: 63 },
    { label: 'Jun', orders: 75, importRequests: 67 },
  ],
  orderStatus: [
    { label: 'Pending', value: 12 },
    { label: 'Confirmed', value: 15 },
    { label: 'Shipped', value: 18 },
    { label: 'Delivered', value: 14 },
    { label: 'Cancelled', value: 16 },
    { label: 'Returned', value: 19 },
  ],
};

export const mockOrders = [
  { orderCode: 'SO-3000', submissionDate: '2026-04-01', itemCount: 5, confirmationStatus: 'Pending', status: 'Pending', expiresIn: '02:45:00' },
  { orderCode: 'SO-3001', submissionDate: '2026-04-02', itemCount: 2, confirmationStatus: 'Approved', status: 'Confirmed' },
  { orderCode: 'SO-3002', submissionDate: '2026-04-03', itemCount: 1, confirmationStatus: 'Rejected', status: 'Shipped' },
  { orderCode: 'SO-3003', submissionDate: '2026-04-04', itemCount: 1, confirmationStatus: 'Pending', status: 'Delivered' },
  { orderCode: 'SO-3004', submissionDate: '2026-04-05', itemCount: 4, confirmationStatus: 'Approved', status: 'Cancelled' },
  { orderCode: 'SO-3005', submissionDate: '2026-04-06', itemCount: 1, confirmationStatus: 'Rejected', status: 'Pending', expiresIn: '02:45:00' },
  { orderCode: 'SO-3006', submissionDate: '2026-04-07', itemCount: 4, confirmationStatus: 'Pending', status: 'Confirmed' },
  { orderCode: 'SO-3007', submissionDate: '2026-04-08', itemCount: 5, confirmationStatus: 'Approved', status: 'Shipped' },
  { orderCode: 'SO-3008', submissionDate: '2026-04-09', itemCount: 5, confirmationStatus: 'Rejected', status: 'Delivered' },
  { orderCode: 'SO-3009', submissionDate: '2026-04-10', itemCount: 3, confirmationStatus: 'Approved', status: 'Confirmed' },
];

export const mockInventory = [
  { id: 1, merchandiseCode: 'PRD-2000', merchandiseName: 'Wireless Headphones', quantity: 322, unit: 'pcs', lastUpdatedDate: '2026-04-01' },
  { id: 2, merchandiseCode: 'PRD-2001', merchandiseName: 'Office Desk Chair', quantity: 178, unit: 'box', lastUpdatedDate: '2026-04-02' },
  { id: 3, merchandiseCode: 'PRD-2002', merchandiseName: 'Cotton T-Shirt', quantity: 621, unit: 'kg', lastUpdatedDate: '2026-04-03' },
  { id: 4, merchandiseCode: 'PRD-2003', merchandiseName: 'Organic Coffee Beans', quantity: 579, unit: 'set', lastUpdatedDate: '2026-04-04' },
  { id: 5, merchandiseCode: 'PRD-2004', merchandiseName: 'Industrial Printer', quantity: 785, unit: 'carton', lastUpdatedDate: '2026-04-05' },
  { id: 6, merchandiseCode: 'PRD-2005', merchandiseName: 'Smart Watch', quantity: 173, unit: 'pcs', lastUpdatedDate: '2026-04-06' },
  { id: 7, merchandiseCode: 'PRD-2006', merchandiseName: 'Ergonomic Keyboard', quantity: 346, unit: 'box', lastUpdatedDate: '2026-04-07' },
  { id: 8, merchandiseCode: 'PRD-2007', merchandiseName: 'Winter Jacket', quantity: 411, unit: 'kg', lastUpdatedDate: '2026-04-08' },
  { id: 9, merchandiseCode: 'PRD-2008', merchandiseName: 'Solar Panel Kit', quantity: 95, unit: 'set', lastUpdatedDate: '2026-04-09' },
  { id: 10, merchandiseCode: 'PRD-2009', merchandiseName: 'Standing Desk', quantity: 236, unit: 'carton', lastUpdatedDate: '2026-04-10' },
];

export const mockNotifications = [
  { id: 1, type: 'warning', title: 'Low inventory', message: 'Product IT-001 has negative available stock.', timestamp: '2026-04-05T14:32:15', read: false },
  { id: 2, type: 'info', title: 'New order', message: 'Order SO-3000 has been submitted for confirmation.', timestamp: '2026-04-05T11:10:00', read: false },
  { id: 3, type: 'success', title: 'Receipt completed', message: 'Import request IMP-002 has been received into warehouse.', timestamp: '2026-04-04T16:08:00', read: true },
  { id: 4, type: 'error', title: 'Import rejected', message: 'Import request IMP-003 failed quality inspection.', timestamp: '2026-04-03T09:45:00', read: true },
];
