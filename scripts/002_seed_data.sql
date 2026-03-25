-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('เกมวางแผน', 'เกมที่ต้องใช้กลยุทธ์และการวางแผน'),
  ('เกมปาร์ตี้', 'เกมสนุกสำหรับเล่นกับเพื่อนๆ'),
  ('เกมครอบครัว', 'เกมที่เหมาะสำหรับทุกวัย'),
  ('เกมการ์ด', 'เกมที่ใช้การ์ดเป็นหลัก')
ON CONFLICT (name) DO NOTHING;

-- Insert sample board games
INSERT INTO board_games (name, description, image_url, category_id, min_players, max_players, play_time) 
SELECT 
  'Catan',
  'เกมวางแผนสร้างอาณาจักรบนเกาะ แข่งกันสะสมทรัพยากรและสร้างถนน หมู่บ้าน',
  'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400',
  id,
  3, 4, '60-90 นาที'
FROM categories WHERE name = 'เกมวางแผน'
ON CONFLICT DO NOTHING;

INSERT INTO board_games (name, description, image_url, category_id, min_players, max_players, play_time) 
SELECT 
  'Werewolf',
  'เกมสวมบทบาทหาหมาป่าที่แฝงตัวในหมู่บ้าน สนุกและตื่นเต้น',
  'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400',
  id,
  6, 12, '30-45 นาที'
FROM categories WHERE name = 'เกมปาร์ตี้'
ON CONFLICT DO NOTHING;

INSERT INTO board_games (name, description, image_url, category_id, min_players, max_players, play_time) 
SELECT 
  'Ticket to Ride',
  'เกมสร้างเส้นทางรถไฟข้ามประเทศ เหมาะสำหรับทุกวัย',
  'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400',
  id,
  2, 5, '45-60 นาที'
FROM categories WHERE name = 'เกมครอบครัว'
ON CONFLICT DO NOTHING;

INSERT INTO board_games (name, description, image_url, category_id, min_players, max_players, play_time) 
SELECT 
  'UNO',
  'เกมการ์ดคลาสสิกที่ทุกคนรู้จัก เล่นง่าย สนุกทุกวัย',
  'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400',
  id,
  2, 10, '15-30 นาที'
FROM categories WHERE name = 'เกมการ์ด'
ON CONFLICT DO NOTHING;

INSERT INTO board_games (name, description, image_url, category_id, min_players, max_players, play_time) 
SELECT 
  'Chess',
  'เกมกระดานคลาสสิกที่ท้าทายสมอง ฝึกการคิดวิเคราะห์',
  'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400',
  id,
  2, 2, '30-60 นาที'
FROM categories WHERE name = 'เกมวางแผน'
ON CONFLICT DO NOTHING;

INSERT INTO board_games (name, description, image_url, category_id, min_players, max_players, play_time) 
SELECT 
  'Codenames',
  'เกมทายคำศัพท์แบบทีม สนุกและท้าทาย',
  'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400',
  id,
  4, 8, '15-30 นาที'
FROM categories WHERE name = 'เกมปาร์ตี้'
ON CONFLICT DO NOTHING;

-- Insert default store info
INSERT INTO store_info (store_name, slogan, phone, facebook, line_id, google_maps_url, address) VALUES
  ('Board Game Cafe', 'สนุกได้ทุกวัน กับเกมกระดานมากมาย', '02-123-4567', 'https://facebook.com/boardgamecafe', '@boardgamecafe', 'https://maps.google.com/?q=Bangkok', '123 ถนนสุขุมวิท กรุงเทพฯ 10110')
ON CONFLICT DO NOTHING;

-- Insert default admin (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO admins (email, password_hash, name) VALUES
  ('admin@boardgame.com', 'admin123', 'Admin')
ON CONFLICT (email) DO NOTHING;
