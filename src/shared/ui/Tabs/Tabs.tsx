import { cn } from "../../lib/cn";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs = ({ items, value, onChange, className }: TabsProps) => {
  return (
    <div className={cn(styles.tabs, className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={item.value === value}
          aria-controls={`panel-${item.value}`} // Assuming consumer handles panels with matching IDs if strict ARIA needed
          className={cn(styles.tab, item.value === value && styles.active)}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
