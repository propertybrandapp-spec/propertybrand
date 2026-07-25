-- ── Migration 008: Seed Site Content With Existing Demo Data ─────────────────
-- Fills the four Migration 007 tables with the same content that was previously
-- hardcoded in the React source, so the admin console's "Site Content" tabs show
-- real, editable rows immediately instead of appearing empty. Each block only
-- runs if that table is currently empty, so it's safe to re-run and won't ever
-- duplicate rows or overwrite anything you've already added or edited.

-- ── Partner Tiers ─────────────────────────────────────────────────────────────
insert into public.partner_tiers (name, tier_color, border_color, deals_range, commission, perks, cta_label, is_popular, display_order)
select * from (values
  ('Associate', '#6B7280', '#E2E8F0', '0–5 deals/yr', '1.5%', '["Basic Lead Access", "Marketing Templates", "Online Training", "PB Listing Portal"]'::jsonb, 'Get Started', false, 0),
  ('Silver', '#1E88E5', '#1E88E5', '6–15 deals/yr', '2%', '["Priority Lead Sharing", "Co-branded Campaigns", "Monthly Workshops", "Dedicated RM", "PB Preferred Badge"]'::jsonb, 'Apply Now', true, 1),
  ('Gold', '#F59E0B', '#F59E0B', '16+ deals/yr', '2.5–3%', '["Exclusive Inventory Access", "Personal Marketing Budget", "Priority Support", "Annual Retreat", "Performance Bonuses", "Gold Badge"]'::jsonb, 'Apply Now', false, 2)
) as v(name, tier_color, border_color, deals_range, commission, perks, cta_label, is_popular, display_order)
where not exists (select 1 from public.partner_tiers limit 1);

-- ── Client Reviews ────────────────────────────────────────────────────────────
insert into public.client_reviews (name, role, location, avatar_initials, avatar_gradient, rating, category, review_text, property_label, review_date, is_verified, display_order)
select * from (values
  ('Rakesh Gupta', 'Home Buyer', 'Bhubaneswar', 'RG', 'from-blue-500 to-blue-700', 5, 'Home Buyers', 'PropertyBrands made my dream of owning a home in Bhubaneswar a reality. Their team guided me through every step — from shortlisting to loan approval and registration. The relationship manager was always available and incredibly patient. Couldn''t have done it without them!', '3 BHK Flat, Patia', '2025-03-01'::date, true, 0),
  ('Neha Singhania', 'NRI Investor', 'Dubai → Bhubaneswar', 'NS', 'from-[#1E88E5] to-[#1565C0]', 5, 'NRIs', 'As an NRI, I was skeptical about investing in Indian real estate remotely. PropertyBrands'' NRI desk handled everything — property visits, legal checks, loan paperwork, and registration — while I stayed in Dubai. The transparency and communication were exceptional.', 'Commercial Space, Main Road', '2025-04-01'::date, true, 1),
  ('Suresh Mahato', 'First-Time Buyer', 'Jamshedpur', 'SM', 'from-emerald-500 to-emerald-700', 5, 'Home Buyers', 'I had no idea how to begin buying a home. The team at PropertyBrands sat with me for hours, explained RERA, home loans, and legal processes. They found me the perfect 2 BHK within my budget. The free site visit cab was a wonderful touch!', '2 BHK Apartment, Old Town', '2025-02-01'::date, true, 2),
  ('Anita Poddar', 'Interior Design Client', 'Bhubaneswar', 'AP', 'from-violet-500 to-violet-700', 5, 'Home Buyers', 'After buying my apartment through PropertyBrands, I also used their interior design service. The 3D visualization was spot on and the execution was flawless. Everything was delivered on time and within the Premium Package budget. Absolutely love my new home!', 'Interior Design, Ashok Nagar', '2025-05-01'::date, true, 3),
  ('Vikram Agarwal', 'Real Estate Investor', 'Kolkata → Bhubaneswar', 'VA', 'from-amber-500 to-amber-700', 5, 'Investors', 'I''ve invested in 4 properties through PropertyBrands over the past 2 years. Their investment advisory team identified micro-markets that have given me over 22% appreciation. The ROI calculator and corridor analysis reports are genuinely useful tools.', '4 Residential Plots, Rasulgarh', '2025-01-01'::date, true, 4),
  ('Manish Tiwari', 'Developer Partner', 'Bhubaneswar', 'MT', 'from-slate-500 to-slate-700', 5, 'Developers', 'We partnered with PropertyBrands for the marketing and sales management of our Nayapalli project. Their channel partner network and digital marketing team sold 68% of units within 3 months of launch. Professional, results-driven, and highly recommended.', 'Project: Emerald Heights', '2025-03-01'::date, true, 5),
  ('Priya Das', 'Corporate Client', 'Bhubaneswar', 'PD', 'from-teal-500 to-teal-700', 5, 'Corporate Clients', 'Our company needed 5 office spaces across Bhubaneswar for our expansion. PropertyBrands'' commercial team presented tailored options within our budget and timelines. They also handled lease agreements and tenant verification seamlessly.', 'Office Spaces, Bhubaneswar CBD', '2025-04-01'::date, true, 6),
  ('Arvind Sharma', 'Property Seller', 'Bhubaneswar', 'AS', 'from-indigo-500 to-indigo-700', 4, 'Investors', 'Sold my old apartment through PropertyBrands in just 3 weeks at a great price. Their property valuation was accurate and the buyer pool they had access to was impressive. The documentation support saved me a lot of time.', '2 BHK, Saheed Nagar', '2025-05-01'::date, true, 7)
) as v(name, role, location, avatar_initials, avatar_gradient, rating, category, review_text, property_label, review_date, is_verified, display_order)
where not exists (select 1 from public.client_reviews limit 1);

