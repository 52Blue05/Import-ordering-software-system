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

export async function createInventoryItem(payload) {
  const response = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || `HTTP ${response.status}`);
    error.httpStatus = response.status;
    throw error;
  }

  return response.json();
}

export const mockDashboard = {
  stats: [
    { label: 'Total Import Requests', value: 384, change: '+12%', icon: 'Package', tone: 'success' },
    { label: 'Total Orders', value: 342, change: '+8%', icon: 'CircleCheck', tone: 'success' },
    { label: 'Pending Orders', value: 42, change: '-5%', icon: 'Clock', tone: 'danger' },
    { label: 'Completed Orders', value: 300, change: '+15%', icon: 'CheckCircle2', tone: 'success' },
  ],
  orderTrend: [
    { label: 'Jan', orders: 45, importRequests: 52 },
    { label: 'Feb', orders: 52, importRequests: 58 },
    { label: 'Mar', orders: 61, importRequests: 67 },
    { label: 'Apr', orders: 58, importRequests: 64 },
    { label: 'May', orders: 69, importRequests: 73 },
    { label: 'Jun', orders: 75, importRequests: 81 },
  ],
  orderStatus: [
    { label: 'Jan', pending: 12, completed: 33 },
    { label: 'Feb', pending: 15, completed: 37 },
    { label: 'Mar', pending: 18, completed: 43 },
    { label: 'Apr', pending: 14, completed: 44 },
    { label: 'May', pending: 16, completed: 53 },
    { label: 'Jun', pending: 19, completed: 56 },
  ],
  recentActivity: [
    { id: 1, tone: 'orange', title: 'New import request created', actor: 'John Doe', time: '2 hours ago' },
    { id: 2, tone: 'blue', title: 'Order #1234 approved', actor: 'Jane Smith', time: '4 hours ago' },
    { id: 3, tone: 'green', title: 'Inventory item updated', actor: 'Warehouse Team', time: '6 hours ago' },
  ],
};

export const mockOrders = [
  { orderCode: 'SO-3000', submissionDate: '2026-04-01', itemCount: 4, confirmationStatus: 'Pending', status: 'Pending', expiresIn: '02:45:00' },
  { orderCode: 'SO-3001', submissionDate: '2026-04-02', itemCount: 5, confirmationStatus: 'Approved', status: 'Confirmed' },
  { orderCode: 'SO-3002', submissionDate: '2026-04-03', itemCount: 5, confirmationStatus: 'Rejected', status: 'Shipped' },
  { orderCode: 'SO-3003', submissionDate: '2026-04-04', itemCount: 5, confirmationStatus: 'Pending', status: 'Delivered' },
  { orderCode: 'SO-3004', submissionDate: '2026-04-05', itemCount: 1, confirmationStatus: 'Approved', status: 'Cancelled' },
  { orderCode: 'SO-3005', submissionDate: '2026-04-06', itemCount: 5, confirmationStatus: 'Rejected', status: 'Pending', expiresIn: '02:45:00' },
  { orderCode: 'SO-3006', submissionDate: '2026-04-07', itemCount: 2, confirmationStatus: 'Pending', status: 'Confirmed' },
  { orderCode: 'SO-3007', submissionDate: '2026-04-08', itemCount: 2, confirmationStatus: 'Approved', status: 'Shipped' },
  { orderCode: 'SO-3008', submissionDate: '2026-04-09', itemCount: 2, confirmationStatus: 'Rejected', status: 'Delivered' },
  { orderCode: 'SO-3009', submissionDate: '2026-04-10', itemCount: 3, confirmationStatus: 'Approved', status: 'Confirmed' },
];

export const mockInventory = [
  { id: 1, merchandiseCode: 'PRD-2000', merchandiseName: 'Wireless Headphones', quantity: 764, unit: 'pcs', lastUpdatedDate: '2026-04-01' },
  { id: 2, merchandiseCode: 'PRD-2001', merchandiseName: 'Office Desk Chair', quantity: 539, unit: 'box', lastUpdatedDate: '2026-04-02' },
  { id: 3, merchandiseCode: 'PRD-2002', merchandiseName: 'Cotton T-Shirt', quantity: 217, unit: 'kg', lastUpdatedDate: '2026-04-03' },
  { id: 4, merchandiseCode: 'PRD-2003', merchandiseName: 'Organic Coffee Beans', quantity: 746, unit: 'set', lastUpdatedDate: '2026-04-04' },
  { id: 5, merchandiseCode: 'PRD-2004', merchandiseName: 'Industrial Printer', quantity: 750, unit: 'carton', lastUpdatedDate: '2026-04-05' },
  { id: 6, merchandiseCode: 'PRD-2005', merchandiseName: 'Smart Watch', quantity: 500, unit: 'pcs', lastUpdatedDate: '2026-04-06' },
  { id: 7, merchandiseCode: 'PRD-2006', merchandiseName: 'Ergonomic Keyboard', quantity: 678, unit: 'box', lastUpdatedDate: '2026-04-07' },
  { id: 8, merchandiseCode: 'PRD-2007', merchandiseName: 'Winter Jacket', quantity: 252, unit: 'kg', lastUpdatedDate: '2026-04-08' },
  { id: 9, merchandiseCode: 'PRD-2008', merchandiseName: 'Solar Panel Kit', quantity: 95, unit: 'set', lastUpdatedDate: '2026-04-09' },
  { id: 10, merchandiseCode: 'PRD-2009', merchandiseName: 'Standing Desk', quantity: 236, unit: 'carton', lastUpdatedDate: '2026-04-10' },
];

export const mockNotifications = [
  { id: 1, type: 'warning', title: 'Low inventory', message: 'Product IT-001 has negative available stock.', timestamp: '2026-04-05T14:32:15', read: false },
  { id: 2, type: 'info', title: 'New order', message: 'Order SO-3000 has been submitted for confirmation.', timestamp: '2026-04-05T11:10:00', read: false },
  { id: 3, type: 'success', title: 'Receipt completed', message: 'Import request IMP-002 has been received into warehouse.', timestamp: '2026-04-04T16:08:00', read: true },
  { id: 4, type: 'error', title: 'Import rejected', message: 'Import request IMP-003 failed quality inspection.', timestamp: '2026-04-03T09:45:00', read: true },
];
