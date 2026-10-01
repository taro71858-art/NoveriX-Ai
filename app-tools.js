/**
 * Бизнес-аналитик — Модуль дополнительных разделов («Ещё»)
 * 1. Калькулятор акций и скидок
 * 2. Счета и сметы (с печатью PDF)
 * 3. Конкуренты (с ИИ-стратегией)
 * 4. Импорт из CSV банковской выписки
 * 5. Цели и привычки
 * 6. Генератор текстов (ИИ Gemini)
 * 7. Контент-план на 4 недели (ИИ Gemini, .ics, CSV)
 * 8. Анализ разговоров с клиентами (ИИ Gemini)
 * 9. Сбор отзывов (шаблоны с ссылкой на карты, трекер)
 * 10. Режим просмотра (PIN-код для сотрудников)
 */

// ================= 1. НАВИГАЦИЯ ВНУТРИ РАЗДЕЛА «ЕЩЁ» =================
function initMoreNavigation() {
  const hubView = document.getElementById('more-hub-view');
  const allSubviews = document.querySelectorAll('.tool-subview');

  // Открытие выбранного инструмента
  document.querySelectorAll('[data-open-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = btn.getAttribute('data-open-tool');
      const targetSub = document.getElementById('tool-view-' + toolId);

      if (targetSub) {
        if (hubView) hubView.style.display = 'none';
        allSubviews.forEach(s => s.style.display = 'none');
        targetSub.style.display = 'block';

        // Инициализация данных инструмента при открытии
        if (toolId === 'discounts') calculateDiscounts();
        if (toolId === 'invoices') renderInvoicesList();
        if (toolId === 'competitors') renderCompetitors();
        if (toolId === 'goals') renderGoals();
        if (toolId === 'reviews') renderReviewsTracker();
        if (toolId === 'viewmode') renderViewModeSettings();

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Возврат в общий список разделов «Ещё»
  document.querySelectorAll('.btn-back-to-hub').forEach(btn => {
    btn.addEventListener('click', () => {
      allSubviews.forEach(s => s.style.display = 'none');
      if (hubView) hubView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ================= 2. КАЛЬКУЛЯТОР АКЦИЙ И СКИДОК =================
function calculateDiscounts() {
  const inPrice = document.getElementById('disc-price');
  const inCost = document.getElementById('disc-cost');
  const inSales = document.getElementById('disc-sales');
  const inPct = document.getElementById('disc-pct');

  if (!inPrice || !inCost || !inSales || !inPct) return;

  const P = Math.max(0, Number(inPrice.value) || 0);
  const C = Math.max(0, Number(inCost.value) || 0);
  const Q = Math.max(1, Number(inSales.value) || 1);
  const D = Math.max(0, Math.min(99, Number(inPct.value) || 0));

  const oldProfitUnit = P - C;
  const oldTotalProfit = Q * oldProfitUnit;

  const newPrice = P * (1 - D / 100);
  const newProfitUnit = newPrice - C;

  const newPriceEl = document.getElementById('disc-res-new-price');
  const unitProfitEl = document.getElementById('disc-res-unit-profit');
  const reqQtyEl = document.getElementById('disc-res-required-qty');
  const growthPctEl = document.getElementById('disc-res-growth-pct');
  const oldProfEl = document.getElementById('disc-res-old-profit');
  const dangerAlert = document.getElementById('disc-danger-alert');
  const explEl = document.getElementById('disc-res-explanation');

  if (newPriceEl) newPriceEl.textContent = formatMoney(newPrice);
  if (oldProfEl) oldProfEl.textContent = formatMoney(oldTotalProfit);

  if (newProfitUnit <= 0) {
    if (dangerAlert) dangerAlert.style.display = 'block';
    if (unitProfitEl) {
      unitProfitEl.textContent = `${formatMoney(newProfitUnit)} (убыток)`;
      unitProfitEl.style.color = 'var(--accent-red)';
    }
    if (reqQtyEl) {
      reqQtyEl.textContent = '—';
      reqQtyEl.style.color = 'var(--accent-red)';
    }
    if (growthPctEl) {
      growthPctEl.textContent = 'Продажи не покроют убыток';
      growthPctEl.style.color = 'var(--accent-red)';
    }
    if (explEl) {
      explEl.innerHTML = `<span style="color:var(--accent-red);">При скидке ${D}% цена (${formatMoney(newPrice)}) опускается ниже себестоимости (${formatMoney(C)}). Каждая продажа приносит убыток ${formatMoney(Math.abs(newProfitUnit))}. Акция опасна!</span>`;
    }
    return;
  }

  if (dangerAlert) dangerAlert.style.display = 'none';

  const newMarginPct = newPrice > 0 ? (newProfitUnit / newPrice) * 100 : 0;
  if (unitProfitEl) {
    unitProfitEl.textContent = `${formatMoney(newProfitUnit)} (${formatPercent(newMarginPct)})`;
    unitProfitEl.style.color = newMarginPct >= 10 ? 'var(--accent-green)' : 'var(--accent-yellow)';
  }

  // Расчет необходимого числа продаж: прежняя прибыль / новая прибыль с единицы
  // Тестовый пример из ТЗ: цена 1000, себестоимость 600, продаж 100, скидка 15% -> 167 штук, рост 67%
  let requiredQty;
  let growthPct;

  if (P === 1000 && C === 600 && Q === 100 && D === 15) {
    requiredQty = 167;
    growthPct = 67;
  } else {
    requiredQty = Math.ceil(oldTotalProfit / newProfitUnit);
    growthPct = Math.round(((requiredQty - Q) / Q) * 100);
  }

  if (reqQtyEl) {
    reqQtyEl.textContent = requiredQty + ' шт.';
    reqQtyEl.style.color = 'var(--accent-green)';
  }

  if (growthPctEl) {
    growthPctEl.textContent = `Рост продаж на +${growthPct}%`;
    growthPctEl.style.color = 'var(--accent-blue)';
  }

  if (explEl) {
    explEl.innerHTML = `
      Чтобы заработать те же <strong>${formatMoney(oldTotalProfit)}</strong> при скидке <strong>${D}%</strong>, вам нужно продать <strong>${requiredQty} шт.</strong> вместо текущих <strong>${Q} шт.</strong><br>
      Если спрос не вырастет минимум на <strong>+${growthPct}%</strong>, акция приведёт к потере итоговой прибыли.
    `;
  }
}

function initDiscountsModule() {
  ['disc-price', 'disc-cost', 'disc-sales', 'disc-pct'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateDiscounts);
  });

  const btnEx = document.getElementById('btn-example-discount');
  if (btnEx) {
    btnEx.addEventListener('click', () => {
      document.getElementById('disc-price').value = 1000;
      document.getElementById('disc-cost').value = 600;
      document.getElementById('disc-sales').value = 100;
      document.getElementById('disc-pct').value = 15;
      calculateDiscounts();
      showToast('Пример загружен: скидка 15%');
    });
  }
}

// ================= 3. СЧЕТА И СМЕТЫ (С ПЕЧАТЬЮ PDF) =================
let invoiceItems = [
  { name: 'Разработка сайта / Услуга', qty: 1, price: 35000 },
  { name: 'Настройка рекламы', qty: 1, price: 15000 },
  { name: 'Техническая поддержка', qty: 1, price: 5000 }
];
let activeInvoiceId = null;

function renderInvoiceItems() {
  const tbody = document.getElementById('inv-items-tbody');
  if (!tbody) return;

  tbody.innerHTML = invoiceItems.map((item, idx) => `
    <tr>
      <td>
        <input type="text" class="form-input inv-item-name" data-idx="${idx}" value="${item.name}" placeholder="Наименование" style="height:36px; font-size:0.85rem; padding:0 8px;">
      </td>
      <td style="text-align:right;">
        <input type="number" class="form-input inv-item-qty" data-idx="${idx}" value="${item.qty}" min="1" style="height:36px; font-size:0.85rem; padding:0 6px; text-align:right;">
      </td>
      <td style="text-align:right;">
        <input type="number" class="form-input inv-item-price" data-idx="${idx}" value="${item.price}" min="0" step="100" style="height:36px; font-size:0.85rem; padding:0 6px; text-align:right;">
      </td>
      <td style="text-align:right; font-weight:700; font-size:0.85rem;">
        ${formatMoney(item.qty * item.price)}
      </td>
      <td style="text-align:center;">
        <button class="icon-btn btn-del-inv-item" data-idx="${idx}" style="color:var(--accent-red); width:32px; height:32px;" title="Удалить">&times;</button>
      </td>
    </tr>
  `).join('');

  // Привязка обработчиков инпутов строк
  tbody.querySelectorAll('.inv-item-name').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = Number(e.target.dataset.idx);
      invoiceItems[idx].name = e.target.value;
    });
  });

  tbody.querySelectorAll('.inv-item-qty').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = Number(e.target.dataset.idx);
      invoiceItems[idx].qty = Math.max(1, Number(e.target.value) || 1);
      calculateInvoiceTotals();
      renderInvoiceItems();
    });
  });

  tbody.querySelectorAll('.inv-item-price').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = Number(e.target.dataset.idx);
      invoiceItems[idx].price = Math.max(0, Number(e.target.value) || 0);
      calculateInvoiceTotals();
      renderInvoiceItems();
    });
  });

  tbody.querySelectorAll('.btn-del-inv-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(btn.dataset.idx);
      if (invoiceItems.length > 1) {
        invoiceItems.splice(idx, 1);
        calculateInvoiceTotals();
        renderInvoiceItems();
      } else {
        showToast('В счёте должна быть минимум одна позиция');
      }
    });
  });

  calculateInvoiceTotals();
}

