// Install tab switcher
const commands = {
  npm: "npm install regium @regium/data",
  pnpm: "pnpm add regium @regium/data",
  yarn: "yarn add regium @regium/data",
  bun: "bun add regium @regium/data",
};

document.querySelectorAll(".install__tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".install__tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const pm = tab.dataset.pm;
    document.getElementById("install-code").innerHTML = `<code>${commands[pm]}</code>`;
  });
});

// Copy button
document.querySelector(".install__copy")?.addEventListener("click", () => {
  const code = document.getElementById("install-code")?.textContent;
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      const btn = document.querySelector(".install__copy");
      btn.textContent = "✓";
      setTimeout(() => {
        btn.textContent = "📋";
      }, 1500);
    });
  }
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const nav = document.getElementById("nav");
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    nav.style.borderBottomColor = "var(--border-light)";
  } else {
    nav.style.borderBottomColor = "var(--border)";
  }
  lastScroll = scrollY;
});

// Smooth reveal on scroll
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
