"""打包源码交付 zip：白名单收集，排除 node_modules / dist / 截图 / 源字体。"""
import os, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, f'HONEY_CITY_v2.1.0_source.zip')

DIRS = ['src', 'public', 'scripts', '.qa', 'docs', 'LICENSES']
ROOT_FILES = [
    'README.md', 'CHANGELOG.md', 'P2_CHANGELOG.md', 'P1_CHANGELOG.md', 'CREDITS.md',
    'DESIGN_DECISIONS.md', 'REFERENCE_AUDIT.md', 'VISUAL_INVENTORY.md', 'MOTION_INVENTORY.md',
    'DESIGN_TOKENS.md', 'MOTION_SYSTEM.md', 'COMPONENTS.md', 'TEST_REPORT.md',
    'LICENSE', 'requirements-fonts.txt',
    'index.html', 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts',
    'honey-city.html', '.gitignore', 'Honey_City_.md',
]
SHOTS = [
    'p21-home.png', 'p2-channels.png', 'p2-detail.png', 'p2-terminal.png',
    'p21-lab-motion.png', 'p21-360-detail.png',
    'tx1-mask-stamp.png', 'tx2-zoom.png', 'tx4-shared.png',
]

if __name__ == '__main__':
    count = 0
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
        for d in DIRS:
            base = os.path.join(ROOT, d)
            for root, dirs, files in os.walk(base):
                dirs[:] = [x for x in dirs if x not in {'node_modules', '__pycache__'}]
                for f in files:
                    if f.endswith(('.png', '.jpg')):
                        continue
                    p = os.path.join(root, f)
                    z.write(p, os.path.relpath(p, ROOT))
                    count += 1
        for f in ROOT_FILES:
            p = os.path.join(ROOT, f)
            if os.path.exists(p):
                z.write(p, f)
                count += 1
        for s in SHOTS:
            p = os.path.join(ROOT, '.shots', s)
            if os.path.exists(p):
                z.write(p, os.path.join('.shots', s))
                count += 1
            else:
                print('[pack] 缺少截图：', s)
    size = os.path.getsize(OUT) / 1024
    print(f'[pack] {OUT} {size:.1f} KB / {count} files')
