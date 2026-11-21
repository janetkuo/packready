import { store } from '../state/store.js';

const RING_CIRCUMFERENCE = 2 * Math.PI * 20; // r = 20

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sameTagSet(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((x) => setA.has(x));
}

export function applyStaticTranslations() {
  document.documentElement.lang = store.lang === 'zh-TW' ? 'zh-Hant' : 'en';
  document.title = store.t('appTitle');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = store.t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = store.t(el.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = store.t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = store.t(el.dataset.i18nTitle);
  });

  const driveHelp = document.getElementById('drive-client-id-help');
  if (driveHelp) {
    driveHelp.innerHTML = escapeHtml(
      store.t('driveClientIdHelp', { file: '___FILE___' })
    ).replace('___FILE___', '<code>packready-backup.json</code>');
  }
}

export function renderAll() {
  applyStaticTranslations();
  renderProgress();
  renderPresets();
  renderFilterControls();
  renderSidebarTags();
  renderCategoryOptions();
  renderChecklist();
}

export function renderProgress() {
  const stats = store.getProgressStats();
  const { activeTags, filterMode } = store.state;
  const tagMap = store.getAllTagsMap();

  // Desktop ring
  const numsEl = document.getElementById('sidebar-progress-nums');
  const pctEl = document.getElementById('sidebar-progress-pct');
  const ringEl = document.getElementById('progress-ring-fg');
  const breakdownEl = document.getElementById('sidebar-progress-breakdown');
  const bannerEl = document.getElementById('complete-banner');

  if (numsEl) numsEl.textContent = `${stats.checked} / ${stats.total}`;
  if (pctEl) pctEl.textContent = `${stats.percent}%`;
  if (ringEl) {
    const offset = RING_CIRCUMFERENCE * (1 - stats.percent / 100);
    ringEl.style.strokeDashoffset = `${offset}`;
  }
  if (breakdownEl) {
    breakdownEl.innerHTML = `
      <span>🧳 ${escapeHtml(store.t('packingCount', { checked: stats.packingChecked, total: stats.packingTotal }))}</span>
      <span>🏠 ${escapeHtml(store.t('taskCount', { checked: stats.taskChecked, total: stats.taskTotal }))}</span>
    `;
  }
  if (bannerEl) {
    bannerEl.hidden = !(stats.total > 0 && stats.checked === stats.total);
  }

  // Mobile strip
  const mobileText = document.getElementById('mobile-progress-text');
  const mobilePct = document.getElementById('mobile-progress-pct');
  const mobileFill = document.getElementById('mobile-progress-fill');
  const mobileCount = document.getElementById('mobile-active-tag-count');
  const mobilePills = document.getElementById('mobile-active-pills');
  const drawerApplyLabel = document.getElementById('drawer-apply-label');

  if (mobileText) {
    mobileText.textContent = store.t('mobileProgress', {
      checked: stats.checked,
      total: stats.total,
    });
  }
  if (mobilePct) mobilePct.textContent = `${stats.percent}%`;
  if (mobileFill) mobileFill.style.width = `${stats.percent}%`;
  if (drawerApplyLabel) {
    drawerApplyLabel.textContent = store.t('viewListCount', { count: stats.total });
  }

  if (mobileCount) {
    if (activeTags.length > 0) {
      mobileCount.textContent = `${activeTags.length}`;
      mobileCount.hidden = false;
    } else {
      mobileCount.hidden = true;
    }
  }

  if (mobilePills) {
    if (filterMode === 'all') {
      mobilePills.innerHTML = `<span class="mini-pill">📋 ${escapeHtml(store.t('modeAllBadge'))}</span>`;
    } else if (activeTags.length === 0) {
      mobilePills.innerHTML = `<span class="mini-pill">🧳 ${escapeHtml(store.t('baseRequired'))}</span>`;
    } else {
      const modeBadge =
        filterMode === 'strict'
          ? `<span class="mini-pill">🔎 ${escapeHtml(store.t('modeStrictBadge'))}</span>`
          : '';
      const pills = activeTags
        .map((id) => tagMap.get(id))
        .filter(Boolean)
        .map((tItem) => `<span class="mini-pill">${escapeHtml(tItem.icon)} ${escapeHtml(tItem.label)}</span>`)
        .join('');
      mobilePills.innerHTML = modeBadge + pills;
    }
  }
}

