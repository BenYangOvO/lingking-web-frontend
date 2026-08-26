import { Image } from 'lucide-react'
import '../styles/pages/history.css'

const TIMELINE = [
  { year: '2018', title: '凌镜诞生', desc: '社团成立，首届成员招募。一群热爱摄影的年轻人走到一起，用镜头记录校园的每一个瞬间，开启了凌镜的故事。' },
  { year: '2019', title: '第一次影展', desc: '举办校园摄影展，获广泛好评。百余幅作品展出，吸引了上千名师生驻足观看，凌镜的名字第一次被广泛认识。' },
  { year: '2020', title: '线上转型', desc: '疫情期间坚持线上教学与分享。隔着屏幕传递摄影知识，组织线上打卡与点评，让热爱不受距离阻隔。' },
  { year: '2021', title: '品牌升级', desc: '确立凌镜品牌体系，开设微信公众号。统一视觉形象，系统化内容输出，凌镜开始走向更广阔的舞台。' },
  { year: '2022', title: '跨校合作', desc: '与多所高校摄影社团联合办展。打破校园边界，与兄弟社团交流学习，在更广阔的平台上展示凌镜的实力。' },
  { year: '2023', title: '工作室成立', desc: '校外工作室"因为热爱"正式成立。从校园走向社会，有了属于自己的创作空间，凌镜的梦想有了安放的角落。' },
  { year: '2024', title: '十周年筹备', desc: '社团影响力持续扩大。成员遍及各行各业，作品传播于更广阔的平台，凌镜正蓄力迎接新的篇章。' },
]

function History() {
  return (
    <>
      <section className="lj-hero pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
          >
            <span className="lj-logo-text">先有人还是先有社</span>
          </h1>
          <p className="text-ink-2 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">凌镜的起源与发展历程</p>
          <div className="mt-8">
            <span
              className="inline-block w-16 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(to right, var(--lj-brand), var(--lj-brand-light))' }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 lj-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
              时间轴
            </h2>
            <div className="lj-section-line" />
            <p className="text-ink-2 mt-4 text-base sm:text-lg">从萌芽到绽放，每一步都是热爱的印记</p>
          </div>

          <div className="lj-timeline">
            {TIMELINE.map((e) => (
              <div className="lj-timeline-item lj-fade-in" key={e.year}>
                <div className="lj-timeline-node" />
                <div className="lj-timeline-card">
                  <span className="lj-year-badge">{e.year}</span>
                  <h3 className="mt-3">{e.title}</h3>
                  <p>{e.desc}</p>
                  <div className="lj-timeline-img">
                    <Image
                      className="w-8 h-8"
                      style={{ color: 'var(--lj-ink-3)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default History