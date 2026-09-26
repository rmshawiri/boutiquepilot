const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
document.documentElement.classList.add("js");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header")) closeMenu();
});
matchMedia("(min-width: 1060px)").addEventListener("change", closeMenu);

const views = {
  dashboard: [
    "Tableau de bord",
    "Retrouvez vos ventes, vos marges et vos alertes de stock en un coup d’œil.",
    "Tableau de bord réel de BoutiquePilot : indicateurs de vente, marge et stock, avec des données de démonstration.",
  ],
  caisse: [
    "Caisse & ventes",
    "Choisissez un article, son conditionnement et son emplacement, puis enregistrez la vente.",
    "Caisse réelle de BoutiquePilot : articles, conditionnements, quantités et panier, avec des données de démonstration.",
  ],
  stock: [
    "Articles & stock",
    "Un seul article, plusieurs formats et une répartition claire entre rayon et réserve.",
    "Liste réelle des articles BoutiquePilot avec quantités, emplacements, coûts et statuts de stock de démonstration.",
  ],
  tarifs: [
    "Tarifications",
    "Comparez vos coûts et vos marges. Vous gardez la main sur le prix de vente validé.",
    "Écran réel de tarification BoutiquePilot : coûts, prix actuels et marges par conditionnement, données de démonstration.",
  ],
};
const switcher = document.querySelector(".view-switcher");
switcher.hidden = false;
let activeView = "dashboard";
switcher.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button || button.dataset.view === activeView) return;
  const key = button.dataset.view;
  const candidate = new Image();
  candidate.onload = () => {
    if (activeView !== key) return;
    const image = document.querySelector("#product-image");
    image.src = candidate.src;
    image.alt = views[key][2];
    document.querySelector("#screen-title").textContent =
      `BoutiquePilot · ${views[key][0]}`;
    document.querySelector("#screen-description").textContent = views[key][1];
    switcher
      .querySelectorAll("button")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
  };
  candidate.onerror = () => {
    activeView = switcher.querySelector('[aria-pressed="true"]').dataset.view;
  };
  activeView = key;
  candidate.src = `/assets/${key}.webp`;
});

document.querySelectorAll("[data-subject]").forEach((link) =>
  link.addEventListener("click", () => {
    document.querySelector("#contact-subject").value = link.dataset.subject;
  }),
);
// Phase 2 : aucune requête ni simulation de succès. Le serveur SMTP relève de la phase 3.
document
  .querySelector("#contact-form")
  .addEventListener("submit", (event) => event.preventDefault());

const sections = ["accueil", "a-propos", "contact"].map((id) =>
  document.getElementById(id),
);
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            if (link.hash === `#${entry.target.id}`)
              link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        }
    },
    { rootMargin: "-15% 0px -55% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}
