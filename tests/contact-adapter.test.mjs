import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";

test("Vercel lazy body parsing: reject size before parsing and hide parser details", async () => {
  for (const [length, expected] of [[24577, 413], [1, 400]]) {
    let read = false, status, response;
    const req = { method: "POST", headers: { "content-length": String(length) },
      get body() { read = true; throw new Error("private parser detail"); } };
    const res = { writeHead(code) { status = code; }, end(body) { response = body; } };
    await handler(req, res);
    assert.equal(status, expected);
    assert.equal(read, expected === 400);
    assert.ok(!response.includes("private"));
  }
});
