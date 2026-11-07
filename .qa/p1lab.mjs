import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const errors = []
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
const page = await ctx.newPage()
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto('http://127.0.0.1:5178/?tab=tokens#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
await page.screenshot({ path: '.shots/p1-lab-tokens.png' })

await page.getByRole('button', { name: /转场实验/ }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: '.shots/p1-lab-motion.png' })

await page.getByRole('button', { name: '播放' }).first().click()
await page.waitForTimeout(300)
await page.screenshot({ path: '.shots/p1-lab-phase.png' })
await page.waitForTimeout(900)
console.log('phase after', await page.locator('.hc-motion__status b').first().textContent())
console.log('errors', errors.slice(0, 6))
await browser.close()
