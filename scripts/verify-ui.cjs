const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.HSO_URL || 'http://127.0.0.1:4173/';
const output = 'output/playwright';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    for (const [width, height] of [[320, 740], [360, 800], [390, 844], [768, 1024], [844, 390], [1024, 768], [1440, 1000]]) {
      const touch = width < 1024;
      const page = await browser.newPage({ viewport: { width, height }, hasTouch: touch, isMobile: touch });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base);
      const frame = page.frames().find(item => /sublevel-studio/.test(item.url())) || await page.waitForEvent('frameattached');
      await frame.locator('.hso-lobby-card').waitFor();
      await frame.locator('.hso-atmosphere[data-animation-active]').waitFor();
      await page.waitForTimeout(1100);
      const overflow = () => frame.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(await overflow(), false, `hero overflow at ${width}`);
      const hero = await frame.locator('.hso-lobby-card').boundingBox();
      assert(hero.x >= 0 && hero.x + hero.width <= width + 1, `hero fit at ${width}`);
      await page.screenshot({ path: `${output}/home-${width}.png` });

      const burger = frame.locator('.burger');
      await burger.click();
      await frame.locator('.menu.open').waitFor();
      await page.waitForTimeout(900);
      assert.equal(await frame.locator('.menu-close').evaluate(el => el === document.activeElement), true);
      assert.equal(await frame.locator('#layout').evaluate(el => el.inert), true);
      assert.equal(await frame.locator('.hso-atmosphere').getAttribute('data-animation-active'), 'false');
      if (touch) {
        for (const link of await frame.locator('.menu-nav a').all()) {
          const box = await link.boundingBox();
          assert(box.width > 180 && box.height >= 44, `menu target at ${width}`);
        }
      }
      await page.screenshot({ path: `${output}/menu-${width}.png` });
      await frame.locator('.menu-close').press('Shift+Tab');
      assert.equal(await frame.locator('.menu-nav a').last().evaluate(el => el === document.activeElement), true);
      await frame.locator('.menu-nav a').last().press('Tab');
      assert.equal(await frame.locator('.menu-close').evaluate(el => el === document.activeElement), true);
      await frame.locator('.menu-close').press('Escape');
      assert.equal(await burger.evaluate(el => el === document.activeElement), true);

      await frame.locator('.hso-actions a').first().click();
      await page.waitForTimeout(1000);
      assert.equal(await overflow(), false, `downloads overflow at ${width}`);
      const downloadY = await frame.locator('#showcase').evaluate(el => el.getBoundingClientRect().top);
      assert(downloadY >= 65 && downloadY < 140, `download anchor at ${width}: ${downloadY}`);
      assert.equal(await frame.locator('.hso-atmosphere').getAttribute('data-animation-active'), 'false');
      await page.screenshot({ path: `${output}/downloads-${width}.png` });

      const shot = frame.locator('#skin-moi .shot').first();
      await shot.click();
      await frame.locator('.hso-gallery[open]').waitFor();
      assert.match(await frame.locator('.hso-gallery-controls p').textContent(), /^1 \/ 4/);
      await frame.locator('[data-next]').click();
      assert.match(await frame.locator('.hso-gallery-controls p').textContent(), /^2 \/ 4/);
      await frame.locator('[data-next]').press('ArrowLeft');
      assert.match(await frame.locator('.hso-gallery-controls p').textContent(), /^1 \/ 4/);
      if (width === 390) {
        const cdp = await page.context().newCDPSession(page);
        const box = await frame.locator('.hso-gallery img').boundingBox();
        const x = box.x + box.width * .8, y = box.y + box.height * .5;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 6; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - step * 22, y }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        assert.match(await frame.locator('.hso-gallery-controls p').textContent(), /^2 \/ 4/);
        await page.screenshot({ path: `${output}/gallery-${width}.png` });
      }
      await frame.locator('.hso-gallery button[type=submit]').click();
      assert.equal(await shot.evaluate(el => el === document.activeElement), true);
      await frame.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(1000);
      assert.equal(await overflow(), false, `footer overflow at ${width}`);
      assert(await frame.locator('.hso-gallery').evaluate(el => !el.open));
      await page.screenshot({ path: `${output}/footer-${width}.png` });
      assert.deepEqual(errors, [], `browser errors at ${width}`);
      results.push({ width, height, touch, overflow: false, menu: 'pass', gallery: 'pass', errors });
      await page.close();
    }

    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    await page.goto(base);
    const frame = page.frameLocator('iframe');
    await frame.locator('.hso-atmosphere[data-animation-active]').waitFor({ state: 'attached' });
    assert.equal(await frame.locator('.hso-atmosphere').getAttribute('data-animation-active'), 'false');
    assert.equal(await frame.locator('#ps-output').count(), 0);
    await frame.locator('.burger').click();
    await frame.locator('.menu.open').waitFor();
    assert.equal(await frame.locator('.menu-links').evaluate(el => getComputedStyle(el).transform), 'none');
    await frame.locator('.menu-close').press('Escape');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await frame.locator('#ps-output').waitFor({ state: 'attached' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await frame.locator('#ps-output').waitFor({ state: 'detached' });
    assert.equal(await frame.locator('.ps-hidden').count(), 0);
    results.push({ reducedMotion: 'pass', livePreferenceChange: 'pass' });
    await page.close();

    const fallback = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const fallbackErrors = [];
    fallback.on('pageerror', error => fallbackErrors.push(error.message));
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        return /webgl/.test(type) ? null : original.call(this, type, ...args);
      };
    });
    await fallback.goto(base);
    const fallbackFrame = fallback.frameLocator('iframe');
    await fallbackFrame.locator('.hso-atmosphere[data-animation-active]').waitFor();
    await fallbackFrame.locator('.burger').click();
    await fallbackFrame.locator('.menu.open').waitFor();
    assert.equal(await fallbackFrame.locator('.menu-links').evaluate(el => getComputedStyle(el).transform), 'none');
    assert.equal(await fallbackFrame.locator('.ps-hidden').count(), 0);
    assert.deepEqual(fallbackErrors, []);
    results.push({ withoutWebGL: 'pass', errors: fallbackErrors });
    fs.writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
