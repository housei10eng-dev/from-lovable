import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/admin/KPICard';
import { Users, Building2, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';

// Mock data for tenant dashboard
const mockStats = {
  totalClients: 156,
  activeClients: 142,
  totalCompanies: 48,
  pendingTasks: 12,
};

const recentClients = [
  { name: 'Maria Silva', email: 'maria@empresa.com', status: 'active', date: '2026-02-05' },
  { name: 'João Santos', email: 'joao@startup.io', status: 'active', date: '2026-02-04' },
  { name: 'Ana Costa', email: 'ana@tech.com', status: 'pending', date: '2026-02-03' },
  { name: 'Pedro Oliveira', email: 'pedro@comercio.br', status: 'active', date: '2026-02-02' },
];

const pendingTasks = [
  { title: 'Ligar para Maria Silva', dueDate: '2026-02-06', priority: 'high' },
  { title: 'Enviar proposta TechCorp', dueDate: '2026-02-07', priority: 'medium' },
  { title: 'Reunião de follow-up', dueDate: '2026-02-08', priority: 'low' },
];

export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu CRM
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Clientes"
          value={mockStats.totalClients}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8.2, label: 'este mês' }}
        />
        <KPICard
          title="Clientes Ativos"
          value={mockStats.activeClients}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Empresas"
          value={mockStats.totalCompanies}
          icon={<Building2 className="h-5 w-5" />}
        />
        <KPICard
          title="Tarefas Pendentes"
          value={mockStats.pendingTasks}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Últimos clientes adicionados</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={client.status === 'active' ? 'status-active' : 'status-pending'}
                  >
                    {client.status === 'active' ? 'Ativo' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tarefas Pendentes</CardTitle>
              <CardDescription>Próximas atividades</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      task.priority === 'high'
                        ? 'status-inactive'
                        : task.priority === 'medium'
                        ? 'status-pending'
                        : 'status-active'
                    }
                  >
                    {task.priority === 'high'
                      ? 'Alta'
                      : task.priority === 'medium'
                      ? 'Média'
                      : 'Baixa'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
