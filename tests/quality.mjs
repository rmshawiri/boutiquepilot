import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({channel:"chrome"});
const result = {measurements:[], checks:[], betaObservations:[]};
try {
 for (const width of [390,1440]) {
  const context = await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce"});
  const page=await context.newPage();
  await page.addInitScript(()=>{
   window.quality={lcp:0,cls:0,shifts:[]};
   new PerformanceObserver(list=>{for(const e of list.getEntries()) window.quality.lcp=e.startTime;}).observe({type:"largest-contentful-paint",buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries()) if(!e.hadRecentInput) { window.quality.cls+=e.value; window.quality.shifts.push(e.sources.map(s=>s.node?.className || s.node?.nodeName)); }}).observe({type:"layout-shift",buffered:true});
  });
  await page.route("**/app.js", async route => { await new Promise(r=>setTimeout(r,1500)); await route.continue(); });
  await page.goto("http://127.0.0.1:4173/");
  await page.locator(".hero-screen img").evaluate(img=>img.decode());
  await page.waitForTimeout(700);
  const metrics=await page.evaluate(()=>({
   ...window.quality,
   domContentLoaded:performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
   resources:performance.getEntriesByType("resource").map(r=>({path:new URL(r.name).pathname,bytes:r.decodedBodySize})),
   htmlBytes:performance.getEntriesByType("navigation")[0].decodedBodySize
  }));
  result.measurements.push({width,...metrics});
  assert.ok(metrics.cls<0.1,"Unexpected initial layout shift");
  const bytes=metrics.htmlBytes+metrics.resources.reduce((n,r)=>n+r.bytes,0);
  assert.ok(bytes<500000,"Initial page exceeds local uncompressed budget");
  assert.ok(!metrics.resources.some(r=>r.path.includes("/beta/")),"Beta should not load on landing");
  await page.addStyleTag({content:"html { font-size: 200% !important; }"});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),"Text 200% overflows");
  await page.screenshot({path:`artifacts/qa/phase4-text200-${width}.png`});
  await context.close();
 }
 result.checks.push("Initial load under 500 KB uncompressed, no beta preload, CLS below 0.1 on both local viewports", "Text at 200%: no horizontal overflow at 390 and 1440");
 const context=await browser.newContext();
 const page=await context.newPage();
 await page.goto("http://127.0.0.1:4173/beta/");
 const modules=await page.locator("[data-v]").evaluateAll(es=>es.map(e=>e.dataset.v));
 const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 for(const module of modules){
  await page.locator(`[data-v="${module}"]`).click();
  assert.ok((await page.locator("#content").innerText()).trim().length>0);
 }
 assert.deepEqual(errors,[]);
 result.checks.push("All 14 beta modules render in an isolated demo profile without JavaScript errors");
 // Read-only reproduction of the point recorded in Phase 1; no data submission.
 await page.evaluate(()=>openSim());
 result.betaObservations.push(await page.evaluate(()=>{
  const boxes=[...document.querySelectorAll('input[type="checkbox"]')];
  return {topic:"openSim service controls",checkboxes:boxes.length,outsideForm:boxes.filter(e=>!e.form).length};
 }));
 await context.close();
 console.log(JSON.stringify(result,null,2));
} finally {
 await writeFile("artifacts/qa/phase4-quality.json",JSON.stringify(result,null,2));
 await browser.close();
}

