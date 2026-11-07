export type ChannelId = 'arena' | 'hive' | 'archive' | 'workshop'

export interface ScheduleItem {
  time: string
  code: string
  title: string
  meta: string
  status: string
  statusKind: 'live' | 'ok' | 'warn' | 'idle'
}

export interface Channel {
  id: ChannelId
  index: string
  name: string
  en: string
  code: string
  themeLabel: string
  accent: string
  status: string
  statusKind: 'live' | 'ok' | 'warn' | 'idle'
  desc: string
  intro: string
  tags: string[]
  stats: { label: string; value: string }[]
  feature: { label: string; quote: string; emphasis: string; note: string }
  schedule: ScheduleItem[]
  people: { name: string; role: string; code: string }[]
}

export const CHANNELS: Channel[] = [
  {
    id: 'arena',
    index: '01',
    name: '争锋频道',
    en: 'RIVALRY CHANNEL',
    code: 'HC-01 / ARENA',
    themeLabel: '琥珀',
    accent: '#f6540e',
    status: '直播中',
    statusKind: 'live',
    desc: '中央塔主赛区的实时转播与赛程发布。',
    intro:
      '争锋频道负责中央塔全部公开对局的信号调度。第七赛季进入第二轮，八支常驻队伍的赛程、回放与技术统计在此归档。',
    tags: ['公开信号', '第七赛季', '中央塔'],
    stats: [
      { label: '进行中对局', value: '02' },
      { label: '今日场次', value: '08' },
      { label: '信号延迟', value: '0.4s' },
    ],
    feature: {
      label: 'ON AIR / 频道手记',
      quote: '中央塔不记录胜负，只记录谁还站着。',
      emphasis: '谁还站着',
      note: '第七赛季 · 第二轮 · 导播组',
    },
    schedule: [
      { time: '19:00', code: 'R2-05', title: '蜂巢工造 vs 白垩甜点', meta: '东看台 · 第三场', status: '直播中', statusKind: 'live' },
      { time: '20:10', code: 'R2-06', title: '深桶酿造 vs 玻璃温室', meta: '东看台 · 第四场', status: '待开始', statusKind: 'idle' },
      { time: '21:00', code: 'R2-07', title: '渠务局 vs 蜜蜡邮社', meta: '西看台 · 第五场', status: '待开始', statusKind: 'idle' },
      { time: '22:20', code: 'R2-08', title: '上城电台 vs 中央塔管理署', meta: '西看台 · 第六场', status: '席位调整', statusKind: 'warn' },
    ],
    people: [
      { name: '祁昀', role: '频道导播', code: 'OP-114' },
      { name: '陆见川', role: '现场解说', code: 'CS-027' },
      { name: '白鹭', role: '信号调度', code: 'SG-309' },
    ],
  },
  {
    id: 'hive',
    index: '02',
    name: '蜂巢回廊',
    en: 'HIVE CORRIDOR',
    code: 'HC-02 / HIVE',
    themeLabel: '冷青',
    accent: '#4aabea',
    status: '技术暂停',
    statusKind: 'warn',
    desc: '设备检修与训练场的低频信号段。',
    intro:
      '回廊位于中央塔负三层，原为蜂巢工造的装配区。现在承担训练场转播、设备校准记录与非公开测试的信号分发。',
    tags: ['受限信号', '训练场', '检修中'],
    stats: [
      { label: '开放机位', value: '03' },
      { label: '检修进度', value: '72%' },
      { label: '信号延迟', value: '1.2s' },
    ],
    feature: {
      label: 'STANDBY / 检修记录',
      quote: '走廊尽头那盏灯，已经亮了四十一个小时。',
      emphasis: '四十一个小时',
      note: '负三层 · 设备组 · 夜间班',
    },
    schedule: [
      { time: '18:30', code: 'T-118', title: '工造二队 · 队内对抗', meta: '训练场 A · 非公开', status: '进行中', statusKind: 'live' },
      { time: '19:40', code: 'T-119', title: '玻璃温室 · 场地适应', meta: '训练场 B · 非公开', status: '待开始', statusKind: 'idle' },
      { time: '20:30', code: 'M-042', title: '三号机位校准', meta: '回廊东段', status: '已排期', statusKind: 'ok' },
      { time: '23:00', code: 'M-043', title: '夜间信号压力测试', meta: '全段', status: '技术暂停', statusKind: 'warn' },
    ],
    people: [
      { name: '温叙', role: '设备主管', code: 'EQ-082' },
      { name: '陈默', role: '夜间值班', code: 'NG-441' },
      { name: '卓阿', role: '机位操作', code: 'CM-116' },
    ],
  },
  {
    id: 'archive',
    index: '03',
    name: '蜜露档案',
    en: 'NECTAR ARCHIVE',
    code: 'HC-03 / ARCHIVE',
    themeLabel: '陶红',
    accent: '#f1c644',
    status: '开放查阅',
    statusKind: 'ok',
    desc: '历届赛果、选手记录与影像存档。',
    intro:
      '档案室保存自首届争锋赛以来的全部公开记录。部分早期影像已完成修复，可按赛季、队伍或场地检索。',
    tags: ['公开查阅', '影像修复', '全赛季'],
    stats: [
      { label: '收录赛季', value: '07' },
      { label: '公开条目', value: '1,284' },
      { label: '待修复', value: '36' },
    ],
    feature: {
      label: 'ARCHIVE / 影像修复',
      quote: '第一届的决赛录像，只剩最后四分钟没有声音。',
      emphasis: '最后四分钟',
      note: '档案室 · 修复组 · 第 3 批',
    },
    schedule: [
      { time: '10:00', code: 'A-201', title: '第一届决赛 · 修复版', meta: '影像 · 46 分钟', status: '已开放', statusKind: 'ok' },
      { time: '14:00', code: 'A-202', title: '第三届半决赛 · 全场', meta: '影像 · 71 分钟', status: '已开放', statusKind: 'ok' },
      { time: '16:30', code: 'A-203', title: '选手访谈 · 祁昀', meta: '音频 · 23 分钟', status: '整理中', statusKind: 'warn' },
      { time: '18:00', code: 'A-204', title: '第七赛季 · 第二轮归档', meta: '文本 · 进行中', status: '待补录', statusKind: 'idle' },
    ],
    people: [
      { name: '祝晚', role: '档案管理员', code: 'AR-019' },
      { name: '莫昕', role: '影像修复', code: 'RS-233' },
      { name: '李叙白', role: '口述记录', code: 'OR-077' },
    ],
  },
  {
    id: 'workshop',
    index: '04',
    name: '甜品工坊',
    en: 'CONFECTION WORKS',
    code: 'HC-04 / WORKSHOP',
    themeLabel: '苔绿',
    accent: '#68d5ba',
    status: '预约开放',
    statusKind: 'ok',
    desc: '赛后补给、器具借用与公开课。',
    intro:
      '工坊设在中央塔西侧连廊，赛间向所有持证人员开放。器具借用与公开课名额通过终端预约，不设现场排队。',
    tags: ['预约制', '赛后补给', '公开课'],
    stats: [
      { label: '今日余位', value: '14' },
      { label: '开放课程', value: '03' },
      { label: '借用器具', value: '52' },
    ],
    feature: {
      label: 'OPEN / 公开课',
      quote: '糖壳要薄，薄到能听见里面裂开的声音。',
      emphasis: '听见里面裂开',
      note: '工坊 · 西侧连廊 · 周三',
    },
    schedule: [
      { time: '11:00', code: 'W-311', title: '糖壳成型 · 基础', meta: '工坊 A 区 · 8 人', status: '余 2 位', statusKind: 'warn' },
      { time: '14:30', code: 'W-312', title: '赛间补给 · 冷食', meta: '工坊 B 区 · 12 人', status: '可预约', statusKind: 'ok' },
      { time: '17:00', code: 'W-313', title: '器具借用 · 夜间场', meta: '西侧连廊', status: '可预约', statusKind: 'ok' },
      { time: '20:00', code: 'W-314', title: '公开课 · 蜂巢糖结构', meta: '工坊 A 区 · 10 人', status: '已满', statusKind: 'idle' },
    ],
    people: [
      { name: '阮甜', role: '工坊主理', code: 'WS-005' },
      { name: '周野', role: '器具管理', code: 'TL-128' },
      { name: '林梧', role: '公开课讲师', code: 'LC-064' },
    ],
  },
]

