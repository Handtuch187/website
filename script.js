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

// Tabs
const tabButtons = document.querySelectorAll(".tab-item");
const panels = document.querySelectorAll(".panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.tabPanel === target);
    });
  });
});

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

document.querySelectorAll("section, .panel").forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});
