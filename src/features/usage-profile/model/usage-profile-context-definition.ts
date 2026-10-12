import { createContext } from 'react';
import type { UsageProfile, UsageProfileErrors } from './usage-profile';

export interface UsageProfileContextValue {
  profile: UsageProfile;
  errors: UsageProfileErrors;
  isValid: boolean;
  updateProfile: (changes: Partial<UsageProfile>) => void;
  resetProfile: () => void;
}

export const USAGE_PROFILE_STORAGE_KEY = 'oev_usage_profile';

export const UsageProfileContext = createContext<UsageProfileContextValue | undefined>(undefined);
