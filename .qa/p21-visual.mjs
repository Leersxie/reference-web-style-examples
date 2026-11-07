import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
})
const U = 'http://127.0.0.1:5178/'
const results = []
const ok = (name, cond, extra = '') => {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)
  if (!cond) process.exitCode = 1
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

async function contrast(page, sel, scope = 'dark') {
  return page.evaluate(([sel, scope]) => {
    const el = document.querySelector(sel)
    if (!el) return { missing: true }
    const cs = getComputedStyle(el)
    const toRGB = (v) => {
      const m = v.match(/rgba?\(([^)]+)\)/)
      if (!m) return [0, 0, 0, 1]
      const parts = m[1].split(',').map(Number)
      return parts.length === 3 ? [...parts, 1] : parts
    }
    const lum = ([r, g, b]) => {
      const f = (v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const blend = (fg, bg) => fg.map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]))
    const bgStack = []
    let node = el
    while (node && node !== document.documentElement) {
      const c = getComputedStyle(node).backgroundColor
      if (c && !c.includes('0, 0, 0, 0') && !c.includes('transparent')) bgStack.push(toRGB(c))
      node = node.parentElement
    }
    bgStack.push(toRGB(scope === 'dark' ? 'rgb(17,19,21)' : 'rgb(232,227,214)'))
    let bg = bgStack[bgStack.length - 1]
    for (let i = bgStack.length - 2; i >= 0; i--) bg = blend(bgStack[i], bg)
    const fg = toRGB(cs.color)
    const L1 = lum(fg.slice(0, 3)), L2 = lum(bg.slice(0, 3))
    return { ratio: (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05) }
  }, [sel, scope])
}

/* ---- 1. 首页 ---- */
await page.goto(U + '?v=1#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1100)
const home = await page.evaluate(() => {
  const paper = document.querySelector('.hc-cover__paper')
  const live = document.querySelector('.hc-overview__live')
  const seal = document.querySelector('.hc-specs__seal')
  const cp = (sel) => {
    const el = document.querySelector(sel)
    return el ? getComputedStyle(el).clipPath : 'missing'
  }
  return {
    paperOpacity: paper ? parseFloat(getComputedStyle(paper).opacity) : 0,
    liveAnim: live ? getComputedStyle(live).animationName : '',
    seal: seal ? getComputedStyle(seal).display !== 'none' : false,
    btn: cp('.hc-cover__actions .hc-btn'),
    corridor: cp('.hc-corridor__row'),
  }
})
ok('首屏封面已渲染', home.paperOpacity >= 0.9, home.paperOpacity)
ok('信号线绘制动画存在', home.liveAnim !== 'none', home.liveAnim)
ok('样本印章可见', home.seal)
ok('首页按钮切角为 8px', home.btn.includes('8px'), home.btn)
ok('廊道行有切角', home.corridor !== 'none' && home.corridor !== 'missing', home.corridor)

/* ---- 2. Lab 转场实验：恢复的样式 ---- */
await page.goto(U + '?v=2&tab=motion#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const lab = await page.evaluate(() => {
  const demo = document.querySelector('.hc-demo')
  const box = document.querySelector('.hc-demo__box')
  const grid = document.querySelector('.hc-motion-grid')
  const curve = document.querySelector('.hc-curve svg')
  const settings = document.querySelector('.hc-lab-settings')
  const seg = document.querySelector('.hc-seg')
  const navitem = document.querySelector('.hc-work__navitem')
  const cp = (el) => (el ? getComputedStyle(el).clipPath : 'missing')
  return {
    demoH: demo ? demo.getBoundingClientRect().height : 0,
    boxW: box ? box.getBoundingClientRect().width : 0,
    motionGrid: grid ? getComputedStyle(grid).display : '',
    curveH: curve ? curve.getBoundingClientRect().height : 0,
    settingsH: settings ? settings.getBoundingClientRect().height : 0,
    segCut: cp(seg),
    navCut: cp(navitem),
  }
})
ok('曲线演示轨道有样式', lab.demoH > 40, lab.demoH)
ok('演示方块有尺寸', lab.boxW > 10, lab.boxW)
ok('曲线卡片为 grid', lab.motionGrid === 'grid', lab.motionGrid)
ok('曲线图有高度', lab.curveH >= 60, lab.curveH)
ok('速度/模式工具条有样式', lab.settingsH > 30, lab.settingsH)
ok('分段控制保持直角', lab.segCut === 'none', lab.segCut)
ok('实验台导航项有切角', lab.navCut !== 'none' && lab.navCut !== 'missing', lab.navCut)

