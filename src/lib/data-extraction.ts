import { DataExtractionConfig, DataExtractionField } from "@/types/aiAgent";
import { toast } from "sonner";

/**
 * Interface para os dados extraídos de uma conversa
 */
export interface ExtractedData {
  [key: string]: {
    value: string;
    confidence: number;
    source: string;
    extractedAt: Date;
    validated: boolean;
  };
}

/**
 * Extrai dados de uma mensagem com base na configuração de extração
 */
export function extractDataFromMessage(
  message: string, 
  config: DataExtractionConfig
): ExtractedData | null {
  if (!config.enabled || !config.fields || config.fields.length === 0) {
    return null;
  }

  const extractedData: ExtractedData = {};
  let hasExtracted = false;

  // Verificar cada campo configurado
  config.fields.forEach(field => {
    const extracted = extractFieldFromMessage(message, field);
    if (extracted) {
      extractedData[field.key] = {
        value: extracted.value,
        confidence: extracted.confidence,
        source: message,
        extractedAt: new Date(),
        validated: validateField(extracted.value, field)
      };
      hasExtracted = true;
    }
  });

  return hasExtracted ? extractedData : null;
}

/**
 * Extrai um campo específico de uma mensagem
 */
function extractFieldFromMessage(
  message: string, 
  field: DataExtractionField
): { value: string; confidence: number } | null {
  // Limpar e normalizar a mensagem
  const normalizedMessage = message.toLowerCase().trim();
  
  // Verificar cada padrão de extração
  for (const pattern of field.extractionPatterns) {
    const extracted = extractFromPattern(normalizedMessage, pattern);
    if (extracted) {
      return {
        value: extracted,
        confidence: 0.9 // Poderíamos implementar uma lógica mais complexa de confiança
      };
    }
  }

  // Não encontrou nenhum padrão
  return null;
}

/**
 * Extrai valor de um padrão específico
 */
function extractFromPattern(message: string, pattern: string): string | null {
  // Transformar o padrão em uma expressão regular
  // Substituir {valor} por um grupo de captura
  const escapedPattern = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escapar caracteres especiais
    .replace('{valor}', '(.+?)');
  
  // Criar regex para encontrar o padrão na mensagem
  // Usamos 'i' para tornar case-insensitive
  const regex = new RegExp(escapedPattern, 'i');
  
  // Tentar encontrar uma correspondência
  const match = message.match(regex);
  
  // Se encontrou, retornar o valor capturado
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}

/**
 * Valida um valor extraído contra as regras do campo
 */
function validateField(value: string, field: DataExtractionField): boolean {
  // Se não há regra de validação, consideramos válido
  if (!field.validationRule) {
    return true;
  }

  try {
    const regex = new RegExp(field.validationRule);
    return regex.test(value);
  } catch (error) {
    console.error(`Erro na validação de ${field.name}:`, error);
    return false;
  }
}

/**
 * Atualiza um lead com dados extraídos
 * Em um sistema real, isso atualizaria o banco de dados
 */
export async function updateLeadWithExtractedData(
  leadId: string,
  data: ExtractedData,
  confirmFirst: boolean = true
): Promise<boolean> {
  console.log(`Atualizando lead ${leadId} com dados extraídos:`, data);
  
  try {
    // Se precisamos confirmar primeiro
    if (confirmFirst) {
      // Em um caso real, enviaria uma mensagem para o usuário confirmar
      // antes de atualizar
      console.log('Esperando confirmação do usuário antes de atualizar...');
    }
    
    // Simula atualização no banco de dados
    // Em um sistema real, faria algo como:
    // await supabase.from('leads').update({...}).eq('id', leadId);
    
    // Mostrar notificação de sucesso
    toast.success('Dados do lead atualizados automaticamente!');
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    toast.error('Erro ao atualizar dados do lead');
    return false;
  }
}

/**
 * Gera uma solicitação de informação faltante
 */
export function generateMissingFieldPrompt(field: DataExtractionField): string {
  // Se o campo tem um prompt personalizado, use-o
  if (field.defaultPrompt) {
    return field.defaultPrompt;
  }
  
  // Caso contrário, gere um prompt padrão
  return `Poderia me informar ${field.name.toLowerCase()}? Essa informação nos ajudará a ${getFieldPurpose(field)}.`;
}

/**
 * Gera um texto de propósito para cada tipo de campo
 */
function getFieldPurpose(field: DataExtractionField): string {
  const purposes: Record<string, string> = {
    name: "personalizar seu atendimento",
    nome: "personalizar seu atendimento",
    email: "enviar informações relevantes",
    telefone: "entrar em contato caso necessário",
    phone: "entrar em contato caso necessário",
    empresa: "entender melhor seu contexto",
    company: "entender melhor seu contexto",
    produto_interesse: "recomendar as melhores soluções",
    interesse: "entender melhor suas necessidades",
    cargo: "oferecer informações mais relevantes para sua função"
  };
  
  // Buscar propósito pelo nome ou chave do campo
  return purposes[field.key] || 
         purposes[field.name.toLowerCase()] || 
         "atendê-lo melhor";
}

/**
 * Processa a conversa para extrair e atualizar dados
 */
export function processConversationForDataExtraction(
  message: string,
  config: DataExtractionConfig,
  leadId: string
): { 
  extractedData: ExtractedData | null; 
  missingFields: DataExtractionField[];
  shouldUpdateLead: boolean;
} {
  // Extrair dados da mensagem
  const extractedData = extractDataFromMessage(message, config);
  
  // Se não encontrou nada ou extração não está habilitada
  if (!extractedData || !config.enabled) {
    return { 
      extractedData: null, 
      missingFields: [],
      shouldUpdateLead: false
    };
  }
  
  // Verificar campos obrigatórios faltantes
  const missingFields = config.fields
    .filter(field => field.required && !extractedData[field.key])
    .filter(field => config.requestMissingFields);
  
  // Decidir se deve atualizar o lead
  const shouldUpdateLead = config.autoUpdate && 
                          Object.keys(extractedData).length > 0 &&
                          !!leadId;
  
  // Se deve atualizar e não precisa confirmar, atualiza agora
  if (shouldUpdateLead && !config.confirmBeforeUpdate) {
    updateLeadWithExtractedData(leadId, extractedData, false)
      .catch(error => console.error('Erro ao atualizar lead:', error));
  }
  
  return {
    extractedData,
    missingFields,
    shouldUpdateLead: shouldUpdateLead && config.confirmBeforeUpdate
  };
}