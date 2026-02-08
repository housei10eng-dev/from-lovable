import { z } from 'zod';

export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
export const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
export const cepRegex = /^\d{5}-\d{3}$/;

/**
 * Validation schema for client form data
 * Enforces proper formats and length limits to prevent injection attacks and data integrity issues
 */
export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Nome é obrigatório' })
    .max(255, { message: 'Nome deve ter no máximo 255 caracteres' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail deve ter no máximo 255 caracteres' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Telefone é obrigatório' })
    .regex(phoneRegex, { 
      message: 'Telefone deve estar no formato (00) 00000-0000' 
    }),
  document: z
    .string()
    .trim()
    .min(1, { message: 'CPF/CNPJ é obrigatório' })
    .refine((value) => cpfRegex.test(value) || cnpjRegex.test(value), {
      message: 'CPF ou CNPJ inválido',
    }),
  responsible: z
    .string()
    .trim()
    .min(1, { message: 'Nome do responsável é obrigatório' })
    .max(255, { message: 'Nome do responsável deve ter no máximo 255 caracteres' }),
  planType: z.enum(['monthly', 'annual'], {
    errorMap: () => ({ message: 'Tipo de cobrança inválido' }),
  }),
  plan: z.enum(['Pro', 'Business', 'Enterprise'], {
    errorMap: () => ({ message: 'Plano inválido' }),
  }),
  commercialStatus: z.enum(['active', 'negotiation', 'pending', 'inactive'], {
    errorMap: () => ({ message: 'Status comercial inválido' }),
  }),
  paymentPreference: z.enum(['CARTAO', 'PIX', 'BOLETO'], {
    errorMap: () => ({ message: 'Preferência de pagamento inválida' }),
  }),
  addressState: z
    .string()
    .trim()
    .min(2, { message: 'UF é obrigatória' })
    .max(2, { message: 'UF deve ter 2 caracteres' }),
  addressStreet: z
    .string()
    .trim()
    .min(1, { message: 'Rua é obrigatória' })
    .max(255, { message: 'Rua deve ter no máximo 255 caracteres' }),
  addressNumber: z
    .string()
    .trim()
    .min(1, { message: 'Número é obrigatório' })
    .max(50, { message: 'Número deve ter no máximo 50 caracteres' }),
  addressNeighborhood: z
    .string()
    .trim()
    .min(1, { message: 'Bairro é obrigatório' })
    .max(255, { message: 'Bairro deve ter no máximo 255 caracteres' }),
  addressCity: z
    .string()
    .trim()
    .min(1, { message: 'Cidade é obrigatória' })
    .max(255, { message: 'Cidade deve ter no máximo 255 caracteres' }),
  addressCountry: z
    .string()
    .trim()
    .min(1, { message: 'País é obrigatório' })
    .max(255, { message: 'País deve ter no máximo 255 caracteres' }),
  addressCep: z
    .string()
    .trim()
    .min(1, { message: 'CEP é obrigatório' })
    .regex(cepRegex, { message: 'CEP deve estar no formato 00000-000' }),
  status: z.enum(['active', 'pending', 'inactive'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
  notes: z
    .string()
    .trim()
    .max(5000, { message: 'Observações devem ter no máximo 5000 caracteres' })
    .optional()
    .default(''),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export const signupRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Nome é obrigatório' })
    .max(255, { message: 'Nome deve ter no máximo 255 caracteres' }),
  document: z
    .string()
    .trim()
    .min(1, { message: 'CPF/CNPJ é obrigatório' })
    .refine((value) => cpfRegex.test(value) || cnpjRegex.test(value), {
      message: 'CPF ou CNPJ inválido',
    }),
  responsible: z
    .string()
    .trim()
    .min(1, { message: 'Nome do responsável é obrigatório' })
    .max(255, { message: 'Nome do responsável deve ter no máximo 255 caracteres' }),
  promoCode: z.preprocess(
    (value) => {
      if (typeof value === 'string' && value.trim() === '') {
        return null;
      }
      return value;
    },
    z
      .string()
      .trim()
      .max(50, { message: 'Código promocional deve ter no máximo 50 caracteres' })
      .nullable()
      .optional()
  ),
  email: z
    .string()
    .trim()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail deve ter no máximo 255 caracteres' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Telefone é obrigatório' })
    .regex(phoneRegex, { message: 'Telefone deve estar no formato (00) 00000-0000' }),
  paymentPreference: z.enum(['CARTAO', 'PIX', 'BOLETO'], {
    errorMap: () => ({ message: 'Preferência de pagamento inválida' }),
  }),
  plan: z.string().trim().min(1, { message: 'Plano é obrigatório' }),
  status: z.string().trim().min(1, { message: 'Status é obrigatório' }),
  address: z.object({
    state: z.string().trim().min(2, { message: 'UF é obrigatória' }).max(2),
    street: z
      .string()
      .trim()
      .min(1, { message: 'Rua é obrigatória' })
      .max(255, { message: 'Rua deve ter no máximo 255 caracteres' }),
    number: z
      .string()
      .trim()
      .min(1, { message: 'Número é obrigatório' })
      .max(50, { message: 'Número deve ter no máximo 50 caracteres' }),
    neighborhood: z
      .string()
      .trim()
      .min(1, { message: 'Bairro é obrigatório' })
      .max(255, { message: 'Bairro deve ter no máximo 255 caracteres' }),
    city: z
      .string()
      .trim()
      .min(1, { message: 'Cidade é obrigatória' })
      .max(255, { message: 'Cidade deve ter no máximo 255 caracteres' }),
    country: z
      .string()
      .trim()
      .min(1, { message: 'País é obrigatório' })
      .max(255, { message: 'País deve ter no máximo 255 caracteres' }),
    cep: z
      .string()
      .trim()
      .min(1, { message: 'CEP é obrigatório' })
      .regex(cepRegex, { message: 'CEP deve estar no formato 00000-000' }),
  }),
});

export type SignupRegisterFormData = z.infer<typeof signupRegisterSchema>;

/**
 * Format phone input to Brazilian pattern
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Format CPF/CNPJ input to Brazilian pattern
 */
export function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 11) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function getDocumentType(value: string): 'cpf' | 'cnpj' | 'unknown' {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return 'unknown';
  if (digits.length <= 11) return 'cpf';
  if (digits.length <= 14) return 'cnpj';
  return 'unknown';
}
