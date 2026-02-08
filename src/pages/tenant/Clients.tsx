import { useState } from "react";
import type { FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
} from "lucide-react";

import {
  clientSchema,
  formatCep,
  formatDocument,
  formatPhone,
} from "@/lib/validation/clientSchema";
import { loadStoredClients, saveStoredClients } from "@/lib/clientsStore";
import { useToast } from "@/hooks/use-toast";

type ClientStatus = "active" | "pending" | "inactive";
type CommercialStatus = "active" | "negotiation" | "pending" | "inactive";
type PlanType = "monthly" | "annual";
type PaymentPreference = "CARTAO" | "PIX" | "BOLETO";
type Plan = "Pro" | "Business" | "Enterprise";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;

  responsible: string;
  planType: PlanType;
  plan: Plan;
  commercialStatus: CommercialStatus;
  paymentPreference: PaymentPreference;

  address: {
    state: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    country: string;
    cep: string;
  };

  status: ClientStatus;
  notes: string;
  createdAt: string;
};

// Demo clients
const initialClients: Client[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@empresa.com",
    phone: "(11) 99999-1111",
    document: "123.456.789-00",
    responsible: "Maria Silva",
    planType: "monthly",
    plan: "Pro",
    commercialStatus: "active",
    paymentPreference: "CARTAO",
    address: {
      state: "SP",
      street: "Av. Paulista",
      number: "1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      country: "Brasil",
      cep: "01310-100",
    },
    status: "active",
    notes: "Cliente VIP",
    createdAt: "2025-11-15",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@startup.io",
    phone: "(21) 98888-2222",
    document: "234.567.890-11",
    responsible: "João Santos",
    planType: "annual",
    plan: "Business",
    commercialStatus: "negotiation",
    paymentPreference: "PIX",
    address: {
      state: "RJ",
      street: "Rua das Laranjeiras",
      number: "250",
      neighborhood: "Laranjeiras",
      city: "Rio de Janeiro",
      country: "Brasil",
      cep: "22240-003",
    },
    status: "active",
    notes: "",
    createdAt: "2025-12-01",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@tech.com",
    phone: "(31) 97777-3333",
    document: "345.678.901-22",
    responsible: "Carlos Costa",
    planType: "monthly",
    plan: "Enterprise",
    commercialStatus: "pending",
    paymentPreference: "BOLETO",
    address: {
      state: "MG",
      street: "Rua da Bahia",
      number: "350",
      neighborhood: "Centro",
      city: "Belo Horizonte",
      country: "Brasil",
      cep: "30160-011",
    },
    status: "pending",
    notes: "Aguardando documentos",
    createdAt: "2026-01-10",
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    email: "pedro@comercio.br",
    phone: "(41) 96666-4444",
    document: "456.789.012-33",
    responsible: "Juliana Oliveira",
    planType: "annual",
    plan: "Pro",
    commercialStatus: "active",
    paymentPreference: "CARTAO",
    address: {
      state: "PR",
      street: "Rua XV de Novembro",
      number: "89",
      neighborhood: "Centro",
      city: "Curitiba",
      country: "Brasil",
      cep: "80020-310",
    },
    status: "active",
    notes: "",
    createdAt: "2026-02-01",
  },
  {
    id: "5",
    name: "Carla Lima",
    email: "carla@industria.com",
    phone: "(51) 95555-5555",
    document: "567.890.123-44",
    responsible: "Carla Lima",
    planType: "monthly",
    plan: "Business",
    commercialStatus: "inactive",
    paymentPreference: "BOLETO",
    address: {
      state: "RS",
      street: "Av. Ipiranga",
      number: "6681",
      neighborhood: "Partenon",
      city: "Porto Alegre",
      country: "Brasil",
      cep: "90619-900",
    },
    status: "inactive",
    notes: "Contrato encerrado",
    createdAt: "2025-08-20",
  },
];

