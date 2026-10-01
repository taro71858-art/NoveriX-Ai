/**
 * Бизнес-аналитик — Мобильное PWA-приложение для владельцев малого бизнеса
 * Все расчеты выполняются кодом JavaScript на устройстве.
 * Числа с пробелами (150 000), проценты с запятой (30,5%).
 */

// ================= 1. КОНСТАНТЫ И НОРМЫ НИШ =================
const NICHES = {
  cafe: { name: 'Кафе', salaries: 35, rent: 15, ads: 8 },
  restaurant: { name: 'Ресторан или бар', salaries: 33, rent: 12, ads: 5 },
  clothing: { name: 'Магазин одежды', salaries: 12, rent: 12, ads: 8 },
  grocery: { name: 'Продуктовый магазин', salaries: 10, rent: 6, ads: 2 },
  beauty: { name: 'Салон красоты', salaries: 45, rent: 15, ads: 8 },
  barbershop: { name: 'Барбершоп', salaries: 50, rent: 12, ads: 8 },
  auto: { name: 'Автосервис', salaries: 30, rent: 10, ads: 5 },
  online_shop: { name: 'Онлайн-магазин', salaries: 10, rent: 3, ads: 20 },
  fitness: { name: 'Фитнес-студия', salaries: 35, rent: 20, ads: 10 },
  construction: { name: 'Ремонт и строительство', salaries: 30, rent: 3, ads: 5 },
  courses: { name: 'Курсы и обучение', salaries: 35, rent: 10, ads: 15 },
  it_services: { name: 'IT и услуги', salaries: 55, rent: 6, ads: 10 },
  clinic: { name: 'Медицинская клиника', salaries: 30, rent: 10, ads: 8 },
  delivery: { name: 'Доставка', salaries: 30, rent: 5, ads: 5 },
  production: { name: 'Производство', salaries: 28, rent: 6, ads: 4 },
  other_services: { name: 'Другие услуги', salaries: 40, rent: 10, ads: 15 },
  custom: { name: 'Своя ниша', salaries: 30, rent: 10, ads: 10 }
};

