**: Criar o componente de login.
3.  **<lasy-write path="src/App.tsx">**: Modificar para incluir a lógica de autenticação e a nova rota.

Vou garantir que o `supabaseClient` seja importado corretamente em ambos os arquivos.
O `supabaseClient` está em `src/integrations/supabase/client.ts`. O import será `import { supabase } from "@/integrations/supabase/client";`.

O usuário não pediu para criar a tabela de perfis, então vou pular essa parte por enquanto e focar apenas na autenticação. O Supabase gerencia os usuários na tabela `auth.users` automaticamente.
</think>
Claro! Vou configurar a autenticação no seu aplicativo usando o Supabase.

Primeiro, vou adicionar as dependências necessárias para a interface de autenticação.

<lasy-add-dependency packages="@supabase/auth-ui-react @supabase/auth-ui-shared"></lasy-add-dependency>

Agora, vou criar a página de login e ajustar o arquivo principal do aplicativo para gerenciar a sessão do usuário e proteger as rotas.

Aqui estão os arquivos que vou criar e modificar:

1.  **`src/pages/Login.tsx`**: Uma nova página para o formulário de login.
2.  **`src/App.tsx`**: Atualizado para verificar se o usuário está logado. Se não estiver, ele será redirecionado para a página de login.

<lasy-write path="src/pages/Login.tsx" description="Criando a página de login com o formulário de autenticação do Supabase.">
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Rocket } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Rocket className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-3xl font-bold text-primary mt-4">Space Sales</h1>
          <p className="text-muted-foreground">Faça login para continuar</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Seu email',
                  password_label: 'Sua senha',
                  button_label: 'Entrar',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Seu email',
                  password_label: 'Sua senha',
                  button_label: 'Registrar',
                  social_provider_text: 'Registrar com {{provider}}',
                  link_text: 'Não tem uma conta? Registre-se',
                },
                forgotten_password: {
                  email_label: 'Seu email',
                  button_label: 'Enviar instruções',
                  link_text: 'Esqueceu sua senha?',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}