const getTodayDate = () => new Date().toISOString().split("T")[0];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  responsible?: string;
  planType?: string;
  plan?: string;
  commercialStatus?: string;
  paymentPreference?: string;
  addressState?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressCountry?: string;
  addressCep?: string;
  status?: string;
  notes?: string;
}

export default function TenantClients() {
  const [searchTerm, setSearchTerm] = useState("");

  // Carrega localStorage + normaliza campos e junta com initialClients
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = loadStoredClients() as Partial<Client>[];
    const normalizedStored: Client[] = (stored || []).map((client) => ({
      id:
        client.id ??
        (typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`),
      name: client.name ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
      document: client.document ?? "",

      responsible: client.responsible ?? client.name ?? "",
      planType: (client.planType as PlanType) ?? "monthly",
      plan: (client.plan as Plan) ?? "Pro",
      commercialStatus: (client.commercialStatus as CommercialStatus) ?? "active",
      paymentPreference:
        (client.paymentPreference as PaymentPreference) ?? "CARTAO",

      address: {
        state: client.address?.state ?? "SP",
        street: client.address?.street ?? "",
        number: client.address?.number ?? "",
        neighborhood: client.address?.neighborhood ?? "",
        city: client.address?.city ?? "",
        country: client.address?.country ?? "Brasil",
        cep: client.address?.cep ?? "",
      },

      status: (client.status as ClientStatus) ?? "active",
      notes: client.notes ?? "",
      createdAt: client.createdAt ?? getTodayDate(),
    }));

    return normalizedStored.length ? [...initialClients, ...normalizedStored] : initialClients;
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    responsible: "",
    planType: "monthly" as PlanType,
    plan: "Pro" as Plan,
    commercialStatus: "active" as CommercialStatus,
    paymentPreference: "CARTAO" as PaymentPreference,
    address: {
      state: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      country: "Brasil",
      cep: "",
    },
    status: "active" as ClientStatus,
    notes: "",
    createdAt: getTodayDate(),
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.document.includes(searchTerm) ||
      client.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      document: "",
      responsible: "",
      planType: "monthly",
      plan: "Pro",
      commercialStatus: "active",
      paymentPreference: "CARTAO",
      address: {
        state: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        country: "Brasil",
        cep: "",
      },
      status: "active",
      notes: "",
      createdAt: getTodayDate(),
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    setFormData((prev) => ({ ...prev, document: formatted }));
    if (formErrors.document) setFormErrors((prev) => ({ ...prev, document: undefined }));
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        cep: formatted,
      },
    }));
    if (formErrors.addressCep) setFormErrors((prev) => ({ ...prev, addressCep: undefined }));
  };

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
    const errorKey = `address${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof FormErrors;
    if (formErrors[errorKey]) setFormErrors((prev) => ({ ...prev, [errorKey]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = clientSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document: formData.document,
      responsible: formData.responsible,
      planType: formData.planType,
      plan: formData.plan,
      commercialStatus: formData.commercialStatus,
      paymentPreference: formData.paymentPreference,
      addressState: formData.address.state,
      addressStreet: formData.address.street,
      addressNumber: formData.address.number,
      addressNeighborhood: formData.address.neighborhood,
      addressCity: formData.address.city,
      addressCountry: formData.address.country,
      addressCep: formData.address.cep,
      status: formData.status,
      notes: formData.notes,
    });

    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (field) errors[field] = issue.message;
      });
      setFormErrors(errors);

      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const newClient: Client = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      document: result.data.document,

      responsible: result.data.responsible,
      planType: result.data.planType as PlanType,
      plan: result.data.plan as Plan,
      commercialStatus: result.data.commercialStatus as CommercialStatus,
      paymentPreference: result.data.paymentPreference as PaymentPreference,

      address: {
        state: result.data.addressState,
        street: result.data.addressStreet,
        number: result.data.addressNumber,
        neighborhood: result.data.addressNeighborhood,
        city: result.data.addressCity,
        country: result.data.addressCountry,
        cep: result.data.addressCep,
      },

      status: result.data.status as ClientStatus,
      notes: result.data.notes || "",
      createdAt: now.toISOString(),
    };

    setClients((prev) => {
      const updated = [...prev, newClient];
      // persiste apenas os "novos" (sem os demo). aqui simplifico persistindo todos:
      saveStoredClients(updated);
      return updated;
    });

    setIsDialogOpen(false);

    toast({
      title: "Cliente adicionado",
      description: "O cliente foi adicionado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes do CRM</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente para adicioná-lo à lista.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Nome
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  placeholder="Nome completo"
                  maxLength={255}
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  placeholder="email@empresa.com"
                  maxLength={255}
                  className={formErrors.email ? "border-destructive" : ""}
                />
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">
                  Telefone
                </label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="(00) 00000-0000"
                  className={formErrors.phone ? "border-destructive" : ""}
                />
                {formErrors.phone && (
                  <p className="text-sm text-destructive">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="document">
                  CPF/CNPJ
                </label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(event) => handleDocumentChange(event.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  className={formErrors.document ? "border-destructive" : ""}
                />
                {formErrors.document && (
                  <p className="text-sm text-destructive">{formErrors.document}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="responsible">
                  Responsável
                </label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(event) =>
                    handleFieldChange("responsible", event.target.value)
                  }
                  placeholder="Nome do responsável"
                  maxLength={255}
                  className={formErrors.responsible ? "border-destructive" : ""}
                />
                {formErrors.responsible && (
                  <p className="text-sm text-destructive">
                    {formErrors.responsible}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="status">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleFieldChange("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className={formErrors.status ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.status && (
                  <p className="text-sm text-destructive">{formErrors.status}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="commercialStatus">
                  Status comercial
                </label>
                <Select
                  value={formData.commercialStatus}
                  onValueChange={(value) =>
                    handleFieldChange("commercialStatus", value)
                  }
                >
                  <SelectTrigger
                    id="commercialStatus"
                    className={formErrors.commercialStatus ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione o status comercial" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="negotiation">Em negociação</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.commercialStatus && (
                  <p className="text-sm text-destructive">
                    {formErrors.commercialStatus}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="createdAt">
                  Desde
                </label>
                <Input id="createdAt" type="date" value={formData.createdAt} readOnly />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="plan">
                  Plano
                </label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleFieldChange("plan", value)}
                >
                  <SelectTrigger
                    id="plan"
                    className={formErrors.plan ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.plan && (
                  <p className="text-sm text-destructive">{formErrors.plan}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="planType">
                  Tipo de cobrança
                </label>
                <Select
                  value={formData.planType}
                  onValueChange={(value) => handleFieldChange("planType", value)}
                >
                  <SelectTrigger
                    id="planType"
                    className={formErrors.planType ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Mensal ou anual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.planType && (
                  <p className="text-sm text-destructive">{formErrors.planType}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="paymentPreference">
                  Preferência de pagamento
                </label>
                <Select
                  value={formData.paymentPreference}
                  onValueChange={(value) =>
                    handleFieldChange("paymentPreference", value)
                  }
                >
                  <SelectTrigger
                    id="paymentPreference"
                    className={formErrors.paymentPreference ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione a preferência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARTAO">Cartão</SelectItem>
                    <SelectItem value="PIX">Pix</SelectItem>
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

            <div className="space-y-2">
              <p className="text-sm font-medium">Endereço</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressStreet">
                    Rua
                  </label>
                  <Input
                    id="addressStreet"
                    value={formData.address.street}
                    onChange={(event) =>
                      handleAddressChange("street", event.target.value)
                    }
                    placeholder="Rua"
                    maxLength={255}
                    className={formErrors.addressStreet ? "border-destructive" : ""}
                  />
                  {formErrors.addressStreet && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressStreet}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressNumber">
                    Número
                  </label>
                  <Input
                    id="addressNumber"
                    value={formData.address.number}
                    onChange={(event) =>
                      handleAddressChange("number", event.target.value)
                    }
                    placeholder="Número"
                    maxLength={50}
                    className={formErrors.addressNumber ? "border-destructive" : ""}
                  />
                  {formErrors.addressNumber && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="addressNeighborhood"
                  >
                    Bairro
                  </label>
                  <Input
                    id="addressNeighborhood"
                    value={formData.address.neighborhood}
                    onChange={(event) =>
                      handleAddressChange("neighborhood", event.target.value)
                    }
                    placeholder="Bairro"
                    maxLength={255}
                    className={formErrors.addressNeighborhood ? "border-destructive" : ""}
                  />
                  {formErrors.addressNeighborhood && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressNeighborhood}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressCity">
                    Cidade
                  </label>
                  <Input
                    id="addressCity"
                    value={formData.address.city}
                    onChange={(event) =>
                      handleAddressChange("city", event.target.value)
                    }
                    placeholder="Cidade"
                    maxLength={255}
                    className={formErrors.addressCity ? "border-destructive" : ""}
                  />
                  {formErrors.addressCity && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressCity}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressState">
                    UF
                  </label>
                  <Input
                    id="addressState"
                    value={formData.address.state}
                    onChange={(event) =>
                      handleAddressChange("state", event.target.value.toUpperCase())
                    }
                    placeholder="UF"
                    maxLength={2}
                    className={formErrors.addressState ? "border-destructive" : ""}
                  />
                  {formErrors.addressState && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressState}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressCountry">
                    País
                  </label>
                  <Input
                    id="addressCountry"
                    value={formData.address.country}
                    onChange={(event) =>
                      handleAddressChange("country", event.target.value)
                    }
                    placeholder="País"
                    maxLength={255}
                    className={formErrors.addressCountry ? "border-destructive" : ""}
                  />
                  {formErrors.addressCountry && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressCountry}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressCep">
                    CEP
                  </label>
                  <Input
                    id="addressCep"
                    value={formData.address.cep}
                    onChange={(event) => handleCepChange(event.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className={formErrors.addressCep ? "border-destructive" : ""}
                  />
                  {formErrors.addressCep && (
                    <p className="text-sm text-destructive">{formErrors.addressCep}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="notes">
                Observações
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(event) => handleFieldChange("notes", event.target.value)}
                placeholder="Notas adicionais sobre o cliente"
                maxLength={5000}
                className={formErrors.notes ? "border-destructive" : ""}
              />
              <div className="flex justify-between">
                {formErrors.notes ? (
                  <p className="text-sm text-destructive">{formErrors.notes}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.notes.length}/5000
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar cliente</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail, telefone ou CPF/CNPJ..."
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
          <CardDescription>{filteredClients.length} clientes encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Plano/Cobrança</TableHead>
                <TableHead>Status comercial</TableHead>
                <TableHead>Preferência</TableHead>
                <TableHead>Documento/Responsável</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="table-row-hover">
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                        <p>Desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}</p>
                        {client.notes && <p>{client.notes}</p>}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2">
                      <Badge variant="secondary">{client.plan}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {client.planType === "monthly" ? "Mensal" : "Anual"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.commercialStatus === "active"
                          ? "status-active"
                          : client.commercialStatus === "pending"
                          ? "status-pending"
                          : client.commercialStatus === "negotiation"
                          ? "status-pending"
                          : "status-inactive"
                      }
                    >
                      {client.commercialStatus === "active"
                        ? "Ativo"
                        : client.commercialStatus === "pending"
                        ? "Pendente"
                        : client.commercialStatus === "negotiation"
                        ? "Em negociação"
                        : "Inativo"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm font-medium">
                      {client.paymentPreference === "CARTAO"
                        ? "Cartão"
                        : client.paymentPreference === "PIX"
                        ? "Pix"
                        : "Boleto"}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-mono text-sm">{client.document}</p>
                      <p className="text-sm text-muted-foreground">{client.responsible}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {client.address.city}/{client.address.state}
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
