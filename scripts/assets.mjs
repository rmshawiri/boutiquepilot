import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, mkdir, access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const expected =
  "93007be8d597940ee10e6ec4be1dc25a25eec7f7b03978201c83fce111a464be";
const source = resolve("../01 Notre Outil/BoutiquePilot.html");
const hash = (b) => createHash("sha256").update(b).digest("hex");
if (hash(await readFile(source)) !== expected)
  throw new Error("Référence modifiée : génération interrompue.");
await mkdir("artifacts/product", { recursive: true });
const logo = resolve("../03 Logos/Logo BoutiquePilot Transparent.png");
const icon = resolve("../03 Logos/Icône BoutiquePilot.png");
async function missing(path, action) {
  try {
    await access(path);
    console.log(`Conservé : ${path}`);
  } catch {
    await action();
    console.log(`Créé : ${path}`);
  }
}
await missing("public/assets/logo.webp", () =>
  sharp(logo)
    .resize(128, 128, { fit: "inside" })
    .webp({ quality: 90 })
    .toFile("public/assets/logo.webp"),
);
await missing("public/assets/favicon.png", () =>
  sharp(icon).resize(32, 32).png().toFile("public/assets/favicon.png"),
);
await missing("public/assets/apple-touch-icon.png", () =>
  sharp(icon)
    .resize(180, 180)
    .png()
    .toFile("public/assets/apple-touch-icon.png"),
);
await missing("public/assets/share.png", async () => {
  const mark = await sharp(logo).resize(480, 480, { fit: "inside" }).toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: "#f1f7fb" },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile("public/assets/share.png");
});
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1040 },
    deviceScaleFactor: 1,
    offline: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    pathToFileURL(resolve("public/beta/BoutiquePilot.html")).href,
  );
  for (const [name, module] of [
    ["dashboard", "dash"],
    ["caisse", "pos"],
    ["stock", "products"],
    ["tarifs", "prices"],
  ]) {
    await page.locator(`[data-v="${module}"]`).click();
    await missing(`public/assets/${name}.webp`, async () => {
      const buffer = await page.screenshot({
        path: `artifacts/product/${name}.png`,
      });
      await sharp(buffer)
        .webp({ quality: 88 })
        .toFile(`public/assets/${name}.webp`);
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".mobile-menu").click();
  await page.locator('[data-v="pos"]').click();
  await missing("public/assets/mobile-caisse.webp", async () => {
    const buffer = await page.screenshot({
      path: "artifacts/product/mobile-caisse.png",
    });
    await sharp(buffer)
      .webp({ quality: 88 })
      .toFile("public/assets/mobile-caisse.webp");
  });
  if (errors.length)
    throw new Error(`Erreurs navigateur : ${errors.join("; ")}`);
} finally {
  await browser.close();
}
if (hash(await readFile(source)) !== expected)
  throw new Error("Référence modifiée.");
console.log("Captures réelles, profil isolé, zéro modification du HTML.");
