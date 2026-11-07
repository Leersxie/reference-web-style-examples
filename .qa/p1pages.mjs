import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
for (const [name, url] of [['channels','#/channels'],['detail','#/channel/archive'],['terminal','#/terminal']]) {
  await page.goto('http://127.0.0.1:5178/?p=1' + url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `.shots/p1-${name}.png` })
}
console.log('errors', errors.slice(0,5))
await browser.close()