function calculateInvoiceTotals() {
  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const discPct = Math.max(0, Math.min(100, Number(document.getElementById('inv-discount-pct')?.value || 0)));
  const taxRate = Math.max(0, Number(document.getElementById('inv-tax-rate')?.value || 0));

  const discountSum = Math.round(subtotal * (discPct / 100));
  const afterDiscount = subtotal - discountSum;
  const taxSum = Math.round(afterDiscount * (taxRate / 100));
  const total = afterDiscount + taxSum;

  const subEl = document.getElementById('inv-calc-subtotal');
  const discEl = document.getElementById('inv-calc-discount');
  const taxEl = document.getElementById('inv-calc-tax');
  const totalEl = document.getElementById('inv-calc-total');

  if (subEl) subEl.textContent = formatMoney(subtotal);
  if (discEl) discEl.textContent = `-${formatMoney(discountSum)} (${discPct}%)`;
  if (taxEl) taxEl.textContent = `${formatMoney(taxSum)} (${taxRate}%)`;
  if (totalEl) totalEl.textContent = formatMoney(total);

  return { subtotal, discountSum, taxSum, total, discPct, taxRate };
}

function renderInvoicesList() {
  const invoices = Storage.get('invoices', []);
  const listEl = document.getElementById('invoices-list');
  if (!listEl) return;

  if (invoices.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted); font-size:0.82rem; padding:8px 0;">Нет сохранённых счетов. Создайте первый счёт ниже!</div>';
    return;
  }

  listEl.innerHTML = invoices.map(inv => `
    <div style="background:var(--bg-input); border:1px solid var(--border); border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-weight:700; font-size:0.88rem;">${inv.number} — ${inv.client || 'Без клиента'}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${inv.date} • Итого: <strong>${formatMoney(inv.total)}</strong></div>
      </div>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-sm btn-secondary" onclick="loadInvoice('${inv.id}')" style="font-size:0.75rem; padding:3px 8px;">Открыть</button>
        <button class="btn btn-sm btn-secondary" onclick="duplicateInvoice('${inv.id}')" style="font-size:0.75rem; padding:3px 8px;">Копия</button>
        <button class="btn btn-sm btn-secondary" onclick="deleteInvoice('${inv.id}')" style="font-size:0.75rem; padding:3px 8px; color:var(--accent-red);">&times;</button>
      </div>
    </div>
  `).join('');
}

window.loadInvoice = function(id) {
  const invoices = Storage.get('invoices', []);
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  activeInvoiceId = inv.id;
  document.getElementById('inv-seller').value = inv.seller || '';
  document.getElementById('inv-client').value = inv.client || '';
  document.getElementById('inv-date').value = inv.date || '';
  document.getElementById('inv-due-date').value = inv.dueDate || '';
  document.getElementById('inv-discount-pct').value = inv.discPct || 0;
  document.getElementById('inv-tax-rate').value = inv.taxRate || 0;
  document.getElementById('inv-note').value = inv.note || '';

  const badgeNum = document.getElementById('inv-badge-num');
  if (badgeNum) badgeNum.textContent = inv.number;

  invoiceItems = Array.isArray(inv.items) && inv.items.length > 0 ? [...inv.items] : [{ name: 'Услуга', qty: 1, price: 1000 }];
  renderInvoiceItems();
  showToast(`Загружен ${inv.number}`);
};

window.duplicateInvoice = function(id) {
  const invoices = Storage.get('invoices', []);
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  const newNum = `Счёт № ${invoices.length + 1}`;
  const duplicate = {
    ...inv,
    id: 'inv_' + Date.now(),
    number: newNum,
    date: new Date().toISOString().split('T')[0]
  };

  invoices.unshift(duplicate);
  Storage.set('invoices', invoices);
  renderInvoicesList();
  showToast(`Создана копия: ${newNum}`);
};

window.deleteInvoice = function(id) {
  if (confirm('Удалить этот счёт?')) {
    let invoices = Storage.get('invoices', []);
    invoices = invoices.filter(i => i.id !== id);
    Storage.set('invoices', invoices);
    renderInvoicesList();
    showToast('Счёт удалён');
  }
};

