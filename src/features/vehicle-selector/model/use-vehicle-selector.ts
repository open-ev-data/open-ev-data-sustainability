import { useCallback, useMemo, useState } from 'react';
import {
  getMakeOptions,
  getModelOptions,
  getVersionOptions,
  getYearOptions,
  searchVehicles,
} from './selector-options';
import { VEHICLE_PARAM, useSelectedVehicle } from './use-selected-vehicle';

interface Draft {
  make?: string;
  model?: string;
  year?: number;
}

export function useVehicleSelector() {
  const { vehicles, selected, selectedCode, isLoading, error, refetch, setSearchParams } =
    useSelectedVehicle();

  const [draft, setDraft] = useState<Draft>({});
  const [query, setQuery] = useState('');

  const current: Draft = selected
    ? { make: selected.make.slug, model: selected.model.slug, year: selected.year }
    : draft;

  const writeSelection = useCallback(
    (code: string | null) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (code) next.set(VEHICLE_PARAM, code);
          else next.delete(VEHICLE_PARAM);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const select = useCallback(
    (code: string | null) => {
      setDraft({});
      setQuery('');
      writeSelection(code);
    },
    [writeSelection]
  );

  const pickMake = (make: string) => {
    setDraft({ make });
    writeSelection(null);
  };

  const pickModel = (model: string) => {
    setDraft({ make: current.make, model });
    writeSelection(null);
  };

  const pickYear = (value: string) => {
    const year = Number(value);
    const versions = getVersionOptions(vehicles, current.make, current.model, year);

    if (versions.length === 1) {
      select(versions[0].value);
      return;
    }

    setDraft({ make: current.make, model: current.model, year });
    writeSelection(null);
  };

  const results = useMemo(() => searchVehicles(vehicles, query), [vehicles, query]);
  const makes = useMemo(() => getMakeOptions(vehicles), [vehicles]);
  const models = useMemo(() => getModelOptions(vehicles, current.make), [vehicles, current.make]);
  const years = useMemo(
    () => getYearOptions(vehicles, current.make, current.model),
    [vehicles, current.make, current.model]
  );
  const versions = useMemo(
    () => getVersionOptions(vehicles, current.make, current.model, current.year),
    [vehicles, current.make, current.model, current.year]
  );

  return {
    isLoading,
    error,
    refetch,
    selected,
    isUnknownSelection: Boolean(selectedCode) && !selected && !isLoading,
    query,
    setQuery,
    results,
    makes,
    models,
    years,
    versions,
    current,
    select,
    pickMake,
    pickModel,
    pickYear,
  };
}
