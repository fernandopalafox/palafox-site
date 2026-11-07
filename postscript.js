(function () {// quartz/components/scripts/quartz/components/scripts/clipboard.inline.ts
var svgCopy = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>';
var svgCheck = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';
document.addEventListener("nav", () => {
  const els = document.getElementsByTagName("pre");
  for (let i = 0; i < els.length; i++) {
    const codeBlock = els[i].getElementsByTagName("code")[0];
    if (codeBlock) {
      const source = codeBlock.innerText.replace(/\n\n/g, "\n");
      const button = document.createElement("button");
      button.className = "clipboard-button";
      button.type = "button";
      button.innerHTML = svgCopy;
      button.ariaLabel = "Copy source";
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(source).then(
          () => {
            button.blur();
            button.innerHTML = svgCheck;
            setTimeout(() => {
              button.innerHTML = svgCopy;
              button.style.borderColor = "";
            }, 2e3);
          },
          (error) => console.error(error)
        );
      });
      els[i].prepend(button);
    }
  }
});
})();
(function () {// quartz/components/scripts/quartz/components/scripts/backtotop.inline.ts
function updateBackToTop() {
  const b = document.querySelector(".back-to-top");
  if (b)
    b.hidden = window.scrollY < window.innerHeight;
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
document.addEventListener("nav", () => {
  const b = document.querySelector(".back-to-top");
  b?.addEventListener("click", () => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  });
  updateBackToTop();
});
})();
(function () {// quartz/components/scripts/quartz/components/scripts/home.inline.ts
var tracking = false;
var clickedAt = 0;
function home() {
  return document.querySelector(".home-lists");
}
function spy() {
  const root = home();
  if (!root)
    return;
  const jumps = Array.from(root.querySelectorAll(".jumps .btn"));
  if (!tracking) {
    jumps.forEach((j) => j.classList.remove("on"));
    return;
  }
  if (window.scrollY < 4 && Date.now() - clickedAt > 1200) {
    tracking = false;
    return spy();
  }
  let current = jumps[0];
  for (const j of jumps) {
    const section = document.getElementById(j.dataset.jump);
    if (section && section.getBoundingClientRect().top < window.innerHeight * 0.45)
      current = j;
  }
  jumps.forEach((j) => j.classList.toggle("on", j === current));
}
function stick() {
  const bar = document.querySelector(".home-lists .bar");
  if (bar)
    bar.classList.toggle("stuck", bar.getBoundingClientRect().top <= 1 && window.scrollY > 0);
}
function applyFilter(root, topic) {
  root.querySelectorAll(".chips .btn").forEach(
    (b) => b.setAttribute("aria-pressed", String((b.dataset.topic ?? "") === topic))
  );
  for (const id of ["papers"]) {
    const section = document.getElementById(id);
    const rows = Array.from(section.querySelectorAll(".row"));
    let shown = 0;
    for (const r of rows) {
      const on = !topic || (r.dataset.topics ?? "").split(" ").includes(topic);
      r.hidden = !on;
      if (on)
        shown++;
    }
    ;
    section.querySelector(".none").hidden = shown > 0;
    const n = root.querySelector(`.btn[data-jump="${id}"] .n`);
    if (n)
      n.textContent = String(shown);
  }
}
function hidePeek() {
  const peek = document.getElementById("cite-peek");
  if (peek)
    peek.hidden = true;
}
function showPeek(a) {
  const row = document.querySelector(a.getAttribute("href"));
  if (!row)
    return;
  let peek = document.getElementById("cite-peek");
  if (!peek) {
    peek = document.createElement("div");
    peek.id = "cite-peek";
    peek.className = "peek";
    document.body.appendChild(peek);
  }
  const initials = (name) => {
    const parts = name.split(" ");
    const last = parts.pop();
    return parts.map((p) => p[0]).join("") + " " + last;
  };
  const me = home()?.dataset.me;
  const names = (row.dataset.authors ?? "").split("|").filter(Boolean);
  const venue = row.dataset.venue ?? "";
  const year = row.dataset.year ?? "";
  const source = /^\D*\d{4}$/.test(venue) || !year ? venue : `${venue}, ${year}`;
  peek.innerHTML = `<div class="title"></div><div class="byline"><span class="au"></span><span class="src"></span></div><p class="abstract"></p>`;
  peek.querySelector(".title").textContent = row.querySelector(".title")?.textContent ?? "";
  const au = peek.querySelector(".byline .au");
  names.forEach((n, i) => {
    if (i > 0)
      au.append(", ");
    const el = document.createElement(n === me ? "b" : "span");
    el.textContent = initials(n);
    au.append(el);
  });
  peek.querySelector(".byline .src").textContent = ` - ${source}`;
  peek.querySelector(".abstract").textContent = row.dataset.tldr ?? "";
  peek.hidden = false;
  const r = a.getBoundingClientRect();
  const w = peek.offsetWidth;
  const left = Math.max(16, Math.min(r.left + window.scrollX - w / 2 + r.width / 2, document.documentElement.clientWidth - w - 16));
  const below = r.bottom + 8 + peek.offsetHeight < window.innerHeight;
  peek.style.left = left + "px";
  peek.style.top = (below ? r.bottom + 8 : r.top - 8 - peek.offsetHeight) + window.scrollY + "px";
}
function closeEmail(e) {
  const pop = document.getElementById("email-pop");
  if (pop && !pop.hidden && !e.target.closest(".email-wrap")) {
    pop.hidden = true;
    document.querySelector(".email-wrap .email")?.setAttribute("aria-expanded", "false");
  }
}
window.addEventListener("scroll", () => {
  spy();
  stick();
}, { passive: true });
document.addEventListener("click", closeEmail);
document.addEventListener("nav", () => {
  hidePeek();
  const root = home();
  if (!root)
    return;
  tracking = false;
  document.querySelectorAll(".cites[data-topic]").forEach((s) => {
    const rows = Array.from(document.querySelectorAll("#papers .row")).filter(
      (r) => (r.dataset.topics ?? "").split(" ").includes(s.dataset.topic)
    );
    s.innerHTML = "[" + rows.map((r) => `<a class="cite" href="#${r.id}">${r.dataset.num}</a>`).join(", ") + "]";
    s.querySelectorAll(".cite").forEach((a) => {
      a.addEventListener("mouseenter", () => showPeek(a));
      a.addEventListener("focus", () => showPeek(a));
      a.addEventListener("mouseleave", hidePeek);
      a.addEventListener("blur", hidePeek);
      a.addEventListener("click", () => {
        hidePeek();
        applyFilter(root, "");
      });
    });
  });
  const toggle = root.querySelector(".filter-toggle");
  const chips = root.querySelector("#paper-topics");
  toggle.addEventListener("click", () => {
    chips.hidden = !chips.hidden;
    toggle.setAttribute("aria-expanded", String(!chips.hidden));
    if (chips.hidden)
      applyFilter(root, "");
  });
  root.querySelector(".chips").addEventListener("click", (e) => {
    const b = e.target.closest(".btn");
    if (b)
      applyFilter(root, b.dataset.topic ?? "");
  });
  root.querySelectorAll(".jumps .btn").forEach(
    (a) => a.addEventListener("click", (e) => {
      if (a.classList.contains("on")) {
        e.preventDefault();
        tracking = false;
        spy();
        window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      } else {
        tracking = true;
        clickedAt = Date.now();
        root.querySelectorAll(".jumps .btn").forEach((x) => x.classList.toggle("on", x === a));
      }
    })
  );
  root.querySelectorAll("button.tldr").forEach(
    (b) => b.addEventListener("click", () => {
      const panel = document.getElementById(b.getAttribute("aria-controls"));
      panel.hidden = !panel.hidden;
      b.setAttribute("aria-expanded", String(!panel.hidden));
    })
  );
  const emailBtn = root.querySelector(".email-wrap .email");
  const pop = document.getElementById("email-pop");
  emailBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pop.hidden = !pop.hidden;
    emailBtn.setAttribute("aria-expanded", String(!pop.hidden));
  });
  const copy = pop.querySelector(".copy");
  copy.addEventListener("click", (e) => {
    e.stopPropagation();
    const select = () => {
      const r = document.createRange();
      r.selectNodeContents(pop.querySelector(".addr"));
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(r);
    };
    navigator.clipboard?.writeText(pop.dataset.email).then(() => {
      copy.textContent = "copied";
      setTimeout(() => copy.textContent = "copy", 1500);
    }, select) ?? select();
  });
  spy();
  stick();
});
})();
(function () {// node_modules/plausible-tracker/build/module/lib/request.js
function sendEvent(eventName, data, options) {
  const isLocalhost = /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/.test(location.hostname) || location.protocol === "file:";
  if (!data.trackLocalhost && isLocalhost) {
    return console.warn("[Plausible] Ignoring event because website is running locally");
  }
  try {
    if (window.localStorage.plausible_ignore === "true") {
      return console.warn('[Plausible] Ignoring event because "plausible_ignore" is set to "true" in localStorage');
    }
  } catch (e) {
    null;
  }
  const payload = {
    n: eventName,
    u: data.url,
    d: data.domain,
    r: data.referrer,
    w: data.deviceWidth,
    h: data.hashMode ? 1 : 0,
    p: options && options.props ? JSON.stringify(options.props) : void 0
  };
  const req = new XMLHttpRequest();
  req.open("POST", `${data.apiHost}/api/event`, true);
  req.setRequestHeader("Content-Type", "text/plain");
  req.send(JSON.stringify(payload));
  req.onreadystatechange = () => {
    if (req.readyState !== 4)
      return;
    if (options && options.callback) {
      options.callback();
    }
  };
}

// node_modules/plausible-tracker/build/module/lib/tracker.js
function Plausible(defaults) {
  const getConfig = () => ({
    hashMode: false,
    trackLocalhost: false,
    url: location.href,
    domain: location.hostname,
    referrer: document.referrer || null,
    deviceWidth: window.innerWidth,
    apiHost: "https://plausible.io",
    ...defaults
  });
  const trackEvent = (eventName, options, eventData) => {
    sendEvent(eventName, { ...getConfig(), ...eventData }, options);
  };
  const trackPageview2 = (eventData, options) => {
    trackEvent("pageview", options, eventData);
  };
  const enableAutoPageviews = () => {
    const page = () => trackPageview2();
    const originalPushState = history.pushState;
    if (originalPushState) {
      history.pushState = function(data, title, url) {
        originalPushState.apply(this, [data, title, url]);
        page();
      };
      addEventListener("popstate", page);
    }
    if (defaults && defaults.hashMode) {
      addEventListener("hashchange", page);
    }
    trackPageview2();
    return function cleanup() {
      if (originalPushState) {
        history.pushState = originalPushState;
        removeEventListener("popstate", page);
      }
      if (defaults && defaults.hashMode) {
        removeEventListener("hashchange", page);
      }
    };
  };
  const enableAutoOutboundTracking = (targetNode = document, observerInit = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["href"]
  }) => {
    function trackClick(event) {
      trackEvent("Outbound Link: Click", { props: { url: this.href } });
      if (!(typeof process !== "undefined" && process && false)) {
        setTimeout(() => {
          location.href = this.href;
        }, 150);
      }
      event.preventDefault();
    }
    const tracked = /* @__PURE__ */ new Set();
    function addNode(node) {
      if (node instanceof HTMLAnchorElement) {
        if (node.host !== location.host) {
          node.addEventListener("click", trackClick);
          tracked.add(node);
        }
      } else if ("querySelectorAll" in node) {
        node.querySelectorAll("a").forEach(addNode);
      }
    }
    function removeNode(node) {
      if (node instanceof HTMLAnchorElement) {
        node.removeEventListener("click", trackClick);
        tracked.delete(node);
      } else if ("querySelectorAll" in node) {
        node.querySelectorAll("a").forEach(removeNode);
      }
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          removeNode(mutation.target);
          addNode(mutation.target);
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach(addNode);
          mutation.removedNodes.forEach(removeNode);
        }
      });
    });
    targetNode.querySelectorAll("a").forEach(addNode);
    observer.observe(targetNode, observerInit);
    return function cleanup() {
      tracked.forEach((a) => {
        a.removeEventListener("click", trackClick);
      });
      tracked.clear();
      observer.disconnect();
    };
  };
  return {
    trackEvent,
    trackPageview: trackPageview2,
    enableAutoPageviews,
    enableAutoOutboundTracking
  };
}

