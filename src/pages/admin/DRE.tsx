import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, MinusCircle, PlusCircle } from 'lucide-react';

// Mock DRE data
const dreData = {
  periodo: 'Janeiro 2026',
  receitas: {
    receitaBruta: 152890.00,
    descontos: -3250.00,
    receitaLiquida: 149640.00,
  },
  custosServicos: {
    infraestrutura: -8500.00,
    suporte: -12300.00,
    total: -20800.00,
  },
  despesasOperacionais: {
    pessoal: -45000.00,
    marketing: -15000.00,
    administrativo: -8500.00,
    total: -68500.00,
  },
  resultados: {
    lucroBruto: 128840.00,
    lucroOperacional: 60340.00,
    impostos: -9051.00,
    lucroLiquido: 51289.00,
  },
};

interface DRERowProps {
  label: string;
  value: number;
  isTotal?: boolean;
  isHeader?: boolean;
  isSubtotal?: boolean;
}

function DRERow({ label, value, isTotal, isHeader, isSubtotal }: DRERowProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  if (isHeader) {
    return (
      <tr className="border-b border-border bg-muted/30">
        <td className="py-3 px-4 font-semibold">{label}</td>
        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(value)}</td>
      </tr>
    );
  }

  if (isTotal) {
    return (
      <tr className="border-b-2 border-border bg-muted/50">
        <td className="py-4 px-4 font-bold text-lg">{label}</td>
        <td className={`py-4 px-4 text-right font-bold text-lg ${value >= 0 ? 'text-success' : 'text-destructive'}`}>
          {formatCurrency(value)}
        </td>
      </tr>
    );
  }

  if (isSubtotal) {
    return (
      <tr className="border-b border-border bg-muted/20">
        <td className="py-2 px-4 font-medium pl-8">{label}</td>
        <td className={`py-2 px-4 text-right font-medium ${value >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
          {formatCurrency(value)}
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border/50 table-row-hover">
      <td className="py-2 px-4 pl-8 text-muted-foreground">{label}</td>
      <td className={`py-2 px-4 text-right ${value >= 0 ? '' : 'text-destructive/80'}`}>
        {formatCurrency(value)}
      </td>
    </tr>
  );
}

export default function DRE() {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const margemBruta = ((dreData.resultados.lucroBruto / dreData.receitas.receitaLiquida) * 100).toFixed(1);
  const margemLiquida = ((dreData.resultados.lucroLiquido / dreData.receitas.receitaLiquida) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DRE</h1>
          <p className="text-muted-foreground">
            Demonstração do Resultado do Exercício
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {dreData.periodo}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Líquida</p>
                <p className="text-xl font-bold">{formatCurrency(dreData.receitas.receitaLiquida)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <PlusCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lucro Bruto</p>
                <p className="text-xl font-bold text-success">{formatCurrency(dreData.resultados.lucroBruto)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <MinusCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Despesas Totais</p>
                <p className="text-xl font-bold text-warning">{formatCurrency(Math.abs(dreData.despesasOperacionais.total + dreData.custosServicos.total))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                <p className="text-xl font-bold text-success">{formatCurrency(dreData.resultados.lucroLiquido)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Margins */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Margem Bruta</p>
                <p className="text-3xl font-bold">{margemBruta}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Margem Líquida</p>
                <p className="text-3xl font-bold">{margemLiquida}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DRE Table */}
      <Card>
        <CardHeader>
          <CardTitle>Demonstrativo Completo</CardTitle>
          <CardDescription>Detalhamento de receitas, custos e despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="py-3 px-4 text-left font-semibold">Descrição</th>
                  <th className="py-3 px-4 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {/* Receitas */}
                <DRERow label="RECEITAS" value={dreData.receitas.receitaLiquida} isHeader />
                <DRERow label="Receita Bruta" value={dreData.receitas.receitaBruta} />
                <DRERow label="(-) Descontos e Devoluções" value={dreData.receitas.descontos} />
                <DRERow label="(=) Receita Líquida" value={dreData.receitas.receitaLiquida} isSubtotal />

                {/* Custos */}
                <DRERow label="CUSTOS DOS SERVIÇOS" value={dreData.custosServicos.total} isHeader />
                <DRERow label="Infraestrutura (Cloud/Servers)" value={dreData.custosServicos.infraestrutura} />
                <DRERow label="Suporte ao Cliente" value={dreData.custosServicos.suporte} />
                <DRERow label="(=) Total Custos" value={dreData.custosServicos.total} isSubtotal />

                {/* Lucro Bruto */}
                <DRERow label="(=) LUCRO BRUTO" value={dreData.resultados.lucroBruto} isTotal />

                {/* Despesas */}
                <DRERow label="DESPESAS OPERACIONAIS" value={dreData.despesasOperacionais.total} isHeader />
                <DRERow label="Pessoal e Encargos" value={dreData.despesasOperacionais.pessoal} />
                <DRERow label="Marketing e Vendas" value={dreData.despesasOperacionais.marketing} />
                <DRERow label="Administrativo" value={dreData.despesasOperacionais.administrativo} />
                <DRERow label="(=) Total Despesas" value={dreData.despesasOperacionais.total} isSubtotal />

                {/* Resultado */}
                <DRERow label="(=) LUCRO OPERACIONAL" value={dreData.resultados.lucroOperacional} isTotal />
                <DRERow label="(-) Impostos" value={dreData.resultados.impostos} />
                <DRERow label="(=) LUCRO LÍQUIDO" value={dreData.resultados.lucroLiquido} isTotal />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
