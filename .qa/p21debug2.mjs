import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/?dbg=1#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
console.log('HOME', await page.evaluate(() => ({
  btnClip: getComputedStyle(document.querySelector('.hc-cover__actions .hc-btn')).clipPath,
  cutVar: getComputedStyle(document.querySelector('.hc-cover__actions .hc-btn')).getPropertyValue('--cut'),
  btnVarRoot: getComputedStyle(document.documentElement).getPropertyValue('--cut'),
  btnClass: document.querySelector('.hc-cover__actions .hc-btn')?.className,
  corridor: document.querySelectorAll('.hc-corridor__row').length,
  corridorClip: getComputedStyle(document.querySelector('.hc-corridor__row')).clipPath,
})))
await page.goto('http://127.0.0.1:5178/?dbg=2#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.getByRole('button', { name: /组件状态/ }).click()
await page.waitForTimeout(500)
console.log('LAB', await page.evaluate(() => ({
  tab: document.querySelector('.hc-work__navitem[aria-current="true"]')?.textContent?.slice(0,10),
  stateTable: document.querySelectorAll('.hc-state-table').length,
  navitem: document.querySelectorAll('.hc-work__navitem').length,
  navClip: getComputedStyle(document.querySelector('.hc-work__navitem')).clipPath,
})))
await browser.close()
