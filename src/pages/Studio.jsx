import {
  Sparkles,
  UserPlus,
  Mail,
  ChevronDown,
  Info,
  Camera,
  Monitor,
  Package,
  Calendar,
  Settings,
  Palette,
  Cpu,
  Heart,
  Award,
  Users,
  Clock,
  CheckCircle,
  Route,
  MessageCircle,
  MapPin,
} from 'lucide-react'
import '../styles/pages/studio.css'

const FEATURES = [
  { icon: Camera, title: '专业影棚空间', desc: '配备全套灯光系统、无缝背景与拍摄道具，满足人像、产品、静物等多类型创作需求。' },
  { icon: Monitor, title: '后期工作区', desc: '提供色彩校准显示器与高性能工作站，搭配完整 Adobe 创意套件，打造专业后期环境。' },
  { icon: Package, title: '器材共享库', desc: '共享镜头、机身、滤镜、稳定器等器材设备，成员按需借用，降低个人创作门槛。' },
  { icon: Calendar, title: '定期线下活动', desc: '每月组织主题外拍、创作分享会与技术讲座，保持成员间的创作活力与紧密联系。' },
]

const ORG = [
  { icon: Settings, name: '运营组', desc: '负责工作室日常运营、活动策划与品牌推广，是工作室运转的核心驱动力。', roles: ['运营主管', '活动策划', '品牌推广'] },
  { icon: Palette, name: '创作组', desc: '专注于摄影创作与艺术探索，组织主题拍摄项目与作品评审，推动成员创作力提升。', roles: ['创作总监', '项目负责人', '视觉指导'] },
  { icon: Cpu, name: '技术组', desc: '维护影棚设备与器材管理，提供后期技术支持，探索影像技术新方向。', roles: ['技术主管', '器材管理', '后期支持'] },
]

const REQUIREMENTS = [
  { icon: Heart, text: '热爱摄影，对影像创作有持续的热情' },
  { icon: Award, text: '具备一定的摄影基础和作品积累' },
  { icon: Users, text: '认同凌镜的理念，愿意参与协作与交流' },
  { icon: Clock, text: '能够保证一定的参与时间与活跃度' },
]

const STEPS = [
  { num: 1, title: '提交申请', desc: '填写工作室申请表，附上个人摄影作品集与简要自我介绍，发送至工作室邮箱。' },
  { num: 2, title: '作品评审', desc: '工作室创作组对提交的作品进行评审，综合评估技术能力、审美水平与创作风格。' },
  { num: 3, title: '面试交流', desc: '通过评审后，安排线上或线下交流，了解你的创作方向与加入意愿，双向选择。' },
  { num: 4, title: '正式加入', desc: '完成所有流程后，正式成为工作室成员，获得工作室资源使用权与活动参与资格。' },
]

const CONTACTS = [
  { icon: Mail, label: '电子邮箱', value: 'lingjing.studio@example.com' },
  { icon: MessageCircle, label: '微信公众号', value: 'LingJingStudio' },
  { icon: MapPin, label: '工作室地址', value: '创意园区B栋302' },
]

