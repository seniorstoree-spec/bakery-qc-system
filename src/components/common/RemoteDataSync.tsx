import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

const STATE_KEY = 'qc_state_v1';

type RemoteRow = {
  state_data: Record<string, unknown>;
  updated_at: string;
};

const normalize = (value: string) => {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    delete parsed.exportDate;
    return JSON.stringify(parsed);
  } catch {
    return value;
  }
};

export const RemoteDataSync: React.FC = () => {
  const { exportDataJSON, importDataJSON } = useApp();
  const [hydrated, setHydrated] = useState(false);
  const applyingRemote = useRef(false);
  const lastRemote = useRef('');

  const localSerialized = useMemo(() => normalize(exportDataJSON()), [exportDataJSON]);

  useEffect(() => {
    let cancelled = false;

    const loadRemote = async () => {
      const { data, error } = await supabase
        .from('app_state_store')
        .select('state_data, updated_at')
        .eq('state_key', STATE_KEY)
        .maybeSingle<RemoteRow>();

      if (cancelled) return;

      if (error) {
        console.warn('Supabase sync read failed; keeping local data.', error.message);
        setHydrated(true);
        return;
      }

      if (data?.state_data) {
        const remoteSerialized = normalize(JSON.stringify(data.state_data));
        lastRemote.current = remoteSerialized;
        applyingRemote.current = true;
        importDataJSON(JSON.stringify(data.state_data));
        window.setTimeout(() => {
          applyingRemote.current = false;
          if (!cancelled) setHydrated(true);
        }, 0);
        return;
      }

      const localData = JSON.parse(exportDataJSON()) as Record<string, unknown>;
      delete localData.exportDate;
      const { error: insertError } = await supabase.from('app_state_store').upsert({
        state_key: STATE_KEY,
        state_data: localData,
        updated_by: 'web-client',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'state_key' });

      if (insertError) {
        console.warn('Supabase initial sync failed; local data remains available.', insertError.message);
      } else {
        lastRemote.current = normalize(JSON.stringify(localData));
      }

      if (!cancelled) setHydrated(true);
    };

    void loadRemote();

    return () => {
      cancelled = true;
    };
  }, [exportDataJSON, importDataJSON]);

  useEffect(() => {
    if (!hydrated || applyingRemote.current || localSerialized === lastRemote.current) return;

    const stateData = JSON.parse(localSerialized) as Record<string, unknown>;

    const persist = async () => {
      const { error } = await supabase.from('app_state_store').upsert({
        state_key: STATE_KEY,
        state_data: stateData,
        updated_by: 'web-client',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'state_key' });

      if (error) {
        console.warn('Supabase sync write failed; local browser storage remains active.', error.message);
        return;
      }

      lastRemote.current = localSerialized;
    };

    void persist();
  }, [hydrated, localSerialized]);

  useEffect(() => {
    const channel = supabase
      .channel('qc-state-sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'app_state_store',
          filter: `state_key=eq.${STATE_KEY}`,
        },
        (payload) => {
          const next = payload.new as RemoteRow & { state_key?: string };
          if (!next?.state_data) return;

          const remoteSerialized = normalize(JSON.stringify(next.state_data));
          if (remoteSerialized === localSerialized) return;

          lastRemote.current = remoteSerialized;
          applyingRemote.current = true;
          importDataJSON(JSON.stringify(next.state_data));
          window.setTimeout(() => {
            applyingRemote.current = false;
          }, 0);
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('Supabase realtime is unavailable; periodic persistence still works.');
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [importDataJSON, localSerialized]);

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const { data, error } = await supabase
        .from('app_state_store')
        .select('state_data, updated_at')
        .eq('state_key', STATE_KEY)
        .maybeSingle<RemoteRow>();

      if (error || !data?.state_data) return;

      const remoteSerialized = normalize(JSON.stringify(data.state_data));
      if (remoteSerialized === localSerialized) return;

      lastRemote.current = remoteSerialized;
      applyingRemote.current = true;
      importDataJSON(JSON.stringify(data.state_data));
      window.setTimeout(() => {
        applyingRemote.current = false;
      }, 0);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [importDataJSON, localSerialized]);

  return null;
};
