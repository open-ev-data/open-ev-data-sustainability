---
description: Create a new UI component strictly following Feature-Sliced Design (FSD) architecture, CSS Modules, and Testing standards.
---

# Create FSD Component

This skill orchestrates the creation of a new React component, ensuring compliance with the project's Architectural and Design System guidelines.

## Prerequisites

- Read @[UI/docs/ARCHITECTURE.md] (Component Organization)
- Read @[UI/docs/DESIGN_SYSTEM.md] (Tokens & Styling)

## 1. Determine Location (FSD Layer)

| Layer | Path Pattern | Responsibility | Rules |
| :--- | :--- | :--- | :--- |
| **Shared** | `src/shared/ui/{ComponentName}/` | Generic UI (Button, Input) | ❌ No business logic<br>❌ No API calls<br>✅ Reusable everywhere |
| **Entity** | `src/entities/{entity}/ui/{ComponentName}/` | Domain Display (VehicleCard) | ✅ Reads Entity types<br>❌ No complex state<br>❌ No use-case logic |
| **Feature** | `src/features/{feature}/ui/{ComponentName}/` | Smart UI (SearchBar) | ✅ Connects API & State<br>✅ Handles user interactions |

## 2. Directory Structure

Create the folder `src/{layer}/{slice}/ui/{ComponentName}/` containing:

- `index.ts` (Public API)
- `{ComponentName}.tsx` (Implementation)
- `{ComponentName}.module.css` (Styles)
- `{ComponentName}.test.tsx` (Unit Tests)

## 3. Implementation Templates

### Component (`{ComponentName}.tsx`)

```tsx
import cla from 'classnames';
import { memo } from 'react';
import styles from './ComponentName.module.css';

// 1. Strict Interface (No React.FC)
export interface ComponentNameProps {
  className?: string;
  // Add specific props here
}

// 2. Named Export
export const ComponentName = memo(function ComponentName({
  className,
  ...props
}: ComponentNameProps) {
  return (
    <div className={cla(styles.root, className)}>
      {/* Implementation */}
    </div>
  );
});
```

### Styles (`{ComponentName}.module.css`)

**CRITICAL**: Use ONLY design tokens from `src/shared/styles/tokens.css`. No hardcoded hex values or pixels.

```css
.root {
  /* Layout */
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);

  /* Appearance */
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);

  /* Typography */
  font-family: var(--font-primary);
}

.root:hover {
  background-color: var(--bg-surface-hover);
  border-color: var(--border-active);
}
```

### Tests (`{ComponentName}.test.tsx`)

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    // Use semantic queries (role, label, text)
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  // Add tests for:
  // - Interactive states (click, hover)
  // - Conditional rendering based on props
  // - Accessibility (aria attributes)
});
```

### Barrel Export (`index.ts`)

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## 4. Verification Checklist

- [ ] **FSD Rule**: Does it import ONLY from lower layers?
- [ ] **CSS Modules**: Are all styles in `.module.css`?
- [ ] **Tokens**: Are all colors/spacing using `var(--...)`?
- [ ] **Tests**: Is there at least one passing test file?
- [ ] **Export**: Is it exported via the slice's `index.ts`?
