import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
const page = await ctx.newPage()
await page.goto('http://127.0.0.1:5178/?dbg=9#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1100)
console.log(await page.evaluate(() => {
  const paper = document.querySelector('.hc-cover__paper')
  const cs = getComputedStyle(paper)
  const anims = paper.getAnimations({ subtree: false }).map(a => ({ name: a.animationName, state: a.playState, time: a.currentTime }))
  return {
    opacity: cs.opacity,
    class: paper.closest('.hc-home')?.className,
    reduce: document.documentElement.dataset.reduce,
    anims,
  }
}))
await browser.close()
