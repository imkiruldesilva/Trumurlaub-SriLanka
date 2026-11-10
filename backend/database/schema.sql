-- ===================================================================
-- TRAUMURLAUB LANKA – RELATIONAL DATABASE SCHEMA (MySQL / PostgreSQL)
-- ===================================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customer Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country VARCHAR(100),
  arrival_date DATE,
  departure_date DATE,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  tour_package VARCHAR(150),
  excursion VARCHAR(150),
  accommodation VARCHAR(100),
  travel_interests TEXT,
  budget VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'confirmed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  tour_package VARCHAR(150),
  travel_date VARCHAR(100),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Initial Seed Data (Verified Reviews)
INSERT INTO reviews (customer_name, country, email, tour_package, travel_date, rating, title, message, status)
VALUES 
('Thomas & Claudia Weber', 'Germany', 'thomas.weber@example.de', '7 Nights / 8 Days Island Tour', 'October 2026', 5, 'Unforgettable 8-Day Island Tour with Nirosh!', 'Traumurlaub Lanka made our Sri Lankan holiday perfection! Nirosh was attentive, deeply knowledgeable about local history, wildlife in Yala, and showed us hidden viewpoints in Ella away from crowded spots. Exceptional hospitality!', 'approved'),
('David Sterling', 'United Kingdom', 'david.sterling@example.co.uk', '5 Nights / 6 Days Highlights', 'September 2026', 5, 'Sigiriya, Kandy & Cultural Triangle Wonder', 'Traveling with Nirosh felt like having an old friend show us his beautiful home island. Seeing wild elephant herds in Udawalawe and the sunrise over Sigiriya rock will stay in our hearts forever. Highly recommend Traumurlaub Lanka!', 'approved'),
('Sophie Dubois', 'France', 'sophie.dubois@example.fr', 'Customized Sri Lanka Tour', 'August 2026', 5, 'Magical Ella Train & Galle Fort Coastline', 'The scenic hill country train to Demodara Nine Arch Bridge and the coastal charm of Galle Fort were breathtaking. Nirosh arranged lovely boutique stays and ensured every single transfer was seamless and stress-free.', 'approved'),
('Marcus Lindner', 'Austria', 'marcus.lindner@example.at', '7 Nights / 8 Days Island Tour', 'July 2026', 5, 'Best Safari & Beach Holiday in Sri Lanka', 'From the leopard sighting in Yala to relaxing on the golden beaches of Mirissa, every detail was carefully planned. Traumurlaub Lanka is the most genuine and trustworthy tour partner you could find.', 'approved');