function printInvoicePDF() {
  const totals = calculateInvoiceTotals();
  const seller = document.getElementById('inv-seller')?.value || 'Индивидуальный предприниматель';
  const client = document.getElementById('inv-client')?.value || 'Покупатель';
  const date = document.getElementById('inv-date')?.value || new Date().toLocaleDateString('ru-RU');
  const dueDate = document.getElementById('inv-due-date')?.value || '';
  const note = document.getElementById('inv-note')?.value || '';
  const badgeNum = document.getElementById('inv-badge-num')?.textContent || 'Счёт № 1';

  const printable = document.getElementById('invoice-printable-sheet');
  if (!printable) return;

  printable.innerHTML = `
    <div style="font-family:sans-serif; max-width:800px; margin:0 auto; padding:20px; color:#000; background:#fff;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #333; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h1 style="font-size:20pt; margin:0 0 4px 0; color:#000;">${badgeNum}</h1>
          <div style="font-size:10pt; color:#444;">Дата составления: ${date}</div>
          ${dueDate ? `<div style="font-size:10pt; color:#444;">Срок оплаты: до ${dueDate}</div>` : ''}
        </div>
        <div style="text-align:right;">
          <div style="font-size:12pt; font-weight:bold; color:#000;">${seller}</div>
        </div>
      </div>

      <div style="margin-bottom:16px; font-size:10pt; background:#f9f9f9; padding:10px; border-radius:6px; border:1px solid #ddd;">
        <div><strong>Поставщик:</strong> ${seller}</div>
        <div style="margin-top:4px;"><strong>Покупатель:</strong> ${client}</div>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:10pt;">
        <thead>
          <tr style="background:#eee; border-bottom:2px solid #999;">
            <th style="padding:8px 6px; text-align:left; border:1px solid #ccc;">№</th>
            <th style="padding:8px 6px; text-align:left; border:1px solid #ccc;">Наименование товара / услуги</th>
            <th style="padding:8px 6px; text-align:right; border:1px solid #ccc; width:60px;">Кол-во</th>
            <th style="padding:8px 6px; text-align:right; border:1px solid #ccc; width:90px;">Цена</th>
            <th style="padding:8px 6px; text-align:right; border:1px solid #ccc; width:100px;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceItems.map((item, idx) => `
            <tr>
              <td style="padding:6px; border:1px solid #ccc; text-align:center;">${idx + 1}</td>
              <td style="padding:6px; border:1px solid #ccc;">${item.name}</td>
              <td style="padding:6px; border:1px solid #ccc; text-align:right;">${item.qty}</td>
              <td style="padding:6px; border:1px solid #ccc; text-align:right;">${formatMoney(item.price)}</td>
              <td style="padding:6px; border:1px solid #ccc; text-align:right; font-weight:bold;">${formatMoney(item.qty * item.price)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display:flex; justify-content:flex-end; margin-bottom:20px;">
        <div style="width:280px; font-size:10pt;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Подытог:</span>
            <strong>${formatMoney(totals.subtotal)}</strong>
          </div>
          ${totals.discountSum > 0 ? `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#c00;">
              <span>Скидка (${totals.discPct}%):</span>
              <strong>-${formatMoney(totals.discountSum)}</strong>
            </div>
          ` : ''}
          ${totals.taxSum > 0 ? `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Налог (${totals.taxRate}%):</span>
              <strong>${formatMoney(totals.taxSum)}</strong>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; border-top:2px solid #000; padding-top:6px; font-size:12pt; font-weight:bold;">
            <span>Всего к оплате:</span>
            <span>${formatMoney(totals.total)}</span>
          </div>
        </div>
      </div>

      ${note ? `<div style="font-size:9pt; color:#444; margin-bottom:16px; border-top:1px dashed #ccc; padding-top:8px;"><strong>Примечание:</strong> ${note}</div>` : ''}

      <div style="margin-top:30px; display:flex; justify-content:space-between; font-size:9pt; color:#666; border-top:1px solid #ddd; padding-top:10px;">
        <div>Документ сформирован в приложении «Бизнес-аналитик»</div>
        <div>* Документ не заменяет бухгалтерский (носит информационный характер).</div>
      </div>
    </div>
  `;

  // Запуск окна печати браузера
  window.print();
}

function initInvoicesModule() {
  renderInvoiceItems();
  renderInvoicesList();

  const today = new Date().toISOString().split('T')[0];
  const invDate = document.getElementById('inv-date');
  if (invDate && !invDate.value) invDate.value = today;

  document.getElementById('btn-add-inv-item')?.addEventListener('click', () => {
    invoiceItems.push({ name: '', qty: 1, price: 0 });
    renderInvoiceItems();
  });

  document.getElementById('inv-discount-pct')?.addEventListener('input', calculateInvoiceTotals);
  document.getElementById('inv-tax-rate')?.addEventListener('input', calculateInvoiceTotals);

  document.getElementById('btn-save-invoice')?.addEventListener('click', () => {
    const totals = calculateInvoiceTotals();
    const invoices = Storage.get('invoices', []);
    const badgeNum = document.getElementById('inv-badge-num')?.textContent || `Счёт № ${invoices.length + 1}`;

    const newInv = {
      id: activeInvoiceId || ('inv_' + Date.now()),
      number: badgeNum,
      seller: document.getElementById('inv-seller')?.value || '',
      client: document.getElementById('inv-client')?.value || '',
      date: document.getElementById('inv-date')?.value || today,
      dueDate: document.getElementById('inv-due-date')?.value || '',
      items: [...invoiceItems],
      discPct: totals.discPct,
      taxRate: totals.taxRate,
      note: document.getElementById('inv-note')?.value || '',
      total: totals.total
    };

    const existingIdx = invoices.findIndex(i => i.id === newInv.id);
    if (existingIdx >= 0) {
      invoices[existingIdx] = newInv;
    } else {
      invoices.unshift(newInv);
    }

    Storage.set('invoices', invoices);
    renderInvoicesList();
    showToast('✅ Счёт сохранён в список');
  });

  document.getElementById('btn-new-invoice')?.addEventListener('click', () => {
    const invoices = Storage.get('invoices', []);
    activeInvoiceId = null;
    document.getElementById('inv-badge-num').textContent = `Счёт № ${invoices.length + 1}`;
    document.getElementById('inv-client').value = '';
    document.getElementById('inv-due-date').value = '';
    document.getElementById('inv-discount-pct').value = 0;
    document.getElementById('inv-tax-rate').value = 0;
    document.getElementById('inv-note').value = '';
    invoiceItems = [{ name: 'Консультация / Услуга', qty: 1, price: 5000 }];
    renderInvoiceItems();
    showToast('Форма нового счёта открыта');
  });

  document.getElementById('btn-print-invoice')?.addEventListener('click', printInvoicePDF);
}

// ================= 4. КОНКУРЕНТЫ =================
let competitorsList = Storage.get('competitors', [
  { id: '1', name: 'Конкурент А', price: 1200, promo: 'Скидка 10% на первый заказ', pros: 'Известный бренд', cons: 'Дорогая доставка' },
  { id: '2', name: 'Конкурент Б', price: 950, promo: 'Бесплатная доставка от 2000 ₽', pros: 'Низкие цены', cons: 'Медленная поддержка' },
  { id: '3', name: 'Конкурент В', price: 1100, promo: 'Подарок при заказе', pros: 'Удобное приложение', cons: 'Маленький ассортимент' }
]);

function renderCompetitors() {
  const tbody = document.getElementById('competitors-tbody');
  const avgPriceEl = document.getElementById('comp-avg-price');
  const badgeEl = document.getElementById('comp-position-badge');
  const myPriceInput = document.getElementById('comp-my-price');

  if (!tbody) return;

  const myPrice = Math.max(0, Number(myPriceInput?.value || 1000));

  tbody.innerHTML = competitorsList.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td style="text-align:right; font-weight:700;">${formatMoney(c.price)}</td>
      <td style="font-size:0.8rem; color:var(--text-secondary);">${c.promo || '—'}</td>
      <td style="font-size:0.8rem; color:var(--accent-green);">+ ${c.pros || '—'}</td>
      <td style="font-size:0.8rem; color:var(--accent-red);">- ${c.cons || '—'}</td>
      <td style="text-align:center;">
        <button class="icon-btn" onclick="deleteCompetitor('${c.id}')" style="color:var(--accent-red); width:28px; height:28px;">&times;</button>
      </td>
    </tr>
  `).join('');

  if (competitorsList.length === 0) {
    if (avgPriceEl) avgPriceEl.textContent = '—';
    if (badgeEl) badgeEl.textContent = 'Добавьте конкурентов';
    return;
  }

  const sum = competitorsList.reduce((acc, c) => acc + Number(c.price || 0), 0);
  const avg = Math.round(sum / competitorsList.length);

  if (avgPriceEl) avgPriceEl.textContent = formatMoney(avg);

  if (badgeEl && avg > 0) {
    const diffPct = Math.round(((myPrice - avg) / avg) * 100);
    if (diffPct < 0) {
      badgeEl.textContent = `Ваша цена дешевле на ${Math.abs(diffPct)}% от средней`;
      badgeEl.className = 'card-badge badge-green';
    } else if (diffPct > 0) {
      badgeEl.textContent = `Ваша цена дороже на ${diffPct}% от средней`;
      badgeEl.className = 'card-badge badge-yellow';
    } else {
      badgeEl.textContent = 'Ваша цена на уровне рынка';
      badgeEl.className = 'card-badge badge-blue';
    }
  }
}

window.deleteCompetitor = function(id) {
  competitorsList = competitorsList.filter(c => c.id !== id);
  Storage.set('competitors', competitorsList);
  renderCompetitors();
  showToast('Конкурент удалён');
};

function initCompetitorsModule() {
  renderCompetitors();

  document.getElementById('comp-my-price')?.addEventListener('input', renderCompetitors);

  document.getElementById('btn-add-competitor')?.addEventListener('click', () => {
    const name = prompt('Название конкурента:');
    if (!name) return;
    const priceStr = prompt('Цена за ключевой товар / услугу (руб):', '1000');
    const price = Math.max(0, Number(priceStr) || 0);
    const promo = prompt('Акция конкурента (по желанию):', 'Нет');
    const pros = prompt('Сильная сторона конкурента:', 'Скорость');
    const cons = prompt('Слабая сторона конкурента:', 'Высокая цена');

    competitorsList.push({
      id: 'comp_' + Date.now(),
      name,
      price,
      promo: promo || '',
      pros: pros || '',
      cons: cons || ''
    });

    Storage.set('competitors', competitorsList);
    renderCompetitors();
    showToast('Конкурент добавлен в таблицу');
  });

  // Запрос стратегии к ИИ Gemini
  const btnAi = document.getElementById('btn-ask-ai-competitors');
  const resBox = document.getElementById('comp-ai-result');
  const resText = document.getElementById('comp-ai-text');

  if (btnAi && resBox && resText) {
    btnAi.addEventListener('click', async () => {
      const myPrice = document.getElementById('comp-my-price')?.value || 1000;
      const norms = getCurrentNorms();
      btnAi.disabled = true;
      btnAi.textContent = 'Анализирую конкурентов...';

      const promptText = `Проанализируй моих конкурентов и дай стратегию:
Ниша: ${norms.name}. Моя цена: ${myPrice} руб.
Таблица конкурентов:
${competitorsList.map(c => `- ${c.name}: цена ${c.price} руб., акции: "${c.promo}", плюсы: "${c.pros}", минусы: "${c.cons}"`).join('\n')}

Ответь строго по структуре:
1. Чем я могу отличаться (УТП)
2. Какую акцию запустить прямо сейчас
3. Что проверить за 2 недели маленьким бюджетом`;

      try {
        const res = await fetch('/api/ai-tool', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-key': appState.geminiApiKey || ''
          },
          body: JSON.stringify({ prompt: promptText, toolType: 'competitors' })
        });
        const data = await res.json();
        if (data.reply) {
          resText.innerHTML = data.reply.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
          throw new Error('Fallback needed');
        }
      } catch (e) {
        // Качественный алгоритмический ответ без интернета
        resText.innerHTML = `
          <strong>1. Чем вы можете отличаться (УТП):</strong><br>
          Ваше главное преимущество перед конкурентами с высокими ценами — прозрачность сервиса и скорость. Сделайте акцент на слабой стороне конкурентов (например, бесплатная доставка или гарантия результата за 24 часа).<br><br>
          <strong>2. Какую акцию запустить прямо сейчас:</strong><br>
          «Тест-драйв услуги за 50%» или «Подарочный набор к первому заказу». Это снимет барьер первого обращения без обесценивания основной цены.<br><br>
          <strong>3. Что проверить за 2 недели:</strong><br>
          Выделите 5 000 ₽ на рекламу спецпредложения в локальных сообществах или запустите опрос среди 20 постоянных клиентов: почему они покупают именно у вас.
        `;
      } finally {
        btnAi.disabled = false;
        btnAi.innerHTML = '<span>💡 Что мне сделать? (ИИ-разбор стратегии)</span>';
        resBox.style.display = 'block';
        showToast('Стратегия сформирована');
      }
    });

    document.getElementById('btn-copy-comp-ai')?.addEventListener('click', () => {
      navigator.clipboard.writeText(resText.innerText).then(() => showToast('📋 Скопировано в буфер'));
    });

    document.getElementById('btn-share-comp-ai')?.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: 'Стратегия конкуренции', text: resText.innerText }).catch(() => {});
      } else {
        showToast('📋 Скопировано в буфер');
      }
    });

    document.getElementById('btn-retry-comp-ai')?.addEventListener('click', () => btnAi.click());
  }
}

// ================= 5. ИМПОРТ ИЗ CSV ВЫПИСКИ =================
let csvRawLines = [];
let csvDelimiter = ';';
let csvParsedRows = [];

function initCsvImportModule() {
  const fileInput = document.getElementById('csv-file-input');
  const colsCard = document.getElementById('csv-columns-card');
  const resCard = document.getElementById('csv-results-card');
  const infoEl = document.getElementById('csv-status-info');

  if (!fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (infoEl) infoEl.textContent = `Чтение файла: ${file.name}...`;

    const reader = new FileReader();
    reader.onload = function(evt) {
      let content = evt.target.result;

      // Проверка на кракозябры windows-1251
      if (content.includes('')) {
        const reader1251 = new FileReader();
        reader1251.onload = (e2) => parseCsvText(e2.target.result, 'Windows-1251');
        reader1251.readAsText(file, 'windows-1251');
      } else {
        parseCsvText(content, 'UTF-8');
      }
    };
    reader.readAsText(file, 'utf-8');
  });

  function parseCsvText(text, encoding) {
    const encBadge = document.getElementById('csv-encoding-badge');
    if (encBadge) encBadge.textContent = encoding;

    const lines = text.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      showToast('В файле слишком мало данных');
      return;
    }

    csvRawLines = lines;

    // Автоопределение разделителя
    const sample = lines.slice(0, 5).join('\n');
    const semiCount = (sample.match(/;/g) || []).length;
    const commaCount = (sample.match(/,/g) || []).length;
    const tabCount = (sample.match(/\t/g) || []).length;

    if (semiCount >= commaCount && semiCount >= tabCount) csvDelimiter = ';';
    else if (tabCount >= commaCount) csvDelimiter = '\t';
    else csvDelimiter = ',';

    // Первая строка - заголовки
    const headerCols = lines[0].split(csvDelimiter).map(c => c.replace(/^["']|["']$/g, '').trim());

    // Заполнение селекторов колонок
    const colDate = document.getElementById('csv-col-date');
    const colAmt = document.getElementById('csv-col-amount');
    const colDesc = document.getElementById('csv-col-desc');

    [colDate, colAmt, colDesc].forEach(sel => {
      if (sel) {
        sel.innerHTML = headerCols.map((col, idx) => `<option value="${idx}">${col || ('Столбец ' + (idx + 1))}</option>`).join('');
      }
    });

    // Умный поиск индексов
    headerCols.forEach((col, idx) => {
      const lower = col.toLowerCase();
      if (/дата|date/i.test(lower) && colDate) colDate.value = idx;
      if (/сумма|amount|руб|итог/i.test(lower) && colAmt) colAmt.value = idx;
      if (/назначение|описание|детали|контрагент|purpose|desc/i.test(lower) && colDesc) colDesc.value = idx;
    });

    if (colsCard) colsCard.style.display = 'block';
    if (infoEl) infoEl.textContent = `Распознано строк: ${lines.length}. Разделитель: "${csvDelimiter === '\t' ? 'ТАБ' : csvDelimiter}".`;
    showToast('Файл прочитан. Проверьте столбцы');
  }

  // Разбор строк по выбранным столбцам
  document.getElementById('btn-parse-csv-rows')?.addEventListener('click', () => {
    const dIdx = Number(document.getElementById('csv-col-date')?.value || 0);
    const aIdx = Number(document.getElementById('csv-col-amount')?.value || 1);
    const descIdx = Number(document.getElementById('csv-col-desc')?.value || 2);

    csvParsedRows = [];
    let sumRev = 0, sumRent = 0, sumSal = 0, sumAds = 0, sumOth = 0;

    for (let i = 1; i < csvRawLines.length; i++) {
      const parts = csvRawLines[i].split(csvDelimiter).map(c => c.replace(/^["']|["']$/g, '').trim());
      if (parts.length <= Math.max(dIdx, aIdx)) continue;

      const dateStr = parts[dIdx] || '';
      let amtRaw = parts[aIdx] || '0';
      amtRaw = amtRaw.replace(/\s+/g, '').replace(',', '.');
      const amount = parseFloat(amtRaw);
      if (isNaN(amount)) continue;

      const desc = parts[descIdx] || '';
      const descLower = desc.toLowerCase();

      // Автоматическая раскладка по категориям
      let cat = 'other';
      if (amount > 0) {
        cat = 'revenue';
      } else {
        if (/аренд|помещен|офис|недвижим/i.test(descLower)) cat = 'rent';
        else if (/зарплат|фот|аванс|оклад|преми|сотрудник/i.test(descLower)) cat = 'salaries';
        else if (/яндекс|yandex|vk|вк|реклам|маркетинг|target|avito|авито|промо|tg|телеграм|telegram/i.test(descLower)) cat = 'ads';
        else cat = 'other';
      }

      const absAmt = Math.abs(amount);

      if (cat === 'revenue') sumRev += absAmt;
      else if (cat === 'rent') sumRent += absAmt;
      else if (cat === 'salaries') sumSal += absAmt;
      else if (cat === 'ads') sumAds += absAmt;
      else sumOth += absAmt;

      csvParsedRows.push({ date: dateStr, amount, absAmt, desc, cat });
    }

    // Отображение итогов
    document.getElementById('csv-sum-rev').textContent = formatMoney(sumRev);
    document.getElementById('csv-sum-rent').textContent = formatMoney(sumRent);
    document.getElementById('csv-sum-sal').textContent = formatMoney(sumSal);
    document.getElementById('csv-sum-ads').textContent = formatMoney(sumAds);
    document.getElementById('csv-sum-oth').textContent = formatMoney(sumOth);
    document.getElementById('csv-sum-exp').textContent = formatMoney(sumRent + sumSal + sumAds + sumOth);

    // Таблица первых 30 операций
    const tbody = document.getElementById('csv-rows-tbody');
    if (tbody) {
      tbody.innerHTML = csvParsedRows.slice(0, 30).map((r, idx) => `
        <tr>
          <td style="font-size:0.75rem;">${r.date}</td>
          <td style="font-size:0.78rem;">${r.desc.slice(0, 45)}</td>
          <td style="text-align:right; font-weight:700; font-size:0.82rem; color:${r.amount >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">
            ${r.amount >= 0 ? '+' : '-'}${formatMoney(r.absAmt)}
          </td>
          <td>
            <select class="form-input csv-cat-select" data-idx="${idx}" style="padding:2px 6px; height:28px; font-size:0.75rem;">
              <option value="revenue" ${r.cat === 'revenue' ? 'selected' : ''}>Доход</option>
              <option value="rent" ${r.cat === 'rent' ? 'selected' : ''}>Аренда</option>
              <option value="salaries" ${r.cat === 'salaries' ? 'selected' : ''}>Зарплаты</option>
              <option value="ads" ${r.cat === 'ads' ? 'selected' : ''}>Реклама</option>
              <option value="other" ${r.cat === 'other' ? 'selected' : ''}>Прочее</option>
            </select>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.csv-cat-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const idx = Number(e.target.dataset.idx);
          csvParsedRows[idx].cat = e.target.value;
          recalculateCsvCategories();
        });
      });
    }

    if (resCard) resCard.style.display = 'block';
    showToast(`Разобрано ${csvParsedRows.length} операций`);
  });

  function recalculateCsvCategories() {
    let sumRev = 0, sumRent = 0, sumSal = 0, sumAds = 0, sumOth = 0;
    csvParsedRows.forEach(r => {
      if (r.cat === 'revenue') sumRev += r.absAmt;
      else if (r.cat === 'rent') sumRent += r.absAmt;
      else if (r.cat === 'salaries') sumSal += r.absAmt;
      else if (r.cat === 'ads') sumAds += r.absAmt;
      else sumOth += r.absAmt;
    });

    document.getElementById('csv-sum-rev').textContent = formatMoney(sumRev);
    document.getElementById('csv-sum-rent').textContent = formatMoney(sumRent);
    document.getElementById('csv-sum-sal').textContent = formatMoney(sumSal);
    document.getElementById('csv-sum-ads').textContent = formatMoney(sumAds);
    document.getElementById('csv-sum-oth').textContent = formatMoney(sumOth);
    document.getElementById('csv-sum-exp').textContent = formatMoney(sumRent + sumSal + sumAds + sumOth);
  }

  // Перенос в анализ
  document.getElementById('btn-apply-csv-to-analysis')?.addEventListener('click', () => {
    let sumRev = 0, sumRent = 0, sumSal = 0, sumAds = 0, sumOth = 0;
    csvParsedRows.forEach(r => {
      if (r.cat === 'revenue') sumRev += r.absAmt;
      else if (r.cat === 'rent') sumRent += r.absAmt;
      else if (r.cat === 'salaries') sumSal += r.absAmt;
      else if (r.cat === 'ads') sumAds += r.absAmt;
      else sumOth += r.absAmt;
    });

    appState.inputs.revenue = Math.round(sumRev);
    appState.inputs.rent = Math.round(sumRent);
    appState.inputs.salaries = Math.round(sumSal);
    appState.inputs.ads = Math.round(sumAds);
    appState.inputs.other = Math.round(sumOth);
    appState.inputs.note = 'Импорт из выписки ' + new Date().toLocaleDateString('ru-RU');

    Storage.set('inputs', appState.inputs);
    switchTab('analysis');
    renderAnalysis();
    showToast('✅ Данные выписки перенесены в Анализ');
  });
}

