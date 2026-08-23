import { UserProfile } from '../types';

export type LoginMode = 'admin' | 'user';
export type ManagedUserRole = 'quality_engineer' | 'quality_supervisor' | 'department_head' | 'senior_quality' | 'quality_department_manager' | 'deputy_quality_manager';
export interface ManagedUser extends UserProfile { position: ManagedUserRole; enabled: boolean; /** Stable UUID of the matching public.users row. */ supabaseId?: string; }
export interface AppSectionConfig { id:string; label:string; visible:boolean; }
export interface AppAppearanceConfig { primaryColor:string; accentColor:string; fontFamily:string; logoDataUrl?:string; }
export interface AppContentConfig { [key:string]:string; }
export interface AdminConfig { users:ManagedUser[]; sections:AppSectionConfig[]; appearance:AppAppearanceConfig; content:AppContentConfig; }
/** Deprecated compatibility export. Authentication is now handled exclusively by Supabase Auth. */
export const ADMIN_PASSWORD='__DISABLED__';
export const ADMIN_STORAGE_KEY='bakery_qc_admin_config_v1';
export const SESSION_STORAGE_KEY='bakery_qc_session_v1';
