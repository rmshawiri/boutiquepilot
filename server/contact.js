import nodemailer from "nodemailer";
import { checkRateLimit } from "@vercel/firewall";

export const MAX_BYTES = 24576;
export const SUBJECTS = [
  "Question",
  "Besoin d’aide",
  "Signaler un problème",
  "Suggestion",
  "Partenariat",
  "Autre",
];
const unavailable =
  "L’envoi est momentanément indisponible. Réessayez plus tard ou contactez-nous sur WhatsApp.";
const control = /[\x00-\x1f\x7f]/;
const emailPattern =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
export function validate(data) {
  const errors = {};
  if (!data || typeof data !== "object" || Array.isArray(data))
    return { errors: { message: "Formulaire invalide." } };
  const fields = {};
  for (const key of [
    "name",
    "email",
    "phone",
    "subject",
    "message",
    "website",
  ]) {
    if (typeof data[key] !== "string") {
      errors[key] = "Valeur invalide.";
      fields[key] = "";
    } else {
      fields[key] = data[key].trim();
      if (
        ["name", "email", "phone", "subject"].includes(key) &&
        control.test(data[key])
      )
        errors[key] = "Retirez les caractères de contrôle de ce champ.";
    }
  }
  if (
    fields.name.length < 2 ||
    fields.name.length > 100 ||
    control.test(fields.name)
  )
    errors.name = "Indiquez un nom de 2 à 100 caractères.";
  if (fields.email.length > 254 || !emailPattern.test(fields.email))
    errors.email = "Indiquez une adresse e-mail valide.";
  if (
    fields.phone.length > 30 ||
    (fields.phone && !/^[+\d\s().-]{5,30}$/.test(fields.phone)) ||
    control.test(fields.phone)
  )
    errors.phone = "Indiquez un numéro valide ou laissez ce champ vide.";
  if (!SUBJECTS.includes(fields.subject))
    errors.subject = "Choisissez un sujet dans la liste.";
  if (
    fields.message.length < 10 ||
    fields.message.length > 5000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(fields.message)
  )
    errors.message =
      "Votre message doit contenir entre 10 et 5 000 caractères.";
  return { fields, errors };
}
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export function compose(fields, env, now = new Date()) {
  const date =
    new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Indian/Comoro",
      dateStyle: "full",
      timeStyle: "short",
    }).format(now) + " (Comores, UTC+3)";
  const rows = [
    ["Nom", fields.name],
    ["E-mail", fields.email],
    ["Téléphone / WhatsApp", fields.phone || "Non renseigné"],
    ["Sujet", fields.subject],
    ["Date", date],
  ];
  return {
    from: env.SMTP_FROM,
    to: env.CONTACT_RECIPIENT,
    replyTo: { name: fields.name, address: fields.email },
    subject: `[BoutiquePilot] ${fields.subject}`,
    text: `Nouveau message — BoutiquePilot\n\n${rows.map(([k, v]) => `${k} : ${v}`).join("\n")}\n\nMessage :\n${fields.message}`,
    html: `<div style="background:#f1f7fb;padding:24px;font-family:Arial,sans-serif;color:#132f4c"><div style="max-width:640px;margin:auto;background:white;padding:28px;border-top:5px solid #1479b8"><h1 style="font-size:23px">BoutiquePilot</h1><p>Nouveau message depuis le formulaire Contact</p><table style="width:100%;border-collapse:collapse">${rows.map(([k, v]) => `<tr><th style="padding:10px;text-align:left;border-bottom:1px solid #dce6ee">${escape(k)}</th><td style="padding:10px;border-bottom:1px solid #dce6ee">${escape(v)}</td></tr>`).join("")}</table><h2 style="font-size:18px">Message</h2><p style="line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere">${escape(fields.message)}</p><p style="font-size:12px;color:#53697b">Répondez à cet e-mail pour contacter l’expéditeur.<br>MORA Shawiri — Le Choix Optimal pour votre performance</p></div></div>`,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export function transport(env = process.env) {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
    "CONTACT_RECIPIENT",
  ];
  if (required.some((k) => !env[k] || /[\r\n]/.test(env[k])))
    throw new Error("SMTP configuration");
  const port = Number(env.SMTP_PORT);
  if (
    !["true", "false"].includes(env.SMTP_SECURE) ||
    ![465, 587].includes(port) ||
    (port === 465) !== (env.SMTP_SECURE === "true")
  )
    throw new Error("SMTP TLS configuration");
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: env.SMTP_SECURE === "true",
    requireTLS: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    logger: false,
    debug: false,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}
