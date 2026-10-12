---
description: Synchronize the local TypeScript types with the remote `schema.json` from the Data Repository.
---

# Sync Schema & Types

This skill updates the project's data definitions to match the latest version of the OpenEV Data schema.

**Remote Source**: `https://github.com/open-ev-data/open-ev-data-dataset/blob/main/schema.json`
**Target File**: `src/entities/vehicle/model/vehicle.types.ts`

## Prerequisites
- `json-schema-to-typescript` package installed (devDependency).
- Network access to GitHub.

## Workflow

### 1. Fetch Latest Schema
Download the raw JSON schema:
`https://raw.githubusercontent.com/open-ev-data/open-ev-data-dataset/main/schema.json`

### 2. Generate Types (`vehicle.types.ts`)
Run the generation script (or manual command):

```bash
# Recommended: Create a script in package.json
# "gen:types": "json2ts -i schema.json -o src/entities/vehicle/model/vehicle.types.ts"

npm run gen:types
```

### 3. Verification & Fixes
The generation might produce raw types. You MUST manually refine `vehicle.types.ts` to adhere to project standards:

1.  **Enums**: Convert string unions of `vehicle_type` or `drivetrain` into properly exported Types/Enums if the generator missed them.
2.  **Naming**: Ensure interfaces are named `Vehicle`, `Battery`, `Charging` (PascalCase).
3.  **Strictness**: Verify `required` vs `optional` fields match the JSON Schema definition.

### 4. Impact Analysis
Check for breaking changes:

1.  **Run Type Check**: `npm run type-check` (tsc).
2.  **Identify Failures**: Look for components accessing fields that may have been renamed or removed.
3.  **Update Config**: check `src/shared/config/field-visibility.ts` – did any hidden field change name?

### 5. Update Version
Update the `schema_version` constant in `src/shared/config/constants.ts` to match the version in the downloaded JSON.

## Automation Script (Reference)

Create `scripts/update-schema.ts`:

```ts
import { compileFromFile } from 'json-schema-to-typescript';
import fs from 'fs';

async function generate() {
  const schemaUrl = 'https://raw.githubusercontent.com/open-ev-data/open-ev-data-dataset/main/schema.json';

  // 1. Fetch
  const res = await fetch(schemaUrl);
  const schema = await res.json();

  // 2. Compile
  const ts = await compileFromFile('schema.json', {
    cwd: process.cwd(),
    bannerComment: '/* eslint-disable */\n/** Auto-generated from schema.json */'
  });

  // 3. Write
  fs.writeFileSync('src/entities/vehicle/model/vehicle.types.ts', ts);
}

generate();
```
