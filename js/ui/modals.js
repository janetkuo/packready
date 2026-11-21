import { store } from '../state/store.js';
import { googleDrive } from '../services/googleDrive.js';
import { escapeHtml, renderAll } from './render.js';

let modalSelectedTags = new Set();
let autoSyncTimer = null;

// ── Toast System ──────────────────────────────────────────

export function showToast(message, { actionLabel, onAction, isError = false, duration = 4000 } = {}) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

  if (actionLabel && typeof onAction === 'function') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-action';
    btn.textContent = actionLabel;
    btn.addEventListener('click', () => {
      onAction();
      toast.remove();
    });
    toast.appendChild(btn);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// ── Generic Modal Open / Close ────────────────────────────

export function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  el.hidden = false;
  document.body.style.overflow = 'hidden';
}

export function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (!el) return;
  el.hidden = true;
  const anyOpen = document.querySelector('.modal-overlay:not([hidden])');
  if (!anyOpen) {
    document.body.style.overflow = '';
  }
}

export function closeAllModals() {
  document.querySelectorAll('.modal-overlay:not([hidden])').forEach((el) => {
    el.hidden = true;
  });
  document.body.style.overflow = '';
}

// ── Add / Edit Item Modal ─────────────────────────────────

export function openItemModal(itemId = null, prefillName = '') {
  const titleEl = document.getElementById('modal-item-title');
  const idInput = document.getElementById('item-id');
  const nameInput = document.getElementById('item-name');
  const typeSelect = document.getElementById('item-type');
  const catInput = document.getElementById('item-category');
  const carryOnInput = document.getElementById('item-carryon');
  const noteInput = document.getElementById('item-note');
  const deleteBtn = document.getElementById('btn-delete-item-modal');

  if (itemId) {
    const item = store.state.items.find((i) => i.id === itemId);
    if (!item) return;
    titleEl.textContent = store.t('modalEditTitle');
    idInput.value = item.id;
    nameInput.value = store.getItemDisplayName(item);
    typeSelect.value = item.itemType || 'packing';
    catInput.value = store.getCategoryLabel(item.category || 'essentials');
    carryOnInput.checked = Boolean(item.carryOn);
    noteInput.value = store.getItemDisplayNote(item);
    modalSelectedTags = new Set(item.tags || []);
    deleteBtn.hidden = false;
  } else {
    titleEl.textContent = store.t('modalAddTitle');
    idInput.value = '';
    nameInput.value = prefillName || '';
    typeSelect.value = store.state.typeFilter === 'task' ? 'task' : 'packing';
    catInput.value = store.getCategoryLabel(
      typeSelect.value === 'task' ? 'pre_departure' : 'essentials'
    );
    carryOnInput.checked = store.state.carryOnOnly && typeSelect.value !== 'task';
    noteInput.value = '';
    modalSelectedTags = new Set(store.state.activeTags);
    deleteBtn.hidden = true;
  }

  syncCarryOnVisibility();
  renderModalTagPicker();
  openModal('modal-item');
  setTimeout(() => nameInput.focus(), 50);
}

function syncCarryOnVisibility() {
  const typeSelect = document.getElementById('item-type');
  const carryOnRow = document.getElementById('carryon-row');
  const carryOnInput = document.getElementById('item-carryon');
  if (!typeSelect || !carryOnRow) return;
  const isTask = typeSelect.value === 'task';
  carryOnRow.hidden = isTask;
  if (isTask && carryOnInput) carryOnInput.checked = false;
}

