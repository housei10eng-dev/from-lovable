import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";

import {
  clientSchema,
  formatCep,
  formatDocument,
  formatPhone,
} from "@/lib/validation/clientSchema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast } = useToast();
  const { profile } = useAuth();

  // Fetch clients from Supabase on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching clients:", error);
          toast({
            title: "Erro ao carregar clientes",
            description: "Não foi possível carregar a lista de clientes.",
            variant: "destructive",
          });
          return;
        }

        // Transform database records to Client type
        const transformedClients: Client[] = (data || []).map((record) => {
          const customFields = (record.custom_fields || {}) as Record<string, unknown>;
          return {
            id: record.id,
            name: record.name,
            email: record.email || "",
            phone: record.phone || "",
            document: record.document || "",
            responsible: (customFields.responsible as string) || record.name,
            planType: (customFields.planType as PlanType) || "monthly",
            plan: (customFields.plan as Plan) || "Pro",
            commercialStatus: (customFields.commercialStatus as CommercialStatus) || "active",
            paymentPreference: (customFields.paymentPreference as PaymentPreference) || "CARTAO",
            address: {
              state: (customFields.addressState as string) || "",
              street: (customFields.addressStreet as string) || "",
              number: (customFields.addressNumber as string) || "",
              neighborhood: (customFields.addressNeighborhood as string) || "",
              city: (customFields.addressCity as string) || "",
              country: (customFields.addressCountry as string) || "Brasil",
              cep: (customFields.addressCep as string) || "",
            },
            status: record.status as ClientStatus,
            notes: record.notes || "",
            createdAt: record.created_at,
          };
        });

        setClients(transformedClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    if (!profile?.tenant_id) {
      toast({
        title: "Erro",
        description: "Você precisa estar associado a uma empresa para adicionar clientes.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: newRecord, error } = await supabase
        .from("clients")
        .insert([
          {
            tenant_id: profile.tenant_id,
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            document: result.data.document,
            status: result.data.status,
            notes: result.data.notes || null,
            custom_fields: {
              responsible: result.data.responsible,
              planType: result.data.planType,
              plan: result.data.plan,
              commercialStatus: result.data.commercialStatus,
              paymentPreference: result.data.paymentPreference,
              addressState: result.data.addressState,
              addressStreet: result.data.addressStreet,
              addressNumber: result.data.addressNumber,
              addressNeighborhood: result.data.addressNeighborhood,
              addressCity: result.data.addressCity,
              addressCountry: result.data.addressCountry,
              addressCep: result.data.addressCep,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating client:", error);
        toast({
          title: "Erro ao criar cliente",
          description: error.message || "Não foi possível criar o cliente.",
          variant: "destructive",
        });
        return;
      }

      // Add new client to local state
      const customFields = (newRecord.custom_fields || {}) as Record<string, unknown>;
      const newClient: Client = {
        id: newRecord.id,
        name: newRecord.name,
        email: newRecord.email || "",
        phone: newRecord.phone || "",
        document: newRecord.document || "",
        responsible: (customFields.responsible as string) || newRecord.name,
        planType: (customFields.planType as PlanType) || "monthly",
        plan: (customFields.plan as Plan) || "Pro",
        commercialStatus: (customFields.commercialStatus as CommercialStatus) || "active",
        paymentPreference: (customFields.paymentPreference as PaymentPreference) || "CARTAO",
        address: {
          state: (customFields.addressState as string) || "",
          street: (customFields.addressStreet as string) || "",
          number: (customFields.addressNumber as string) || "",
          neighborhood: (customFields.addressNeighborhood as string) || "",
          city: (customFields.addressCity as string) || "",
          country: (customFields.addressCountry as string) || "Brasil",
          cep: (customFields.addressCep as string) || "",
        },
        status: newRecord.status as ClientStatus,
        notes: newRecord.notes || "",
        createdAt: newRecord.created_at,
      };

      setClients((prev) => [newClient, ...prev]);
      setIsDialogOpen(false);

      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });
    } catch (err) {
      console.error("Error creating client:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) {
        console.error("Error deleting client:", error);
        toast({
          title: "Erro ao excluir cliente",
          description: error.message || "Não foi possível excluir o cliente.",
          variant: "destructive",
        });
        return;
      }

      setClients((prev) => prev.filter((c) => c.id !== clientId));
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
    } catch (err) {
      console.error("Error deleting client:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o cliente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value as ClientStatus }))
                  }
                >
                  <SelectTrigger className={formErrors.status ? "border-destructive" : ""}>
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
                <label className="text-sm font-medium" htmlFor="planType">
                  Tipo de Plano
                </label>
                <Select
                  value={formData.planType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, planType: value as PlanType }))
                  }
                >
                  <SelectTrigger className={formErrors.planType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o tipo" />
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
                <label className="text-sm font-medium" htmlFor="plan">
                  Plano
                </label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, plan: value as Plan }))
                  }
                >
                  <SelectTrigger className={formErrors.plan ? "border-destructive" : ""}>
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
                <label className="text-sm font-medium" htmlFor="commercialStatus">
                  Status Comercial
                </label>
                <Select
                  value={formData.commercialStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      commercialStatus: value as CommercialStatus,
                    }))
                  }
                >
                  <SelectTrigger
                    className={formErrors.commercialStatus ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione o status comercial" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="negotiation">Em Negociação</SelectItem>
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
                <label className="text-sm font-medium" htmlFor="paymentPreference">
                  Preferência de Pagamento
                </label>
                <Select
                  value={formData.paymentPreference}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentPreference: value as PaymentPreference,
                    }))
                  }
                >
                  <SelectTrigger
                    className={formErrors.paymentPreference ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione a forma de pagamento" />
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

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressCep">
                    CEP
                  </label>
                  <Input
                    id="addressCep"
                    value={formData.address.cep}
                    onChange={(event) => handleCepChange(event.target.value)}
                    placeholder="00000-000"
                    className={formErrors.addressCep ? "border-destructive" : ""}
                  />
                  {formErrors.addressCep && (
                    <p className="text-sm text-destructive">{formErrors.addressCep}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressState">
                    Estado
                  </label>
                  <Input
                    id="addressState"
                    value={formData.address.state}
                    onChange={(event) =>
                      handleAddressChange("state", event.target.value)
                    }
                    placeholder="SP"
                    maxLength={2}
                    className={formErrors.addressState ? "border-destructive" : ""}
                  />
                  {formErrors.addressState && (
                    <p className="text-sm text-destructive">{formErrors.addressState}</p>
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
                    placeholder="São Paulo"
                    maxLength={100}
                    className={formErrors.addressCity ? "border-destructive" : ""}
                  />
                  {formErrors.addressCity && (
                    <p className="text-sm text-destructive">{formErrors.addressCity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="addressNeighborhood">
                    Bairro
                  </label>
                  <Input
                    id="addressNeighborhood"
                    value={formData.address.neighborhood}
                    onChange={(event) =>
                      handleAddressChange("neighborhood", event.target.value)
                    }
                    placeholder="Centro"
                    maxLength={100}
                    className={formErrors.addressNeighborhood ? "border-destructive" : ""}
                  />
                  {formErrors.addressNeighborhood && (
                    <p className="text-sm text-destructive">
                      {formErrors.addressNeighborhood}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium" htmlFor="addressStreet">
                    Rua
                  </label>
                  <Input
                    id="addressStreet"
                    value={formData.address.street}
                    onChange={(event) =>
                      handleAddressChange("street", event.target.value)
                    }
                    placeholder="Av. Paulista"
                    maxLength={255}
                    className={formErrors.addressStreet ? "border-destructive" : ""}
                  />
                  {formErrors.addressStreet && (
                    <p className="text-sm text-destructive">{formErrors.addressStreet}</p>
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
                    placeholder="1000"
                    maxLength={20}
                    className={formErrors.addressNumber ? "border-destructive" : ""}
                  />
                  {formErrors.addressNumber && (
                    <p className="text-sm text-destructive">{formErrors.addressNumber}</p>
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
                    placeholder="Brasil"
                    maxLength={100}
                    className={formErrors.addressCountry ? "border-destructive" : ""}
                  />
                  {formErrors.addressCountry && (
                    <p className="text-sm text-destructive">{formErrors.addressCountry}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="notes">
                Observações
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(event) => handleFieldChange("notes", event.target.value)}
                placeholder="Notas adicionais sobre o cliente..."
                className={formErrors.notes ? "border-destructive" : ""}
                rows={3}
              />
              {formErrors.notes && (
                <p className="text-sm text-destructive">{formErrors.notes}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Adicionar Cliente"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail, telefone, documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome / Responsável</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Plano / Cobrança</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.responsible}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {client.email || "-"}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {client.document || "-"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.planType === "monthly" ? "Mensal" : "Anual"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {client.paymentPreference === "CARTAO"
                            ? "Cartão"
                            : client.paymentPreference === "PIX"
                            ? "PIX"
                            : "Boleto"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client.address.city && client.address.state
                            ? `${client.address.city}/${client.address.state}`
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.status === "active"
                              ? "default"
                              : client.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {client.status === "active"
                            ? "Ativo"
                            : client.status === "pending"
                            ? "Pendente"
                            : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
