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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';

// Mock clients for tenant
const mockClients = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@empresa.com',
    phone: '(11) 99999-1111',
    document: '123.456.789-00',
    status: 'active',
    notes: 'Cliente VIP',
    createdAt: '2025-11-15',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@startup.io',
    phone: '(21) 98888-2222',
    document: '234.567.890-11',
    status: 'active',
    notes: '',
    createdAt: '2025-12-01',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@tech.com',
    phone: '(31) 97777-3333',
    document: '345.678.901-22',
    status: 'pending',
    notes: 'Aguardando documentos',
    createdAt: '2026-01-10',
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro@comercio.br',
    phone: '(41) 96666-4444',
    document: '456.789.012-33',
    status: 'active',
    notes: '',
    createdAt: '2026-02-01',
  },
  {
    id: '5',
    name: 'Carla Lima',
    email: 'carla@industria.com',
    phone: '(51) 95555-5555',
    document: '567.890.123-44',
    status: 'inactive',
    notes: 'Contrato encerrado',
    createdAt: '2025-08-20',
  },
];

export default function TenantClients() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes do CRM
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail, telefone ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} clientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="table-row-hover">
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      {client.notes && (
                        <p className="text-sm text-muted-foreground">{client.notes}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{client.document}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.status === 'active'
                          ? 'status-active'
                          : client.status === 'pending'
                          ? 'status-pending'
                          : 'status-inactive'
                      }
                    >
                      {client.status === 'active'
                        ? 'Ativo'
                        : client.status === 'pending'
                        ? 'Pendente'
                        : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