function Studio() {
  return (
    <>
      <section className="lj-hero-studio">
        <div className="lj-section-label">
          <Sparkles style={{ width: 14, height: 14 }} />
          LingJing Studio
        </div>
        <h1 className="lj-hero-studio-title">
          凌镜<span>工作室</span>
        </h1>
        <p className="lj-hero-studio-tagline">因为热爱，校外再聚</p>
        <p className="lj-hero-studio-desc">
          毕业不是终点，而是新的起点。凌镜工作室是社团校友在校外延续摄影热爱的平台，一个让热爱摄影的人永远有归处的地方。
        </p>
        <div className="lj-hero-ctas">
          <a href="#join" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <UserPlus style={{ width: 16, height: 16 }} />
            申请加入
          </a>
          <a href="#contact" className="lj-btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <Mail style={{ width: 16, height: 16 }} />
            联系我们
          </a>
        </div>
        <div className="lj-scroll-indicator">
          <ChevronDown style={{ width: 24, height: 24 }} />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 工作室介绍 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <div className="lj-intro-split">
            <div>
              <div className="lj-section-label">
                <Info style={{ width: 14, height: 14 }} />
                关于工作室
              </div>
              <h2 className="lj-section-title" style={{ marginBottom: 24 }}>
                热爱不止，步履不停
              </h2>
              <div className="lj-intro-left-body">
                <p>
                  凌镜工作室诞生于一个朴素的愿望：让那些在社团里结下深厚摄影情谊的朋友们，在毕业后依然有一个共同的家。校园时光或许有终点，但对光影的热爱没有边界。
                </p>
                <p>
                  作为凌镜摄影社团的校外延伸，工作室汇聚了已毕业的社团成员以及认同凌镜理念的摄影师们。这里不再受限于校园的围墙，而是面向更广阔的创作天地 —— 从商业拍摄到艺术创作，从独立项目到协作探索。
                </p>
                <p>
                  工作室配备了专业影棚、后期设备和丰富的器材资源，定期举办线下创作活动和行业交流，致力于为每一位成员提供一个可以持续精进、自由创作的空间。因为热爱，我们校外再聚。
                </p>
              </div>
            </div>
            <div>
              <div className="lj-feature-list">
                {FEATURES.map((f) => (
                  <div className="lj-feature-item" key={f.title}>
                    <div className="lj-feature-icon">
                      <f.icon style={{ width: 20, height: 20 }} />
                    </div>
                    <div className="lj-feature-text">
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 运营结构 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            工作室运营结构
          </h2>
          <div className="lj-org-wrapper">
            <div className="lj-org-root">
              工作室负责人
              <div className="lj-org-root-sub">统筹规划与对外合作</div>
            </div>
            <div className="lj-org-connector-v" />
            <div className="lj-org-connector-h-wrapper" />
            <div className="lj-org-groups-row">
              {ORG.map((g) => (
                <div className="lj-org-group-col" key={g.name}>
                  <div className="lj-org-drop-line" />
                  <div className="lj-org-group-card">
                    <div className="lj-org-group-icon">
                      <g.icon style={{ width: 20, height: 20 }} />
                    </div>
                    <h3 className="lj-org-group-name">{g.name}</h3>
                    <p className="lj-org-group-desc">{g.desc}</p>
                    <div className="lj-org-roles">
                      {g.roles.map((r) => (
                        <span className="lj-org-role-tag" key={r}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 如何加入 */}
      <section className="lj-section" id="join">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            如何成为工作室的一员
          </h2>
          <div className="lj-join-grid">
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 18, color: 'var(--lj-ink)', marginBottom: 20 }}>
                <CheckCircle
                  style={{
                    width: 18,
                    height: 18,
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 6,
                    color: 'var(--lj-brand)',
                  }}
                />
                基本要求
              </h3>
              <div className="lj-join-req-list">
                {REQUIREMENTS.map((r) => (
                  <div className="lj-join-req-item" key={r.text}>
                    <div className="lj-join-req-icon">
                      <r.icon style={{ width: 14, height: 14 }} />
                    </div>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 18, color: 'var(--lj-ink)', marginBottom: 20 }}>
                <Route
                  style={{
                    width: 18,
                    height: 18,
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 6,
                    color: 'var(--lj-brand)',
                  }}
                />
                申请流程
              </h3>
              <div className="lj-steps-list">
                {STEPS.map((s) => (
                  <div className="lj-step-card" key={s.num}>
                    <div className="lj-step-number">{s.num}</div>
                    <div className="lj-step-content">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 联系 */}
      <section className="lj-section" id="contact">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            与我们取得联系
          </h2>
          <div className="lj-contact-card">
            <h3 className="lj-contact-title">凌镜工作室</h3>
            <p className="lj-contact-subtitle">如果你对工作室感兴趣，或有任何合作与咨询需求，欢迎通过以下方式联系我们。</p>
            <div className="lj-contact-items">
              {CONTACTS.map((c) => (
                <div className="lj-contact-item" key={c.label}>
                  <div className="lj-contact-item-icon">
                    <c.icon style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <div className="lj-contact-item-label">{c.label}</div>
                    <div className="lj-contact-item-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Studio