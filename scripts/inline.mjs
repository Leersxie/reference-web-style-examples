import fs from 'node:fs'
import path from 'node:path'

const distDir = 'dist'
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')

const cssTag = html.match(/<link[^>]+rel="stylesheet"[^>]*>/i)?.[0]
const jsTag = html.match(/<script[^>]+src="[^"]+"[^>]*><\/script>/i)?.[0]
if (!cssTag || !jsTag) throw new Error('未找到构建产物引用')

const cssHref = cssTag.match(/href="([^"]+)"/)[1].replace(/^\.\//, '')
const jsHref = jsTag.match(/src="([^"]+)"/)[1].replace(/^\.\//, '')
let css = fs.readFileSync(path.join(distDir, cssHref), 'utf8')
const cssDir = path.dirname(path.join(distDir, cssHref))
// 内联字体：单文件必须离线可用
css = css.replace(/url\((['"]?)(\.{0,2}\/?[^)'"]+\.woff2)\1\)/g, (m, _q, rel) => {
  const clean = rel.replace(/^\.\//, '').replace(/^\//, '')
  const candidates = [
    path.join(cssDir, clean),
    path.join(distDir, clean),
    path.join(distDir, 'assets', path.basename(clean)),
  ]
  const hit = candidates.find((p) => fs.existsSync(p))
  if (!hit) return m
  const b64 = fs.readFileSync(hit).toString('base64')
  return `url("data:font/woff2;base64,${b64}")`
})
const js = fs.readFileSync(path.join(distDir, jsHref), 'utf8')

html = html.replace(cssTag, () => `<style>\n${css}\n</style>`)
html = html.replace(jsTag, () => `<script type="module">\n${js.replace(/<\/script>/gi, '<\\/script>')}\n</script>`)

const svg = fs.readFileSync('public/favicon.svg', 'utf8')
const dataUri = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
html = html.replace(/<link[^>]+rel="icon"[^>]*>/i, () => `<link rel="icon" type="image/svg+xml" href="${dataUri}" />`)

html = html.replace('<head>', '<head>\n    <!-- 单文件构建：样式与脚本已内联，可离线直接打开 -->')

fs.writeFileSync('honey-city.html', html)
console.log('written honey-city.html', (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB')
