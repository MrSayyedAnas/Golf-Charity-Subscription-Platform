-- Seed Data for Golf Charity Subscription Platform

-- Subscription Plans
INSERT INTO public.subscription_plans (name, slug, description, price_cents, billing_period, draw_entries, features) VALUES
(
  'Birdie',
  'birdie',
  'Perfect for casual golfers who want to make a difference',
  999,
  'monthly',
  1,
  '["1 monthly draw entry", "Score tracking", "Basic leaderboard access", "Support 1 charity"]'::jsonb
),
(
  'Eagle',
  'eagle',
  'For dedicated golfers committed to charitable impact',
  1999,
  'monthly',
  3,
  '["3 monthly draw entries", "Advanced score analytics", "Full leaderboard access", "Support up to 3 charities", "Priority support"]'::jsonb
),
(
  'Albatross',
  'albatross',
  'Maximum impact for the most passionate golfers',
  4999,
  'monthly',
  10,
  '["10 monthly draw entries", "Premium analytics suite", "VIP leaderboard status", "Unlimited charity support", "Exclusive events access", "Dedicated support"]'::jsonb
);

-- Charities
INSERT INTO public.charities (name, description, logo_url, website_url, impact_statement, is_featured) VALUES
(
  'First Tee',
  'Building game changers by introducing golf and its inherent values to young people.',
  '/charities/first-tee.png',
  'https://firsttee.org',
  'Every $10 helps introduce one child to the game of golf and life skills.',
  true
),
(
  'Golf for Africa',
  'Using the power of golf to transform lives across Africa through education and healthcare.',
  '/charities/golf-africa.png',
  'https://golfforafrica.org',
  'Your contribution helps provide clean water and education to communities in need.',
  true
),
(
  'Wounded Warrior Golf',
  'Supporting veterans through therapeutic golf programs and adaptive equipment.',
  '/charities/wounded-warrior.png',
  'https://woundedwarriorgolf.org',
  'Help a veteran experience the healing power of golf on their recovery journey.',
  true
),
(
  'PGA HOPE',
  'Introducing golf to veterans to enhance their physical, mental, social and emotional well-being.',
  '/charities/pga-hope.png',
  'https://pgahope.org',
  'Each donation supports a veteran through our 6-week golf program.',
  false
),
(
  'Youth on Course',
  'Making golf accessible and affordable for young people everywhere.',
  '/charities/youth-course.png',
  'https://youthoncourse.org',
  'Just $5 sponsors a round of golf for a young player.',
  false
);

-- Rewards/Achievements
INSERT INTO public.rewards (name, description, icon, reward_type, criteria, bonus_entries) VALUES
(
  'First Round',
  'Submit your first golf score',
  'trophy',
  'badge',
  '{"scores_count": 1}'::jsonb,
  1
),
(
  'Consistency King',
  'Submit 10 rounds in a month',
  'crown',
  'bonus_entry',
  '{"monthly_rounds": 10}'::jsonb,
  5
),
(
  'Improvement Master',
  'Improve your handicap by 2 strokes',
  'trending-up',
  'bonus_entry',
  '{"handicap_improvement": 2}'::jsonb,
  3
),
(
  'Charity Champion',
  'Support 3 or more charities',
  'heart',
  'badge',
  '{"charities_supported": 3}'::jsonb,
  2
),
(
  'Eagle Eye',
  'Score an eagle or better',
  'star',
  'badge',
  '{"eagle_scored": true}'::jsonb,
  2
),
(
  'Community Builder',
  'Refer 5 friends who subscribe',
  'users',
  'bonus_entry',
  '{"referrals": 5}'::jsonb,
  10
);

-- Sample Draws
INSERT INTO public.draws (title, description, draw_date, prize_description, prize_value_cents, status) VALUES
(
  'April Grand Draw',
  'Win an exclusive golf package including a round at Pebble Beach!',
  '2026-04-30 18:00:00+00',
  'Pebble Beach Golf Experience - includes green fees, cart, and stay at The Lodge',
  250000,
  'active'
),
(
  'May Equipment Draw',
  'Win a complete set of TaylorMade clubs!',
  '2026-05-31 18:00:00+00',
  'TaylorMade Qi10 Complete Set - Driver, Woods, Irons, Wedges, Putter, and Bag',
  350000,
  'upcoming'
),
(
  'Summer Golf Getaway',
  'Win a golf vacation for two!',
  '2026-06-30 18:00:00+00',
  'All-inclusive golf trip to Scottsdale including 3 nights and 4 rounds at top courses',
  500000,
  'upcoming'
);
