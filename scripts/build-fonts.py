"""从 Noto Sans SC 可变字体裁出本项目实际用到的字符，另复制 Oswald / IBM Plex Mono。"""
import os, re, shutil
from fontTools.subset import main as subset_main

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(SRC, 'assets', 'fonts')
os.makedirs(OUT, exist_ok=True)

chars = set()
for base, _, files in os.walk(SRC):
    for fn in files:
        if fn.endswith(('.ts', '.tsx', '.css', '.html')):
            text = open(os.path.join(base, fn), encoding='utf-8').read()
            chars.update(text)
chars.update(open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read())
# 常用标点、数字、拉丁与安全汉字（输入框可能用到的少量高频字）
chars.update("，。、；：？！“”‘’（）《》〈〉——……·／×÷≤≥°％¥0123456789"
             "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
             " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
             "中央塔频道索引终端实验台蜜果城争锋回廊档案工坊信号席位场次编号状态"
             "今日排程总览赛程规则人员值班参数完整度延迟在线预约确认关闭取消")
text = ''.join(sorted(chars))
text_path = os.path.join(ROOT, '.fonts-src', 'chars.txt')
open(text_path, 'w', encoding='utf-8').write(text)
print('chars', len(chars))

src_font = os.path.join(ROOT, '.fonts-src', 'NotoSansSC-VF.ttf')
if not os.path.exists(src_font):
    print('缺少源字体：', src_font)
    print('请从 https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf 下载后放入 .fonts-src/')
    raise SystemExit(1)
dst_font = os.path.join(OUT, 'noto-sans-sc-var.woff2')
subset_main([
    src_font,
    f'--text-file={text_path}',
    f'--output-file={dst_font}',
    '--flavor=woff2',
    '--layout-features=*',
    '--no-hinting',
    '--name-IDs=*',
    '--drop-tables+=DSIG',
])
print('noto', round(os.path.getsize(dst_font) / 1024, 1), 'KB')

pairs = [
    ('@fontsource/oswald/files/oswald-latin-400-normal.woff2', 'oswald-400.woff2'),
    ('@fontsource/oswald/files/oswald-latin-500-normal.woff2', 'oswald-500.woff2'),
    ('@fontsource/oswald/files/oswald-latin-600-normal.woff2', 'oswald-600.woff2'),
    ('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', 'plex-mono-400.woff2'),
    ('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', 'plex-mono-500.woff2'),
]
for src, name in pairs:
    shutil.copyfile(os.path.join(ROOT, 'node_modules', src), os.path.join(OUT, name))
    print(name, round(os.path.getsize(os.path.join(OUT, name)) / 1024, 1), 'KB')
