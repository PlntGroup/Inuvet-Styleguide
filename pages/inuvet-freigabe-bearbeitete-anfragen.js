/* ════════════════════════════════════════════
   Inuvet-Freigabe-Bearbeitete-Anfragen — Historie · inuvet.com
   Freigegeben und nicht freigegeben in einer Tabelle.
   Filter blendet die Status ein und aus. Eingelöst? = Ja, wenn der Tierhalter gekauft hat.
   Daten: inuvet-freigabe-mock.js
   ════════════════════════════════════════════ */

const processedFilter = { approved: true, declined: true };
const processedSortState = { key: 'date', dir: 'desc' };
const PROCESSED_SORT_GETTERS = {
  customerName: row => row.customerName,
  date: row => row.date,
  status: row => (row.status === 'approved' ? 'freigegeben' : 'nicht freigegeben'),
  productLabel: row => row.productLabel,
  commission: row => (row.purchased ? row.commission : 0),
};

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function setProcessedFilter(key, checked) {
  if (key !== 'approved' && key !== 'declined') return;
  processedFilter[key] = checked;
  renderProcessedRequests();
}

function processedStatusCellHtml(status) {
  if (status === 'approved') {
    return `<td data-label="Status"><div class="badge --pill"><span class="material-icons" aria-hidden="true">check</span>freigegeben</div></td>`;
  }
  return `<td data-label="Status"><div class="badge --pill --error">nicht freigegeben</div></td>`;
}

function processedPurchasedCellHtml(row) {
  if (row.status !== 'approved') {
    return `<td data-label="Eingelöst?"><span class="data-table-stack__meta">—</span></td>`;
  }
  if (row.purchased) {
    return `<td data-label="Eingelöst?"><div class="badge --pill">Ja</div></td>`;
  }
  return `<td data-label="Eingelöst?"><div class="badge --pill --muted">Nein</div></td>`;
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
      ${processedStatusCellHtml(row.status)}
      ${empfehlungProductCellHtml(row.cartName, row.variantLabel, row.qty, row.unlimited)}
      ${empfehlungCustomerNoteCellHtml(row.customerNote)}
      ${empfehlungVetNoteCellHtml(row.vetNote)}
      ${processedPurchasedCellHtml(row)}
      <td class="data-table-commission" data-label="Provision">${row.purchased ? formatPrice(row.commission) : '—'}</td>
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
