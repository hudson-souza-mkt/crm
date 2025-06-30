import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, QrCode } from 'lucide-react';
import QRCode from 'qrcode.react';
import { toast } from 'sonner';

type ConnectionStatus = 'idle' | 'loading' | 'qr' | 'connected' | 'error';

export default function Whatsapp() {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    setStatus('loading');
    setQrCode(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/whatsapp-connect');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao conectar.');
      }

      if (data.qr) {
        setQrCode(data.qr);
        setStatus('qr');
      } else if (data.connected) {
        setStatus('connected');
        toast.success('WhatsApp conectado com sucesso!');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Ocorreu um erro desconhecido.');
      toast.error(error.message || 'Ocorreu um erro desconhecido.');
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold">Conectando ao WhatsApp...</p>
            <p className="text-sm text-muted-foreground">Aguarde, isso pode levar alguns segundos.</p>
          </div>
        );
      case 'qr':
        return (
          <div className="flex flex-col items-center text-center">
            <p className="font-semibold mb-4">Escaneie o QR Code</p>
            <div className="p-4 border rounded-lg bg-white">
              {qrCode && <QRCode value={qrCode} size={256} />}
            </div>
            <p className="text-sm text-muted-foreground mt-4">Abra o WhatsApp no seu celular e escaneie o código.</p>
          </div>
        );
      case 'connected':
        return (
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="font-semibold">Conectado!</p>
            <p className="text-sm text-muted-foreground">Sua sessão do WhatsApp está ativa.</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center text-center">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="font-semibold">Erro na Conexão</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button onClick={handleConnect} className="mt-4">Tentar Novamente</Button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center text-center">
            <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-semibold">Conecte sua conta do WhatsApp</p>
            <p className="text-sm text-muted-foreground">Clique no botão abaixo para gerar um QR Code e iniciar a sessão.</p>
            <Button onClick={handleConnect} className="mt-4">Conectar ao WhatsApp</Button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Conexão WhatsApp</h1>
      <Card className="max-w-lg mx-auto w-full">
        <CardHeader>
          <CardTitle>Status da Conexão</CardTitle>
          <CardDescription>Gerencie sua sessão do WhatsApp para automações e atendimentos.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8 min-h-[350px]">
          {renderStatus()}
        </CardContent>
      </Card>
    </div>
  );
}