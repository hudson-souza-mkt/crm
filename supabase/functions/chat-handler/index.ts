import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Carrega as variáveis de ambiente da Evolution API
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL');
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY');
const EVOLUTION_INSTANCE = Deno.env.get('EVOLUTION_INSTANCE');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Valida se as variáveis de ambiente da Evolution estão configuradas
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
      throw new Error('As variáveis de ambiente da Evolution API não estão configuradas no Supabase.');
    }

    const { conversation_id, content } = await req.json();

    if (!conversation_id || !content) {
      return new Response(JSON.stringify({ error: 'conversation_id e content são obrigatórios' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Busca o ID do lead associado à conversa
    const { data: convData, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('lead_id')
      .eq('id', conversation_id)
      .single();

    if (convError || !convData?.lead_id) {
      throw new Error('Conversa não encontrada ou não associada a um lead.');
    }

    // 2. Busca o número de telefone do lead
    const { data: leadData, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('phone')
      .eq('id', convData.lead_id)
      .single();

    if (leadError || !leadData?.phone) {
      throw new Error('Lead não encontrado ou sem número de telefone.');
    }
    
    const leadPhoneNumber = leadData.phone;

    // 3. Insere a mensagem do usuário no banco de dados
    const { error: userMessageError } = await supabaseAdmin
      .from('messages')
      .insert({ conversation_id, content, sender: 'user' });

    if (userMessageError) throw userMessageError;

    // 4. Envia a mensagem através da Evolution API
    const evolutionEndpoint = `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`;
    
    const evolutionResponse = await fetch(evolutionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: leadPhoneNumber,
        options: {
          delay: 1200,
          presence: "composing"
        },
        textMessage: {
          text: content
        }
      }),
    });

    if (!evolutionResponse.ok) {
      const errorBody = await evolutionResponse.text();
      console.error('Erro da Evolution API:', errorBody);
      throw new Error(`Falha ao enviar mensagem pela Evolution API: ${evolutionResponse.statusText}`);
    }

    // A resposta do bot virá através de um webhook, então não a simulamos mais aqui.
    // Apenas retornamos sucesso indicando que a mensagem foi enviada.
    return new Response(JSON.stringify({ success: true, message: "Mensagem enviada." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erro na função chat-handler:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})