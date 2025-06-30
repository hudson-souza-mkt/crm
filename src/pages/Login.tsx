import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-ui-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Rocket } from 'lucide-react';

export default function Login() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Rocket className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-3xl font-bold text-primary mt-4">Space Sales</h1>
          <p className="text-muted-foreground mt-2">
            Faça login para acessar seu painel.
          </p>
        </div>
        <div className="p-8 bg-white rounded-lg shadow-md border">
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