import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
})
const U = 'http://127.0.0.1:5178/'
const results = []
const ok = (name, cond, extra = '') =>
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)

const errors = []
function watch(page) {
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  return page
}

/* 1. 主题持久化 + 首屏同步 */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = watch(await ctx.newPage())
  await page.goto(U + '?t=1#/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: '打开界面设置' }).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: '档案纸面' }).click()
  await page.waitForTimeout(300)
  const stored = await page.evaluate(() => localStorage.getItem('honeycity.prefs.v1'))
  ok('主题写入 localStorage', JSON.parse(stored).theme === 'paper', stored)

  await page.reload({ waitUntil: 'domcontentloaded' })
  const early = await page.evaluate(() => document.documentElement.dataset.theme)
  ok('刷新时 DOMContentLoaded 即为纸面主题（无闪烁）', early === 'paper', early)
  await page.waitForTimeout(600)
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--hc-canvas').trim())
  ok('纸面主题画布生效', bg.toLowerCase() === '#e8e3d6', bg)

  await page.getByRole('button', { name: '打开界面设置' }).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: '暗色终端' }).click()
  await page.getByRole('button', { name: '恢复默认设置' }).click()
  await page.waitForTimeout(200)
  const def = await page.evaluate(() => localStorage.getItem('honeycity.prefs.v1'))
  ok('恢复默认清除偏好', def === null, String(def))
  await ctx.close()
}

/* 2. 三态动效 + 系统偏好运行时同步 */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = watch(await ctx.newPage())
  await page.goto(U + '?t=2#/terminal', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: '打开界面设置' }).click()
  await page.waitForTimeout(250)
  await page.getByRole('button', { name: '减少', exact: true }).click()
  await page.waitForTimeout(200)
  const reduceAttr = await page.evaluate(() => document.documentElement.dataset.reduce)
  ok('手动减少动效写入 data-reduce', reduceAttr === 'true')
  const dur = await page.evaluate(() => {
    const b = document.querySelector('.hc-btn')
    return b ? getComputedStyle(b).transitionDuration : ''
  })
  ok('CSS 微动效同步降级', parseFloat(dur) < 0.001, dur)

  await page.getByRole('button', { name: '跟随系统' }).click()
  await page.waitForTimeout(200)
  const sys = await page.evaluate(() => document.documentElement.dataset.reduce)
  ok('跟随系统（默认无偏好）不强制减少', sys === 'false')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(250)
  const sysReduce = await page.evaluate(() => document.documentElement.dataset.reduce)
  ok('系统偏好运行时切换被监听', sysReduce === 'true', sysReduce)

  await page.getByRole('button', { name: '完整', exact: true }).click()
  await page.waitForTimeout(200)
  const full = await page.evaluate(() => document.documentElement.dataset.reduce)
  ok('强制完整覆盖系统减少', full === 'false', full)
  await ctx.close()
}

/* 3. 弹层背景 inert + 焦点归还 */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = watch(await ctx.newPage())
  await page.goto(U + '?t=3#/channel/arena', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const trigger = page.getByRole('button', { name: '频道参数' }).first()
  await trigger.click()
  await page.waitForTimeout(350)
  const inert = await page.evaluate(() => document.querySelector('.hc-app')?.hasAttribute('inert'))
  const focusIn = await page.evaluate(() => !!document.activeElement?.closest('.hc-drawer'))
  ok('抽屉打开时背景 inert', inert === true)
  ok('焦点进入抽屉', focusIn === true)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  const inertAfter = await page.evaluate(() => document.querySelector('.hc-app')?.hasAttribute('inert'))
  ok('关闭后解除 inert', inertAfter === false)
  ok(
    '焦点归还触发按钮',
    await page.evaluate(() => document.activeElement?.textContent?.includes('频道参数')),
  )
  await ctx.close()
}

/* 4. 阶段 / 暂停 / 复位（实验室转场） */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
  const page = watch(await ctx.newPage())
  await page.goto(U + '?tab=motion#/lab', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: '播放' }).first().click()
  await page.waitForTimeout(120)
  const ph1 = await page.locator('.hc-motion__status b').first().textContent()
  ok('转场阶段上报（播放中）', ph1 === 'COVER', ph1)

  await page.keyboard.press('Space')
  await page.waitForTimeout(200)
  const pausedText = await page.locator('.hc-motion__status').first().textContent()
  ok('空格暂停生效', (pausedText ?? '').includes('PAUSED'), pausedText ?? '')
  await page.keyboard.press('Space')
  await page.waitForTimeout(1300)
  const ph2 = await page.locator('.hc-motion__status b').first().textContent()
  ok('继续后转场完成', ph2 === 'IDLE', ph2)

  await page.getByRole('button', { name: '播放' }).first().click()
  await page.waitForTimeout(150)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  const roots = await page.evaluate(() => document.querySelectorAll('.hc-tx-root').length)
  const overflow = await page.evaluate(() => document.body.style.overflow)
  ok('ESC 复位清理遮罩与滚动锁', roots === 0 && overflow === '', `roots=${roots}`)
  await ctx.close()
}

/* 5. 五种转场真实导航 */
{
  const kinds = ['缩放聚焦', '几何遮罩', '切片拼贴', '上下擦入', '共享主体', '阶梯推挤', '四向快门', '纸面翻页', '信号故障']
  for (const k of kinds) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = watch(await ctx.newPage())
    await page.goto(U + '?t=5#/channels', { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: '选择转场类型' }).click()
    await page.getByRole('option', { name: k }).click()
    await page.getByRole('button', { name: /争锋频道/ }).first().click()
    await page.waitForTimeout(1600)
    const state = await page.evaluate(() => ({
      hash: location.hash,
      roots: document.querySelectorAll('.hc-tx-root').length,
      overflow: document.body.style.overflow,
      title: document.querySelector('h1')?.textContent ?? '',
    }))
    ok(
      `转场「${k}」完成并落到详情`,
      state.hash === '#/channel/arena' && state.roots === 0 && state.overflow === '',
      state.hash,
    )
    await ctx.close()
  }
}

/* 6. 8 视口 × 5 路由 无横向溢出 */
{
  const vps = [
    [1920, 1080],
    [1440, 900],
    [1024, 768],
    [820, 900],
    [768, 1024],
    [430, 932],
    [390, 844],
    [360, 800],
  ]
  const routes = ['#/', '#/channels', '#/channel/arena', '#/terminal', '#/lab']
  for (const [w, h] of vps) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    const page = watch(await ctx.newPage())
    let bad = ''
    for (const r of routes) {
      await page.goto(`${U}?vp=${w}-${h}${r}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(350)
      const m = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }))
      if (m.sw > m.cw + 1) bad += `${r}:${m.sw}/${m.cw} `
    }
    ok(`视口 ${w}×${h} 全路由无横向溢出`, !bad, bad)
    await ctx.close()
  }
}

ok('运行期无未处理异常', errors.length === 0, errors.slice(0, 2).join(' | '))

console.log(results.join('\n'))
console.log(`\nTOTAL ${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`)
await browser.close()