/* ---- 2b. 对比度（暗色） ---- */
for (const sel of ['.hc-hint', '.hc-pagehead__meta', '.hc-curve b']) {
  const c = await contrast(page, sel, 'dark')
  ok(`暗色 ${sel} 对比度 ≥ 4.5`, !c.missing && c.ratio >= 4.5, c.missing ? 'missing' : c.ratio)
}

/* ---- 3. Lab 组件状态表 ---- */
await page.goto(U + '?v=3&tab=components#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const state = await page.evaluate(() => {
  const table = document.querySelector('.hc-state-table')
  const cell = table?.querySelector('div')
  return {
    count: document.querySelectorAll('.hc-state-table').length,
    grid: table ? getComputedStyle(table).display : '',
    pad: cell ? getComputedStyle(cell).paddingTop : '',
  }
})
ok('组件状态表存在且为 grid', state.count === 1 && state.grid === 'grid', JSON.stringify(state))
ok('状态表单元格有内边距', parseFloat(state.pad) > 4, state.pad)

/* ---- 4. 终端 / 详情：切角与直角 ---- */
await page.goto(U + '?v=4#/terminal', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const termCuts = await page.evaluate(() => {
  const cp = (sel) => {
    const el = document.querySelector(sel)
    return el ? getComputedStyle(el).clipPath : 'missing'
  }
  return {
    logRow: cp('.hc-log__row'),
    pager: cp('.hc-pager button'),
  }
})
ok('终端日志行有切角', termCuts.logRow !== 'none' && termCuts.logRow !== 'missing', termCuts.logRow)
ok('分页保持直角', termCuts.pager === 'none' || termCuts.pager === 'missing', termCuts.pager)

await page.goto(U + '?v=5#/channel/arena', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const themeCut = await page.evaluate(() => {
  const el = document.querySelector('.hc-theme__sig')
  return el ? getComputedStyle(el).clipPath : 'missing'
})
ok('主题切换保持直角', themeCut === 'none' || themeCut === 'missing', themeCut)

/* ---- 6. 对比度（纸面） ---- */
await page.evaluate(() => {
  localStorage.setItem('honeycity.prefs.v1', JSON.stringify({ speed: 1, quick: false, motion: 'system', theme: 'paper' }))
})
await page.goto(U + '?v=6&tab=tokens#/lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
for (const sel of ['.hc-hint', '.hc-pagehead__meta']) {
  const c = await contrast(page, sel, 'paper')
  ok(`纸面 ${sel} 对比度 ≥ 4.5`, !c.missing && c.ratio >= 4.5, c.missing ? 'missing' : c.ratio)
}
await page.evaluate(() => localStorage.removeItem('honeycity.prefs.v1'))

/* ---- 7. 双重强调条 ---- */
await page.goto(U + '?v=7#/channel/arena', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const feature = await page.evaluate(() => {
  const el = document.querySelector('.hc-feature.hc-paper')
  if (!el) return null
  return {
    borderLeft: getComputedStyle(el).borderLeftWidth,
    beforeW: getComputedStyle(el, '::before').width,
  }
})
ok('纸面引言只有一条强调条', feature && feature.borderLeft === '1px', JSON.stringify(feature))
ok('引言 ::before 仍为 3px', feature && feature.beforeW === '3px', feature?.beforeW)

/* ---- 8. 纸面主题 accent 一致 ---- */
const accent = await page.evaluate(() => {
  const head = document.querySelector('.hc-detail__head')
  const feat = document.querySelector('.hc-feature')
  return {
    head: head ? getComputedStyle(head).getPropertyValue('--hc-accent').trim() : '',
    feat: feat ? getComputedStyle(feat).getPropertyValue('--hc-accent').trim() : '',
  }
})
ok('纸面主题下页头与引言 accent 一致', accent.head === accent.feat && accent.head !== '', JSON.stringify(accent))

ok('运行期无未处理异常', errors.length === 0, errors.slice(0, 2).join(' | '))

console.log(results.join('\n'))
console.log(`\nTOTAL ${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`)
await browser.close()
