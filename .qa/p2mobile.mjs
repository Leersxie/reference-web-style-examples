import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
for (const w of [430, 390, 820]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  for (const [name, url] of [['home','#/'],['channels','#/channels'],['detail','#/channel/archive']]) {
    await page.goto(`http://127.0.0.1:5178/?m=${w}#` + url.slice(1), { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    await page.screenshot({ path: `.shots/p2-${w}-${name}.png`, fullPage: name === 'home' })
  }
  console.log(w, await page.evaluate(() => document.documentElement.scrollWidth), errors.slice(0,2))
  await ctx.close()
}
await browser.close()
