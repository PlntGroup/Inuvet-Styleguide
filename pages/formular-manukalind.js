/* ManukaLind product feedback form. Delivery is not wired; IT implements sending. */
(function () {
  var form = document.getElementById('manukaForm');
  var signatureDate = document.getElementById('signature-date');

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

  function showSuccess() {
    var template = document.getElementById('form-success-template');
    var success = template.content.querySelector('.success-state').cloneNode(true);
    form.hidden = true;
    form.insertAdjacentElement('afterend', success);
    success.scrollIntoView({ block: 'start' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    showSuccess();
  });
})();
