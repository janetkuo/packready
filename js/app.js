import { store } from './state/store.js';
import { renderAll } from './ui/render.js';
import {
  bindModalEvents,
  closeAllModals,
  openBackupModal,
  openItemModal,
  openResetModal,
  openTagsModal,
  scheduleAutoSyncIfEnabled,
  showToast,
  updateDriveUI,
} from './ui/modals.js';

// ── Theme Handling ────────────────────────────────────────

function applyTheme() {
  const pref = store.state.theme;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const effective = pref === 'auto' ? (prefersDark ? 'dark' : 'light') : pref;
  document.documentElement.setAttribute('data-theme', effective);

  const iconEl = document.getElementById('theme-icon');
  if (iconEl) iconEl.textContent = effective === 'dark' ? '☀️' : '🌙';

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', effective === 'dark' ? '#111417' : '#0F766E');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  store.setTheme(current === 'dark' ? 'light' : 'dark');
  applyTheme();
}

// ── Mobile Filter Drawer ──────────────────────────────────

function openMobileDrawer() {
  const sidebar = document.getElementById('filter-sidebar');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!sidebar || !backdrop) return;
  sidebar.classList.add('open');
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  const sidebar = document.getElementById('filter-sidebar');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!sidebar || !backdrop) return;
  sidebar.classList.remove('open');
  backdrop.hidden = true;
  if (!document.querySelector('.modal-overlay:not([hidden])')) {
    document.body.style.overflow = '';
  }
}

// ── Main Event Bindings ───────────────────────────────────

function bindEvents() {
  // Header actions
  document.getElementById('btn-open-backup')?.addEventListener('click', openBackupModal);
  document.getElementById('btn-open-reset')?.addEventListener('click', openResetModal);
  document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
    store.toggleLang();
    updateDriveUI();
  });
  document.getElementById('btn-toggle-theme')?.addEventListener('click', toggleTheme);
  document.getElementById('btn-open-add')?.addEventListener('click', () => openItemModal());
  document.getElementById('btn-fab-add')?.addEventListener('click', () => openItemModal());

  // Mobile drawer
  document.getElementById('btn-open-mobile-drawer')?.addEventListener('click', openMobileDrawer);
  document.getElementById('btn-close-mobile-drawer')?.addEventListener('click', closeMobileDrawer);
  document.getElementById('btn-apply-mobile-drawer')?.addEventListener('click', closeMobileDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closeMobileDrawer);

  // Presets
  document.getElementById('presets-list')?.addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-preset]');
    if (delBtn) {
      e.stopPropagation();
      store.deleteCustomPreset(delBtn.dataset.deletePreset);
      showToast(store.t('presetDeleted'));
      scheduleAutoSyncIfEnabled();
      return;
    }
    const chip = e.target.closest('[data-preset-id]');
    if (!chip) return;
    store.applyPreset(chip.dataset.presetId);
  });

  document.getElementById('btn-save-preset')?.addEventListener('click', () => {
    const name = window.prompt(store.t('savePresetPrompt'));
    if (!name || !name.trim()) return;
    store.saveCustomPreset(name.trim(), '🗺️');
    showToast(store.t('presetSaved', { name: name.trim() }));
    scheduleAutoSyncIfEnabled();
  });

  // Custom tags modal trigger
  document.getElementById('btn-manage-tags')?.addEventListener('click', openTagsModal);

  // Clear active tags
  document.getElementById('btn-clear-tags')?.addEventListener('click', () => {
    store.clearActiveTags();
  });

  // Filter mode segmented control
  document.getElementById('filter-mode-control')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    store.setFilterMode(btn.dataset.mode);
  });

  // Sidebar tag chips
  document.getElementById('sidebar-tag-groups')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-tag-id]');
    if (!chip) return;
    if (store.state.filterMode === 'all') {
      store.setFilterMode('trip');
    }
    store.toggleTag(chip.dataset.tagId);
  });

  // Toolbar search
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('input', () => {
    store.setSearchQuery(searchInput.value);
  });

  document.getElementById('btn-clear-search')?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    store.setSearchQuery('');
    searchInput?.focus();
  });

  // Toolbar type filter
  document.getElementById('type-filter-control')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-type]');
    if (!btn) return;
    store.setTypeFilter(btn.dataset.type);
  });

  // Toolbar carry-on & unpacked toggles
  document.getElementById('btn-filter-carryon')?.addEventListener('click', () => {
    store.setCarryOnOnly(!store.state.carryOnOnly);
  });

  document.getElementById('btn-filter-unpacked')?.addEventListener('click', () => {
    store.setUnpackedOnly(!store.state.unpackedOnly);
  });

  // Quick inline add form
  document.getElementById('quick-add-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('quick-add-name');
    const select = document.getElementById('quick-add-category');
    const name = input.value.trim();
    if (!name) return;

    const category = select.value || 'essentials';
    const isTask = category === 'pre_departure' || store.state.typeFilter === 'task';
    store.addItem({
      name,
      category: isTask ? 'pre_departure' : category,
      itemType: isTask ? 'task' : 'packing',
      carryOn: !isTask && store.state.carryOnOnly,
      tags: [...store.state.activeTags],
      note: '',
    });

    input.value = '';
    showToast(store.t('toastAdded', { name }));
    scheduleAutoSyncIfEnabled();
  });

  // Checklist delegation
  document.getElementById('checklist-container')?.addEventListener('click', (e) => {
    const emptyBtn = e.target.closest('[data-empty-action]');
    if (emptyBtn) {
      if (emptyBtn.dataset.emptyAction === 'clear-filters') {
        if (searchInput) searchInput.value = '';
        store.setSearchQuery('');
        store.setTypeFilter('all');
        store.setCarryOnOnly(false);
        store.setUnpackedOnly(false);
      } else if (emptyBtn.dataset.emptyAction === 'add-item') {
        openItemModal(null, store.state.searchQuery.trim());
      }
      return;
    }

    const catHeader = e.target.closest('[data-toggle-category]');
    if (catHeader) {
      store.toggleCategoryCollapse(catHeader.dataset.toggleCategory);
      return;
    }

    const editBtn = e.target.closest('[data-edit-item]');
    if (editBtn) {
      e.stopPropagation();
      openItemModal(editBtn.dataset.editItem);
      return;
    }

    const delBtn = e.target.closest('[data-delete-item]');
    if (delBtn) {
      e.stopPropagation();
      const removed = store.deleteItem(delBtn.dataset.deleteItem);
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
      return;
    }

    const toggleEl = e.target.closest('[data-toggle-item]');
    if (toggleEl) {
      store.toggleItem(toggleEl.dataset.toggleItem);
      scheduleAutoSyncIfEnabled();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeMobileDrawer();
      return;
    }

    const tag = document.activeElement?.tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (isTyping) return;

    if (e.key === '/') {
      e.preventDefault();
      searchInput?.focus();
    } else if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      openItemModal();
    }
  });

  // System theme change listener
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (store.state.theme === 'auto') applyTheme();
  });
}

// ── Bootstrap ─────────────────────────────────────────────

function init() {
  applyTheme();
  store.subscribe(() => renderAll());
  bindEvents();
  bindModalEvents();
  updateDriveUI();
  renderAll();
}

init();
