import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/#/terminal', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.getByRole('searchbox').fill('不存在的关键词')
await page.waitForTimeout(300)
console.log(await page.evaluate(() => {
  const i = document.querySelector('input[type=search]')
  const cs = getComputedStyle(i)
  const w = i.parentElement
  return { outline: cs.outline, outlineColor: cs.outlineColor, border: cs.border, boxShadow: cs.boxShadow,
           wrapBorder: getComputedStyle(w).borderColor }
}))
await page.locator('.hc-term__bar').screenshot({ path: '.shots/focus-bar.png' })
await browser.close()
