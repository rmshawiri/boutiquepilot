import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [];
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:4173/#contact");
  let mode = "success",
    calls = 0;
  await page.route("**/api/contact", async (route) => {
    calls++;
    const data = route.request().postDataJSON();
    assert.equal(data.website, "");
    assert.equal(data.subject, "Question");
    await new Promise((r) => setTimeout(r, 300));
    if (mode === "network") return route.abort();
    const status =
      mode === "success"
        ? 200
        : mode === "validation"
          ? 422
          : mode === "limited"
            ? 429
            : 503;
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(
        mode === "validation"
          ? { errors: { email: "Indiquez une adresse e-mail valide." } }
          : { message: "Contrôle simulé" },
      ),
    });
  });
  await page.locator(".form-submit").click();
  assert.equal(calls, 0);
  checks.push("Champs obligatoires bloquent un formulaire vide");
  async function fill() {
    await page.locator("#contact-name").fill("Test interface");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-subject").selectOption("Question");
    await page
      .locator("#contact-message")
      .fill("Message de contrôle simulé, sans envoi SMTP.");
  }
  for (const next of [
    "success",
    "failure",
    "validation",
    "limited",
    "network",
  ]) {
    mode = next;
    await fill();
    await page.locator(".form-submit").click();
    assert.equal(await page.locator(".form-submit").isDisabled(), true);
    await page.waitForFunction(
      () => !document.querySelector(".form-submit").disabled,
    );
    if (mode === "success") {
      assert.equal(await page.locator("#contact-name").inputValue(), "");
      assert.equal(
        await page.locator("#contact-status").getAttribute("data-state"),
        "success",
      );
    } else {
      assert.ok(
        (await page.locator("#contact-message").inputValue()).includes(
          "simulé",
        ),
      );
      assert.equal(
        await page.locator("#contact-status").getAttribute("data-state"),
        "error",
      );
    }
    if (mode === "validation") {
      assert.equal(
        await page.locator("#contact-email").getAttribute("aria-invalid"),
        "true",
      );
      assert.equal(
        await page
          .locator("#contact-email")
          .evaluate((el) => el === document.activeElement),
        true,
      );
    }
    checks.push(
      `État ${next}, attente et conservation/réinitialisation conformes`,
    );
  }
  await page.screenshot({ path: "artifacts/qa/contact-phase3-mobile.png" });
  await writeFile(
    "artifacts/qa/contact-browser.json",
    JSON.stringify({ checks, calls, realEmails: 0 }, null, 2),
  );
  console.log(checks.join("\n"));
} finally {
  await browser.close();
}
