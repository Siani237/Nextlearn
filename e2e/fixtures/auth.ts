import { Page } from '@playwright/test';

/**
 * Empreinte SHA-256 de "1234_nextlearn_salt" en hexadécimal.
 * Utilisée pour simuler un PIN local correct dans les tests E2E.
 */
export const PIN_HASH_1234 =
  '20d2eacba9e3b038c579e4f42c764e93b0c408b6d0eaaca140f31e7d672b7f5c';

export interface SeededUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  universite: string;
  filiere: string;
  niveau: 'n1' | 'n2' | 'n3' | 'n4' | 'n5';
  langue: 'fr' | 'en';
}

export async function seedSession(
  page: Page,
  user: SeededUser,
  options: { locked?: boolean; pinHash?: string } = {}
): Promise<void> {
  const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const lastOtp = new Date().toISOString();

  await page.evaluate(
    ([u, exp, otp, locked, pinHash]) => {
      localStorage.setItem('nl_jwt_token', 'fake-access-token');
      localStorage.setItem('nl_jwt_expiry', exp);
      localStorage.setItem('nl_refresh_token', 'fake-refresh-token');
      localStorage.setItem('nl_user_data', JSON.stringify(u));
      localStorage.setItem('nl_first_launch', 'false');
      localStorage.setItem('nl_last_otp_verified_at', otp);
      localStorage.setItem('nl_pin_failed_attempts', '0');
      localStorage.removeItem('nl_pin_locked_until');
      if (pinHash) {
        localStorage.setItem('nl_pin_hash', pinHash);
      } else {
        localStorage.removeItem('nl_pin_hash');
      }
      localStorage.setItem('nl_otp_parcours', '');
      localStorage.setItem('nl_otp_parcours_echeance', '');
    },
    [user, expiry, lastOtp, options.locked ?? false, options.pinHash] as const
  );
}

export async function clearSession(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}
