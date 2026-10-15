-- Additive, preserves all existing orders.
alter table public.template_orders
  add column if not exists receipt_sent_at timestamptz;
