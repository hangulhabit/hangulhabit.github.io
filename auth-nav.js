/* Shared nav auth state - swaps the "Sign in / Sign up" nav link for an
   account menu (email + logout) when the visitor is signed in. Include
   supabase-js before this script on every page that uses it. */
(function () {
  var SUPABASE_URL = "https://czaydegitctvkskpvoaa.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YXlkZWdpdGN0dmtza3B2b2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NzI5OTEsImV4cCI6MjEwNDI0ODk5MX0.lssrDd1lBKnx71YuwrFa_Umci1H_U5u4V1Rni3YUD_w";

  if (typeof supabase === "undefined") return;
  var client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.__hhSupabase = client;

  function pathTo(file) {
    return window.location.pathname.replace(/[^/]*$/, "") + file;
  }

  function renderLoggedIn(email) {
    var link = document.getElementById("navSignin");
    if (!link) return;

    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.id = "accountMenu";
    wrap.innerHTML =
      '<button type="button" id="accountBtn">👤 <span class="label">' +
      email.split("@")[0] +
      '</span></button>' +
      '<div class="menu" role="menu">' +
      '<button type="button" id="accountLink" role="menuitem">내 계정</button>' +
      '<button type="button" id="billingLink" role="menuitem">결제 내역</button>' +
      '<button type="button" id="logoutBtn" role="menuitem">로그아웃</button>' +
      "</div>";
    link.replaceWith(wrap);

    document.getElementById("accountBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      wrap.classList.toggle("open");
    });
    document.getElementById("accountLink").addEventListener("click", function () {
      window.location.href = pathTo("account.html");
    });
    document.getElementById("billingLink").addEventListener("click", function () {
      window.location.href = pathTo("billing.html");
    });
    document.getElementById("logoutBtn").addEventListener("click", async function () {
      await client.auth.signOut();
      window.location.href = pathTo("index.html");
    });
    document.addEventListener("click", function () {
      wrap.classList.remove("open");
    });
  }

  client.auth.getSession().then(function (res) {
    var session = res.data.session;
    if (session && session.user && session.user.email) {
      renderLoggedIn(session.user.email);
    }
  });
})();
