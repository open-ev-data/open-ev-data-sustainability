import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from '@/shared/lib/storage';
import {
  DEFAULT_USAGE_PROFILE,
  sanitizeUsageProfile,
  validateUsageProfile,
  type UsageProfile,
} from './usage-profile';
import {
  USAGE_PROFILE_STORAGE_KEY,
  UsageProfileContext,
} from './usage-profile-context-definition';

export function UsageProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UsageProfile>(() =>
    sanitizeUsageProfile(readStorage<unknown>(USAGE_PROFILE_STORAGE_KEY, null))
  );

  useEffect(() => {
    writeStorage(USAGE_PROFILE_STORAGE_KEY, profile);
  }, [profile]);

  const updateProfile = useCallback((changes: Partial<UsageProfile>) => {
    setProfile((current) => ({ ...current, ...changes }));
  }, []);

  const resetProfile = useCallback(() => setProfile(DEFAULT_USAGE_PROFILE), []);

  const value = useMemo(() => {
    const errors = validateUsageProfile(profile);
    return {
      profile,
      errors,
      isValid: Object.keys(errors).length === 0,
      updateProfile,
      resetProfile,
    };
  }, [profile, updateProfile, resetProfile]);

  return <UsageProfileContext.Provider value={value}>{children}</UsageProfileContext.Provider>;
}
