export type RouteName = 'home' | 'channels' | 'channel' | 'terminal' | 'lab'

export interface Route {
  name: RouteName
  param?: string
}

export const ROUTE_META: Record<
  RouteName,
  { title: string; en: string; path: string }
> = {
  home: { title: '首页', en: 'ENTRY', path: '入口 / 主页' },
  channels: { title: '频道索引', en: 'CHANNEL INDEX', path: '频道索引' },
  channel: { title: '频道详情', en: 'CHANNEL', path: '频道索引 / 详情' },
  terminal: { title: '终端', en: 'TERMINAL', path: '终端 / 信息流' },
  lab: { title: '设计实验室', en: 'SYSTEM LAB', path: '实验室 / 规范' },
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '').replace(/\/$/, '')
  if (!clean) return { name: 'home' }
  const [name, param] = clean.split('/')
  switch (name) {
    case 'channels':
      return { name: 'channels' }
    case 'channel':
      return { name: 'channel', param: param || 'arena' }
    case 'terminal':
      return { name: 'terminal' }
    case 'lab':
      return { name: 'lab' }
    case 'home':
      return { name: 'home' }
    default:
      return { name: 'home' }
  }
}

export function routeToHash(route: Route): string {
  if (route.name === 'home') return '/'
  if (route.name === 'channel') return `/channel/${route.param ?? 'arena'}`
  return `/${route.name}`
}

export function sameRoute(a: Route, b: Route): boolean {
  return a.name === b.name && (a.param ?? '') === (b.param ?? '')
}

export function routeLabel(route: Route): string {
  if (route.name === 'channel') return `频道详情 · ${route.param ?? ''}`.toUpperCase()
  return ROUTE_META[route.name].en
}
