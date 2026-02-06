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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Filter, Eye, FileText, Edit, Trash2, Plus, UserCircle } from 'lucide-react';

// Mock audit logs
const mockAuditLogs = [
  {
    id: '1',
    action: 'UPDATE',
    entityType: 'company',
    entityId: 'comp-123',
    userEmail: 'admin@crmpro.com',
    oldValues: { status: 'pending' },
    newValues: { status: 'active' },
    createdAt: '2026-02-06T10:30:00Z',
  },
  {
    id: '2',
    action: 'CREATE',
    entityType: 'company',
    entityId: 'comp-124',
    userEmail: 'admin@crmpro.com',
    oldValues: null,
    newValues: { name: 'New Company', plan: 'starter' },
    createdAt: '2026-02-05T15:45:00Z',
  },
  {
    id: '3',
    action: 'UPDATE',
    entityType: 'payment',
    entityId: 'pay-456',
    userEmail: 'finance@crmpro.com',
    oldValues: { status: 'pending' },
    newValues: { status: 'paid' },
    createdAt: '2026-02-05T11:20:00Z',
  },
  {
    id: '4',
    action: 'DELETE',
    entityType: 'employee',
    entityId: 'emp-789',
    userEmail: 'hr@crmpro.com',
    oldValues: { name: 'John Doe', status: 'active' },
    newValues: null,
    createdAt: '2026-02-04T09:00:00Z',
  },
  {
    id: '5',
    action: 'UPDATE',
    entityType: 'company',
    entityId: 'comp-100',
    userEmail: 'admin@crmpro.com',
    oldValues: { plan: 'starter', monthlyValue: 99 },
    newValues: { plan: 'professional', monthlyValue: 299 },
    createdAt: '2026-02-03T14:30:00Z',
  },
];

const actionIcons: Record<string, typeof Edit> = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
};

const actionColors: Record<string, string> = {
  CREATE: 'status-active',
  UPDATE: 'status-pending',
  DELETE: 'status-inactive',
};

export default function Audit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<typeof mockAuditLogs[0] | null>(null);

  const filteredLogs = mockAuditLogs.filter(
    (log) =>
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
        <p className="text-muted-foreground">
          Registro de todas as alterações feitas no sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Logs</p>
                <p className="text-2xl font-bold">12.453</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Plus className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criações</p>
                <p className="text-2xl font-bold">3.421</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Edit className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atualizações</p>
                <p className="text-2xl font-bold">8.234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exclusões</p>
                <p className="text-2xl font-bold">798</p>
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
                placeholder="Buscar por usuário, entidade ou ação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Auditoria</CardTitle>
          <CardDescription>Histórico imutável de alterações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Ator</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const ActionIcon = actionIcons[log.action] || Edit;
                return (
                  <TableRow key={log.id} className="table-row-hover">
                    <TableCell className="text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium capitalize">{log.entityType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={actionColors[log.action]}>
                        <ActionIcon className="mr-1 h-3 w-3" />
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.newValues
                        ? Object.keys(log.newValues).join(', ')
                        : Object.keys(log.oldValues || {}).join(', ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{log.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Log</DialogTitle>
                            <DialogDescription>
                              Visualização completa das alterações
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Ação</p>
                                <Badge variant="outline" className={actionColors[log.action]}>
                                  {log.action}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Entidade</p>
                                <p className="capitalize">{log.entityType}</p>
                              </div>
                            </div>
                            {log.oldValues && (
                              <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">
                                  Valores Anteriores
                                </p>
                                <pre className="rounded-lg bg-muted p-3 text-sm">
                                  {JSON.stringify(log.oldValues, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.newValues && (
                              <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">
                                  Novos Valores
                                </p>
                                <pre className="rounded-lg bg-muted p-3 text-sm">
                                  {JSON.stringify(log.newValues, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
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
