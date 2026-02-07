-- Fix overly permissive INSERT policy on audit_logs
-- Drop the existing INSERT policy that allows any authenticated user
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

-- Create a more restrictive INSERT policy that only allows:
-- 1. Platform admins (for manual audit entries)
-- 2. Users inserting logs related to their own tenant
CREATE POLICY "Platform admins and tenant members can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (
  is_platform_admin() OR 
  (auth.uid() IS NOT NULL AND tenant_id = get_user_tenant_id())
);