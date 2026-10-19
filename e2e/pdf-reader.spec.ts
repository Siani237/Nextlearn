import { test, expect } from '@playwright/test';
import { clearSession, seedSession } from './fixtures/auth';

const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  nom: 'Test',
  prenom: 'User',
  universite: 'Test University',
  filiere: 'Informatique',
  niveau: 'n3' as const,
  langue: 'fr' as const,
};

test.describe('Lecteur PDF', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearSession(page);
    await seedSession(page, TEST_USER, { locked: false });
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('affiche le PDF dans une iframe quand le backend renvoie une URL signée', async ({ page }) => {
    const signedUrl = 'https://example.com/fake-document.pdf';

    await page.route('**/api/documents/test-doc/signed-url', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { url: signedUrl } }),
      });
    });

    await page.goto('/app/bibliotheque/doc/test-doc/read');

    const iframe = page.locator('.pdf-reader__frame');
    await expect(iframe).toBeVisible({ timeout: 5000 });
    await expect(iframe).toHaveAttribute('src', signedUrl);
  });

  test('affiche une erreur si aucune URL n\'est disponible', async ({ page }) => {
    await page.route('**/api/documents/test-doc/signed-url', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: {} }),
      });
    });

    await page.goto('/app/bibliotheque/doc/test-doc/read');

    await expect(page.locator('body')).toContainText('Impossible d\'ouvrir le document.', { timeout: 5000 });
  });
});
