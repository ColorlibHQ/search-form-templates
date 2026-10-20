/*!
 * colorlib-search-17 - Colorlib. No jQuery, no framework.
 * Behaviours: native-date, room-selector, bootstrap-data-api, select-font-settle
 */
(function () {
  'use strict';

  /* Date fields labelled only by their placeholder: text until focused. */
  document.querySelectorAll('input[data-date]').forEach(function (d) {
    d.addEventListener('focus', function () {
      if (d.type === 'date') return;
      d.type = 'date';
      try { d.showPicker(); } catch (e) {}
    });
    d.addEventListener('blur', function () { if (!d.value) d.type = 'text'; });
  });
  /* A check-out date can never be earlier than its check-in. */
  [['input-start', 'input-end'], ['input-start-2', 'input-end-2']].forEach(function (pair) {
    var a = document.getElementById(pair[0]), b = document.getElementById(pair[1]);
    if (!a || !b) return;
    a.addEventListener('change', function () {
      b.min = a.value;
      if (b.value && b.value < a.value) b.value = a.value;
    });
  });

  /* Guests and rooms picker. */
  var special = document.getElementById('js-select-special');
  if (special) {
    var box = special.parentElement.querySelector('.dropdown-select');
    var list = box && box.querySelector('.list-room');
    var info = special.querySelector('#info');
    var addBtn = document.getElementById('btn-add-room');
    var rooms = list ? list.querySelectorAll('.list-room__item').length || 1 : 1;
    special.addEventListener('click', function (e) {
      e.stopPropagation();
      special.classList.toggle('open');
      if (box) box.classList.toggle('cl-show');
    });
    if (box) box.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () {
      special.classList.remove('open');
      if (box) box.classList.remove('cl-show');
    });
    function sum(sel) {
      var t = 0;
      list.querySelectorAll('.list-room__item ' + sel + ' > input').forEach(function (i) { t += parseInt(i.value, 10) || 0; });
      return t;
    }
    function update() {
      if (!info || !list) return;
      var a = sum('.quantity1'), ch = sum('.quantity2');
      info.value = a + ' ' + (a > 1 ? 'Adults, ' : 'Adult, ') + ch + ' Children, ' + rooms + ' ' + (rooms > 1 ? 'Rooms' : 'Room');
    }
    if (list) {
      list.addEventListener('click', function (e) {
        var b = e.target.closest('.plus, .minus');
        if (!b) return;
        var input = b.parentElement.querySelector('input[type=number]');
        if (!input) return;
        var v = parseInt(input.value, 10) || 0, min = Number(input.min || 0);
        input.value = b.classList.contains('plus') ? v + 1 : Math.max(min, v - 1);
        update();
      });
      list.addEventListener('change', function (e) {
        if (!e.target.classList.contains('inputQty')) return;
        var v = parseInt(e.target.value, 10);
        e.target.value = isNaN(v) || v < 0 ? 0 : v;
        update();
      });
    }
    if (addBtn && list) addBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var first = list.querySelector('.list-room__item');
      if (!first) return;
      rooms++;
      var room = first.cloneNode(true);
      var name = room.querySelector('.list-room__name');
      if (name) name.textContent = ' Room ' + rooms;
      room.querySelectorAll('input[type=number]').forEach(function (i) { i.value = i.min || 0; });
      list.appendChild(room);
      update();
    });
  }

  var SHOWN = 'in';
  /* Tabs: the pane and the link carry .active -- or the link's <li>, where the
     markup put it there (Bootstrap 3). */
  document.querySelectorAll('[data-toggle="tab"], [data-toggle="pill"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var pane = document.querySelector(a.getAttribute('data-target') || a.getAttribute('href'));
      var nav = a.closest('ul, ol, .nav');
      if (!pane || !nav) return;
      var onLi = !!nav.querySelector('li.cl-active');
      nav.querySelectorAll('[data-toggle="tab"], [data-toggle="pill"]').forEach(function (o) {
        var on = o === a;
        (onLi && o.parentElement.tagName === 'LI' ? o.parentElement : o).classList.toggle('cl-active', on);
        o.setAttribute('aria-selected', String(on));
      });
      [].slice.call(pane.parentElement.children).forEach(function (p) {
        if (!p.classList.contains('cl-tab-pane')) return;
        var on = p === pane;
        p.classList.toggle('cl-active', on);
        if (p.classList.contains('cl-fade')) {
          if (on) { p.offsetHeight; p.classList.add(SHOWN); } else p.classList.remove(SHOWN);
        }
      });
    });
  });

  /* Re-measure selects once web fonts are in (Chrome sizes them on the fallback). */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    document.querySelectorAll('select').forEach(function (s) {
      var d = s.style.display;
      s.style.display = 'none';
      s.offsetHeight;
      s.style.display = d;
    });
  });
})();
