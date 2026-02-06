-- Fix permissive INSERT policy on audit_logs
-- Replace with proper authentication check
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.audit_logs;

CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);