import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', e => errors.push(e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
const shots = [
  ['steps', '阶梯推挤', 300],
  ['shutter', '四向快门', 200],
  ['sheet', '纸面翻页', 240],
  ['glitch', '信号故障', 160],
]
for (const [name, label, wait] of shots) {
  await page.goto(`http://127.0.0.1:5178/?tx=${name}#/channels`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: '选择转场类型' }).click()
  await page.getByRole('option', { name: label }).click()
  await page.getByRole('button', { name: /争锋频道/ }).first().click()
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `.shots/p22-tx-${name}.png` })
  await page.waitForTimeout(1400)
  const done = await page.evaluate(() => document.querySelectorAll('.hc-tx-root').length === 0 && location.hash === '#/channel/arena')
  console.log(name, done ? 'OK' : 'STUCK')
}
console.log('errors', errors.slice(0, 5))
await browser.close()
