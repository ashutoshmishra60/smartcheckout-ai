-- ==============================================================================
-- AI-Powered Automated Retail Checkout System
-- Relational MySQL Seed Data
-- ==============================================================================

USE retail_checkout;

INSERT INTO products (sku, barcode, name, category, price, cost_price, stock_quantity, reorder_level, yolo_class, description, image_url) VALUES
('SKU-BOT-001', '890103000001', 'Sparkling Mineral Water (500ml)', 'Beverages', 1.99, 0.80, 150, 20, 'bottle', 'Crisp natural spring water with gentle carbonation.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80'),
('SKU-BOT-002', '890103000002', 'Organic Green Tea Bottle (400ml)', 'Beverages', 2.49, 1.10, 120, 15, 'bottle', 'Refreshing unsweetened green tea brewed with Japanese leaves.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80'),
('SKU-APP-001', '890103000003', 'Honeycrisp Fresh Apple', 'Produce', 0.99, 0.40, 200, 30, 'apple', 'Sweet, juicy and crisp hand-picked Honeycrisp apple.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80'),
('SKU-BAN-001', '890103000004', 'Organic Cavendish Banana', 'Produce', 0.59, 0.20, 250, 40, 'banana', 'Ripe yellow organic potassium-rich banana.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80'),
('SKU-ORA-001', '890103000005', 'Valencia Citrus Orange', 'Produce', 0.89, 0.35, 180, 25, 'orange', 'Sun-ripened Valencia orange full of Vitamin C.', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&q=80'),
('SKU-CUP-001', '890103000006', 'Eco Ceramic Travel Cup (350ml)', 'Houseware', 6.99, 3.00, 75, 10, 'cup', 'Reusable thermal ceramic cup with splash-resistant lid.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80'),
('SKU-SAN-001', '890103000007', 'Artisan Club Sandwich (Turkey & Swiss)', 'Deli', 5.49, 2.50, 60, 10, 'sandwich', 'Freshly baked sourdough sandwich with smoked turkey and aged cheese.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80'),
('SKU-BOK-001', '890103000008', 'Pocket Journal Notebook (Grid 120p)', 'Stationery', 4.29, 1.80, 90, 15, 'book', 'Durable faux-leather pocket notebook with acid-free paper.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80'),
('SKU-DON-001', '890103000009', 'Classic Glazed Ring Donut', 'Bakery', 1.79, 0.60, 100, 20, 'donut', 'Warm fluffy yeast donut drenched in signature vanilla glaze.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80'),
('SKU-CAK-001', '890103000010', 'Belgian Chocolate Cupcake', 'Bakery', 2.99, 1.20, 80, 15, 'cake', 'Rich moist Belgian chocolate cupcake with fudge frosting.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80');

-- Insert initial sample seed transactions to populate history analytics
INSERT INTO transactions (transaction_uuid, customer_name, payment_method, payment_status, subtotal, tax_rate, tax_amount, discount_amount, total_amount, items_count, detection_confidence_avg, created_at)
VALUES 
('TXN-2026-9001', 'Alice Johnson', 'CARD', 'COMPLETED', 6.47, 8.25, 0.53, 0.00, 7.00, 4, 94.50, NOW() - INTERVAL 2 HOUR),
('TXN-2026-9002', 'Brian Lee', 'UPI', 'COMPLETED', 12.48, 8.25, 1.03, 1.00, 12.51, 3, 96.80, NOW() - INTERVAL 1 HOUR),
('TXN-2026-9003', 'Chloe Davis', 'APPLE_PAY', 'COMPLETED', 4.47, 8.25, 0.37, 0.00, 4.84, 3, 91.20, NOW() - INTERVAL 20 MINUTE);

-- Insert transaction items for sample transactions
INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price, subtotal, yolo_detected_confidence)
VALUES
(1, 1, 'Sparkling Mineral Water (500ml)', 2, 1.99, 3.98, 95.00),
(1, 3, 'Honeycrisp Fresh Apple', 1, 0.99, 0.99, 93.00),
(1, 4, 'Organic Cavendish Banana', 2, 0.59, 1.18, 95.50),
(2, 6, 'Eco Ceramic Travel Cup (350ml)', 1, 6.99, 6.99, 98.00),
(2, 7, 'Artisan Club Sandwich (Turkey & Swiss)', 1, 5.49, 5.49, 95.60),
(3, 1, 'Sparkling Mineral Water (500ml)', 1, 1.99, 1.99, 92.40),
(3, 2, 'Organic Green Tea Bottle (400ml)', 1, 2.49, 2.49, 90.00);
