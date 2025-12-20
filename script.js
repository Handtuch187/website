const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("main-navigation");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", (!expanded).toString());
    navLinks.classList.toggle("open");
    document.body.classList.toggle("scroll-lock", !expanded);
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("scroll-lock");
    })
  );
}

// Hide/show navbar on scroll
const navbar = document.querySelector(".navbar");
let lastScrollY = window.scrollY;
const scrollThreshold = 2;

const handleScroll = () => {
  if (!navbar) return;
  const current = window.scrollY;

  if (current <= 0) {
    navbar.classList.remove("nav-hidden");
  } else if (current < lastScrollY - scrollThreshold) {
    navbar.classList.remove("nav-hidden");
  } else if (current > lastScrollY + scrollThreshold) {
    navbar.classList.add("nav-hidden");
  }

  lastScrollY = current;
};

window.addEventListener("scroll", handleScroll, { passive: true });

// Ensure header is visible on initial load
window.addEventListener(
  "load",
  () => {
    if (!navbar) return;
    navbar.classList.remove("nav-hidden");
    lastScrollY = window.scrollY;
  },
  { once: true }
);

// Scroll animations
const sections = Array.from(document.querySelectorAll("section"));

const markVisibleSections = () => {
  const vh = window.innerHeight || 1;
  sections.forEach((el) => {
    if (el.classList.contains("in-view")) return;
    const r = el.getBoundingClientRect();
    const visible = r.bottom > 0 && r.top < vh * 0.95;
    if (visible) el.classList.add("in-view");
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );

  sections.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });

  // Safari-safe: immediately reveal anything already in view
  markVisibleSections();
  window.addEventListener("load", markVisibleSections, { once: true });
  window.addEventListener("resize", markVisibleSections);

  // Final fallback: never keep sections hidden
  window.setTimeout(() => {
    sections.forEach((el) => el.classList.add("in-view"));
  }, 1200);
} else {
  sections.forEach((element) => element.classList.add("in-view"));
}

// Step cards parallax
const stepWraps = document.querySelectorAll(".step-wrap");
const stepCards = document.querySelectorAll(".step-card");
const updateStepParallax = () => {
  if (window.innerWidth <= 700) {
    if (stepWraps.length) {
      stepWraps.forEach((wrap) => wrap.style.removeProperty("--card-shift"));
    }
    stepCards.forEach((card) => card.style.removeProperty("--card-shift"));
    return;
  }

  if (stepWraps.length) {
    stepWraps.forEach((wrap) => {
      const card = wrap.querySelector(".step-card") || wrap;
      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const centerOffset =
        (viewportHeight * 0.5 - (rect.top + rect.height / 2)) / viewportHeight;
      const translate = Math.max(Math.min(centerOffset * 40, 18), -18);
      wrap.style.setProperty("--card-shift", `${translate}px`);
    });
    return;
  }

  stepCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const centerOffset =
      (viewportHeight * 0.5 - (rect.top + rect.height / 2)) / viewportHeight;
    const translate = Math.max(Math.min(centerOffset * 40, 18), -18);
    card.style.setProperty("--card-shift", `${translate}px`);
  });
};

if (stepWraps.length || stepCards.length) {
  updateStepParallax();
  window.addEventListener("scroll", updateStepParallax, { passive: true });
  window.addEventListener("resize", updateStepParallax);
}

// Contact form -> mailto
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const bdayInput = contactForm.querySelector('input[name="geburtsdatum"]');
  if (bdayInput) {
    bdayInput.addEventListener("input", (event) => {
      const input = event.currentTarget;
      const digits = input.value.replace(/\D/g, "").slice(0, 8);
      const parts = [];
      if (digits.length > 0) parts.push(digits.slice(0, 2));
      if (digits.length > 2) parts.push(digits.slice(2, 4));
      if (digits.length > 4) parts.push(digits.slice(4, 8));
      input.value = parts.join("/");
    });
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const subject = (data.get("betreff") || "").toString().trim();
    const lines = [
      `Name: ${(data.get("name") || "").toString().trim()}`,
      `Vorname: ${(data.get("vorname") || "").toString().trim()}`,
      `Geburtsdatum: ${(data.get("geburtsdatum") || "").toString().trim()}`,
      `Wohnort: ${(data.get("wohnort") || "").toString().trim()}`,
      `Telefonnummer: ${(data.get("telefon") || "").toString().trim()}`,
      `Email: ${(data.get("email") || "").toString().trim()}`,
      "",
      "Nachricht:",
      (data.get("nachricht") || "").toString().trim(),
    ];

    const mailto = `mailto:info@mpufreifahrt.de?subject=${encodeURIComponent(
      subject || "Kontaktanfrage"
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
  });
}
