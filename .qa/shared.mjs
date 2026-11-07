import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/?s=1#/channels', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.getByRole('button', { name: '选择转场类型' }).click()
await page.getByRole('option', { name: '共享主体' }).click()
await page.getByRole('button', { name: /争锋频道/ }).first().click()
for (const ms of [160, 380, 620]) {
  await page.waitForTimeout(ms === 160 ? 160 : 220)
  const st = await page.evaluate(() => {
    const c = document.querySelector('.hc-tx__clone')
    const t = document.querySelector('[data-shared-title]')
    const r = c?.getBoundingClientRect()
    return {
      clone: c ? { text: c.textContent, l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), fs: getComputedStyle(c).fontSize, op: getComputedStyle(c).opacity, color: getComputedStyle(c).color } : null,
      targetVis: t ? getComputedStyle(t).visibility : null,
      scrollY,
    }
  })
  console.log(ms, st)
  await page.screenshot({ path: `.shots/shared-${ms}.png` })
}
await page.waitForTimeout(900)
await page.screenshot({ path: '.shots/shared-end.png' })
await browser.close()