export function renderPresets() {
  const container = document.getElementById('presets-list');
  if (!container) return;

  const { activeTags, filterMode } = store.state;
  const presets = store.getAllPresets();

  container.innerHTML = presets
    .map((preset) => {
      const isActive = filterMode !== 'all' && sameTagSet(activeTags, preset.tags);
      const delBtn = preset.isBuiltIn
        ? ''
        : `<span class="preset-del" data-delete-preset="${escapeHtml(preset.id)}" title="${escapeHtml(store.t('deletePresetAria'))}" role="button" aria-label="${escapeHtml(store.t('deletePresetAria'))}">✕</span>`;
      return `
        <button type="button" class="preset-chip ${isActive ? 'active' : ''}" data-preset-id="${escapeHtml(preset.id)}">
          <span>${escapeHtml(preset.icon)}</span>
          <span>${escapeHtml(preset.name)}</span>
          ${delBtn}
        </button>
      `;
    })
    .join('');
}

export function renderFilterControls() {
  const { filterMode, typeFilter, carryOnOnly, unpackedOnly, searchQuery, activeTags } = store.state;

  document.querySelectorAll('#filter-mode-control .seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === filterMode);
  });

  const hintEl = document.getElementById('filter-mode-hint');
  if (hintEl) {
    if (filterMode === 'trip') {
      hintEl.textContent = store.t('hintTrip');
    } else if (filterMode === 'strict') {
      hintEl.textContent =
        activeTags.length > 0 ? store.t('hintStrictWithTags') : store.t('hintStrictNoTags');
    } else {
      hintEl.textContent = store.t('hintAll');
    }
  }

  const clearTagsBtn = document.getElementById('btn-clear-tags');
  if (clearTagsBtn) {
    clearTagsBtn.hidden = activeTags.length === 0;
  }

  document.querySelectorAll('#type-filter-control .seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.type === typeFilter);
  });

  const carryOnBtn = document.getElementById('btn-filter-carryon');
  if (carryOnBtn) carryOnBtn.setAttribute('aria-pressed', String(carryOnOnly));

  const unpackedBtn = document.getElementById('btn-filter-unpacked');
  if (unpackedBtn) unpackedBtn.setAttribute('aria-pressed', String(unpackedOnly));

  const clearSearchBtn = document.getElementById('btn-clear-search');
  if (clearSearchBtn) clearSearchBtn.hidden = !searchQuery;
}

