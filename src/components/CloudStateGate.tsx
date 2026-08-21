import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getSession } from '../lib/authClient';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const PREFIX = 'bakery_qc_state_v1_';
const STATE_KEYS = [
  'op_params', 'defect_logs', 'core_temp', 'metal_det', 'electric_sieve',
  'additives', 'sensory', 'ncr', 'san_b1', 'food_safety', 'rel_b1', 'rel_b2', 'weight_specs'
];

function readLocalState() {
  const state: Record<string, string | null> = {};
  for (const key of STATE_KEYS) state[key] = localStorage.getItem(`${PREFIX}${key}`);
  state.theme = localStorage.getItem('bakery_theme');
  return state;
}

function writeLocalState(state: Record<string, string | null>) {
  for (const key of STATE_KEYS) {
    const value = state[key];
    if (value !== null && value !== undefined) localStorage.setItem(`${PREFIX}${key}`, value);
  }
  if (state.theme) localStorage.setItem('bakery_theme', state.theme);
}

export const CloudStateGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const session = getSession();
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const lastSaved = useRef('');
  const stateJson = useMemo(() => JSON.stringify(readLocalState()), [ready]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!URL || !KEY || !session?.access_token || !session?.user?.id) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const response = await fetch(`${URL}/rest/v1/app_user_state?user_id=eq.${encodeURIComponent(session.user.id)}&select=state&limit=1`, {
          headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` },
        });
        if (response.status === 404) {
          if (!cancelled) setReady(true);
          return;
        }
        if (!response.ok) throw new Error('cloud state read failed');
        const rows = await response.json();
        if (rows?.[0]?.state) writeLocalState(rows[0].state);
        if (!cancelled) {
          setAvailable(true);
          setReady(true);
        }
      } catch {
        if (!cancelled) setReady(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [session?.access_token, session?.user?.id]);

  useEffect(() => {
    if (!ready || !available || !URL || !KEY || !session?.access_token || !session?.user?.id) return;
    const sync = async () => {
      const state = readLocalState();
      const serialized = JSON.stringify(state);
      if (serialized === lastSaved.current) return;
      try {
        const response = await fetch(`${URL}/rest/v1/app_user_state`, {
          method: 'POST',
          headers: {
            apikey: KEY,
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({ user_id: session.user.id, state }),
        });
        if (response.ok) lastSaved.current = serialized;
      } catch {
        // Keep localStorage as the offline fallback.
      }
    };
    sync();
    const timer = window.setInterval(sync, 2000);
    return () => window.clearInterval(timer);
  }, [ready, available, session?.access_token, session?.user?.id, stateJson]);

  if (!ready) {
    return <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6"><div className="rounded-2xl bg-white dark:bg-slate-900 border px-6 py-5 text-sm font-bold shadow">جاري تجهيز بيانات النظام...</div></div>;
  }

  return <>{children}</>;
};
