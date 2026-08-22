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

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function roleFromManagedUser(user: ManagedUser): string {
  if (user.position === 'department_head') return 'quality_manager';
  if (user.position === 'quality_supervisor') return 'production_supervisor';
  if (user.position === 'senior_quality') return 'senior_quality';
  return 'quality_engineer';
}

function createStableUuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

async function readSupabaseUsers(): Promise<Array<{ id: string; name: string; username: string; position: string; role: string; active: boolean }>> {
  const { data, error } = await supabase
    .from('users')
    .select('id,name,username,position,role,active');

  if (error) throw new Error(`تعذر قراءة المستخدمين من قاعدة البيانات: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ''),
    username: String(row.username ?? ''),
    position: String(row.position ?? ''),
    role: String(row.role ?? ''),
    active: Boolean(row.active),
  }));
}

function enrichWithStableSupabaseIds(users: ManagedUser[], remoteUsers: Array<{ id: string; name: string }>): ManagedUser[] {
  const byName = new Map(remoteUsers.map((u) => [u.name.trim(), u.id]));
  return users.map((user) => {
    if (isUuid(user.supabaseId)) return user;
    if (isUuid(user.id)) return { ...user, supabaseId: user.id };
    const matchedId = byName.get(user.name.trim());
    return matchedId ? { ...user, supabaseId: matchedId } : user;
  });
}

async function syncUsersToSupabase(users: ManagedUser[]): Promise<ManagedUser[]> {
  const existingUsers = await readSupabaseUsers();
  const byId = new Map(existingUsers.map((u) => [u.id, u]));
  const byName = new Map(existingUsers.map((u) => [u.name.trim(), u]));
  const syncedUsers: ManagedUser[] = [];
  const retainedIds = new Set<string>();

  for (const user of users) {
    const existing = isUuid(user.supabaseId)
      ? byId.get(user.supabaseId)
      : (isUuid(user.id) ? byId.get(user.id) : byName.get(user.name.trim()));

    const stableId = existing?.id ?? createStableUuid();
    const username = existing?.username ?? `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const row = {
      id: stableId,
      name: user.name.trim(),
      username,
      position: user.title?.trim() || 'مستخدم جودة',
      role: roleFromManagedUser(user),
      permissions: user.permissions ?? {},
      active: Boolean(user.enabled),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('users').upsert(row, { onConflict: 'id' });
    if (error) throw new Error(`تعذر حفظ المستخدم "${user.name}" في قاعدة البيانات: ${error.message}`);

    retainedIds.add(stableId);
    syncedUsers.push({ ...user, supabaseId: stableId });
  }

  const idsToDelete = existingUsers
    .filter((remote) => {
      if (retainedIds.has(remote.id)) return false;
      const isDeveloper = remote.role.toLowerCase() === 'developer' || remote.username.toLowerCase() === 'eslamkamel.emk@gmail.com';
      const looksManaged = remote.username.toLowerCase().startsWith('user_');
      return !isDeveloper && looksManaged && isUuid(remote.id);
    })
    .map((remote) => remote.id);

  if (idsToDelete.length) {
    const { error: deleteError } = await supabase.from('users').delete().in('id', idsToDelete);
    if (deleteError) throw new Error(`تعذر حذف المستخدمين من قاعدة البيانات: ${deleteError.message}`);
  }

  return syncedUsers;
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

export async function saveAdminConfig(config: AdminConfig): Promise<AdminConfig> {
  const normalized = normalizeAdminConfig(config);
  const syncedUsers = await syncUsersToSupabase(normalized.users);
  const finalConfig: AdminConfig = { ...normalized, users: syncedUsers };
  localStorage.setItem(ADMIN_CONFIG_LOCAL_KEY, JSON.stringify(finalConfig));

  const { error } = await supabase
    .from('app_state_store')
    .upsert(
      {
        state_key: ADMIN_CONFIG_STATE_KEY,
        state_data: finalConfig,
        updated_by: 'developer',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'state_key' },
    );

  if (error) throw new Error(`تعذر حفظ إعدادات المستخدمين في قاعدة البيانات: ${error.message}`);

  const { data, error: verifyError } = await supabase
    .from('app_state_store')
    .select('state_data')
    .eq('state_key', ADMIN_CONFIG_STATE_KEY)
    .maybeSingle<{ state_data: AdminConfig }>();

  if (verifyError) throw new Error(`تم الحفظ لكن تعذر التحقق من البيانات: ${verifyError.message}`);

  const verified = normalizeAdminConfig(data?.state_data ?? finalConfig);
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

    if (error || !data?.state_data) return null;

    const merged = normalizeAdminConfig(data.state_data);
    const remoteUsers = await readSupabaseUsers();
    const enriched = enrichWithStableSupabaseIds(merged.users, remoteUsers);
    const finalConfig: AdminConfig = { ...merged, users: enriched };
    localStorage.setItem(ADMIN_CONFIG_LOCAL_KEY, JSON.stringify(finalConfig));
    return finalConfig;
  } catch {
    return null;
  }
}
