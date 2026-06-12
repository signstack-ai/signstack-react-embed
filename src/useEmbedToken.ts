import { useCallback, useState } from 'react';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export type ComponentKey =
  | 'builder'
  | 'workflow'
  | 'participant';

export interface EmbedTokenRequest {
  component: ComponentKey;
  workflowId?: string;
  stepKey?: string;
  resourceKey?: string;
  resourceKind?: string;
  version?: string;
}

export interface EmbedTokenResponse {
  embedToken: string;
  orgId: string;
  expiresIn: number;
  expiresAt: string;
  scopes: string[];
}

interface Status {
  message: string;
  error: boolean;
}

export function useEmbedToken() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ message: '', error: false });
  const [loading, setLoading] = useState(false);

  const mint = useCallback(async (body: EmbedTokenRequest): Promise<EmbedTokenResponse> => {
    setLoading(true);
    setStatus({ message: 'Minting embed token…', error: false });
    setToken(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/embed-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allowedOrigins: [window.location.origin],
          ...body,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend ${res.status}: ${text}`);
      }
      const data = (await res.json()) as EmbedTokenResponse;
      setToken(data.embedToken);
      setStatus({ message: 'Token minted', error: false });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus({ message, error: true });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setStatus({ message: '', error: false });
  }, []);

  return { token, status, loading, mint, reset };
}
