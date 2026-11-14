/* ════════════════════════════════════════════
   Inuvet-Provision-* — Mockups Meine Provisionen · Bank- & Steuerdaten · IBAN bestätigen
   Nur System-Komponenten (summary-line, choice-box --detail, notice, modal, success-state).
   Mockup-Kontext (FAB) simuliert Land (DE/ES/FR) und hinterlegte Daten.
   Theme: Daten aus Kunden-Metafeldern, Aktionen an sholesfap-Webhooks (siehe Kommentare im HTML).
   ════════════════════════════════════════════ */
(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const store = {
    get(key, fallback) { try { const v = sessionStorage.getItem(key); return v == null ? fallback : v; } catch (_) { return fallback; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch (_) { /* privat */ } },
  };
  const ctx = {
    country: store.get('provCountry', 'DE'),
    iban: store.get('provIban', '1') === '1',
    vat: store.get('provVat', '0') === '1',
    payout: store.get('provPayout', 'bank'),
  };
  const save = () => {
    store.set('provCountry', ctx.country);
    store.set('provIban', ctx.iban ? '1' : '0');
    store.set('provVat', ctx.vat ? '1' : '0');
    store.set('provPayout', ctx.payout);
  };
  const toast = msg => { if (typeof showToast === 'function') showToast(msg); };

  function openModal(name) {
    $(`[data-modal="${name}"]`)?.classList.add('--open');
    document.body.style.overflow = 'hidden';
  }
  function closeModals() {
    $$('.modal-overlay.--open').forEach(m => m.classList.remove('--open'));
    document.body.style.overflow = '';
  }
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModals));
  $$('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) closeModals(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

  /* ── Meine Provisionen ── */
  function renderOverview() {
    if (!$('[data-country-block]')) return;
    $$('[data-country-block]').forEach(b => { b.hidden = b.dataset.countryBlock !== ctx.country; });
    const payout = ctx.country === 'ES' ? 'bank' : (ctx.country === 'FR' ? 'discount' : ctx.payout);
    $$('[data-payout]').forEach(btn => {
      const on = btn.dataset.payout === payout;
      btn.classList.toggle('--active', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    const label = $('[data-pending-label]');
    if (label) label.textContent = ctx.country === 'ES' ? 'Verfügbare Provision' : 'Bevorstehende Provision';
    const hint = $('[data-pending-hint]');
    if (hint) {
      const date = '<strong data-payout-date>01.01.2027</strong>';
      hint.innerHTML = ctx.country === 'ES'
        ? 'kannst du dir per Rechnung auszahlen lassen'
        : (payout === 'bank' ? `wird am ${date} ausgezahlt` : `wird am ${date} deinem Guthaben gutgeschrieben`);
    }
    const missing = [];
    if (!ctx.iban) missing.push('IBAN');
    if (!ctx.vat) missing.push('USt-IdNr.');
    const notice = $('[data-missing-notice]');
    if (notice) {
      notice.hidden = !(ctx.country === 'DE' && payout === 'bank' && missing.length);
      $('[data-missing-text]').textContent = missing.join(' und ');
      $('[data-missing-verb]').textContent = missing.length > 1 ? 'sind' : 'ist';
    }
  }
  $$('[data-payout]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.payout === ctx.payout) return;
    const toBank = btn.dataset.payout === 'bank';
    $('#payoutModalTitle').textContent = toBank ? 'Zu Banküberweisung wechseln?' : 'Zu Gratisprodukten wechseln?';
    $('#payoutModalBody').textContent = toBank
      ? 'Wir überweisen deine Provision quartalsweise gesammelt auf dein Konto. Dafür brauchen wir IBAN und USt-IdNr.'
      : 'Wir schreiben dir deine Provision quartalsweise als Guthaben für Gratisprodukte bei inuvet.com gut.';
    $('[data-confirm-payout]').dataset.target = btn.dataset.payout;
    openModal('payout');
  }));
  $('[data-confirm-payout]')?.addEventListener('click', e => {
    ctx.payout = e.currentTarget.dataset.target;
    save();
    closeModals();
    renderOverview();
    toast('Deine Auszahlungsart wurde gespeichert.');
  });
  $('[data-open-invoice]')?.addEventListener('click', () => openModal('invoice'));
  $('[data-confirm-invoice]')?.addEventListener('click', closeModals);

  /* ── Bank- & Steuerdaten ── */
  function renderBank() {
    const section = $('[data-iban-section]');
    if (!section) return;
    section.hidden = !(ctx.country === 'DE' || ctx.country === 'ES');
    $('[data-iban-status]').hidden = !ctx.iban;
    $('[data-iban-lead]').textContent = ctx.iban
      ? 'Du willst das Konto ändern, auf das wir die Provision überweisen? Trage die neue IBAN ein. Du bekommst danach eine E-Mail, um sie zu bestätigen.'
      : 'Damit wir die Provision überweisen können, trage deine IBAN ein. Du bekommst danach eine E-Mail, um sie zu bestätigen.';
    $('[data-iban-submit]').textContent = ctx.iban ? 'IBAN ändern' : 'IBAN festlegen';
    const vat = $('#vatInput');
    if (vat && !vat.dataset.touched) vat.value = ctx.vat ? 'DE123456789' : '';
  }
  $('[data-iban-form]')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#ibanInput');
    const value = input.value.replace(/\s+/g, '').toUpperCase();
    const ok = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(value);
    $('[data-iban-field]').classList.toggle('--error', !ok);
    $('[data-iban-error]').hidden = ok;
    if (!ok) { input.focus(); return; }
    $('[data-iban-form]').hidden = true;
    $('[data-iban-success]').hidden = false;
  });
  $('[data-vat-form]')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#vatInput');
    input.dataset.touched = '1';
    const value = input.value.replace(/\s+/g, '').toUpperCase();
    const ok = /^[A-Z]{2}[A-Z0-9]{2,13}$/.test(value);
    $('[data-vat-field]').classList.toggle('--error', !ok);
    $('[data-vat-error]').hidden = ok;
    if (!ok) { input.focus(); return; }
    input.value = value;
    ctx.vat = true;
    save();
    toast('Deine USt-IdNr. wurde gespeichert.');
  });

  /* ── IBAN bestätigen ── */
  function renderConfirm(state) {
    if (!$('[data-confirm-block]')) return;
    $('[data-confirm-block]').hidden = state !== 'valid';
    $('[data-expired]').hidden = state !== 'expired';
    $('[data-confirm-success]').hidden = state !== 'done';
  }
  $('[data-confirm-iban]')?.addEventListener('click', () => {
    ctx.iban = true;
    save();
    renderConfirm('done');
  });

  /* ── Mockup-Kontext ── */
  const country = $('#ctxCountry');
  if (country) {
    country.value = ctx.country;
    country.addEventListener('change', () => { ctx.country = country.value; save(); renderOverview(); renderBank(); });
  }
  const iban = $('#ctxIban');
  if (iban) {
    iban.checked = ctx.iban;
    iban.addEventListener('change', () => { ctx.iban = iban.checked; save(); renderOverview(); renderBank(); });
  }
  const vat = $('#ctxVat');
  if (vat) {
    vat.checked = ctx.vat;
    vat.addEventListener('change', () => { ctx.vat = vat.checked; save(); renderOverview(); renderBank(); });
  }
  const link = $('#ctxLink');
  if (link) link.addEventListener('change', () => renderConfirm(link.value));

  renderOverview();
  renderBank();
  renderConfirm('valid');
})();
