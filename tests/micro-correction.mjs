import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({channel:'chrome'});
await mkdir('artifacts/qa/micro', {recursive:true});
try {
  for (const mobile of [false,true]) {
    const context = await browser.newContext({viewport:{width:mobile?390:1440,height:900},isMobile:mobile,hasTouch:mobile});
    const page = await context.newPage(), errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(base);
    for (const width of mobile?[320,390,540,768]:[1024,1440]) {
      await page.setViewportSize({width,height:900});
      const layout = await page.evaluate(()=>{
        const logo=document.querySelector('.header .brand img'), slogan=document.querySelector('.brand-slogan');
        const a=document.querySelector('.header .brand').getBoundingClientRect();
        const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.header .nav');
        const other=(getComputedStyle(menu).display!=='none'?menu:nav).getBoundingClientRect();
        const r=logo.getBoundingClientRect();
        return {overlap:a.right>other.left,width:document.documentElement.scrollWidth,height:document.querySelector('.header').offsetHeight,ratio:r.width/r.height,loaded:logo.naturalWidth>0,slogan:slogan.textContent.trim()};
      });
      assert.equal(layout.overlap,false,`header overlap ${width}`);
      assert.ok(layout.width<=width);assert.equal(layout.ratio,1);assert.ok(layout.loaded);
      assert.ok(layout.height<=90);assert.equal(layout.slogan,'Gérez mieux. Vendez mieux.');
      if ([390,1440].includes(width)) await page.locator('.header').screenshot({path:`artifacts/qa/micro/header-${width}.png`});
    }
    await page.setViewportSize({width:mobile?390:1440,height:900});
    if (mobile) {
      await page.getByRole('button',{name:'Menu',exact:true}).tap();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.getByRole('button',{name:'Menu',exact:true}).tap();
    }
    await page.goto(base+'/beta/');
    const nav=async name=>{if(mobile) await page.locator('.mobile-menu').tap();await page.locator(`[data-v="${name}"]`).click();};
    await nav('products');
    const filter=page.locator('#filter_category + .bp-select');
    await filter.click();
    assert.equal(await filter.getAttribute('aria-expanded'),'true');
    if(mobile) await page.getByRole('option',{name:'Alimentation',exact:true}).tap();
    else await page.getByRole('option',{name:'Alimentation',exact:true}).click();
    assert.equal(await filter.innerText(),'Alimentation');
    assert.ok(await page.locator('#filter_category').inputValue());
    await filter.focus();await page.keyboard.press('Enter');await page.keyboard.press('Home');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#filter_category').inputValue(),'');
    await nav('pos');
    const pack=page.locator('select[id^="posPack_"]').first();
    const original=await pack.evaluate(s=>[...s.options].map(o=>({value:o.value,label:o.textContent})));
    const control=page.locator('select[id^="posPack_"] + .bp-select').first();
    await control.click();
    assert.deepEqual(await page.getByRole('option').allTextContents(),original.map(x=>x.label));
    await page.keyboard.press('End');await page.keyboard.press('Enter');
    assert.equal(await pack.inputValue(),original.at(-1).value);
    assert.deepEqual(await pack.evaluate(s=>[...s.options].map(o=>({value:o.value,label:o.textContent}))),original);
    await page.getByRole('button',{name:'Ajouter au panier',exact:true}).first().click();
    const payment=page.locator('#f_payment + .bp-select');
    await payment.scrollIntoViewIfNeeded();
    if(mobile) await payment.tap();else await payment.click();
    await page.keyboard.press('h');await page.keyboard.press('Enter');
    assert.equal(await payment.innerText(),'Holo');
    assert.equal(await page.locator('#f_payment').evaluate(s=>new FormData(s.form).get('payment')),await page.locator('#f_payment').inputValue());
    // Programmatic assignment and reset retain the native form semantics.
    await page.locator('#f_payment').evaluate(s=>{s.selectedIndex=0;});
    assert.equal(await payment.innerText(),await page.locator('#f_payment').evaluate(s=>s.selectedOptions[0].textContent));
    await payment.click();
    await page.screenshot({path:`artifacts/qa/micro/dropdown-${mobile?'mobile':'desktop'}.png`});
    const bounds=await page.locator('.bp-options').boundingBox();
    assert.ok(bounds.x>=0&&bounds.x+bounds.width<=(mobile?390:1440)&&bounds.y>=0&&bounds.y+bounds.height<=901);
    await page.keyboard.press('Escape');assert.equal(await page.locator('.bp-options').count(),0);
    await nav('stock');
    await page.getByRole('button',{name:'+ Réception',exact:true}).click();
    const product=page.locator('#f_product + .bp-select');
    await product.click();await page.keyboard.press('End');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#f_pack + .bp-select').innerText(),await page.locator('#f_pack').evaluate(s=>s.selectedOptions[0]?.textContent||'—'));
    await product.click();await page.keyboard.press('Escape');assert.equal(await page.locator('.modal.open').count(),1);
    await page.keyboard.press('Tab');assert.equal(await page.locator('.bp-options').count(),0);
    // Exercise native required validation without submitting any business operation.
    await page.locator('#f_product').evaluate(s=>{s.required=true;s.selectedIndex=-1;s.reportValidity();});
    assert.equal(await product.getAttribute('aria-invalid'),'true');assert.ok(await product.evaluate(b=>b===document.activeElement));
    await product.click();await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#f_product').evaluate(s=>s.validity.valid),true);
    await page.keyboard.press('Escape');
    assert.deepEqual(errors,[]);
    console.log(`OK ${mobile?'mobile tactile émulé':'desktop'} : header, menu, filtres, formats, règlements, formulaire dynamique, clavier et validation`);
    await context.close();
  }
} finally { await browser.close(); }
