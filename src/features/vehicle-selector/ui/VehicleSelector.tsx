import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { VehicleTitle } from '@/entities/vehicle';
import { Input, Select, Spinner, ErrorFallback } from '@/shared/ui';
import { useVehicleSelector } from '../model/use-vehicle-selector';
import styles from './VehicleSelector.module.css';

export function VehicleSelector() {
  const selector = useVehicleSelector();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (selector.isLoading) {
    return (
      <div className={styles.state}>
        <Spinner />
        <span>Loading vehicles...</span>
      </div>
    );
  }

  if (selector.error) {
    return (
      <ErrorFallback
        error={selector.error}
        resetErrorBoundary={() => {
          void selector.refetch();
        }}
      />
    );
  }

  const { current } = selector;

  return (
    <div className={styles.selector}>
      <div ref={wrapperRef} className={styles.search}>
        <Input
          id="vehicle-search"
          type="search"
          autoComplete="off"
          placeholder="Search make, model or version"
          aria-label="Search vehicles"
          leadingIcon={<Search size={18} />}
          value={selector.query}
          onChange={(event) => {
            selector.setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && selector.query.trim().length > 0 && (
          <ul className={styles.dropdown} aria-label="Search results">
            {selector.results.length > 0 ? (
              selector.results.map((vehicle) => (
                <li key={vehicle.unique_code}>
                  <button
                    type="button"
                    className={styles.result}
                    onClick={() => {
                      selector.select(vehicle.unique_code);
                      setIsOpen(false);
                    }}
                  >
                    <VehicleTitle vehicle={vehicle} />
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.empty}>No vehicles found</li>
            )}
          </ul>
        )}
      </div>

      <div className={styles.cascade}>
        <Field label="Make">
          <Select
            options={selector.makes}
            value={current.make}
            onChange={selector.pickMake}
            placeholder="Select make"
          />
        </Field>
        <Field label="Model">
          <Select
            options={selector.models}
            value={current.model}
            onChange={selector.pickModel}
            placeholder="Select model"
            disabled={!current.make}
          />
        </Field>
        <Field label="Year">
          <Select
            options={selector.years}
            value={current.year ? String(current.year) : undefined}
            onChange={selector.pickYear}
            placeholder="Select year"
            disabled={!current.model}
          />
        </Field>
        <Field label="Version">
          <Select
            options={selector.versions}
            value={selector.selected?.unique_code}
            onChange={selector.select}
            placeholder="Select version"
            disabled={!current.year}
          />
        </Field>
      </div>

      {selector.isUnknownSelection && (
        <p role="alert" className={styles.warning}>
          The vehicle in the link was not found in the current dataset.
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}
