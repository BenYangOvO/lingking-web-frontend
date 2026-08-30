import {
  Mail, MessageCircle, AtSign, Tv, Music, BookOpen,
  Camera, Monitor, Package, Calendar, Settings, Palette, Cpu,
  Heart, Award, Users, Clock, MapPin, Flame, Share2, TrendingUp,
  Building2, Handshake, Megaphone,
} from 'lucide-react'

// ============================================================
// 站点固定内容的默认值（页面首次使用/点击"恢复默认"时填充）
// 所有默认值与原页面内的"硬编码"常量保持一致，
// 管理员编辑后保存到后端 site_content.content_json，
// 下次渲染优先用已保存版本，空时回退到这里。
// ============================================================

// ---------- 首页 ---------- //
export const DEFAULT_HOME = {
  hero_title: '凌镜',
  hero_subtitle: '用镜头记录世界，用光影讲述故事',
  section_featured_title: '精选作品',
  section_about_title: '关于凌镜',
  section_depts_title: '部门一览',
  stats: [
    { value: '200+', label: '成员人数' },
    { value: '30+', label: '年度活动' },
    { value: '500+', label: '精选作品' },
    { value: '2018', label: '成立年份' },
  ],
  intro_paragraphs: [
    '凌镜摄影社团成立于2018年，是一个由热爱摄影的同学自发组织的校园社团。我们相信每一张照片都承载着独特的故事，每一次按下快门都是对美好瞬间的致敬。',
    '社团汇聚了来自不同专业、不同背景的摄影爱好者，从初学者到资深摄影师，在这里共同学习、创作与成长。我们定期举办摄影讲座、外拍活动、作品展览和主题沙龙，为每一位成员提供展示才华的舞台。',
    '无论你使用的是专业相机还是手机，只要你对光影有热情，凌镜都欢迎你的加入。让我们一起，用镜头记录生活中的每一个精彩瞬间。',
  ],
}

// ---------- 凌镜历史 ---------- //
export const DEFAULT_HISTORY = {
  hero_title: '先有人还是先有社',
  hero_subtitle: '凌镜的起源与发展历程',
  timeline_title: '时间轴',
  timeline_subtitle: '从萌芽到绽放，每一步都是热爱的印记',
  full_history_title: '完整历史讲述',
  full_history_file: '',
  events: [
    { year: '2018', title: '凌镜摄影社团成立', desc: '由一群热爱摄影的同学自发组织，从最初的 15 人发展至今。', image: '' },
    { year: '2019', title: '首届校园摄影展', desc: '在学校图书馆举办首届摄影展，展出作品 80 余幅，参观人数超过 2000 人次。', image: '' },
    { year: '2020', title: '线上转型与疫情应对', desc: '面对疫情挑战，社团迅速转型线上运营，开展线上讲座、云展览等创新活动。', image: '' },
    { year: '2021', title: '工作室正式开放', desc: '学校批准社团使用一间办公室作为工作室，配备灯光、背景布等专业设备。', image: '' },
    { year: '2023', title: '校企合作项目', desc: '与本地多家摄影工作室建立合作，为成员提供实习和作品展示机会。', image: '' },
    { year: '2025', title: '社团影响力扩大', desc: '成员突破 200 人，年度活动 30+ 场，成为学校最具影响力的艺术社团之一。', image: '' },
  ],
}

// ---------- 部门介绍 ---------- //
export const DEFAULT_DEPARTMENTS = {
  page_subtitle: '三个核心部门，共同构成凌镜的灵魂',
  section_join_title: '想加入我们？',
  section_join_desc: '无论你是摄影新手还是技术达人，凌镜都有属于你的位置。我们每学期初开放招新，欢迎关注我们的公众号获取最新招募信息。加入凌镜，和志同道合的伙伴一起成长。',
  departments: [
    {
      name: '摄影部',
      desc: '负责社团核心摄影创作，包括外拍活动策划、主题拍摄项目以及日常创作交流。从人像到风光，从纪实到创意，这里汇聚了社团最活跃的摄影师。',
      count: 80,
      responsibilities: [
        { label: '周常外拍' },
        { label: '主题摄影' },
        { label: '影展策划' },
        { label: '作品评审' },
      ],
      stats: [
        { value: '200+', label: '年产出作品' },
        { value: '15+', label: '组织外拍' },
      ],
    },
    {
      name: '技术部',
      desc: '专注于后期处理、视频剪辑与新媒体技术。提供 Lightroom、Photoshop、Premiere 等软件的教学与指导，助力成员提升作品品质。',
      count: 60,
      responsibilities: [
        { label: '网站运维' },
        { label: '后期教学' },
        { label: '器材评测' },
        { label: '技术分享' },
      ],
      stats: [
        { value: '50+', label: '技术教程' },
        { value: '3个', label: '维护项目' },
      ],
    },
    {
      name: '宣传部',
      desc: '负责社团品牌运营与对外宣传，包括社交媒体管理、活动文案撰写、海报设计与线上展览策划，是社团对外发声的重要窗口。',
      count: 55,
      responsibilities: [
        { label: '社媒运营' },
        { label: '海报设计' },
        { label: '活动宣传' },
        { label: '品牌合作' },
      ],
      stats: [
        { value: '5000+', label: '粉丝' },
        { value: '100+', label: '海报' },
      ],
    },
  ],
}

