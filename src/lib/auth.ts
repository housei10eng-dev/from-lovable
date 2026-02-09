import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'platform_admin' | 'employee' | 'tenant_admin' | 'tenant_user';
export type AppScope = 'admin' | 'tenant';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  tenant_id: string | null;
  scope: AppScope;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        full_name: fullName,
      },
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data || [];
}

export function hasAdminAccess(roles: UserRole[]): boolean {
  return roles.some(r => r.role === 'platform_admin' || r.role === 'employee');
}

export function hasTenantAccess(roles: UserRole[]): boolean {
  return roles.some(r => r.role === 'tenant_admin' || r.role === 'tenant_user');
}
