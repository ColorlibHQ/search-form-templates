/*!
 * colorlib-search-14 - Colorlib. No jQuery, no framework.
 * Behaviours: native-date, number-stepper
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

  var STEPPER_UNITS = [" Guest"," Guests"];
  /* wizard-8's variant: <div class="quantity"><span class="minus"> <input> <span class="plus">. */
  document.querySelectorAll('.quantity').forEach(function (w) {
    if (w.closest('.js-number-input') || w.closest('.list-room')) return;
    var q = w.querySelector('input');
    if (!q) return;
    w.querySelectorAll('span.plus, span.minus').forEach(function (b) {
      b.setAttribute('role', 'button');
      b.setAttribute('aria-label', b.classList.contains('plus') ? 'Increase' : 'Decrease');
      b.addEventListener('click', function () {
        var v = parseFloat(q.value) || 0;
        q.value = b.classList.contains('plus') ? v + 1 : Math.max(0, v - 1);
        q.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });
  /* Plus / minus beside a quantity field. Where the page labelled the count --
     search-14 shows "2 Guests" through its own refineString() -- the same
     singular and plural are used, read from that function. */
  document.querySelectorAll('.js-number-input').forEach(function (w) {
    var q = w.querySelector('.quantity');
    if (!q) return;
    var min = q.min !== '' ? Number(q.min) : 0;
    var max = q.max !== '' ? Number(q.max) : Infinity;
    function label(v) { return STEPPER_UNITS ? v + (v <= 1 ? STEPPER_UNITS[0] : STEPPER_UNITS[1]) : String(v); }
    function step(d) {
      var v = parseInt(q.value, 10);
      if (isNaN(v)) v = min;
      q.value = label(Math.min(max, Math.max(min, v + d)));
      q.dispatchEvent(new Event('change', { bubbles: true }));
    }
    [['.plus', 1], ['.minus', -1]].forEach(function (p) {
      var b = w.querySelector(p[0]);
      if (!b) return;
      b.setAttribute('role', 'button');
      b.setAttribute('aria-label', p[1] > 0 ? 'Increase' : 'Decrease');
      b.addEventListener('click', function (e) { e.preventDefault(); step(p[1]); });
    });
  });
})();
