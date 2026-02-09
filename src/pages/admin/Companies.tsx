import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Plus } from 'lucide-react';

// Mock data
const mockCompanies: Array<{
  id: string;
  name: string;
  document: string;
  responsible: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  address: {
    state: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    country: string;
    cep: string;
  };
  createdAt: string;
}> = [];

const planLabels: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
  cancelled: 'Cancelado',
  trial: 'Trial',
};

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState(mockCompanies);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedCompanies = localStorage.getItem('adminCompanies');
      const parsedCompanies = storedCompanies ? JSON.parse(storedCompanies) : [];
      if (Array.isArray(parsedCompanies) && parsedCompanies.length > 0) {
        const normalizedCompanies = parsedCompanies.map((company) => ({
          ...company,
          responsible: company.responsible ?? '',
          address: {
            state: company.address?.state ?? '',
            street: company.address?.street ?? '',
            number: company.address?.number ?? '',
            neighborhood: company.address?.neighborhood ?? '',
            city: company.address?.city ?? '',
            country: company.address?.country ?? '',
            cep: company.address?.cep ?? '',
          },
        }));
        setCompanies([...normalizedCompanies, ...mockCompanies]);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas locais', error);
    }
  }, []);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.document.includes(searchTerm) ||
      company.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas que adquiriram a ferramenta
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail ou CPF/CNPJ..."
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
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>
            Total de {filteredCompanies.length} empresas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Nome do responsável</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Rua</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>País</TableHead>
                <TableHead>CEP</TableHead>
                <TableHead>Data de criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id} className="table-row-hover">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="font-mono text-sm">{company.document}</TableCell>
                  <TableCell>{company.responsible}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{planLabels[company.plan]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        company.status === 'active'
                          ? 'status-active'
                          : company.status === 'pending'
                          ? 'status-pending'
                          : 'status-inactive'
                      }
                    >
                      {statusLabels[company.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.address.state}</TableCell>
                  <TableCell>{company.address.street}</TableCell>
                  <TableCell>{company.address.number}</TableCell>
                  <TableCell>{company.address.neighborhood}</TableCell>
                  <TableCell>{company.address.city}</TableCell>
                  <TableCell>{company.address.country}</TableCell>
                  <TableCell className="font-mono text-sm">{company.address.cep}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(company.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
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
