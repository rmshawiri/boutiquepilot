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
const sections = ["accueil", "a-propos", "contact"].map((id) =>
  document.getElementById(id),
);

const form = document.querySelector("#contact-form");
const formFields = form.querySelector("fieldset");
const sendButton = form.querySelector('[type="submit"]');
const sendLabel = sendButton.innerHTML;
const status = document.querySelector("#contact-status");
formFields.disabled = false;
sendButton.disabled = false;
let sending = false;
const editable = ["name", "email", "phone", "subject", "message"];
for (const key of editable) {
  const input = form.elements.namedItem(key);
  const error = document.createElement("span");
  error.id = `error-${key}`;
  error.className = "field-error";
  error.hidden = true;
  input.after(error);
  input.setAttribute("aria-describedby", error.id);
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    error.hidden = true;
  });
}
function showStatus(message, state) {
  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  const payload = Object.fromEntries(new FormData(form));
  for (const key of editable) {
    form.elements.namedItem(key).removeAttribute("aria-invalid");
    document.querySelector(`#error-${key}`).hidden = true;
  }
  sending = true;
  sendButton.disabled = true;
  formFields.disabled = true;
  form.setAttribute("aria-busy", "true");
  sendButton.textContent = "Envoi en cours…";
  showStatus("Votre message est en cours d’envoi.", "pending");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);
  let focusTarget = status;
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (response.ok && (response.status !== 200 || typeof data.message !== "string" || !data.message.trim())) {
      throw new Error("Unconfirmed contact response");
    }
    if (response.ok) {
      form.reset();
      showStatus(
        "Message envoyé avec succès. Merci de nous avoir contactés. L’équipe BoutiquePilot prendra connaissance de votre message.",
        "success",
      );
    } else {
      const messages = {
        422: "Vérifiez les champs indiqués.",
        429: "Vous avez envoyé plusieurs messages. Patientez 15 minutes ou contactez-nous sur WhatsApp.",
        413: "Votre message est trop volumineux. Réduisez sa longueur.",
      };
      showStatus(
        messages[response.status] ||
          "L’envoi est momentanément indisponible. Votre texte est conservé. Réessayez plus tard ou contactez-nous sur WhatsApp.",
        "error",
      );
      for (const key of editable)
        if (typeof data.errors?.[key] === "string") {
          const input = form.elements.namedItem(key),
            error = document.querySelector(`#error-${key}`);
          error.textContent = data.errors[key];
          error.hidden = false;
          input.setAttribute("aria-invalid", "true");
          if (focusTarget === status) focusTarget = input;
        }
    }
  } catch {
    showStatus(
      "L’envoi n’a pas pu être confirmé. Votre texte est conservé. Vérifiez votre connexion et patientez avant de réessayer, ou contactez-nous sur WhatsApp.",
      "error",
    );
  } finally {
    clearTimeout(timeout);
    sending = false;
    formFields.disabled = false;
    sendButton.disabled = false;
    sendButton.innerHTML = sendLabel;
    form.removeAttribute("aria-busy");
    focusTarget.focus({ preventScroll: true });
  }
});
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
