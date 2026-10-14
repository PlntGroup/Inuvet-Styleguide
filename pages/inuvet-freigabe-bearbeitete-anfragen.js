/* ════════════════════════════════════════════
   Inuvet-Freigabe-Bearbeitete-Anfragen — Historie · inuvet.com
   Filter blendet freigegebene und abgelehnte Zeilen ein und aus.
   Spalte freigegeben = Menge der Freigabe als grüne Pill, sonst „nein“.
   Spalte eingelöst = gekaufte Menge als grüne Pill, sonst „nein“.
   Steht in freigegeben „nein“, bleibt eingelöst leer.
   Daten: inuvet-freigabe-mock.js
   ════════════════════════════════════════════ */

const processedFilter = { approved: true, declined: true };
const processedSortState = { key: 'date', dir: 'desc' };
const PROCESSED_SORT_GETTERS = {
  customerName: row => row.customerName,
  date: row => row.date,
  approvedQty: row => (row.status === 'approved' ? (row.unlimited ? Infinity : Number(row.qty) || 0) : 0),
  productLabel: row => row.productLabel,
};

function setProcessedFilter(key, checked) {
  if (key !== 'approved' && key !== 'declined') return;
  processedFilter[key] = checked;
  renderProcessedRequests();
}

function processedQtyText(row) {
  if (row.unlimited) return 'unbegrenzt';
  const qty = Number(row.qty);
  if (!Number.isFinite(qty) || qty <= 0) return '';
  return `${qty}×`;
}

function processedNeinCellHtml(label) {
  return `<td data-label="${label}"><div class="badge --pill --muted">nein</div></td>`;
}

function processedQtyCellHtml(row, label) {
  const text = processedQtyText(row);
  if (!text) return processedNeinCellHtml(label);
  return `<td data-label="${label}"><div class="badge --pill">${empfehlungEscapeHtml(text)}</div></td>`;
}

function processedReleasedCellHtml(row) {
  if (row.status !== 'approved') return processedNeinCellHtml('freigegeben');
  return processedQtyCellHtml(row, 'freigegeben');
}

function processedPurchasedCellHtml(row) {
  if (row.status !== 'approved') return `<td data-label="eingelöst"></td>`;
  if (!row.purchased) return processedNeinCellHtml('eingelöst');
  return processedQtyCellHtml(row, 'eingelöst');
}

function renderProcessedRequests() {
  const all = empfehlungFlattenProcessedRows();
  const rows = all.filter(row => (
    row.status === 'approved' ? processedFilter.approved : processedFilter.declined
  ));
  const sorted = empfehlungSortRows(rows, processedSortState, PROCESSED_SORT_GETTERS);

  const tbody = document.getElementById('processedBody');
  const countEl = document.getElementById('processedCount');
  const tableWrap = document.getElementById('processedTableWrap');
  const emptyEl = document.getElementById('processedEmpty');
  const emptyTitle = document.getElementById('processedEmptyTitle');
  if (!tbody) return;

  const count = rows.length;
  if (countEl) {
    countEl.textContent = String(count);
    countEl.setAttribute('aria-label', `${count} bearbeitete Anfragen`);
  }

  if (tableWrap) tableWrap.hidden = count === 0;
  if (emptyEl) emptyEl.hidden = count !== 0;
  if (emptyTitle) {
    emptyTitle.textContent = all.length === 0
      ? 'Noch keine bearbeiteten Anfragen'
      : 'Keine Anfragen für diesen Filter';
  }

  empfehlungSyncSortUi(
    tableWrap?.querySelector('table'),
    document.getElementById('processedSort'),
    processedSortState
  );

  tbody.innerHTML = sorted.map(row => `
    <tr data-id="${row.id}" data-status="${row.status}">
      ${empfehlungCustomerNameCellHtml(row.customerName)}
      <td class="data-table-date" data-label="Datum">${empfehlungFormatDateDE(row.date)}</td>
      ${processedReleasedCellHtml(row)}
      ${empfehlungProductCellHtml(row.cartName, row.variantLabel, null, false)}
      ${empfehlungCustomerNoteCellHtml(row.customerNote)}
      ${empfehlungVetNoteCellHtml(row.vetNote)}
      ${processedPurchasedCellHtml(row)}
    </tr>
  `).join('');
}

function initProcessedPage() {
  empfehlungInitTableSort({
    table: document.querySelector('#processedTableWrap table'),
    select: document.getElementById('processedSort'),
    sortState: processedSortState,
    onSort: renderProcessedRequests,
  });
  renderProcessedRequests();
  empfehlungSyncOpenRequestNavBadges();
}

document.addEventListener('DOMContentLoaded', initProcessedPage);
window.addEventListener('pageshow', () => {
  renderProcessedRequests();
  empfehlungSyncOpenRequestNavBadges();
});
