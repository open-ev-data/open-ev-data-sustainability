---
description: Create a new Feature strictly following Feature-Sliced Design (FSD). Scaffolds the Slice structure with Model, UI, and API segments.
---

# Create FSD Feature

This skill guides the creation of a new **Feature Slice** (`src/features/{feature-name}`), ensuring complete isolation and correct layering.

## Input: Feature Name
Example: `vehicle-compare`, `user-preferences`, `newsletter-signup`.

## 1. Directory Scaffolding

Create the following folder structure:

```text
src/features/{feature-name}/
├── ui/                 # UI Components (React)
│   ├── MainComponent.tsx
│   ├── MainComponent.module.css
│   └── index.ts        # Internal UI export
├── model/              # Business Logic (Hooks, Stores)
│   ├── use-feature-logic.ts
│   └── feature.types.ts
├── api/                # (Optional) Feature-specific API types
│   └── feature.api.ts
├── index.ts            # PUBLIC API (Barrel)
└── {feature-name}.test.tsx # Integration Tests
```

## 2. Implementation Rules

### Model (`model/`)
- Contains all **business logic** and **state management**.
- **Rule**: Never import UI components here.
- **Rule**: Can import from `entities` (e.g., `Vehicle`) and `shared`.

```ts
// model/use-feature-logic.ts
import { useState } from 'react';
import { useVehicle } from '@/entities/vehicle'; // ✅ OK

export function useFeatureLogic() {
  // Implementation
}
```

### UI (`ui/`)
- Contains the robust components that use the model.
- **Rule**: Imports the local model hooks.

```tsx
// ui/MainComponent.tsx
import { useFeatureLogic } from '../model/use-feature-logic';

export function MainComponent() {
  const logic = useFeatureLogic();
  return <div>{/* ... */}</div>;
}
```

### Public API (`index.ts`)
- **CRITICAL**: Only export what is necessary for the `Page` layer.
- Usually just the main container component.

```ts
// index.ts
export { MainComponent as FeatureName } from './ui/MainComponent';
// Do NOT export internal types or helper hooks unless crucial.
```

## 3. Integration Test Template

Feature tests should be **Integration Tests** (testing UI + Logic together).

```tsx
// {feature-name}.test.tsx
import { render, screen } from '@testing-library/react';
import { FeatureName } from './index';

describe('Feature: {feature-name}', () => {
  it('performs the main use case', () => {
    render(<FeatureName />);
    // Interaction test logic
  });
});
```

## 4. Config Update
- Register any new global providers in `src/app/providers.tsx` if strictly necessary (avoid if possible).
- Add new environment variables to `src/shared/config/env.ts` if needed.
