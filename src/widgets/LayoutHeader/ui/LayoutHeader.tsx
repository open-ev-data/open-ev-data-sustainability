import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Info, Moon, Sun } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import { APP_CONSTANTS } from '@/shared/config/constants';
import { useTheme } from '@/shared/theme';
import logoMini from '@/assets/open-ev-data-logo-mini.png';
import { AboutModal } from '@/widgets/AboutModal';
import { useVehicleMetadata } from '@/entities/vehicle/api/use-vehicles';
import styles from './LayoutHeader.module.css';

export function LayoutHeader({ className }: { className?: string }) {
  const { data: metadata } = useVehicleMetadata();
  const { theme, toggleTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <header className={cn(styles.header, className)}>
        <Link to="/" className={styles.logo}>
          <img src={logoMini} alt="OpenEV Data" className={styles.icon} />
          <span className={styles.brandName}>OpenEV</span>
          <span className={styles.brandSuffix}>Sustainability</span>
        </Link>

        <nav className={styles.links} aria-label="Related projects">
          <a
            href={APP_CONSTANTS.SITE.EXPLORER_URL}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vehicle Explorer
            <ExternalLink size={14} />
          </a>
        </nav>

        <div className={styles.actions}>
          <div className={styles.versionInfo}>
            <span className={styles.versionText} title={`UI Version: v${__APP_VERSION__}`}>
              UI v{__APP_VERSION__}
            </span>
            {metadata && (
              <span
                className={styles.versionText}
                title={`Dataset Commit: ${metadata.dataset_commit}`}
              >
                Data v{metadata.etl_version}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={styles.iconButton}
            onClick={() => setIsAboutOpen(true)}
            aria-label="About OpenEV Data Sustainability"
          >
            <Info size={24} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={styles.contributeButton}
            onClick={() => window.open(APP_CONSTANTS.SITE.ORGANIZATION_URL, '_blank', 'noopener')}
            aria-label="Contribute on GitHub"
          >
            <Github size={20} className={styles.githubIcon} />
            <span className={styles.contributeText}>Contribute on GitHub</span>
          </Button>
        </div>
      </header>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}