function renderModalTagPicker() {
  const container = document.getElementById('modal-tag-picker');
  if (!container) return;
  const groups = store.getAllTagGroups();

  container.innerHTML = groups
    .map(
      (group) => `
      <div class="tag-group">
        <div class="tag-group-label">${escapeHtml(group.label)}</div>
        <div class="tag-chips">
          ${group.tags
            .map(
              (tag) => `
            <button
              type="button"
              class="tag-chip ${modalSelectedTags.has(tag.id) ? 'active' : ''}"
              data-modal-tag="${escapeHtml(tag.id)}"
              aria-pressed="${modalSelectedTags.has(tag.id)}"
            >
              <span>${escapeHtml(tag.icon)}</span>
              <span>${escapeHtml(tag.label)}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');
}

// ── Custom Tags Modal ─────────────────────────────────────

export function openTagsModal() {
  renderCustomTagsList();
  openModal('modal-tags');
  setTimeout(() => document.getElementById('new-tag-label')?.focus(), 50);
}

function renderCustomTagsList() {
  const container = document.getElementById('custom-tags-list');
  if (!container) return;
  const tags = store.state.customTags;

  if (tags.length === 0) {
    container.innerHTML = `<p class="form-help">${escapeHtml(store.t('noCustomTags'))}</p>`;
    return;
  }

  container.innerHTML = tags
    .map(
      (tag) => `
      <div class="custom-tag-row">
        <span>${escapeHtml(tag.icon)} ${escapeHtml(tag.label)}</span>
        <button type="button" class="link-btn link-danger" data-delete-custom-tag="${escapeHtml(tag.id)}">${escapeHtml(store.t('deleteBtn'))}</button>
      </div>
    `
    )
    .join('');
}

// ── Reset Modal ───────────────────────────────────────────

export function openResetModal() {
  const allChecked = store.state.items.filter((i) => i.checked).length;
  const visibleChecked = store.getFilteredItems().filter((i) => i.checked).length;

  const allBtn = document.getElementById('btn-reset-all-checks');
  const visBtn = document.getElementById('btn-reset-visible-checks');
  if (allBtn) allBtn.textContent = store.t('resetAllBtn', { count: allChecked });
  if (visBtn) visBtn.textContent = store.t('resetVisibleBtn', { count: visibleChecked });
  openModal('modal-reset');
}

// ── Backup & Google Drive Modal ───────────────────────────

export function openBackupModal() {
  const originEl = document.getElementById('current-origin-code');
  if (originEl) originEl.textContent = window.location.origin;

  const clientIdInput = document.getElementById('drive-client-id');
  if (clientIdInput) clientIdInput.value = store.state.driveConfig.clientId || '';

  const autoSyncInput = document.getElementById('drive-autosync');
  if (autoSyncInput) autoSyncInput.checked = Boolean(store.state.driveConfig.autoSync);

  updateDriveUI();
  openModal('modal-backup');
}

export function updateDriveUI() {
  const signedIn = googleDrive.isSignedIn();
  const dot = document.getElementById('drive-status-dot');
  const badge = document.getElementById('drive-badge');
  const lastSyncEl = document.getElementById('drive-last-sync');
  const userInfoEl = document.getElementById('drive-user-info');
  const signInBtn = document.getElementById('btn-drive-signin');
  const connectedActions = document.getElementById('drive-connected-actions');
  const autoSyncRow = document.getElementById('drive-autosync-row');
  const signOutRow = document.getElementById('drive-signout-row');

  if (dot) dot.hidden = !signedIn;

  if (badge) {
    badge.textContent = signedIn ? store.t('driveConnected') : store.t('driveDisconnected');
    badge.classList.toggle('connected', signedIn);
  }

  if (lastSyncEl) {
    const ts = store.state.driveConfig.lastSyncedAt;
    lastSyncEl.textContent = ts
      ? store.t('driveLastSynced', { time: formatDateTime(ts) })
      : store.t('driveNeverSynced');
  }

  if (userInfoEl) {
    if (signedIn && googleDrive.userInfo) {
      const { displayName, emailAddress } = googleDrive.userInfo;
      userInfoEl.textContent = `👤 ${displayName || ''}${emailAddress ? ` (${emailAddress})` : ''}`;
      userInfoEl.hidden = false;
    } else {
      userInfoEl.hidden = true;
    }
  }

  if (signInBtn) signInBtn.hidden = signedIn;
  if (connectedActions) connectedActions.hidden = !signedIn;
  if (autoSyncRow) autoSyncRow.hidden = !signedIn;
  if (signOutRow) signOutRow.hidden = !signedIn;
}

export function scheduleAutoSyncIfEnabled() {
  if (!googleDrive.isSignedIn() || !store.state.driveConfig.autoSync) return;
  clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(async () => {
    try {
      const payload = store.exportBackupPayload();
      const res = await googleDrive.uploadBackup(payload, store.state.driveConfig.fileId);
      store.updateDriveConfig({
        fileId: res.fileId,
        lastSyncedAt: res.modifiedTime,
      });
      updateDriveUI();
    } catch (err) {
      console.warn('Auto-sync failed:', err);
    }
  }, 2500);
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString(store.lang === 'zh-TW' ? 'zh-TW' : 'en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

// ── Bind All Modal Events ─────────────────────────────────

export function bindModalEvents() {
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  // ── Item Form Modal ──
  const typeSelect = document.getElementById('item-type');
  typeSelect?.addEventListener('change', () => {
    syncCarryOnVisibility();
    const catInput = document.getElementById('item-category');
    const essentialsLabel = store.getCategoryLabel('essentials');
    const preDepLabel = store.getCategoryLabel('pre_departure');
    if (typeSelect.value === 'task' && (!catInput.value || catInput.value === essentialsLabel)) {
      catInput.value = preDepLabel;
    } else if (typeSelect.value === 'packing' && catInput.value === preDepLabel) {
      catInput.value = essentialsLabel;
    }
  });

  document.getElementById('modal-tag-picker')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-modal-tag]');
    if (!chip) return;
    const tagId = chip.dataset.modalTag;
    if (modalSelectedTags.has(tagId)) {
      modalSelectedTags.delete(tagId);
    } else {
      modalSelectedTags.add(tagId);
    }
    chip.classList.toggle('active', modalSelectedTags.has(tagId));
    chip.setAttribute('aria-pressed', String(modalSelectedTags.has(tagId)));
  });

  document.getElementById('item-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value.trim();
    const itemType = document.getElementById('item-type').value;
    const category = document.getElementById('item-category').value.trim() || 'essentials';
    const carryOn = itemType === 'task' ? false : document.getElementById('item-carryon').checked;
    const note = document.getElementById('item-note').value.trim();
    const tags = [...modalSelectedTags];

    if (!name) return;

    if (id) {
      store.updateItem(id, { name, itemType, category, carryOn, note, tags });
      showToast(store.t('toastUpdated', { name }));
    } else {
      store.addItem({ name, itemType, category, carryOn, note, tags });
      showToast(store.t('toastAdded', { name }));
    }
    closeModal('modal-item');
    scheduleAutoSyncIfEnabled();
  });

  document.getElementById('btn-delete-item-modal')?.addEventListener('click', () => {
    const id = document.getElementById('item-id').value;
    if (!id) return;
    const removed = store.deleteItem(id);
    closeModal('modal-item');
    if (removed) {
      showToast(store.t('toastDeleted', { name: store.getItemDisplayName(removed) }), {
        actionLabel: store.t('toastUndo'),
        onAction: () => {
          store.undo();
          showToast(store.t('toastRestoredItem'));
        },
        duration: 6000,
      });
      scheduleAutoSyncIfEnabled();
    }
  });

  // ── Custom Tags Modal ──
  document.getElementById('quick-emojis')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.emoji-btn');
    if (!btn) return;
    document.getElementById('new-tag-icon').value = btn.textContent.trim();
    document.getElementById('new-tag-label').focus();
  });

  document.getElementById('custom-tag-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const icon = document.getElementById('new-tag-icon').value.trim() || '🏷️';
    const labelInput = document.getElementById('new-tag-label');
    const label = labelInput.value.trim();
    if (!label) return;
    store.addCustomTag(label, icon);
    labelInput.value = '';
    renderCustomTagsList();
    showToast(store.t('toastAddedTag', { icon, label }));
    scheduleAutoSyncIfEnabled();
  });

  document.getElementById('custom-tags-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-delete-custom-tag]');
    if (!btn) return;
    store.deleteCustomTag(btn.dataset.deleteCustomTag);
    renderCustomTagsList();
    showToast(store.t('toastDeletedTag'));
    scheduleAutoSyncIfEnabled();
  });

  // ── Reset Modal ──
  document.getElementById('btn-reset-all-checks')?.addEventListener('click', () => {
    const count = store.resetChecks('all');
    closeModal('modal-reset');
    if (count === 0) {
      showToast(store.t('toastNoCheckedAll'));
    } else {
      showToast(store.t('toastResetAll', { count }), {
        actionLabel: store.t('toastUndo'),
        onAction: () => {
          store.undo();
          showToast(store.t('toastRestoredChecks'));
        },
        duration: 7000,
      });
      scheduleAutoSyncIfEnabled();
    }
  });

  document.getElementById('btn-reset-visible-checks')?.addEventListener('click', () => {
    const count = store.resetChecks('visible');
    closeModal('modal-reset');
    if (count === 0) {
      showToast(store.t('toastNoCheckedVisible'));
    } else {
      showToast(store.t('toastResetVisible', { count }), {
        actionLabel: store.t('toastUndo'),
        onAction: () => {
          store.undo();
          showToast(store.t('toastRestoredChecks'));
        },
        duration: 7000,
      });
      scheduleAutoSyncIfEnabled();
    }
  });

  document.getElementById('btn-restore-defaults')?.addEventListener('click', () => {
    store.restoreDefaultItems({ keepCustom: true });
    closeModal('modal-reset');
    showToast(store.t('toastRestoredDefaults'), {
      actionLabel: store.t('toastUndo'),
      onAction: () => store.undo(),
      duration: 6000,
    });
  });

  // ── Backup Modal Tabs ──
  document.querySelectorAll('#modal-backup .modal-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('#modal-backup .modal-tab').forEach((tEl) => {
        tEl.classList.toggle('active', tEl === tab);
      });
      document.getElementById('tab-panel-drive').hidden = target !== 'drive';
      document.getElementById('tab-panel-file').hidden = target !== 'file';
    });
  });

  // ── Google Drive Actions ──
  document.getElementById('btn-save-client-id')?.addEventListener('click', () => {
    const val = document.getElementById('drive-client-id').value.trim();
    store.updateDriveConfig({ clientId: val });
    showToast(val ? store.t('toastSavedClientId') : store.t('toastClearedClientId'));
  });

  document.getElementById('btn-drive-signin')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-drive-signin');
    const clientId = document.getElementById('drive-client-id').value.trim();
    store.updateDriveConfig({ clientId });

    btn.disabled = true;
    btn.textContent = store.t('driveConnecting');
    try {
      await googleDrive.signIn(clientId);
      updateDriveUI();
      showToast(store.t('toastDriveConnected'));
    } catch (err) {
      showToast(err.message || 'Google Drive connection failed', { isError: true, duration: 6000 });
    } finally {
      btn.disabled = false;
      btn.textContent = store.t('driveSignInBtn');
    }
  });

  document.getElementById('btn-drive-upload')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-drive-upload');
    btn.disabled = true;
    btn.textContent = store.t('driveUploading');
    try {
      const payload = store.exportBackupPayload();
      const res = await googleDrive.uploadBackup(payload, store.state.driveConfig.fileId);
      store.updateDriveConfig({
        fileId: res.fileId,
        lastSyncedAt: res.modifiedTime,
      });
      updateDriveUI();
      showToast(store.t('toastDriveUploaded', { count: payload.data.items.length }));
    } catch (err) {
      updateDriveUI();
      showToast(err.message || 'Upload failed', { isError: true, duration: 6000 });
    } finally {
      btn.disabled = false;
      btn.textContent = store.t('driveUploadBtn');
    }
  });

  document.getElementById('btn-drive-download')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-drive-download');
    btn.disabled = true;
    btn.textContent = store.t('driveDownloading');
    try {
      const res = await googleDrive.downloadBackup(store.state.driveConfig.fileId);
      const count = res.payload?.data?.items?.length ?? 0;
      const confirmed = window.confirm(
        store.t('confirmDriveRestore', { count, time: formatDateTime(res.modifiedTime) })
      );
      if (confirmed) {
        store.importBackupPayload(res.payload, 'replace');
        store.updateDriveConfig({
          fileId: res.fileId,
          lastSyncedAt: res.modifiedTime,
        });
        updateDriveUI();
        renderAll();
        showToast(store.t('toastDriveRestored', { count }));
      }
    } catch (err) {
      updateDriveUI();
      showToast(err.message || 'Restore failed', { isError: true, duration: 6000 });
    } finally {
      btn.disabled = false;
      btn.textContent = store.t('driveDownloadBtn');
    }
  });

  document.getElementById('drive-autosync')?.addEventListener('change', (e) => {
    store.updateDriveConfig({ autoSync: e.target.checked });
    showToast(e.target.checked ? store.t('toastAutoSyncOn') : store.t('toastAutoSyncOff'));
  });

  document.getElementById('btn-drive-signout')?.addEventListener('click', () => {
    googleDrive.signOut();
    updateDriveUI();
    showToast(store.t('toastDriveSignedOut'));
  });

  // ── Local JSON Export / Import ──
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const payload = store.exportBackupPayload();
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packready-backup-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(store.t('toastExportedJson', { count: payload.data.items.length }));
  });

  const jsonInput = document.getElementById('input-import-json');
  document.getElementById('btn-trigger-import-json')?.addEventListener('click', () => {
    jsonInput.value = '';
    jsonInput.click();
  });

  jsonInput?.addEventListener('change', async () => {
    const file = jsonInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const mode = document.querySelector('input[name="import-mode"]:checked')?.value || 'merge';
      const result = store.importBackupPayload(payload, mode);
      closeModal('modal-backup');
      showToast(
        mode === 'merge'
          ? store.t('toastImportedMerge', { count: result.count })
          : store.t('toastImportedReplace', { count: result.count })
      );
      scheduleAutoSyncIfEnabled();
    } catch (err) {
      showToast(err.message || 'JSON import failed', { isError: true });
    }
  });

  // ── Local CSV Import ──
  const csvInput = document.getElementById('input-import-csv');
  document.getElementById('btn-trigger-import-csv')?.addEventListener('click', () => {
    csvInput.value = '';
    csvInput.click();
  });

  csvInput?.addEventListener('change', async () => {
    const file = csvInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { added } = store.importFromCsv(text);
      closeModal('modal-backup');
      showToast(
        added > 0
          ? store.t('toastImportedCsv', { count: added })
          : store.t('toastImportedCsvNone')
      );
      scheduleAutoSyncIfEnabled();
    } catch (err) {
      showToast(err.message || 'CSV import failed', { isError: true });
    }
  });
}
