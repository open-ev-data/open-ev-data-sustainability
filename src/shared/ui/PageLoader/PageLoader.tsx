import { Spinner } from '../Spinner/Spinner';

export const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
    }}
  >
    <Spinner size="lg" />
  </div>
);
