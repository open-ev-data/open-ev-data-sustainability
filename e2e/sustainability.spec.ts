import { test, expect, type Page } from '@playwright/test';
import { E2E_DATASET } from './fixtures/dataset';

const DOLPHIN = 'byd:dolphin:2024:extended';

async function open(page: Page, path = './') {
  await page.route('**/dataset.json', (route) =>
    route.fulfill({ json: E2E_DATASET, contentType: 'application/json' })
  );
  await page.goto(path);
}

async function chooseVehicle(page: Page, query: string, name: RegExp) {
  await page.getByLabel('Search vehicles').fill(query);
  await page.getByRole('button', { name }).click();
}

test.describe('Sustainability page', () => {
  test('shows the empty state until a vehicle is chosen', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { name: /what does an ev really use/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Energy consumption' })).toHaveCount(0);
  });

  test('selects a vehicle by search and shows every section', async ({ page }) => {
    await open(page);
    await chooseVehicle(page, 'dolphin', /BYD\s*Dolphin/);

    await expect(page).toHaveURL(/vehicle=byd%3Adolphin%3A2024%3Aextended/);
    for (const title of [
      'Energy consumption',
      'Charging simulator',
      'Cost estimator',
      'Energy technologies',
      'Sustainability summary',
    ]) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
  });

  test('derives consumption from the battery and range and labels it', async ({ page }) => {
    await open(page, `./?vehicle=${DOLPHIN}`);

    await expect(page.getByText(/derived from the net battery/i)).toBeVisible();
    const energy = page.locator('#energy');
    await expect(energy.getByText('16.0')).toBeVisible();
    await expect(energy.getByText('2,400')).toBeVisible();
  });

  test('recalculates when the distance and period change', async ({ page }) => {
    await open(page, `./?vehicle=${DOLPHIN}`);

    await page.getByRole('spinbutton', { name: 'Distance driven' }).fill('40');
    await page.getByRole('radio', { name: 'Per day' }).click();

    await expect(page.locator('#energy').getByText('2,336')).toBeVisible();
  });

  test('computes costs only after the user informs a price', async ({ page }) => {
    await open(page, `./?vehicle=${DOLPHIN}`);
    await expect(page.getByText(/no tariff is assumed/i)).toBeVisible();

    await page.getByRole('spinbutton', { name: 'Price per kWh' }).fill('0.5');

    await expect(page.locator('#cost').getByText('$1,200.00')).toBeVisible();
    await expect(page.locator('#cost').getByText('$24.00')).toBeVisible();
  });

  test('estimates the charging time from the slower of charger and vehicle', async ({ page }) => {
    await open(page, `./?vehicle=${DOLPHIN}`);

    const charging = page.locator('#charging');
    await expect(charging.getByText('48.0 kWh')).toBeVisible();

    await page.getByRole('button', { name: '11 kW' }).click();
    await expect(charging.getByText('4 h 22 min')).toBeVisible();
    await expect(charging.getByText('Charger and vehicle are matched')).toBeVisible();

    await page.getByRole('spinbutton', { name: 'Charger power' }).fill('3.7');
    await expect(charging.getByText('Limited by your charger')).toBeVisible();
  });

  test('flags DC as unavailable for a vehicle without DC data', async ({ page }) => {
    await open(page, './?vehicle=acme:city:2025:base');

    await expect(page.getByRole('radio', { name: /DC/ })).toBeDisabled();
  });

  test('reports unavailable technologies instead of guessing', async ({ page }) => {
    await open(page, `./?vehicle=${DOLPHIN}`);

    const tech = page.locator('#technologies');
    await expect(tech.getByText('Supported')).toBeVisible();
    await expect(tech.getByText('Not reported').first()).toBeVisible();
  });

  test('toggles between dark and light themes', async ({ page }) => {
    await open(page);
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');

    await page.getByRole('button', { name: /switch to (light|dark) mode/i }).click();

    await expect(html).not.toHaveAttribute('data-theme', before ?? '');
  });

  test('shows the 404 page for unknown routes', async ({ page }) => {
    await open(page, './does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });
});
