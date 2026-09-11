/* Certos — site behaviour. No dependencies, no tracking, no cookies. */
(function () {
  "use strict";

  /* ---- theme -------------------------------------------------------- */
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");

  function store(value) {
    try { localStorage.setItem("certos-theme", value); } catch (e) { /* private mode */ }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      toggle.setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
      store(next);
    });
  }

  /* ---- mobile drawer ------------------------------------------------ */
  var burger = document.querySelector(".burger");
  var drawer = document.getElementById("drawer");

  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.getAttribute("data-open") === "true";
      drawer.setAttribute("data-open", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "false" : "true");
    });
    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        drawer.setAttribute("data-open", "false");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- counters: numbers settle once, from their final value -------- */
  var counters = document.querySelectorAll("[data-count]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (counters.length && !reduced && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var start = performance.now();
        var duration = 900;
        function step(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        el.textContent = "0" + suffix;
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---- support request: compose an e-mail, no third-party form ------ */
  var form = document.getElementById("support-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = [];
      ["name", "email", "company", "position", "resources", "details"].forEach(function (key) {
        var value = (data.get(key) || "").toString().trim();
        if (value) lines.push(key.toUpperCase() + ": " + value);
      });
      var subject = "Certos support suite access — " + (data.get("company") || data.get("name") || "request");
      window.location.href =
        "mailto:support@certos.ai?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      var status = document.getElementById("support-status");
      if (status) {
        status.textContent = "Your e-mail client is opening with the request pre-filled. If nothing happens, write to support@certos.ai directly.";
      }
    });
  }
})();
