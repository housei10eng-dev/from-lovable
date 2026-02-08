import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLAN_PRICES = {
  pro: { monthly: 99, annual: 79 },
  business: { monthly: 199, annual: 159 },
  enterprise: { monthly: 399, annual: 319 },
} as const;

const planOptions = [
  {
    value: 'pro' as const,
    title: 'Pro',
    description: 'Para times em crescimento',
    features: [
      'Até 5 usuários',
      '1.000 clientes',
      'Relatórios básicos',
      'Suporte por e-mail',
    ],
    highlight: false,
  },
  {
    value: 'business' as const,
    title: 'Business',
    description: 'Operação completa com relatórios',
    features: [
      'Até 20 usuários',
      '10.000 clientes',
      'Relatórios avançados',
      'Suporte prioritário',
      'Integrações API',
    ],
    highlight: true,
  },
  {
    value: 'enterprise' as const,
    title: 'Enterprise',
    description: 'Grandes contas e suporte dedicado',
    features: [
      'Usuários ilimitados',
      'Clientes ilimitados',
      'Relatórios personalizados',
      'Gerente de conta dedicado',
      'SLA garantido',
      'Onboarding personalizado',
    ],
    highlight: false,
  },
];

export default function SignupPlan() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [plan, setPlan] = useState<'pro' | 'business' | 'enterprise'>('pro');
  const navigate = useNavigate();

  const getPrice = (planValue: 'pro' | 'business' | 'enterprise') => {
    return PLAN_PRICES[planValue][billing];
  };

  const getAnnualSavings = (planValue: 'pro' | 'business' | 'enterprise') => {
    const monthlyTotal = PLAN_PRICES[planValue].monthly * 12;
    const annualTotal = PLAN_PRICES[planValue].annual * 12;
    return monthlyTotal - annualTotal;
  };

  const handleContinue = () => {
    const selectedPrice = getPrice(plan);
    const totalValue = billing === 'annual' ? selectedPrice * 12 : selectedPrice;
    const params = new URLSearchParams({
      billing,
      plan,
      price: selectedPrice.toString(),
      total: totalValue.toString(),
    });
    navigate(`/signup/register?${params.toString()}`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl space-y-8 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para login
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Escolha seu plano</h1>
          <p className="text-muted-foreground">
            Selecione o tipo de cobrança e o plano ideal para sua operação.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted p-1">
            <Button
              type="button"
              variant={billing === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full"
              onClick={() => setBilling('monthly')}
            >
              Mensal
            </Button>
            <Button
              type="button"
              variant={billing === 'annual' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full gap-2"
              onClick={() => setBilling('annual')}
            >
              Anual
              <Badge variant="secondary" className="text-xs">
                Economize 20%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {planOptions.map((option) => {
            const isSelected = plan === option.value;
            const price = getPrice(option.value);
            const savings = getAnnualSavings(option.value);

            return (
              <Card
                key={option.value}
                className={cn(
                  'relative cursor-pointer transition-all duration-200 hover:shadow-lg',
                  isSelected && 'ring-2 ring-primary shadow-lg',
                  option.highlight && 'border-primary/50'
                )}
                onClick={() => setPlan(option.value)}
              >
                {option.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Mais popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-bold">{price}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    {billing === 'annual' && (
                      <p className="mt-1 text-sm text-primary">
                        Economia de R$ {savings}/ano
                      </p>
                    )}
                    {billing === 'monthly' && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cobrado mensalmente
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Selection indicator */}
                  <Button
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlan(option.value);
                    }}
                  >
                    {isSelected ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button size="lg" className="px-12" onClick={handleContinue}>
            Continuar para cadastro
          </Button>
        </div>
      </div>
    </div>
  );
}
