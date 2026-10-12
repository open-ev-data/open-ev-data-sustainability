import { Car, SlidersHorizontal, Zap } from 'lucide-react';
import { VehicleSummary } from '@/entities/vehicle';
import { VehicleSelector, useSelectedVehicle } from '@/features/vehicle-selector';
import { UsageProfileForm, useUsageProfile } from '@/features/usage-profile';
import { EnergyPanel } from '@/widgets/EnergyPanel';
import { ChargingPanel } from '@/widgets/ChargingPanel';
import { CostPanel } from '@/widgets/CostPanel';
import { EnergyTechnologies } from '@/widgets/EnergyTechnologies';
import { SustainabilitySummary } from '@/widgets/SustainabilitySummary';
import { SectionCard } from '@/shared/ui';
import { generateOrganizationSchema, generateWebApplicationSchema, useSEO } from '@/shared/seo';
import { useSustainabilityModel } from '../model/use-sustainability-model';
import styles from './SustainabilityPage.module.css';

const SECTIONS = [
  { id: 'energy', label: 'Energy' },
  { id: 'charging', label: 'Charging' },
  { id: 'cost', label: 'Cost' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'summary', label: 'Summary' },
];

export function SustainabilityPage() {
  const { selected } = useSelectedVehicle();
  const { profile, errors, updateProfile } = useUsageProfile();
  const model = useSustainabilityModel(selected, profile, errors);

  const seo = useSEO({
    title: 'OpenEV Data Sustainability',
    description:
      'Estimate energy consumption, charging time and running costs of any electric vehicle in the OpenEV Data dataset.',
    canonical: '/',
    schema: [generateWebApplicationSchema(), generateOrganizationSchema()],
  });

  const disabledChargerTypes = selected
    ? [
        ...(selected.charging?.ac ? [] : (['ac'] as const)),
        ...(selected.charging?.dc ? [] : (['dc'] as const)),
      ]
    : [];

  return (
    <div className={styles.container}>
      {seo}

      <aside className={styles.inputs} aria-label="Inputs">
        <SectionCard
          id="vehicle"
          title="Vehicle"
          description="Search or choose make, model, year and version."
          icon={<Car size={20} />}
        >
          <VehicleSelector />
          {selected && <VehicleSummary vehicle={selected} />}
        </SectionCard>

        <SectionCard
          id="usage"
          title="Usage profile"
          description="How you drive and charge."
          icon={<SlidersHorizontal size={20} />}
        >
          <UsageProfileForm disabledChargerTypes={disabledChargerTypes} />
        </SectionCard>
      </aside>

      <div className={styles.results}>
        {selected && model ? (
          <>
            <nav className={styles.sectionNav} aria-label="Result sections">
              {SECTIONS.map((section) => (
                <a key={section.id} href={`#${section.id}`} className={styles.sectionLink}>
                  {section.label}
                </a>
              ))}
            </nav>

            <EnergyPanel
              vehicle={selected}
              consumption={model.consumption}
              energy={model.energy}
              cycle={profile.rangeCycle}
              onCycleChange={(rangeCycle) => updateProfile({ rangeCycle })}
            />
            <ChargingPanel
              vehicle={selected}
              profile={profile}
              capacityKwh={model.capacityKwh}
              vehicleMaxPowerKw={model.vehicleMaxPowerKw}
              charging={model.charging}
            />
            <CostPanel profile={profile} energy={model.energy} cost={model.cost} />
            <EnergyTechnologies vehicle={selected} />
            <SustainabilitySummary
              vehicle={selected}
              profile={profile}
              energy={model.energy}
              consumption={model.consumption}
              cost={model.cost}
            />
          </>
        ) : (
          <div className={styles.empty}>
            <Zap size={48} className={styles.emptyIcon} />
            <h1 className={styles.emptyTitle}>What does an EV really use?</h1>
            <p className={styles.emptyText}>
              Choose a vehicle to see its energy consumption, charging time, running cost and
              energy technologies, calculated from the OpenEV Data dataset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
