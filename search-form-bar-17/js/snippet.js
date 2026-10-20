/*!
 * search-form-bar-17 - Colorlib. No jQuery, no framework.
 * Behaviours: search-toggle
 */
(function () {
  'use strict';

  /* Search icon: open the search, focus the field, close it again. */
  var ST = {"toggle":".search-icon-toggle","target":"body","cls":"search-active","toggles":false,"focus":"#search2","delay":500,"close":".js-search-close","outside":null};
  document.querySelectorAll(ST.toggle).forEach(function (t) {
    t.setAttribute('role', 'button');
    t.setAttribute('aria-label', 'Search');
    t.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll(ST.target).forEach(function (el) {
        if (ST.toggles) el.classList.toggle(ST.cls); else el.classList.add(ST.cls);
      });
      if (ST.focus) setTimeout(function () { var f = document.querySelector(ST.focus); if (f) f.focus(); }, ST.delay);
    });
  });
  function stClose() { document.querySelectorAll(ST.target).forEach(function (el) { el.classList.remove(ST.cls); }); }
  if (ST.close) document.querySelectorAll(ST.close).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); stClose(); }); });
  if (ST.outside) document.addEventListener('mouseup', function (e) {
    var box = document.querySelector(ST.outside);
    if (box && !box.contains(e.target) && !e.target.closest(ST.toggle)) stClose();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') stClose(); });
})();
