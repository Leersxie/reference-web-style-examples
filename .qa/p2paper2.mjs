import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
await ctx.addInitScript(() => localStorage.setItem('honeycity.prefs.v1', JSON.stringify({ speed: 1, quick: false, motion: 'system', theme: 'paper' })))
const page = await ctx.newPage()
for (const [name, url] of [['terminal','#/terminal'],['detail','#/channel/hive'],['lab','?tab=tokens#/lab']]) {
  await page.goto('http://127.0.0.1:5178/?pp=1' + url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `.shots/p2-paper-${name}.png` })
}
await browser.close()
