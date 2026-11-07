import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/?tab=motion#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
console.log(await page.evaluate(() => {
  const s = document.querySelector('.hc-seg')
  const cs = getComputedStyle(s)
  const b = s.querySelector('button')
  return { w: s.getBoundingClientRect().width, align: cs.alignSelf, display: getComputedStyle(s.parentElement).display,
           btnW: b.getBoundingClientRect().width, btnFlex: getComputedStyle(b).flex, parentCls: s.parentElement.className }
}))
await browser.close()
