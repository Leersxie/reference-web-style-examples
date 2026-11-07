import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/?s=2#/channels', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const anchor = await page.evaluate(() => {
  const b = [...document.querySelectorAll('.hc-tile')][0].getBoundingClientRect()
  return { l: b.left, t: b.top, w: b.width, h: b.height }
})
console.log('anchor', anchor)
await page.getByRole('button', { name: '选择转场类型' }).click()
await page.getByRole('option', { name: '共享主体' }).click()
await page.getByRole('button', { name: /争锋频道/ }).first().click()
await page.waitForTimeout(120)
for (let i = 0; i < 4; i++) {
  console.log(i, await page.evaluate(() => {
    const c = document.querySelector('.hc-tx__clone')
    const t = document.querySelector('[data-shared-title]')
    const cr = c?.getBoundingClientRect()
    const tr = t?.getBoundingClientRect()
    return {
      clone: c ? { top: c.style.top, left: c.style.left, transform: getComputedStyle(c).transform, rectTop: Math.round(cr.top), rectH: Math.round(cr.height) } : null,
      target: tr ? { top: Math.round(tr.top), h: Math.round(tr.height), w: Math.round(tr.width) } : null,
      scrollY,
    }
  }))
  await page.waitForTimeout(130)
}
await browser.close()
