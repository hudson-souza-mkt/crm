import type { VercelRequest, VercelResponse } from '@vercel/node';
import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import { useSupabaseStore } from '../src/lib/baileys-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Garante que o bucket 'whatsapp-session' seja público no Supabase para funcionar.
    const sessionId = 'wa-session';
    const { state, saveCreds } = await useSupabaseStore(sessionId);

    const socket = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Lasy AI', 'Chrome', '1.0.0'],
    });

    socket.ev.on('creds.update', saveCreds);

    // Retorna uma promessa que resolve quando a conexão é estabelecida ou um QR code é gerado.
    return new Promise<void>((resolve) => {
        // Timeout para a função serverless não rodar indefinidamente.
        const timeout = setTimeout(() => {
            socket.end(new Error('Connection timed out'));
            res.status(408).json({ error: 'Tempo de conexão esgotado.' });
            resolve();
        }, 28000); // 28 segundos

        socket.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                clearTimeout(timeout);
                res.status(200).json({ qr });
                resolve();
            }

            if (connection === 'close') {
                clearTimeout(timeout);
                const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
                if (statusCode !== DisconnectReason.loggedOut) {
                    res.status(500).json({ error: 'Conexão fechada inesperadamente.' });
                } else {
                    res.status(401).json({ error: 'Usuário desconectado.' });
                }
                resolve();
            }

            if (connection === 'open') {
                clearTimeout(timeout);
                res.status(200).json({ connected: true });
                resolve();
            }
        });
    });
}