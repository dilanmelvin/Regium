// ─── Install tab switcher ─────────────────────────────────────────────────────
const PM_COMMANDS = {
  npm:  "npm install @regium/core @regium/data",
  pnpm: "pnpm add @regium/core @regium/data",
  yarn: "yarn add @regium/core @regium/data",
  bun:  "bun add @regium/core @regium/data",
};

document.querySelectorAll(".install__tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".install__tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const pm = tab.dataset.pm;
    document.getElementById("install-code").innerHTML = `<code>${PM_COMMANDS[pm]}</code>`;
  });
});

// Copy button
document.querySelector(".install__copy")?.addEventListener("click", () => {
  const code = document.getElementById("install-code")?.textContent;
  if (code) {
    navigator.clipboard.writeText(code.trim()).then(() => {
      const btn = document.querySelector(".install__copy");
      btn.textContent = "✓";
      setTimeout(() => { btn.textContent = "📋"; }, 1500);
    });
  }
});
// (country example tabs handled by setIDECode above)

// (country example tabs and IDE code are in Experience Centre only)

// ─── Navbar scroll-spy ────────────────────────────────────────────────────────
const NAV_SECTIONS = ["features", "install", "validators", "countries", "use-cases"];

function updateNavActive() {
  const scrollY = window.scrollY + 120;
  let current = "";

  for (const id of NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  }

  // Section links
  document.querySelectorAll(".nav__link[data-section]").forEach((link) => {
    link.classList.toggle("nav__link--active", link.dataset.section === current);
  });

  // Home link — active only when no section is in view (top of page)
  const homeLink = document.getElementById("nav-home");
  if (homeLink) {
    homeLink.classList.toggle("nav__link--active", current === "");
  }
}

window.addEventListener("scroll", updateNavActive, { passive: true });
updateNavActive(); // run once on load

// Navbar scroll border effect
window.addEventListener("scroll", () => {
  const nav = document.getElementById("nav");
  if (nav) {
    nav.style.borderBottomColor = window.scrollY > 100 ? "var(--border-light)" : "var(--border)";
  }
}, { passive: true });

// ─── Scroll reveal ────────────────────────────────────────────────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".feature, .validator-card, .use-case, .country-chip").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});
