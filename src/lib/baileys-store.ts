import { proto } from '@whiskeysockets/baileys';
import { supabase } from '@/integrations/supabase/client';

const BUCKET_NAME = 'whatsapp-session';

// Função para serializar dados que contêm Buffers
const BufferJSON = {
  replacer: (_key: string, value: any) => {
    if (
      Buffer.isBuffer(value) ||
      value instanceof Uint8Array ||
      value?.type === 'Buffer'
    ) {
      return {
        type: 'Buffer',
        data: Buffer.from(value?.data || value).toString('base64'),
      };
    }
    return value;
  },
  reviver: (_key: string, value: any) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      value.type === 'Buffer'
    ) {
      return Buffer.from(value.data, 'base64');
    }
    return value;
  },
};

// Funções auxiliares para interagir com o Supabase Storage
const readData = async (file: string): Promise<any | null> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(`${file}.json`);

  if (data) {
    const text = await data.text();
    return JSON.parse(text, BufferJSON.reviver);
  } else if (error && error.message !== 'The resource was not found') {
    console.error('Erro ao ler arquivo do Supabase Storage:', error);
  }
  return null;
};

const writeData = async (data: any, file: string) => {
  try {
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(
        `${file}.json`,
        JSON.stringify(data, BufferJSON.replacer),
        {
          cacheControl: '3600',
          upsert: true,
          contentType: 'application/json',
        }
      );
  } catch (error) {
    console.error('Erro ao escrever arquivo no Supabase Storage:', error);
  }
};

/**
 * Cria um store para o Baileys que usa o Supabase Storage para persistir a sessão.
 * @param sessionId - O ID da sessão a ser gerenciada.
 */
export const useSupabaseStore = async (sessionId: string) => {
  const creds = await readData(sessionId);

  const keys = {
    get: async (type: 'app-state-sync-key' | 'pre-key' | 'session' | 'sender-key' | 'receiver-key', ids: string[]) => {
      const data: { [key: string]: any } = {};
      await Promise.all(
        ids.map(async (id) => {
          let value = await readData(`${type}-${id}`);
          if (type === 'app-state-sync-key' && value) {
            value = proto.Message.AppStateSyncKeyData.fromObject(value);
          }
          data[id] = value;
        })
      );
      return data;
    },
    set: async (data: any) => {
      for (const key in data) {
        const value = data[key];
        const id = key;
        const type = id.includes(':') ? id.split(':')[0] : id;
        await writeData(value, `${type}-${id}`);
      }
    },
  };

  return {
    state: {
      creds,
      keys,
    },
    saveCreds: () => {
      return writeData(creds, sessionId);
    },
  };
};