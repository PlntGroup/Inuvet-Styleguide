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
    amounts: store.get('provAmounts', 'example'),
    ibanPending: store.get('provIbanPending', '0') === '1',
  };
  const save = () => {
    store.set('provCountry', ctx.country);
    store.set('provIban', ctx.iban ? '1' : '0');
    store.set('provVat', ctx.vat ? '1' : '0');
    store.set('provPayout', ctx.payout);
    store.set('provAmounts', ctx.amounts);
    store.set('provIbanPending', ctx.ibanPending ? '1' : '0');
  };
  const toast = msg => { if (typeof showToast === 'function') showToast(msg); };
  /* .summary-line (display:flex) überstimmt [hidden]; im Theme lässt Liquid leere Zeilen weg */
  const show = (el, on) => { if (!el) return; el.hidden = !on; el.style.display = on ? '' : 'none'; };

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
    const missing = [];
    if (!ctx.iban && !ctx.ibanPending) missing.push('IBAN');
    if (!ctx.vat) missing.push('USt-IdNr.');
    const ibanWaiting = !ctx.iban && ctx.ibanPending;
    const bankBlocked = ctx.country === 'DE' && payout === 'bank' && (missing.length > 0 || ibanWaiting);
    const hint = $('[data-pending-hint]');
    if (hint) {
      const date = '<strong>01.01.2027</strong>';
      if (ctx.country === 'ES') hint.innerHTML = 'kannst du dir per Rechnung auszahlen lassen';
      else if (bankBlocked && missing.length) hint.textContent = 'wird ausgezahlt, sobald ' + missing.join(' und ') + ' hinterlegt ' + (missing.length > 1 ? 'sind' : 'ist');
      else if (bankBlocked) hint.textContent = 'wird ausgezahlt, sobald du deine IBAN per E-Mail bestätigt hast';
      else hint.innerHTML = payout === 'bank' ? 'wird am ' + date + ' ausgezahlt' : 'wird am ' + date + ' deinem Guthaben gutgeschrieben';
    }
    /* Beträge: Nullzeilen und leeres Guthaben entfallen (wie live) */
    const values = ctx.amounts === 'new'
      ? { pending: 37.6, paid: 0, spent: 0, credit: 0 }
      : { pending: 184.2, paid: 412.5, spent: 96.8, credit: 58.4 };
    const fmt = n => n.toFixed(2).replace('.', ',') + '\u00a0€';
    Object.keys(values).forEach(key => {
      $$('[data-amount="' + key + '"]').forEach(el => { el.textContent = fmt(values[key]); });
    });
    ['paid', 'spent'].forEach(key => show($('[data-row="' + key + '"]'), values[key] > 0));
    /* Kachel „Jetzt verfügbar“: DE/FR = Guthaben für Gratisprodukte · ES = verfügbare Provision (wie live) */
    const isES = ctx.country === 'ES';
    const tileValue = isES ? values.pending : values.credit;
    const credit = $('[data-credit-block]');
    if (credit) credit.hidden = tileValue <= 0;
    const tileAmount = $('[data-tile-amount]');
    if (tileAmount) tileAmount.textContent = fmt(tileValue);
    const tileTitle = $('[data-tile-title]');
    if (tileTitle) tileTitle.textContent = isES ? 'Provision' : 'Guthaben für Gratisprodukte';
    const tileText = $('[data-tile-text]');
    if (tileText) tileText.textContent = isES
      ? 'Lass sie dir per Rechnung auszahlen oder als Naturalrabatt in Form von Produkten geben.'
      : 'Löse das Guthaben im Warenkorb ein: Nach „Jetzt sicher zur Kasse“ wählst du deine Gratisprodukte aus, bevor es zum Check-out geht.';
    show($('[data-row="pending"]'), !isES);
    show($('[data-row="credit-row"]'), isES && values.credit > 0);
    const notice = $('[data-missing-notice]');
    if (notice) {
      notice.hidden = !bankBlocked;
      const noticeText = notice.querySelector('p');
      if (missing.length) {
        noticeText.innerHTML = 'Deine Provision sammelt sich an, wird aber erst ausgezahlt, wenn <span data-missing-text></span> hinterlegt <span data-missing-verb></span>.';
        $('[data-missing-text]').textContent = missing.join(' und ');
        $('[data-missing-verb]').textContent = missing.length > 1 ? 'sind' : 'ist';
      } else {
        noticeText.textContent = 'Bitte bestätige deine IBAN über den Link in der E-Mail. Erst dann können wir deine Provision überweisen.';
      }
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
    const needIban = toBank && !ctx.iban && !ctx.ibanPending;
    const needVat = toBank && !ctx.vat;
    $('[data-modal-iban-field]').hidden = !needIban;
    $('[data-modal-iban-hint]').hidden = !needIban;
    $('[data-modal-vat-field]').hidden = !needVat;
    ['[data-modal-iban-error]', '[data-modal-vat-error]'].forEach(sel => { $(sel).hidden = true; });
    $$('[data-modal-iban-field], [data-modal-vat-field]').forEach(f => f.classList.remove('--error'));
    $('#payoutIban').value = '';
    $('#payoutVat').value = '';
    if (toBank && (needIban || needVat)) {
      $('#payoutModalBody').textContent = 'Wir überweisen deine Provision quartalsweise gesammelt auf dein Konto. Dafür brauchen wir noch '
        + [needIban ? 'deine IBAN' : '', needVat ? 'deine USt-IdNr.' : ''].filter(Boolean).join(' und ').replace(/\.?$/, '.');
    }
    openModal('payout');
    (needIban ? $('#payoutIban') : (needVat ? $('#payoutVat') : null))?.focus();
  }));
  $('[data-confirm-payout]')?.addEventListener('click', e => {
    const target = e.currentTarget.dataset.target;
    let ibanNew = false;
    if (target === 'bank') {
      const ibanField = $('[data-modal-iban-field]');
      const vatField = $('[data-modal-vat-field]');
      let ok = true;
      if (!ibanField.hidden) {
        const v = $('#payoutIban').value.replace(/\s+/g, '').toUpperCase();
        const valid = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v);
        ibanField.classList.toggle('--error', !valid);
        $('[data-modal-iban-error]').hidden = valid;
        ok = ok && valid;
        ibanNew = valid;
      }
      if (!vatField.hidden) {
        const v = $('#payoutVat').value.replace(/\s+/g, '').toUpperCase();
        const valid = /^[A-Z]{2}[A-Z0-9]{2,13}$/.test(v);
        vatField.classList.toggle('--error', !valid);
        $('[data-modal-vat-error]').hidden = valid;
        ok = ok && valid;
      }
      if (!ok) return;
      if (!vatField.hidden) ctx.vat = true;
      if (ibanNew) ctx.ibanPending = true;
    }
    ctx.payout = target;
    save();
    closeModals();
    renderOverview();
    if (typeof syncIbanState === 'function') syncIbanState();
    toast(ibanNew
      ? 'Auszahlungsart gespeichert. Bitte bestätige deine IBAN über den Link in der E-Mail.'
      : 'Deine Auszahlungsart wurde gespeichert.');
  });
  $('[data-open-invoice]')?.addEventListener('click', () => openModal('invoice'));
  $('[data-confirm-invoice]')?.addEventListener('click', closeModals);
  $('[data-open-discount]')?.addEventListener('click', () => openModal('discount'));

  /* ── Bank- & Steuerdaten ── */
  function renderBank() {
    const section = $('[data-iban-section]');
    if (!section) return;
    section.hidden = !(ctx.country === 'DE' || ctx.country === 'ES');
    const status = $('[data-iban-status]');
    status.hidden = !(ctx.iban || ctx.ibanPending);
    $('[data-iban-status-text]').textContent = ctx.iban
      ? 'Eine IBAN ist hinterlegt.'
      : 'Deine IBAN wartet auf die Bestätigung über den Link in der E-Mail.';
    if (typeof setUiIcon === 'function') setUiIcon(status.querySelector('.material-icons'), ctx.iban ? 'check_circle' : 'mark_email_read');
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
    ctx.ibanPending = true;
    save();
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
    ctx.ibanPending = false;
    save();
    renderConfirm('done');
  });

  /* ── Mockup-Kontext ── */
  const country = $('#ctxCountry');
  if (country) {
    country.value = ctx.country;
    country.addEventListener('change', () => { ctx.country = country.value; save(); renderOverview(); renderBank(); });
  }
  /* IBAN-Zustand: hinterlegt · wartet auf E-Mail-Bestätigung (eingetragen, Link noch nicht geklickt) · fehlt */
  const ibanState = $('#ctxIbanState');
  if (ibanState) {
    ibanState.value = ctx.iban ? 'ok' : (ctx.ibanPending ? 'pending' : 'none');
    ibanState.addEventListener('change', () => {
      ctx.iban = ibanState.value === 'ok';
      ctx.ibanPending = ibanState.value === 'pending';
      save(); renderOverview(); renderBank();
    });
  }
  const syncIbanState = () => { if (ibanState) ibanState.value = ctx.iban ? 'ok' : (ctx.ibanPending ? 'pending' : 'none'); };
  const vat = $('#ctxVat');
  if (vat) {
    vat.checked = ctx.vat;
    vat.addEventListener('change', () => { ctx.vat = vat.checked; save(); renderOverview(); renderBank(); });
  }
  const amounts = $('#ctxAmounts');
  if (amounts) {
    amounts.value = ctx.amounts;
    amounts.addEventListener('change', () => { ctx.amounts = amounts.value; save(); renderOverview(); });
  }
  const link = $('#ctxLink');
  if (link) link.addEventListener('change', () => renderConfirm(link.value));

  renderOverview();
  renderBank();
  renderConfirm('valid');
})();
