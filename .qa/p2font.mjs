import { chromium } from 'playwright-core'
const results = []
const ok = (name, cond, extra='') => { results.push(`${cond?'PASS':'FAIL'}  ${name}${extra?' — '+extra:''}`); if(!cond) process.exitCode = 1 }
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
for (const url of ['http://127.0.0.1:5178/#/', 'file:///H:/Workbuddy%20cangku/mrfz/honey-city.html#/']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  const info = await page.evaluate(async () => {
    await document.fonts.ready
    const title = document.querySelector('h1')
    const faces = [...document.fonts].map((f) => f)
    return {
      noto: document.fonts.check('900 40px "Noto Sans SC"'),
      oswald: document.fonts.check('500 12px "Oswald"'),
      plex: document.fonts.check('400 12px "IBM Plex Mono"'),
      h1font: title ? getComputedStyle(title).fontFamily : '',
      h1weight: title ? getComputedStyle(title).fontWeight : '',
      loadedCount: faces.filter((f) => f.status === 'loaded').length,
      inStack: (n) => (title ? getComputedStyle(title).fontFamily : '').includes(n),
    }
  })
  const scope = url.includes('file') ? 'FILE' : 'DEV'
  ok(`[${scope}] Noto Sans SC 可用`, info.noto === true, JSON.stringify(info.loadedCount))
  ok(`[${scope}] Oswald 可用`, info.oswald === true)
  ok(`[${scope}] IBM Plex Mono 可用`, info.plex === true)
  ok(`[${scope}] H1 字体栈含 Noto`, info.h1font.includes('Noto Sans SC'), info.h1font)
  ok(`[${scope}] 页面异常为 0`, errors.length === 0, errors.slice(0,2).join(' | '))
  await ctx.close()
}
console.log(results.join('\n'))
await browser.close()
