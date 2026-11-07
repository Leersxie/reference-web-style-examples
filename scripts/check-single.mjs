// 校验单文件构建：无外链、字体全部内联。
import fs from 'node:fs'

const FILE = 'honey-city.html'
if (!fs.existsSync(FILE)) {
  console.error(`[check-single] ${FILE} 不存在，请先运行 npm run build:single`)
  process.exit(1)
}

const html = fs.readFileSync(FILE, 'utf8')
const results = []
const ok = (name, cond, extra = '') => {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)
  if (!cond) process.exitCode = 1
}

const sizeKB = (fs.statSync(FILE).size / 1024).toFixed(1)
ok('单文件已生成', true, `${sizeKB} KB`)
ok('无 http(s) 脚本外链', !/src=["']https?:\/\//.test(html))
ok('无 http(s) 字体外链', !/url\(["']?https?:\/\/[^)]*\.woff2/.test(html))
ok('无未内联的 .woff2 引用', !/url\(["']?(\.\.?\/)?[^)]*\.woff2/.test(html))
const fontCount = (html.match(/data:font\/woff2;base64/g) || []).length
ok('内联字体为 6 个', fontCount === 6, String(fontCount))
ok('包含根节点应用', html.includes('id="root"'))

console.log(results.join('\n'))
console.log(`\nTOTAL ${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`)
