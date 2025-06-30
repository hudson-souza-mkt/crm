import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ATENÇÃO: Substitua esta URL pela URL real da sua instância da Evolution API
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL') || 'https://api.evolution-api.com/v1/messages/send';
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY') || 'YOUR_EVOLUTION_API_KEY';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { conversation_id, content } = await req.json();

    if (!conversation_id || !content) {
      return new Response(JSON.stringify({ error: 'conversation_id e content são obrigatórios' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Inicializa o cliente Supabase com permissões de serviço
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Insere a mensagem do usuário no banco
    const { error: userMessageError } = await supabaseAdmin
      .from('messages')
      .insert({ conversation_id, content, sender: 'user' });

    if (userMessageError) throw userMessageError;

    // 2. (Simulação) Chama a Evolution API
    // Em um cenário real, você faria a chamada aqui.
    // const evolutionResponse = await fetch(EVOLUTION_API_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'apikey': EVOLUTION_API_KEY,
    //   },
    //   body: JSON.stringify({ number: "SENDER_PHONE_NUMBER", textMessage: { text: content } }),
    // });
    // if (!evolutionResponse.ok) {
    //   throw new Error('Falha ao chamar a Evolution API');
    // }
    // const evolutionData = await evolutionResponse.json();
    // const botResponseContent = evolutionData.message;

    // Resposta simulada do bot
    const botResponseContent = `Esta é uma resposta simulada para: "${content}"`;
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula a latência da API

    // 3. Insere a resposta do bot no banco
    const { error: botMessageError } = await supabaseAdmin
      .from('messages')
      .insert({ conversation_id, content: botResponseContent, sender: 'bot' });

    if (botMessageError) throw botMessageError;

    return new Response(JSON.stringify({ success: true }), {
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