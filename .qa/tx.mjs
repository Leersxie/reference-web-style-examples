import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const U = 'http://127.0.0.1:5178/'
const NO = 'html{scroll-behavior:auto!important}'

// mask @ 400ms
await page.goto(U + '#/', { waitUntil: 'networkidle' }); await page.addStyleTag({content:NO}); await page.waitForTimeout(1200)
await page.getByRole('button', { name: /进入争锋频道/ }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: '.shots/tx1-mask-stamp.png' })
await page.waitForTimeout(900)

// zoom from corridor
await page.goto(U + '?z=1#/', { waitUntil: 'networkidle' }); await page.waitForTimeout(1200)
await page.locator('.hc-corridor__row').first().click()
await page.waitForTimeout(260)
await page.screenshot({ path: '.shots/tx2-zoom.png' })
await page.waitForTimeout(1000)

// wipe via theme dot on detail
await page.goto(U + '?z=2#/channel/arena', { waitUntil: 'networkidle' }); await page.waitForTimeout(900)
await page.getByRole('button', { name: '切换到蜂巢回廊' }).click()
await page.waitForTimeout(170)
await page.screenshot({ path: '.shots/tx3-wipe.png' })
await page.waitForTimeout(900)

// shared from channels
await page.goto(U + '?z=3#/channels', { waitUntil: 'networkidle' }); await page.waitForTimeout(900)
await page.getByRole('button', { name: '选择转场类型' }).click()
await page.getByRole('option', { name: '共享主体' }).click()
await page.getByRole('button', { name: /争锋频道/ }).first().click()
await page.waitForTimeout(330)
await page.screenshot({ path: '.shots/tx4-shared.png' })
await page.waitForTimeout(1000)

// lab buttons close-up + toggle
await page.goto(U + '?z=4#/lab', { waitUntil: 'networkidle' }); await page.waitForTimeout(800)
await page.getByRole('button', { name: /组件状态/ }).click(); await page.waitForTimeout(500)
await page.locator('.hc-lab-block').first().screenshot({ path: '.shots/btn-states.png' })
await page.getByRole('button', { name: /转场实验/ }).click(); await page.waitForTimeout(400)
await page.locator('.hc-lab-settings').screenshot({ path: '.shots/settings-bar.png' })
await page.locator('.hc-tx').first().screenshot({ path: '.shots/tx-card.png' })
await browser.close()
