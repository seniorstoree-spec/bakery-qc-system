import { supabase } from './supabase';

export async function getCurrentAuthProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return null;
  const { data: profile, error: profileError } = await supabase.from('users').select('*').eq('auth_user_id', user.id).eq('active', true).maybeSingle();
  if (profileError) throw profileError;
  return profile ? { user, profile } : { user, profile: null };
}

export async function signInWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('تعذر إنشاء جلسة دخول.');
  const { data: profile, error: profileError } = await supabase.from('users').select('*').eq('auth_user_id', data.user.id).eq('active', true).maybeSingle();
  if (profileError) throw profileError;
  return { user: data.user, profile };
}

export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
