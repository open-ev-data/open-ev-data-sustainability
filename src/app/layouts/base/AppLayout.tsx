import { Outlet } from 'react-router-dom';
import { LayoutHeader } from '@/widgets/LayoutHeader';
import { LayoutFooter } from '@/widgets/LayoutFooter';
import { ScrollToTopButton } from '@/shared/ui';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <ScrollToTopButton />
      <LayoutHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  );
}
