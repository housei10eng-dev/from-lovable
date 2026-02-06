import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Download, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Mock payments
const mockPayments = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    amount: 2999.00,
    status: 'paid',
    dueDate: '2026-02-05',
    paidAt: '2026-02-03',
    description: 'Mensalidade Enterprise - Fev/2026',
  },
  {
    id: '2',
    companyName: 'Digital Marketing Pro',
    amount: 599.00,
    status: 'pending',
    dueDate: '2026-02-10',
    paidAt: null,
    description: 'Mensalidade Professional - Fev/2026',
  },
  {
    id: '3',
    companyName: 'StartupXYZ',
    amount: 199.00,
    status: 'overdue',
    dueDate: '2026-01-25',
    paidAt: null,
    description: 'Mensalidade Starter - Jan/2026',
  },
  {
    id: '4',
    companyName: 'E-commerce Brasil',
    amount: 599.00,
    status: 'paid',
    dueDate: '2026-02-01',
    paidAt: '2026-01-30',
    description: 'Mensalidade Professional - Fev/2026',
  },
  {
    id: '5',
    companyName: 'ConsultFirm',
    amount: 2999.00,
    status: 'failed',
    dueDate: '2026-01-15',
    paidAt: null,
    description: 'Mensalidade Enterprise - Jan/2026',
  },
];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  paid: { label: 'Pago', icon: CheckCircle, className: 'status-active' },
  pending: { label: 'Pendente', icon: Clock, className: 'status-pending' },
  overdue: { label: 'Atrasado', icon: AlertCircle, className: 'status-inactive' },
  failed: { label: 'Falhou', icon: AlertCircle, className: 'status-inactive' },
};

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = mockPayments.filter(
    (payment) =>
      payment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate summary
  const summary = {
    total: mockPayments.reduce((acc, p) => acc + p.amount, 0),
    paid: mockPayments.filter((p) => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0),
    pending: mockPayments.filter((p) => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0),
    overdue: mockPayments.filter((p) => p.status === 'overdue' || p.status === 'failed').reduce((acc, p) => acc + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os pagamentos dos clientes
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{formatCurrency(summary.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recebido</p>
                <p className="text-xl font-bold text-success">{formatCurrency(summary.paid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendente</p>
                <p className="text-xl font-bold text-warning">{formatCurrency(summary.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atrasado</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(summary.overdue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por empresa ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            {filteredPayments.length} pagamentos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const config = statusConfig[payment.status];
                const StatusIcon = config.icon;
                return (
                  <TableRow key={payment.id} className="table-row-hover">
                    <TableCell className="font-medium">{payment.companyName}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.description}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={config.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