-- ── Subscription Plans ────────────────────────────────────────────────────────
insert into public.subscription_plans (name, price_label, billing_period, ideal_for, plan_color, border_color, features, is_popular, display_order)
select * from (values
  ('Basic', '₹2,999', '/month', 'Self-managed owners', '#6B7280', '#E2E8F0', '[{"text": "Tenant Sourcing", "included": true}, {"text": "Rent Collection", "included": true}, {"text": "Digital Receipts", "included": true}, {"text": "Quarterly Inspection", "included": true}, {"text": "Maintenance Support", "included": false}, {"text": "Legal Documentation", "included": false}, {"text": "Dedicated RM", "included": false}, {"text": "Resale Assistance", "included": false}]'::jsonb, false, 0),
  ('Standard', '₹5,499', '/month', 'NRIs & busy professionals', '#1E88E5', '#1E88E5', '[{"text": "Tenant Sourcing", "included": true}, {"text": "Rent Collection", "included": true}, {"text": "Digital Receipts", "included": true}, {"text": "Monthly Inspection", "included": true}, {"text": "Maintenance Support", "included": true}, {"text": "Legal Documentation", "included": true}, {"text": "Dedicated RM", "included": false}, {"text": "Resale Assistance", "included": false}]'::jsonb, true, 1),
  ('Premium', '₹9,999', '/month', 'Multi-property investors', '#F59E0B', '#F59E0B', '[{"text": "Tenant Sourcing", "included": true}, {"text": "Rent Collection", "included": true}, {"text": "Digital Receipts", "included": true}, {"text": "Weekly Inspection", "included": true}, {"text": "Priority Maintenance", "included": true}, {"text": "Full Legal Support", "included": true}, {"text": "Dedicated RM", "included": true}, {"text": "Resale Assistance", "included": true}]'::jsonb, false, 2)
) as v(name, price_label, billing_period, ideal_for, plan_color, border_color, features, is_popular, display_order)
where not exists (select 1 from public.subscription_plans limit 1);

-- ── Investment Opportunities ──────────────────────────────────────────────────
insert into public.investment_opportunities (city, area, tag, tag_color, appreciation, rental_yield, price_range, property_type, image_url, display_order)
select * from (values
  ('Bhubaneswar', 'Nayapalli', 'High Growth', 'bg-green-100 text-[#4ade80]', '+18%', '4.2%', '₹45 – 80 Lac', 'Residential', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=240&fit=crop', 0),
  ('Bhubaneswar', 'Patia', 'Rental Hotspot', 'bg-blue-100 text-[#1E88E5]', '+12%', '5.8%', '₹30 – 60 Lac', 'Apartments', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop', 1),
  ('Bhubaneswar', 'Main Road', 'Commercial', 'bg-purple-100 text-purple-700', '+22%', '6.5%', '₹1.2 – 3 Cr', 'Commercial', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=240&fit=crop', 2),
  ('Bhubaneswar', 'Rasulgarh', 'Land Banking', 'bg-amber-100 text-amber-700', '+30%', '—', '₹20 – 50 Lac', 'Plots', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=240&fit=crop', 3)
) as v(city, area, tag, tag_color, appreciation, rental_yield, price_range, property_type, image_url, display_order)
where not exists (select 1 from public.investment_opportunities limit 1);

