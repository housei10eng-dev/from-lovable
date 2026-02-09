
-- Add missing columns to companies table used by signup form
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS responsible text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_street text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_number text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_neighborhood text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_city text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_state text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_country text DEFAULT 'BR';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address_cep text;

-- Fix RLS on clients table: convert to PERMISSIVE policies for authenticated users
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Tenant users can manage own clients" ON public.clients;
DROP POLICY IF EXISTS "Tenant users can view own clients" ON public.clients;

-- Create permissive policies (default type)
CREATE POLICY "Tenant users can view own clients"
ON public.clients FOR SELECT TO authenticated
USING (tenant_id = get_user_tenant_id() OR is_platform_admin());

CREATE POLICY "Tenant users can insert own clients"
ON public.clients FOR INSERT TO authenticated
WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant users can update own clients"
ON public.clients FOR UPDATE TO authenticated
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant users can delete own clients"
ON public.clients FOR DELETE TO authenticated
USING (tenant_id = get_user_tenant_id());

-- Fix RLS on companies table: convert to PERMISSIVE policies for authenticated users
DROP POLICY IF EXISTS "Platform admins can manage companies" ON public.companies;
DROP POLICY IF EXISTS "Platform admins can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Tenant users can view own company" ON public.companies;

CREATE POLICY "Platform admins can manage companies"
ON public.companies FOR ALL TO authenticated
USING (is_platform_admin());

CREATE POLICY "Tenant users can view own company"
ON public.companies FOR SELECT TO authenticated
USING (tenant_id = get_user_tenant_id());

-- Allow new signups to insert their company (user just created, no tenant yet)
CREATE POLICY "Authenticated users can insert companies"
ON public.companies FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());
