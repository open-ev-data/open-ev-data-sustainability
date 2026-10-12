import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap } from 'lucide-react';
import { Button } from '@/shared/ui';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | OpenEV Data Sustainability</title>
        <meta
          name="description"
          content="The page you are looking for could not be found. Return to the home page to estimate the energy use of an electric vehicle."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <Zap size={72} className={styles.icon} />
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.message}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className={styles.link}>
            <Button variant="primary" size="lg">
              Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