// ---------- 关于凌镜 ---------- //
export const DEFAULT_ABOUT = {
  subtitle: '了解凌镜摄影社团的故事、理念与联系方式',
  section_contact_title: '联系我们',
  section_about_title: '关于凌镜',
  section_sponsor_title: '合作与赞助',
  section_sponsor_desc: '凌镜摄影社团积极寻求与摄影器材品牌、影像服务商、文化机构及相关企业的合作机会。我们希望通过跨界合作，为成员争取更多优质资源与实践机会，同时为合作伙伴提供精准的校园品牌曝光与内容共创支持。如果您对我们的社团感兴趣，欢迎通过上方联系方式与我们取得联系。',
  section_faq_title: '常见问题',
  contact_cards: [
    { platform: '社团邮箱', handle: 'lingjing@photo.club', desc: '社团官方邮箱，合作咨询、投稿均可联系' },
    { platform: '微信公众号', handle: '凌镜摄影', desc: '关注公众号获取最新活动资讯与作品推送' },
    { platform: '新浪微博', handle: '@凌镜摄影社团', desc: '在微博与我们互动，分享你的摄影作品' },
    { platform: 'B站', handle: '凌镜摄影', desc: '摄影教程、活动Vlog与创意短片首发平台' },
    { platform: '抖音', handle: 'lingjing_photo', desc: '短视频平台上的摄影技巧与日常记录' },
    { platform: '小红书', handle: '凌镜生活', desc: '摄影笔记、器材测评与社团生活分享' },
  ],
  mission: '凌镜——以镜头为镜，映照世间万象',
  values: [
    { name: '热爱', desc: '对摄影的热爱是我们相聚于此的初心，每一次按下快门都源于对光影的真诚热爱与不懈追求。' },
    { name: '专业', desc: '从构图到后期，从理论到实践，我们以专业态度对待每一张作品，追求技术与艺术的完美融合。' },
    { name: '分享', desc: '好的作品值得被看见。我们鼓励成员分享创作心得、交流技巧，让每个人都能在分享中成长。' },
    { name: '成长', desc: '从入门到进阶，凌镜陪伴每一位成员的摄影之路。在这里，学习永无止境，成长从不设限。' },
  ],
  history_summary: '凌镜摄影社团成立于2018年，由一群热爱摄影的同学自发组建。从最初的十几人小组，发展至今已拥有超过200名活跃成员，涵盖摄影创作、后期处理、品牌宣传与活动策划等多个方向。八年来，我们始终秉持"以镜头为镜，映照世间万象"的理念，定期举办摄影讲座、主题外拍、作品展览与技术沙龙，致力于为每一位热爱光影的同学提供一个学习、创作与成长的平台。无论你使用专业相机还是手机，只要你对摄影怀有热情，凌镜都欢迎你的加入。',
  sponsors: [
    { name: '器材品牌合作', type: '试机体验 / 产品评测 / 专属折扣' },
    { name: '影像服务商', type: '冲印服务 / 后期工具 / 存储方案' },
    { name: '文化机构', type: '展览场地 / 艺术指导 / 学术交流' },
    { name: '校园组织', type: '联合活动 / 互访交流 / 赛事合作' },
  ],
  faqs: [
    {
      q: '如何加入凌镜？',
      a: '凌镜在每学期初都会开放招新通道，你可以关注我们的微信公众号"凌镜摄影"获取最新招新信息。也可以直接发送邮件至 lingjing@photo.club 咨询报名事宜，或通过社团官方社交账号私信我们。我们欢迎所有对摄影感兴趣的同学加入，无需任何面试门槛。',
    },
    {
      q: '需要什么器材？',
      a: '完全不需要昂贵的器材！手机摄影同样可以创作出优秀的作品。社团内部有共享器材可供成员借用练习，同时我们也会定期举办器材体验活动，让你有机会接触各类相机与镜头。重要的是你的观察力与创造力，而非器材的价位。',
    },
    {
      q: '没有基础可以加入吗？',
      a: '当然可以！凌镜的成员来自各种专业和背景，很多同学加入时都是零基础。我们设有新手入门课程，涵盖相机操作基础、构图法则、光线运用等内容，还有学长学姐一对一辅导。只要你对摄影感兴趣，凌镜就是最好的起点。',
    },
    {
      q: '如何参加外拍活动？',
      a: '我们每月至少组织一次主题外拍活动，具体信息会提前通过微信公众号、社团群组及邮件通知。外拍活动通常包括城市街拍、自然风光、人文纪实等不同主题，由资深成员带队指导。部分活动需提前报名，名额有限，建议关注通知及时报名。社团器材也可以在外拍活动中借用。',
    },
  ],
}

