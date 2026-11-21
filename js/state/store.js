import {
  DEFAULT_CATEGORIES,
  DEFAULT_ITEMS,
  DEFAULT_PRESETS,
  LEGACY_CATEGORY_MAP,
  TAG_GROUPS,
} from '../data/defaults.js';
import { detectDefaultLang, t, tNested } from '../i18n/translations.js';
import { DEFAULT_GOOGLE_CLIENT_ID } from '../services/googleDrive.js';

const STORAGE_KEY = 'packready_state_v1';
const SCHEMA_VERSION = 2;

const DEFAULT_ITEMS_BY_ID = new Map(DEFAULT_ITEMS.map((item) => [item.id, item]));

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function generateId(prefix = 'item') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeCategoryId(cat) {
  if (!cat) return 'essentials';
  const trimmed = cat.trim();
  if (LEGACY_CATEGORY_MAP[trimmed]) return LEGACY_CATEGORY_MAP[trimmed];
  // Match English or Chinese localized category display names back to canonical ID
  for (const def of DEFAULT_CATEGORIES) {
    if (def.id === trimmed) return def.id;
    if (tNested('en', 'categories', def.id, '') === trimmed) return def.id;
    if (tNested('zh-TW', 'categories', def.id, '') === trimmed) return def.id;
  }
  return trimmed;
}

function buildInitialItems() {
  return DEFAULT_ITEMS.map((item) => ({
    ...clone(item),
    checked: false,
    isCustom: false,
    userEdited: false,
  }));
}

function createDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    lang: detectDefaultLang(), // 'en' | 'zh-TW'
    items: buildInitialItems(),
    customTags: [],
    customPresets: [],
    activeTags: [],
    filterMode: 'trip', // 'trip' | 'strict' | 'all'
    typeFilter: 'all', // 'all' | 'packing' | 'task'
    carryOnOnly: false,
    unpackedOnly: false,
    searchQuery: '',
    collapsedCategories: [],
    theme: 'auto', // 'auto' | 'light' | 'dark'
    driveConfig: {
      clientId: DEFAULT_GOOGLE_CLIENT_ID,
      autoSync: false,
      lastSyncedAt: null,
      fileId: null,
    },
    updatedAt: new Date().toISOString(),
  };
}

