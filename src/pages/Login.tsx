import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Rocket } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';

export default function Login() {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Rocket className="w-8 h-8" />
            <span>Space Sales</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Faça login para acessar seu painel.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
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
                  button_label: 'Cadastrar',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
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