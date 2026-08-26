import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Download } from 'lucide-react'
import '../styles/pages/resources.css'

const RESOURCES = [
  { cat: 'tutorial', title: '人像摄影入门完全指南', desc: '从构图到用光，从器材选择到后期调色，系统学习人像摄影的核心技巧。涵盖室内外场景、自然光与人造光的使用方法，帮助你快速提升人像作品质量。', tag: '摄影教程', author: '张明远', views: '3.2k', downloads: '1.8k', bg: 'linear-gradient(135deg, #2D5F8A, #4A90D9, #6AADE8)' },
  { cat: 'post', title: 'Lightroom 调色 workflow 详解', desc: '详解从 RAW 到成片的完整调色流程，包括曝光校正、白平衡调整、HSL 面板运用、预设创建等关键步骤，附带 10 组凌镜专属调色预设。', tag: '后期技巧', author: '李思琪', views: '2.7k', downloads: '1.5k', bg: 'linear-gradient(135deg, #6D28D9, #8B5CF6, #A78BFA)' },
  { cat: 'gear', title: '2026 学生党相机选购指南', desc: '针对预算有限的摄影爱好者，全面对比佳能、尼康、索尼三大品牌入门级机型的画质、对焦、视频能力与性价比，助你找到最适合的第一台相机。', tag: '器材评测', author: '王浩宇', views: '4.1k', downloads: '2.3k', bg: 'linear-gradient(135deg, #0369A1, #0EA5E9, #38BDF8)' },
  { cat: 'composition', title: '构图法则：从三分法到视觉引导', desc: '深入解析经典构图法则的原理与实战应用，涵盖三分法、黄金螺旋、对角线构图、框架构图等多种技巧，通过 50+ 实例帮助你掌握画面结构的艺术。', tag: '构图指南', author: '陈雨薇', views: '2.9k', downloads: '1.2k', bg: 'linear-gradient(135deg, #047857, #10B981, #34D399)' },
  { cat: 'light', title: '自然光摄影：抓住黄金时刻', desc: '详解日出日落、蓝色时刻、逆光与侧光等自然光条件下拍摄技巧。学会利用光线塑造画面氛围，让每一张照片都充满戏剧性与层次感。', tag: '光影知识', author: '刘子涵', views: '2.1k', downloads: '980', bg: 'linear-gradient(135deg, #B45309, #F59E0B, #FBBF24)' },
  { cat: 'tutorial', title: '街拍纪实：记录城市的脉搏', desc: '从布列松的决定性瞬间到当代街头摄影实践，学习如何在街头捕捉生活瞬间。探讨快拍技巧、盲拍方法以及街拍中的法律与伦理问题。', tag: '摄影教程', author: '赵思远', views: '1.8k', downloads: '860', bg: 'linear-gradient(135deg, #BE185D, #EC4899, #F472B6)' },
  { cat: 'post', title: 'Photoshop 人像精修技法', desc: '零基础学习人像精修核心技法，包括磨皮、液化、色彩分级与背景处理。附带凌镜出片标准流程与练习素材包，可跟随教程逐步实操。', tag: '后期技巧', author: '李思琪', views: '3.5k', downloads: '2.1k', bg: 'linear-gradient(135deg, #4338CA, #6366F1, #818CF8)' },
  { cat: 'gear', title: '镜头选择指南：定焦 vs 变焦', desc: '深入分析不同焦段镜头的成像特点与适用场景，从 35mm 到 200mm 的全面对比。帮助你根据拍摄题材和个人预算，构建最实用的镜头配置方案。', tag: '器材评测', author: '王浩宇', views: '2.4k', downloads: '1.1k', bg: 'linear-gradient(135deg, #0F766E, #14B8A6, #2DD4BF)' },
  { cat: 'light', title: '闪光灯入门与布光实战', desc: '从机顶闪光灯到离机闪，从单灯到多灯布光方案。详解 TTL 与手动模式的区别、柔光箱选择、反射布光技巧，让闪光灯不再是你的短板。', tag: '光影知识', author: '刘子涵', views: '1.6k', downloads: '750', bg: 'linear-gradient(135deg, #92400E, #D97706, #FCD34D)' },
]

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'tutorial', label: '摄影教程' },
  { key: 'post', label: '后期技巧' },
  { key: 'gear', label: '器材评测' },
  { key: 'composition', label: '构图指南' },
  { key: 'light', label: '光影知识' },
]

function Resources() {
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')

  const filtered = RESOURCES.filter((r) => {
    const matchCat = tab === 'all' || r.cat === tab
    const kw = keyword.trim().toLowerCase()
    const matchKw = !kw || r.title.toLowerCase().includes(kw) || r.desc.toLowerCase().includes(kw)
    return matchCat && matchKw
  })

  return (
    <>
      <section className="lj-page-header">
        <h1 className="lj-page-header-title">凌镜资源库</h1>
        <p className="lj-page-header-subtitle">摄影技巧、后期教程、器材评测一站式资源</p>
      </section>

      <div className="lj-search-bar">
        <div className="lj-search-icon">
          <Search style={{ width: 18, height: 18 }} />
        </div>
        <input
          type="text"
          className="lj-search-input"
          placeholder="搜索资源：教程、技巧、器材评测..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="lj-category-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`lj-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="lj-resources-layout">
        <div className="lj-resource-grid">
          {filtered.map((r) => (
            <div className="lj-resource-card" key={r.title}>
              <div className="lj-resource-card-icon" style={{ background: r.bg }} />
              <div className="lj-resource-card-body">
                <h3 className="lj-resource-card-title">{r.title}</h3>
                <p className="lj-resource-card-desc">{r.desc}</p>
                <div className="lj-resource-card-footer">
                  <span className="lj-tag">{r.tag}</span>
                  <div className="lj-resource-card-meta">
                    <span>
                      <Eye style={{ width: 12, height: 12 }} /> {r.views}
                    </span>
                    <span>
                      <Download style={{ width: 12, height: 12 }} /> {r.downloads}
                    </span>
                    <span>{r.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {filtered.length === 0 && (
        <div className="lj-resources-layout" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--lj-ink-3)' }}>没有找到匹配的资源</p>
        </div>
      )}
    </>
  )
}

export default Resources