// 73 мировые валюты
const CURRENCIES = [
  { code: 'RUB', symbol: '₽', name: 'Российский рубль', defaultRateToUSD: 92.5 },
  { code: 'USD', symbol: '$', name: 'Доллар США', defaultRateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Евро', defaultRateToUSD: 0.92 },
  { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге', defaultRateToUSD: 460.0 },
  { code: 'BYN', symbol: 'Br', name: 'Белорусский рубль', defaultRateToUSD: 3.25 },
  { code: 'UZS', symbol: "so'm", name: 'Узбекский сум', defaultRateToUSD: 12600.0 },
  { code: 'GEL', symbol: '₾', name: 'Грузинский лари', defaultRateToUSD: 2.70 },
  { code: 'AMD', symbol: '֏', name: 'Армянский драм', defaultRateToUSD: 388.0 },
  { code: 'KGS', symbol: 'с', name: 'Киргизский сом', defaultRateToUSD: 87.5 },
  { code: 'TJS', symbol: 'смн', name: 'Таджикский сомони', defaultRateToUSD: 10.9 },
  { code: 'TRY', symbol: '₺', name: 'Турецкая лира', defaultRateToUSD: 34.0 },
  { code: 'AED', symbol: 'AED', name: 'Дирхам ОАЭ', defaultRateToUSD: 3.67 },
  { code: 'CNY', symbol: '¥', name: 'Китайский юань', defaultRateToUSD: 7.23 },
  { code: 'GBP', symbol: '£', name: 'Британский фунт', defaultRateToUSD: 0.79 },
  { code: 'CHF', symbol: 'CHF', name: 'Швейцарский франк', defaultRateToUSD: 0.90 },
  { code: 'PLN', symbol: 'zł', name: 'Польский злотый', defaultRateToUSD: 3.98 },
  { code: 'ILS', symbol: '₪', name: 'Израильский шекель', defaultRateToUSD: 3.75 },
  { code: 'JPY', symbol: '¥', name: 'Японская иена', defaultRateToUSD: 155.0 },
  { code: 'CAD', symbol: 'C$', name: 'Канадский доллар', defaultRateToUSD: 1.37 },
  { code: 'AUD', symbol: 'A$', name: 'Австралийский доллар', defaultRateToUSD: 1.52 },
  { code: 'INR', symbol: '₹', name: 'Индийская рупия', defaultRateToUSD: 83.5 },
  { code: 'BRL', symbol: 'R$', name: 'Бразильский реал', defaultRateToUSD: 5.25 },
  { code: 'KRW', symbol: '₩', name: 'Южнокорейская вона', defaultRateToUSD: 1370.0 },
  { code: 'THB', symbol: '฿', name: 'Тайский бат', defaultRateToUSD: 36.8 },
  { code: 'VND', symbol: '₫', name: 'Вьетнамский донг', defaultRateToUSD: 25400.0 },
  { code: 'IDR', symbol: 'Rp', name: 'Индонезийская рупия', defaultRateToUSD: 16200.0 },
  { code: 'MXN', symbol: 'Mex$', name: 'Мексиканское песо', defaultRateToUSD: 17.2 },
  { code: 'SAR', symbol: '﷼', name: 'Саудовский риял', defaultRateToUSD: 3.75 },
  { code: 'QAR', symbol: 'QR', name: 'Катарский риал', defaultRateToUSD: 3.64 },
  { code: 'KWD', symbol: 'KD', name: 'Кувейтский динар', defaultRateToUSD: 0.31 },
  { code: 'BHD', symbol: 'BD', name: 'Бахрейнский динар', defaultRateToUSD: 0.38 },
  { code: 'OMR', symbol: 'OMR', name: 'Оманский риал', defaultRateToUSD: 0.385 },
  { code: 'EGP', symbol: 'E£', name: 'Египетский фунт', defaultRateToUSD: 47.5 },
  { code: 'ZAR', symbol: 'R', name: 'Южноафриканский рэнд', defaultRateToUSD: 18.5 },
  { code: 'SGD', symbol: 'S$', name: 'Сингапурский доллар', defaultRateToUSD: 1.35 },
  { code: 'HKD', symbol: 'HK$', name: 'Гонконгский доллар', defaultRateToUSD: 7.82 },
  { code: 'NZD', symbol: 'NZ$', name: 'Новозеландский доллар', defaultRateToUSD: 1.65 },
  { code: 'SEK', symbol: 'kr', name: 'Шведская крона', defaultRateToUSD: 10.7 },
  { code: 'NOK', symbol: 'kr', name: 'Норвежская крона', defaultRateToUSD: 10.8 },
  { code: 'DKK', symbol: 'kr', name: 'Датская крона', defaultRateToUSD: 6.90 },
  { code: 'CZK', symbol: 'Kč', name: 'Чешская крона', defaultRateToUSD: 23.1 },
  { code: 'HUF', symbol: 'Ft', name: 'Венгерский форинт', defaultRateToUSD: 360.0 },
  { code: 'RON', symbol: 'lei', name: 'Румынский лей', defaultRateToUSD: 4.60 },
  { code: 'BGN', symbol: 'лв', name: 'Болгарский лев', defaultRateToUSD: 1.80 },
  { code: 'RSD', symbol: 'дин', name: 'Сербский динар', defaultRateToUSD: 108.0 },
  { code: 'BAM', symbol: 'KM', name: 'Боснийская марка', defaultRateToUSD: 1.80 },
  { code: 'MKD', symbol: 'ден', name: 'Македонский денар', defaultRateToUSD: 56.5 },
  { code: 'ALL', symbol: 'L', name: 'Албанский лек', defaultRateToUSD: 93.5 },
  { code: 'MDL', symbol: 'L', name: 'Молдавский лей', defaultRateToUSD: 17.7 },
  { code: 'UAH', symbol: '₴', name: 'Украинская гривна', defaultRateToUSD: 40.5 },
  { code: 'AZN', symbol: '₼', name: 'Азербайджанский манат', defaultRateToUSD: 1.70 },
  { code: 'TMT', symbol: 'm', name: 'Туркменский манат', defaultRateToUSD: 3.50 },
  { code: 'MNT', symbol: '₮', name: 'Монгольский тугрик', defaultRateToUSD: 3450.0 },
  { code: 'PHP', symbol: '₱', name: 'Филиппинское песо', defaultRateToUSD: 58.0 },
  { code: 'MYR', symbol: 'RM', name: 'Малайзийский ринггит', defaultRateToUSD: 4.70 },
  { code: 'PKR', symbol: '₨', name: 'Пакистанская рупия', defaultRateToUSD: 278.0 },
  { code: 'BDT', symbol: '৳', name: 'Бангладешская така', defaultRateToUSD: 117.0 },
  { code: 'LKR', symbol: 'Rs', name: 'Шри-ланкийская рупия', defaultRateToUSD: 302.0 },
  { code: 'NGN', symbol: '₦', name: 'Нигерийская найра', defaultRateToUSD: 1480.0 },
  { code: 'KES', symbol: 'KSh', name: 'Кенийский шиллинг', defaultRateToUSD: 130.0 },
  { code: 'GHS', symbol: 'GH₵', name: 'Ганский седи', defaultRateToUSD: 14.5 },
  { code: 'COP', symbol: 'Col$', name: 'Колумбийское песо', defaultRateToUSD: 3880.0 },
  { code: 'ARS', symbol: '$', name: 'Аргентинское песо', defaultRateToUSD: 890.0 },
  { code: 'CLP', symbol: 'CLP$', name: 'Чилийское песо', defaultRateToUSD: 920.0 },
  { code: 'PEN', symbol: 'S/.', name: 'Перуанский соль', defaultRateToUSD: 3.75 },
  { code: 'UYU', symbol: '$U', name: 'Уругвайское песо', defaultRateToUSD: 38.8 },
  { code: 'ISK', symbol: 'kr', name: 'Исландская крона', defaultRateToUSD: 138.0 },
  { code: 'HRK', symbol: 'kn', name: 'Хорватская куна', defaultRateToUSD: 6.95 },
  { code: 'JOD', symbol: 'JD', name: 'Иорданский динар', defaultRateToUSD: 0.71 },
  { code: 'LBP', symbol: 'L£', name: 'Ливанский фунт', defaultRateToUSD: 89500.0 },
  { code: 'DZD', symbol: 'DA', name: 'Алжирский динар', defaultRateToUSD: 134.0 },
  { code: 'MAD', symbol: 'MAD', name: 'Марокканский дирхам', defaultRateToUSD: 10.0 },
  { code: 'TND', symbol: 'DT', name: 'Тунисский динар', defaultRateToUSD: 3.12 }
];

// ================= 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ =================
const Storage = {
  get(key, defaultVal) {
    try {
      const v = localStorage.getItem('biz_' + key);
      return v !== null ? JSON.parse(v) : defaultVal;
    } catch (e) {
      console.warn('Storage read error:', e);
      return defaultVal;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem('biz_' + key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }
};

const appState = {
  niche: Storage.get('niche', 'cafe'),
  customNorms: Storage.get('custom_norms', { salaries: 30, rent: 10, ads: 10 }),
  inputs: Storage.get('inputs', {
    revenue: 500000,
    rent: 100000,
    salaries: 200000,
    ads: 50000,
    other: 0,
    note: ''
  }),
  currency: Storage.get('currency', 'RUB'),
  rates: Storage.get('rates', {}),
  ratesUpdatedAt: Storage.get('rates_updated_at', null),
  ratesIsOffline: Storage.get('rates_is_offline', true),
  history: Storage.get('history', []),
  geminiApiKey: Storage.get('gemini_api_key', ''),
  advisorMode: Storage.get('advisor_mode', 'ai'), // 'ai' or 'offline'
  advisorHistory: Storage.get('advisor_history', []),
  theme: Storage.get('theme', 'dark'),
  onboardingDone: Storage.get('onboarding_done', false),
  whatIf: { price: 0, rent: 0, ads: 0, salaries: 0 },
  itemToDeleteId: null
};

// ================= 3. УТИЛИТЫ ФОРМАТИРОВАНИЯ =================
function getCurrencyObj(code) {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

function getCurrencySymbol() {
  const c = getCurrencyObj(appState.currency);
  return c ? c.symbol : '₽';
}

// Форматирование чисел с пробелами: 150 000 ₽
function formatMoney(num) {
  if (num === null || num === undefined || isNaN(num)) num = 0;
  const rounded = Math.round(num);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const symbol = getCurrencySymbol();
  return `${isNegative ? '-' : ''}${absStr} ${symbol}`;
}

// Форматирование процентов с запятой: 30,5%
function formatPercent(num) {
  if (num === null || num === undefined || isNaN(num)) num = 0;
  return (Math.round(num * 10) / 10).toFixed(1).replace('.', ',') + '%';
}

// Всплывающее уведомление
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// Анимация набегающих чисел
function animateNumber(element, targetVal, formatFn) {
  if (!element) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    element.textContent = formatFn(targetVal);
    return;
  }

  const startVal = Number(element.dataset.currentVal || 0);
  element.dataset.currentVal = targetVal;
  const duration = 750; // мс
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Плавное замедление cubic-ease-out
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (targetVal - startVal) * ease;
    element.textContent = formatFn(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = formatFn(targetVal);
    }
  }

  requestAnimationFrame(step);
}

// Получить нормы выбранной ниши
function getCurrentNorms() {
  if (appState.niche === 'custom') {
    return {
      name: 'Своя ниша',
      salaries: Number(appState.customNorms.salaries || 30),
      rent: Number(appState.customNorms.rent || 10),
      ads: Number(appState.customNorms.ads || 10)
    };
  }
  return NICHES[appState.niche] || NICHES.cafe;
}

// ================= 4. ВЫЧИСЛЕНИЯ И АНАЛИТИКА =================
function calculateMonth(inputs, norms) {
  const revenue = Math.max(0, Number(inputs.revenue) || 0);
  const rent = Math.max(0, Number(inputs.rent) || 0);
  const salaries = Math.max(0, Number(inputs.salaries) || 0);
  const ads = Math.max(0, Number(inputs.ads) || 0);
  const other = Math.max(0, Number(inputs.other) || 0);

  const totalExpenses = rent + salaries + ads + other;
  const profit = revenue - totalExpenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  // Доли расходов в % дохода
  const rentPct = revenue > 0 ? (rent / revenue) * 100 : 0;
  const salariesPct = revenue > 0 ? (salaries / revenue) * 100 : 0;
  const adsPct = revenue > 0 ? (ads / revenue) * 100 : 0;
  const otherPct = revenue > 0 ? (other / revenue) * 100 : 0;
  const expPct = revenue > 0 ? (totalExpenses / revenue) * 100 : 0;

  // Отклонения от норм
  const rentExcessPct = rentPct - norms.rent;
  const salariesExcessPct = salariesPct - norms.salaries;
  const adsExcessPct = adsPct - norms.ads;

  const rentExcessMoney = rentExcessPct > 0 && revenue > 0 ? Math.round((rentExcessPct / 100) * revenue) : 0;
  const salariesExcessMoney = salariesExcessPct > 0 && revenue > 0 ? Math.round((salariesExcessPct / 100) * revenue) : 0;
  const adsExcessMoney = adsExcessPct > 0 && revenue > 0 ? Math.round((adsExcessPct / 100) * revenue) : 0;

  // Поиск максимальной статьи расходов
  const expenseItems = [
    { key: 'rent', name: 'Аренда', amount: rent, pct: rentPct, norm: norms.rent, excessMoney: rentExcessMoney },
    { key: 'salaries', name: 'Зарплаты', amount: salaries, pct: salariesPct, norm: norms.salaries, excessMoney: salariesExcessMoney },
    { key: 'ads', name: 'Реклама', amount: ads, pct: adsPct, norm: norms.ads, excessMoney: adsExcessMoney },
    { key: 'other', name: 'Прочие расходы', amount: other, pct: otherPct, norm: 0, excessMoney: 0 }
  ];

  const sortedExpenses = [...expenseItems].sort((a, b) => b.amount - a.amount);
  const largestExpense = sortedExpenses[0];

  const overNormItems = expenseItems.filter(item => item.excessMoney > 0);

  return {
    revenue,
    rent,
    salaries,
    ads,
    other,
    totalExpenses,
    profit,
    margin,
    rentPct,
    salariesPct,
    adsPct,
    otherPct,
    expPct,
    rentExcessMoney,
    salariesExcessMoney,
    adsExcessMoney,
    largestExpense,
    overNormItems,
    expenseItems
  };
}

// Генерация 3 конкретных действий с цифрами клиента
function generateThreeActions(res, norms) {
  const actions = [];
  const symbol = getCurrencySymbol();

  if (res.profit < 0) {
    // Сценарий 1: УБЫТОК
    const deficit = Math.abs(res.profit);
    actions.push(`1. 🔴 <strong>Остановить кассовый разрыв:</strong> Для выхода в ноль (точку безубыточности) требуется выручка не менее ${formatMoney(res.totalExpenses)} (текущий дефицит: ${formatMoney(deficit)}).`);
    
    if (res.overNormItems.length > 0) {
      const topExcess = res.overNormItems.sort((a, b) => b.excessMoney - a.excessMoney)[0];
      actions.push(`2. ✂️ <strong>Сократить перерасход по статье «${topExcess.name}»:</strong> Статья превышает норму ниши на ${formatPercent(topExcess.pct - topExcess.norm)}. Снижение затрат на ${formatMoney(topExcess.excessMoney)} вернёт статью в норму.`);
    } else {
      actions.push(`2. ✂️ <strong>Оптимизировать постоянные расходы:</strong> Проведите ревизию аренды и сервисов для снижения ежемесячных затрат хотя бы на ${formatMoney(Math.round(deficit * 0.5))}.`);
    }

    const testPriceHike = Math.round(res.revenue * 0.1);
    actions.push(`3. 📈 <strong>Протестировать подъем среднего чека на 10%:</strong> При сохранении объема продаж это принесёт дополнительно +${formatMoney(testPriceHike)} чистой выручки.`);
  } else if (res.margin < 10) {
    // Сценарий 2: НИЗКАЯ МАРЖА (0-10%)
    const boost10Pct = Math.round(res.revenue * 0.1);
    actions.push(`1. 📈 <strong>Поднять средний чек или цены на 10%:</strong> Это даст дополнительно +${formatMoney(boost10Pct)} к выручке и сразу увеличит маржу почти в 2 раза при тех же затратах.`);

    if (res.overNormItems.length > 0) {
      const topExcess = res.overNormItems[0];
      actions.push(`2. 🔍 <strong>Устранить перерасход по статье «${topExcess.name}»:</strong> Вы тратите ${formatPercent(topExcess.pct)} вместо нормы ${formatPercent(topExcess.norm)}. Экономия ${formatMoney(topExcess.excessMoney)} сразу перейдет в чистую прибыль.`);
    } else {
      actions.push(`2. 🤝 <strong>Стимулировать повторные продажи:</strong> Запустите рассылку или спецпредложение по текущей базе клиентов — это даёт маржинальные продажи без роста затрат на рекламу.`);
    }

    const reserveAmount = Math.round(res.profit * 0.3);
    actions.push(`3. 🛡️ <strong>Сформировать подушку безопасности:</strong> Отложите ${formatMoney(reserveAmount)} (30% от текущей прибыли) в неприкасаемый фонд резерва на непредвиденные расходы.`);
  } else {
    // Сценарий 3: БИЗНЕС ПРИБЫЛЬНЫЙ (>=10%)
    if (res.adsPct < norms.ads && res.adsPct < 15) {
      const adRoom = Math.round((norms.ads - res.adsPct) / 100 * res.revenue);
      actions.push(`1. 🚀 <strong>Масштабировать маркетинг:</strong> Расходы на рекламу (${formatPercent(res.adsPct)}) ниже нормы ниши (${formatPercent(norms.ads)}). Вы можете безопасно инвестировать до +${formatMoney(adRoom)} в проверенные каналы трафика.`);
    } else {
      actions.push(`1. 🚀 <strong>Усиливать ключевые продукты-локомотивы:</strong> Сосредоточьтесь на позициях с максимальной маржинальностью для увеличения среднего чека.`);
    }

    if (res.overNormItems.length > 0) {
      const topExcess = res.overNormItems[0];
      actions.push(`2. ⚖️ <strong>Держать под контролем «${topExcess.name}»:</strong> Статья выше нормы на ${formatMoney(topExcess.excessMoney)}. Оптимизация этой статьи увеличит прибыль до ${formatMoney(res.profit + topExcess.excessMoney)}.`);
    } else {
      actions.push(`2. 💎 <strong>Оцифровать LTV постоянных клиентов:</strong> Внедрите программу лояльности, чтобы поднять частоту покупок на 15-20%.`);
    }

    const reserveAmount = Math.round(res.profit * 0.4);
    actions.push(`3. 💰 <strong>Фондирование роста и резерва:</strong> Направьте ${formatMoney(reserveAmount)} (40% прибыли) на развитие и резервный фонд, остальное можно выводить как дивиденды.`);
  }

  return actions;
}

// ================= 5. ОТРИСОВКА ВКЛАДКИ «АНАЛИЗ» =================
function renderAnalysis() {
  const norms = getCurrentNorms();
  const res = calculateMonth(appState.inputs, norms);

  // Обновление символов валюты в инпутах
  const sym = getCurrencySymbol();
  document.querySelectorAll('.currency-symbol').forEach(el => el.textContent = sym);

  // Ниша в шапке и в селекторе
  const headerNicheName = document.getElementById('header-niche-name');
  if (headerNicheName) headerNicheName.textContent = norms.name;

  const nicheSelect = document.getElementById('niche-select');
  if (nicheSelect && nicheSelect.value !== appState.niche) {
    nicheSelect.value = appState.niche;
  }

  const btnOpenCustom = document.getElementById('btn-open-custom-norms');
  if (btnOpenCustom) {
    btnOpenCustom.style.display = appState.niche === 'custom' ? 'inline-block' : 'none';
  }

  // Заполнение полей ввода (если не в фокусе)
  const setInputVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) {
      el.value = val === 0 ? '' : val;
    }
  };
  setInputVal('in-revenue', appState.inputs.revenue);
  setInputVal('in-rent', appState.inputs.rent);
  setInputVal('in-salaries', appState.inputs.salaries);
  setInputVal('in-ads', appState.inputs.ads);
  setInputVal('in-other', appState.inputs.other);
  const noteEl = document.getElementById('in-month-note');
  if (noteEl && document.activeElement !== noteEl) {
    noteEl.value = appState.inputs.note || '';
  }

  // Прибыль и статусная плашка
  const profitEl = document.getElementById('analysis-profit-value');
  const badgeEl = document.getElementById('analysis-status-badge');
  const ringValEl = document.getElementById('analysis-ring-val');
  const ringPctEl = document.getElementById('analysis-margin-pct');
  const expEl = document.getElementById('analysis-total-expenses');

  if (expEl) expEl.textContent = `Всего расходов: ${formatMoney(res.totalExpenses)}`;

  animateNumber(profitEl, res.profit, formatMoney);

  // Расчет кольца маржи (r=58, длина окружности C = 2 * PI * 58 = 364.4)
  const circumference = 364.4;
  let clampedMargin = Math.max(0, Math.min(res.margin, 100));
  let offset = circumference - (clampedMargin / 100) * circumference;

  let statusColor = 'var(--accent-green)';
  let statusBadgeText = 'Бизнес прибыльный';
  let badgeClass = 'badge-green';

  if (res.profit < 0) {
    statusColor = 'var(--accent-red)';
    statusBadgeText = 'Бизнес в минусе';
    badgeClass = 'badge-red';
    offset = circumference; // пустой круг при минусе
    if (profitEl) {
      profitEl.style.color = 'var(--accent-red)';
      profitEl.style.textShadow = '0 0 24px rgba(255, 111, 97, 0.35)';
    }
  } else if (res.margin < 10) {
    statusColor = 'var(--accent-yellow)';
    statusBadgeText = 'Низкая маржинальность';
    badgeClass = 'badge-yellow';
    if (profitEl) {
      profitEl.style.color = 'var(--accent-yellow)';
      profitEl.style.textShadow = '0 0 24px rgba(251, 191, 36, 0.35)';
    }
  } else {
    statusColor = 'var(--accent-green)';
    statusBadgeText = 'Бизнес прибыльный';
    badgeClass = 'badge-green';
    if (profitEl) {
      profitEl.style.color = 'var(--accent-green)';
      profitEl.style.textShadow = '0 0 24px rgba(52, 211, 153, 0.35)';
    }
  }

  if (badgeEl) {
    badgeEl.textContent = statusBadgeText;
    badgeEl.className = 'card-badge ' + badgeClass;
  }

  if (ringValEl) {
    ringValEl.style.strokeDashoffset = offset;
    ringValEl.style.stroke = res.profit < 0 ? 'url(#ring-grad-red)' : (res.margin < 10 ? 'url(#ring-grad-yellow)' : 'url(#ring-grad-green)');
  }

  if (ringPctEl) {
    ringPctEl.textContent = formatPercent(res.margin);
    ringPctEl.style.color = statusColor;
  }

  // 1. Чип со сравнением к прошлому периоду
  const compChipEl = document.getElementById('analysis-comparison-chip');
  if (compChipEl) {
    if (appState.history && appState.history.length > 0) {
      const prevMonth = appState.history[0];
      const prevProfit = Number(prevMonth.profit || 0);
      if (prevProfit !== 0) {
        const diff = res.profit - prevProfit;
        const diffPct = Math.round((Math.abs(diff) / Math.abs(prevProfit)) * 100);
        const prevLabel = prevMonth.formattedDate ? prevMonth.formattedDate.split(' ')[0] : 'прошлым';
        if (diff > 0) {
          compChipEl.innerHTML = `<span style="color:var(--accent-green); display:inline-flex; align-items:center; gap:3px;">▲ +${diffPct}% к ${prevLabel}</span>`;
        } else if (diff < 0) {
          compChipEl.innerHTML = `<span style="color:var(--accent-red); display:inline-flex; align-items:center; gap:3px;">▼ -${diffPct}% к ${prevLabel}</span>`;
        } else {
          compChipEl.innerHTML = `<span style="color:var(--text-secondary); display:inline-flex; align-items:center; gap:3px;">● На уровне ${prevLabel}</span>`;
        }
      } else {
        compChipEl.innerHTML = `<span style="color:var(--text-secondary);">Сравнение: ${prevMonth.formattedDate || 'прошлый месяц'}</span>`;
      }
    } else {
      compChipEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:3px;">● Текущий расчет</span>`;
    }
  }

  // 2. SVG-спарклайн динамики под суммой чистой прибыли
  const sparkSvg = document.getElementById('analysis-sparkline-svg');
  if (sparkSvg) {
    let historyPoints = (appState.history || []).slice(0, 5).reverse().map(h => Number(h.profit || 0));
    historyPoints.push(res.profit);
    if (historyPoints.length < 2) {
      historyPoints = [res.profit * 0.85, res.profit];
    }
    const minP = Math.min(...historyPoints);
    const maxP = Math.max(...historyPoints);
    const range = (maxP - minP) || 1;
    const w = 150;
    const h = 32;
    const pad = 4;
    const stepX = (w - pad * 2) / (historyPoints.length - 1);
    const pts = historyPoints.map((val, idx) => {
      const x = pad + idx * stepX;
      const y = h - pad - ((val - minP) / range) * (h - pad * 2);
      return { x, y };
    });
    const linePath = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const lastPt = pts[pts.length - 1];
    const areaPath = `${linePath} L ${lastPt.x.toFixed(1)} ${h} L ${pts[0].x.toFixed(1)} ${h} Z`;

    sparkSvg.innerHTML = `
      <defs>
        <linearGradient id="hero-spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${statusColor}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${statusColor}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#hero-spark-grad)" />
      <path d="${linePath}" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="3" fill="${statusColor}" stroke="#ffffff" stroke-width="1" />
    `;
  }

  // Отрисовка таблицы расходов
  const tbody = document.getElementById('tbody-expenses');
  if (tbody) {
    let rowsHtml = '';

    // Доход
    rowsHtml += `<tr>
      <td><strong>Доход (выручка)</strong></td>
      <td style="text-align:right;"><strong>${formatMoney(res.revenue)}</strong></td>
      <td style="text-align:right;">100%</td>
      <td style="text-align:right;">—</td>
    </tr>`;

    // Аренда
    const rentStatus = res.rentExcessMoney > 0
      ? `<span style="color:var(--accent-red); font-size:0.75rem;">▲ +${formatMoney(res.rentExcessMoney)}</span>`
      : `<span style="color:var(--accent-green); font-size:0.75rem;">В норме</span>`;
    rowsHtml += `<tr>
      <td>Аренда</td>
      <td style="text-align:right;">${formatMoney(res.rent)}</td>
      <td style="text-align:right;">${formatPercent(res.rentPct)}</td>
      <td style="text-align:right;">${formatPercent(norms.rent)}<br>${rentStatus}</td>
    </tr>`;

    // Зарплаты
    const salStatus = res.salariesExcessMoney > 0
      ? `<span style="color:var(--accent-red); font-size:0.75rem;">▲ +${formatMoney(res.salariesExcessMoney)}</span>`
      : `<span style="color:var(--accent-green); font-size:0.75rem;">В норме</span>`;
    rowsHtml += `<tr>
      <td>Зарплаты (ФОТ)</td>
      <td style="text-align:right;">${formatMoney(res.salaries)}</td>
      <td style="text-align:right;">${formatPercent(res.salariesPct)}</td>
      <td style="text-align:right;">${formatPercent(norms.salaries)}<br>${salStatus}</td>
    </tr>`;

    // Реклама
    const adsStatus = res.adsExcessMoney > 0
      ? `<span style="color:var(--accent-red); font-size:0.75rem;">▲ +${formatMoney(res.adsExcessMoney)}</span>`
      : `<span style="color:var(--accent-green); font-size:0.75rem;">В норме</span>`;
    rowsHtml += `<tr>
      <td>Реклама</td>
      <td style="text-align:right;">${formatMoney(res.ads)}</td>
      <td style="text-align:right;">${formatPercent(res.adsPct)}</td>
      <td style="text-align:right;">${formatPercent(norms.ads)}<br>${adsStatus}</td>
    </tr>`;

    // Прочие
    rowsHtml += `<tr>
      <td>Прочие расходы</td>
      <td style="text-align:right;">${formatMoney(res.other)}</td>
      <td style="text-align:right;">${formatPercent(res.otherPct)}</td>
      <td style="text-align:right;">—</td>
    </tr>`;

    // Итого расходы
    rowsHtml += `<tr style="border-top:1px solid var(--border-light);">
      <td><strong>Итого расходы</strong></td>
      <td style="text-align:right;"><strong>${formatMoney(res.totalExpenses)}</strong></td>
      <td style="text-align:right;">${formatPercent(res.expPct)}</td>
      <td style="text-align:right;">—</td>
    </tr>`;

    // Чистая прибыль — плашка по ТЗ
    const profitPlateBg = res.profit < 0 ? 'var(--accent-red-bg)' : (res.margin < 10 ? 'var(--accent-yellow-bg)' : 'var(--accent-green-bg)');
    const profitPlateBorder = res.profit < 0 ? 'var(--accent-red-border)' : (res.margin < 10 ? 'var(--accent-yellow-border)' : 'var(--accent-green-border)');
    rowsHtml += `<tr style="background:${profitPlateBg}; border:1px solid ${profitPlateBorder}; border-radius:12px;">
      <td><strong style="color:${statusColor}; font-size:0.96rem;">Чистая прибыль</strong></td>
      <td style="text-align:right;"><strong style="color:${statusColor}; font-size:1.02rem;">${formatMoney(res.profit)}</strong></td>
      <td style="text-align:right;"><strong style="color:${statusColor};">${formatPercent(res.margin)}</strong></td>
      <td style="text-align:right;">—</td>
    </tr>`;

    tbody.innerHTML = rowsHtml;
  }

  // Отрисовка блока «Почему так»
  const whyContent = document.getElementById('why-content');
  if (whyContent) {
    let html = '';
    if (res.totalExpenses === 0 && res.revenue === 0) {
      html = '<p style="color:var(--text-muted);">Введите показатели месяца для анализа структуры расходов.</p>';
    } else {
      html += `<p>• <strong>Крупнейшая статья затрат:</strong> «${res.largestExpense.name}» — составляет <strong>${formatMoney(res.largestExpense.amount)}</strong> (${formatPercent(res.largestExpense.pct)} от выручки).</p>`;
      
      if (res.overNormItems.length > 0) {
        html += `<p style="margin-top:6px;">• <strong>Превышение норм ниши «${norms.name}»:</strong></p><ul style="padding-left:18px; margin-top:4px;">`;
        res.overNormItems.forEach(item => {
          html += `<li>Статья «${item.name}»: ${formatPercent(item.pct)} при ориентире ${formatPercent(item.norm)}. Перерасход составляет <strong>+${formatMoney(item.excessMoney)}</strong>.</li>`;
        });
        html += `</ul>`;
      } else {
        html += `<p style="margin-top:6px; color:var(--accent-green);">• <strong>Все ключевые статьи расходов укладываются в ориентировочные нормы вашей ниши.</strong></p>`;
      }

      if (res.profit < 0) {
        html += `<p style="margin-top:8px; color:var(--accent-red);">• <strong>Причина убытка:</strong> Расходы (${formatMoney(res.totalExpenses)}) превышают поступления (${formatMoney(res.revenue)}). Требуется сокращение перерасходов или рост чека.</p>`;
      }
    }
    whyContent.innerHTML = html;
  }

  // Отрисовка блока «Расчёт по шагам»
  const calcStepsContent = document.getElementById('calc-steps-content');
  if (calcStepsContent) {
    let stepsHtml = `
      <div style="margin-bottom:6px;"><strong>Шаг 1. Сумма всех расходов:</strong><br>
        Аренда (${formatMoney(res.rent)}) + Зарплаты (${formatMoney(res.salaries)}) + Реклама (${formatMoney(res.ads)}) + Прочее (${formatMoney(res.other)}) = <strong>${formatMoney(res.totalExpenses)}</strong>
      </div>
      <div style="margin-bottom:6px;"><strong>Шаг 2. Расчет чистой прибыли:</strong><br>
        Выручка (${formatMoney(res.revenue)}) - Расходы (${formatMoney(res.totalExpenses)}) = <strong style="color:${statusColor};">${formatMoney(res.profit)}</strong>
      </div>
      <div style="margin-bottom:6px;"><strong>Шаг 3. Расчет маржинальности:</strong><br>
        (${formatMoney(res.profit)} ÷ ${formatMoney(res.revenue)}) × 100 = <strong style="color:${statusColor};">${formatPercent(res.margin)}</strong>
      </div>
      <div><strong>Шаг 4. Сравнение с эталонами:</strong><br>
        Норма для «${norms.name}»: зарплаты ${norms.salaries}%, аренда ${norms.rent}%, реклама ${norms.ads}%.
      </div>
    `;
    calcStepsContent.innerHTML = stepsHtml;
  }

  // Отрисовка блока «Что делать» (3 действия)
  const actionsContent = document.getElementById('card-actions');
  if (actionsContent) {
    const listEl = document.getElementById('actions-content');
    if (listEl) {
      const actions = generateThreeActions(res, norms);
      listEl.innerHTML = actions.map(act => `
        <div style="background:var(--bg-input); padding:10px 12px; border-radius:12px; border:1px solid var(--border); font-size:0.88rem; line-height:1.5;">
          ${act}
        </div>
      `).join('');
    }
  }
}

// ================= 6. ОТРИСОВКА ВКЛАДКИ «ЧТО ЕСЛИ» =================
function renderWhatIf() {
  const norms = getCurrentNorms();
  const base = calculateMonth(appState.inputs, norms);

  const pricePct = Number(appState.whatIf.price || 0);
  const rentPct = Number(appState.whatIf.rent || 0);
  const adsPct = Number(appState.whatIf.ads || 0);
  const salariesPct = Number(appState.whatIf.salaries || 0);

  // Обновление бейджей значений и треков ползунков
  const updateSliderVisual = (id, badgeId, val, positiveGood = true, min = -50, max = 50) => {
    const slider = document.getElementById(id);
    const badge = document.getElementById(badgeId);
    if (slider) {
      const pct = ((val - min) / (max - min)) * 100;
      const color = val === 0 ? 'var(--accent-blue)' : (val > 0 ? (positiveGood ? 'var(--accent-green)' : 'var(--accent-red)') : (positiveGood ? 'var(--accent-red)' : 'var(--accent-green)'));
      slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--bg-input) ${pct}%, var(--bg-input) 100%)`;
    }
    if (badge) {
      badge.textContent = (val > 0 ? '+' : '') + val + '%';
      if (val === 0) {
        badge.style.color = 'var(--text-muted)';
        badge.style.background = 'var(--bg-glass)';
        badge.style.borderColor = 'var(--border)';
      } else if (val > 0) {
        badge.style.color = positiveGood ? 'var(--accent-green)' : 'var(--accent-red)';
        badge.style.background = positiveGood ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)';
        badge.style.borderColor = positiveGood ? 'var(--accent-green-border)' : 'var(--accent-red-border)';
      } else {
        badge.style.color = positiveGood ? 'var(--accent-red)' : 'var(--accent-green)';
        badge.style.background = positiveGood ? 'var(--accent-red-bg)' : 'var(--accent-green-bg)';
        badge.style.borderColor = positiveGood ? 'var(--accent-red-border)' : 'var(--accent-green-border)';
      }
    }
  };
  updateSliderVisual('slider-price', 'val-slider-price', pricePct, true);
  updateSliderVisual('slider-rent', 'val-slider-rent', rentPct, false);
  updateSliderVisual('slider-ads', 'val-slider-ads', adsPct, true);
  updateSliderVisual('slider-salaries', 'val-slider-salaries', salariesPct, false);

  // Моделирование:
  // 1. Цены: влияют прямо пропорционально на базовую выручку
  let newRev = base.revenue * (1 + pricePct / 100);

  // 2. Реклама: изменение бюджета рекламы дает отдачу в выручке
  // Оцениваем текущий ROAS (коэффициент окупаемости рекламы)
  const currentROAS = base.ads > 0 ? (base.revenue / base.ads) : 3.0;
  const clampedROAS = Math.min(Math.max(currentROAS * 0.7, 1.2), 6.0); // консервативный прогноз отдачи
  const adDelta = base.ads * (adsPct / 100);
  const revFromAds = adDelta * clampedROAS;
  newRev = Math.max(0, Math.round(newRev + revFromAds));

  // 3. Расходы
  const newRent = Math.max(0, Math.round(base.rent * (1 + rentPct / 100)));
  const newSalaries = Math.max(0, Math.round(base.salaries * (1 + salariesPct / 100)));
  const newAds = Math.max(0, Math.round(base.ads * (1 + adsPct / 100)));
  const newExp = newRent + newSalaries + newAds + base.other;

  // 4. Прибыль и маржа
  const newProfit = newRev - newExp;
  const profitDelta = newProfit - base.profit;
  const newMargin = newRev > 0 ? (newProfit / newRev) * 100 : 0;
  const pctChange = base.profit !== 0 ? (profitDelta / Math.abs(base.profit)) * 100 : 0;

  // Отображение результатов
  const newProfitEl = document.getElementById('whatif-new-profit');
  const deltaEl = document.getElementById('whatif-profit-delta');
  const badgeEl = document.getElementById('badge-whatif-diff');
  const newRevEl = document.getElementById('whatif-new-rev');
  const newExpEl = document.getElementById('whatif-new-exp');
  const newMarginEl = document.getElementById('whatif-new-margin');
  const pctChangeEl = document.getElementById('whatif-pct-change');
  const insightEl = document.getElementById('whatif-insight');

  if (newProfitEl) {
    newProfitEl.textContent = formatMoney(newProfit);
    const color = newProfit >= 0 ? (newMargin >= 10 ? 'var(--accent-green)' : 'var(--accent-yellow)') : 'var(--accent-red)';
    newProfitEl.style.color = color;
    newProfitEl.style.textShadow = newProfit < 0 ? '0 0 24px rgba(255, 111, 97, 0.35)' : (newMargin < 10 ? '0 0 24px rgba(251, 191, 36, 0.35)' : '0 0 24px rgba(52, 211, 153, 0.35)');
  }

  const sign = profitDelta >= 0 ? '+' : '';
  const deltaColor = profitDelta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

  if (deltaEl) {
    deltaEl.textContent = `Разница с текущей: ${sign}${formatMoney(profitDelta)}`;
    deltaEl.style.color = deltaColor;
  }

  if (badgeEl) {
    badgeEl.textContent = `${sign}${formatMoney(profitDelta)} (${sign}${formatPercent(pctChange)})`;
    badgeEl.className = 'card-badge ' + (profitDelta >= 0 ? 'badge-green' : 'badge-red');
  }

  if (newRevEl) newRevEl.textContent = formatMoney(newRev);
  if (newExpEl) newExpEl.textContent = formatMoney(newExp);
  if (newMarginEl) newMarginEl.textContent = formatPercent(newMargin);
  if (pctChangeEl) {
    pctChangeEl.textContent = `${sign}${formatPercent(pctChange)}`;
    pctChangeEl.style.color = deltaColor;
  }

  if (insightEl) {
    if (pricePct === 0 && rentPct === 0 && adsPct === 0 && salariesPct === 0) {
      insightEl.textContent = 'Сдвиньте любой ползунок для оценки сценарного влияния на чистую прибыль.';
      insightEl.style.borderColor = 'rgba(59,130,246,0.3)';
    } else if (profitDelta > 0) {
      insightEl.innerHTML = `✅ <strong>Сценарий выгоден:</strong> Прибыль вырастет на <strong>${formatMoney(profitDelta)}</strong> в месяц (+${formatPercent(pctChange)}). Маржинальность бизнеса составит <strong>${formatPercent(newMargin)}</strong>.`;
      insightEl.style.borderColor = 'var(--accent-green)';
    } else {
      insightEl.innerHTML = `⚠️ <strong>Сценарий ухудшает результат:</strong> Прибыль снизится на <strong>${formatMoney(Math.abs(profitDelta))}</strong> (${formatPercent(pctChange)}). Проверьте целесообразность изменений.`;
      insightEl.style.borderColor = 'var(--accent-red)';
    }
  }
}

// ================= 7. ОТРИСОВКА И ЛОГИКА «СОВЕТНИКА» =================
function renderAdvisor() {
  const modeTextEl = document.getElementById('advisor-mode-text');
  const toggleBtn = document.getElementById('btn-toggle-offline-advisor');

  if (appState.advisorMode === 'offline') {
    if (modeTextEl) {
      modeTextEl.innerHTML = '<span class="status-indicator offline"></span><span>Алгоритмический режим (офлайн)</span>';
    }
    if (toggleBtn) toggleBtn.textContent = 'Включить ИИ';
  } else {
    if (modeTextEl) {
      modeTextEl.innerHTML = '<span class="status-indicator online"></span><span>ИИ-аналитик Gemini</span>';
    }
    if (toggleBtn) toggleBtn.textContent = 'Работать без ИИ';
  }

  const container = document.getElementById('advisor-messages');
  if (!container) return;

  if (appState.advisorHistory.length === 0) {
    const norms = getCurrentNorms();
    const res = calculateMonth(appState.inputs, norms);
    container.innerHTML = `
      <div class="chat-msg chat-msg-bot">
        👋 Здравствуйте! Я ваш финансовый аналитик. Я уже вижу ваши показатели: выручка <strong>${formatMoney(res.revenue)}</strong>, чистая прибыль <strong>${formatMoney(res.profit)}</strong> (маржа ${formatPercent(res.margin)}), ниша «${norms.name}».<br><br>
        Выберите быстрый вопрос выше или задайте свой вопрос ниже.
      </div>
    `;
    return;
  }

  container.innerHTML = appState.advisorHistory.map(msg => `
    <div class="chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}">
      ${msg.text}
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

// Локальный алгоритмический генератор ответа (работает 100% без интернета!)
function generateAlgorithmicAdvice(question) {
  const norms = getCurrentNorms();
  const res = calculateMonth(appState.inputs, norms);

  const qLower = question.toLowerCase();

  let conclusion = '';
  let reason = '';
  let calculation = '';
  let action1 = '';
  let action2 = '';
  let action3 = '';

  if (qLower.includes('20%') || qLower.includes('поднять прибыль')) {
    const targetProfitIncrease = Math.round(res.profit > 0 ? res.profit * 0.2 : 50000);
    conclusion = `Для увеличения прибыли на 20% (+${formatMoney(targetProfitIncrease)}) вам требуется поднять средний чек на 4-6% или сократить статьи перерасходов.`;
    reason = `Текущая прибыль составляет ${formatMoney(res.profit)} при выручке ${formatMoney(res.revenue)}. Главная точка утечки — статья «${res.largestExpense.name}» (${formatMoney(res.largestExpense.amount)}).`;
    calculation = `1) 20% от прибыли: ${formatMoney(res.profit)} × 0,2 = ${formatMoney(targetProfitIncrease)}.<br>2) Подъем цен на 5%: ${formatMoney(res.revenue)} × 0,05 = +${formatMoney(Math.round(res.revenue * 0.05))} чистой прибыли при тех же затратах.`;
    action1 = `1. Поднять цены на 5% на ключевые продукты-локомотивы (+${formatMoney(Math.round(res.revenue * 0.05))} выручки).`;
    action2 = res.overNormItems.length > 0
      ? `2. Сократить перерасход по «${res.overNormItems[0].name}» на ${formatMoney(Math.round(res.overNormItems[0].excessMoney * 0.5))}.`
      : `2. Провести переговоры с поставщиками для скидки 3-5% на расходные материалы.`;
    action3 = `3. Внедрить cross-sell предложение на кассе/сайте для роста среднего чека на 200-300 ₽.`;
  } else if (qLower.includes('теряю') || qLower.includes('утечк') || qLower.includes('риск')) {
    conclusion = res.overNormItems.length > 0
      ? `Вы теряете деньги на превышении норм ниши по статьям: ${res.overNormItems.map(i => i.name).join(', ')}.`
      : `Прямых критических перерасходов нет, основной резерв — оптимизация крупнейшей статьи «${res.largestExpense.name}».`;
    reason = `Фактическая доля затрат на «${res.largestExpense.name}» составляет ${formatPercent(res.largestExpense.pct)} от выручки (${formatMoney(res.largestExpense.amount)}).`;
    calculation = res.overNormItems.length > 0
      ? `Суммарный перерасход сверх нормы ниши: ${formatMoney(res.overNormItems.reduce((acc, i) => acc + i.excessMoney, 0))}.`
      : `Расходы составляют ${formatPercent(res.expPct)} от выручки, чистая прибыль: ${formatMoney(res.profit)}.`;
    action1 = res.overNormItems.length > 0
      ? `1. Урезать перерасход по «${res.overNormItems[0].name}» на ${formatMoney(res.overNormItems[0].excessMoney)}.`
      : `1. Провести аудит постоянных подписок, сервисов и мелких расходов на сумму ${formatMoney(Math.round(res.other || 15000))}.`;
    action2 = `2. Установить жесткий лимит на рекламу не более ${formatPercent(norms.ads)} от выручки (${formatMoney(Math.round(res.revenue * norms.ads / 100))}).`;
    action3 = `3. Фиксировать еженедельный отчет о движении средств (ДДС), чтобы исключить мелкие неучтенные траты.`;
  } else if (qLower.includes('сотрудник') || qLower.includes('нанять') || qLower.includes('уволить')) {
    const currentSalPct = res.salariesPct;
    const canHire = currentSalPct < norms.salaries;
    conclusion = canHire
      ? `Найм возможен: ваша доля зарплат (${formatPercent(currentSalPct)}) ниже нормы ниши (${formatPercent(norms.salaries)}).`
      : `Осторожно: фонд оплаты труда уже составляет ${formatPercent(currentSalPct)} (норма ${formatPercent(norms.salaries)}). Новый сотрудник увеличит нагрузку.`;
    reason = `Текущий ФОТ: ${formatMoney(res.salaries)} в месяц. Каждый новый сотрудник с окладом 50 000 ₽ снизит прибыль на 50 000 ₽, если не принесет от +150 000 ₽ выручки.`;
    calculation = `Предельный безопасный ФОТ для ниши «${norms.name}»: ${formatMoney(Math.round(res.revenue * norms.salaries / 100))}. Свободный запас по зарплатам: ${formatMoney(Math.max(0, Math.round(res.revenue * norms.salaries / 100 - res.salaries)))}.`;
    action1 = `1. Нанимать только с привязкой оклада к KPI или проценту от принесенной выручки (фикс не более 40% от общего дохода сотрудника).`;
    action2 = `2. Просчитать окупаемость сотрудника: он должен генерировать минимум в 3 раза больше своей зарплаты.`;
    action3 = `3. Сначала протестировать передачу задач на фриланс или аутсорс на 1 месяц перед оформлением в штат.`;
  } else {
    conclusion = `Ваш бизнес приносит ${formatMoney(res.profit)} чистой прибыли при маржинальности ${formatPercent(res.margin)}.`;
    reason = `Выручка: ${formatMoney(res.revenue)}, общие расходы: ${formatMoney(res.totalExpenses)}. Ниша: «${norms.name}».`;
    calculation = `Маржа = (${formatMoney(res.profit)} / ${formatMoney(res.revenue)}) × 100 = ${formatPercent(res.margin)}.`;
    const actions = generateThreeActions(res, norms);
    action1 = actions[0] || '1. Контролировать ключевые статьи расходов.';
    action2 = actions[1] || '2. Повышать средний чек на 5%.';
    action3 = actions[2] || '3. Формировать резервный фонд.';
  }

  return `
    <strong>1. Вывод:</strong><br>${conclusion}<br><br>
    <strong>2. Причина:</strong><br>${reason}<br><br>
    <strong>3. Расчёт:</strong><br>${calculation}<br><br>
    <strong>4. 3 действия:</strong><br>${action1}<br>${action2}<br>${action3}
  `;
}

// Отправка вопроса в советник
async function handleSendAdvisor(questionText) {
  const q = (questionText || '').trim();
  if (!q) return;

  const norms = getCurrentNorms();
  const res = calculateMonth(appState.inputs, norms);

  // Добавляем сообщение пользователя
  appState.advisorHistory.push({ role: 'user', text: q });
  renderAdvisor();

  const inputEl = document.getElementById('advisor-user-input');
  if (inputEl) inputEl.value = '';

  // Проверка режима: офлайн или с ИИ
  if (appState.advisorMode === 'offline') {
    const reply = generateAlgorithmicAdvice(q);
    setTimeout(() => {
      appState.advisorHistory.push({ role: 'model', text: reply });
      Storage.set('advisor_history', appState.advisorHistory);
      renderAdvisor();
    }, 300);
    return;
  }

  // Режим ИИ: отправка запроса
  const container = document.getElementById('advisor-messages');
  const loadingEl = document.createElement('div');
  loadingEl.className = 'chat-msg chat-msg-bot';
  loadingEl.id = 'advisor-loading';
  loadingEl.innerHTML = '<span style="color:var(--text-muted);">Анализирую данные и считаю цифры...</span>';
  if (container) {
    container.appendChild(loadingEl);
    container.scrollTop = container.scrollHeight;
  }

  const contextStr = `Ниша: ${norms.name}. Выручка: ${res.revenue} ${appState.currency}. Аренда: ${res.rent} (${res.rentPct.toFixed(1)}%, норма ${norms.rent}%). Зарплаты: ${res.salaries} (${res.salariesPct.toFixed(1)}%, норма ${norms.salaries}%). Реклама: ${res.ads} (${res.adsPct.toFixed(1)}%, норма ${norms.ads}%). Прочие расходы: ${res.other}. Итого расходы: ${res.totalExpenses}. Чистая прибыль: ${res.profit} ${appState.currency}. Маржинальность: ${res.margin.toFixed(1)}%. Статьи выше нормы: ${res.overNormItems.map(i => `${i.name} (перерасход ${i.excessMoney} ${appState.currency})`).join(', ') || 'нет'}.`;

  try {
    const response = await fetch('/api/advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-key': appState.geminiApiKey || ''
      },
      body: JSON.stringify({
        question: q,
        context: contextStr,
        history: appState.advisorHistory.slice(-6),
        apiKey: appState.geminiApiKey || undefined
      })
    });

    const data = await response.json();
    if (document.getElementById('advisor-loading')) {
      document.getElementById('advisor-loading').remove();
    }

    if (data.reply) {
      // Преобразуем переносы строк в <br>
      const formatted = data.reply
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      appState.advisorHistory.push({ role: 'model', text: formatted });
      Storage.set('advisor_history', appState.advisorHistory);
      renderAdvisor();
    } else {
      throw new Error(data.error || 'Пустой ответ от сервера');
    }
  } catch (err) {
    console.warn('Advisor API failed, fallback to algorithmic response:', err);
    if (document.getElementById('advisor-loading')) {
      document.getElementById('advisor-loading').remove();
    }
    const fallbackReply = generateAlgorithmicAdvice(q) + `<br><br><span style="font-size:0.75rem; color:var(--text-muted);">(Ответ рассчитан алгоритмически на устройстве)</span>`;
    appState.advisorHistory.push({ role: 'model', text: fallbackReply });
    Storage.set('advisor_history', appState.advisorHistory);
    renderAdvisor();
  }
}

