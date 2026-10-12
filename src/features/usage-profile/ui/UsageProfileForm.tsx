import { RotateCcw } from 'lucide-react';
import {
  Button,
  InfoHint,
  NumberField,
  SegmentedControl,
  Select,
  Slider,
} from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import type { ChargerType, DistancePeriod } from '@/shared/types';
import {
  CHARGER_PRESETS_KW,
  CURRENCIES,
  DEFAULT_CHARGER_POWER_KW,
} from '../model/usage-profile';
import { useUsageProfile } from '../model/use-usage-profile';
import styles from './UsageProfileForm.module.css';

const PERIOD_OPTIONS: { value: DistancePeriod; label: string }[] = [
  { value: 'day', label: 'Per day' },
  { value: 'month', label: 'Per month' },
  { value: 'year', label: 'Per year' },
];

const CURRENCY_OPTIONS = CURRENCIES.map((code) => ({ value: code, label: code }));

interface UsageProfileFormProps {
  disabledChargerTypes?: ChargerType[];
}

export function UsageProfileForm({ disabledChargerTypes = [] }: UsageProfileFormProps) {
  const { profile, errors, updateProfile, resetProfile } = useUsageProfile();

  const chargerOptions: { value: ChargerType; label: string; disabled: boolean }[] = [
    { value: 'ac', label: 'AC (home / wallbox)', disabled: disabledChargerTypes.includes('ac') },
    { value: 'dc', label: 'DC (fast)', disabled: disabledChargerTypes.includes('dc') },
  ];

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Driving</legend>
        <NumberField
          label="Distance driven"
          unit="km"
          min={0}
          value={profile.distance}
          onChange={(distance) => updateProfile({ distance })}
          error={errors.distance}
          hint="How far you drive. Pick the period that is easiest for you; results are shown per month and per year."
        />
        <SegmentedControl
          ariaLabel="Distance period"
          options={PERIOD_OPTIONS}
          value={profile.distancePeriod}
          onChange={(distancePeriod) => updateProfile({ distancePeriod })}
        />
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Electricity</legend>
        <div className={styles.priceRow}>
          <NumberField
            label="Price per kWh"
            unit={`${profile.currency}/kWh`}
            min={0}
            step={0.01}
            value={profile.pricePerKwh}
            onChange={(pricePerKwh) => updateProfile({ pricePerKwh })}
            error={errors.pricePerKwh}
            hint="Find it on your electricity bill. Leave it at 0 to skip cost estimates."
          />
          <div className={styles.currency}>
            <span className={styles.label}>Currency</span>
            <Select
              options={CURRENCY_OPTIONS}
              value={profile.currency}
              onChange={(currency) => updateProfile({ currency })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Charging session</legend>
        <div className={styles.sliderField}>
          <div className={styles.sliderHeader}>
            <label htmlFor="initial-soc" className={styles.label}>
              Initial charge
            </label>
            <span className={styles.sliderValue}>{profile.initialSoc}%</span>
          </div>
          <Slider
            id="initial-soc"
            aria-label="Initial state of charge"
            min={0}
            max={100}
            step={1}
            value={profile.initialSoc}
            onChange={(initialSoc) => updateProfile({ initialSoc })}
          />
          {errors.initialSoc && (
            <p role="alert" className={styles.error}>
              {errors.initialSoc}
            </p>
          )}
        </div>
        <div className={styles.sliderField}>
          <div className={styles.sliderHeader}>
            <label htmlFor="target-soc" className={styles.label}>
              Desired charge
            </label>
            <span className={styles.sliderValue}>{profile.targetSoc}%</span>
          </div>
          <Slider
            id="target-soc"
            aria-label="Desired state of charge"
            min={0}
            max={100}
            step={1}
            value={profile.targetSoc}
            onChange={(targetSoc) => updateProfile({ targetSoc })}
          />
          {errors.targetSoc && (
            <p role="alert" className={styles.error}>
              {errors.targetSoc}
            </p>
          )}
        </div>

        <div className={styles.chargerType}>
          <span className={styles.labelRow}>
            <span className={styles.label}>Charger</span>
            <InfoHint text="AC is slower and typical at home. DC is the fast charging found on highways." />
          </span>
          <SegmentedControl
            ariaLabel="Charger type"
            options={chargerOptions}
            value={profile.chargerType}
            onChange={(chargerType) =>
              updateProfile({ chargerType, chargerPowerKw: DEFAULT_CHARGER_POWER_KW[chargerType] })
            }
          />
        </div>

        <div className={styles.presets} role="group" aria-label="Charger power presets">
          {CHARGER_PRESETS_KW[profile.chargerType].map((power) => (
            <button
              key={power}
              type="button"
              className={cn(styles.preset, profile.chargerPowerKw === power && styles.presetActive)}
              onClick={() => updateProfile({ chargerPowerKw: power })}
            >
              {power} kW
            </button>
          ))}
        </div>

        <NumberField
          label="Charger power"
          unit="kW"
          min={0}
          step={0.1}
          value={profile.chargerPowerKw}
          onChange={(chargerPowerKw) => updateProfile({ chargerPowerKw })}
          error={errors.chargerPowerKw}
          hint="The power your charger can deliver. The car may accept less; the slower of the two is used."
        />
      </fieldset>

      <Button type="button" variant="ghost" size="sm" onClick={resetProfile} className={styles.reset}>
        <RotateCcw size={14} />
        Reset to defaults
      </Button>
    </form>
  );
}