// ---------- 工作室 ---------- //
export const DEFAULT_STUDIO = {
  hero_section_label: 'LingJing Studio',
  hero_title: '凌镜',
  hero_title_highlight: '工作室',
  hero_tagline: '因为热爱，校外再聚',
  hero_desc: '毕业不是终点，而是新的起点。凌镜工作室是社团校友在校外延续摄影热爱的平台，一个让热爱摄影的人永远有归处的地方。',
  section_about_label: '关于工作室',
  about_title: '热爱不止，步履不停',
  about_paragraphs: [
    '凌镜工作室诞生于一个朴素的愿望：让那些在社团里结下深厚摄影情谊的朋友们，在毕业后依然有一个共同的家。校园时光或许有终点，但对光影的热爱没有边界。',
    '作为凌镜摄影社团的校外延伸，工作室汇聚了已毕业的社团成员以及认同凌镜理念的摄影师们。这里不再受限于校园的围墙，而是面向更广阔的创作天地 —— 从商业拍摄到艺术创作，从独立项目到协作探索。',
    '工作室配备了专业影棚、后期设备和丰富的器材资源，定期举办线下创作活动和行业交流，致力于为每一位成员提供一个可以持续精进、自由创作的空间。因为热爱，我们校外再聚。',
  ],
  section_equip_title: '工作室设备清单',
  section_equip_subtitle: '共享器材，按需借用',
  section_org_title: '工作室运营结构',
  section_join_title: '如何成为工作室的一员',
  section_join_req_title: '基本要求',
  section_join_steps_title: '申请流程',
  section_contact_title: '与我们取得联系',
  contact_card_title: '凌镜工作室',
  contact_card_subtitle: '如果你对工作室感兴趣，或有任何合作与咨询需求，欢迎通过以下方式联系我们。',
  features: [
    { title: '专业影棚空间', desc: '配备全套灯光系统、无缝背景与拍摄道具，满足人像、产品、静物等多类型创作需求。' },
    { title: '后期工作区', desc: '提供色彩校准显示器与高性能工作站，搭配完整 Adobe 创意套件，打造专业后期环境。' },
    { title: '器材共享库', desc: '共享镜头、机身、滤镜、稳定器等器材设备，成员按需借用，降低个人创作门槛。' },
    { title: '定期线下活动', desc: '每月组织主题外拍、创作分享会与技术讲座，保持成员间的创作活力与紧密联系。' },
  ],
  org_groups: [
    { name: '运营组', desc: '负责工作室日常运营、活动策划与品牌推广，是工作室运转的核心驱动力。', roles: ['运营主管', '活动策划', '品牌推广'] },
    { name: '创作组', desc: '专注于摄影创作与艺术探索，组织主题拍摄项目与作品评审，推动成员创作力提升。', roles: ['创作总监', '项目负责人', '视觉指导'] },
    { name: '技术组', desc: '维护影棚设备与器材管理，提供后期技术支持，探索影像技术新方向。', roles: ['技术主管', '器材管理', '后期支持'] },
  ],
  requirements: [
    '热爱摄影，对影像创作有持续的热情',
    '具备一定的摄影基础和作品积累',
    '认同凌镜的理念，愿意参与协作与交流',
    '能够保证一定的参与时间与活跃度',
  ],
  join_steps: [
    { num: 1, title: '提交申请', desc: '填写工作室申请表，附上个人摄影作品集与简要自我介绍，发送至工作室邮箱。' },
    { num: 2, title: '作品评审', desc: '工作室创作组对提交的作品进行评审，综合评估技术能力、审美水平与创作风格。' },
    { num: 3, title: '面试交流', desc: '通过评审后，安排线上或线下交流，了解你的创作方向与加入意愿，双向选择。' },
    { num: 4, title: '正式加入', desc: '完成所有流程后，正式成为工作室成员，获得工作室资源使用权与活动参与资格。' },
  ],
  contacts: [
    { label: '电子邮箱', value: 'lingjing.studio@example.com' },
    { label: '微信公众号', value: 'LingJingStudio' },
    { label: '工作室地址', value: '创意园区B栋302' },
  ],
}

