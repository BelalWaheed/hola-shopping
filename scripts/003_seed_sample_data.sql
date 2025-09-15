-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', '/placeholder.svg?height=200&width=300'),
('Fashion', 'fashion', 'Trendy clothing and accessories', '/placeholder.svg?height=200&width=300'),
('Home & Garden', 'home-garden', 'Everything for your home and garden', '/placeholder.svg?height=200&width=300'),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', '/placeholder.svg?height=200&width=300'),
('Books & Media', 'books-media', 'Books, movies, and digital media', '/placeholder.svg?height=200&width=300')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, compare_at_price, sku, quantity, category_id, status, featured, tags, images) VALUES
(
  'Wireless Bluetooth Headphones',
  'wireless-bluetooth-headphones',
  'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
  199.99,
  249.99,
  'WBH-001',
  50,
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  'active',
  true,
  ARRAY['wireless', 'bluetooth', 'headphones', 'audio'],
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400']
),
(
  'Smart Fitness Watch',
  'smart-fitness-watch',
  'Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration.',
  299.99,
  399.99,
  'SFW-002',
  30,
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  'active',
  true,
  ARRAY['smartwatch', 'fitness', 'health', 'wearable'],
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400']
),
(
  'Organic Cotton T-Shirt',
  'organic-cotton-tshirt',
  'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
  29.99,
  39.99,
  'OCT-003',
  100,
  (SELECT id FROM public.categories WHERE slug = 'fashion'),
  'active',
  false,
  ARRAY['organic', 'cotton', 'sustainable', 'casual'],
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400']
),
(
  'Ergonomic Office Chair',
  'ergonomic-office-chair',
  'Professional ergonomic office chair with lumbar support and adjustable height.',
  449.99,
  599.99,
  'EOC-004',
  20,
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  'active',
  true,
  ARRAY['office', 'chair', 'ergonomic', 'furniture'],
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400']
),
(
  'Yoga Mat Premium',
  'yoga-mat-premium',
  'Non-slip premium yoga mat made from eco-friendly materials.',
  79.99,
  99.99,
  'YMP-005',
  75,
  (SELECT id FROM public.categories WHERE slug = 'sports-outdoors'),
  'active',
  false,
  ARRAY['yoga', 'fitness', 'mat', 'eco-friendly'],
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400']
),
(
  'Programming Fundamentals Book',
  'programming-fundamentals-book',
  'Comprehensive guide to programming fundamentals for beginners and intermediate developers.',
  49.99,
  59.99,
  'PFB-006',
  40,
  (SELECT id FROM public.categories WHERE slug = 'books-media'),
  'active',
  false,
  ARRAY['programming', 'book', 'education', 'development'],
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400']
)
ON CONFLICT (slug) DO NOTHING;
