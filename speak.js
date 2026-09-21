/* Free, zero-setup Korean text-to-speech using the browser's built-in
   Web Speech API. No account, no API key, works offline once voices load. */
(function () {
  var koVoice = null;

  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    var voices = window.speechSynthesis.getVoices();
    koVoice = voices.find(function (v) { return v.lang === "ko-KR"; }) ||
      voices.find(function (v) { return v.lang && v.lang.indexOf("ko") === 0; }) ||
      null;
  }

  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  window.hhSpeak = function (text, btn) {
    if (!("speechSynthesis" in window)) {
      if (btn) btn.title = "Text-to-speech isn't supported in this browser";
      return;
    }
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ko-KR";
    utter.rate = 0.85;
    if (koVoice) utter.voice = koVoice;
    if (btn) {
      btn.classList.add("speaking");
      utter.onend = function () { btn.classList.remove("speaking"); };
      utter.onerror = function () { btn.classList.remove("speaking"); };
    }
    window.speechSynthesis.speak(utter);
  };

  function initButtons() {
    document.querySelectorAll("[data-speak]").forEach(function (btn) {
      if (btn.dataset.speakBound) return;
      btn.dataset.speakBound = "1";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.hhSpeak(btn.dataset.speak, btn);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initButtons);
  } else {
    initButtons();
  }
  window.hhInitSpeakButtons = initButtons;
})();
