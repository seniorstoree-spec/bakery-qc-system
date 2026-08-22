import { supabase } from './supabase';

export async function signInWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;

  return { user: data.user, profile };
}

export async function signOutSupabase() {
  await supabase.auth.signOut();
}
