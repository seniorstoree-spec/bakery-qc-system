const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const SESSION_KEY = "lab_qc_auth_session_v1";

export type LabSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  token_type?: string;
  user: { id: string; email?: string };
};

function config() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("إعدادات قاعدة بيانات المعمل غير مكتملة. راجع إعدادات النشر.");
  }
  return { url: SUPABASE_URL.replace(/\/$/, ""), key: SUPABASE_KEY };
}

function saveSession(session: LabSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearLabSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function signInLabUser(email: string, password: string): Promise<LabSession> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || "تعذر تسجيل الدخول. راجع البريد الإلكتروني وكلمة المرور.");
  const session: LabSession = {
    ...result,
    expires_at: result.expires_at || Math.floor(Date.now() / 1000) + Number(result.expires_in || 3600),
  };
  saveSession(session);
  return session;
}

export async function signUpLabUser(email: string, password: string): Promise<LabSession | null> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || "تعذر إنشاء الحساب.");
  if (!result.access_token || !result.refresh_token || !result.user?.id) return null;
  const session: LabSession = {
    ...result,
    expires_at: result.expires_at || Math.floor(Date.now() / 1000) + Number(result.expires_in || 3600),
  };
  saveSession(session);
  return session;
}

export async function getCurrentSession(): Promise<LabSession | null> {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  let session: LabSession;
  try {
    session = JSON.parse(raw) as LabSession;
  } catch {
    clearLabSession();
    return null;
  }
  if (!session.access_token || !session.refresh_token || !session.user?.id) {
    clearLabSession();
    return null;
  }
  if (session.expires_at && session.expires_at > Math.floor(Date.now() / 1000) + 60) return session;

  try {
    const { url, key } = config();
    const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    const result = await response.json();
    if (!response.ok || !result.access_token || !result.refresh_token || !result.user?.id) {
      clearLabSession();
      return null;
    }
    const refreshed: LabSession = {
      ...result,
      expires_at: result.expires_at || Math.floor(Date.now() / 1000) + Number(result.expires_in || 3600),
    };
    saveSession(refreshed);
    return refreshed;
  } catch {
    return null;
  }
}

export async function signOutLabUser() {
  const { url, key } = config();
  const session = await getCurrentSession();
  try {
    if (session) {
      await fetch(`${url}/auth/v1/logout`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${session.access_token}` },
      });
    }
  } finally {
    clearLabSession();
  }
}

export async function loadLabState(session: LabSession): Promise<Record<string, any> | null> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/lab_qc_state?id=eq.shared&select=data`, {
    headers: { apikey: key, Authorization: `Bearer ${session.access_token}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase read failed (${response.status}): ${await response.text()}`);
  const rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0].data as Record<string, any> : null;
}

export async function saveLabState(session: LabSession, data: Record<string, unknown>): Promise<void> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/lab_qc_state?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: "shared",
      data,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error(`Supabase save failed (${response.status}): ${await response.text()}`);
}
