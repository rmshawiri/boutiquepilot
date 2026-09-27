import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const base = process.env.TEST_URL || "http://127.0.0.1:4173";
await mkdir("artifacts/qa", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const result = {
  checks: [],
  layouts: [],
  accessibility: [],
  errors: [],
  requestsFailed: [],
};
const check = (label) => {
  result.checks.push(label);
  console.log(`OK ${label}`);
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => result.errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error") result.errors.push(e.text());
  });
  page.on("requestfailed", (r) => result.requestsFailed.push(r.url()));
  const requests = [];
  page.on("request", (r) =>
    requests.push({ url: r.url(), method: r.method() }),
  );
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  await page.locator(".hero-screen img").evaluate((img) => img.decode());
  assert.equal(await page.locator("h1").count(), 1);
  check("Accueil HTTP 200, titre principal et image chargés");
  for (const width of [320, 390, 540, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 540 ? 844 : 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter(
        (i) => i.complete && !i.naturalWidth,
      ).length,
    }));
    result.layouts.push(layout);
    assert.ok(
      layout.document <= width,
      `Débordement à ${width}px : ${layout.document}`,
    );
    assert.equal(layout.brokenImages, 0);
    if ([390, 768, 1440].includes(width)) {
      // Charge les images différées avant la capture entière.
      await page.locator(".phone-frame img").scrollIntoViewIfNeeded();
      await page.locator(".phone-frame img").evaluate((img) => img.decode());
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `artifacts/qa/site-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `artifacts/qa/hero-${width}.png` });
      await page.addScriptTag({ path: "node_modules/axe-core/axe.min.js" });
      const a11y = await page.evaluate(async () => {
        const r = await axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        });
        return r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        }));
      });
      result.accessibility.push({ width, violations: a11y });
    }
  }
  check("Aucun débordement horizontal de 320 à 1920 pixels, images présentes");
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  assert.equal(await menu.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await menu.getAttribute("aria-expanded"), "false");
  assert.equal(
    await menu.evaluate((el) => el === document.activeElement),
    true,
  );
  await menu.click();
  await page.locator('#main-nav a[href="#a-propos"]').click();
  assert.ok(page.url().endsWith("#a-propos"));
  assert.equal(await menu.getAttribute("aria-expanded"), "false");
  assert.ok(
    await page
      .locator("#about-title")
      .evaluate((el) => el.getBoundingClientRect().top >= 0),
  );
  check(
    "Menu mobile : ouverture, Échap, retour du focus, ancre À propos et fermeture",
  );
  for (const key of ["caisse", "stock", "tarifs", "dashboard"]) {
    await page.locator(`[data-view="${key}"]`).click();
    await page.waitForFunction(
      (k) =>
        document
          .querySelector("#product-image")
          .getAttribute("src")
          .endsWith(k + ".webp") &&
        document
          .querySelector(`[data-view="${k}"]`)
          .getAttribute("aria-pressed") === "true",
      key,
    );
    assert.ok(
      await page
        .locator("#product-image")
        .evaluate((el) => el.complete && el.naturalWidth > 0),
    );
  }
  check(
    "Galerie : quatre vues réelles, état sélectionné et chargement vérifiés",
  );
  await page.getByRole("link", { name: "Donner mon avis" }).click();
  assert.equal(
    await page.locator("#contact-subject").inputValue(),
    "Suggestion",
  );
  assert.deepEqual(
    await page.locator("#contact-subject option").allTextContents(),
    [
      "Choisissez un sujet",
      "Question",
      "Besoin d’aide",
      "Signaler un problème",
      "Suggestion",
      "Partenariat",
      "Autre",
    ],
  );
  assert.ok(await page.locator("#contact-form button").isEnabled());
  assert.equal(requests.filter((r) => r.method !== "GET").length, 0);
  assert.equal(requests.filter((r) => !r.url.startsWith(base)).length, 0);
  check(
    "Contact : sujets conformes, suggestion présélectionnée, formulaire activé sans envoi spontané ni requête externe",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "skip-link",
  );
  await page.keyboard.press("Enter");
  assert.ok(page.url().endsWith("#contenu"));
  check("Lien d’évitement accessible au clavier");
  const access = "https://morashawiri.com/acceder-a-boutiquepilot/";
  assert.equal(await page.locator('a[href="' + access + '"]').count(), 5);
  assert.equal(await page.locator('a[href^="/beta"]').count(), 0);
  check(
    "Les cinq CTA publics passent par la page WordPress, aucun lien direct vers la bêta",
  );
  await page.goto(base + "/beta/");
  assert.equal(await page.title(), "BoutiquePilot");
  assert.equal(await page.locator("#title").textContent(), "Tableau de bord");
  assert.equal(await page.locator("[data-v]").count(), 14);
  assert.ok(
    (await page.locator("#notice").innerText()).includes("démonstration"),
  );
  const beta = await context.request.get(`${base}/beta/`);
  const hash = createHash("sha256")
    .update(await beta.body())
    .digest("hex");
  assert.equal(
    hash,
    "4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5",
  );
  check(
    "Route technique /beta/ : application chargée, 14 modules, contenu servi identique à la référence",
  );
  for (const route of [
    "/Informations%20des%20comptes.txt",
    "/.env",
    "/package.json",
    "/scripts/check.mjs",
  ]) {
    assert.equal((await context.request.get(base + route)).status(), 404);
  }
  check(
    "Le serveur local ne sert que public/, fichiers privés et scripts inaccessibles",
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const plain = await noJs.newPage();
  await plain.goto(base);
  assert.ok(await plain.locator('#main-nav a[href="#contact"]').isVisible());
  assert.ok(await plain.locator("#contact-form button").isDisabled());
  assert.ok(await plain.locator("h1").isVisible());
  check(
    "Sans JavaScript : contenu, navigation et CTA disponibles, formulaire toujours désactivé",
  );
  await noJs.close();
  result.publicPayload = requests.filter((r) => r.url.startsWith(base)).length;
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.requestsFailed, []);
  check("Aucune erreur JavaScript/console ou requête échouée");
  const violations = result.accessibility.flatMap((a) => a.violations);
  await writeFile("artifacts/qa/results.json", JSON.stringify(result, null, 2));
  assert.equal(
    violations.length,
    0,
    `${violations.length} anomalies axe : voir artifacts/qa/results.json`,
  );
  check("Axe WCAG A/AA : aucune violation détectée sur trois formats");
} finally {
  await writeFile("artifacts/qa/results.json", JSON.stringify(result, null, 2));
  await browser.close();
}
