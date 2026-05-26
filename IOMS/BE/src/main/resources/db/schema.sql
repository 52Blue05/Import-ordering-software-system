-- =========================================
-- IOMS DATABASE SCHEMA - COMPLETE REBUILD
-- PostgreSQL
-- Site-Centric Architecture
-- =========================================

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS receipt_items CASCADE;
DROP TABLE IF EXISTS receipts CASCADE;
DROP TABLE IF EXISTS inspection_photos CASCADE;
DROP TABLE IF EXISTS inspection_items CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS import_request_items CASCADE;
DROP TABLE IF EXISTS import_requests CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100)
);

INSERT INTO users
(username, password, email, full_name, role, department)
VALUES
('admin', 'admin123', 'admin@ioms.com', 'Nguyễn Văn Admin', 'admin', 'Management'),
('inspector', 'inspector123', 'inspector@ioms.com', 'Trần Thị Inspector', 'inspector', 'Quality Control'),
('warehouse', 'warehouse123', 'warehouse@ioms.com', 'Lê Văn Warehouse', 'warehouse_staff', 'Warehouse'),
('sales', 'sales123', 'sales@ioms.com', 'Phạm Thị Sales', 'sales', 'Sales');

CREATE TABLE sites (
    id VARCHAR(50) PRIMARY KEY,
    site_code VARCHAR(100) NOT NULL UNIQUE,
    site_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    days_for_delivery_by_ship INT DEFAULT 30,
    days_for_delivery_by_air INT DEFAULT 3,
    status VARCHAR(50) DEFAULT 'Active',
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO sites (id, site_code, site_name, location, days_for_delivery_by_ship, days_for_delivery_by_air, status, created_by) VALUES
('SITE-001', 'SITE-9001', 'Ho Chi Minh City Distribution Center', 'Ho Chi Minh City, Vietnam', 30, 3, 'Active', 'System'),
('SITE-002', 'SITE-9002', 'Hanoi Distribution Center', 'Hanoi, Vietnam', 32, 2, 'Active', 'System'),
('SITE-003', 'SITE-9003', 'Da Nang Regional Hub', 'Da Nang, Vietnam', 28, 2, 'Active', 'System'),
('SITE-004', 'SITE-9004', 'Bangkok Distribution Center', 'Bangkok, Thailand', 25, 1, 'Active', 'System'),
('SITE-005', 'SITE-9005', 'Singapore Distribution Center', 'Singapore', 20, 1, 'Active', 'System');

CREATE TABLE items (
    id VARCHAR(50) PRIMARY KEY,
    item_code VARCHAR(100) NOT NULL UNIQUE,
    item_name VARCHAR(255) NOT NULL,
    site_id VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    quantity INT DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    unit_price BIGINT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

INSERT INTO items (id, item_code, item_name, site_id, description, quantity, unit, unit_price, status, created_by) VALUES
('ITEM-001', 'LP-2024', 'Laptop Computer', 'SITE-001', 'High-end laptop with 16GB RAM', 50, 'pcs', 100000, 'Active', 'System'),
('ITEM-002', 'OC-2024', 'Office Chair', 'SITE-001', 'Ergonomic office chair with lumbar support', 100, 'pcs', 50000, 'Active', 'System'),
('ITEM-003', 'DK-2024', 'Desk Keyboard', 'SITE-001', 'Mechanical keyboard RGB', 75, 'pcs', 25000, 'Active', 'System'),
('ITEM-004', 'WM-2024', 'Wireless Mouse', 'SITE-002', 'Bluetooth wireless mouse', 200, 'pcs', 10000, 'Active', 'System'),
('ITEM-005', 'UC-2024', 'USB Cable', 'SITE-002', 'USB 3.0 cable 2m', 500, 'pcs', 5000, 'Active', 'System'),
('ITEM-006', 'PM-2024', 'Power Monitor', 'SITE-002', 'Portable power monitor', 60, 'pcs', 80000, 'Active', 'System'),
('ITEM-007', 'LM-2024', 'LED Monitor', 'SITE-003', '24 inch LED monitor', 75, 'pcs', 75000, 'Active', 'System'),
('ITEM-008', 'SB-2024', 'Speaker Box', 'SITE-003', '2.1 Channel speaker system', 40, 'pcs', 45000, 'Active', 'System'),
('ITEM-009', 'WC-2024', 'Webcam HD', 'SITE-003', '1080p HD webcam', 120, 'pcs', 15000, 'Active', 'System');

CREATE TABLE import_requests (
    id VARCHAR(20) PRIMARY KEY,
    request_date DATE,
    supplier VARCHAR(255),
    supplier_code VARCHAR(50),
    status VARCHAR(50),
    total_items INT,
    total_amount BIGINT,
    currency VARCHAR(10),
    expected_delivery DATE,
    actual_delivery DATE,
    notes TEXT,
    inspection_status VARCHAR(50),
    inspected_by VARCHAR(100),
    approved_by VARCHAR(100),
    rejection_reason TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP
);

CREATE TABLE import_request_items (
    id SERIAL PRIMARY KEY,
    import_request_id VARCHAR(20) REFERENCES import_requests(id) ON DELETE CASCADE,
    product_code VARCHAR(50),
    product_name VARCHAR(255),
    unit VARCHAR(20),
    quantity INT,
    unit_price BIGINT,
    total_price BIGINT
);

INSERT INTO import_requests VALUES
('IMP-001','2025-05-15','ABC Electronics Co., Ltd','SUP-001','pending_inspection',50,2500000,'VND','2025-05-20',NULL,'Lô hàng điện tử công nghiệp','in_progress','Trần Thị Inspector',NULL,NULL,'Nguyễn Văn Admin','2025-05-15 08:30:00'),
('IMP-002','2025-05-14','XYZ Components Factory','SUP-002','completed',100,5000000,'VND','2025-05-18','2025-05-18','Linh kiện thay thế cho dây chuyền sản xuất','completed','Trần Thị Inspector','Nguyễn Văn Admin',NULL,'Phạm Thị Sales','2025-05-14 09:00:00'),
('IMP-003','2025-05-13','Global Supplies Ltd','SUP-003','rejected',75,3750000,'VND','2025-05-16',NULL,'Nhôm cấu trúc - BỊ TỪ CHỐI','rejected','Trần Thị Inspector',NULL,'Không đạt tiêu chuẩn chất lượng, có vết cấy trầy xước','Phạm Thị Sales','2025-05-13 10:15:00'),
('IMP-004','2025-05-12','Tech Solutions Vietnam','SUP-004','approved',200,10000000,'VND','2025-05-19',NULL,'Thiết bị máy tính và phụ kiện','approved','Trần Thị Inspector','Nguyễn Văn Admin',NULL,'Phạm Thị Sales','2025-05-12 14:45:00'),
('IMP-005','2025-05-10','Industrial Parts Co.','SUP-005','completed',150,7500000,'VND','2025-05-15','2025-05-15','Ổ bi, vòng bi, chi tiết máy móc','completed','Trần Thị Inspector','Nguyễn Văn Admin',NULL,'Lê Văn Warehouse','2025-05-10 11:20:00');

INSERT INTO import_request_items
(import_request_id, product_code, product_name, unit, quantity, unit_price, total_price)
VALUES
('IMP-001','ELEC-001','Bộ điều khiển PLC','pcs',20,50000,1000000),
('IMP-001','ELEC-002','Cảm biến nhiệt độ','pcs',30,50000,1500000),
('IMP-002','COMP-001','Relay điều khiển','pcs',50,80000,4000000),
('IMP-002','COMP-002','Bộ lọc khí','pcs',50,20000,1000000),
('IMP-003','ALU-001','Profil nhôm 40x40','m',500,7500,3750000),
('IMP-004','IT-001','Màn hình LCD 24 inch','pcs',50,100000,5000000),
('IMP-004','IT-002','Bàn phím cơ','pcs',100,50000,5000000),
('IMP-005','BEAR-001','Ổ bi SKF 6308','pcs',100,50000,5000000),
('IMP-005','BEAR-002','Vòng bi đơn','pcs',50,50000,2500000);

CREATE TABLE inspections (
    id VARCHAR(20) PRIMARY KEY,
    import_request_id VARCHAR(20) REFERENCES import_requests(id),
    inspector_name VARCHAR(100),
    inspector_id INT,
    inspection_date TIMESTAMP,
    status VARCHAR(50),
    total_items_to_inspect INT,
    total_items_inspected INT,
    defect_rate NUMERIC(5,2),
    comments TEXT,
    approved_date TIMESTAMP
);

CREATE TABLE inspection_items (
    id SERIAL PRIMARY KEY,
    inspection_id VARCHAR(20) REFERENCES inspections(id) ON DELETE CASCADE,
    product_code VARCHAR(50),
    product_name VARCHAR(255),
    quantity_received INT,
    quantity_inspected INT,
    quantity_defective INT,
    notes TEXT
);

CREATE TABLE inspection_photos (
    id SERIAL PRIMARY KEY,
    inspection_id VARCHAR(20) REFERENCES inspections(id) ON DELETE CASCADE,
    url TEXT,
    description TEXT
);

INSERT INTO inspections VALUES
('INS-001','IMP-001','Trần Thị Inspector',2,'2025-05-16 09:00:00','in_progress',50,35,0.08,'Đang kiểm tra, sẽ hoàn tất vào chiều nay',NULL),
('INS-002','IMP-002','Trần Thị Inspector',2,'2025-05-17 08:30:00','completed',100,100,0.02,'Lô hàng đạt chất lượng, chấp nhận toàn bộ','2025-05-17 14:00:00');

INSERT INTO inspection_items
(inspection_id, product_code, product_name, quantity_received, quantity_inspected, quantity_defective, notes)
VALUES
('INS-001','ELEC-001','Bộ điều khiển PLC',20,15,1,'1 sản phẩm có lỗi kỹ thuật'),
('INS-001','ELEC-002','Cảm biến nhiệt độ',30,20,3,'3 sản phẩm hư pin'),
('INS-002','COMP-001','Relay điều khiển',50,50,1,'1 relay hư, thay thế được'),
('INS-002','COMP-002','Bộ lọc khí',50,50,0,'Tất cả đạt tiêu chuẩn');

INSERT INTO inspection_photos
(inspection_id, url, description)
VALUES
('INS-001','/photos/inspection-001.jpg','Tổng quan lô hàng'),
('INS-001','/photos/inspection-002.jpg','Chi tiết sản phẩm hư'),
('INS-002','/photos/inspection-003.jpg','Relay điều khiển');

CREATE TABLE receipts (
    id VARCHAR(20) PRIMARY KEY,
    import_request_id VARCHAR(20) REFERENCES import_requests(id),
    receipt_date TIMESTAMP,
    warehouse VARCHAR(100),
    warehouse_keeper VARCHAR(100),
    status VARCHAR(50),
    total_items INT,
    received_items INT,
    notes TEXT,
    signature VARCHAR(100),
    created_at TIMESTAMP
);

CREATE TABLE receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id VARCHAR(20) REFERENCES receipts(id) ON DELETE CASCADE,
    product_code VARCHAR(50),
    product_name VARCHAR(255),
    quantity INT,
    unit VARCHAR(20),
    location VARCHAR(100)
);

INSERT INTO receipts VALUES
('RCP-001','IMP-002','2025-05-18 10:30:00','Warehouse A','Lê Văn Warehouse','completed',100,100,'Hàng đã nhập kho thành công','Lê Văn Warehouse','2025-05-18 10:30:00'),
('RCP-002','IMP-004','2025-05-19 14:15:00','Warehouse B','Lê Văn Warehouse','in_progress',200,150,'Đang nhập kho, còn 50 sản phẩm chưa bố trí',NULL,'2025-05-19 14:15:00');

INSERT INTO receipt_items
(receipt_id, product_code, product_name, quantity, unit, location)
VALUES
('RCP-001','COMP-001','Relay điều khiển',50,'pcs','Shelf A-15'),
('RCP-001','COMP-002','Bộ lọc khí',50,'pcs','Shelf B-8'),
('RCP-002','IT-001','Màn hình LCD 24 inch',50,'pcs','Shelf C-3'),
('RCP-002','IT-002','Bàn phím cơ',100,'pcs','Shelf D-7');

CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY,
    order_date DATE,
    customer VARCHAR(255),
    customer_code VARCHAR(50),
    site_id VARCHAR(50) NOT NULL,
    status VARCHAR(50),
    total_items INT,
    total_amount BIGINT,
    currency VARCHAR(10),
    expected_delivery DATE,
    actual_delivery DATE,
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    created_by VARCHAR(100),
    created_at TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(id) ON DELETE CASCADE,
    product_code VARCHAR(50),
    product_name VARCHAR(255),
    unit VARCHAR(20),
    quantity INT,
    unit_price BIGINT,
    total_price BIGINT
);

