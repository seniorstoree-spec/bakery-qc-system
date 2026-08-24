import { supabase } from './supabase';

const withTimeout = async <T,>(promise: Promise<T>, ms = 12000): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error('انتهت مهلة الاتصال بخدمة تسجيل الدخول. تحقق من اتصال الإنترنت ثم أعد المحاولة.')), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export async function getCurrentAuthProfile(){
  // Do not block the first paint on a network getUser() call. The Supabase
  // client already persists and refreshes the session locally.
  const { data: sessionData, error: sessionError } = await withTimeout(supabase.auth.getSession());
  if (sessionError) throw sessionError;
  const session = sessionData.session;
  if (!session?.user) return null;

  const { data: profile, error: profileError } = await withTimeout(
    supabase.from('users').select('*').eq('auth_user_id', session.user.id).eq('active', true).maybeSingle()
  );
  if (profileError) throw profileError;
  return { user: session.user, profile: profile ?? null };
}

export async function signInWithSupabase(email:string,password:string){
  const normalizedEmail=email.trim().toLowerCase();
  const {data,error}=await withTimeout(supabase.auth.signInWithPassword({email:normalizedEmail,password}));
  if(error){
    const raw=error.message||'';
    const lower=raw.toLowerCase();
    if(lower.includes('invalid login credentials')) throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة. استخدم «نسيت كلمة المرور» لإعادة تعيين كلمة المرور.');
    if(lower.includes('email not confirmed')) throw new Error('البريد الإلكتروني غير مؤكد في Supabase Auth.');
    throw new Error(raw||'تعذر الاتصال بخدمة تسجيل الدخول.');
  }
  if(!data.user)throw new Error('Supabase لم يُنشئ جلسة دخول.');
  const {data:profile,error:profileError}=await withTimeout(supabase.from('users').select('*').eq('auth_user_id',data.user.id).eq('active',true).maybeSingle());
  if(profileError)throw new Error(`تم تسجيل الدخول لكن تعذر قراءة ملف المطور: ${profileError.message}`);
  if(!profile)throw new Error('تم تسجيل الدخول في Supabase Auth لكن لا يوجد مستخدم مطور نشط مرتبط بهذا الحساب.');
  return {user:data.user,profile};
}

export async function sendDeveloperPasswordReset(email:string){
  const normalizedEmail=email.trim().toLowerCase();
  if(!normalizedEmail)throw new Error('اكتب البريد الإلكتروني أولاً.');
  const redirectTo=`${window.location.origin}${window.location.pathname}`;
  const {error}=await withTimeout(supabase.auth.resetPasswordForEmail(normalizedEmail,{redirectTo}));
  if(error)throw error;
}

export async function signOutSupabase(){const {error}=await withTimeout(supabase.auth.signOut());if(error)throw error;}
