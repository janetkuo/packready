/**
 * PackReady — Default public packing list & context definitions (Bilingual: EN / zh-TW).
 * Privacy-safe for public GitHub Pages hosting; personal items can be added
 * locally and synced to the user's private Google Drive.
 */

export const TAG_GROUPS = [
  {
    id: 'trip',
    tags: [
      { id: 'international', icon: '✈️' },
      { id: 'business', icon: '💼' },
      { id: 'domestic', icon: '🚗' },
      { id: 'outdoor', icon: '🏕️' },
    ],
  },
  {
    id: 'destination',
    tags: [
      { id: 'japan', icon: '🇯🇵' },
      { id: 'taiwan', icon: '🇹🇼' },
      { id: 'europe', icon: '🇪🇺' },
      { id: 'usa', icon: '🇺🇸' },
    ],
  },
  {
    id: 'season',
    tags: [
      { id: 'winter', icon: '❄️' },
      { id: 'summer', icon: '☀️' },
      { id: 'rainy', icon: '🌧️' },
    ],
  },
  {
    id: 'personal',
    tags: [
      { id: 'feminine', icon: '🌸' },
      { id: 'masculine', icon: '🪒' },
      { id: 'beauty', icon: '💄' },
      { id: 'contacts', icon: '👁️' },
    ],
  },
];

export const DEFAULT_CATEGORIES = [
  { id: 'documents', icon: '🪪' },
  { id: 'tech', icon: '🔌' },
  { id: 'work', icon: '💻' },
  { id: 'clothing', icon: '👕' },
  { id: 'accessories', icon: '🕶️' },
  { id: 'toiletries', icon: '🧴' },
  { id: 'beauty', icon: '✨' },
  { id: 'health', icon: '💊' },
  { id: 'comfort', icon: '🛫' },
  { id: 'essentials', icon: '🎒' },
  { id: 'pre_departure', icon: '🏠' },
];

export const LEGACY_CATEGORY_MAP = {
  '證件與錢包': 'documents',
  '3C 數位': 'tech',
  '工作配備': 'work',
  '衣物與鞋履': 'clothing',
  '配件': 'accessories',
  '盥洗與保養': 'toiletries',
  '美妝與衛生': 'beauty',
  '健康與藥品': 'health',
  '舒適與機上': 'comfort',
  '生活雜物': 'essentials',
  '出發前事項': 'pre_departure',
};

export const DEFAULT_PRESETS = [
  {
    id: 'preset-basic',
    icon: '🧳',
    tags: [],
    isBuiltIn: true,
  },
  {
    id: 'preset-japan-winter',
    icon: '🇯🇵',
    tags: ['international', 'japan', 'winter'],
    isBuiltIn: true,
  },
  {
    id: 'preset-taiwan-summer',
    icon: '🇹🇼',
    tags: ['taiwan', 'summer'],
    isBuiltIn: true,
  },
  {
    id: 'preset-intl-business',
    icon: '💼',
    tags: ['international', 'business'],
    isBuiltIn: true,
  },
  {
    id: 'preset-europe',
    icon: '🇪🇺',
    tags: ['international', 'europe'],
    isBuiltIn: true,
  },
];

function makeItem(id, category, itemType, carryOn, tags, zhName, enName, zhNote = '', enNote = '') {
  return {
    id,
    category,
    itemType,
    carryOn,
    tags,
    name: zhName,
    note: zhNote,
    i18n: {
      'zh-TW': { name: zhName, note: zhNote },
      en: { name: enName, note: enNote },
    },
  };
}

/**
 * tags: [] means "Essentials" — always included in Trip Mode.
 * Non-empty tags: item appears when ANY of its tags is active.
 */