INSERT INTO orders VALUES
('ORD-001','2025-05-18','Công Ty ABC','CUST-001','SITE-001','confirmed',30,1500000,'VND','2025-05-25',NULL,NULL,NULL,'Phạm Thị Sales','2025-05-18 09:45:00'),
('ORD-002','2025-05-17','Công Ty XYZ','CUST-002','SITE-002','shipped',50,2500000,'VND','2025-05-24',NULL,'TRACK-2025-0002','Giao Hàng Nhanh','Phạm Thị Sales','2025-05-17 11:20:00'),
('ORD-003','2025-05-16','Công Ty DEF','CUST-003','SITE-003','delivered',25,1250000,'VND','2025-05-22','2025-05-21','TRACK-2025-0001','Viettel Post','Phạm Thị Sales','2025-05-16 08:10:00');

INSERT INTO order_items
(order_id, product_code, product_name, unit, quantity, unit_price, total_price)
VALUES
('ORD-001','COMP-001','Relay điều khiển','pcs',20,80000,1600000),
('ORD-001','ELEC-001','Bộ điều khiển PLC','pcs',10,50000,500000),
('ORD-002','IT-001','Màn hình LCD 24 inch','pcs',30,100000,3000000),
('ORD-002','IT-002','Bàn phím cơ','pcs',20,50000,1000000),
('ORD-003','BEAR-001','Ổ bi SKF 6308','pcs',25,50000,1250000);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_code VARCHAR(50),
    product_name VARCHAR(255),
    category VARCHAR(100),
    site_id VARCHAR(50) NOT NULL,
    unit VARCHAR(20),
    quantity_on_hand INT,
    quantity_reserved INT,
    quantity_available INT,
    reorder_level INT,
    reorder_quantity INT,
    unit_price BIGINT,
    supplier VARCHAR(255),
    last_restock_date DATE,
    location VARCHAR(100),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