// ================= 8. ОТРИСОВКА И ЛОГИКА «ВАЛЮТ» =================
async function fetchCurrencyRates(force = false) {
  const statusEl = document.getElementById('currency-rates-status');
  if (statusEl) statusEl.textContent = 'Обновление курсов...';

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data && data.rates) {
      appState.rates = data.rates;
      appState.ratesUpdatedAt = new Date().toISOString();
      appState.ratesIsOffline = false;
      Storage.set('rates', data.rates);
      Storage.set('rates_updated_at', appState.ratesUpdatedAt);
      Storage.set('rates_is_offline', false);
      showToast('✅ Курсы валют обновлены');
      renderCurrencies();
      return;
    }
  } catch (e) {
    console.warn('Currency fetch failed, using stored/default rates:', e);
    appState.ratesIsOffline = true;
    Storage.set('rates_is_offline', true);
    if (force) showToast('⚠️ Нет интернета: используются сохранённые курсы');
  }

  // Fallback на базовые курсы, если rates пустой
  if (!appState.rates || Object.keys(appState.rates).length === 0) {
    const baseRates = {};
    CURRENCIES.forEach(c => baseRates[c.code] = c.defaultRateToUSD);
    appState.rates = baseRates;
    appState.ratesUpdatedAt = new Date().toISOString();
  }

  renderCurrencies();
}