class Store {
  constructor() {
    this.state = this.load();
    this.listeners = new Set();
    this.undoSnapshot = null;
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      const base = createDefaultState();

      // Migrate items (attach bilingual i18n to built-in items & normalize category IDs)
      const items = Array.isArray(parsed.items)
        ? parsed.items.map((item) => {
            const def = DEFAULT_ITEMS_BY_ID.get(item.id);
            return {
              ...item,
              category: normalizeCategoryId(item.category),
              i18n: def ? clone(def.i18n) : item.i18n,
            };
          })
        : base.items;

      const collapsed = Array.isArray(parsed.collapsedCategories)
        ? parsed.collapsedCategories.map(normalizeCategoryId)
        : [];

      return {
        ...base,
        ...parsed,
        schemaVersion: SCHEMA_VERSION,
        lang: parsed.lang === 'en' || parsed.lang === 'zh-TW' ? parsed.lang : base.lang,
        driveConfig: {
          ...base.driveConfig,
          ...(parsed.driveConfig || {}),
          clientId: parsed.driveConfig?.clientId || DEFAULT_GOOGLE_CLIENT_ID,
        },
        items,
        customTags: Array.isArray(parsed.customTags) ? parsed.customTags : [],
        customPresets: Array.isArray(parsed.customPresets) ? parsed.customPresets : [],
        activeTags: Array.isArray(parsed.activeTags) ? parsed.activeTags : [],
        collapsedCategories: collapsed,
      };
    } catch (err) {
      console.warn('Failed to load saved state, using defaults:', err);
      return createDefaultState();
    }
  }

  save(touchTimestamp = true) {
    if (touchTimestamp) {
      this.state.updatedAt = new Date().toISOString();
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (err) {
      console.error('Failed to persist state to localStorage:', err);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // ── i18n Helpers ──

  get lang() {
    return this.state.lang || 'en';
  }

  t(key, vars) {
    return t(this.lang, key, vars);
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'zh-TW') return;
    this.state.lang = lang;
    this.save(false);
  }

  toggleLang() {
    this.setLang(this.lang === 'zh-TW' ? 'en' : 'zh-TW');
  }

  getItemDisplayName(item) {
    if (!item.isCustom && !item.userEdited && item.i18n?.[this.lang]?.name) {
      return item.i18n[this.lang].name;
    }
    return item.name;
  }

  getItemDisplayNote(item) {
    if (!item.isCustom && !item.userEdited && item.i18n?.[this.lang]) {
      return item.i18n[this.lang].note || '';
    }
    return item.note || '';
  }

  getCategoryLabel(categoryId) {
    return tNested(this.lang, 'categories', categoryId, categoryId);
  }

  getTagLabel(tag) {
    if (tag.isCustom || tag.groupId === 'custom') return tag.label;
    return tNested(this.lang, 'tags', tag.id, tag.label || tag.id);
  }

  getPresetLabel(preset) {
    if (preset.isBuiltIn) {
      return tNested(this.lang, 'presets', preset.id, preset.name || preset.id);
    }
    return preset.name;
  }

  // ── Tag & Category helpers ──

  getAllTagGroups() {
    const groups = TAG_GROUPS.map((g) => ({
      id: g.id,
      label: tNested(this.lang, 'tagGroups', g.id, g.id),
      tags: g.tags.map((tag) => ({
        ...tag,
        label: tNested(this.lang, 'tags', tag.id, tag.id),
      })),
    }));
    if (this.state.customTags.length > 0) {
      groups.push({
        id: 'custom',
        label: tNested(this.lang, 'tagGroups', 'custom', 'Custom'),
        tags: clone(this.state.customTags),
      });
    }
    return groups;
  }

  getAllTagsMap() {
    const map = new Map();
    for (const group of TAG_GROUPS) {
      for (const tag of group.tags) {
        map.set(tag.id, {
          ...tag,
          label: tNested(this.lang, 'tags', tag.id, tag.id),
          groupId: group.id,
          isCustom: false,
        });
      }
    }
    for (const tag of this.state.customTags) {
      map.set(tag.id, { ...tag, groupId: 'custom', isCustom: true });
    }
    return map;
  }

  getAllCategories() {
    const known = new Map(DEFAULT_CATEGORIES.map((c) => [c.id, c.icon]));
    const result = DEFAULT_CATEGORIES.map((c) => ({
      id: c.id,
      icon: c.icon,
      label: this.getCategoryLabel(c.id),
    }));
    for (const item of this.state.items) {
      if (item.category && !known.has(item.category)) {
        known.set(item.category, '📦');
        result.push({
          id: item.category,
          icon: '📦',
          label: item.category,
        });
      }
    }
    return result;
  }

  getCategoryIcon(categoryId) {
    const found = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
    return found ? found.icon : '📦';
  }

  getAllPresets() {
    return [
      ...DEFAULT_PRESETS.map((p) => ({ ...p, name: this.getPresetLabel(p) })),
      ...this.state.customPresets,
    ];
  }

  // ── Filtering logic ──

  itemMatchesContext(item) {
    const { filterMode, activeTags } = this.state;
    if (filterMode === 'all') return true;

    const itemTags = Array.isArray(item.tags) ? item.tags : [];
    const isBase = itemTags.length === 0;

    if (filterMode === 'strict') {
      if (activeTags.length === 0) return isBase;
      return itemTags.some((tId) => activeTags.includes(tId));
    }

    if (isBase) return true;
    return itemTags.some((tId) => activeTags.includes(tId));
  }

  getFilteredItems({ ignoreSearchAndSubfilters = false } = {}) {
    const { typeFilter, carryOnOnly, unpackedOnly, searchQuery } = this.state;
    const q = searchQuery.trim().toLowerCase();

    return this.state.items.filter((item) => {
      if (!this.itemMatchesContext(item)) return false;

      if (ignoreSearchAndSubfilters) return true;

      if (typeFilter !== 'all' && item.itemType !== typeFilter) return false;
      if (carryOnOnly && !item.carryOn) return false;
      if (unpackedOnly && item.checked) return false;

      if (q) {
        const tagMap = this.getAllTagsMap();
        const tagLabels = (item.tags || [])
          .map((id) => tagMap.get(id)?.label || '')
          .join(' ');
        const enName = item.i18n?.en?.name || '';
        const zhName = item.i18n?.['zh-TW']?.name || '';
        const enNote = item.i18n?.en?.note || '';
        const zhNote = item.i18n?.['zh-TW']?.note || '';
        const catLabel = this.getCategoryLabel(item.category);
        const haystack = `${item.name} ${enName} ${zhName} ${item.note || ''} ${enNote} ${zhNote} ${catLabel} ${tagLabels}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }

  getProgressStats() {
    const contextItems = this.getFilteredItems({ ignoreSearchAndSubfilters: true });
    const total = contextItems.length;
    const checked = contextItems.filter((i) => i.checked).length;
    const packingItems = contextItems.filter((i) => i.itemType === 'packing');
    const taskItems = contextItems.filter((i) => i.itemType === 'task');
    return {
      total,
      checked,
      percent: total === 0 ? 0 : Math.round((checked / total) * 100),
      packingTotal: packingItems.length,
      packingChecked: packingItems.filter((i) => i.checked).length,
      taskTotal: taskItems.length,
      taskChecked: taskItems.filter((i) => i.checked).length,
      allCheckedCount: this.state.items.filter((i) => i.checked).length,
    };
  }

  // ── Item mutations ──

  toggleItem(id) {
    const item = this.state.items.find((i) => i.id === id);
    if (!item) return;
    item.checked = !item.checked;
    this.save();
  }

  addItem(data) {
    const newItem = {
      id: generateId('custom'),
      name: data.name.trim(),
      category: normalizeCategoryId(data.category || 'essentials'),
      itemType: data.itemType === 'task' ? 'task' : 'packing',
      carryOn: Boolean(data.carryOn),
      tags: Array.isArray(data.tags) ? [...new Set(data.tags)] : [],
      note: (data.note || '').trim(),
      checked: false,
      isCustom: true,
      userEdited: true,
    };
    this.state.items.push(newItem);
    this.save();
    return newItem;
  }

  updateItem(id, updates) {
    const idx = this.state.items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const prev = this.state.items[idx];
    const currentDisplayName = this.getItemDisplayName(prev);
    const currentDisplayNote = this.getItemDisplayNote(prev);
    const nameChanged = updates.name !== undefined && updates.name.trim() !== currentDisplayName;
    const noteChanged = updates.note !== undefined && updates.note.trim() !== currentDisplayNote;

    this.state.items[idx] = {
      ...prev,
      name: updates.name !== undefined ? updates.name.trim() : prev.name,
      category: updates.category !== undefined ? normalizeCategoryId(updates.category) : prev.category,
      itemType: updates.itemType !== undefined ? updates.itemType : prev.itemType,
      carryOn: updates.carryOn !== undefined ? Boolean(updates.carryOn) : prev.carryOn,
      tags: updates.tags !== undefined ? [...new Set(updates.tags)] : prev.tags,
      note: updates.note !== undefined ? updates.note.trim() : prev.note,
      userEdited: prev.userEdited || nameChanged || noteChanged,
    };
    this.save();
    return this.state.items[idx];
  }

  deleteItem(id) {
    const idx = this.state.items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.undoSnapshot = {
      type: 'delete',
      items: clone(this.state.items),
    };
    const [removed] = this.state.items.splice(idx, 1);
    this.save();
    return removed;
  }

  // ── Reset & Undo ──

  resetChecks(scope = 'all') {
    const prevItems = clone(this.state.items);
    let resetCount = 0;

    if (scope === 'visible') {
      const visibleIds = new Set(this.getFilteredItems().map((i) => i.id));
      for (const item of this.state.items) {
        if (visibleIds.has(item.id) && item.checked) {
          item.checked = false;
          resetCount += 1;
        }
      }
    } else {
      for (const item of this.state.items) {
        if (item.checked) {
          item.checked = false;
          resetCount += 1;
        }
      }
    }

    if (resetCount > 0) {
      this.undoSnapshot = {
        type: 'reset',
        items: prevItems,
      };
      this.save();
    }
    return resetCount;
  }

  undo() {
    if (!this.undoSnapshot) return false;
    this.state.items = this.undoSnapshot.items;
    this.undoSnapshot = null;
    this.save();
    return true;
  }

  restoreDefaultItems({ keepCustom = true } = {}) {
    this.undoSnapshot = {
      type: 'restore-defaults',
      items: clone(this.state.items),
    };
    const freshDefaults = buildInitialItems();
    if (keepCustom) {
      const customOnes = this.state.items.filter((i) => i.isCustom);
      this.state.items = [...freshDefaults, ...customOnes];
    } else {
      this.state.items = freshDefaults;
    }
    this.save();
  }

  // ── Filter & View mutations ──

  toggleTag(tagId) {
    const exists = this.state.activeTags.includes(tagId);
    if (exists) {
      this.state.activeTags = this.state.activeTags.filter((tId) => tId !== tagId);
    } else {
      this.state.activeTags = [...this.state.activeTags, tagId];
    }
    this.save(false);
  }

  clearActiveTags() {
    this.state.activeTags = [];
    this.save(false);
  }

  applyPreset(presetId) {
    const preset = this.getAllPresets().find((p) => p.id === presetId);
    if (!preset) return;
    this.state.activeTags = [...preset.tags];
    if (this.state.filterMode === 'all') {
      this.state.filterMode = 'trip';
    }
    this.save(false);
  }

  saveCustomPreset(name, icon = '🗺️') {
    const preset = {
      id: generateId('preset'),
      name: name.trim(),
      icon: icon.trim() || '🗺️',
      tags: [...this.state.activeTags],
      isBuiltIn: false,
    };
    this.state.customPresets.push(preset);
    this.save();
    return preset;
  }

  deleteCustomPreset(id) {
    this.state.customPresets = this.state.customPresets.filter((p) => p.id !== id);
    this.save();
  }

  setFilterMode(mode) {
    this.state.filterMode = mode;
    this.save(false);
  }

  setTypeFilter(type) {
    this.state.typeFilter = type;
    this.save(false);
  }

  setCarryOnOnly(val) {
    this.state.carryOnOnly = Boolean(val);
    this.save(false);
  }

  setUnpackedOnly(val) {
    this.state.unpackedOnly = Boolean(val);
    this.save(false);
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.save(false);
  }

  toggleCategoryCollapse(category) {
    const idx = this.state.collapsedCategories.indexOf(category);
    if (idx >= 0) {
      this.state.collapsedCategories.splice(idx, 1);
    } else {
      this.state.collapsedCategories.push(category);
    }
    this.save(false);
  }

  setTheme(theme) {
    this.state.theme = theme;
    this.save(false);
  }

  // ── Custom Tags ──

  addCustomTag(label, icon = '🏷️') {
    const trimmed = label.trim();
    if (!trimmed) return null;
    const tag = {
      id: generateId('tag'),
      label: trimmed,
      icon: icon.trim() || '🏷️',
    };
    this.state.customTags.push(tag);
    this.save();
    return tag;
  }

  deleteCustomTag(tagId) {
    this.state.customTags = this.state.customTags.filter((tItem) => tItem.id !== tagId);
    this.state.activeTags = this.state.activeTags.filter((tId) => tId !== tagId);
    for (const item of this.state.items) {
      if (Array.isArray(item.tags)) {
        item.tags = item.tags.filter((tId) => tId !== tagId);
      }
    }
    for (const preset of this.state.customPresets) {
      preset.tags = preset.tags.filter((tId) => tId !== tagId);
    }
    this.save();
  }

  // ── Drive Config ──

  updateDriveConfig(partial) {
    this.state.driveConfig = {
      ...this.state.driveConfig,
      ...partial,
    };
    this.save(false);
  }

  // ── Backup Export / Import ──

  exportBackupPayload() {
    return {
      app: 'PackReady',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        items: this.state.items,
        customTags: this.state.customTags,
        customPresets: this.state.customPresets,
        activeTags: this.state.activeTags,
      },
    };
  }

  importBackupPayload(payload, mode = 'replace') {
    const data = payload?.data || payload;
    if (!data || !Array.isArray(data.items)) {
      throw new Error(
        this.lang === 'en'
          ? 'Invalid backup file format (missing items list).'
          : '備份檔案格式不正確（找不到品項清單）'
      );
    }

    const sanitizedItems = data.items
      .filter((i) => i && typeof i.name === 'string' && i.name.trim())
      .map((i) => {
        const def = DEFAULT_ITEMS_BY_ID.get(i.id);
        return {
          id: i.id || generateId('imp'),
          name: i.name.trim(),
          category: normalizeCategoryId(i.category || 'essentials'),
          itemType: i.itemType === 'task' ? 'task' : 'packing',
          carryOn: Boolean(i.carryOn),
          tags: Array.isArray(i.tags) ? i.tags : [],
          note: typeof i.note === 'string' ? i.note : '',
          checked: Boolean(i.checked),
          isCustom: i.isCustom !== false,
          userEdited: Boolean(i.userEdited),
          i18n: def ? clone(def.i18n) : i.i18n,
        };
      });

    const incomingTags = Array.isArray(data.customTags) ? data.customTags : [];
    const incomingPresets = Array.isArray(data.customPresets) ? data.customPresets : [];

    if (mode === 'merge') {
      const existingNames = new Set(
        this.state.items.map((i) => `${i.name.trim().toLowerCase()}|${i.category}`)
      );
      let addedCount = 0;
      for (const item of sanitizedItems) {
        const key = `${item.name.trim().toLowerCase()}|${item.category}`;
        if (!existingNames.has(key)) {
          this.state.items.push({ ...item, id: generateId('imp') });
          existingNames.add(key);
          addedCount += 1;
        }
      }
      const existingTagIds = new Set(this.state.customTags.map((tItem) => tItem.id));
      for (const tag of incomingTags) {
        if (tag && tag.id && !existingTagIds.has(tag.id)) {
          this.state.customTags.push(tag);
        }
      }
      const existingPresetIds = new Set(this.state.customPresets.map((p) => p.id));
      for (const preset of incomingPresets) {
        if (preset && preset.id && !existingPresetIds.has(preset.id)) {
          this.state.customPresets.push(preset);
        }
      }
      this.save();
      return { count: addedCount, mode: 'merge' };
    }

    this.state.items = sanitizedItems;
    this.state.customTags = incomingTags;
    this.state.customPresets = incomingPresets;
    if (Array.isArray(data.activeTags)) {
      this.state.activeTags = data.activeTags;
    }
    this.save();
    return { count: sanitizedItems.length, mode: 'replace' };
  }

  importFromCsv(csvText) {
    const rows = parseCsv(csvText);
    if (rows.length < 2) {
      throw new Error(
        this.lang === 'en'
          ? 'CSV file needs a header row and at least one item row.'
          : 'CSV 檔案內容不足，請確認至少有標題列與一筆資料'
      );
    }

    const header = rows[0].map((h) => h.trim());
    const nameIdx = header.findIndex((h) => /物品|名稱|item|name/i.test(h));
    const catIdx = header.findIndex((h) => /類別|分類|category/i.test(h));
    const noteIdx = header.findIndex((h) => /備註|note|remark/i.test(h));

    if (nameIdx === -1) {
      throw new Error(
        this.lang === 'en'
          ? 'Could not find an item name column ("name" or "物品名稱").'
          : '找不到「物品名稱」或「name」欄位'
      );
    }

    const emojiTagMap = {
      '✈️': 'international',
      '💼': 'business',
      '🇹🇼': 'taiwan',
      '🇯🇵': 'japan',
      '🇪🇺': 'europe',
      '🇺🇸': 'usa',
      '❄️': 'winter',
      '☀️': 'summer',
      '🌧️': 'rainy',
    };

    const baseColIndices = [];
    const contextCols = [];

    header.forEach((col, idx) => {
      if (idx === nameIdx || idx === catIdx || idx === noteIdx) return;
      if (!col || col === '✔️' || /勾選|done|checked/i.test(col)) return;
      if (col === '🧳' || /基本|通用|base|essential/i.test(col)) {
        baseColIndices.push(idx);
        return;
      }
      if (emojiTagMap[col]) {
        contextCols.push({ colIdx: idx, tagId: emojiTagMap[col] });
        return;
      }
      let existing = this.state.customTags.find((tItem) => tItem.icon === col || tItem.label === col);
      if (!existing) {
        const label = col === '🏥' ? (this.lang === 'en' ? 'Medical' : '醫療需求') : col;
        existing = this.addCustomTag(label, col.length <= 4 ? col : '🏷️');
      }
      if (existing) {
        contextCols.push({ colIdx: idx, tagId: existing.id });
      }
    });

    const existingNames = new Set(this.state.items.map((i) => i.name.trim().toLowerCase()));
    let added = 0;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rawName = (row[nameIdx] || '').trim();
      if (!rawName) continue;
      if (existingNames.has(rawName.toLowerCase())) continue;

      const rawCat = catIdx >= 0 ? (row[catIdx] || '').trim() : '';
      const rawNote = noteIdx >= 0 ? (row[noteIdx] || '').trim() : '';

      const isTask = rawCat === '家務' || /出發前|pre-departure|before leaving/i.test(rawNote);
      const carryOn = /隨身|carry-on/i.test(rawName) || /隨身|carry-on/i.test(rawNote);

      const isMarkedBase = baseColIndices.some((idx) => isTruthyCell(row[idx]));
      const matchedTags = [];
      for (const { colIdx, tagId } of contextCols) {
        if (isTruthyCell(row[colIdx])) {
          matchedTags.push(tagId);
        }
      }

      const tags = isMarkedBase ? [] : matchedTags;
      const category = mapCsvCategory(rawCat, isTask);

      this.state.items.push({
        id: generateId('csv'),
        name: rawName,
        category,
        itemType: isTask ? 'task' : 'packing',
        carryOn,
        tags,
        note: rawNote,
        checked: false,
        isCustom: true,
        userEdited: true,
      });
      existingNames.add(rawName.toLowerCase());
      added += 1;
    }

    this.save();
    return { added };
  }
}

function isTruthyCell(val) {
  if (!val) return false;
  const v = val.trim().toLowerCase();
  return v === '✅' || v === '✔' || v === '✔️' || v === 'v' || v === 'x' || v === 'true' || v === '1' || v === 'yes';
}

function mapCsvCategory(rawCat, isTask) {
  if (isTask) return 'pre_departure';
  const map = {
    證件: 'documents',
    錢包: 'documents',
    醫療: 'health',
    工作: 'work',
    '3C': 'tech',
    衣物: 'clothing',
    配件: 'accessories',
    盥洗: 'toiletries',
    保養: 'toiletries',
    美妝: 'beauty',
    衛生: 'beauty',
    髮型: 'beauty',
    舒適: 'comfort',
    生活: 'essentials',
    興趣: 'essentials',
    家務: 'pre_departure',
  };
  return map[rawCat] || normalizeCategoryId(rawCat || 'essentials');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  const cleanText = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];
    const next = cleanText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\r' && next === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      i++;
    } else if (ch === '\n' || ch === '\r') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

export const store = new Store();
