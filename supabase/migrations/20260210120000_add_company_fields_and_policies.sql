-- Extend subscription plans to match marketing plans
ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'pro';
ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'business';

-- Add missing company fields for registration data
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS responsible TEXT,
  ADD COLUMN IF NOT EXISTS address_state TEXT,
  ADD COLUMN IF NOT EXISTS address_street TEXT,
  ADD COLUMN IF NOT EXISTS address_number TEXT,
  ADD COLUMN IF NOT EXISTS address_neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_country TEXT,
  ADD COLUMN IF NOT EXISTS address_cep TEXT;

-- Allow authenticated users to create their own company
CREATE POLICY "Users can create own company"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Allow authenticated users to assign their own tenant role
CREATE POLICY "Users can assign tenant role"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role IN ('tenant_admin', 'tenant_user')
  );
