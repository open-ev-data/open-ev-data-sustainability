import { useContext } from 'react';
import { UsageProfileContext } from './usage-profile-context-definition';

export function useUsageProfile() {
  const context = useContext(UsageProfileContext);
  if (!context) {
    throw new Error('useUsageProfile must be used within a UsageProfileProvider');
  }
  return context;
}
