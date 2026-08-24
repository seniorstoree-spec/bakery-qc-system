import { supabase } from './supabase';

export async function getCurrentAuthProfile(){
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError)throw authError;
  if(!user)return null;
  const {data:profile,error:profileError}=await supabase.from('users').select('*').eq('auth_user_id',user.id).eq('active',true).maybeSingle();
  if(profileError)throw profileError;
  return {user,profile:profile??null};
}

export async function signInWithSupabase(email:string,password:string){
  const normalizedEmail=email.trim().toLowerCase();
  const {data,error}=await supabase.auth.signInWithPassword({email:normalizedEmail,password});
  if(error){
    if(error.message.toLowerCase().includes('invalid login credentials')) throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة. استخدم «نسيت كلمة المرور» لإعادة تعيين كلمة المرور.');
    if(error.message.toLowerCase().includes('email not confirmed')) throw new Error('البريد الإلكتروني غير مؤكد في Supabase Auth.');
    throw new Error(error.message||'تعذر الاتصال بخدمة تسجيل الدخول.');
  }
  if(!data.user)throw new Error('Supabase لم يُنشئ جلسة دخول.');
  const {data:profile,error:profileError}=await supabase.from('users').select('*').eq('auth_user_id',data.user.id).eq('active',true).maybeSingle();
  if(profileError)throw new Error(`تم تسجيل الدخول لكن تعذر قراءة ملف المطور: ${profileError.message}`);
  return {user:data.user,profile};
}

export async function sendDeveloperPasswordReset(email:string){
  const normalizedEmail=email.trim().toLowerCase();
  if(!normalizedEmail)throw new Error('اكتب البريد الإلكتروني أولاً.');
  const redirectTo=`${window.location.origin}${window.location.pathname}`;
  const {error}=await supabase.auth.resetPasswordForEmail(normalizedEmail,{redirectTo});
  if(error)throw error;
}

export async function signOutSupabase(){const {error}=await supabase.auth.signOut();if(error)throw error;}
