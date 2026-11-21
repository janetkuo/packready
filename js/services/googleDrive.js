/**
 * Google Drive Backup Service (Client-Side, GitHub Pages compatible)
 * Uses Google Identity Services (GIS) OAuth 2.0 + Drive REST API v3.
 * Scope: https://www.googleapis.com/auth/drive.file (only files created by this app).
 */

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const BACKUP_FILENAME = 'packready-backup.json';
const SESSION_STORAGE_KEY = 'packready_drive_session_v1';

export const DEFAULT_GOOGLE_CLIENT_ID =
  '592001205133-6f41prs5p41s92e61pae5eb34rs05as2.apps.googleusercontent.com';

class GoogleDriveService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.userInfo = null;
    this.lastEmail = null;
    this.hasConsented = false;
    this.gisLoaded = false;
    this.tokenClient = null;
    this.activeClientId = null;

    this.restoreSession();
  }

  restoreSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      this.lastEmail = saved.lastEmail || null;
      this.hasConsented = Boolean(saved.hasConsented);
      if (saved.accessToken && saved.tokenExpiresAt && Date.now() < saved.tokenExpiresAt - 30_000) {
        this.accessToken = saved.accessToken;
        this.tokenExpiresAt = saved.tokenExpiresAt;
        this.userInfo = saved.userInfo || null;
      }
    } catch {
      // Ignore corrupt session cache
    }
  }

  persistSession() {
    try {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          accessToken: this.accessToken,
          tokenExpiresAt: this.tokenExpiresAt,
          userInfo: this.userInfo,
          lastEmail: this.lastEmail,
          hasConsented: this.hasConsented,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  clearAccessToken() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.persistSession();
  }

  isSignedIn() {
    return Boolean(this.accessToken && Date.now() < this.tokenExpiresAt - 30_000);
  }

  async loadGisScript() {
    if (this.gisLoaded && window.google?.accounts?.oauth2) return;
    if (window.google?.accounts?.oauth2) {
      this.gisLoaded = true;
      return;
    }

    await new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GIS_SCRIPT_URL}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener(
          'error',
          () => reject(new Error('Failed to load Google Sign-In script. Check your network connection.')),
          { once: true }
        );
        return;
      }
      const script = document.createElement('script');
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Google Sign-In script. Check your network connection.'));
      document.head.appendChild(script);
    });

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Failed to initialize Google Identity Services.');
    }
    this.gisLoaded = true;
  }

  async signIn(clientId, { forceConsent = false } = {}) {
    const trimmed = (clientId || '').trim();
    if (!trimmed) {
      throw new Error('Please enter your Google OAuth Client ID first.');
    }
    if (!trimmed.endsWith('.apps.googleusercontent.com')) {
      throw new Error('Invalid Client ID format — it should end with .apps.googleusercontent.com');
    }

    await this.loadGisScript();

    // If user already granted consent before, use prompt: '' to skip re-consent screen
    const promptMode = forceConsent || !this.hasConsented ? 'consent' : '';

    const tokenResponse = await new Promise((resolve, reject) => {
      try {
        this.activeClientId = trimmed;
        const clientConfig = {
          client_id: trimmed,
          scope: DRIVE_SCOPE,
          callback: (resp) => {
            if (resp.error) {
              reject(new Error(`Google authorization failed: ${resp.error_description || resp.error}`));
              return;
            }
            resolve(resp);
          },
          error_callback: (err) => {
            if (err?.type === 'popup_closed') {
              reject(new Error('Google sign-in popup was closed.'));
            } else if (err?.type === 'popup_failed_to_open') {
              reject(
                new Error('Popup blocked by browser. Please allow popups for this site and try again.')
              );
            } else {
              reject(
                new Error('Google sign-in error. Please verify your Client ID and Authorized JavaScript Origins.')
              );
            }
          },
        };

        if (this.lastEmail) {
          clientConfig.hint = this.lastEmail;
        }

        this.tokenClient = window.google.accounts.oauth2.initTokenClient(clientConfig);
        this.tokenClient.requestAccessToken({ prompt: promptMode });
      } catch (err) {
        reject(err);
      }
    });

    this.accessToken = tokenResponse.access_token;
    const expiresInSec = Number(tokenResponse.expires_in) || 3600;
    this.tokenExpiresAt = Date.now() + expiresInSec * 1000;
    this.hasConsented = true;

    // Fetch display name & email via Drive about endpoint
    try {
      const about = await this.driveFetch(
        'https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress,photoLink)'
      );
      this.userInfo = about.user || null;
      if (this.userInfo?.emailAddress) {
        this.lastEmail = this.userInfo.emailAddress;
      }
    } catch {
      this.userInfo = null;
    }

    this.persistSession();

    return {
      user: this.userInfo,
      expiresAt: this.tokenExpiresAt,
    };
  }

  signOut() {
    if (this.accessToken && window.google?.accounts?.oauth2) {
      try {
        window.google.accounts.oauth2.revoke(this.accessToken);
      } catch {
        // Ignore revoke errors
      }
    }
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.userInfo = null;
    this.lastEmail = null;
    this.hasConsented = false;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  async driveFetch(url, options = {}) {
    if (!this.isSignedIn()) {
      throw new Error('Google session expired. Please reconnect to Google Drive.');
    }
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${this.accessToken}`);

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      this.clearAccessToken();
      throw new Error('Google authorization expired. Please sign in again.');
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Google Drive API error (${res.status}): ${text.slice(0, 140)}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    return res.text();
  }

  async findBackupFile(knownFileId = null) {
    if (knownFileId) {
      try {
        const meta = await this.driveFetch(
          `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(knownFileId)}?fields=id,name,modifiedTime,trashed`
        );
        if (meta && !meta.trashed) return meta;
      } catch {
        // Fallback to search by filename
      }
    }

    const q = encodeURIComponent(`name='${BACKUP_FILENAME}' and trashed=false`);
    const list = await this.driveFetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=drive&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)&pageSize=5`
    );
    return list?.files?.[0] || null;
  }

  async uploadBackup(payload, knownFileId = null, { expectedModifiedTime = null, force = false } = {}) {
    const existing = await this.findBackupFile(knownFileId);

    // Conflict guard: prevent overwriting a newer (or previously unknown) remote backup
    if (!force && existing?.modifiedTime) {
      const remoteMs = new Date(existing.modifiedTime).getTime();
      const localMs = expectedModifiedTime ? new Date(expectedModifiedTime).getTime() : 0;
      if (!expectedModifiedTime || (Number.isFinite(remoteMs) && remoteMs > localMs + 2000)) {
        const conflictErr = new Error('DRIVE_CONFLICT');
        conflictErr.code = 'DRIVE_CONFLICT';
        conflictErr.remoteModifiedTime = existing.modifiedTime;
        conflictErr.fileId = existing.id;
        throw conflictErr;
      }
    }

    const metadata = {
      name: BACKUP_FILENAME,
      mimeType: 'application/json',
    };

    const boundary = `packready_boundary_${Date.now()}`;
    const body = [
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify(metadata),
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify(payload, null, 2),
      `--${boundary}--`,
    ].join('\r\n');

    const url = existing
      ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(existing.id)}?uploadType=multipart&fields=id,name,modifiedTime`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime';

    const result = await this.driveFetch(url, {
      method: existing ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    });

    return {
      fileId: result.id,
      modifiedTime: result.modifiedTime || new Date().toISOString(),
      isNew: !existing,
    };
  }

  async downloadBackup(knownFileId = null) {
    const existing = await this.findBackupFile(knownFileId);
    if (!existing) {
      throw new Error(`Backup file (${BACKUP_FILENAME}) not found in Google Drive. Please back up once first.`);
    }

    const raw = await this.driveFetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(existing.id)}?alt=media`
    );
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return {
      fileId: existing.id,
      modifiedTime: existing.modifiedTime,
      payload,
    };
  }
}

export const googleDrive = new GoogleDriveService();
