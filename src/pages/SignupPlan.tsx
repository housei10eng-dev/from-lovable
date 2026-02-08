import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const billingOptions = [
  {
    value: 'monthly',
    title: 'Mensal',
    description: 'Cobrança mês a mês',
  },
  {
    value: 'annual',
    title: 'Anual',
    description: 'Economize com pagamento anual',
  },
];

const planOptions = [
  {
    value: 'pro',
    title: 'Pro',
    description: 'Para times em crescimento',
  },
  {
    value: 'business',
    title: 'Business',
    description: 'Operação completa com relatórios',
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    description: 'Grandes contas e suporte dedicado',
  },
];

export default function SignupPlan() {
  const [billing, setBilling] = useState('monthly');
  const [plan, setPlan] = useState('pro');
  const navigate = useNavigate();

  const handleContinue = () => {
    const params = new URLSearchParams({
      billing,
      plan,
    });
    navigate(`/signup/register?${params.toString()}`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <Card className="w-full max-w-2xl glass-card animate-fade-in">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Escolha seu plano</CardTitle>
          <CardDescription className="text-muted-foreground">
            Selecione o tipo de cobrança e o plano ideal para sua operação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Tipo de cobrança</p>
            <div className="grid gap-3 md:grid-cols-2">
              {billingOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={billing === option.value ? 'default' : 'outline'}
                  className="h-auto flex-col items-start gap-1 px-4 py-3 text-left"
                  onClick={() => setBilling(option.value)}
                  aria-pressed={billing === option.value}
                >
                  <span className="text-base font-semibold">{option.title}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Plano</p>
            <div className="grid gap-3 md:grid-cols-3">
              {planOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={plan === option.value ? 'default' : 'outline'}
                  className="h-auto flex-col items-start gap-1 px-4 py-3 text-left"
                  onClick={() => setPlan(option.value)}
                  aria-pressed={plan === option.value}
                >
                  <span className="text-base font-semibold">{option.title}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button type="button" className="w-full" onClick={handleContinue}>
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
