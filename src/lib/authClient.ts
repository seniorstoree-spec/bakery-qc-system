const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const sessionKey = 'bakery_qc_session';

export const authConfigured = Boolean(url && key);

export function getSession(): any | null {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || 'null');
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(sessionKey);
}

async function request(path: string, body: unknown) {
  if (!url || !key) throw new Error('Supabase environment variables are missing.');
  const response = await fetch(`${url}/auth/v1${path}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.msg || data?.message || data?.error_description || 'تعذر تسجيل الدخول.');
  }
  localStorage.setItem(sessionKey, JSON.stringify(data));
  return data;
}

export function developerLogin(email: string, secret: string) {
  return request('/token?grant_type=password', { email, password: secret });
}

// Supabase anonymous sign-in creates a real authenticated anonymous user.
export function userLogin() {
  return request('/signup', {});
}

export async function ensureAppUser(session: any) {
  if (!url || !key || !session?.access_token || !session?.user?.id) return;
  const user = session.user;
  const isAnonymous = Boolean(user.is_anonymous);
  const body = {
    auth_user_id: user.id,
    name: isAnonymous ? 'مستخدم مجهول' : (user.user_metadata?.name || user.email || 'مستخدم'),
    email: isAnonymous ? null : (user.email || null),
    position: isAnonymous ? 'مستخدم' : 'مستخدم النظام',
    is_active: true,
  };

  const response = await fetch(`${url}/rest/v1/app_users`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok && response.status !== 409) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || data?.details || 'تعذر إنشاء ملف المستخدم.');
  }
}
