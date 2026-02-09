import { useEffect, useMemo, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Filter, Plus, Search } from 'lucide-react';

type CompanyRecord = {
  id: string;
  tenant_id: string;
  name: string;
  document: string | null;
  responsible: string;
  email: string;
  phone: string | null;
  plan: string;
  status: string;
  address_state: string | null;
  address_street: string | null;
  address_number: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_country: string | null;
  address_cep: string | null;
  createdAt: string;
};

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
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar empresas', error);
        toast({
          title: 'Erro ao carregar empresas',
          description: 'Não foi possível carregar a lista de empresas.',
          variant: 'destructive',
        });
        return;
      }

      const normalizedCompanies =
        data?.map((company: any) => ({
          id: company.id,
          tenant_id: company.tenant_id,
          name: company.name,
          document: company.document,
          responsible: company.responsible ?? '',
          email: company.email,
          phone: company.phone,
          plan: company.plan,
          status: company.status,
          address_state: company.address_state,
          address_street: company.address_street,
          address_number: company.address_number,
          address_neighborhood: company.address_neighborhood,
          address_city: company.address_city,
          address_country: company.address_country,
          address_cep: company.address_cep,
          createdAt: company.created_at,
        })) ?? [];

      setCompanies(normalizedCompanies);
    };

    fetchCompanies();
  }, [toast]);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(normalizedSearch) ||
        company.responsible.toLowerCase().includes(normalizedSearch) ||
        company.email.toLowerCase().includes(normalizedSearch) ||
        (company.document ?? '').includes(searchTerm) ||
        (company.phone ?? '').includes(searchTerm)
    );
  }, [companies, searchTerm]);

  const handlePasswordReset = async (email: string) => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast({
        title: 'Erro ao enviar redefinição',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Redefinição enviada',
      description: 'Enviamos um e-mail para redefinir a senha.',
    });
  };

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
                <TableHead>Redefinir senha</TableHead>
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
                    <Badge variant="secondary">
                      {planLabels[company.plan] ?? company.plan}
                    </Badge>
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
                  <TableCell>{company.address_state ?? '-'}</TableCell>
                  <TableCell>{company.address_street ?? '-'}</TableCell>
                  <TableCell>{company.address_number ?? '-'}</TableCell>
                  <TableCell>{company.address_neighborhood ?? '-'}</TableCell>
                  <TableCell>{company.address_city ?? '-'}</TableCell>
                  <TableCell>{company.address_country ?? '-'}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {company.address_cep ?? '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePasswordReset(company.email)}
                    >
                      Enviar link
                    </Button>
                  </TableCell>
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
