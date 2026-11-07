import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C://Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
const U = 'http://127.0.0.1:5178/'
await page.goto(U + '?final=1#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({ path: '.shots/p21-home.png' })

await page.goto(U + '?final=2#/channels', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: '.shots/p2-channels.png' })

await page.goto(U + '?final=3#/channel/arena', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: '.shots/p2-detail.png' })

await page.goto(U + '?final=4#/terminal', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: '.shots/p2-terminal.png' })

await page.goto(U + '?final=5#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.getByRole('button', { name: /转场实验/ }).click()
await page.waitForTimeout(500)
await page.screenshot({ path: '.shots/p21-lab-motion.png' })

// 转场中途帧
await page.goto(U + '?final=6#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.getByRole('button', { name: /进入争锋频道/ }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: '.shots/tx1-mask-stamp.png' })
await page.waitForTimeout(1000)

await page.locator('.hc-corridor__row').first().click()
await page.waitForTimeout(260)
await page.screenshot({ path: '.shots/tx2-zoom.png' })
await page.waitForTimeout(1000)

await page.goto(U + '?final=7#/channels', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.getByRole('button', { name: '选择转场类型' }).click()
await page.getByRole('option', { name: '共享主体' }).click()
await page.getByRole('button', { name: /争锋频道/ }).first().click()
await page.waitForTimeout(330)
await page.screenshot({ path: '.shots/tx4-shared.png' })
console.log('final shots ok')
await browser.close()
