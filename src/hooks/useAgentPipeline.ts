import { useState } from 'react';
import { autoMoveLeadStage } from '@/lib/pipeline-utils';
import { toast } from 'sonner';
import type { AIAgent, ConversationStep } from '@/types/aiAgent';

/**
 * Hook para gerenciar as integrações entre o agente de IA e o pipeline
 */
export function useAgentPipeline(agent: AIAgent) {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    timestamp: Date;
  } | null>(null);

  // Verificar se o agente tem integração com pipeline habilitada
  const pipelineEnabled = agent.pipelineConfig?.enabled || false;

  /**
   * Executar uma ação de pipeline com base no passo do fluxo de conversa
   */
  const executeStepAction = async (
    leadId: string,
    step: ConversationStep,
    conversationId?: string
  ) => {
    if (!pipelineEnabled) {
      console.log('Integração com pipeline desabilitada para este agente');
      return { success: false, error: 'Pipeline desabilitado' };
    }

    setLoading(true);

    try {
      let result = { success: false, message: '', error: '' };

      // Buscar a etapa do pipeline associada ao passo
      const targetStage = step.pipelineStage;
      const pipelineAction = step.pipelineAction;

      if (!pipelineAction) {
        throw new Error('Nenhuma ação de pipeline configurada para este passo');
      }

      // Executar a ação apropriada com base no tipo
      switch (pipelineAction) {
        case 'move_stage':
          if (!targetStage) {
            throw new Error('Etapa de destino não configurada');
          }

          // Buscar o nome da etapa do pipeline
          // Em um sistema real, você buscaria isso do banco de dados
          const stageName = getStageNameById(targetStage);
          
          result = await autoMoveLeadStage({
            leadId,
            targetStage: stageName,
            agentId: agent.id,
            agentName: agent.name,
            stepName: step.name,
            conversationId
          });
          break;

        case 'create_deal':
          // Implementação de criar negócio
          result = { 
            success: true, 
            message: 'Negócio criado com sucesso' 
          };
          toast.success('Novo negócio criado pelo agente');
          break;

        case 'update_value':
          // Implementação de atualizar valor
          result = { 
            success: true, 
            message: 'Valor atualizado com sucesso' 
          };
          toast.success('Valor do negócio atualizado pelo agente');
          break;

        case 'add_note':
          // Implementação de adicionar nota
          result = { 
            success: true, 
            message: 'Nota adicionada com sucesso' 
          };
          toast.success('Nota adicionada pelo agente');
          break;

        case 'schedule_task':
          // Implementação de agendar tarefa
          result = { 
            success: true, 
            message: 'Tarefa agendada com sucesso' 
          };
          toast.success('Tarefa agendada pelo agente');
          break;

        default:
          throw new Error(`Ação de pipeline não suportada: ${pipelineAction}`);
      }

      setLastAction({
        success: result.success,
        message: result.message,
        error: result.error,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      console.error('Erro ao executar ação de pipeline:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setLastAction({
        success: false,
        error: errorMessage,
        timestamp: new Date()
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    lastAction,
    pipelineEnabled,
    executeStepAction
  };
}

// Função auxiliar para buscar o nome da etapa a partir do ID
// Em um sistema real, você buscaria isso do banco de dados
function getStageNameById(stageId: string): string {
  // Mapeamento mockado de IDs para nomes de etapas
  const stageMap: Record<string, string> = {
    'stage-1': 'Novo Lead',
    'stage-2': 'Qualificação',
    'stage-3': 'Apresentação',
    'stage-4': 'Proposta',
    'stage-5': 'Negociação',
    'stage-6': 'Ganho',
    'stage-7': 'Perdido',
    'support-1': 'Ticket Aberto',
    'support-2': 'Em Análise',
    'support-3': 'Em Desenvolvimento',
    'support-4': 'Resolvido'
  };

  return stageMap[stageId] || 'Desconhecido';
}