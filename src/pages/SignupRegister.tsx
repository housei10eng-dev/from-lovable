import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import {
  formatCep,
  formatDocument,
  formatPhone,
  getDocumentType,
  signupRegisterSchema,
} from '@/lib/validation/clientSchema';

const STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const defaultPlan = 'Plano Essencial';
const defaultStatus = 'Em análise comercial';

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
  const { toast } = useToast();
  const planFromState =
    typeof (location.state as { plan?: string } | null)?.plan === 'string'
      ? (location.state as { plan?: string }).plan
      : defaultPlan;
  const statusFromState =
    typeof (location.state as { status?: string } | null)?.status === 'string'
      ? (location.state as { status?: string }).status
      : defaultStatus;

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    responsible: '',
    promoCode: '',
    email: '',
    phone: '',
    paymentPreference: 'CARTAO',
    plan: planFromState,
    status: statusFromState,
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

    // Note: In production, this data should be sent to the backend database
    // Currently storing only in memory for demo purposes (no localStorage for security)
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

    // TODO: Replace with actual API call to save to database
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastro de Cliente</h1>
        <p className="text-muted-foreground">
          Informe os dados para registrar o cliente e iniciar o processo comercial.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo comercial</CardTitle>
          <CardDescription>
            Plano e status definidos na etapa anterior.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Plano</p>
            <p className="font-medium">{formData.plan}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{formData.status}</p>
          </div>
        </CardContent>
      </Card>

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
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="paymentPreference">
                  Preferência de pagamento *
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
                    <SelectItem value="CARTAO">Cartão</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.paymentPreference && (
                  <p className="text-sm text-destructive">
                    {formErrors.paymentPreference}
                  </p>
                )}
              </div>
            </div>

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
  );
}
