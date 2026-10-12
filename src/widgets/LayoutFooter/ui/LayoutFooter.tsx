import { APP_CONSTANTS } from '@/shared/config/constants';
import styles from './LayoutFooter.module.css';

export function LayoutFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Estimates are based on specifications reported in the{' '}
        <a
          href="https://github.com/open-ev-data/open-ev-data-dataset"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenEV Data dataset
        </a>{' '}
        and on the values you enter. Real-world results vary with weather, driving style and
        charging conditions.
      </p>
      <p className={styles.text}>
        <a href={APP_CONSTANTS.SITE.REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
          Source code
        </a>
        {' - '}
        <a href={APP_CONSTANTS.SITE.EXPLORER_URL} target="_blank" rel="noopener noreferrer">
          Vehicle Explorer
        </a>
      </p>
    </footer>
  );
}
