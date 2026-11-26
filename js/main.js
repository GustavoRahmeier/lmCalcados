(function () {
  var C = window.LM_CONFIG;
  var $ = function (s) {
    return document.querySelector(s);
  };
  var $$ = function (s) {
    return Array.prototype.slice.call(document.querySelectorAll(s));
  };

  function wa(msg) {
    return (
      "https://wa.me/" +
      C.whatsapp +
      "?text=" +
      encodeURIComponent(msg || C.defaultMessage)
    );
  }
  function phone() {
    var n = C.whatsapp.replace(/^55/, "");
    return "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
  }
  $$("[data-wa]").forEach(function (a) {
    a.href = wa();
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-maps]").forEach(function (a) {
    a.href = C.mapsLink;
  });
  $$("[data-insta]").forEach(function (a) {
    a.href = C.instagramUrl;
  });
  $$("[data-insta-user]").forEach(function (e) {
    e.textContent = C.instagramUser;
  });
  $$("[data-phone]").forEach(function (e) {
    e.textContent = phone();
  });
  $$("[data-address]").forEach(function (e) {
    e.textContent = C.address;
  });
  $("#map").src = C.mapsEmbed;
  $("#year").textContent = new Date().getFullYear();

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function fig(src, alt) {
    var f = el("figure", "ph"),
      i = new Image();
    i.src = src;
    i.alt = alt || "";
    i.loading = "lazy";
    f.appendChild(i);
    return f;
  }
  function link(cls, msg) {
    var a = el("a", cls);
    a.href = wa(msg);
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  C.categories.forEach(function (c) {
    var a = link(
      "cat reveal",
      "Olá! Gostaria de ver os calçados da linha " + c.name + ".",
    );
    a.appendChild(fig(c.img, c.alt));
    a.appendChild(
      el(
        "div",
        "cat__t",
        "<h3>" +
          esc(c.name) +
          "</h3><p>" +
          esc(c.text) +
          "</p><span class='cat__go'>Consultar produtos</span>",
      ),
    );
    $("#cats").appendChild(a);
  });

  C.products.forEach(function (p) {
    var d = el("article", "prod reveal");
    d.appendChild(fig(p.img, p.alt));
    var b = el(
      "div",
      "prod__b",
      "<h3>" +
        esc(p.name) +
        "</h3>" +
        (p.brand ? "<small>" + esc(p.brand) + "</small>" : "") +
        (p.price ? "<strong>" + esc(p.price) + "</strong>" : ""),
    );
    var a = link(
      "btn btn--k",
      "Olá! Gostaria de saber mais sobre o produto " + p.name + ".",
    );
    a.textContent = "Consultar pelo WhatsApp";
    b.appendChild(a);
    d.appendChild(b);
    $("#prods").appendChild(d);
  });

  C.news.forEach(function (n) {
    var d = link(
      "new reveal",
      "Olá! Gostaria de saber mais sobre a novidade: " + n.name + ".",
    );
    d.appendChild(fig(n.img, n.alt));
    d.appendChild(
      el(
        "div",
        "new__t",
        esc(n.name) + (n.text ? "<small>" + esc(n.text) + "</small>" : ""),
      ),
    );
    $("#news").appendChild(d);
  });

  /* galeria + lightbox */
  var gi = 0,
    lb = $("#lb"),
    lbImg = $("#lbImg"),
    last = null;
  function show(i) {
    gi = (i + C.gallery.length) % C.gallery.length;
    lbImg.src = C.gallery[gi].img;
    lbImg.alt = C.gallery[gi].alt;
  }
  function openLb(i) {
    last = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lb__x").focus();
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (last) last.focus();
  }
  C.gallery.forEach(function (g, i) {
    var f = fig(g.img, g.alt);
    f.className = "ph reveal" + (g.size ? " g-" + g.size : "");
    f.tabIndex = 0;
    f.setAttribute("role", "button");
    f.setAttribute("aria-label", "Ampliar: " + g.alt);
    f.onclick = function () {
      openLb(i);
    };
    f.onkeydown = function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLb(i);
      }
    };
    $("#gallery").appendChild(f);
  });
  $(".lb__x").onclick = closeLb;
  $(".lb__p").onclick = function () {
    show(gi - 1);
  };
  $(".lb__nx").onclick = function () {
    show(gi + 1);
  };
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(gi - 1);
    if (e.key === "ArrowRight") show(gi + 1);
  });

  /* foto ausente: aviso discreto no lugar do ícone quebrado */
  function miss(i) {
    var p = i.closest(".ph");
    if (p) p.classList.add("missing");
  }
  document.addEventListener(
    "error",
    function (e) {
      if (e.target.tagName === "IMG") miss(e.target);
    },
    true,
  );
  $$(".ph img").forEach(function (i) {
    if (i.complete && i.naturalWidth === 0) miss(i);
  });

  /* header + menu mobile */
  var header = $("#header"),
    nav = $("#nav"),
    burger = $("#burger");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  function toggle(force) {
    var o =
      typeof force === "boolean" ? force : !nav.classList.contains("open");
    nav.classList.toggle("open", o);
    burger.setAttribute("aria-expanded", o);
    burger.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu");
  }
  burger.onclick = function () {
    toggle();
  };
  $$("#nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      toggle(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggle(false);
  });

  /* revelar ao rolar */
  var items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (x) {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach(function (e, i) {
      e.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(e);
    });
  } else
    items.forEach(function (e) {
      e.classList.add("in");
    });
})();