export function localLimiter() {
  let start = Date.now(),
    count = 0;
  return async () => {
    if (Date.now() - start >= 900000) {
      start = Date.now();
      count = 0;
    }
    return ++count > 5;
  };
}
const localLimit = localLimiter();
export async function productionLimit(request, env = process.env) {
  if (
    env.CONTACT_LOCAL_MODE === "true" &&
    !env.VERCEL &&
    env.NODE_ENV !== "production"
  )
    return localLimit();
  if (env.VERCEL !== "1" || !env.CONTACT_FIREWALL_HOST)
    throw new Error("Firewall required");
  const host = env.CONTACT_FIREWALL_HOST;
  if (!/^(boutiquepilot\.morashawiri\.com|[a-z0-9-]+\.vercel\.app)$/.test(host))
    throw new Error("Firewall host");
  const headers = new Headers(request.headers);
  headers.set("host", host);
  for (const [id, key] of [
    ["boutiquepilot-contact-ip", undefined],
    ["boutiquepilot-contact-total", "contact-global"],
  ]) {
    const result = await checkRateLimit(id, {
      headers,
      firewallHostForDevelopment: host,
      ...(key ? { rateLimitKey: key } : {}),
    });
    if (result.error) throw new Error("Firewall unavailable");
    if (result.rateLimited) return true;
  }
  return false;
}
async function readBounded(request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES)
    throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function createContactHandler({
  env = process.env,
  limit = (r) => productionLimit(r, env),
  send = async (mail) => {
    const smtp = transport(env);
    try {
      return await smtp.sendMail(mail);
    } finally {
      smtp.close();
    }
  },
} = {}) {
  return async (request) => {
    const reply = (status, body, extra = {}) =>
      Response.json(body, {
        status,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          ...extra,
        },
      });
    if (request.method !== "POST")
      return reply(
        405,
        { message: "Méthode non autorisée." },
        { Allow: "POST" },
      );
    const allowed = (
      env.CONTACT_ALLOWED_ORIGINS || "https://boutiquepilot.morashawiri.com"
    )
      .split(",")
      .map((s) => s.trim());
    if (
      !allowed.includes(request.headers.get("origin")) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return reply(403, {
        message: "Veuillez envoyer le message depuis le site BoutiquePilot.",
      });
    if (
      !/^application\/json(?:\s*;|$)/i.test(
        request.headers.get("content-type") || "",
      )
    )
      return reply(415, {
        message: "Format de formulaire non pris en charge.",
      });
    let data;
    try {
      data = await readBounded(request);
    } catch (error) {
      return reply(error instanceof RangeError ? 413 : 400, {
        message:
          error instanceof RangeError
            ? "Votre message est trop volumineux."
            : "Le formulaire est invalide.",
      });
    }
    if (typeof data?.website === "string" && data.website.trim())
      return reply(400, { message: "Le formulaire est invalide." });
    const { fields, errors } = validate(data);
    if (Object.keys(errors).length)
      return reply(422, { message: "Vérifiez les champs indiqués.", errors });
    try {
      if (await limit(request))
        return reply(
          429,
          {
            message:
              "Vous avez envoyé plusieurs messages. Patientez 15 minutes ou contactez-nous sur WhatsApp.",
          },
          { "Retry-After": "900" },
        );
    } catch {
      return reply(503, { message: unavailable });
    }
    try {
      const sent = await send(compose(fields, env));
      if (!sent?.accepted?.length || sent.rejected?.length)
        throw new Error("SMTP recipient");
      return reply(200, {
        message:
          "Message envoyé avec succès. Merci de nous avoir contactés. L’équipe BoutiquePilot prendra connaissance de votre message.",
      });
    } catch {
      return reply(503, { message: unavailable });
    }
  };
}
export const contactHandler = createContactHandler();