function getRate(fromCode, toCode) {
  const rFrom = appState.rates[fromCode] || 1;
  const rTo = appState.rates[toCode] || 1;
  return rTo / rFrom;
}

function renderCurrencies() {
  // Заполнение селектора основной валюты
  const selectMain = document.getElementById('select-main-currency');
  if (selectMain && selectMain.options.length === 0) {
    CURRENCIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.code} (${c.symbol}) — ${c.name}`;
      selectMain.appendChild(opt);
    });
  }
  if (selectMain) selectMain.value = appState.currency;

  // Статус курсов
  const statusEl = document.getElementById('currency-rates-status');
  if (statusEl) {
    if (appState.ratesUpdatedAt) {
      const d = new Date(appState.ratesUpdatedAt);
      const timeStr = d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      statusEl.textContent = appState.ratesIsOffline ? `Курсы от ${timeStr} (офлайн)` : `Курсы от ${timeStr}`;
    } else {
      statusEl.textContent = 'Курсы по умолчанию (офлайн)';
    }
  }

  // Обновление подписи в заголовке таблицы
  document.querySelectorAll('.current-curr-code').forEach(el => el.textContent = appState.currency);

  // Конвертер: заполнение списков валют
  const selFrom = document.getElementById('converter-from');
  const selTo = document.getElementById('converter-to');

  if (selFrom && selFrom.options.length === 0) {
    CURRENCIES.forEach(c => {
      const opt1 = document.createElement('option');
      opt1.value = c.code;
      opt1.textContent = `${c.code} (${c.symbol})`;
      selFrom.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c.code;
      opt2.textContent = `${c.code} (${c.symbol})`;
      selTo.appendChild(opt2);
    });
    selFrom.value = 'USD';
    selTo.value = appState.currency;
  }

  updateConverter();

  // Отрисовка таблицы популярных валют
  const majorCodes = ['USD', 'EUR', 'CNY', 'KZT', 'BYN', 'TRY', 'AED', 'GBP'];
  const tbody = document.getElementById('tbody-major-rates');
  if (tbody) {
    tbody.innerHTML = majorCodes.map(code => {
      if (code === appState.currency) return '';
      const c = getCurrencyObj(code);
      const rate = getRate(code, appState.currency);
      let formattedRate = rate >= 1 ? rate.toFixed(2).replace('.', ',') : rate.toFixed(4).replace('.', ',');
      return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td><span style="font-weight:700; color:var(--accent-blue);">${c.code}</span></td>
          <td style="text-align:right; font-weight:700;">1 ${c.symbol} = ${formattedRate} ${getCurrencySymbol()}</td>
        </tr>
      `;
    }).join('');
  }
}

