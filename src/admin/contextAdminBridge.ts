import { useEffect, useMemo, useState } from 'react';
import { loadAdminConfig, saveAdminConfig } from './adminConfig';
import type { AdminConfig } from './adminTypes';

export function useAdminConfigState() {
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => loadAdminConfig());
  const updateAdminConfig = (next: AdminConfig) => {
    setAdminConfig(next);
    saveAdminConfig(next);
  };
  return useMemo(() => ({ adminConfig, updateAdminConfig }), [adminConfig]);
}

export function AdminConfigHydrator() {
  useEffect(() => {}, []);
  return null;
}
