import { AlertCircle } from "lucide-react";
import { Button } from "../Button/Button";
import styles from "./ErrorFallback.module.css";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  return (
    <div className={styles.container} role="alert">
      <AlertCircle size={48} className={styles.icon} />
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} variant="primary">
          Try again
        </Button>
      )}
    </div>
  );
};
