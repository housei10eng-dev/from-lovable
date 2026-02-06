import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/crm' },
  { icon: Users, label: 'Clientes', href: '/crm/clients' },
  { icon: Building2, label: 'Empresas', href: '/crm/companies' },
  { icon: ClipboardList, label: 'Tarefas', href: '/crm/tasks' },
  { icon: MessageSquare, label: 'Mensagens', href: '/crm/messages' },
  { icon: Settings, label: 'Configurações', href: '/crm/settings' },
];

export function TenantSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao sair',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-sm font-bold text-accent-foreground">CRM</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">Meu CRM</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && profile && (
        <div className="border-b border-sidebar-border p-4">
          <p className="font-medium text-sidebar-foreground truncate">{profile.full_name || 'Usuário'}</p>
          <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/crm'}
            className={({ isActive }) =>
              cn(
                'nav-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={handleLogout}
          className={cn(
            'nav-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
