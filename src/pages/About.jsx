import { Link } from 'react-router-dom'
import '../styles/pages/about.css'
import { Search, Mail,
  MessageCircle,
  AtSign,
  Tv,
  Music,
  BookOpen,
  Flame,
  Award,
  Share2,
  TrendingUp,
  Camera,
  Image,
  Building2,
  Handshake,
  ChevronDown,
} from 'lucide-react'

const CONTACT_CARDS = [
  { icon: Mail, platform: '社团邮箱', handle: 'lingjing@photo.club', desc: '社团官方邮箱，合作咨询、投稿均可联系' },
  { icon: MessageCircle, platform: '微信公众号', handle: '凌镜摄影', desc: '关注公众号获取最新活动资讯与作品推送' },
  { icon: AtSign, platform: '新浪微博', handle: '@凌镜摄影社团', desc: '在微博与我们互动，分享你的摄影作品' },
  { icon: Tv, platform: 'B站', handle: '凌镜摄影', desc: '摄影教程、活动Vlog与创意短片首发平台' },
  { icon: Music, platform: '抖音', handle: 'lingjing_photo', desc: '短视频平台上的摄影技巧与日常记录' },
  { icon: BookOpen, platform: '小红书', handle: '凌镜生活', desc: '摄影笔记、器材测评与社团生活分享' },
]

const VALUES = [
  { icon: Flame, name: '热爱', desc: '对摄影的热爱是我们相聚于此的初心，每一次按下快门都源于对光影的真诚热爱与不懈追求。' },
  { icon: Award, name: '专业', desc: '从构图到后期，从理论到实践，我们以专业态度对待每一张作品，追求技术与艺术的完美融合。' },
  { icon: Share2, name: '分享', desc: '好的作品值得被看见。我们鼓励成员分享创作心得、交流技巧，让每个人都能在分享中成长。' },
  { icon: TrendingUp, name: '成长', desc: '从入门到进阶，凌镜陪伴每一位成员的摄影之路。在这里，学习永无止境，成长从不设限。' },
]

const SPONSOR_CARDS = [
  { icon: Camera, name: '器材品牌合作', type: '试机体验 / 产品评测 / 专属折扣' },
  { icon: Image, name: '影像服务商', type: '冲印服务 / 后期工具 / 存储方案' },
  { icon: Building2, name: '文化机构', type: '展览场地 / 艺术指导 / 学术交流' },
  { icon: Handshake, name: '校园组织', type: '联合活动 / 互访交流 / 赛事合作' },
]

const FAQS = [
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
]

function About() {
  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">关于凌镜</span>
          </div>
          <h1 className="lj-page-title">关于凌镜</h1>
          <p className="lj-page-subtitle">了解凌镜摄影社团的故事、理念与联系方式</p>
        </div>
      </section>

      {/* Search */}
      <section className="lj-search-section">
        <div className="lj-search-wrap">
          <div className="lj-search-icon">
            <Search style={{ width: 20, height: 20 }} />
          </div>
          <input type="text" className="lj-search-input" placeholder="搜索作品、成员、日记..." aria-label="搜索" />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 联系我们 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">联系我们</h2>
          <div className="lj-contact-grid">
            {CONTACT_CARDS.map((c) => (
              <div className="lj-contact-card" key={c.platform}>
                <div className="lj-contact-icon">
                  <c.icon style={{ width: 20, height: 20 }} />
                </div>
                <div className="lj-contact-platform">{c.platform}</div>
                <div className="lj-contact-handle">{c.handle}</div>
                <div className="lj-contact-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 关于凌镜 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">关于凌镜</h2>
          <div className="lj-mission">
            <p className="lj-mission-text">凌镜——以镜头为镜，映照世间万象</p>
          </div>
          <div className="lj-values-grid">
            {VALUES.map((v) => (
              <div className="lj-value-card" key={v.name}>
                <div className="lj-value-icon">
                  <v.icon style={{ width: 22, height: 22 }} />
                </div>
                <h3 className="lj-value-name">{v.name}</h3>
                <p className="lj-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="lj-history-summary">
            <p>
              凌镜摄影社团成立于2018年，由一群热爱摄影的同学自发组建。从最初的十几人小组，发展至今已拥有超过200名活跃成员，涵盖摄影创作、后期处理、品牌宣传与活动策划等多个方向。八年来，我们始终秉持"以镜头为镜，映照世间万象"的理念，定期举办摄影讲座、主题外拍、作品展览与技术沙龙，致力于为每一位热爱光影的同学提供一个学习、创作与成长的平台。无论你使用专业相机还是手机，只要你对摄影怀有热情，凌镜都欢迎你的加入。
            </p>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 合作与赞助 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">合作与赞助</h2>
          <div className="lj-sponsor-body">
            <p className="lj-sponsor-desc">
              凌镜摄影社团积极寻求与摄影器材品牌、影像服务商、文化机构及相关企业的合作机会。我们希望通过跨界合作，为成员争取更多优质资源与实践机会，同时为合作伙伴提供精准的校园品牌曝光与内容共创支持。如果您对我们的社团感兴趣，欢迎通过上方联系方式与我们取得联系。
            </p>
            <div className="lj-sponsor-cards">
              {SPONSOR_CARDS.map((s) => (
                <div className="lj-sponsor-card" key={s.name}>
                  <div className="lj-sponsor-icon">
                    <s.icon style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <div className="lj-sponsor-name">{s.name}</div>
                    <div className="lj-sponsor-type">{s.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* FAQ */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">常见问题</h2>
          <div className="lj-faq-list">
            {FAQS.map((f) => (
              <details className="lj-faq-item" key={f.q}>
                <summary className="lj-faq-summary">
                  {f.q}
                  <span className="lj-faq-chevron">
                    <ChevronDown style={{ width: 18, height: 18 }} />
                  </span>
                </summary>
                <div className="lj-faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default About