// slug → 默认值映射
export const SITE_DEFAULTS = {
  home: DEFAULT_HOME,
  history: DEFAULT_HISTORY,
  departments: DEFAULT_DEPARTMENTS,
  about: DEFAULT_ABOUT,
  studio: DEFAULT_STUDIO,
}

// 页面 slug → 中文标签
export const SITE_SLUG_LABEL = {
  home: '首页',
  history: '凌镜历史',
  departments: '部门介绍',
  about: '关于凌镜',
  studio: '工作室',
}

// -------- 图标映射（前端渲染时按索引取，不可编辑项） -------- //

// About 页联系卡片图标映射（前端渲染时按索引拿）
export const ABOUT_CONTACT_ICONS = [Mail, MessageCircle, AtSign, Tv, Music, BookOpen]

// About 页价值观图标映射
export const ABOUT_VALUE_ICONS = [Flame, Award, Share2, TrendingUp]

// About 页赞助商图标映射
export const ABOUT_SPONSOR_ICONS = [Camera, Monitor, Building2, Handshake]

// Studio 页 特色图标映射
export const STUDIO_FEATURE_ICONS = [Camera, Monitor, Package, Calendar]

// Studio 页 分组图标映射
export const STUDIO_ORG_ICONS = [Settings, Palette, Cpu]

// Studio 页 加入要求图标映射
export const STUDIO_REQ_ICONS = [Heart, Award, Users, Clock]

// Studio 页 联系方式图标映射
export const STUDIO_CONTACT_ICONS = [Mail, MessageCircle, MapPin]

// Departments 页 部门图标（按名称）
export const DEPT_ICON_MAP = {
  '摄影部': Camera,
  '技术部': Cpu,
  '宣传部': Megaphone,
}

// ============== 工具：深度合并（默认值为基础，用户值覆盖） ============== //
export function mergeSiteContent(def, userVal) {
  if (def === null || def === undefined) return userVal
  if (userVal === null || userVal === undefined || typeof userVal !== 'object') return def
  const isArrDef = Array.isArray(def)
  const isArrUsr = Array.isArray(userVal)
  if (isArrDef || isArrUsr) {
    // 数组：以用户版本为基础（用户可能增删了项），
    // 但对象项会按索引与默认项合并，补全默认结构中新增的字段（向前兼容）
    if (!isArrUsr) return def
    return userVal.map((x, i) => {
      const dv = Array.isArray(def) && i < def.length && def[i] && typeof def[i] === 'object' && !Array.isArray(def[i])
        ? def[i]
        : null
      if (x && typeof x === 'object' && !Array.isArray(x) && dv) {
        return mergeSiteContent(dv, x)
      }
      return x
    })
  }
  const out = {}
  for (const k of Object.keys(def)) {
    if (Object.prototype.hasOwnProperty.call(userVal, k)) {
      const dv = def[k]
      const uv = userVal[k]
      if (Array.isArray(dv) || Array.isArray(uv)) {
        out[k] = (Array.isArray(uv) ? uv : dv)
      } else if (dv && typeof dv === 'object' && uv && typeof uv === 'object') {
        out[k] = mergeSiteContent(dv, uv)
      } else {
        out[k] = uv
      }
    } else {
      out[k] = def[k]
    }
  }
  // 用户有而默认值没有的 key，也要保留（向前兼容新增字段）
  for (const k of Object.keys(userVal)) {
    if (!Object.prototype.hasOwnProperty.call(out, k)) {
      out[k] = userVal[k]
    }
  }
  return out
}
