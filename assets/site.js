/*
  Shared page-chrome behavior: elevates the sticky nav once the page scrolls, and
  reveals any ".reveal" element (fade + rise) the first time it enters the viewport.
  Both respect prefers-reduced-motion (the reveal CSS shows content immediately;
  this script just skips the observer setup so nothing is ever left invisible).
*/
(function () {
  var nav = document.querySelector("nav.topnav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (reduceMotion || typeof IntersectionObserver === "undefined") {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
    observer.observe(el);
  });
})();
