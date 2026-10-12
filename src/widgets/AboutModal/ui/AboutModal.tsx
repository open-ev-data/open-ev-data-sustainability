import { BatteryCharging, Database, Gauge, Github, Leaf, Wallet } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button/Button';
import { APP_CONSTANTS } from '@/shared/config/constants';
import styles from './AboutModal.module.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HOW_IT_WORKS = [
  {
    icon: Gauge,
    name: 'Consumption',
    description: 'Reported value, or battery divided by range',
  },
  {
    icon: BatteryCharging,
    name: 'Charging',
    description: 'Energy needed divided by effective power',
  },
  {
    icon: Wallet,
    name: 'Cost',
    description: 'Energy multiplied by your electricity price',
  },
  {
    icon: Database,
    name: 'Data',
    description: 'Only the OpenEV Data dataset, no estimates added',
  },
];

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About OpenEV Data Sustainability"
      size="large"
    >
      <div className={styles.container}>
        <p className={styles.introText}>
          <strong>OpenEV Data Sustainability</strong> turns the specifications of the{' '}
          <a
            href="https://github.com/open-ev-data/open-ev-data-dataset"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.introLink}
          >
            OpenEV Data dataset
          </a>{' '}
          into what they mean in everyday use. The{' '}
          <a
            href={APP_CONSTANTS.SITE.EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.introLink}
          >
            Vehicle Explorer
          </a>{' '}
          answers what a vehicle is; this app answers what it costs in energy.
        </p>

        <div className={styles.contentGrid}>
          <div className={styles.infoColumn}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Leaf className={styles.icon} size={20} />
                What you can do
              </h3>
              <p className={styles.text}>
                Pick a vehicle, tell us how you drive and what you pay for electricity, and see the
                energy it uses, how long it takes to charge and what it costs per month and year.
              </p>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Github className={styles.icon} size={20} />
                Open source
              </h3>
              <p className={styles.text}>
                Everything runs in your browser from a static dataset. Contribute to the dataset or
                this app on GitHub.
              </p>
            </section>
          </div>

          <div className={styles.formatsColumn}>
            <h3 className={styles.columnTitle}>How the numbers are built</h3>
            <p className={styles.columnSubtitle}>
              Values the dataset does not report are shown as unavailable, never guessed.
            </p>

            <div className={styles.formatGrid}>
              {HOW_IT_WORKS.map(({ icon: Icon, name, description }) => (
                <div key={name} className={styles.formatCard}>
                  <div className={styles.formatIcon}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.formatInfo}>
                    <span className={styles.formatName}>{name}</span>
                    <span className={styles.formatDesc}>{description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            variant="ghost"
            onClick={() => window.open(APP_CONSTANTS.SITE.REPOSITORY_URL, '_blank', 'noopener')}
            className={styles.githubButton}
          >
            <Github size={18} />
            Visit GitHub
          </Button>
          <Button variant="primary" onClick={onClose} className={styles.closeButton}>
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
};
