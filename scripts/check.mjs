import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const expected =
  "93007be8d597940ee10e6ec4be1dc25a25eec7f7b03978201c83fce111a464be";
const hash = (b) => createHash("sha256").update(b).digest("hex");
assert.equal(
  hash(await readFile("public/beta/BoutiquePilot.html")),
  expected,
  "Copie bêta altérée",
);
try {
  const original = await readFile("../01 Notre Outil/BoutiquePilot.html");
  assert.equal(hash(original), expected, "Référence bêta altérée");
  console.log(
    "Référence et copie : SHA-256 identiques à l’empreinte approuvée.",
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("Build isolé : copie bêta conforme à l’empreinte approuvée.");
}
const html = await readFile("public/index.html", "utf8");
assert.equal(
  (
    html.match(
      /href="https:\/\/morashawiri\.com\/acceder-a-boutiquepilot\/"/g,
    ) || []
  ).length,
  5,
  "Les cinq CTA doivent passer par WordPress",
);
assert.ok(
  !/href="\/beta(?:\/|")/.test(html),
  "Un CTA contourne la page d’accès",
);
assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
for (const id of [
  "accueil",
  "fonctionnalites",
  "apercu",
  "a-propos",
  "contact",
])
  assert.ok(html.includes(`id="${id}"`));
for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  if (match[1] === "/beta/" || match[1] === "/") continue;
  await readFile(resolve("public", "." + match[1]));
}
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    assert.ok(
      !/\.env|Informations des comptes|\.git/i.test(entry.name),
      `Fichier interdit : ${file}`,
    );
    if (entry.isDirectory()) await scan(file);
    else if (/\.(html|js|css|json|txt|xml)$/.test(file)) {
      const text = await readFile(file, "utf8");
      assert.ok(
        !/(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|sb_secret_[A-Za-z0-9_-]+|postgres(?:ql)?:\/\/)/.test(
          text,
        ),
        `Secret potentiel : ${file}`,
      );
    }
  }
}
await scan("public");
console.log(
  "Structure, assets et contrôle des motifs de secrets : OK. Aucun fichier transformé.",
);
