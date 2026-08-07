-- ════════════════════════════════════════════════════════════════════════════
-- PropertyBrands — Migration 020: Deepen the accent blue (data correction)
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- The site's accent blue was deepened from #1E88E5 to #1565C0 (with hover
-- states moving from #1565C0 to #0D47A1) across all component code. That
-- code change alone doesn't touch color values that were already seeded as
-- DATA by earlier migrations (partner tier colors, testimonial gradients,
-- subscription plan colors, investment-opportunity tag colors, hero content)
-- — this migration corrects those rows, and updates the column defaults so
-- anything inserted from now on picks up the new color too.
--
-- Safe to re-run — every UPDATE only touches rows that still hold the exact
-- old color, so it's a no-op the second time.
-- ════════════════════════════════════════════════════════════════════════════

-- ── investment_opportunities.tag_color ────────────────────────────────────────
alter table public.investment_opportunities alter column tag_color set default 'bg-blue-100 text-[#1565C0]';
update public.investment_opportunities set tag_color = replace(tag_color, '#1E88E5', '#1565C0') where tag_color like '%#1E88E5%';

-- ── partner_tiers ──────────────────────────────────────────────────────────
update public.partner_tiers set tier_color = replace(tier_color, '#1E88E5', '#1565C0') where tier_color like '%#1E88E5%';
update public.partner_tiers set border_color = replace(border_color, '#1E88E5', '#1565C0') where border_color like '%#1E88E5%';

-- ── client_reviews.avatar_gradient (contains BOTH old colors) ────────────────
update public.client_reviews
set avatar_gradient = 'from-[#1565C0] to-[#0D47A1]'
where avatar_gradient = 'from-[#1E88E5] to-[#1565C0]';

-- ── subscription_plans ─────────────────────────────────────────────────────
update public.subscription_plans set plan_color = replace(plan_color, '#1E88E5', '#1565C0') where plan_color like '%#1E88E5%';
update public.subscription_plans set border_color = replace(border_color, '#1E88E5', '#1565C0') where border_color like '%#1E88E5%';

-- ── hero_cards.background_color ─────────────────────────────────────────────
update public.hero_cards set background_color = replace(background_color, '#1E88E5', '#1565C0') where background_color like '%#1E88E5%';

-- ════════════════════════════════════════════════════════════════════════════
-- After running this, every stored color reference matches the new #1565C0 /
-- #0D47A1 accent used throughout the component code.
-- ════════════════════════════════════════════════════════════════════════════
