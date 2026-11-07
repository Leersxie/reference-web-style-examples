import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/?d=1#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.getByRole('button', { name: /转场实验/ }).click()
await page.waitForTimeout(500)
console.log(await page.evaluate(() => {
  const seg = [...document.querySelectorAll('.hc-motion__inline .hc-seg__btn')].map(b => ({
    t: b.textContent, pressed: b.getAttribute('aria-pressed'),
    bg: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color,
    focus: document.activeElement === b,
  }))
  const tg = document.querySelector('.hc-lab-settings .hc-toggle input')
  const r = tg?.getBoundingClientRect()
  return { seg, toggle: r ? { w: r.width, h: r.height } : null, hover: document.querySelectorAll(':hover').length }
}))
await browser.close()
