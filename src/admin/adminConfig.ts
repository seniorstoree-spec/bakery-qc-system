import { INITIAL_USERS } from '../data/initialData';
import { AdminConfig, AppSectionConfig, ManagedUser } from './adminTypes';

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
  appearance: {
    primaryColor: '#e11d48',
    accentColor: '#4f46e5',
    fontFamily: 'system-ui',
  },
  content: {
    appTitle: 'منظومة الجودة وقسم المخبوزات',
    appSubtitle: 'نظام الرقابة اللحظية ونقاط التحكم الحرجة (HACCP & IPC)',
    liveLabel: 'مباشر',
  },
};

export function loadAdminConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem('bakery_qc_admin_config_v1');
    if (!raw) return DEFAULT_ADMIN_CONFIG;
    const parsed = JSON.parse(raw) as Partial<AdminConfig>;
    return {
      ...DEFAULT_ADMIN_CONFIG,
      ...parsed,
      users: parsed.users ?? DEFAULT_ADMIN_CONFIG.users,
      sections: parsed.sections ?? DEFAULT_ADMIN_CONFIG.sections,
      appearance: { ...DEFAULT_ADMIN_CONFIG.appearance, ...(parsed.appearance ?? {}) },
      content: { ...DEFAULT_ADMIN_CONFIG.content, ...(parsed.content ?? {}) },
    };
  } catch {
    return DEFAULT_ADMIN_CONFIG;
  }
}

export function saveAdminConfig(config: AdminConfig) {
  localStorage.setItem('bakery_qc_admin_config_v1', JSON.stringify(config));
}
