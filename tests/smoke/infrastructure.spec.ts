import { expect, test } from '@playwright/test';

test('Playwright infrastructure is available in the selected browser', async ({
  browserName,
  page,
}, testInfo) => {
  const metadata = testInfo.config.metadata;
  const timestamp = metadata['ISO timestamp'];

  expect(metadata['Run by']).toBe('23127027');
  expect(metadata.PW_RUN_LABEL).toBe(process.env.PW_RUN_LABEL ?? 'local');
  expect(timestamp).toMatch(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  );
  expect(new Date(timestamp).toISOString()).toBe(timestamp);
  expect(testInfo.project.name).toBe(browserName);

  await page.setContent(
    `<main><h1 data-testid="browser-status">${browserName} ready</h1></main>`,
  );

  await expect(page.getByTestId('browser-status')).toHaveText(
    `${browserName} ready`,
  );
});
