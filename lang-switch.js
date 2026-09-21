/* Shared language switcher. Include after a page defines `window.PAGE_TRANSLATIONS`
   (an { en: {...}, ja: {...}, ka: {...}, zh: {...} } dict of elementId -> innerHTML,
   plus an optional "metaDescription" key) and after a <div id="langSwitchMount"></div>
   sits where the dropdown should render in the nav. */
(function () {
  var LANG_LABELS = { en: "EN", ja: "JA", ka: "KA", zh: "中文" };
  var LANG_OPTIONS = [
    { code: "en", flag: "🇺🇸", name: "English" },
    { code: "ja", flag: "🇯🇵", name: "日本語" },
    { code: "ka", flag: "🇬🇪", name: "ქართული" },
    { code: "zh", flag: "🇨🇳", name: "中文" },
  ];

  function applyLang(lang) {
    var dict = (window.PAGE_TRANSLATIONS && window.PAGE_TRANSLATIONS[lang]) || {};
    Object.keys(dict).forEach(function (id) {
      if (id === "metaDescription") {
        var meta = document.getElementById("metaDescription");
        if (meta) meta.setAttribute("content", dict[id]);
        return;
      }
      var el = document.getElementById(id);
      if (el) el.innerHTML = dict[id];
    });
    document.documentElement.lang = lang;
    var btnLabel = document.getElementById("langBtnLabel");
    if (btnLabel) btnLabel.textContent = LANG_LABELS[lang] || "EN";
    document.querySelectorAll("#langSwitch .menu button").forEach(function (b) {
      b.setAttribute("aria-current", b.dataset.lang === lang ? "true" : "false");
    });
    try { localStorage.setItem("hh_lang", lang); } catch (e) {}
    if (window.hhInitSpeakButtons) window.hhInitSpeakButtons();
    document.dispatchEvent(new CustomEvent("hh:langchange", { detail: lang }));
  }

  function currentLang() {
    var saved = null;
    try { saved = localStorage.getItem("hh_lang"); } catch (e) {}
    if (saved && window.PAGE_TRANSLATIONS && window.PAGE_TRANSLATIONS[saved]) return saved;
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("ja") === 0) return "ja";
    if (nav.indexOf("ka") === 0) return "ka";
    if (nav.indexOf("zh") === 0) return "zh";
    return "en";
  }

  function init() {
    var mount = document.getElementById("langSwitchMount");
    if (!mount || !window.PAGE_TRANSLATIONS) return;

    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.id = "langSwitch";
    wrap.innerHTML =
      '<button type="button" id="langBtn" aria-haspopup="true" aria-expanded="false">' +
      '🌐 <span class="label" id="langBtnLabel">EN</span></button>' +
      '<div class="menu" role="menu">' +
      LANG_OPTIONS.map(function (o) {
        return '<button type="button" data-lang="' + o.code + '" role="menuitem">' + o.flag + " " + o.name + "</button>";
      }).join("") +
      "</div>";
    mount.replaceWith(wrap);

    document.getElementById("langBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      wrap.classList.toggle("open");
    });
    wrap.querySelectorAll(".menu button").forEach(function (b) {
      b.addEventListener("click", function () {
        applyLang(b.dataset.lang);
        wrap.classList.remove("open");
      });
    });
    document.addEventListener("click", function () {
      wrap.classList.remove("open");
    });

    applyLang(currentLang());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
