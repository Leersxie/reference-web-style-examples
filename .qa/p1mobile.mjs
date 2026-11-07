import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
for (const w of [1920, 820, 430, 360]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w >= 1000 ? 1000 : 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:5178/?w=' + w + '#/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `.shots/p1-w${w}-home.png` })
  await page.goto('http://127.0.0.1:5178/?w=' + w + '#/channels', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `.shots/p1-w${w}-channels.png` })
  console.log(w, await page.evaluate(() => document.documentElement.scrollWidth), await page.evaluate(() => document.documentElement.clientWidth))
  await ctx.close()
}
await browser.close()
