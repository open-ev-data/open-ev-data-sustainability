import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_USAGE_PROFILE,
  UsageProfileForm,
  UsageProfileProvider,
  sanitizeUsageProfile,
  validateUsageProfile,
} from './index';

describe('validateUsageProfile', () => {
  it('accepts the defaults', () => {
    expect(validateUsageProfile(DEFAULT_USAGE_PROFILE)).toEqual({});
  });

  it('rejects a target charge that is not above the initial charge', () => {
    const errors = validateUsageProfile({ ...DEFAULT_USAGE_PROFILE, initialSoc: 80, targetSoc: 60 });
    expect(errors.targetSoc).toBeDefined();
  });

  it('rejects non-positive distance and charger power', () => {
    const errors = validateUsageProfile({
      ...DEFAULT_USAGE_PROFILE,
      distance: 0,
      chargerPowerKw: 0,
    });
    expect(errors.distance).toBeDefined();
    expect(errors.chargerPowerKw).toBeDefined();
  });

  it('rejects unrealistic daily distances and negative prices', () => {
    const errors = validateUsageProfile({
      ...DEFAULT_USAGE_PROFILE,
      distance: 5000,
      distancePeriod: 'day',
      pricePerKwh: -1,
    });
    expect(errors.distance).toBeDefined();
    expect(errors.pricePerKwh).toBeDefined();
  });

  it('treats a price of zero as not informed instead of an error', () => {
    expect(validateUsageProfile({ ...DEFAULT_USAGE_PROFILE, pricePerKwh: 0 }).pricePerKwh).toBeUndefined();
  });
});

describe('sanitizeUsageProfile', () => {
  it('falls back to defaults for unknown input', () => {
    expect(sanitizeUsageProfile(null)).toEqual(DEFAULT_USAGE_PROFILE);
    expect(sanitizeUsageProfile('x')).toEqual(DEFAULT_USAGE_PROFILE);
  });

  it('keeps valid values and replaces invalid ones', () => {
    const profile = sanitizeUsageProfile({
      distance: 50,
      distancePeriod: 'week',
      currency: 'BRL',
      chargerType: 'dc',
      pricePerKwh: 'free',
    });
    expect(profile.distance).toBe(50);
    expect(profile.distancePeriod).toBe(DEFAULT_USAGE_PROFILE.distancePeriod);
    expect(profile.currency).toBe('BRL');
    expect(profile.chargerType).toBe('dc');
    expect(profile.pricePerKwh).toBe(DEFAULT_USAGE_PROFILE.pricePerKwh);
  });
});

describe('UsageProfileForm', () => {
  beforeEach(() => localStorage.clear());

  const renderForm = () =>
    render(
      <UsageProfileProvider>
        <UsageProfileForm />
      </UsageProfileProvider>
    );

  it('updates the distance and persists it', () => {
    renderForm();
    const input = screen.getByLabelText('Distance driven') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '40' } });
    expect(input.value).toBe('40');
    expect(JSON.parse(localStorage.getItem('oev_usage_profile') as string).distance).toBe(40);
  });

  it('shows a validation message when the desired charge is too low', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Desired state of charge'), { target: { value: '10' } });
    expect(screen.getByRole('alert')).toHaveTextContent(/higher than the initial charge/i);
  });

  it('switches charger type and applies the default power', () => {
    renderForm();
    fireEvent.click(screen.getByRole('radio', { name: /DC/ }));
    expect((screen.getByLabelText('Charger power') as HTMLInputElement).value).toBe('150');
  });

  it('disables a charger type when requested', () => {
    render(
      <UsageProfileProvider>
        <UsageProfileForm disabledChargerTypes={['dc']} />
      </UsageProfileProvider>
    );
    expect(screen.getByRole('radio', { name: /DC/ })).toBeDisabled();
  });
});
