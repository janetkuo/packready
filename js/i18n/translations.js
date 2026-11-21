/**
 * PackReady — Bilingual i18n dictionary (English & Traditional Chinese).
 */

export const TRANSLATIONS = {
  en: {
    appTitle: 'PackReady — Travel Checklist',
    brandSubtitle: 'Travel Packing Checklist',
    backupDrive: 'Backup / Drive',
    backupDriveTitle: 'Backup & Google Drive Sync',
    reset: 'Reset',
    resetTitle: 'One-click reset checkmarks',
    toggleThemeTitle: 'Toggle light / dark theme',
    addItem: 'Add Item',
    switchLangTitle: '切換為繁體中文',
    switchLangLabel: '繁中',

    // Mobile strip
    mobileProgress: '{checked} / {total} done',
    configureContext: 'Filters',
    contextSettings: 'Trip Context',
    closeContextPanel: 'Close filter panel',
    viewListCount: 'View List ({count})',
    modeAllBadge: 'All Items',
    baseRequired: 'Essentials',
    modeStrictBadge: 'Tags Only',

    // Sidebar progress
    tripProgressTitle: 'Trip Progress',
    packingCount: 'Packing {checked}/{total}',
    taskCount: 'Pre-trip {checked}/{total}',
    completeBanner: 'All set! Have a wonderful trip!',

    // Presets
    presetsTitle: 'Quick Presets',
    savePreset: '+ Save',
    savePresetPrompt: 'Name this filter preset (e.g. Korea Business, Ski Trip):',
    presetSaved: 'Saved preset "{name}"',
    presetDeleted: 'Deleted custom preset',
    deletePresetAria: 'Delete preset',

    // Context filters
    contextTitle: 'Trip Contexts',
    customTagBtn: '+ Custom Tag',
    clear: 'Clear',
    modeTrip: 'Trip Mode',
    modeTripTitle: 'Show Essentials + items matching any selected context',
    modeStrict: 'Tags Only',
    modeStrictTitle: 'Show only items tagged with selected contexts',
    modeAll: 'All Items',
    modeAllTitle: 'Show every item for easy list management',
    hintTrip: 'Shows all Essentials plus items matching any selected context.',
    hintStrictWithTags: 'Showing only items matching your selected context tags.',
    hintStrictNoTags: 'No context selected — showing Essentials only.',
    hintAll: 'Showing all items in your master list for easy editing.',

    // Toolbar
    searchPlaceholder: 'Search items, categories, or notes... (press /)',
    clearSearch: 'Clear search',
    typeAll: 'All',
    typePacking: 'Packing',
    typeTask: 'Pre-trip',
    carryOnFilter: 'Carry-on',
    unpackedFilter: 'Unpacked only',

    // Quick add
    quickAddPlaceholder: 'Quick add an item (uses current contexts)...',
    quickAddCategoryAria: 'Choose category',
    quickAddBtn: '+ Add',

    // Item row badges & actions
    badgeCarryOn: 'Carry-on',
    badgeTask: 'Pre-trip',
    badgeCustom: 'Custom',
    editItemTitle: 'Edit item',
    deleteItemTitle: 'Delete item',

    // Empty state
    emptyAllDoneTitle: 'Everything in this view is packed!',
    emptyNoMatchTitle: 'No matching items',
    emptyWithFiltersDesc: 'Try adjusting your search or filters, or add a new item directly.',
    emptyNoFiltersDesc: 'Click below to add your own items or switch trip contexts.',
    clearViewFilters: 'Clear Filters',

    // Modal: Add / Edit Item
    modalAddTitle: 'Add Item',
    modalEditTitle: 'Edit Item',
    fieldItemName: 'Item or task name',
    fieldItemNamePlaceholder: 'e.g., Spare glasses, Water plants, Tax-free pouch',
    fieldType: 'Type',
    optTypePacking: '🧳 Packing Item',
    optTypeTask: '🏠 Pre-departure Task',
    fieldCategory: 'Category',
    fieldCategoryPlaceholder: 'Choose or type a new category',
    fieldCarryOn: '🎒 Mark as Carry-on (bring onboard / keep with you)',
    fieldContexts: 'Applicable Contexts (multi-select; leave empty for Essentials)',
    fieldContextsHelp: 'An item can belong to multiple contexts, e.g. Bug Spray in Summer, Taiwan & Outdoor.',
    fieldNote: 'Note (optional)',
    fieldNotePlaceholder: 'e.g., Lithium battery — carry-on only, Check the night before',
    deleteItemBtn: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',

    // Modal: Custom Tags
    modalTagsTitle: 'Manage Custom Context Tags',
    modalTagsDesc: 'Add your own contexts, e.g., 🏥 Medical, 🎿 Ski, 🇰🇷 Korea, 👶 Kids, 🐾 Pets.',
    newTagIconAria: 'Icon',
    newTagLabelPlaceholder: 'Tag name (e.g. Medical, Ski)',
    addBtn: 'Add',
    noCustomTags: 'No custom tags yet. Add one above!',
    deleteBtn: 'Delete',

    // Modal: Reset
    modalResetTitle: 'Reset Checklist',
    modalResetDesc: 'Starting a new trip? Clear checkmarks while keeping all your custom items and contexts.',
    resetAllBtn: '↺ Reset All Checked Items ({count})',
    resetVisibleBtn: 'Reset Visible Items Only ({count})',
    advancedRestoreSummary: 'Advanced: Restore built-in default items',
    advancedRestoreDesc: 'Accidentally deleted default items? Restore them here (your custom items will be kept).',
    restoreDefaultsBtn: 'Restore Default Items (Keep Custom)',

    // Modal: Backup & Drive
    modalBackupTitle: 'Backup & Google Drive Sync',
    tabDrive: '☁️ Google Drive',
    tabFile: '💾 Local JSON / CSV',
    driveDisconnected: 'Not Connected',
    driveConnected: 'Connected',
    driveNeverSynced: 'Not synced yet',
    driveLastSynced: 'Last synced: {time}',
    driveClientIdLabel: 'Google OAuth Client ID',
    driveClientIdHelp: 'Your data stays strictly in your browser and your own Google Drive (file: {file}) — no third-party servers.',
    driveSignInBtn: '🔗 Sign in & Connect Google Drive',
    driveConnecting: 'Connecting...',
    driveUploadBtn: '⬆️ Backup to Drive',
    driveUploading: 'Uploading...',
    driveDownloadBtn: '⬇️ Restore from Drive',
    driveDownloading: 'Loading...',
    driveAutoSyncLabel: 'Auto-sync changes to Google Drive while connected',
    driveSignOutBtn: 'Sign out of Google',
    driveGuideSummary: '📖 First time? How to create a free Google OAuth Client ID (~2 mins)',
    driveGuideStep1: 'Open <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">Google Cloud Console</a> and create a free project.',
    driveGuideStep2: 'Go to <strong>APIs &amp; Services → Library</strong>, search for and enable <strong>Google Drive API</strong>.',
    driveGuideStep3: 'Go to <strong>OAuth consent screen</strong>, choose <strong>External</strong>, set an app name, and add your Gmail under Test Users.',
    driveGuideStep4: 'Go to <strong>Credentials → Create Credentials → OAuth client ID</strong> and choose <strong>Web application</strong>.',
    driveGuideStep5: 'Under <strong>Authorized JavaScript origins</strong>, add this page\'s origin (e.g. <code>https://your-username.github.io</code> or <code>http://localhost:8080</code>), then paste the Client ID above.',
    currentOriginLabel: 'Current origin:',

    // Local File Backup
    exportJsonTitle: '📤 Export Backup (JSON)',
    exportJsonDesc: 'Download all items, custom tags, presets, and current check states.',
    exportJsonBtn: 'Download JSON Backup',
    importJsonTitle: '📥 Import Backup (JSON)',
    importMerge: 'Merge (keep existing items + add new ones)',
    importReplace: 'Replace (overwrite current checklist)',
    importJsonBtn: 'Choose JSON File',
    importCsvTitle: '📊 Import Private CSV List',
    importCsvDesc: 'Import your own spreadsheet CSV (supports standard columns and emoji context columns like 🧳, ✈️, 🇹🇼, 💼, 🏥). Imported items stay local in your browser & private Drive.',
    importCsvBtn: 'Choose CSV File',

    // Toasts & confirmations
    toastAdded: 'Added "{name}"',
    toastUpdated: 'Updated "{name}"',
    toastDeleted: 'Deleted "{name}"',
    toastUndo: 'Undo',
    toastRestoredItem: 'Restored deleted item',
    toastNoCheckedAll: 'No checked items to reset',
    toastResetAll: 'Reset all {count} items — ready for your next trip!',
    toastNoCheckedVisible: 'No checked items in current view',
    toastResetVisible: 'Reset {count} visible items',
    toastRestoredChecks: 'Restored checkmarks',
    toastRestoredDefaults: 'Restored default items (custom items kept)',
    toastAddedTag: 'Added custom tag "{icon} {label}"',
    toastDeletedTag: 'Deleted custom tag',
    toastSavedClientId: 'Saved Google Client ID',
    toastClearedClientId: 'Cleared Google Client ID',
    toastDriveConnected: 'Connected to Google Drive!',
    toastDriveUploaded: 'Backed up to Google Drive ({count} items)',
    toastDriveRestored: 'Restored {count} items from Google Drive!',
    toastDriveSignedOut: 'Signed out of Google Drive',
    toastAutoSyncOn: 'Auto-sync enabled',
    toastAutoSyncOff: 'Auto-sync disabled',
    confirmDriveRestore: 'Found Google Drive backup ({count} items, updated {time}).\nRestore from Drive and overwrite your current checklist?',
    toastExportedJson: 'Downloaded backup ({count} items)',
    toastImportedMerge: 'Merged {count} new items',
    toastImportedReplace: 'Restored backup ({count} items)',
    toastImportedCsv: 'Imported {count} items from CSV (stored locally)',
    toastImportedCsvNone: 'All items in this CSV already exist in your checklist',
    toastUpdateAvailable: 'New version available (v{version})',
    toastUpdateReload: 'Reload',

    // Tag groups
    tagGroups: {
      trip: 'Trip Type',
      destination: 'Destination',
      season: 'Season & Weather',
      personal: 'Personal Needs',
      custom: 'Custom Contexts',
    },

    // Tags
    tags: {
      international: 'International',
      business: 'Business',
      domestic: 'Domestic',
      outdoor: 'Outdoor / Beach',
      japan: 'Japan',
      taiwan: 'Taiwan',
      europe: 'Europe',
      usa: 'US / Canada',
      winter: 'Winter / Cold',
      summer: 'Summer / Hot',
      rainy: 'Rainy',
      feminine: 'Feminine Care',
      masculine: 'Men\'s Care',
      beauty: 'Makeup & Skincare',
      contacts: 'Contact Lenses',
    },

    // Categories
    categories: {
      documents: 'Documents & Wallet',
      tech: 'Electronics & Tech',
      work: 'Work Gear',
      clothing: 'Clothing & Footwear',
      accessories: 'Accessories',
      toiletries: 'Toiletries & Skincare',
      beauty: 'Beauty & Hygiene',
      health: 'Health & Medicine',
      comfort: 'Flight & Comfort',
      essentials: 'Everyday Essentials',
      pre_departure: 'Pre-departure Tasks',
    },

    // Presets
    presets: {
      'preset-basic': 'Essentials Only',
      'preset-japan-winter': 'Japan Winter',
      'preset-taiwan-summer': 'Taiwan Summer',
      'preset-intl-business': 'Intl Business',
      'preset-europe': 'Europe Trip',
    },
  },

  'zh-TW': {
    appTitle: 'PackReady — 旅遊準備清單',
    brandSubtitle: '旅遊準備清單',
    backupDrive: '備份 / Drive',
    backupDriveTitle: '備份與 Google Drive 同步',
    reset: '重置',
    resetTitle: '一鍵重置勾選狀態',
    toggleThemeTitle: '切換淺色 / 深色主題',
    addItem: '新增品項',
    switchLangTitle: 'Switch to English',
    switchLangLabel: 'EN',

    // Mobile strip
    mobileProgress: '{checked} / {total} 已完成',
    configureContext: '設定情境',
    contextSettings: '行程情境設定',
    closeContextPanel: '關閉情境面板',
    viewListCount: '查看清單 ({count})',
    modeAllBadge: '顯示全部品項',
    baseRequired: '基本必備',
    modeStrictBadge: '僅看標籤',

    // Sidebar progress
    tripProgressTitle: '本次行程進度',
    packingCount: '打包 {checked}/{total}',
    taskCount: '出發前 {checked}/{total}',
    completeBanner: '🎉 全部準備完成，祝你旅途愉快！',

    // Presets
    presetsTitle: '快速情境組合',
    savePreset: '＋ 存為組合',
    savePresetPrompt: '替目前的情境篩選組合命名（例如：韓國出差、冬季滑雪）：',
    presetSaved: '已儲存組合「{name}」',
    presetDeleted: '已刪除自訂情境組合',
    deletePresetAria: '刪除組合',

    // Context filters
    contextTitle: '情境條件',
    customTagBtn: '＋ 自訂標籤',
    clear: '清除',
    modeTrip: '行程模式',
    modeTripTitle: '顯示基本必備 + 符合勾選情境的品項',
    modeStrict: '僅看標籤',
    modeStrictTitle: '只顯示有標記所選情境的品項',
    modeAll: '全部品項',
    modeAllTitle: '顯示所有品項，方便管理清單',
    hintTrip: '自動顯示「基本必備」＋符合任一勾選情境的品項。',
    hintStrictWithTags: '只顯示包含所選情境標籤的品項（隱藏基本必備）。',
    hintStrictNoTags: '尚未勾選情境，目前僅顯示「基本必備」品項。',
    hintAll: '顯示清單中的所有品項，方便檢視、編輯或整理。',

    // Toolbar
    searchPlaceholder: '搜尋品項、分類或備註... (按 / 搜尋)',
    clearSearch: '清除搜尋',
    typeAll: '全部',
    typePacking: '打包',
    typeTask: '出發前',
    carryOnFilter: '隨身行李',
    unpackedFilter: '僅看未完成',

    // Quick add
    quickAddPlaceholder: '快速新增私人或自訂品項（會自動套用目前情境）...',
    quickAddCategoryAria: '選擇分類',
    quickAddBtn: '＋ 加入',

    // Item row badges & actions
    badgeCarryOn: '隨身',
    badgeTask: '出發前',
    badgeCustom: '自訂',
    editItemTitle: '編輯品項',
    deleteItemTitle: '刪除品項',

    // Empty state
    emptyAllDoneTitle: '這個檢視下的項目都已完成！',
    emptyNoMatchTitle: '沒有符合條件的品項',
    emptyWithFiltersDesc: '試著調整搜尋關鍵字或篩選條件，或直接新增品項到清單中。',
    emptyNoFiltersDesc: '點選下方按鈕新增你的專屬品項，或切換其他行程情境。',
    clearViewFilters: '清除檢視條件',

    // Modal: Add / Edit Item
    modalAddTitle: '新增品項',
    modalEditTitle: '編輯品項',
    fieldItemName: '品項或事項名稱',
    fieldItemNamePlaceholder: '例如：備用眼鏡、澆花、退稅收據袋',
    fieldType: '類型',
    optTypePacking: '🧳 打包物品',
    optTypeTask: '🏠 出發前事項 / 家務',
    fieldCategory: '分類',
    fieldCategoryPlaceholder: '選擇或輸入新分類',
    fieldCarryOn: '🎒 標記為「隨身行李」（需帶上飛機 / 隨身攜帶）',
    fieldContexts: '適用情境（可複選，不選代表「基本必備」）',
    fieldContextsHelp: '同一個品項可套用多個情境，例如「防蚊液」可同時勾選 ☀️ 夏天、🇹🇼 台灣、🏕️ 戶外。',
    fieldNote: '備註（選填）',
    fieldNotePlaceholder: '例如：含鋰電池不可託運、出發前一天檢查',
    deleteItemBtn: '刪除品項',
    cancel: '取消',
    save: '儲存',
    close: '關閉',

    // Modal: Custom Tags
    modalTagsTitle: '管理自訂情境標籤',
    modalTagsDesc: '新增專屬於你的情境，例如：🏥 醫療、🎿 滑雪、🇰🇷 韓國、👶 親子、🐾 寵物。',
    newTagIconAria: '圖示',
    newTagLabelPlaceholder: '標籤名稱（例如：醫療、滑雪）',
    addBtn: '新增',
    noCustomTags: '目前還沒有自訂標籤，可在上方新增。',
    deleteBtn: '刪除',

    // Modal: Reset
    modalResetTitle: '重置清單狀態',
    modalResetDesc: '準備開始新旅程嗎？清除所有打勾狀態，但會完整保留你的自訂品項與情境設定。',
    resetAllBtn: '↺ 一鍵重置全部已勾選項目 ({count})',
    resetVisibleBtn: '僅重置目前篩選顯示的項目 ({count})',
    advancedRestoreSummary: '進階：還原內建預設清單',
    advancedRestoreDesc: '如果你不小心刪除了內建品項，可以點此重新補回預設品項（你的自訂品項會保留）。',
    restoreDefaultsBtn: '還原內建品項（保留自訂）',

    // Modal: Backup & Drive
    modalBackupTitle: '備份與 Google Drive 同步',
    tabDrive: '☁️ Google Drive',
    tabFile: '💾 本機 JSON / CSV',
    driveDisconnected: '未連線',
    driveConnected: '已連線',
    driveNeverSynced: '尚未同步',
    driveLastSynced: '上次同步：{time}',
    driveClientIdLabel: 'Google OAuth Client ID',
    driveClientIdHelp: '所有資料僅存在你的瀏覽器與你個人的 Google Drive（檔案名稱 {file}），不會經過任何第三方伺服器。',
    driveSignInBtn: '🔗 登入並連結 Google Drive',
    driveConnecting: '連線中...',
    driveUploadBtn: '⬆️ 上傳備份到 Drive',
    driveUploading: '上傳中...',
    driveDownloadBtn: '⬇️ 從 Drive 還原',
    driveDownloading: '讀取中...',
    driveAutoSyncLabel: '連線期間，變更清單時自動同步至 Google Drive',
    driveSignOutBtn: '登出 Google 帳號',
    driveGuideSummary: '📖 第一次使用？如何免費建立 Google OAuth Client ID（約 2 分鐘）',
    driveGuideStep1: '前往 <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">Google Cloud Console</a> 建立一個新專案（免費）。',
    driveGuideStep2: '在「API 和服務 → 程式庫」搜尋並啟用 <strong>Google Drive API</strong>。',
    driveGuideStep3: '在「OAuth 同意畫面」選擇 <strong>外部 (External)</strong>，填寫 App 名稱，並在測試使用者中加入你自己的 Gmail。',
    driveGuideStep4: '在「憑證 → 建立憑證 → OAuth 用戶端 ID」選擇 <strong>網頁應用程式</strong>。',
    driveGuideStep5: '在「已授權的 JavaScript 來源」填入你開啟此網頁的網址（例如 <code>https://你的帳號.github.io</code> 或本機 <code>http://localhost:8080</code>），複製生成的 Client ID 貼到上方即可！',
    currentOriginLabel: '目前網頁來源：',

    // Local File Backup
    exportJsonTitle: '📤 匯出備份檔 (JSON)',
    exportJsonDesc: '完整下載所有清單品項、自訂標籤、情境組合與勾選進度。',
    exportJsonBtn: '下載 JSON 備份檔',
    importJsonTitle: '📥 匯入備份檔 (JSON)',
    importMerge: '合併匯入（保留現有 + 加入新項目）',
    importReplace: '覆蓋還原（完整取代目前清單）',
    importJsonBtn: '選擇 JSON 檔案匯入',
    importCsvTitle: '📊 匯入私人 CSV 清單',
    importCsvDesc: '支援匯入你自己的試算表 CSV（包含物品名稱、類別、備註與 🧳、✈️、🇹🇼、💼、🏥 等情境欄位）。匯入後的私人品項只會儲存在你的本機瀏覽器與個人 Drive，不會公開！',
    importCsvBtn: '選擇 CSV 檔案匯入',

    // Toasts & confirmations
    toastAdded: '已新增「{name}」',
    toastUpdated: '已更新「{name}」',
    toastDeleted: '已刪除「{name}」',
    toastUndo: '復原',
    toastRestoredItem: '已復原刪除的品項',
    toastNoCheckedAll: '目前沒有已勾選的項目',
    toastResetAll: '已重置全部 {count} 個項目，準備迎接下一趟旅程！',
    toastNoCheckedVisible: '目前篩選結果中沒有已勾選的項目',
    toastResetVisible: '已重置目前顯示的 {count} 個項目',
    toastRestoredChecks: '已復原勾選狀態',
    toastRestoredDefaults: '已還原所有內建品項（自訂品項已保留）',
    toastAddedTag: '已新增自訂情境「{icon} {label}」',
    toastDeletedTag: '已刪除自訂標籤',
    toastSavedClientId: '已儲存 Google Client ID',
    toastClearedClientId: '已清除 Google Client ID',
    toastDriveConnected: '已成功連結 Google Drive！',
    toastDriveUploaded: '已備份至 Google Drive（共 {count} 項）',
    toastDriveRestored: '已從 Google Drive 還原 {count} 個品項！',
    toastDriveSignedOut: '已登出 Google Drive',
    toastAutoSyncOn: '已開啟自動同步',
    toastAutoSyncOff: '已關閉自動同步',
    confirmDriveRestore: '找到 Google Drive 備份（{count} 個品項，更新時間：{time}）。\n確定要從 Drive 還原並覆蓋目前清單嗎？',
    toastExportedJson: '已下載備份檔（共 {count} 個品項）',
    toastImportedMerge: '已合併匯入 {count} 個新品項',
    toastImportedReplace: '已還原備份（共 {count} 個品項）',
    toastImportedCsv: '已從 CSV 匯入 {count} 個私人品項（僅存在本機）',
    toastImportedCsvNone: 'CSV 中的品項都已存在於清單中',
    toastUpdateAvailable: '發現新版本 (v{version})',
    toastUpdateReload: '立即更新',

    // Tag groups
    tagGroups: {
      trip: '行程類型',
      destination: '目的地',
      season: '季節與天氣',
      personal: '個人需求',
      custom: '自訂情境',
    },

    // Tags
    tags: {
      international: '出國',
      business: '出差',
      domestic: '國內輕旅',
      outdoor: '戶外 / 海島',
      japan: '日本',
      taiwan: '台灣',
      europe: '歐洲',
      usa: '美加',
      winter: '冬天 / 寒冷',
      summer: '夏天 / 炎熱',
      rainy: '雨季',
      feminine: '女性用品',
      masculine: '男性用品',
      beauty: '美妝保養',
      contacts: '隱形眼鏡',
    },

    // Categories
    categories: {
      documents: '證件與錢包',
      tech: '3C 數位',
      work: '工作配備',
      clothing: '衣物與鞋履',
      accessories: '配件',
      toiletries: '盥洗與保養',
      beauty: '美妝與衛生',
      health: '健康與藥品',
      comfort: '舒適與機上',
      essentials: '生活雜物',
      pre_departure: '出發前事項',
    },

    // Presets
    presets: {
      'preset-basic': '基本通用',
      'preset-japan-winter': '日本冬季旅',
      'preset-taiwan-summer': '台灣夏日行',
      'preset-intl-business': '海外出差',
      'preset-europe': '歐洲旅遊',
    },
  },
};

export function detectDefaultLang() {
  const nav = (navigator.language || 'en').toLowerCase();
  return nav.startsWith('zh') ? 'zh-TW' : 'en';
}

export function t(lang, key, vars = {}) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, String(v));
  }
  return str;
}

export function tNested(lang, section, key, fallback = key) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[section]?.[key] ?? TRANSLATIONS.en[section]?.[key] ?? fallback;
}
