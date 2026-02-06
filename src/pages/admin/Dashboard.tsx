import { KPICard } from '@/components/admin/KPICard';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  AlertTriangle,
  Building2,
  Users,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for demonstration
const mockData = {
  receitaTotal: 'R$ 847.250,00',
  receitaMes: 'R$ 127.890,00',
  receitaAberto: 'R$ 23.450,00',
  ticketMedio: 'R$ 1.890,00',
  churn: '2.4%',
  crescimento: '+12.5%',
  empresasAtivas: 342,
  empresasInativas: 28,
  totalEmpresas: 370,
  colaboradores: 1847,
  logsAuditoria: 12453,
};

const recentCompanies = [
  { name: 'TechCorp Solutions', plan: 'Enterprise', status: 'active', date: '2026-02-05' },
  { name: 'Digital Marketing Pro', plan: 'Professional', status: 'active', date: '2026-02-04' },
  { name: 'StartupXYZ', plan: 'Starter', status: 'pending', date: '2026-02-03' },
  { name: 'E-commerce Brasil', plan: 'Professional', status: 'active', date: '2026-02-02' },
  { name: 'ConsultFirm', plan: 'Enterprise', status: 'inactive', date: '2026-02-01' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas e performance da plataforma
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="mr-1.5 h-3 w-3" />
          Atualizado agora
        </Badge>
      </div>

      {/* KPI Grid - Revenue */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita Total"
          value={mockData.receitaTotal}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 15.3, label: 'vs mês anterior' }}
          variant="success"
        />
        <KPICard
          title="Receita do Mês"
          value={mockData.receitaMes}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 8.2, label: 'vs mês anterior' }}
        />
        <KPICard
          title="Receita em Aberto"
          value={mockData.receitaAberto}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <KPICard
          title="Ticket Médio"
          value={mockData.ticketMedio}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: 4.1, label: 'vs mês anterior' }}
        />
      </div>

      {/* KPI Grid - Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Taxa de Churn"
          value={mockData.churn}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: -0.5, label: 'vs mês anterior' }}
          variant="danger"
        />
        <KPICard
          title="Crescimento M/M"
          value={mockData.crescimento}
          icon={<ArrowUpRight className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Total de Empresas"
          value={mockData.totalEmpresas}
          icon={<Building2 className="h-5 w-5" />}
          trend={{ value: 3.2, label: 'este mês' }}
        />
        <KPICard
          title="Total Colaboradores"
          value={mockData.colaboradores.toLocaleString('pt-BR')}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5.8, label: 'este mês' }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empresas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-success">{mockData.empresasAtivas}</span>
              <span className="text-sm text-muted-foreground">
                ({((mockData.empresasAtivas / mockData.totalEmpresas) * 100).toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empresas Inativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-destructive">{mockData.empresasInativas}</span>
              <span className="text-sm text-muted-foreground">
                ({((mockData.empresasInativas / mockData.totalEmpresas) * 100).toFixed(1)}%)
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Logs de Auditoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.logsAuditoria.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Recentes</CardTitle>
          <CardDescription>Últimas empresas que adquiriram a ferramenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Empresa</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Plano</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentCompanies.map((company, index) => (
                  <tr key={index} className="table-row-hover border-b border-border/50">
                    <td className="py-3 font-medium">{company.name}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{company.plan}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        className={
                          company.status === 'active'
                            ? 'status-active'
                            : company.status === 'pending'
                            ? 'status-pending'
                            : 'status-inactive'
                        }
                        variant="outline"
                      >
                        {company.status === 'active'
                          ? 'Ativo'
                          : company.status === 'pending'
                          ? 'Pendente'
                          : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(company.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
