import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  formatCep,
  formatDocument,
  formatPhone,
  getDocumentType,
  signupRegisterSchema,
} from '@/lib/validation/clientSchema';
import { ArrowLeft, CreditCard, QrCode, FileText } from 'lucide-react';

const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

const BILLING_LABELS: Record<string, string> = {
  monthly: 'Mensal',
  annual: 'Anual',
};

interface FormErrors {
  name?: string;
  document?: string;
  responsible?: string;
  promoCode?: string;
  email?: string;
  phone?: string;
  paymentPreference?: string;
  plan?: string;
  status?: string;
  address?: {
    state?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    country?: string;
    cep?: string;
  };
}

export default function SignupRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get values from URL params
  const billing = searchParams.get('billing') || 'monthly';
  const planFromParams = searchParams.get('plan') || 'pro';
  const priceFromParams = searchParams.get('price') || '99';
  const totalFromParams = searchParams.get('total') || priceFromParams;

  const planLabel = PLAN_LABELS[planFromParams] || planFromParams;
  const billingLabel = BILLING_LABELS[billing] || billing;
  const monthlyPrice = parseInt(priceFromParams, 10);
  const totalValue = parseInt(totalFromParams, 10);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    responsible: '',
    promoCode: '',
    email: '',
    phone: '',
    paymentPreference: 'CARTAO' as 'CARTAO' | 'PIX' | 'BOLETO',
    plan: planLabel,
    status: 'Em análise comercial',
    address: {
      state: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      country: 'Brasil',
      cep: '',
    },
  });

  const documentType = useMemo(
    () => getDocumentType(formData.document),
    [formData.document]
  );

  useEffect(() => {
    if (documentType === 'cpf') {
      setFormData((prev) => ({ ...prev, responsible: prev.name }));
    }
  }, [documentType, formData.name]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (
    field: keyof typeof formData.address,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
    if (formErrors.address?.[field]) {
      setFormErrors((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: undefined },
      }));
    }
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    setFormData((prev) => ({ ...prev, document: formatted }));
    if (formErrors.document) {
      setFormErrors((prev) => ({ ...prev, document: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (formErrors.phone) {
      setFormErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, cep: formatted },
    }));
    if (formErrors.address?.cep) {
      setFormErrors((prev) => ({
        ...prev,
        address: { ...prev.address, cep: undefined },
      }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = signupRegisterSchema.safeParse(formData);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const [field, subfield] = issue.path;
        if (field === 'address' && subfield) {
          errors.address = {
            ...(errors.address ?? {}),
            [subfield]: issue.message,
          };
        } else if (typeof field === 'string') {
          errors[field as keyof FormErrors] = issue.message;
        }
      });
      setFormErrors(errors);
      toast({
        title: 'Erro de validação',
        description: 'Revise os campos destacados antes de continuar.',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const newClientData = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      document: result.data.document,
      status: 'pending' as const,
      notes: result.data.promoCode ? `Código promocional: ${result.data.promoCode}` : '',
      createdAt: now.toISOString(),
    };

    console.log('New client registration (in-memory only):', newClientData.id);

    toast({
      title: 'Cadastro enviado',
      description: 'Os dados foram processados. (Dados armazenados apenas em memória)',
    });

    setFormData((prev) => ({
      ...prev,
      name: '',
      document: '',
      responsible: '',
      promoCode: '',
      email: '',
      phone: '',
      paymentPreference: 'CARTAO',
      address: {
        ...prev.address,
        state: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        cep: '',
      },
    }));
    setFormErrors({});
  };

  const renderPaymentDetails = () => {
    switch (formData.paymentPreference) {
      case 'CARTAO':
        return (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-primary" />
              Pagamento com Cartão de Crédito
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Número do cartão</label>
                <Input placeholder="0000 0000 0000 0000" disabled className="bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Validade</label>
                  <Input placeholder="MM/AA" disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">CVV</label>
                  <Input placeholder="000" disabled className="bg-muted" />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Os dados do cartão serão solicitados após a aprovação comercial.
            </p>
          </div>
        );
      case 'PIX':
        return (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <QrCode className="h-4 w-4 text-primary" />
              Pagamento via PIX
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
                <QrCode className="h-12 w-12 text-muted-foreground/50" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              O QR Code será gerado após a aprovação comercial. Você receberá as instruções por e-mail.
            </p>
          </div>
        );
      case 'BOLETO':
        return (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              Pagamento via Boleto Bancário
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                O boleto será enviado para o e-mail cadastrado após a aprovação comercial.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Vencimento em até 3 dias úteis</li>
                <li>Compensação em até 2 dias úteis após pagamento</li>
                <li>Disponível para pessoa física e jurídica</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-background p-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/signup/plan')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para escolha do plano
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Cliente</h1>
          <p className="text-muted-foreground">
            Informe os dados para registrar o cliente e iniciar o processo comercial.
          </p>
        </div>

        {/* Commercial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo comercial</CardTitle>
            <CardDescription>
              Plano e valores selecionados na etapa anterior.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="font-medium">{planLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de cobrança</p>
                <Badge variant="secondary">{billingLabel}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor mensal</p>
                <p className="font-medium text-lg">R$ {monthlyPrice},00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {billing === 'annual' ? 'Total anual' : 'Total mensal'}
                </p>
                <p className="font-bold text-xl text-primary">R$ {totalValue},00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do cadastro</CardTitle>
            <CardDescription>
              Campos obrigatórios marcados com *
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Nome *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => handleFieldChange('name', event.target.value)}
                    placeholder="Nome completo"
                    className={formErrors.name ? 'border-destructive' : ''}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-destructive">{formErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="document">
                    CPF/CNPJ *
                  </label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(event) => handleDocumentChange(event.target.value)}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className={formErrors.document ? 'border-destructive' : ''}
                  />
                  {formErrors.document && (
                    <p className="text-sm text-destructive">{formErrors.document}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="responsible">
                    Nome do responsável *
                  </label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(event) =>
                      handleFieldChange('responsible', event.target.value)
                    }
                    placeholder="Responsável"
                    disabled={documentType === 'cpf'}
                    className={formErrors.responsible ? 'border-destructive' : ''}
                  />
                  {formErrors.responsible && (
                    <p className="text-sm text-destructive">{formErrors.responsible}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="promoCode">
                    Código promocional
                  </label>
                  <Input
                    id="promoCode"
                    value={formData.promoCode}
                    onChange={(event) =>
                      handleFieldChange('promoCode', event.target.value)
                    }
                    placeholder="Opcional"
                    className={formErrors.promoCode ? 'border-destructive' : ''}
                  />
                  {formErrors.promoCode && (
                    <p className="text-sm text-destructive">{formErrors.promoCode}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                    placeholder="email@empresa.com"
                    className={formErrors.email ? 'border-destructive' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Telefone *
                  </label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                    placeholder="(00) 00000-0000"
                    className={formErrors.phone ? 'border-destructive' : ''}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-destructive">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Payment Preference Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Preferência de pagamento</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="paymentPreference">
                    Forma de pagamento *
                  </label>
                  <Select
                    value={formData.paymentPreference}
                    onValueChange={(value) => handleFieldChange('paymentPreference', value)}
                  >
                    <SelectTrigger
                      id="paymentPreference"
                      className={formErrors.paymentPreference ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARTAO">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Cartão de Crédito
                        </div>
                      </SelectItem>
                      <SelectItem value="PIX">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          PIX
                        </div>
                      </SelectItem>
                      <SelectItem value="BOLETO">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Boleto Bancário
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.paymentPreference && (
                    <p className="text-sm text-destructive">
                      {formErrors.paymentPreference}
                    </p>
                  )}
                </div>
                {renderPaymentDetails()}
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  <span className="text-xs text-muted-foreground">Obrigatório</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="state">
                      UF *
                    </label>
                    <Select
                      value={formData.address.state}
                      onValueChange={(value) => handleAddressChange('state', value)}
                    >
                      <SelectTrigger
                        id="state"
                        className={formErrors.address?.state ? 'border-destructive' : ''}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.address?.state && (
                      <p className="text-sm text-destructive">{formErrors.address.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="street">
                      Rua *
                    </label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(event) => handleAddressChange('street', event.target.value)}
                      placeholder="Rua/Av."
                      className={formErrors.address?.street ? 'border-destructive' : ''}
                    />
                    {formErrors.address?.street && (
                      <p className="text-sm text-destructive">{formErrors.address.street}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="number">
                      Número *
                    </label>
                    <Input
                      id="number"
                      value={formData.address.number}
                      onChange={(event) => handleAddressChange('number', event.target.value)}
                      placeholder="Número"
                      className={formErrors.address?.number ? 'border-destructive' : ''}
                    />
                    {formErrors.address?.number && (
                      <p className="text-sm text-destructive">{formErrors.address.number}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="neighborhood">
                      Bairro *
                    </label>
                    <Input
                      id="neighborhood"
                      value={formData.address.neighborhood}
                      onChange={(event) =>
                        handleAddressChange('neighborhood', event.target.value)
                      }
                      placeholder="Bairro"
                      className={formErrors.address?.neighborhood ? 'border-destructive' : ''}
                    />
                    {formErrors.address?.neighborhood && (
                      <p className="text-sm text-destructive">
                        {formErrors.address.neighborhood}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">
                      Cidade *
                    </label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(event) => handleAddressChange('city', event.target.value)}
                      placeholder="Cidade"
                      className={formErrors.address?.city ? 'border-destructive' : ''}
                    />
                    {formErrors.address?.city && (
                      <p className="text-sm text-destructive">{formErrors.address.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="country">
                      País *
                    </label>
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(event) => handleAddressChange('country', event.target.value)}
                      placeholder="País"
                      className={formErrors.address?.country ? 'border-destructive' : ''}
                    />
                    {formErrors.address?.country && (
                      <p className="text-sm text-destructive">{formErrors.address.country}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="cep">
                      CEP *
                    </label>
                    <Input
                      id="cep"
                      value={formData.address.cep}
                      onChange={(event) => handleCepChange(event.target.value)}
                      placeholder="00000-000"
                      className={formErrors.address?.cep ? 'border-destructive' : ''}
                    />
                    {formErrors.address?.cep && (
                      <p className="text-sm text-destructive">{formErrors.address.cep}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Salvar cadastro</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
