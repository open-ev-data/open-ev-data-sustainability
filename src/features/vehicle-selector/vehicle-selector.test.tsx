import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDataset, SAMPLE_VEHICLES } from '@/test/fixtures/vehicles';
import { VehicleSelector } from './index';
import {
  getMakeOptions,
  getModelOptions,
  getVersionLabel,
  getVersionOptions,
  getYearOptions,
  searchVehicles,
} from './model/selector-options';

describe('selector options', () => {
  it('builds the cascade from make to version', () => {
    expect(getMakeOptions(SAMPLE_VEHICLES).map((o) => o.label)).toEqual(['Acme', 'Test']);
    expect(getModelOptions(SAMPLE_VEHICLES, 'test').map((o) => o.value)).toEqual(['model']);
    expect(getYearOptions(SAMPLE_VEHICLES, 'test', 'model').map((o) => o.value)).toEqual(['2024']);
    expect(getVersionOptions(SAMPLE_VEHICLES, 'test', 'model', 2024)).toHaveLength(2);
  });

  it('returns nothing while a parent level is not chosen', () => {
    expect(getModelOptions(SAMPLE_VEHICLES)).toEqual([]);
    expect(getYearOptions(SAMPLE_VEHICLES, 'test')).toEqual([]);
    expect(getVersionOptions(SAMPLE_VEHICLES, 'test', 'model')).toEqual([]);
  });

  it('labels versions and falls back to Base', () => {
    expect(getVersionLabel(SAMPLE_VEHICLES[0])).toBe('Base');
    expect(getVersionLabel(SAMPLE_VEHICLES[1])).toBe('Long Range');
  });

  it('searches by every word of the query', () => {
    expect(searchVehicles(SAMPLE_VEHICLES, 'test long').map((v) => v.unique_code)).toEqual([
      'test:model:2024:long_range',
    ]);
    expect(searchVehicles(SAMPLE_VEHICLES, '   ')).toEqual([]);
  });
});

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="search">{location.search}</output>;
}

describe('VehicleSelector', () => {
  afterEach(() => vi.restoreAllMocks());

  const renderSelector = (initialEntry = '/') => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(createDataset(SAMPLE_VEHICLES)), {
        headers: { 'content-type': 'application/json' },
      })
    );

    return render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <VehicleSelector />
          <LocationProbe />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('selects a vehicle from the search results and writes it to the URL', async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.type(await screen.findByLabelText('Search vehicles'), 'acme');
    await user.click(await screen.findByRole('button', { name: /Acme\s*City\s*2025/ }));

    expect(screen.getByTestId('search')).toHaveTextContent('vehicle=acme%3Acity%3A2025%3Abase');
  });

  it('restores the selection from the URL', async () => {
    renderSelector('/?vehicle=acme:city:2025:base');

    await waitFor(() => expect(screen.getByText('Acme')).toBeInTheDocument());
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('warns when the vehicle in the URL does not exist', async () => {
    renderSelector('/?vehicle=nope');
    expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
  });
});