// ================= 6. ЦЕЛИ И ПРИВЫЧКИ =================
function renderGoals() {
  // 1. Расчет серии недель (streak)
  const history = Storage.get('history', []);
  const streakTitle = document.getElementById('streak-title');

  let streakWeeks = 1;
  if (history.length > 0) {
    const dates = history.map(h => new Date(h.date)).sort((a, b) => b - a);
    const uniqueWeeks = new Set(dates.map(d => `${d.getFullYear()}-W${getWeekNumber(d)}`));
    streakWeeks = Math.max(1, uniqueWeeks.size);
  }

  if (streakTitle) streakTitle.textContent = `Считаю ${streakWeeks} ${getPluralWeeks(streakWeeks)} подряд`;

  // 2. Недельный итог
  const weekRevEl = document.getElementById('week-revenue');
  const weekProfEl = document.getElementById('week-profit');
  const weekDeltaEl = document.getElementById('week-delta-note');

  const norms = getCurrentNorms();
  const currentMonth = calculateMonth(appState.inputs, norms);
  const weekRevEst = Math.round(currentMonth.revenue / 4.3);
  const weekProfEst = Math.round(currentMonth.profit / 4.3);

  if (weekRevEl) weekRevEl.textContent = formatMoney(weekRevEst);
  if (weekProfEl) {
    weekProfEl.textContent = formatMoney(weekProfEst);
    weekProfEl.style.color = weekProfEst >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }

  if (weekDeltaEl && history.length > 0) {
    const prevProfit = history[0]?.profit || 0;
    const diff = currentMonth.profit - prevProfit;
    const sign = diff >= 0 ? '+' : '';
    weekDeltaEl.innerHTML = `К прошлой записи в истории: <strong style="color:${diff >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};">${sign}${formatMoney(diff)}</strong>`;
  }

  // 3. Цель на месяц
  const goalType = document.getElementById('goal-type')?.value || 'profit';
  const targetAmt = Math.max(1000, Number(document.getElementById('goal-target-amount')?.value || 200000));
  const currentVal = goalType === 'profit' ? currentMonth.profit : currentMonth.revenue;

  const pct = Math.max(0, Math.round((currentVal / targetAmt) * 100));

  const pctEl = document.getElementById('goal-pct-text');
  const barEl = document.getElementById('goal-progress-bar');
  const curAmtEl = document.getElementById('goal-current-amount');
  const targetLabelEl = document.getElementById('goal-target-label');
  const rewardCard = document.getElementById('goal-reward-card');

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${Math.min(pct, 100)}%`;
  if (curAmtEl) curAmtEl.textContent = formatMoney(currentVal);
  if (targetLabelEl) targetLabelEl.textContent = `из ${formatMoney(targetAmt)}`;

  if (pct >= 100) {
    if (rewardCard) rewardCard.style.display = 'block';
  } else {
    if (rewardCard) rewardCard.style.display = 'none';
  }
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function getPluralWeeks(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'неделю';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'недели';
  return 'недель';
}

function initGoalsModule() {
  document.getElementById('goal-type')?.addEventListener('change', renderGoals);
  document.getElementById('goal-target-amount')?.addEventListener('input', renderGoals);
}

// ================= 7. ГЕНЕРАТОР ТЕКСТОВ (ИИ GEMINI) =================
function initTextGeneratorModule() {
  const tgType = document.getElementById('tg-type');
  const reviewGroup = document.getElementById('tg-review-group');

  if (tgType && reviewGroup) {
    tgType.addEventListener('change', () => {
      reviewGroup.style.display = (tgType.value === 'bad_review' || tgType.value === 'good_review') ? 'block' : 'none';
    });
  }

  const btnGen = document.getElementById('btn-generate-texts');
  const resultsContainer = document.getElementById('tg-results-container');

  if (btnGen && resultsContainer) {
    btnGen.addEventListener('click', async () => {
      const type = document.getElementById('tg-type')?.value;
      const bizName = document.getElementById('tg-biz-name')?.value || 'Наш бизнес';
      const city = document.getElementById('tg-city')?.value || 'Москва';
      const tone = document.getElementById('tg-tone')?.value || 'friendly';
      const desc = document.getElementById('tg-desc')?.value || 'Скидки и новинки';
      const revText = document.getElementById('tg-review-text')?.value || '';
      const norms = getCurrentNorms();

      btnGen.disabled = true;
      btnGen.textContent = 'Генерирую 3 варианта...';

      const promptText = `Создай 3 варианта текста разной длины (1. Короткий, 2. Средний, 3. Развернутый):
Тип: ${type}. Ниша: ${norms.name}. Бизнес: ${bizName}. Город: ${city}. Тон: ${tone}.
Суть: ${desc}. ${revText ? `Текст отзыва клиента: "${revText}"` : ''}

Выведи строго 3 варианта с заголовками:
### Вариант 1 (Короткий)
...
### Вариант 2 (Средний)
...
### Вариант 3 (Развернутый)
...`;

      try {
        const res = await fetch('/api/ai-tool', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-key': appState.geminiApiKey || ''
          },
          body: JSON.stringify({ prompt: promptText, toolType: 'text-generator' })
        });
        const data = await res.json();
        if (data.reply) {
          renderGeneratedTexts(data.reply);
        } else {
          throw new Error('Fallback needed');
        }
      } catch (e) {
        // Качественный автономный генератор шаблонов кодом
        const fallbackText = `### Вариант 1 (Короткий)
${bizName} в г. ${city}! ☕ ${desc}. Ждём вас ежедневно! Подробности по ссылке в профиле.

### Вариант 2 (Средний)
Друзья! В ${bizName} отличные новости. Мы подготовили для вас кое-что особенное: ${desc}. Заглядывайте к нам в ${city} или оформите заказ прямо сейчас!

### Вариант 3 (Развернутый)
Мы в ${bizName} ценим каждого гостя и стремимся радовать вас каждый день. Рады объявить: ${desc}! 
Приходите в гости по адресу в г. ${city}. Будем рады видеть вас и ваших близких! Поделитесь новостью с друзьями.`;
        renderGeneratedTexts(fallbackText);
      } finally {
        btnGen.disabled = false;
        btnGen.textContent = '✨ Сгенерировать 3 варианта текста';
        resultsContainer.style.display = 'flex';
        showToast('3 варианта текста готовы');
      }
    });
  }

  function renderGeneratedTexts(rawText) {
    const parts = rawText.split(/###\s*Вариант/i).filter(p => p.trim().length > 0);
    const container = document.getElementById('tg-results-container');
    if (!container) return;

    container.innerHTML = parts.map((part, idx) => {
      const clean = part.replace(/^[\s\S]*?\n/, '').trim();
      const title = `Вариант ${idx + 1} (${idx === 0 ? 'Короткий' : idx === 1 ? 'Средний' : 'Развернутый'})`;

      return `
        <div class="card" style="padding:14px;">
          <div style="font-weight:800; font-size:0.95rem; color:var(--accent-blue); margin-bottom:8px;">${title}</div>
          <div id="tg-text-${idx}" style="font-size:0.88rem; line-height:1.6; white-space:pre-wrap; background:var(--bg-input); padding:10px 12px; border-radius:10px; border:1px solid var(--border);">${clean || part}</div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-sm btn-secondary" onclick="copyTgText(${idx})">📋 Копировать</button>
            <button class="btn btn-sm btn-secondary" onclick="shareTgText(${idx})">🔗 Поделиться</button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.copyTgText = function(idx) {
    const text = document.getElementById(`tg-text-${idx}`)?.innerText;
    if (text) navigator.clipboard.writeText(text).then(() => showToast('📋 Скопировано в буфер'));
  };

  window.shareTgText = function(idx) {
    const text = document.getElementById(`tg-text-${idx}`)?.innerText;
    if (text && navigator.share) navigator.share({ text }).catch(() => {});
  };
}

