/**
 * Mapeamento de campos disponíveis para cada tipo de entidade no sistema
 * Estes campos representam as colunas reais no banco de dados
 */

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
}

// Campos disponíveis para leads
export const LEAD_FIELDS: FieldOption[] = [
  { value: "name", label: "Nome", description: "Nome completo do lead" },
  { value: "email", label: "Email", description: "Endereço de email" },
  { value: "phone", label: "Telefone", description: "Número de telefone" },
  { value: "company", label: "Empresa", description: "Nome da empresa" },
  { value: "document", label: "Documento", description: "CPF/CNPJ" },
  { value: "source", label: "Origem", description: "De onde veio o lead" },
  { value: "status", label: "Status", description: "Status atual do lead" },
  { value: "tags", label: "Tags", description: "Tags/categorias para classificação" },
  { value: "notes", label: "Observações", description: "Notas adicionais" },
  { value: "value", label: "Valor", description: "Valor potencial/estimado" },
  { value: "funnel", label: "Funil", description: "Funil associado" },
  { value: "stage", label: "Etapa", description: "Etapa atual no funil" },
  { value: "assignedTo", label: "Responsável", description: "Pessoa responsável" },
  { value: "address", label: "Endereço", description: "Endereço completo" },
  { value: "city", label: "Cidade", description: "Cidade" },
  { value: "state", label: "Estado", description: "Estado/UF" },
  { value: "zipCode", label: "CEP", description: "Código postal" },
  { value: "country", label: "País", description: "País" },
  { value: "website", label: "Website", description: "Site da empresa" },
  { value: "position", label: "Cargo", description: "Cargo/função" },
  { value: "industry", label: "Setor", description: "Setor/indústria" },
  { value: "companySize", label: "Tamanho da Empresa", description: "Porte da empresa" },
  { value: "annualRevenue", label: "Faturamento Anual", description: "Receita anual" },
  { value: "interest", label: "Interesse", description: "Produto/serviço de interesse" }
];

// Campos disponíveis para negócios
export const DEAL_FIELDS: FieldOption[] = [
  { value: "name", label: "Nome", description: "Nome do negócio" },
  { value: "description", label: "Descrição", description: "Descrição do negócio" },
  { value: "value", label: "Valor", description: "Valor do negócio" },
  { value: "stage", label: "Etapa", description: "Etapa atual no pipeline" },
  { value: "pipeline", label: "Pipeline", description: "Pipeline associado" },
  { value: "probability", label: "Probabilidade", description: "Chance de fechamento (%)" },
  { value: "expectedCloseDate", label: "Previsão de Fechamento", description: "Data prevista para fechamento" },
  { value: "leadId", label: "Lead Associado", description: "ID do lead relacionado" },
  { value: "companyId", label: "Empresa Associada", description: "ID da empresa relacionada" },
  { value: "contactId", label: "Contato Associado", description: "ID do contato principal" },
  { value: "assignedTo", label: "Responsável", description: "Pessoa responsável" },
  { value: "status", label: "Status", description: "Status atual (ativo, ganho, perdido)" },
  { value: "reason", label: "Motivo", description: "Motivo de ganho/perda" },
  { value: "tags", label: "Tags", description: "Tags/categorias para classificação" },
  { value: "notes", label: "Observações", description: "Notas adicionais" },
  { value: "priority", label: "Prioridade", description: "Prioridade do negócio" },
  { value: "product", label: "Produto", description: "Produto/serviço principal" }
];

// Campos disponíveis para contatos
export const CONTACT_FIELDS: FieldOption[] = [
  { value: "name", label: "Nome", description: "Nome completo do contato" },
  { value: "email", label: "Email", description: "Endereço de email" },
  { value: "phone", label: "Telefone", description: "Número de telefone" },
  { value: "mobile", label: "Celular", description: "Número de celular" },
  { value: "company", label: "Empresa", description: "Nome da empresa" },
  { value: "position", label: "Cargo", description: "Cargo/função" },
  { value: "department", label: "Departamento", description: "Departamento" },
  { value: "address", label: "Endereço", description: "Endereço completo" },
  { value: "city", label: "Cidade", description: "Cidade" },
  { value: "state", label: "Estado", description: "Estado/UF" },
  { value: "zipCode", label: "CEP", description: "Código postal" },
  { value: "country", label: "País", description: "País" },
  { value: "source", label: "Origem", description: "De onde veio o contato" },
  { value: "tags", label: "Tags", description: "Tags/categorias para classificação" },
  { value: "notes", label: "Observações", description: "Notas adicionais" },
  { value: "assignedTo", label: "Responsável", description: "Pessoa responsável" },
  { value: "birthday", label: "Aniversário", description: "Data de nascimento" },
  { value: "linkedin", label: "LinkedIn", description: "Perfil no LinkedIn" }
];

// Campos disponíveis para empresas
export const COMPANY_FIELDS: FieldOption[] = [
  { value: "name", label: "Nome", description: "Nome da empresa" },
  { value: "tradingName", label: "Nome Fantasia", description: "Nome fantasia/comercial" },
  { value: "document", label: "CNPJ", description: "CNPJ da empresa" },
  { value: "industry", label: "Setor", description: "Setor/indústria" },
  { value: "website", label: "Website", description: "Site da empresa" },
  { value: "email", label: "Email", description: "Email de contato principal" },
  { value: "phone", label: "Telefone", description: "Telefone principal" },
  { value: "address", label: "Endereço", description: "Endereço completo" },
  { value: "city", label: "Cidade", description: "Cidade" },
  { value: "state", label: "Estado", description: "Estado/UF" },
  { value: "zipCode", label: "CEP", description: "Código postal" },
  { value: "country", label: "País", description: "País" },
  { value: "size", label: "Tamanho", description: "Número de funcionários" },
  { value: "annualRevenue", label: "Faturamento Anual", description: "Receita anual" },
  { value: "description", label: "Descrição", description: "Descrição da empresa" },
  { value: "tags", label: "Tags", description: "Tags/categorias para classificação" },
  { value: "notes", label: "Observações", description: "Notas adicionais" },
  { value: "foundedYear", label: "Ano de Fundação", description: "Ano de fundação" },
  { value: "linkedin", label: "LinkedIn", description: "Perfil no LinkedIn" }
];

/**
 * Obtém a lista de campos disponíveis para uma entidade específica
 */
export function getFieldsForEntityType(entityType: 'lead' | 'deal' | 'contact' | 'company'): FieldOption[] {
  switch (entityType) {
    case 'lead':
      return LEAD_FIELDS;
    case 'deal':
      return DEAL_FIELDS;
    case 'contact':
      return CONTACT_FIELDS;
    case 'company':
      return COMPANY_FIELDS;
    default:
      return [];
  }
}