export const getChannel = (id: string | undefined): Channel =>
  CHANNELS.find((c) => c.id === id) ?? CHANNELS[0]

export type LogKind = '公告' | '赛程' | '维护' | '档案' | '征召'
export type LogStatus = '已发布' | '审核中' | '进行中' | '已归档'

export interface LogEntry {
  id: string
  time: string
  code: string
  title: string
  kind: LogKind
  status: LogStatus
  detail: string
  tags: string[]
  priority?: boolean
}

export const LOGS: LogEntry[] = [
  {
    id: 'l1',
    time: '10-31 09:12',
    code: '0412',
    title: '争锋频道第七赛季第二轮开票',
    kind: '公告',
    status: '已发布',
    detail:
      '第二轮全部门票于今日 09:00 开放，东看台与西看台各放出 320 席。持证人员可在终端完成实名绑定，单账号限购两席。',
    tags: ['票务', '第七赛季', '公开'],
    priority: true,
  },
  {
    id: 'l2',
    time: '10-31 08:40',
    code: '0411',
    title: '中央塔东侧看台封闭检修',
    kind: '维护',
    status: '进行中',
    detail:
      '东侧看台 C 区至 E 区因护栏更换临时封闭，预计 18:00 前恢复。检修期间第三场次调整至西看台，已购票人员由现场引导改签。',
    tags: ['检修', '东看台'],
    priority: true,
  },
  {
    id: 'l3',
    time: '10-31 08:05',
    code: '0410',
    title: '蜂巢回廊三号机位恢复信号',
    kind: '赛程',
    status: '已发布',
    detail: '三号机位完成镜头组更换，画面延迟回落至 0.6 秒。回廊东段的训练转播自今日起恢复。',
    tags: ['回廊', '机位'],
  },
  {
    id: 'l4',
    time: '10-30 22:18',
    code: '0409',
    title: '关于调整夜间信号时段的说明',
    kind: '公告',
    status: '已发布',
    detail:
      '自本周起，中央塔夜间信号时段调整为 22:30 至次日 01:00。调整涉及回廊与档案室两处，赛程信号不受影响。',
    tags: ['信号', '时段'],
  },
  {
    id: 'l5',
    time: '10-30 20:44',
    code: '0408',
    title: '第一届决赛影像修复完成',
    kind: '档案',
    status: '已归档',
    detail: '缺失的四分钟音频由现场拷贝补录，已与画面完成对齐。修复版存入档案室 A-201，可公开查阅。',
    tags: ['影像', '修复'],
  },
  {
    id: 'l6',
    time: '10-30 17:02',
    code: '0407',
    title: '工坊器具借用夜间场增开',
    kind: '公告',
    status: '已发布',
    detail: '因赛间借用需求增加，工坊自本周三起增开 17:00 至 21:00 夜间借用场，需提前一日在终端预约。',
    tags: ['工坊', '预约'],
  },
  {
    id: 'l7',
    time: '10-30 15:30',
    code: '0406',
    title: '临时导播征召 · 第二轮补位',
    kind: '征召',
    status: '审核中',
    detail: '导播组开放两个临时岗位，负责第二轮第二至第四场次的机位切换。需持有二级以上调度证，报名截止 11-02。',
    tags: ['征召', '导播'],
  },
  {
    id: 'l8',
    time: '10-30 11:09',
    code: '0405',
    title: '西看台席位编号重排',
    kind: '赛程',
    status: '已发布',
    detail: '西看台完成席位重排，原 F 区并入 G 区。已打印的纸质票据仍然有效，入场以终端绑定的席位为准。',
    tags: ['席位', '西看台'],
  },
  {
    id: 'l9',
    time: '10-29 19:26',
    code: '0404',
    title: '回廊训练场暂停对外开放',
    kind: '维护',
    status: '已归档',
    detail: '负三层通风系统检修完成，训练场已于 10-30 恢复。检修期间的预约已全部顺延，无需重新提交。',
    tags: ['回廊', '检修'],
  },
  {
    id: 'l10',
    time: '10-29 14:50',
    code: '0403',
    title: '第六赛季技术统计修订',
    kind: '档案',
    status: '已归档',
    detail: '修正第六赛季四场对局的时长记录，偏差来自计时器与信号时钟不同步。修订后的数据已覆盖旧条目。',
    tags: ['统计', '第六赛季'],
  },
  {
    id: 'l11',
    time: '10-29 10:12',
    code: '0402',
    title: '中央塔连廊照明改造公告',
    kind: '维护',
    status: '已发布',
    detail: '西侧连廊将分三段更换照明，施工集中在每日 02:00 至 05:00，不影响工坊与看台使用。',
    tags: ['连廊', '施工'],
  },
  {
    id: 'l12',
    time: '10-28 21:37',
    code: '0401',
    title: '公开课「蜂巢糖结构」名额开放',
    kind: '公告',
    status: '已发布',
    detail: '课程定于 11-04 20:00 在工坊 A 区进行，限 10 人。报名需在终端提交器具使用记录，审核通过后锁定名额。',
    tags: ['公开课', '工坊'],
  },
  {
    id: 'l13',
    time: '10-28 16:20',
    code: '0400',
    title: '信号调度岗位交接安排',
    kind: '公告',
    status: '已归档',
    detail: '第二轮起由白鹭接任信号调度，原调度转入档案室参与影像修复。交接期为一周，期间双人值守。',
    tags: ['人事', '调度'],
  },
  {
    id: 'l14',
    time: '10-28 09:00',
    code: '0399',
    title: '第七赛季赛程总表更新',
    kind: '赛程',
    status: '已发布',
    detail: '总表新增两场补赛，分别安排在 11-06 与 11-08 的晚间时段。原定场次时间不变。',
    tags: ['赛程', '第七赛季'],
  },
]

export const LOG_KINDS: LogKind[] = ['公告', '赛程', '维护', '档案', '征召']

export const RULES = [
  {
    title: '信号优先',
    body: '任何情况下，公开信号的连续性优先于现场调度。导播可在不中断转播的前提下调整机位与解说，调整记录需在当日归档。',
  },
  {
    title: '席位与持证',
    body: '看台席位与终端账号一一绑定，不得转借。临时证件仅在签发场次内有效，过期后由闸机自动回收。',
  },
  {
    title: '回廊限制',
    body: '负三层回廊为非公开区域，进入需二级以上权限。训练场信号默认不外发，如需公开须提前四十八小时报备。',
  },
  {
    title: '档案封存',
    body: '涉及未成年选手的影像在归档后封存五年。封存期内仅限本人与档案管理员查阅，调阅需双人签字。',
  },
  {
    title: '器具借用',
    body: '工坊器具借用以场次为单位，赛后两小时内归还。逾期未还将暂停预约权限七日，损坏按原价赔付。',
  },
]