// node_modules/plausible-tracker/build/module/index.js
var module_default = Plausible;

// quartz/components/scripts/quartz/components/scripts/plausible.inline.ts
var { trackPageview } = module_default();
document.addEventListener("nav", () => trackPageview());
})();
(function () {// node_modules/micromorph/dist/index.js
var T = (e) => (t, r) => t[`node${e}`] === r[`node${e}`];
var b = T("Name");
var C = T("Type");
var g = T("Value");
function M(e, t) {
  if (e.attributes.length === 0 && t.attributes.length === 0)
    return [];
  let r = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  for (let s of e.attributes)
    n.set(s.name, s.value);
  for (let s of t.attributes) {
    let a = n.get(s.name);
    s.value === a ? n.delete(s.name) : (typeof a < "u" && n.delete(s.name), o.set(s.name, s.value));
  }
  for (let s of n.keys())
    r.push({ type: 5, name: s });
  for (let [s, a] of o.entries())
    r.push({ type: 4, name: s, value: a });
  return r;
}
function N(e, t = true) {
  let r = `${e.localName}`;
  for (let { name: n, value: o } of e.attributes)
    t && n.startsWith("data-") || (r += `[${n}=${o}]`);
  return r += e.innerHTML, r;
}
function h(e) {
  switch (e.tagName) {
    case "BASE":
    case "TITLE":
      return e.localName;
    case "META": {
      if (e.hasAttribute("name"))
        return `meta[name="${e.getAttribute("name")}"]`;
      if (e.hasAttribute("property"))
        return `meta[name="${e.getAttribute("property")}"]`;
      break;
    }
    case "LINK": {
      if (e.hasAttribute("rel") && e.hasAttribute("href"))
        return `link[rel="${e.getAttribute("rel")}"][href="${e.getAttribute("href")}"]`;
      if (e.hasAttribute("href"))
        return `link[href="${e.getAttribute("href")}"]`;
      break;
    }
  }
  return N(e);
}
function x(e) {
  let [t, r = ""] = e.split("?");
  return `${t}?t=${Date.now()}&${r.replace(/t=\d+/g, "")}`;
}
function c(e) {
  if (e.nodeType === 1 && e.hasAttribute("data-persist"))
    return e;
  if (e.nodeType === 1 && e.localName === "script") {
    let t = document.createElement("script");
    for (let { name: r, value: n } of e.attributes)
      r === "src" && (n = x(n)), t.setAttribute(r, n);
    return t.innerHTML = e.innerHTML, t;
  }
  return e.cloneNode(true);
}
function R(e, t) {
  if (e.children.length === 0 && t.children.length === 0)
    return [];
  let r = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let a of e.children)
    n.set(h(a), a);
  for (let a of t.children) {
    let i = h(a), u = n.get(i);
    u ? N(a, false) !== N(u, false) && o.set(i, c(a)) : s.set(i, c(a)), n.delete(i);
  }
  for (let a of e.childNodes) {
    if (a.nodeType === 1) {
      let i = h(a);
      if (n.has(i)) {
        r.push({ type: 1 });
        continue;
      } else if (o.has(i)) {
        let u = o.get(i);
        r.push({ type: 3, attributes: M(a, u), children: I(a, u) });
        continue;
      }
    }
    r.push(void 0);
  }
  for (let a of s.values())
    r.push({ type: 0, node: c(a) });
  return r;
}
function I(e, t) {
  let r = [], n = Math.max(e.childNodes.length, t.childNodes.length);
  for (let o = 0; o < n; o++) {
    let s = e.childNodes.item(o), a = t.childNodes.item(o);
    r[o] = p(s, a);
  }
  return r;
}
function p(e, t) {
  if (!e)
    return { type: 0, node: c(t) };
  if (!t)
    return { type: 1 };
  if (C(e, t)) {
    if (e.nodeType === 3) {
      let r = e.nodeValue, n = t.nodeValue;
      if (r.trim().length === 0 && n.trim().length === 0)
        return;
    }
    if (e.nodeType === 1) {
      if (b(e, t)) {
        let r = e.tagName === "HEAD" ? R : I;
        return { type: 3, attributes: M(e, t), children: r(e, t) };
      }
      return { type: 2, node: c(t) };
    } else
      return e.nodeType === 9 ? p(e.documentElement, t.documentElement) : g(e, t) ? void 0 : { type: 2, value: t.nodeValue };
  }
  return { type: 2, node: c(t) };
}
function $(e, t) {
  if (t.length !== 0)
    for (let { type: r, name: n, value: o } of t)
      r === 5 ? e.removeAttribute(n) : r === 4 && e.setAttribute(n, o);
}
async function O(e, t, r) {
  if (!t)
    return;
  let n;
  switch (e.nodeType === 9 ? (e = e.documentElement, n = e) : r ? n = r : n = e, t.type) {
    case 0: {
      let { node: o } = t;
      e.appendChild(o);
      return;
    }
    case 1: {
      if (!n)
        return;
      e.removeChild(n);
      return;
    }
    case 2: {
      if (!n)
        return;
      let { node: o, value: s } = t;
      if (typeof s == "string") {
        n.nodeValue = s;
        return;
      }
      n.replaceWith(o);
      return;
    }
    case 3: {
      if (!n)
        return;
      let { attributes: o, children: s } = t;
      $(n, o);
      let a = Array.from(n.childNodes);
      await Promise.all(s.map((i, u) => O(n, i, a[u])));
      return;
    }
  }
}
function P(e, t) {
  let r = p(e, t);
  return O(e, r);
}

// node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// quartz/util/path.ts
function getFullSlug(window2) {
  const res = window2.document.body.dataset.slug;
  return res;
}

// quartz/components/scripts/quartz/components/scripts/spa.inline.ts
var NODE_TYPE_ELEMENT = 1;
var announcer = document.createElement("route-announcer");
var isElement = (target) => target?.nodeType === NODE_TYPE_ELEMENT;
var isLocalUrl = (href) => {
  try {
    const url = new URL(href);
    if (window.location.origin === url.origin) {
      return true;
    }
  } catch (e) {
  }
  return false;
};
var getOpts = ({ target }) => {
  if (!isElement(target))
    return;
  const a = target.closest("a");
  if (!a)
    return;
  if ("routerIgnore" in a.dataset)
    return;
  const { href } = a;
  if (!isLocalUrl(href))
    return;
  return { url: new URL(href), scroll: "routerNoscroll" in a.dataset ? false : void 0 };
};
function notifyNav(url) {
  const event = new CustomEvent("nav", { detail: { url } });
  document.dispatchEvent(event);
}
var p2;
async function navigate(url, isBack = false) {
  p2 = p2 || new DOMParser();
  const contents = await fetch(`${url}`).then((res) => res.text()).catch(() => {
    window.location.assign(url);
  });
  if (!contents)
    return;
  const html = p2.parseFromString(contents, "text/html");
  let title = html.querySelector("title")?.textContent;
  if (title) {
    document.title = title;
  } else {
    const h1 = document.querySelector("h1");
    title = h1?.innerText ?? h1?.textContent ?? url.pathname;
  }
  if (announcer.textContent !== title) {
    announcer.textContent = title;
  }
  announcer.dataset.persist = "";
  html.body.appendChild(announcer);
  P(document.body, html.body);
  if (!isBack) {
    if (url.hash) {
      const el = document.getElementById(decodeURIComponent(url.hash.substring(1)));
      el?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0 });
    }
  }
  const elementsToRemove = document.head.querySelectorAll(":not([spa-preserve])");
  elementsToRemove.forEach((el) => el.remove());
  const elementsToAdd = html.head.querySelectorAll(":not([spa-preserve])");
  elementsToAdd.forEach((el) => document.head.appendChild(el));
  if (!isBack) {
    history.pushState({}, "", url);
  }
  notifyNav(getFullSlug(window));
  delete announcer.dataset.persist;
}
window.spaNavigate = navigate;
function createRouter() {
  if (typeof window !== "undefined") {
    window.addEventListener("click", async (event) => {
      const { url } = getOpts(event) ?? {};
      if (!url)
        return;
      event.preventDefault();
      try {
        navigate(url, false);
      } catch (e) {
        window.location.assign(url);
      }
    });
    window.addEventListener("popstate", (event) => {
      const { url } = getOpts(event) ?? {};
      if (window.location.hash && window.location.pathname === url?.pathname)
        return;
      try {
        navigate(new URL(window.location.toString()), true);
      } catch (e) {
        window.location.reload();
      }
      return;
    });
  }
  return new class Router {
    go(pathname) {
      const url = new URL(pathname, window.location.toString());
      return navigate(url, false);
    }
    back() {
      return window.history.back();
    }
    forward() {
      return window.history.forward();
    }
  }();
}
createRouter();
notifyNav(getFullSlug(window));
if (!customElements.get("route-announcer")) {
  const attrs = {
    "aria-live": "assertive",
    "aria-atomic": "true",
    style: "position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"
  };
  customElements.define(
    "route-announcer",
    class RouteAnnouncer extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        for (const [key, value] of Object.entries(attrs)) {
          this.setAttribute(key, value);
        }
      }
    }
  );
}
})();