function updateConverter() {
  const inAmount = document.getElementById('converter-amount');
  const selFrom = document.getElementById('converter-from');
  const selTo = document.getElementById('converter-to');
  const resVal = document.getElementById('converter-result-value');
  const rateInfo = document.getElementById('converter-rate-info');

  if (!inAmount || !selFrom || !selTo || !resVal) return;

  const amount = Math.max(0, Number(inAmount.value) || 0);
  const fromCode = selFrom.value;
  const toCode = selTo.value;

  const rate = getRate(fromCode, toCode);
  const result = amount * rate;

  const toObj = getCurrencyObj(toCode);
  const fromObj = getCurrencyObj(fromCode);

  resVal.textContent = Math.round(result).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + toObj.symbol;
  if (rateInfo) {
    const rateFormatted = rate >= 1 ? rate.toFixed(2).replace('.', ',') : rate.toFixed(4).replace('.', ',');
    rateInfo.textContent = `Курс: 1 ${fromObj.symbol} = ${rateFormatted} ${toObj.symbol}`;
  }
}

// ================= 9. ОТРИСОВКА И ЛОГИКА «ИСТОРИИ» =================
function renderHistory() {
  const totalCountEl = document.getElementById('history-total-count');
  const listEl = document.getElementById('history-list');
  const filterNicheEl = document.getElementById('history-filter-niche');
  const searchInput = document.getElementById('history-search-input');

  if (totalCountEl) totalCountEl.textContent = appState.history.length;

  // Заполнение фильтра по нишам
  if (filterNicheEl && filterNicheEl.options.length <= 1) {
    Object.keys(NICHES).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = NICHES[key].name;
      filterNicheEl.appendChild(opt);
    });
  }

  // Фильтрация и поиск
  const selectedNiche = filterNicheEl ? filterNicheEl.value : 'all';
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = [...appState.history].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (selectedNiche !== 'all') {
    filtered = filtered.filter(item => item.nicheKey === selectedNiche);
  }

  if (query) {
    filtered = filtered.filter(item =>
      (item.note && item.note.toLowerCase().includes(query)) ||
      (item.formattedDate && item.formattedDate.toLowerCase().includes(query)) ||
      (item.nicheName && item.nicheName.toLowerCase().includes(query))
    );
  }

  // Отрисовка графика динамики (SVG)
  renderHistoryChart(appState.history);

  // Отрисовка списка
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="card" style="text-align:center; padding:32px 16px; color:var(--text-muted);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 12px; opacity:0.5;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div style="font-weight:700; font-size:1.05rem; margin-bottom:4px;">История пока пуста</div>
        <div style="font-size:0.85rem;">Сохраните первый месяц во вкладке «Анализ» или нажмите «+ Текущий месяц» выше.</div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((item, index) => {
    // Сравнение со следующей в отсортированном массиве (предыдущей хронологически) записью
    const prevItem = filtered[index + 1];
    let profitDeltaHtml = '';
    let revDeltaHtml = '';

    if (prevItem) {
      const pDiff = item.profit - prevItem.profit;
      const rDiff = item.revenue - prevItem.revenue;

      if (pDiff > 0) {
        profitDeltaHtml = `<span class="delta-badge up">▲ +${formatMoney(pDiff)}</span>`;
      } else if (pDiff < 0) {
        profitDeltaHtml = `<span class="delta-badge down">▼ -${formatMoney(Math.abs(pDiff))}</span>`;
      }

      if (rDiff > 0) {
        revDeltaHtml = `<span class="delta-badge up" style="font-size:0.7rem;">▲ +${formatMoney(rDiff)}</span>`;
      } else if (rDiff < 0) {
        revDeltaHtml = `<span class="delta-badge down" style="font-size:0.7rem;">▼ -${formatMoney(Math.abs(rDiff))}</span>`;
      }
    }

    const marginColor = item.profit >= 0 ? (item.margin >= 10 ? 'var(--accent-green)' : 'var(--accent-yellow)') : 'var(--accent-red)';

    return `
      <div class="history-card">
        <div class="history-header">
          <div>
            <div style="font-weight:800; font-size:1.05rem;">${item.formattedDate}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:1px;">
              Ниша: <strong>${item.nicheName}</strong> ${item.note ? `• ${item.note}` : ''}
            </div>
          </div>
          <div style="text-align:right;">
            <span class="card-badge" style="background:${marginColor}15; color:${marginColor}; border:1px solid ${marginColor}40;">
              ${formatPercent(item.margin)}
            </span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:10px 0; background:var(--bg-input); padding:10px 12px; border-radius:12px; border:1px solid var(--border);">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Выручка</div>
            <div style="font-weight:700; font-size:1.05rem;">${formatMoney(item.revenue)}</div>
            ${revDeltaHtml ? `<div style="margin-top:2px;">${revDeltaHtml}</div>` : ''}
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Чистая прибыль</div>
            <div style="font-weight:800; font-size:1.05rem; color:${marginColor};">${formatMoney(item.profit)}</div>
            ${profitDeltaHtml ? `<div style="margin-top:2px;">${profitDeltaHtml}</div>` : ''}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <div style="font-size:0.75rem; color:var(--text-secondary);">
            Расходы: ${formatMoney(item.totalExpenses)} (ФОТ: ${formatMoney(item.salaries)}, аренда: ${formatMoney(item.rent)})
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-secondary" onclick="loadMonthToAnalysis('${item.id}')" style="font-size:0.75rem; padding:4px 8px;" title="Загрузить в анализ">
              Открыть
            </button>
            <button class="btn btn-sm btn-secondary" onclick="confirmDeleteHistoryItem('${item.id}')" style="font-size:0.75rem; padding:4px 8px; color:var(--accent-red);" title="Удалить">
              Удалить
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Отрисовка SVG-графика динамики выручки и прибыли (чистый SVG без библиотек!)
function renderHistoryChart(history) {
  const container = document.getElementById('history-chart-container');
  if (!container) return;

  if (!history || history.length < 2) {
    container.innerHTML = `
      <div style="text-align:center; padding:24px 0; color:var(--text-muted); font-size:0.85rem;">
        Сохраните хотя бы 2 месяца для построения графика динамики.
      </div>
    `;
    return;
  }

  // Сортируем хронологически (от старых к новым)
  const items = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

  const width = 340;
  const height = 160;
  const padLeft = 40;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Ищем min и max
  let maxVal = Math.max(...items.map(i => Math.max(i.revenue, i.profit, 0)));
  let minVal = Math.min(...items.map(i => Math.min(i.revenue, i.profit, 0)));
  if (maxVal === minVal) { maxVal += 1000; minVal = 0; }

  // Сетка по Y
  const getX = (index) => padLeft + (index / (items.length - 1)) * chartW;
  const getY = (val) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Точки для выручки и прибыли
  const revPoints = items.map((i, idx) => `${getX(idx).toFixed(1)},${getY(i.revenue).toFixed(1)}`).join(' ');
  const profitPoints = items.map((i, idx) => `${getX(idx).toFixed(1)},${getY(i.profit).toFixed(1)}`).join(' ');

  // Полигоны заливки градиентом
  const baseLineY = (padTop + chartH).toFixed(1);
  const revArea = `${revPoints} ${getX(items.length - 1).toFixed(1)},${baseLineY} ${getX(0).toFixed(1)},${baseLineY}`;
  const profitArea = `${profitPoints} ${getX(items.length - 1).toFixed(1)},${baseLineY} ${getX(0).toFixed(1)},${baseLineY}`;

  // Точки-кружки
  const revDots = items.map((i, idx) => `
    <circle cx="${getX(idx).toFixed(1)}" cy="${getY(i.revenue).toFixed(1)}" r="4.5" fill="#7C9CFF" stroke="var(--bg-primary)" stroke-width="2"/>
  `).join('');

  const profitDots = items.map((i, idx) => `
    <circle cx="${getX(idx).toFixed(1)}" cy="${getY(i.profit).toFixed(1)}" r="4.5" fill="#34D399" stroke="var(--bg-primary)" stroke-width="2"/>
  `).join('');

  // Подписи по оси X
  const xLabels = items.map((i, idx) => `
    <text x="${getX(idx).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
      ${(i.formattedDate || '').split(' ')[0].slice(0, 3)}
    </text>
  `).join('');

  // Нулевая линия, если есть отрицательные значения
  let zeroLine = '';
  if (minVal < 0 && maxVal > 0) {
    const yZero = getY(0);
    zeroLine = `<line x1="${padLeft}" y1="${yZero}" x2="${width - padRight}" y2="${yZero}" stroke="var(--accent-red)" stroke-dasharray="3,3" stroke-width="1.2"/>`;
  }

  // Верхняя и нижняя метка по Y
  const yTopLabel = maxVal >= 1000000 ? (maxVal / 1000000).toFixed(1) + 'M' : Math.round(maxVal / 1000) + 'k';
  const yBottomLabel = minVal >= 1000000 ? (minVal / 1000000).toFixed(1) + 'M' : Math.round(minVal / 1000) + 'k';

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; overflow:visible;">
      <defs>
        <linearGradient id="chart-rev-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7C9CFF" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#7C9CFF" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="chart-profit-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#34D399" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Сетка -->
      <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${padLeft}" y1="${padTop + chartH / 2}" x2="${width - padRight}" y2="${padTop + chartH / 2}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="${padLeft}" y1="${padTop + chartH}" x2="${width - padRight}" y2="${padTop + chartH}" stroke="var(--border)" stroke-width="1"/>
      ${zeroLine}

      <!-- Метки по Y -->
      <text x="${padLeft - 6}" y="${padTop + 4}" text-anchor="end" font-size="9" font-weight="600" fill="var(--text-muted)">${yTopLabel}</text>
      <text x="${padLeft - 6}" y="${padTop + chartH + 3}" text-anchor="end" font-size="9" font-weight="600" fill="var(--text-muted)">${yBottomLabel}</text>

      <!-- Градиентные области -->
      <polygon points="${revArea}" fill="url(#chart-rev-area-grad)"/>
      <polygon points="${profitArea}" fill="url(#chart-profit-area-grad)"/>

      <!-- Линии -->
      <polyline points="${revPoints}" fill="none" stroke="#7C9CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="${profitPoints}" fill="none" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Точки -->
      ${revDots}
      ${profitDots}

      <!-- Метки по X -->
      ${xLabels}
    </svg>
  `;
}

// Загрузка месяца в анализ
window.loadMonthToAnalysis = function(id) {
  const item = appState.history.find(h => h.id === id);
  if (!item) return;

  appState.niche = item.nicheKey || 'cafe';
  appState.inputs.revenue = item.revenue;
  appState.inputs.rent = item.rent;
  appState.inputs.salaries = item.salaries;
  appState.inputs.ads = item.ads;
  appState.inputs.other = item.other;
  appState.inputs.note = item.note || '';

  Storage.set('niche', appState.niche);
  Storage.set('inputs', appState.inputs);

  // Переключаем вкладку на анализ
  switchTab('analysis');
  renderAnalysis();
  showToast(`Показатели за ${item.formattedDate} загружены в Анализ`);
};

// Подтверждение удаления
window.confirmDeleteHistoryItem = function(id) {
  const item = appState.history.find(h => h.id === id);
  if (!item) return;

  appState.itemToDeleteId = id;
  const modal = document.getElementById('modal-confirm-delete');
  const textEl = document.getElementById('delete-confirm-text');
  if (textEl) textEl.textContent = `Удалить запись за ${item.formattedDate} (${formatMoney(item.profit)}) из истории?`;
  if (modal) modal.classList.add('open');
};

// ================= 10. ЭКСПОРТ ДАННЫХ =================
function exportToCSV() {
  if (appState.history.length === 0) {
    showToast('История пуста, нечего скачивать');
    return;
  }

  // Формируем CSV с кодировкой UTF-8 BOM для корректного открытия в Excel
  let csvContent = '\uFEFF';
  csvContent += 'Дата;Выручка;Аренда;Зарплаты;Реклама;Прочие;Итого расходы;Чистая прибыль;Маржинальность %;Ниша;Заметка\r\n';

  appState.history.forEach(item => {
    const row = [
      item.formattedDate || item.date,
      item.revenue,
      item.rent,
      item.salaries,
      item.ads,
      item.other,
      item.totalExpenses,
      item.profit,
      (item.margin || 0).toFixed(1).replace('.', ','),
      `"${(item.nicheName || '').replace(/"/g, '""')}"`,
      `"${(item.note || '').replace(/"/g, '""')}"`
    ];
    csvContent += row.join(';') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Бизнес_Аналитик_История_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 Файл CSV скачан');
}

function copyReportText() {
  const norms = getCurrentNorms();
  const res = calculateMonth(appState.inputs, norms);

  let text = `📊 Финансовый отчет «Бизнес-аналитик»\n`;
  text += `Ниша: ${norms.name}\n`;
  text += `Дата отчета: ${new Date().toLocaleDateString('ru-RU')}\n`;
  if (appState.inputs.note) text += `Заметка: ${appState.inputs.note}\n`;
  text += `---------------------------------\n`;
  text += `💰 Выручка: ${formatMoney(res.revenue)}\n`;
  text += `📉 Расходы: ${formatMoney(res.totalExpenses)}\n`;
  text += `   • Аренда: ${formatMoney(res.rent)} (${formatPercent(res.rentPct)})\n`;
  text += `   • Зарплаты: ${formatMoney(res.salaries)} (${formatPercent(res.salariesPct)})\n`;
  text += `   • Реклама: ${formatMoney(res.ads)} (${formatPercent(res.adsPct)})\n`;
  text += `   • Прочее: ${formatMoney(res.other)} (${formatPercent(res.otherPct)})\n`;
  text += `---------------------------------\n`;
  text += `💵 Чистая прибыль: ${formatMoney(res.profit)}\n`;
  text += `📈 Маржинальность: ${formatPercent(res.margin)}\n`;
  text += `Статус: ${res.profit >= 0 ? (res.margin >= 10 ? 'Бизнес прибыльный' : 'Низкая маржа') : 'Бизнес в минусе'}\n`;

  if (res.overNormItems.length > 0) {
    text += `\n⚠️ Превышения норм:\n`;
    res.overNormItems.forEach(i => {
      text += `• ${i.name}: ${formatPercent(i.pct)} при норме ${formatPercent(i.norm)} (+${formatMoney(i.excessMoney)})\n`;
    });
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Текст отчёта скопирован');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('📋 Текст отчёта скопирован');
  } catch (e) {
    showToast('Не удалось скопировать в буфер');
  }
  document.body.removeChild(ta);
}

function shareReport() {
  const norms = getCurrentNorms();
  const res = calculateMonth(appState.inputs, norms);
  const text = `Финансовый отчет: Выручка ${formatMoney(res.revenue)}, прибыль ${formatMoney(res.profit)} (маржа ${formatPercent(res.margin)}). Ниша: ${norms.name}.`;

  if (navigator.share) {
    navigator.share({
      title: 'Бизнес-аналитик: Отчет',
      text: text
    }).catch(err => {
      if (err.name !== 'AbortError') copyReportText();
    });
  } else {
    copyReportText();
  }
}

// ================= 11. НАВИГАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =================
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById('tab-' + tabId);
  const targetBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);

  if (targetTab) targetTab.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  // Отрисовка специфических данных вкладки при открытии
  if (tabId === 'analysis') renderAnalysis();
  if (tabId === 'whatif') renderWhatIf();
  if (tabId === 'advisor') renderAdvisor();
  if (tabId === 'currencies') renderCurrencies();
  if (tabId === 'history') renderHistory();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= 12. ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ =================
function initApp() {
  // 1. Тема оформления (тёмная / светлая)
  document.documentElement.setAttribute('data-theme', appState.theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', appState.theme);
      Storage.set('theme', appState.theme);
      showToast(appState.theme === 'dark' ? '🌙 Тёмная тема включена' : '☀️ Светлая тема включена');
    });
  }

  // 2. Нижняя навигация (5 вкладок)
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // 3. Выбор ниши в «Анализе»
  const nicheSelect = document.getElementById('niche-select');
  if (nicheSelect) {
    nicheSelect.addEventListener('change', () => {
      appState.niche = nicheSelect.value;
      Storage.set('niche', appState.niche);
      if (appState.niche === 'custom') {
        const modal = document.getElementById('modal-custom-norms');
        if (modal) modal.classList.add('open');
      }
      renderAnalysis();
      showToast(`Ниша изменена: ${getCurrentNorms().name}`);
    });
  }

  const btnHeaderNiche = document.getElementById('btn-header-niche');
  if (btnHeaderNiche) {
    btnHeaderNiche.addEventListener('click', () => {
      switchTab('analysis');
      if (nicheSelect) nicheSelect.focus();
    });
  }

  // 4. Настройка «Своей ниши»
  const btnOpenCustom = document.getElementById('btn-open-custom-norms');
  const modalCustom = document.getElementById('modal-custom-norms');
  const btnCloseCustom = document.getElementById('btn-close-custom-norms');
  const btnCancelCustom = document.getElementById('btn-cancel-custom-norms');
  const btnSaveCustom = document.getElementById('btn-save-custom-norms');

  if (btnOpenCustom && modalCustom) {
    btnOpenCustom.addEventListener('click', () => {
      const inSal = document.getElementById('custom-salaries-norm');
      const inRent = document.getElementById('custom-rent-norm');
      const inAds = document.getElementById('custom-ads-norm');
      if (inSal) inSal.value = appState.customNorms.salaries || 30;
      if (inRent) inRent.value = appState.customNorms.rent || 10;
      if (inAds) inAds.value = appState.customNorms.ads || 10;
      modalCustom.classList.add('open');
    });
  }

  const closeCustomModal = () => { if (modalCustom) modalCustom.classList.remove('open'); };
  if (btnCloseCustom) btnCloseCustom.addEventListener('click', closeCustomModal);
  if (btnCancelCustom) btnCancelCustom.addEventListener('click', closeCustomModal);

  if (btnSaveCustom) {
    btnSaveCustom.addEventListener('click', () => {
      const sal = Number(document.getElementById('custom-salaries-norm')?.value || 30);
      const rent = Number(document.getElementById('custom-rent-norm')?.value || 10);
      const ads = Number(document.getElementById('custom-ads-norm')?.value || 10);

      appState.customNorms = { salaries: sal, rent, ads };
      Storage.set('custom_norms', appState.customNorms);
      closeCustomModal();
      renderAnalysis();
      showToast('Нормы для своей ниши сохранены');
    });
  }

  // 5. Ввод показателей месяца (автосохранение)
  const bindInput = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (key === 'note') {
        appState.inputs.note = el.value;
      } else {
        appState.inputs[key] = Math.max(0, Number(el.value) || 0);
      }
      Storage.set('inputs', appState.inputs);
      renderAnalysis();
    });
  };

  bindInput('in-revenue', 'revenue');
  bindInput('in-rent', 'rent');
  bindInput('in-salaries', 'salaries');
  bindInput('in-ads', 'ads');
  bindInput('in-other', 'other');
  bindInput('in-month-note', 'note');

  // Кнопка демо-примера
  const btnExample = document.getElementById('btn-example-data');
  if (btnExample) {
    btnExample.addEventListener('click', () => {
      appState.inputs = {
        revenue: 500000,
        rent: 100000,
        salaries: 200000,
        ads: 50000,
        other: 0,
        note: 'Пример данных'
      };
      Storage.set('inputs', appState.inputs);
      renderAnalysis();
      showToast('Заполнен пример: 500 000 ₽ дохода');
    });
  }

  // Кнопка очистки полей
  const btnClear = document.getElementById('btn-clear-data');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      appState.inputs = { revenue: 0, rent: 0, salaries: 0, ads: 0, other: 0, note: '' };
      Storage.set('inputs', appState.inputs);
      renderAnalysis();
      showToast('Поля ввода сброшены');
    });
  }

  // 6. Сохранение месяца в историю
  const saveMonthToHistory = () => {
    const norms = getCurrentNorms();
    const res = calculateMonth(appState.inputs, norms);

    if (res.revenue === 0 && res.totalExpenses === 0) {
      showToast('⚠️ Сначала введите показатели месяца');
      return;
    }

    const now = new Date();
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const formattedDate = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    const newRecord = {
      id: 'month_' + Date.now(),
      date: now.toISOString(),
      formattedDate: formattedDate,
      nicheKey: appState.niche,
      nicheName: norms.name,
      revenue: res.revenue,
      rent: res.rent,
      salaries: res.salaries,
      ads: res.ads,
      other: res.other,
      totalExpenses: res.totalExpenses,
      profit: res.profit,
      margin: res.margin,
      note: appState.inputs.note || ''
    };

    appState.history.unshift(newRecord);
    Storage.set('history', appState.history);
    showToast('✅ Сохранено в историю');
  };

  const btnSaveMonth = document.getElementById('btn-save-month');
  if (btnSaveMonth) btnSaveMonth.addEventListener('click', saveMonthToHistory);

  const btnHistorySaveCurrent = document.getElementById('btn-history-save-current');
  if (btnHistorySaveCurrent) {
    btnHistorySaveCurrent.addEventListener('click', () => {
      saveMonthToHistory();
      renderHistory();
    });
  }

  // 7. Ползунки «Что если»
  const bindSlider = (sliderId, key) => {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    slider.addEventListener('input', () => {
      appState.whatIf[key] = Number(slider.value) || 0;
      renderWhatIf();
    });
  };

  bindSlider('slider-price', 'price');
  bindSlider('slider-rent', 'rent');
  bindSlider('slider-ads', 'ads');
  bindSlider('slider-salaries', 'salaries');

  const btnResetWhatIf = document.getElementById('btn-reset-whatif');
  if (btnResetWhatIf) {
    btnResetWhatIf.addEventListener('click', () => {
      appState.whatIf = { price: 0, rent: 0, ads: 0, salaries: 0 };
      ['slider-price', 'slider-rent', 'slider-ads', 'slider-salaries'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = 0;
      });
      renderWhatIf();
      showToast('Ползунки сброшены в 0%');
    });
  }

  // 8. Советник: вопросы и кнопки
  const btnSendAdvisor = document.getElementById('btn-send-advisor');
  const inAdvisor = document.getElementById('advisor-user-input');
  if (btnSendAdvisor && inAdvisor) {
    btnSendAdvisor.addEventListener('click', () => handleSendAdvisor(inAdvisor.value));
    inAdvisor.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendAdvisor(inAdvisor.value);
    });
  }

  // Быстрые вопросы
  document.querySelectorAll('[data-quick-q]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-quick-q');
      if (q) handleSendAdvisor(q);
    });
  });

  // Переключение режима «Работать без ИИ»
  const btnToggleOffline = document.getElementById('btn-toggle-offline-advisor');
  if (btnToggleOffline) {
    btnToggleOffline.addEventListener('click', () => {
      appState.advisorMode = appState.advisorMode === 'ai' ? 'offline' : 'ai';
      Storage.set('advisor_mode', appState.advisorMode);
      renderAdvisor();
      showToast(appState.advisorMode === 'offline' ? 'Режим советника: Автономный (без интернета)' : 'Режим советника: ИИ-аналитик Gemini');
    });
  }

  // Очистка чата советника
  const btnClearChat = document.getElementById('btn-clear-chat');
  if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
      appState.advisorHistory = [];
      Storage.set('advisor_history', []);
      renderAdvisor();
      showToast('История диалога очищена');
    });
  }

  // Модалка API-ключа
  const modalApiKey = document.getElementById('modal-apikey');
  const btnOpenApiKey = document.getElementById('btn-open-apikey');
  const btnCloseApiKey = document.getElementById('btn-close-apikey');
  const inGeminiKey = document.getElementById('input-gemini-key');
  const btnSaveApiKey = document.getElementById('btn-save-apikey');
  const btnRemoveApiKey = document.getElementById('btn-remove-apikey');

  if (btnOpenApiKey && modalApiKey) {
    btnOpenApiKey.addEventListener('click', () => {
      if (inGeminiKey) inGeminiKey.value = appState.geminiApiKey || '';
      modalApiKey.classList.add('open');
    });
  }

  if (btnCloseApiKey && modalApiKey) {
    btnCloseApiKey.addEventListener('click', () => modalApiKey.classList.remove('open'));
  }

  if (btnSaveApiKey && modalApiKey) {
    btnSaveApiKey.addEventListener('click', () => {
      const key = inGeminiKey ? inGeminiKey.value.trim() : '';
      appState.geminiApiKey = key;
      Storage.set('gemini_api_key', key);
      modalApiKey.classList.remove('open');
      showToast(key ? '✅ Ключ API сохранён' : 'Ключ очищен');
    });
  }

  if (btnRemoveApiKey && modalApiKey) {
    btnRemoveApiKey.addEventListener('click', () => {
      appState.geminiApiKey = '';
      Storage.set('gemini_api_key', '');
      if (inGeminiKey) inGeminiKey.value = '';
      modalApiKey.classList.remove('open');
      showToast('Ключ API удален');
    });
  }

  // 9. Валюты: смена основной валюты, конвертер, обновление курсов
  const selectMainCurrency = document.getElementById('select-main-currency');
  if (selectMainCurrency) {
    selectMainCurrency.addEventListener('change', () => {
      appState.currency = selectMainCurrency.value;
      Storage.set('currency', appState.currency);
      renderCurrencies();
      renderAnalysis();
      renderWhatIf();
      showToast(`Основная валюта изменена на ${appState.currency}`);
    });
  }

  const btnRefreshRates = document.getElementById('btn-refresh-rates');
  if (btnRefreshRates) {
    btnRefreshRates.addEventListener('click', () => fetchCurrencyRates(true));
  }

  const convAmount = document.getElementById('converter-amount');
  const convFrom = document.getElementById('converter-from');
  const convTo = document.getElementById('converter-to');
  if (convAmount) convAmount.addEventListener('input', updateConverter);
  if (convFrom) convFrom.addEventListener('change', updateConverter);
  if (convTo) convTo.addEventListener('change', updateConverter);

  const btnSwapConverter = document.getElementById('btn-swap-converter');
  if (btnSwapConverter && convFrom && convTo) {
    btnSwapConverter.addEventListener('click', () => {
      const temp = convFrom.value;
      convFrom.value = convTo.value;
      convTo.value = temp;
      updateConverter();
    });
  }

  // 10. История: фильтры, экспорт, удаление
  const filterNiche = document.getElementById('history-filter-niche');
  if (filterNiche) filterNiche.addEventListener('change', renderHistory);

  const searchHistory = document.getElementById('history-search-input');
  if (searchHistory) searchHistory.addEventListener('input', renderHistory);

  const btnExpCsv = document.getElementById('btn-export-csv');
  if (btnExpCsv) btnExpCsv.addEventListener('click', exportToCSV);

  const btnCopyText = document.getElementById('btn-copy-history-text');
  if (btnCopyText) btnCopyText.addEventListener('click', copyReportText);

  const btnShare = document.getElementById('btn-share-history');
  if (btnShare) btnShare.addEventListener('click', shareReport);

  // Модалка удаления записи
  const modalDelete = document.getElementById('modal-confirm-delete');
  const btnCloseDel = document.getElementById('btn-close-delete');
  const btnCancelDel = document.getElementById('btn-cancel-delete');
  const btnConfirmDel = document.getElementById('btn-action-confirm-delete');

  const closeDelModal = () => { if (modalDelete) modalDelete.classList.remove('open'); };
  if (btnCloseDel) btnCloseDel.addEventListener('click', closeDelModal);
  if (btnCancelDel) btnCancelDel.addEventListener('click', closeDelModal);

  if (btnConfirmDel) {
    btnConfirmDel.addEventListener('click', () => {
      if (appState.itemToDeleteId) {
        appState.history = appState.history.filter(h => h.id !== appState.itemToDeleteId);
        Storage.set('history', appState.history);
        appState.itemToDeleteId = null;
        closeDelModal();
        renderHistory();
        showToast('Запись удалена из истории');
      }
    });
  }

  // Очистка всей истории с двойным подтверждением
  const btnClearAllHistory = document.getElementById('btn-clear-all-history');
  if (btnClearAllHistory) {
    btnClearAllHistory.addEventListener('click', () => {
      if (appState.history.length === 0) {
        showToast('История уже пуста');
        return;
      }
      if (confirm('Вы действительно хотите полностью очистить всю историю сохранений?')) {
        if (confirm('Подтвердите удаление: это действие необратимо!')) {
          appState.history = [];
          Storage.set('history', []);
          renderHistory();
          showToast('Вся история очищена');
        }
      }
    });
  }

  // 11. Обучение / Onboarding (при первом запуске или по кнопке «?»)
  const modalOnboarding = document.getElementById('modal-onboarding');
  const btnHeaderHelp = document.getElementById('btn-header-help');
  const btnCloseOnboarding = document.getElementById('btn-close-onboarding');
  const btnOnboardStart = document.getElementById('btn-onboarding-start');
  const btnOnboardExample = document.getElementById('btn-onboarding-try-example');

  const closeOnboarding = () => {
    if (modalOnboarding) modalOnboarding.classList.remove('open');
    appState.onboardingDone = true;
    Storage.set('onboarding_done', true);
  };

  if (btnHeaderHelp && modalOnboarding) {
    btnHeaderHelp.addEventListener('click', () => modalOnboarding.classList.add('open'));
  }
  if (btnCloseOnboarding) btnCloseOnboarding.addEventListener('click', closeOnboarding);
  if (btnOnboardStart) btnOnboardStart.addEventListener('click', closeOnboarding);

  if (btnOnboardExample) {
    btnOnboardExample.addEventListener('click', () => {
      closeOnboarding();
      appState.inputs = {
        revenue: 500000,
        rent: 100000,
        salaries: 200000,
        ads: 50000,
        other: 0,
        note: 'Примерный расчет'
      };
      Storage.set('inputs', appState.inputs);
      switchTab('analysis');
      renderAnalysis();
      showToast('Заполнен пример: 500 000 ₽ дохода');
    });
  }

  // Показываем приветствие только при самом первом визите
  if (!appState.onboardingDone && modalOnboarding) {
    setTimeout(() => modalOnboarding.classList.add('open'), 300);
  }

  // 12. Регистрация Service Worker для PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  }

  // Первичная отрисовка
  renderAnalysis();
  renderWhatIf();
  renderCurrencies();
  renderHistory();

  // Загружаем курсы валют в фоновом режиме
  fetchCurrencyRates(false);
}

// ================= HAPTIC FEEDBACK (ТАКТИЛЬНЫЙ ОТКЛИК ПО ТЗ) =================
function triggerHaptic(duration = 10) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  } catch (e) {}
}
window.triggerHaptic = triggerHaptic;

document.addEventListener('click', (e) => {
  const target = e.target.closest('button, .btn, .icon-btn, .nav-item, .tool-card, .chip, [data-tab]');
  if (target) {
    triggerHaptic(10);
  }
});

// Запуск при готовности DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
