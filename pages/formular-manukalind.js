/* ManukaLind product feedback form. Recipient is temporary until IT replaces it. */
(function () {
  var ENDPOINT = 'https://formsubmit.co/ajax/micha@plnt.group';
  var form = document.getElementById('manukaForm');
  var errorBox = document.getElementById('form-error');
  var submitBtn = form.querySelector('[type="submit"]');
  var signatureDate = document.getElementById('signature-date');
  var defaultError = errorBox.textContent;

  if (signatureDate && !signatureDate.value) {
    signatureDate.value = new Date().toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function renderFiles(zone, files) {
    var list = zone.querySelector('.form-upload__files');
    list.innerHTML = '';
    Array.prototype.forEach.call(files, function (file) {
      var item = document.createElement('div');
      item.className = 'form-upload__file';
      item.innerHTML =
        '<svg class="material-icons" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><use href="#ui-image"></use></svg>' +
        '<span class="form-upload__file__name">' + escapeHtml(file.name) + '</span>' +
        '<span class="form-upload__file__size">' + (file.size / 1024 / 1024).toFixed(1) + ' MB</span>';
      list.appendChild(item);
    });
  }

  Array.prototype.forEach.call(form.querySelectorAll('.form-upload'), function (zone) {
    var input = zone.querySelector('input[type="file"]');

    input.addEventListener('change', function () {
      renderFiles(zone, input.files);
    });

    zone.addEventListener('dragover', function (event) {
      event.preventDefault();
      zone.classList.add('--dragover');
    });

    zone.addEventListener('dragleave', function () {
      zone.classList.remove('--dragover');
    });

    zone.addEventListener('drop', function (event) {
      event.preventDefault();
      zone.classList.remove('--dragover');
      input.files = event.dataTransfer.files;
      renderFiles(zone, input.files);
    });
  });

  function text(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : '';
  }

  function checked(name) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + name + '"]:checked'),
      function (el) { return el.value; }
    );
  }

  function one(name) {
    return checked(name)[0] || '';
  }

  function species() {
    var selected = one('species');
    var other = text('species-other');
    if (selected === 'Other') return other ? 'Other: ' + other : 'Other';
    return selected;
  }

  function conditions() {
    var values = checked('initial_condition').filter(function (value) {
      return value !== 'Other';
    });
    if (checked('initial_condition').indexOf('Other') !== -1) {
      var other = text('condition-other');
      values.push(other ? 'Other: ' + other : 'Other');
    }
    return values.join(', ');
  }

  function field(data, label, value) {
    data.append(label, value || '—');
  }

  function files(data, label, id) {
    var input = document.getElementById(id);
    if (!input || !input.files.length) {
      data.append(label, '—');
      return;
    }
    Array.prototype.forEach.call(input.files, function (file) {
      data.append(label, file, file.name);
    });
  }

  function showSuccess() {
    var template = document.getElementById('form-success-template');
    var success = template.content.querySelector('.success-state').cloneNode(true);
    form.hidden = true;
    form.insertAdjacentElement('afterend', success);
    success.scrollIntoView({ block: 'start' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.textContent = defaultError;
    errorBox.hidden = true;

    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) {
      showSuccess();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var clinic = text('clinic-name');
    var data = new FormData();
    data.append('_subject', 'ManukaLind Product Feedback — ' + clinic);
    data.append('_template', 'table');
    data.append('_captcha', 'false');
    field(data, 'Clinic name', clinic);
    field(data, 'Veterinarian name', text('veterinarian-name'));
    field(data, 'Country', text('country'));
    field(data, 'Date of evaluation', text('evaluation-date'));
    field(data, 'Species', species());
    field(data, 'Breed', text('breed'));
    field(data, 'Age', text('age'));
    field(data, 'Sex', checked('sex').join(', '));
    field(data, 'Body weight', text('weight'));
    field(data, 'Case / patient reference no.', text('case-ref'));
    field(data, 'Type of wound / skin condition', text('wound-type'));
    field(data, 'Location', text('wound-location'));
    field(data, 'Cause / origin', text('wound-cause'));
    field(data, 'Duration before treatment', text('wound-duration'));
    field(data, 'Initial condition', conditions());
    field(data, 'Initial clinical observations', checked('initial_sign').join(', '));
    field(data, 'Other initial observations', text('init-other'));
    field(data, 'Product', checked('product').join(', '));
    field(data, 'Application frequency', text('frequency'));
    field(data, 'Amount applied / number of sprays', text('amount'));
    field(data, 'Wound cleaned before application', one('cleaned'));
    field(data, 'Dressing used', one('dressing'));
    field(data, 'Other products / treatments', text('other-products'));
    field(data, 'Duration of treatment', text('treatment-duration'));
    field(data, 'Redness during treatment', one('obs_redness'));
    field(data, 'Swelling during treatment', one('obs_swelling'));
    field(data, 'Discharge / exudate during treatment', one('obs_discharge'));
    field(data, 'Odor during treatment', one('obs_odor'));
    field(data, 'Wound appearance during treatment', one('obs_appearance'));
    field(data, 'Tissue condition during treatment', one('obs_tissue'));
    field(data, 'Pain / discomfort during treatment', one('obs_pain'));
    field(data, 'Overall observed effect', one('overall_effect'));
    field(data, 'Time until first noticeable improvement', text('time-to-improvement'));
    field(data, 'Additional observations', text('overall-notes'));
    field(data, 'Well tolerated', one('tolerated'));
    field(data, 'Irritation or unwanted reaction', one('irritation'));
    field(data, 'Discomfort after application', one('discomfort'));
    field(data, 'Reaction description', text('reaction-notes'));
    field(data, 'Overall experience', one('experience'));
    field(data, 'Would use again', one('use_again'));
    field(data, 'Would recommend', one('recommend'));
    field(data, 'Liked most', text('liked'));
    field(data, 'Could be improved', text('improve'));
    field(data, 'Additional comments', text('comments'));
    files(data, 'Photos before treatment', 'photos-before');
    files(data, 'Photos during treatment', 'photos-during');
    files(data, 'Photos after treatment', 'photos-after');
    field(data, 'Consent for case use', one('consent'));
    field(data, 'Signing veterinarian', text('signature-name'));
    field(data, 'Signature', text('signature'));
    field(data, 'Signature date', text('signature-date'));

    submitBtn.disabled = true;
    submitBtn.classList.add('--loading');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    }).then(function (response) {
      return response.json().then(function (body) {
        var message = body && body.message ? body.message : '';
        if (!response.ok || String(body.success) !== 'true') {
          if (/activation/i.test(message)) {
            errorBox.textContent = 'This form still needs a one-time email confirmation. Please try again after that confirmation.';
          }
          throw new Error(message || 'Request failed');
        }
        showSuccess();
      });
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.classList.remove('--loading');
      errorBox.hidden = false;
    });
  });
})();
