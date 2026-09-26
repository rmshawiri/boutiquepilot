import { Readable } from "node:stream";
import { contactHandler, MAX_BYTES } from "../server/contact.js";

export default async function handler(req, res) {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers))
      if (value !== undefined)
        headers.set(key, Array.isArray(value) ? value.join(",") : value);
    const rejectBody = (status, message) => {
      res.writeHead(status, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      return res.end(JSON.stringify({ message }));
    };
    if (Number(req.headers["content-length"]) > MAX_BYTES)
      return rejectBody(413, "Votre message est trop volumineux.");
    let parsedBody;
    try {
      parsedBody = req.body;
    } catch {
      return rejectBody(400, "Le formulaire est invalide.");
    }
    let body;
    if (!["GET", "HEAD"].includes(req.method)) {
      body =
        parsedBody !== undefined
          ? typeof parsedBody === "string" || Buffer.isBuffer(parsedBody)
            ? parsedBody
            : JSON.stringify(parsedBody)
          : Readable.toWeb(req);
      if (typeof body === "string" || Buffer.isBuffer(body)) {
        if (Buffer.byteLength(body) > MAX_BYTES) {
          res.writeHead(413, {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          });
          return res.end(
            JSON.stringify({ message: "Votre message est trop volumineux." }),
          );
        }
      }
    }
    const response = await contactHandler(
      new Request("https://boutiquepilot.morashawiri.com/api/contact", {
        method: req.method,
        headers,
        body,
        duplex: "half",
      }),
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
  } catch {
    res.writeHead(503, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(
      JSON.stringify({
        message:
          "L’envoi est momentanément indisponible. Contactez-nous sur WhatsApp.",
      }),
    );
  }
}
