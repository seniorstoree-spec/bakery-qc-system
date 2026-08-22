import { INITIAL_USERS } from '../data/initialData';
import { AdminConfig, AppSectionConfig, ManagedUser } from './adminTypes';
import { supabase } from '../lib/supabase';

const DEFAULT_SECTIONS: AppSectionConfig[] = [
  { id: 'dashboard', label: 'لوحة التحكم', visible: true },
  { id: 'ipc', label: 'مراقبة العمليات', visible: true },
  { id: 'defects', label: 'سجل العيوب', visible: true },
  { id: 'weights_temp', label: 'الأوزان والحرارة', visible: true },
  { id: 'ccp_oprp', label: 'CCP / OPRP', visible: true },
  { id: 'sensory_food_safety', label: 'التقييم الحسي وسلامة الغذاء', visible: true },
  { id: 'product_release', label: 'الإفراج عن المنتج', visible: true },
];

const ROLE_MAP: Record<string, ManagedUser['position']> = {
  quality_engineer: 'quality_engineer',
  quality_manager: 'department_head',
  production_supervisor: 'quality_supervisor',
  system_admin: 'department_head',
};

const DEFAULT_USERS: ManagedUser[] = INITIAL_USERS.map((user) => ({
  ...user,
  position: ROLE_MAP[user.role] ?? 'quality_engineer',
  enabled: true,
}));

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  users: DEFAULT_USERS,
  sections: DEFAULT_SECTIONS,
  appearance: { primaryColor: '#e11d48', accentColor: '#4f46e5', fontFamily: 'system-ui' },
  content: {
    appTitle: 'منظومة الجودة وقسم المخبوزات',
    appSubtitle: 'نظام الرقابة اللحظية ونقاط التحكم الحرجة (HACCP & IPC)',
    liveLabel: 'مباشر',
  },
};

export const ADMIN_CONFIG_STATE_KEY = 'admin_config_v1';
export const ADMIN_CONFIG_LOCAL_KEY = 'bakery_qc_admin_config_v1';

function normalizeAdminConfig(data: Partial<AdminConfig> | null | undefined): AdminConfig {
  return {
    ...DEFAULT_ADMIN_CONFIG,
    ...(data ?? {}),
    users: Array.isArray(data?.users) ? data!.users : DEFAULT_ADMIN_CONFIG.users,
    sections: Array.isArray(data?.sections) ? data!.sections : DEFAULT_ADMIN_CONFIG.sections,
    appearance: { ...DEFAULT_ADMIN_CONFIG.appearance, ...(data?.appearance ?? {}) },
    content: { ...DEFAULT_ADMIN_CONFIG.content, ...(data?.content ?? {}) },
  };
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function roleFromManagedUser(user: ManagedUser): string {
  if (user.position === 'department_head') return 'quality_manager';
  if (user.position === 'quality_supervisor') return 'production_supervisor';
  if (user.position === 'senior_quality') return 'senior_quality';
  return 'quality_engineer';
}

async function syncUsersToSupabase(users: ManagedUser[]): Promise<void> {
  const { data: existingUsers, error: readError } = await supabase
    .from('users')
    .select('id,name,username,position,role,permissions,active');

  if (readError) throw new Error(`تعذر قراءة المستخدمين من قاعدة البيانات: ${readError.message}`);

  const existing = (existingUsers ?? []).map((user) => ({
    id: String(user.id),
    name: String(user.name ?? '').trim(),
    username: String(user.username ?? ''),
  }));

  const byId = new Map(existing.map((user) => [user.id, user]));
  const byUsername = new Map(existing.map((user) => [user.username, user]));
  const byName = new Map(existing.filter((user) => user.name).map((user) => [user.name, user]));

  const usedDbIds = new Set<string>();

  const rows = users.map((user) => {
    const stableUsername = `managed_${user.id}`;
    const matched =
      (isUuid(user.id) ? byId.get(user.id) : undefined) ??
      byUsername.get(stableUsername) ??
      byName.get(user.name.trim());

    const dbId = matched?.id ?? (isUuid(user.id) ? user.id : undefined);
    if (dbId) usedDbIds.add(dbId);

    return {
      ...(dbId ? { id: dbId } : {}),
      name: user.name.trim(),
      username: matched?.username || stableUsername,
      position: user.title?.trim() || 'مستخدم جودة',
      role: roleFromManagedUser(user),
      permissions: user.permissions ?? {},
      active: Boolean(user.enabled),
      updated_at: new Date().toISOString(),
    };
  });

  if (!rows.length) return;

  const { error: upsertError } = await supabase
    .from('users')
    .upsert(rows, { onConflict: 'id' });

  if (upsertError) throw new Error(`تعذر حفظ تعديلات المستخدمين في قاعدة البيانات: ${upsertError.message}`);
}

export function loadAdminConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG_LOCAL_KEY);
    if (!raw) return DEFAULT_ADMIN_CONFIG;
    return normalizeAdminConfig(JSON.parse(raw) as Partial<AdminConfig>);
  } catch {
    return DEFAULT_ADMIN_CONFIG;
  }
}

/**
 * Persist developer configuration locally and centrally.
 * Every save also upserts the current managed users into public.users so edits
 * to names, titles, roles, permissions, and active state are reflected in Supabase.
 */
export async function saveAdminConfig(config: AdminConfig): Promise<AdminConfig> {
  const normalized = normalizeAdminConfig(config);
  const serialized = JSON.stringify(normalized);

  localStorage.setItem(ADMIN_CONFIG_LOCAL_KEY, serialized);

  const { error } = await supabase
    .from('app_state_store')
    .upsert(
      {
        state_key: ADMIN_CONFIG_STATE_KEY,
        state_data: normalized,
        updated_by: 'developer',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'state_key' },
    );

  if (error) {
    throw new Error(`تعذر حفظ إعدادات المستخدمين في قاعدة البيانات: ${error.message}`);
  }

  await syncUsersToSupabase(normalized.users);

  const { data, error: verifyError } = await supabase
    .from('app_state_store')
    .select('state_data')
    .eq('state_key', ADMIN_CONFIG_STATE_KEY)
    .maybeSingle<{ state_data: AdminConfig }>();

  if (verifyError) {
    throw new Error(`تم الحفظ لكن تعذر التحقق من البيانات: ${verifyError.message}`);
  }

  const verified = normalizeAdminConfig(data?.state_data);
  localStorage.setItem(ADMIN_CONFIG_LOCAL_KEY, JSON.stringify(verified));
  return verified;
}

export async function syncAdminConfigFromSupabase(): Promise<AdminConfig | null> {
  try {
    const { data, error } = await supabase
      .from('app_state_store')
      .select('state_data')
      .eq('state_key', ADMIN_CONFIG_STATE_KEY)
      .maybeSingle<{ state_data: AdminConfig }>();

    if (error) {
      console.warn('Admin config remote read failed:', error.message);
      return null;
    }

    if (!data?.state_data) return null;

    const merged = normalizeAdminConfig(data.state_data);
    localStorage.setItem(ADMIN_CONFIG_LOCAL_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return null;
  }
}
