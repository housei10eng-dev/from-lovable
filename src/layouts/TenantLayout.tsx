import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { TenantSidebar } from '@/components/tenant/TenantSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function TenantLayout() {
  const { user, isTenant, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();

  // Show access denied toast when user without proper roles tries to access tenant routes
  useEffect(() => {
    if (!isLoading && user && !isTenant && !isAdmin) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar esta área.',
        variant: 'destructive',
      });
    }
  }, [isLoading, user, isTenant, isAdmin, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Require authentication
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control - users without tenant or admin roles are redirected
  if (!isTenant && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <TenantSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
