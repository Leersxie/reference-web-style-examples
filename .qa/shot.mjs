import { chromium } from 'playwright-core'
import fs from 'node:fs'

const OUT = '.shots'
fs.mkdirSync(OUT, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const URL = 'http://127.0.0.1:5178/'

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const errors = []

async function newPage(ctx) {
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
  return page
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const NO_SMOOTH = 'html{scroll-behavior:auto !important}'
const page = await newPage(ctx)

await page.goto(URL + '#/', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: NO_SMOOTH })
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/01-home.png` })

// 1. 遮罩转场：覆盖中 + 完成
await page.getByRole('button', { name: /进入争锋频道/ }).click()
await page.waitForTimeout(240)
await page.screenshot({ path: `${OUT}/02-tx-mask-cover.png` })
await page.waitForTimeout(1100)
await page.screenshot({ path: `${OUT}/03-detail.png` })

// 2. 详情页 Tab / 弹窗 / 抽屉
await page.getByRole('tab', { name: /赛程/ }).click()
await page.waitForTimeout(450)
await page.screenshot({ path: `${OUT}/04-detail-schedule.png` })
await page.getByRole('button', { name: '预约观赛' }).click()
await page.waitForTimeout(450)
await page.screenshot({ path: `${OUT}/05-modal.png` })
await page.keyboard.press('Escape')
await page.waitForTimeout(400)
await page.getByRole('button', { name: '频道参数' }).click()
await page.waitForTimeout(450)
await page.screenshot({ path: `${OUT}/06-drawer.png` })
await page.keyboard.press('Escape')
await page.waitForTimeout(350)

// 3. 频道索引 + 缩放转场
await page.getByRole('button', { name: /索引 INDEX/ }).click()
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/07-channels.png` })
await page.getByRole('button', { name: /蜂巢回廊/ }).first().click()
await page.waitForTimeout(230)
await page.screenshot({ path: `${OUT}/08-tx-zoom-cover.png` })
await page.waitForTimeout(1100)
await page.screenshot({ path: `${OUT}/09-detail-hive.png` })

// 4. 终端：筛选 + 空状态
await page.goto(URL + '?a=1#/terminal', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: NO_SMOOTH })
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/10-terminal.png` })
await page.getByRole('searchbox').fill('不存在的关键词')
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/11-terminal-empty.png` })
await page.getByRole('button', { name: '清除筛选' }).click()
await page.waitForTimeout(300)

// 5. 实验室四个分区
await page.goto(URL + '?a=2#/lab', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: NO_SMOOTH })
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/12-lab-tokens.png` })
await page.getByRole('button', { name: /组件状态/ }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/13-lab-components.png` })
await page.getByRole('button', { name: /转场实验/ }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/14-lab-motion.png` })
await page.getByRole('button', { name: '播放' }).first().click()
await page.waitForTimeout(260)
await page.screenshot({ path: `${OUT}/15-tx-slices-cover.png` })
await page.waitForTimeout(1200)
await page.getByRole('tab', { name: /全局状态/ }).click()
await page.waitForTimeout(400)
await page.getByRole('button', { name: /危险弹窗/ }).click()
await page.waitForTimeout(450)
await page.screenshot({ path: `${OUT}/16-lab-states.png` })
await page.keyboard.press('Escape')

// 6. 移动端
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const mp = await newPage(mob)
await mp.goto(URL + '#/', { waitUntil: 'networkidle' })
await mp.waitForTimeout(1400)
await mp.screenshot({ path: `${OUT}/17-mobile-home.png`, fullPage: true })
await mp.goto(URL + '#/channels', { waitUntil: 'networkidle' })
await mp.waitForTimeout(900)
await mp.screenshot({ path: `${OUT}/18-mobile-channels.png`, fullPage: true })
await mp.goto(URL + '#/channel/arena', { waitUntil: 'networkidle' })
await mp.waitForTimeout(900)
await mp.screenshot({ path: `${OUT}/19-mobile-detail.png`, fullPage: true })

// 7. 减少动态模式下的转场
const rm = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const rp = await newPage(rm)
await rp.goto(URL + '#/', { waitUntil: 'networkidle' })
await rp.waitForTimeout(600)
await rp.getByRole('button', { name: /进入争锋频道/ }).click()
await rp.waitForTimeout(180)
await rp.screenshot({ path: `${OUT}/20-reduced-fade.png` })

console.log('ERRORS:', errors.length)
errors.slice(0, 20).forEach((e) => console.log(e))

await browser.close()