INSERT INTO inventory
(product_code, product_name, category, site_id, unit, quantity_on_hand,
 quantity_reserved, quantity_available, reorder_level,
 reorder_quantity, unit_price, supplier,
 last_restock_date, location)
VALUES
('ELEC-001','Bộ điều khiển PLC','Electronics','SITE-001','pcs',45,10,35,20,50,50000,'ABC Electronics Co., Ltd','2025-05-15','Shelf A-5'),
('ELEC-002','Cảm biến nhiệt độ','Electronics','SITE-001','pcs',57,0,57,30,100,50000,'ABC Electronics Co., Ltd','2025-05-15','Shelf A-6'),
('COMP-001','Relay điều khiển','Components','SITE-001','pcs',99,20,79,50,100,80000,'XYZ Components Factory','2025-05-18','Shelf B-3'),
('COMP-002','Bộ lọc khí','Components','SITE-002','pcs',50,5,45,20,50,20000,'XYZ Components Factory','2025-05-18','Shelf B-4'),
('IT-001','Màn hình LCD 24 inch','IT Equipment','SITE-002','pcs',20,30,-10,15,50,100000,'Tech Solutions Vietnam','2025-05-19','Shelf C-3'),
('IT-002','Bàn phím cơ','IT Equipment','SITE-002','pcs',120,20,100,50,100,50000,'Tech Solutions Vietnam','2025-05-19','Shelf D-7'),
('BEAR-001','Ổ bi SKF 6308','Bearings','SITE-003','pcs',75,25,50,30,100,50000,'Industrial Parts Co.','2025-05-15','Shelf E-2'),
('BEAR-002','Vòng bi đơn','Bearings','SITE-003','pcs',50,0,50,25,50,50000,'Industrial Parts Co.','2025-05-15','Shelf E-3');

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    timestamp TIMESTAMP,
    read BOOLEAN
);

INSERT INTO notifications
(type, title, message, timestamp, read)
VALUES
('warning','Hàng tồn kém','Sản phẩm IT-001 (Màn hình LCD 24 inch) có số lượng âm: -10 pcs','2025-05-19 15:30:00',false),
('info','Đơn hàng mới','Đơn hàng ORD-001 từ Công Ty ABC đã được xác nhận','2025-05-18 09:45:00',false),
('success','Nhập hàng hoàn tất','Lô hàng IMP-002 đã được kiểm tra và nhập kho hoàn tất','2025-05-18 10:30:00',true),
('error','Lô hàng bị từ chối','Lô hàng IMP-003 từ Global Supplies Ltd bị từ chối do không đạt chất lượng','2025-05-13 11:20:00',true);

SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Sites', COUNT(*) FROM sites
UNION ALL
SELECT 'Items', COUNT(*) FROM items
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'Import Requests', COUNT(*) FROM import_requests
UNION ALL
SELECT 'Inspections', COUNT(*) FROM inspections
UNION ALL
SELECT 'Receipts', COUNT(*) FROM receipts
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
