import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const U = 'http://127.0.0.1:5178/'
const results = []
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)

const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

await page.goto(U + '#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

// 1. 连续点击中断
const rail = (n) => page.getByRole('button', { name: n })
await rail(/索引 INDEX/).click()
await page.waitForTimeout(90)
await rail(/终端 TERM/).click()
await page.waitForTimeout(1600)
const st1 = await page.evaluate(() => ({
  hash: location.hash,
  active: document.querySelector('.hc-tx-host')?.dataset.active,
  roots: document.querySelectorAll('.hc-tx-root').length,
  overflow: document.body.style.overflow,
}))
ok('连续导航后只保留最后一次目标', st1.hash === '#/terminal', st1.hash)
ok('转场结束后无残留遮罩', st1.roots === 0 && st1.active === 'false')
ok('转场结束后恢复滚动', st1.overflow === '')

// 2. 后退
await page.goBack()
await page.waitForTimeout(700)
ok('浏览器后退回到频道索引', (await page.evaluate(() => location.hash)) === '#/channels')

// 3. 抽屉 ESC + 焦点归还
await page.goto(U + '?f=1#/channel/arena', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const trigger = page.getByRole('button', { name: '频道参数' }).first()
await trigger.click()
await page.waitForTimeout(450)
ok('抽屉打开后焦点进入面板', await page.evaluate(() => !!document.activeElement?.closest('.hc-drawer')))
await page.keyboard.press('Escape')
await page.waitForTimeout(500)
ok('ESC 关闭抽屉', (await page.locator('.hc-drawer').count()) === 0)
ok('关闭后焦点归还触发按钮', await page.evaluate(() => document.activeElement?.textContent?.includes('频道参数')))

// 4. 方向键切换 Tab
await page.getByRole('tab', { name: /总览/ }).focus()
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(400)
ok('方向键切换 Tab', (await page.getByRole('tab', { name: /赛程/ }).getAttribute('aria-selected')) === 'true')

// 5. 终端筛选与分页
await page.goto(U + '?f=2#/terminal', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.locator('.hc-filter', { hasText: '维护' }).click()
await page.waitForTimeout(300)
const rows = await page.locator('.hc-log').count()
ok('类型筛选生效', rows === 3, `rows=${rows}`)
await page.locator('.hc-filter', { hasText: '全部日志' }).click()
await page.waitForTimeout(200)
await page.locator('.hc-pager button', { hasText: '03' }).click()
await page.waitForTimeout(300)
ok('分页切换到第 3 页', (await page.locator('.hc-pager [aria-current="true"]').textContent()) === '03')

// 6. 快速模式 + 2 倍速
await page.goto(U + '?f=3#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.getByRole('button', { name: /转场实验/ }).click()
await page.waitForTimeout(300)
await page.getByRole('button', { name: '2×' }).click()
await page.getByRole('button', { name: '快速' }).click()
const t0 = Date.now()
await page.getByRole('button', { name: '播放' }).first().click()
await page.waitForTimeout(1200)
ok('快速 + 2× 转场可完成', (await page.evaluate(() => document.querySelectorAll('.hc-tx-root').length)) === 0, `${Date.now() - t0}ms`)

// 7. 减少动态
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const p2 = await ctx2.newPage()
await p2.goto(U + '#/', { waitUntil: 'networkidle' })
await p2.waitForTimeout(400)
await p2.getByRole('button', { name: /进入争锋频道/ }).click()
await p2.waitForTimeout(120)
const fade = await p2.evaluate(() => ({
  roots: document.querySelectorAll('.hc-tx-root').length,
  hasFade: !!document.querySelector('.hc-tx__fade'),
  noSlab: !document.querySelector('.hc-tx__slab'),
}))
ok('减少动态使用淡入而非几何遮罩', fade.roots === 1 && fade.hasFade && fade.noSlab, JSON.stringify(fade))
await p2.waitForTimeout(800)
ok('减少动态转场不残留', (await p2.evaluate(() => document.querySelectorAll('.hc-tx-root').length)) === 0)

ok('运行期无 JS 异常', errors.length === 0, errors[0] ?? '')

console.log(results.join('\n'))
await browser.close()
