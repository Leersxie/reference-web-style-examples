import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
await ctx.addInitScript(() => {
  localStorage.setItem('honeycity.prefs.v1', JSON.stringify({ speed: 1, quick: false, motion: 'system', theme: 'paper' }))
})
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
for (const [name, url] of [['home','#/'],['channels','#/channels'],['detail','#/channel/hive'],['terminal','#/terminal'],['lab','?tab=motion#/lab']]) {
  await page.goto('http://127.0.0.1:5178/?paper=1' + url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `.shots/p1-paper-${name}.png` })
}
console.log('theme attr', await page.evaluate(() => document.documentElement.dataset.theme))
console.log('errors', errors.slice(0, 5))
await browser.close()
