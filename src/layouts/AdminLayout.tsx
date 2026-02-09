import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();

  // Show access denied toast when non-admin tries to access admin routes
  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar esta área.',
        variant: 'destructive',
      });
    }
  }, [isLoading, user, isAdmin, toast]);

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

  // Strict role-based access control - non-admin users are redirected
  if (!isAdmin) {
    return <Navigate to="/crm" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