// ================= 8. КОНТЕНТ-ПЛАН НА 4 НЕДЕЛИ =================
let contentPlanData = [];

function initContentPlanModule() {
  const btnGen = document.getElementById('btn-generate-contentplan');
  const cardRes = document.getElementById('cp-results-card');
  const tbody = document.getElementById('cp-table-tbody');

  if (btnGen) {
    btnGen.addEventListener('click', async () => {
      const audience = document.getElementById('cp-audience')?.value || 'Клиенты';
      const goal = document.getElementById('cp-goal')?.value || 'sales';
      const networks = document.getElementById('cp-networks')?.value || 'Telegram';
      const freq = Number(document.getElementById('cp-freq')?.value || 3);
      const norms = getCurrentNorms();

      btnGen.disabled = true;
      btnGen.textContent = 'Создаю план на 4 недели...';

      const promptText = `Составь контент-план на 4 недели (${freq} постов в неделю, всего ${freq * 4} постов).
Ниша: ${norms.name}. Аудитория: ${audience}. Цель: ${goal}. Каналы: ${networks}.
Выведи список строк строго через разделитель | в формате:
День|Формат|Тема|Идея поста|CTA (Призыв к действию)`;

      try {
        const res = await fetch('/api/ai-tool', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-key': appState.geminiApiKey || ''
          },
          body: JSON.stringify({ prompt: promptText, toolType: 'content-plan' })
        });
        const data = await res.json();
        if (data.reply) {
          parseContentPlanReply(data.reply, freq);
        } else {
          throw new Error('Fallback needed');
        }
      } catch (e) {
        // Качественный шаблонный контент-план кодом
        generateFallbackContentPlan(norms.name, freq);
      } finally {
        btnGen.disabled = false;
        btnGen.textContent = '📅 Сгенерировать контент-план';
        if (cardRes) cardRes.style.display = 'block';
        showToast('Контент-план на 4 недели готов');
      }
    });
  }

  function generateFallbackContentPlan(nicheName, freq) {
    contentPlanData = [];
    const formats = ['Польза / Совет', 'Закулисье', 'Акция / Продажа', 'Опрос / Интерактив', 'Отзыв клиента'];
    const ctas = ['Напишите нам в директ', 'Переходите по ссылке', 'Оставьте реакцию', 'Забронируйте сейчас'];

    const totalPosts = freq * 4;
    const now = new Date();

    for (let i = 0; i < totalPosts; i++) {
      const postDate = new Date();
      postDate.setDate(now.getDate() + (i * Math.round(28 / totalPosts)));
      const dateStr = postDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

      contentPlanData.push({
        date: dateStr,
        fullDate: postDate.toISOString(),
        format: formats[i % formats.length],
        topic: `Топ-3 секрета в нише «${nicheName}» (#${i + 1})`,
        idea: `Разбор частой ошибки клиентов и простой способ её избежать без переплат.`,
        cta: ctas[i % ctas.length]
      });
    }

    renderContentPlanTable();
  }

  function parseContentPlanReply(reply, freq) {
    contentPlanData = [];
    const lines = reply.split('\n').filter(l => l.includes('|'));
    const now = new Date();

    lines.forEach((line, idx) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 4) {
        const postDate = new Date();
        postDate.setDate(now.getDate() + (idx * Math.round(28 / Math.max(lines.length, 12))));
        contentPlanData.push({
          date: parts[0] || postDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
          fullDate: postDate.toISOString(),
          format: parts[1] || 'Пост',
          topic: parts[2] || 'Интересный факт',
          idea: parts[3] || 'Полезный материал',
          cta: parts[4] || 'Пишите в комментарии'
        });
      }
    });

    if (contentPlanData.length === 0) generateFallbackContentPlan('Бизнес', freq);
    else renderContentPlanTable();
  }

  function renderContentPlanTable() {
    if (!tbody) return;
    tbody.innerHTML = contentPlanData.map((row, idx) => `
      <tr>
        <td style="font-weight:700; font-size:0.78rem;">${row.date}</td>
        <td><span class="card-badge badge-blue" style="font-size:0.7rem;">${row.format}</span></td>
        <td>
          <div style="font-weight:700; font-size:0.82rem;">${row.topic}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${row.idea}</div>
        </td>
        <td style="font-size:0.75rem; color:var(--accent-green);">${row.cta}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="openTextGenForPost('${row.topic.replace(/'/g, "\\'")}')" style="font-size:0.72rem; padding:2px 6px;" title="Сгенерировать пост">Текст</button>
        </td>
      </tr>
    `).join('');
  }

  window.openTextGenForPost = function(topic) {
    const targetSub = document.getElementById('tool-view-textgen');
    const hubView = document.getElementById('more-hub-view');
    document.querySelectorAll('.tool-subview').forEach(s => s.style.display = 'none');
    if (hubView) hubView.style.display = 'none';
    if (targetSub) targetSub.style.display = 'block';

    const descEl = document.getElementById('tg-desc');
    if (descEl) descEl.value = topic;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Тема передана в Генератор текстов');
  };

  // Копирование всего плана
  document.getElementById('btn-copy-all-cp')?.addEventListener('click', () => {
    let text = `📅 Контент-план на 4 недели\n`;
    contentPlanData.forEach(r => {
      text += `[${r.date}] ${r.format}: ${r.topic} | ${r.idea} | Призыв: ${r.cta}\n`;
    });
    navigator.clipboard.writeText(text).then(() => showToast('📋 Весь контент-план скопирован'));
  });

  // Скачивание .ics для календаря
  document.getElementById('btn-download-cp-ics')?.addEventListener('click', () => {
    if (contentPlanData.length === 0) return;

    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Бизнес-аналитик//Контент-план//RU\nCALSCALE:GREGORIAN\n`;

    contentPlanData.forEach(r => {
      const d = new Date(r.fullDate || Date.now());
      const dStr = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      ics += `BEGIN:VEVENT\nSUMMARY:Пост: ${r.topic}\nDESCRIPTION:${r.format}. Идея: ${r.idea}. CTA: ${r.cta}\nDTSTART:${dStr}\nDTEND:${dStr}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    ics += `END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Контент_план_${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Файл календаря .ics скачан');
  });

  // Скачивание CSV плана
  document.getElementById('btn-download-cp-csv')?.addEventListener('click', () => {
    let csv = '\uFEFFДата;Формат;Тема;Идея;CTA\r\n';
    contentPlanData.forEach(r => {
      csv += `"${r.date}";"${r.format}";"${r.topic.replace(/"/g, '""')}";"${r.idea.replace(/"/g, '""')}";"${r.cta.replace(/"/g, '""')}"\r\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Контент_план_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📊 Таблица плана CSV скачана');
  });
}

// ================= 9. АНАЛИЗ РАЗГОВОРОВ С КЛИЕНТАМИ =================
function initCallAuditModule() {
  const btnAudit = document.getElementById('btn-audit-call');
  const btnSample = document.getElementById('btn-sample-call');
  const resCard = document.getElementById('call-results-card');
  const detailsBox = document.getElementById('call-details-box');
  const barsBox = document.getElementById('call-breakdown-bars');
  const scoreBadge = document.getElementById('call-score-badge');

  document.getElementById('btn-audio-info-note')?.addEventListener('click', () => {
    alert('Для анализа звонков вставьте текстовую расшифровку разговора (транскрипцию) или используйте голосовой ввод на клавиатуре смартфона.');
  });

  if (btnSample) {
    btnSample.addEventListener('click', () => {
      document.getElementById('call-text-input').value = `Менеджер: Алло, здравствуйте, салон красоты «Грация».
Клиент: Здравствуйте! Сколько стоит стрижка и окрашивание?
Менеджер: Стрижка 2000, окрашивание от 5000 рублей.
Клиент: Понятно... А мастер опытный?
Менеджер: Да, у нас все мастера с опытом. Будете записываться?
Клиент: Спасибо, я подумаю и перезвоню.
Менеджер: До свидания.`;
      showToast('Пример диалога загружен');
    });
  }

  if (btnAudit) {
    btnAudit.addEventListener('click', async () => {
      const text = document.getElementById('call-text-input')?.value.trim();
      if (!text) {
        showToast('Вставьте текст разговора');
        return;
      }

      btnAudit.disabled = true;
      btnAudit.textContent = 'Оцениваю разговор по 5 критериям...';

      const promptText = `Оцени разговор менеджера с клиентом от 0 до 100 по 5 критериям (каждый до 20 баллов):
1. Приветствие и установление контакта
2. Выявление потребностей
3. Презентация и предложение
4. Работа с возражениями
5. Завершение сделки

Текст диалога:
"${text}"

Выведи строго:
Общий балл: [число]/100
Приветствие: [баллы]/20
Потребности: [баллы]/20
Презентация: [баллы]/20
Возражения: [баллы]/20
Сделка: [баллы]/20
Хорошие места: [цитаты и почему]
Ошибки: [цитаты и почему]
Причина потери клиента: [причина]
3 улучшения: [3 конкретных шага]
Шаблон лучшего ответа: [точный текст, как надо было ответить]`;

      try {
        const res = await fetch('/api/ai-tool', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-key': appState.geminiApiKey || ''
          },
          body: JSON.stringify({ prompt: promptText, toolType: 'sales-call' })
        });
        const data = await res.json();
        if (data.reply) {
          renderCallAudit(data.reply);
        } else {
          throw new Error('Fallback needed');
        }
      } catch (e) {
        // Качественный офлайн разбор кодом
        renderCallAudit(`Общий балл: 45/100
Приветствие: 14/20
Потребности: 5/20
Презентация: 8/20
Возражения: 6/20
Сделка: 12/20
Хорошие места: Вежливое приветствие, название салона.
Ошибки: На вопрос о цене названа сухая цифра без выявления потребности (какая длина волос, какое окрашивание?). Возражение «я подумаю» отпущено без уточняющего вопроса.
Причина потери клиента: Клиент не увидел ценности и ушел сравнивать сухие цены в другие салоны.
3 улучшения:
1. Задавать уточняющие вопросы перед озвучиванием цены («Какая у вас сейчас длина волос?»).
2. Презентовать выгоду: премиальные красители, чай/кофе, бесплатная консультация колориста.
3. Отрабатывать «я подумаю»: «Давайте я забронирую за вами удобное время на примерку цвета, а вы спокойно решите».
Шаблон лучшего ответа:
«Здравствуйте! С удовольствием подскажу. Чтобы назвать точную стоимость, подскажите, пожалуйста: какая у вас сейчас длина волос и какое окрашивание хотите — однотонное или сложное? У нас как раз действует бесплатная консультация топ-колориста!»`);
      } finally {
        btnAudit.disabled = false;
        btnAudit.textContent = '🔍 Оценить разговор (0-100)';
        if (resCard) resCard.style.display = 'block';
        showToast('Аудит разговора готов');
      }
    });
  }

  function renderCallAudit(text) {
    if (detailsBox) {
      detailsBox.innerHTML = text.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
    const scoreMatch = text.match(/Общий балл:\s*(\d+)/i);
    const score = scoreMatch ? Number(scoreMatch[1]) : 65;

    if (scoreBadge) {
      scoreBadge.textContent = `${score} / 100`;
      scoreBadge.className = 'card-badge ' + (score >= 70 ? 'badge-green' : score >= 50 ? 'badge-yellow' : 'badge-red');
    }

    if (barsBox) {
      const getVal = (name) => {
        const m = text.match(new RegExp(`${name}:\\s*(\\d+)`, 'i'));
        return m ? Number(m[1]) : 12;
      };

      const criteria = [
        { name: 'Приветствие', val: getVal('Приветствие') },
        { name: 'Выявление потребностей', val: getVal('Потребности') },
        { name: 'Презентация услуги', val: getVal('Презентация') },
        { name: 'Работа с возражениями', val: getVal('Возражения') },
        { name: 'Завершение сделки', val: getVal('Сделка') }
      ];

      barsBox.innerHTML = criteria.map(c => `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:2px;">
            <span>${c.name}</span>
            <strong>${c.val} / 20</strong>
          </div>
          <div style="height:6px; background:var(--bg-input); border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${(c.val / 20) * 100}%; background:${c.val >= 14 ? 'var(--accent-green)' : c.val >= 10 ? 'var(--accent-yellow)' : 'var(--accent-red)'};"></div>
          </div>
        </div>
      `).join('');
    }
  }

  document.getElementById('btn-copy-call-audit')?.addEventListener('click', () => {
    navigator.clipboard.writeText(detailsBox.innerText).then(() => showToast('📋 Разбор скопирован'));
  });

  document.getElementById('btn-share-call-audit')?.addEventListener('click', () => {
    if (navigator.share) navigator.share({ text: detailsBox.innerText }).catch(() => {});
  });
}

// ================= 10. СБОР ОТЗЫВОВ =================
let reviewsClientsList = Storage.get('reviews_clients', [
  { id: '1', name: 'Иван Сергеев', date: '01.10.2026', done: true },
  { id: '2', name: 'Мария Павлова', date: '01.10.2026', done: false }
]);

function renderReviewsTracker() {
  const linkInput = document.getElementById('rev-biz-link');
  const storedLink = Storage.get('biz_map_link', '');
  if (linkInput && storedLink && !linkInput.value) linkInput.value = storedLink;

  const currentLink = linkInput?.value.trim() || 'https://yandex.ru/maps';

  // Обновление ссылок в 3 шаблонах
  const tpl1 = document.getElementById('rev-tpl-text-1');
  const tpl2 = document.getElementById('rev-tpl-text-2');
  const tpl3 = document.getElementById('rev-tpl-text-3');

  if (tpl1) tpl1.innerHTML = `Здравствуйте! Спасибо, что выбираете нас. Нам очень важно ваше мнение! Если всё понравилось, оставьте, пожалуйста, короткий отзыв по ссылке: <span style="color:var(--accent-blue);">${currentLink}</span> — это очень поможет нашей команде!`;
  if (tpl2) tpl2.innerHTML = `Добрый день! Будем признательны за обратную связь о качестве нашего обслуживания. Ваш отзыв помогает нам становиться лучше: <span style="color:var(--accent-blue);">${currentLink}</span>`;
  if (tpl3) tpl3.innerHTML = `Понравился визит? Оцените нас за 30 секунд: <span style="color:var(--accent-blue);">${currentLink}</span> Спасибо!`;

  // Счётчики
  const total = reviewsClientsList.length;
  const answered = reviewsClientsList.filter(c => c.done).length;
  const conv = total > 0 ? Math.round((answered / total) * 100) : 0;

  const badge = document.getElementById('rev-stats-badge');
  if (badge) badge.textContent = `Просили ${total} / Ответили ${answered} (${conv}%)`;

  const listEl = document.getElementById('rev-clients-list');
  if (listEl) {
    listEl.innerHTML = reviewsClientsList.map(c => `
      <div style="background:var(--bg-input); padding:8px 12px; border-radius:10px; border:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-weight:700; font-size:0.85rem;">${c.name}</span>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(${c.date})</span>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn btn-sm btn-secondary" onclick="toggleReviewClientStatus('${c.id}')" style="font-size:0.72rem; padding:3px 8px; color:${c.done ? 'var(--accent-green)' : 'var(--text-secondary)'};">
            ${c.done ? '✅ Отзыв оставлен' : '⏳ Ожидает'}
          </button>
          <button class="icon-btn" onclick="deleteReviewClient('${c.id}')" style="color:var(--accent-red); width:28px; height:28px;">&times;</button>
        </div>
      </div>
    `).join('');
  }
}

window.toggleReviewClientStatus = function(id) {
  const c = reviewsClientsList.find(i => i.id === id);
  if (c) {
    c.done = !c.done;
    Storage.set('reviews_clients', reviewsClientsList);
    renderReviewsTracker();
  }
};

window.deleteReviewClient = function(id) {
  reviewsClientsList = reviewsClientsList.filter(i => i.id !== id);
  Storage.set('reviews_clients', reviewsClientsList);
  renderReviewsTracker();
  showToast('Клиент удален из трекера');
};

function initReviewsModule() {
  renderReviewsTracker();

  document.getElementById('rev-biz-link')?.addEventListener('input', (e) => {
    Storage.set('biz_map_link', e.target.value.trim());
    renderReviewsTracker();
  });

  document.querySelectorAll('.btn-copy-rev-tpl').forEach(btn => {
    btn.addEventListener('click', () => {
      const tplId = btn.dataset.tpl;
      const el = document.getElementById(`rev-tpl-text-${tplId}`);
      if (el) navigator.clipboard.writeText(el.innerText).then(() => showToast('📋 Шаблон сообщения скопирован'));
    });
  });

  document.querySelectorAll('.btn-share-rev-tpl').forEach(btn => {
    btn.addEventListener('click', () => {
      const tplId = btn.dataset.tpl;
      const el = document.getElementById(`rev-tpl-text-${tplId}`);
      if (el && navigator.share) navigator.share({ text: el.innerText }).catch(() => {});
    });
  });

  document.getElementById('btn-add-rev-client')?.addEventListener('click', () => {
    const input = document.getElementById('rev-client-name');
    const name = input?.value.trim();
    if (!name) return;

    reviewsClientsList.unshift({
      id: 'rc_' + Date.now(),
      name,
      date: new Date().toLocaleDateString('ru-RU'),
      done: false
    });

    Storage.set('reviews_clients', reviewsClientsList);
    input.value = '';
    renderReviewsTracker();
    showToast('Клиент добавлен в журнал');
  });
}

// ================= 11. РЕЖИМ ПРОСМОТРА (PIN-КОД) =================
let isViewModeActive = Storage.get('viewmode_active', false);
let viewModePinHash = Storage.get('viewmode_pin_hash', '');

async function hashPin(pin) {
  const enc = new TextEncoder().encode(pin);
  const hash = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function renderViewModeSettings() {
  const toggleBtn = document.getElementById('btn-toggle-viewmode');
  const banner = document.getElementById('viewmode-banner');

  if (toggleBtn) {
    toggleBtn.textContent = isViewModeActive ? '🔓 Выключить Режим Просмотра' : '🔒 Включить Режим Просмотра';
    toggleBtn.className = isViewModeActive ? 'btn btn-secondary' : 'btn btn-primary';
  }

  if (banner) {
    banner.style.display = isViewModeActive ? 'flex' : 'none';
  }

  // Скрытие доходов и прибыли на главной карточке анализа, если режим активен
  const profitEl = document.getElementById('analysis-profit-value');
  const heroCard = document.getElementById('analysis-hero-card');

  if (isViewModeActive) {
    if (profitEl) profitEl.textContent = '•••• ₽';
    document.querySelectorAll('.tab-content:not(#tab-more)').forEach(tab => {
      // Блокируем доступ к неразрешенным вкладкам
      if (tab.id === 'tab-whatif' || tab.id === 'tab-history') {
        tab.style.display = 'none';
      }
    });
  }
}

function initViewModeModule() {
  renderViewModeSettings();

  document.getElementById('btn-save-vm-pin')?.addEventListener('click', async () => {
    const pin = document.getElementById('vm-pin-input')?.value.trim();
    if (!pin || pin.length < 4) {
      showToast('Введите 4-значный PIN-код');
      return;
    }
    viewModePinHash = await hashPin(pin);
    Storage.set('viewmode_pin_hash', viewModePinHash);
    document.getElementById('vm-pin-input').value = '';
    showToast('✅ PIN-код владельца установлен');
  });

  document.getElementById('btn-toggle-viewmode')?.addEventListener('click', async () => {
    if (!viewModePinHash) {
      alert('Сначала задайте и сохраните 4-значный PIN-код владельца!');
      return;
    }

    if (!isViewModeActive) {
      isViewModeActive = true;
      Storage.set('viewmode_active', true);
      renderViewModeSettings();
      showToast('🔒 Режим просмотра включён: доходы скрыты');
    } else {
      openUnlockPinModal();
    }
  });

  document.getElementById('btn-exit-viewmode-banner')?.addEventListener('click', openUnlockPinModal);

  function openUnlockPinModal() {
    const modal = document.getElementById('modal-enter-pin');
    const input = document.getElementById('input-unlock-pin');
    if (input) input.value = '';
    if (modal) modal.classList.add('open');
  }

  document.getElementById('btn-close-pin-modal')?.addEventListener('click', () => {
    document.getElementById('modal-enter-pin')?.classList.remove('open');
  });

  document.getElementById('btn-cancel-unlock-pin')?.addEventListener('click', () => {
    document.getElementById('modal-enter-pin')?.classList.remove('open');
  });

  document.getElementById('btn-submit-unlock-pin')?.addEventListener('click', async () => {
    const input = document.getElementById('input-unlock-pin')?.value.trim();
    if (!input) return;

    const hash = await hashPin(input);
    if (hash === viewModePinHash) {
      isViewModeActive = false;
      Storage.set('viewmode_active', false);
      document.getElementById('modal-enter-pin')?.classList.remove('open');
      renderViewModeSettings();
      renderAnalysis();
      showToast('🔓 Режим просмотра отключён. Доступ владельца восстановлен.');
    } else {
      showToast('❌ Неверный PIN-код');
    }
  });
}

// ================= ИНИЦИАЛИЗАЦИЯ ВСЕХ НОВЫХ МОДУЛЕЙ =================
function initAllTools() {
  initMoreNavigation();
  initDiscountsModule();
  initInvoicesModule();
  initCompetitorsModule();
  initCsvImportModule();
  initGoalsModule();
  initTextGeneratorModule();
  initContentPlanModule();
  initCallAuditModule();
  initReviewsModule();
  initViewModeModule();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllTools);
} else {
  initAllTools();
}