export function renderSidebarTags() {
  const container = document.getElementById('sidebar-tag-groups');
  if (!container) return;

  const groups = store.getAllTagGroups();
  const activeSet = new Set(store.state.activeTags);

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
              class="tag-chip ${activeSet.has(tag.id) ? 'active' : ''}"
              data-tag-id="${escapeHtml(tag.id)}"
              aria-pressed="${activeSet.has(tag.id)}"
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

export function renderCategoryOptions() {
  const categories = store.getAllCategories();
  const quickSelect = document.getElementById('quick-add-category');
  const datalist = document.getElementById('category-datalist');

  if (quickSelect) {
    const prevVal = quickSelect.value;
    quickSelect.innerHTML = categories
      .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.icon)} ${escapeHtml(c.label)}</option>`)
      .join('');
    if (prevVal && categories.some((c) => c.id === prevVal)) {
      quickSelect.value = prevVal;
    }
  }

  if (datalist) {
    datalist.innerHTML = categories
      .map((c) => `<option value="${escapeHtml(c.label)}"></option>`)
      .join('');
  }
}

export function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;

  const items = store.getFilteredItems();
  const tagMap = store.getAllTagsMap();
  const collapsedSet = new Set(store.state.collapsedCategories);

  if (items.length === 0) {
    const hasSearchOrSub =
      Boolean(store.state.searchQuery.trim()) ||
      store.state.carryOnOnly ||
      store.state.unpackedOnly ||
      store.state.typeFilter !== 'all';

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${store.state.unpackedOnly ? '🎉' : '🧳'}</div>
        <h3 class="empty-title">${escapeHtml(
          store.state.unpackedOnly ? store.t('emptyAllDoneTitle') : store.t('emptyNoMatchTitle')
        )}</h3>
        <p class="empty-desc">
          ${escapeHtml(hasSearchOrSub ? store.t('emptyWithFiltersDesc') : store.t('emptyNoFiltersDesc'))}
        </p>
        <div class="empty-actions">
          ${
            hasSearchOrSub
              ? `<button type="button" class="btn btn-soft" data-empty-action="clear-filters">${escapeHtml(store.t('clearViewFilters'))}</button>`
              : ''
          }
          <button type="button" class="btn btn-primary" data-empty-action="add-item">＋ ${escapeHtml(store.t('addItem'))}</button>
        </div>
      </div>
    `;
    return;
  }

  const categoryOrder = store.getAllCategories().map((c) => c.id);
  const grouped = new Map();

  for (const item of items) {
    const cat = item.category || 'essentials';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(item);
  }

  const orderedCategories = [...grouped.keys()].sort((a, b) => {
    const ia = categoryOrder.indexOf(a);
    const ib = categoryOrder.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  container.innerHTML = orderedCategories
    .map((cat) => {
      const catItems = grouped.get(cat);
      const checkedCount = catItems.filter((i) => i.checked).length;
      const isDone = checkedCount === catItems.length;
      const isCollapsed = collapsedSet.has(cat);
      const icon = store.getCategoryIcon(cat);
      const label = store.getCategoryLabel(cat);

      return `
        <section class="category-card ${isCollapsed ? 'collapsed' : ''}" data-category="${escapeHtml(cat)}">
          <button type="button" class="category-header" data-toggle-category="${escapeHtml(cat)}" aria-expanded="${!isCollapsed}">
            <div class="category-header-left">
              <span class="category-icon" aria-hidden="true">${escapeHtml(icon)}</span>
              <span class="category-name">${escapeHtml(label)}</span>
            </div>
            <div class="category-header-right">
              <span class="category-count ${isDone ? 'done' : ''}">${checkedCount} / ${catItems.length}</span>
              <span class="category-chevron" aria-hidden="true">▾</span>
            </div>
          </button>
          <ul class="category-items">
            ${catItems.map((item) => renderItemRow(item, tagMap)).join('')}
          </ul>
        </section>
      `;
    })
    .join('');
}

function renderItemRow(item, tagMap) {
  const displayName = store.getItemDisplayName(item);
  const displayNote = store.getItemDisplayNote(item);

  const carryOnBadge = item.carryOn
    ? `<span class="badge badge-carryon">🎒 ${escapeHtml(store.t('badgeCarryOn'))}</span>`
    : '';
  const taskBadge =
    item.itemType === 'task'
      ? `<span class="badge badge-task">🏠 ${escapeHtml(store.t('badgeTask'))}</span>`
      : '';
  const customBadge = item.isCustom
    ? `<span class="badge badge-custom">${escapeHtml(store.t('badgeCustom'))}</span>`
    : '';

  const tagBadges = (item.tags || [])
    .map((id) => tagMap.get(id))
    .filter(Boolean)
    .map((tItem) => `<span class="badge badge-tag">${escapeHtml(tItem.icon)} ${escapeHtml(tItem.label)}</span>`)
    .join('');

  const noteHtml = displayNote
    ? `<div class="item-note">${escapeHtml(displayNote)}</div>`
    : '';

  return `
    <li class="item-row ${item.checked ? 'checked' : ''}" data-item-id="${escapeHtml(item.id)}">
      <button
        type="button"
        class="item-check-btn"
        data-toggle-item="${escapeHtml(item.id)}"
        role="checkbox"
        aria-checked="${item.checked}"
        aria-label="${escapeHtml(displayName)}"
      >
        <span class="item-check-mark" aria-hidden="true">✓</span>
      </button>

      <div class="item-body" data-toggle-item="${escapeHtml(item.id)}">
        <div class="item-title-line">
          <span class="item-name">${escapeHtml(displayName)}</span>
          ${carryOnBadge}
          ${taskBadge}
          ${tagBadges}
          ${customBadge}
        </div>
        ${noteHtml}
      </div>

      <div class="item-actions">
        <button type="button" class="item-action-btn" data-edit-item="${escapeHtml(item.id)}" title="${escapeHtml(store.t('editItemTitle'))}" aria-label="${escapeHtml(store.t('editItemTitle'))} ${escapeHtml(displayName)}">✏️</button>
        <button type="button" class="item-action-btn delete" data-delete-item="${escapeHtml(item.id)}" title="${escapeHtml(store.t('deleteItemTitle'))}" aria-label="${escapeHtml(store.t('deleteItemTitle'))} ${escapeHtml(displayName)}">🗑️</button>
      </div>
    </li>
  `;
}
