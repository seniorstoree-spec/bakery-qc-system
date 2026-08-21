const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const backendConfigured = Boolean(baseUrl && apiKey);

export async function backendRequest(path: string, options: RequestInit = {}) {
  if (!backendConfigured) throw new Error('Backend is not configured.');
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      apikey: apiKey!,
      Authorization: `Bearer ${apiKey!}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.details || 'Backend request failed.');
  return data;
}