export const DEFAULT_ITEMS = [
  // ── Documents & Wallet ──
  makeItem(
    'doc-wallet', 'documents', 'packing', true, [],
    '錢包（現金 / 信用卡）', 'Wallet (Cash & Credit Cards)',
    '確認提款卡與信用卡有效期限', 'Check card expiration dates before leaving'
  ),
  makeItem(
    'doc-id', 'documents', 'packing', true, [],
    '身分證 / 駕照', 'ID / Driver\'s License',
    '租車或入住登記備用', 'Handy for car rentals or hotel check-in'
  ),
  makeItem(
    'doc-insurance', 'documents', 'packing', true, [],
    '健保卡 / 旅遊保險證明', 'Health / Travel Insurance Card',
    '', ''
  ),
  makeItem(
    'doc-passport', 'documents', 'packing', true, ['international'],
    '護照', 'Passport',
    '確認效期仍有 6 個月以上', 'Ensure at least 6 months of validity remaining'
  ),
  makeItem(
    'doc-visa', 'documents', 'packing', true, ['international'],
    '簽證 / 入境文件 / 訂房確認單', 'Visa / Entry Docs & Bookings',
    '建議手機存離線 PDF 或印出備份', 'Save offline PDFs on your phone or print backups'
  ),
  makeItem(
    'doc-currency', 'documents', 'packing', true, ['international'],
    '外幣 / 當地交通卡', 'Foreign Currency / Transit Card',
    '', ''
  ),
  makeItem(
    'doc-jp-coin', 'documents', 'packing', true, ['japan'],
    '零錢包 & 西瓜卡 / IC 卡', 'Coin Purse & Suica / IC Card',
    '日本硬幣多，零錢包很實用；也可用 Apple Wallet IC 卡', 'Great for Yen coins; Apple Wallet IC cards work too'
  ),
  makeItem(
    'doc-antitheft', 'documents', 'packing', true, ['europe'],
    '防盜背包 / 貼身腰包', 'Anti-theft Bag / Money Belt',
    '歐洲熱門觀光區防扒手必備', 'Recommended in busy European tourist areas'
  ),

  // ── Electronics & Tech ──
  makeItem(
    'tech-phone-charger', 'tech', 'packing', true, [],
    '手機充電器 & 充電線', 'Phone Charger & Cable',
    '', ''
  ),
  makeItem(
    'tech-powerbank', 'tech', 'packing', true, [],
    '行動電源', 'Power Bank',
    '含鋰電池務必放隨身行李，不可託運', 'Lithium battery — carry-on only, never check in'
  ),
  makeItem(
    'tech-earbuds', 'tech', 'packing', true, [],
    '無線耳機', 'Wireless Earbuds / Headphones',
    '', ''
  ),
  makeItem(
    'tech-watch-charger', 'tech', 'packing', false, [],
    '智慧手錶充電器', 'Smartwatch Charger',
    '', ''
  ),
  makeItem(
    'tech-adapter', 'tech', 'packing', false, ['international', 'europe'],
    '萬國轉接頭', 'Universal Travel Adapter',
    '確認當地插座規格與電壓', 'Verify local plug type and voltage'
  ),
  makeItem(
    'tech-sim', 'tech', 'packing', true, ['international'],
    '當地 SIM 卡 / eSIM / 退卡針', 'Local SIM / eSIM & Ejector Pin',
    '出發前先確認漫遊或 eSIM 安裝步驟', 'Check roaming or eSIM activation steps beforehand'
  ),
  makeItem(
    'tech-bt-adapter', 'tech', 'packing', true, ['international'],
    '機上藍牙音訊轉接器', 'In-flight Bluetooth Audio Adapter',
    '搭長途飛機用無線耳機看機上電影超方便', 'Use wireless earbuds with seatback screens'
  ),
  makeItem(
    'tech-ereader', 'tech', 'packing', true, ['international', 'domestic'],
    '電子書閱讀器 / 平板', 'E-reader / Tablet',
    '出發前先下載離線書籍或影片', 'Download books or shows for offline use'
  ),

  // ── Work Gear ──
  makeItem(
    'work-laptop', 'work', 'packing', true, ['business'],
    '筆記型電腦', 'Laptop',
    '過安檢時需單獨取出檢查', 'Keep accessible for airport security'
  ),
  makeItem(
    'work-laptop-charger', 'work', 'packing', true, ['business'],
    '筆電充電器 & 轉接 Hub', 'Laptop Charger & USB-C Hub',
    '簡報用 HDMI / USB-C 轉接頭一併確認', 'Include HDMI / presentation adapters if needed'
  ),
  makeItem(
    'work-badge', 'work', 'packing', true, ['business'],
    '工作證 / 名片', 'Work Badge / Business Cards',
    '拜訪客戶或分部辦公室使用', 'For visiting clients or other office locations'
  ),

  // ── Clothing & Footwear ──
  makeItem(
    'cloth-underwear', 'clothing', 'packing', false, [],
    '內衣褲', 'Underwear',
    '建議依天數多帶 1–2 套備用', 'Pack 1–2 extra pairs just in case'
  ),
  makeItem(
    'cloth-socks', 'clothing', 'packing', false, [],
    '襪子', 'Socks',
    '', ''
  ),
  makeItem(
    'cloth-daily', 'clothing', 'packing', false, [],
    '換洗衣物（上衣 / 褲子 / 洋裝）', 'Daily Outfits (Tops / Bottoms)',
    '', ''
  ),
  makeItem(
    'cloth-pajamas', 'clothing', 'packing', false, [],
    '睡衣', 'Pajamas / Sleepwear',
    '', ''
  ),
  makeItem(
    'cloth-slippers', 'clothing', 'packing', false, [],
    '拖鞋', 'Slippers / Flip-flops',
    '飯店室內或淋浴用', 'Useful for hotel rooms or showers'
  ),
  makeItem(
    'cloth-blazer', 'clothing', 'packing', false, ['business'],
    '正式服裝 / 西裝外套', 'Formal Attire / Blazer',
    '會議、客戶拜訪或上台簡報', 'For meetings, talks, or client visits'
  ),
  makeItem(
    'cloth-coat', 'clothing', 'packing', false, ['winter'],
    '保暖大衣 / 羽絨外套', 'Winter Coat / Down Jacket',
    '', ''
  ),
  makeItem(
    'cloth-thermal', 'clothing', 'packing', false, ['winter'],
    '發熱衣 / 保暖內搭', 'Thermal Base Layers',
    '洋蔥式穿搭，室內暖氣強方便穿脫', 'Easy to layer for warm indoor heating'
  ),
  makeItem(
    'cloth-swimwear', 'clothing', 'packing', false, ['outdoor', 'summer'],
    '泳衣 / 輕便機能服', 'Swimwear / Activewear',
    '', ''
  ),
  makeItem(
    'cloth-raincoat', 'clothing', 'packing', false, ['rainy', 'outdoor'],
    '防水外套 / 輕便雨衣', 'Rain Jacket / Poncho',
    '', ''
  ),

  // ── Accessories ──
  makeItem(
    'acc-sunglasses', 'accessories', 'packing', true, ['summer', 'outdoor', 'usa'],
    '太陽眼鏡', 'Sunglasses',
    '', ''
  ),
  makeItem(
    'acc-sunhat', 'accessories', 'packing', false, ['summer', 'outdoor'],
    '遮陽帽', 'Sun Hat / Cap',
    '', ''
  ),
  makeItem(
    'acc-winter-gear', 'accessories', 'packing', false, ['winter'],
    '毛帽 / 圍巾 / 手套', 'Beanie / Scarf / Gloves',
    '', ''
  ),
  makeItem(
    'acc-jewelry', 'accessories', 'packing', true, ['beauty', 'feminine'],
    '飾品 / 手錶配件', 'Jewelry & Accessories',
    '貴重飾品建議隨身攜帶', 'Keep valuables in carry-on'
  ),

  // ── Toiletries & Skincare ──
  makeItem(
    'care-toothbrush', 'toiletries', 'packing', false, [],
    '牙刷、牙膏 & 牙線', 'Toothbrush, Toothpaste & Floss',
    '許多環保旅宿不主動提供一次性備品', 'Many eco-friendly hotels no longer provide disposable kits'
  ),
  makeItem(
    'care-skincare', 'toiletries', 'packing', false, [],
    '基礎保養品（洗面乳、乳液）', 'Basic Skincare (Cleanser & Lotion)',
    '隨身液體單瓶須 ≤ 100ml 並裝入透明夾鏈袋', 'Carry-on liquids must be ≤ 100ml in a clear zip bag'
  ),
  makeItem(
    'care-lipbalm', 'toiletries', 'packing', true, [],
    '護唇膏 / 護手霜', 'Lip Balm & Hand Cream',
    '機艙與冬季室內乾燥必備', 'Essential for dry flights and winter air'
  ),
  makeItem(
    'care-sunscreen', 'toiletries', 'packing', false, ['summer', 'outdoor'],
    '防曬乳（臉 & 身體）', 'Sunscreen (Face & Body)',
    '', ''
  ),
  makeItem(
    'care-contacts', 'toiletries', 'packing', true, ['contacts'],
    '隱形眼鏡、保養液 & 眼鏡盒', 'Contact Lenses, Solution & Case',
    '備用一般眼鏡也別忘了帶', 'Remember to bring backup glasses too'
  ),
  makeItem(
    'care-deodorant', 'toiletries', 'packing', false, ['summer'],
    '止汗劑 / 體香膏', 'Deodorant / Antiperspirant',
    '', ''
  ),

  // ── Beauty & Hygiene ──
  makeItem(
    'hyg-nailclipper', 'beauty', 'packing', false, [],
    '指甲剪 / 小剪刀', 'Nail Clippers / Small Scissors',
    '剪刀類尖銳物品需放託運行李', 'Pack sharp scissors in checked luggage'
  ),
  makeItem(
    'hyg-makeup', 'beauty', 'packing', false, ['beauty'],
    '卸妝用品 & 化妝品', 'Makeup & Makeup Remover',
    '', ''
  ),
  makeItem(
    'hyg-perfume', 'beauty', 'packing', false, ['beauty'],
    '香水（旅行分裝瓶）', 'Perfume (Travel Atomizer)',
    '', ''
  ),
  makeItem(
    'hyg-hair-tools', 'beauty', 'packing', false, ['beauty', 'feminine'],
    '梳子 / 造型工具', 'Hairbrush / Styling Tools',
    '出國留意吹風機/離子夾是否支援國際電壓', 'Check dual-voltage support when traveling abroad'
  ),
  makeItem(
    'hyg-hairtie', 'beauty', 'packing', true, ['feminine'],
    '髮圈 / 髮夾', 'Hair Ties / Clips',
    '', ''
  ),
  makeItem(
    'hyg-feminine', 'beauty', 'packing', true, ['feminine'],
    '生理用品（衛生棉 / 護墊 / 棉條）', 'Feminine Hygiene Products',
    '', ''
  ),
  makeItem(
    'hyg-shaver-f', 'beauty', 'packing', false, ['feminine'],
    '除毛用品', 'Shaving / Hair Removal Kit',
    '刀片類請放託運行李', 'Pack loose blades in checked luggage'
  ),
  makeItem(
    'hyg-razor-m', 'beauty', 'packing', false, ['masculine'],
    '刮鬍刀 & 刮鬍泡', 'Razor & Shaving Cream',
    '', ''
  ),

  // ── Health & Medicine ──
  makeItem(
    'med-basic', 'health', 'packing', true, [],
    '常備藥品（止痛、過敏、感冒、腸胃）', 'Basic Meds (Pain, Allergy, Cold, Stomach)',
    '重要處方藥請放隨身行李並保留原包裝', 'Keep prescriptions in carry-on with original labels'
  ),
  makeItem(
    'med-vitamins', 'health', 'packing', false, [],
    '日常保健食品 / 維他命', 'Daily Vitamins / Supplements',
    '', ''
  ),
  makeItem(
    'med-mosquito', 'health', 'packing', false, ['summer', 'taiwan', 'outdoor'],
    '防蚊液 / 止癢藥膏', 'Bug Spray / Anti-itch Cream',
    '', ''
  ),

  // ── Flight & Comfort ──
  makeItem(
    'comf-mask', 'comfort', 'packing', true, [],
    '口罩', 'Face Masks',
    '機艙保濕與人多處備用', 'Helpful on dry flights and crowded transit'
  ),
  makeItem(
    'comf-eyemask', 'comfort', 'packing', true, ['international'],
    '眼罩', 'Eye Mask',
    '', ''
  ),
  makeItem(
    'comf-earplugs', 'comfort', 'packing', true, ['international'],
    '降噪耳塞 / 減壓耳塞', 'Earplugs',
    '', ''
  ),
  makeItem(
    'comf-pillow', 'comfort', 'packing', true, ['international'],
    '頸枕 / 飛機掛腳', 'Travel Pillow / Foot Hammock',
    '長途紅眼班機舒適神器', 'Lifesaver on long-haul or red-eye flights'
  ),
  makeItem(
    'comf-massage', 'comfort', 'packing', false, ['japan', 'europe', 'outdoor'],
    '按摩球 / 休足貼布', 'Massage Ball / Foot Relief Patches',
    '日行萬步晚上放鬆小腿與足底', 'Great after 15,000+ step walking days'
  ),

  // ── Everyday Essentials ──
  makeItem(
    'life-bottle', 'essentials', 'packing', true, [],
    '環保水壺', 'Reusable Water Bottle',
    '過機場安檢前先倒空，進候機室再裝水', 'Empty before security and refill at the gate'
  ),
  makeItem(
    'life-umbrella', 'essentials', 'packing', false, [],
    '折疊傘', 'Compact Umbrella',
    '晴雨兩用最方便', 'Useful for both rain and strong sun'
  ),
  makeItem(
    'life-tote', 'essentials', 'packing', true, ['taiwan', 'japan'],
    '環保購物袋 / 飲料提袋', 'Foldable Tote / Drink Carrier',
    '買手搖飲或超商購物免買塑膠袋', 'Handy for convenience stores and boba runs'
  ),
  makeItem(
    'life-fan', 'essentials', 'packing', true, ['summer', 'taiwan'],
    '隨身小電扇', 'Portable Handheld Fan',
    '含鋰電池請放隨身行李', 'Lithium battery — pack in carry-on'
  ),
  makeItem(
    'life-scale', 'essentials', 'packing', false, ['international', 'japan', 'europe'],
    '行李秤', 'Luggage Scale',
    '血拼回程前先秤重避免超重罰款', 'Avoid overweight baggage fees on the return flight'
  ),
  makeItem(
    'life-laundrybag', 'essentials', 'packing', false, [],
    '髒衣收納袋 / 壓縮袋', 'Laundry Bag / Packing Cubes',
    '', ''
  ),

  // ── Pre-departure Tasks ──
  makeItem(
    'task-doors', 'pre_departure', 'task', false, [],
    '檢查所有門窗已關緊並反鎖', 'Lock all doors & windows',
    '含陽台門與氣窗', 'Including balcony doors and side windows'
  ),
  makeItem(
    'task-power', 'pre_departure', 'task', false, [],
    '關閉非必要電源插頭與瓦斯', 'Unplug appliances & check gas/stove',
    '', ''
  ),
  makeItem(
    'task-plants', 'pre_departure', 'task', false, [],
    '替盆栽澆水 / 安排植物照顧', 'Water plants / arrange plant care',
    '', ''
  ),
  makeItem(
    'task-trash', 'pre_departure', 'task', false, [],
    '倒垃圾 & 清理冰箱易腐食物', 'Take out trash & clear perishable food',
    '避免回家異味', 'Prevents odors while you are away'
  ),
  makeItem(
    'task-alarm', 'pre_departure', 'task', false, [],
    '關閉平日固定鬧鐘', 'Turn off weekday alarms',
    '', ''
  ),
  makeItem(
    'task-mailbox', 'pre_departure', 'task', false, [],
    '清空信箱 / 確認包裹與定期配送', 'Clear mailbox & pause deliveries',
    '長途出門可暫停定期配送或請人代收', 'Hold mail or pause recurring subscriptions'
  ),
  makeItem(
    'task-checkin', 'pre_departure', 'task', false, ['international'],
    '完成線上報到 & 確認航班/交通時間', 'Check in online & confirm flight times',
    '起飛前 24–48 小時開放', 'Usually opens 24–48 hours before departure'
  ),
  makeItem(
    'task-card', 'pre_departure', 'task', false, ['international'],
    '確認信用卡海外消費功能 & 漫遊方案', 'Verify international card use & roaming plan',
    '', ''
  ),
  makeItem(
    'task-ooo', 'pre_departure', 'task', false, ['business', 'international'],
    '設定工作休假 / 出差自動回覆 (OOO)', 'Set Out-of-Office (OOO) auto-reply',
    '', ''
  ),
];
