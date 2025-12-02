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

// Testimonials slider
const slider = document.getElementById("testimonial-slider");
if (slider) {
  const track = slider.querySelector(".slider-track");
  const cards = Array.from(track.children);
  const prevButton = slider.querySelector(".prev");
  const nextButton = slider.querySelector(".next");
  let index = 0;

  const scrollToCard = () => {
    const width = cards[0].getBoundingClientRect().width + 20;
    track.scrollTo({ left: index * width, behavior: "smooth" });
  };

  prevButton.addEventListener("click", () => {
    index = Math.max(index - 1, 0);
    scrollToCard();
  });

  nextButton.addEventListener("click", () => {
    index = Math.min(index + 1, cards.length - 1);
    scrollToCard();
  });
}

// Scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll("section").forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});

// Step cards parallax
const stepCards = document.querySelectorAll(".step-card");
const updateStepParallax = () => {
  stepCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const centerOffset =
      (viewportHeight * 0.5 - (rect.top + rect.height / 2)) / viewportHeight;
    const translate = Math.max(Math.min(centerOffset * 40, 18), -18);
    card.style.setProperty("--card-shift", `${translate}px`);
  });
};

if (stepCards.length) {
  updateStepParallax();
  window.addEventListener("scroll", updateStepParallax, { passive: true });
  window.addEventListener("resize", updateStepParallax);
}
