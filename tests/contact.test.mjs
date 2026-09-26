import test from "node:test";
import assert from "node:assert/strict";
import {
  createContactHandler,
  compose,
  productionLimit,
  localLimiter,
} from "../server/contact.js";

const origin = "https://boutiquepilot.morashawiri.com";
const valid = {
  name: "Test BoutiquePilot",
  email: "visiteur@example.com",
  phone: "",
  subject: "Question",
  message: "Une question concernant les sauvegardes.",
  website: "",
};
const env = {
  SMTP_FROM: "sender@example.com",
  CONTACT_RECIPIENT: "owner@example.com",
  CONTACT_ALLOWED_ORIGINS: origin,
};
function request(data = valid, headers = {}, method = "POST") {
  return new Request(origin + "/api/contact", {
    method,
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    ...(method === "POST"
      ? { body: typeof data === "string" ? data : JSON.stringify(data) }
      : {}),
  });
}
function fixture(options = {}) {
  let sent = [];
  const handler = createContactHandler({
    env,
    limit: async () => false,
    send: async (mail) => {
      sent.push(mail);
      return { accepted: ["owner@example.com"], rejected: [] };
    },
    ...options,
  });
  return { handler, sent };
}
test("un seul e-mail, destinataire fixe et Reply-To visiteur, JSON sans secret", async () => {
  const { handler, sent } = fixture();
  const r = await handler(request({ ...valid, to: "attacker@example.com" }));
  assert.equal(r.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, env.CONTACT_RECIPIENT);
  assert.equal(sent[0].replyTo.address, valid.email);
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.ok(!(await r.text()).includes(valid.email));
});
test("méthode, origine, type et JSON refusés sans SMTP", async () => {
  const { handler, sent } = fixture();
  for (const [req, code] of [
    [request(valid, {}, "GET"), 405],
    [request(valid, { Origin: "https://evil.example" }), 403],
    [request(valid, { Origin: "" }), 403],
    [request(valid, { "Content-Type": "text/plain" }), 415],
    [request("{"), 400],
    [request(null), 422],
    [request("x".repeat(25000)), 413],
  ])
    assert.equal((await handler(req)).status, code);
  assert.equal(sent.length, 0);
});
test("limite des octets réellement lus sans Content-Length", async () => {
  const { handler, sent } = fixture();
  let chunks = 0;
  const stream = new ReadableStream({
    pull(c) {
      chunks++;
      c.enqueue(new Uint8Array(13000));
      if (chunks === 3) c.close();
    },
  });
  const req = new Request(origin + "/api/contact", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: stream,
    duplex: "half",
  });
  assert.equal((await handler(req)).status, 413);
  assert.equal(sent.length, 0);
});
test("honeypot, en-têtes injectés, champs invalides, bornes", async () => {
  const { handler, sent } = fixture();
  for (const bad of [
    { website: "robot" },
    { name: "\r\nBcc: x@y.fr" },
    { email: "a@b.fr\r\nBcc:x@y.fr" },
    { subject: "Inconnu" },
    { message: "court" },
    { message: "x".repeat(5001) },
    { phone: "<script>" },
    { name: " " },
    { email: [] },
    { message: "abc\u0000message" },
  ])
    assert.ok((await handler(request({ ...valid, ...bad }))).status >= 400);
  assert.equal(sent.length, 0);
});
test("HTML utilisateur échappé, aucun fichier ou URL externe, date Comores", () => {
  const mail = compose(
    {
      ...valid,
      name: "<b>A & B</b>",
      message: 'Bonjour <img src="https://evil.example/x">',
    },
    env,
    new Date("2026-09-26T10:00:00Z"),
  );
  assert.ok(!mail.html.includes("<img"));
  assert.ok(mail.html.includes("&lt;img"));
  assert.ok(mail.text.includes("UTC+3"));
  assert.ok(mail.html.includes("13:00"));
  assert.equal(mail.disableUrlAccess, true);
  assert.equal(mail.disableFileAccess, true);
});
test("limitation 429 et service de limitation indisponible : aucun envoi", async () => {
  for (const [limit, code] of [
    [async () => true, 429],
    [
      async () => {
        throw Error("secret");
      },
      503,
    ],
  ]) {
    const f = fixture({ limit });
    const r = await f.handler(request());
    assert.equal(r.status, code);
    assert.equal(f.sent.length, 0);
    assert.ok(!(await r.text()).includes("secret"));
  }
});
test("échec SMTP et rejet du destinataire : pas de faux succès ni fuite", async () => {
  for (const send of [
    async () => {
      throw Error("password=private");
    },
    async () => ({ accepted: [], rejected: ["owner@example.com"] }),
  ]) {
    const { handler } = fixture({ send });
    const r = await handler(request());
    assert.equal(r.status, 503);
    assert.ok(!(await r.text()).includes("private"));
  }
});
test("mode production ne peut pas utiliser le limiteur local", async () => {
  await assert.rejects(
    productionLimit(request(), {
      CONTACT_LOCAL_MODE: "true",
      VERCEL: "1",
      NODE_ENV: "production",
    }),
  );
  const limiter = localLimiter();
  for (let n = 0; n < 5; n++) assert.equal(await limiter(), false);
  assert.equal(await limiter(), true);
});
test("SDK pare-feu : règles contrôlées, quota et refus si règle absente", async () => {
  const originalFetch = globalThis.fetch;
  const req = request(valid, { "x-real-ip": "203.0.113.10" });
  const production = {
    VERCEL: "1",
    CONTACT_FIREWALL_HOST: "boutiquepilot.morashawiri.com",
  };
  let calls = 0;
  try {
    globalThis.fetch = async () => {
      calls++;
      return new Response(null, { status: 204 });
    };
    assert.equal(await productionLimit(req, production), false);
    assert.equal(calls, 2);
    globalThis.fetch = async () => new Response(null, { status: 429 });
    assert.equal(await productionLimit(req, production), true);
    globalThis.fetch = async () => new Response(null, { status: 404 });
    await assert.rejects(productionLimit(req, production));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
