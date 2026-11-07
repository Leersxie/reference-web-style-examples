import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
for (const [name, url] of [['channels','#/channels'],['detail','#/channel/arena'],['terminal','#/terminal'],['lab','?tab=motion#/lab']]) {
  await page.goto('http://127.0.0.1:5178/?p2=2' + url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `.shots/p2-${name}.png` })
}
console.log('errors', errors.slice(0,5))
await browser.close()
