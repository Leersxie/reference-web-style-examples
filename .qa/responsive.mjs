import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const routes = ['#/', '#/channels', '#/channel/arena', '#/terminal', '#/lab']
for (const [w, h] of [[1920,1080],[1440,900],[1024,768],[820,900],[768,1024],[430,932],[390,844],[360,800]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage()
  const out = []
  for (const r of routes) {
    await page.goto('http://127.0.0.1:5178/' + r, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      sh: document.documentElement.scrollHeight,
    }))
    out.push(`${r} sw=${m.sw}${m.sw > m.cw + 1 ? ' OVERFLOW' : ''} h=${m.sh}`)
  }
  console.log(`${w}x${h}`, '|', out.join(' | '))
  if (w === 1024 || w === 768 || w === 430) {
    await page.goto('http://127.0.0.1:5178/#/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    await page.screenshot({ path: `.shots/r-${w}-home.png` })
    await page.goto('http://127.0.0.1:5178/#/lab', { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    await page.screenshot({ path: `.shots/r-${w}-lab.png` })
  }
  await ctx.close()
}
await browser.close()
