import { useState, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Upload, FileText, BookImage, BookOpen, Send, CheckCircle, AlertCircle, Eye, ImagePlus, X } from 'lucide-react'
import { submitWork, listMySubmissions, uploadImage } from '../api'
import { isLoggedIn } from '../auth'
import '../styles/pages/submit.css'

const BOARDS = [
  {
    key: 'photo',
    label: '作品展示',
    icon: BookImage,
    desc: '上传摄影作品，填写作品名 + 分类 + 署名',
    hint: '示例：一张城市夜景 / 人像照片，可附上图片链接或渐变封面配色',
  },
  {
    key: 'resource',
    label: '资源库',
    icon: FileText,
    desc: '像网站中一样做干货分享：教程、评测、指南',
    hint: '示例：《人像摄影入门指南》：分类、简介、完整正文',
  },
  {
    key: 'diary',
    label: '日记本',
    icon: BookOpen,
    desc: '记录社团日常、活动点滴、拍摄心情',
    hint: '示例：2026 春季采风记录、外拍日记、社团聚会花絮',
  },
]

const PHOTO_CATEGORIES = ['风光', '人像', '街拍', '纪实', '静物', '创意', '投稿']
const RESOURCE_CATEGORIES = ['摄影教程', '后期技巧', '器材评测', '构图指南', '光影知识', '投稿']
const GRAD_PRESETS = [
  'linear-gradient(135deg, #2D5F8A, #4A90D9, #6AADE8)',
  'linear-gradient(135deg, #7C3AED, #A78BFA, #C4B5FD)',
  'linear-gradient(135deg, #0EA5E9, #22D3EE, #38BDF8)',
  'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
  'linear-gradient(135deg, #F59E0B, #FBBF24, #FCD34D)',
  'linear-gradient(135deg, #EC4899, #F472B6, #F9A8D4)',
  'linear-gradient(135deg, #667EEA, #764BA2, #A78BFA)',
  'linear-gradient(135deg, #1E293B, #334155, #64748B)',
]

const MOOD_OPTIONS = [
  { key: 'happy', label: '😊 开心' },
  { key: 'excited', label: '🔥 激动' },
  { key: 'peaceful', label: '☁️ 平静' },
  { key: 'tired', label: '😮‍💨 疲惫' },
  { key: 'nostalgic', label: '🌆 怀旧' },
]

function Submit() {
  const navigate = useNavigate()
  const [board, setBoard] = useState('photo')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [mine, setMine] = useState(null)
  const [showMine, setShowMine] = useState(false)

  // photo form
  const [pTitle, setPTitle] = useState('')
  const [pCat, setPCat] = useState(PHOTO_CATEGORIES[0])
  const [pAuthor, setPAuthor] = useState('')
  const [pDesc, setPDesc] = useState('')
  const [pImage, setPImage] = useState('')
  const [pGrad, setPGrad] = useState(GRAD_PRESETS[0])
  const [pUploadProgress, setPUploadProgress] = useState(0)
  const [pUploading, setPUploading] = useState(false)
  const [pPreview, setPPreview] = useState('')
  const pFileRef = useRef(null)

  // resource form
  const [rTitle, setRTitle] = useState('')
  const [rCat, setRCat] = useState(RESOURCE_CATEGORIES[0])
  const [rAuthor, setRAuthor] = useState('')
  const [rSummary, setRSummary] = useState('')
  const [rFull, setRFull] = useState('')

  // diary form
  const [dDate, setDDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [dTitle, setDTitle] = useState('')
  const [dAuthor, setDAuthor] = useState('')
  const [dMood, setDMood] = useState('happy')
  const [dContent, setDContent] = useState('')

  const currentBoard = useMemo(() => BOARDS.find((b) => b.key === board) || BOARDS[0], [board])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      let payload = {}
      if (board === 'photo') {
        if (!pTitle.trim()) throw new Error('请填写作品名')
        payload = {
          title: pTitle.trim(),
          cat: pCat,
          author: pAuthor.trim(),
          desc: pDesc.trim(),
          image: pImage.trim() || null,
          grad: pGrad,
          likes: 0,
        }
      } else if (board === 'resource') {
        if (!rTitle.trim()) throw new Error('请填写标题')
        if (!rSummary.trim() && !rFull.trim()) throw new Error('请填写简介或正文')
        payload = {
          title: rTitle.trim(),
          cat: rCat,
          author: rAuthor.trim(),
          summary: rSummary.trim(),
          fullDesc: rFull.trim(),
          views: 0,
          downloads: 0,
          coverGrad: GRAD_PRESETS[(rCat.length + rTitle.length) % GRAD_PRESETS.length],
        }
      } else if (board === 'diary') {
        if (!dTitle.trim()) throw new Error('请填写日记标题')
        if (!dContent.trim()) throw new Error('请填写日记内容')
        payload = {
          date: dDate,
          title: dTitle.trim(),
          author: dAuthor.trim(),
          mood: dMood,
          content: dContent.trim(),
        }
      }
      await submitWork(board, payload)
      setSuccess(
        '提交成功！管理员将尽快审核，审核通过后会自动出现在对应板块中。',
      )
      // 重置当前表单
      if (board === 'photo') setPTitle(''); setPDesc(''); setPImage('')
      if (board === 'resource') { setRTitle(''); setRSummary(''); setRFull('') }
      if (board === 'diary') { setDTitle(''); setDContent('') }
      setTimeout(() => setSuccess(''), 6000)
    } catch (err) {
      setError(err.message || '提交失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  async function loadMine() {
    try {
      const res = await listMySubmissions()
      setMine(res.submissions || [])
      setShowMine(true)
    } catch (err) {
      setError(err.message || '无法加载我的投稿')
    }
  }

  async function handlePhotoFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    // 安全清空 input，防止同一个文件被视为没改无法再次 onChange
    e.target.value = ''
    setError('')
    setSuccess('')
    setPUploading(true)
    setPUploadProgress(5)
    setPPreview(URL.createObjectURL(file))
    try {
      const res = await uploadImage(file, {
        onProgress: (p) => setPUploadProgress(p),
      })
      setPImage(res.url || '')
      setSuccess('图片上传成功！已自动填入图片链接，可继续填写作品信息')
    } catch (err) {
      setPPreview('')
      setError(err.message || '图片上传失败')
    } finally {
      setPUploading(false)
    }
  }

  function clearPhotoUpload() {
    setPImage('')
    setPPreview('')
    setPUploadProgress(0)
    if (pFileRef.current) pFileRef.current.value = ''
  }

  if (!isLoggedIn()) {
    return (
      <section className="lj-submit-page">
        <div className="lj-submit-card">
          <div className="lj-submit-login-hint">
            <AlertCircle size={40} style={{ color: 'var(--lj-brand)' }} />
            <h2>请先登录</h2>
            <p>登录后即可向社团网站投稿，作品/资源/日记经管理员审核通过后会展示在对应板块。</p>
            <Link to="/auth" className="lj-btn-primary">前往登录 / 注册</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="lj-submit-page">
      <div className="lj-submit-inner">
        <header className="lj-submit-header">
          <div>
            <h1 className="lj-page-title">创作投稿</h1>
            <p className="lj-page-subtitle">
              选择目标板块，按对应格式提交内容 — 管理员审核通过后即可上线展示
            </p>
          </div>
          <button className="lj-btn-ghost" onClick={loadMine} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Eye size={16} />
            {showMine ? '隐藏我的投稿' : '查看我的投稿'}
          </button>
        </header>

        {showMine && mine && (
          <div className="lj-my-submissions">
            <h3>我的投稿（{mine.length}）</h3>
            {mine.length === 0 ? (
              <p style={{ color: 'var(--lj-ink-3)' }}>还没有投稿记录，从下面的表单开始创作吧 ✨</p>
            ) : (
              <ul className="lj-my-list">
                {mine.map((s) => (
                  <li key={s.id} className={`lj-my-item lj-status-${s.status}`}>
                    <div className="lj-my-main">
                      <span className="lj-my-board">
                        {s.board === 'photo' ? '作品' : s.board === 'resource' ? '资源' : '日记'}
                      </span>
                      <span className="lj-my-title">
                        {(s.payload && (s.payload.title || s.payload.name)) || '（无标题）'}
                      </span>
                    </div>
                    <span className={`lj-status-chip lj-status-${s.status}`}>
                      {s.status === 'pending' && '⏳ 待审核'}
                      {s.status === 'approved' && '✅ 已通过'}
                      {s.status === 'rejected' && '❌ 未通过'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="lj-submit-board-tabs">
          {BOARDS.map((b) => {
            const Icon = b.icon
            const active = board === b.key
            return (
              <button
                key={b.key}
                className={`lj-board-tab${active ? ' active' : ''}`}
                onClick={() => {
                  setBoard(b.key)
                  setError('')
                  setSuccess('')
                }}
              >
                <Icon size={18} />
                <div className="lj-board-tab-body">
                  <strong>{b.label}</strong>
                  <span>{b.desc}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="lj-submit-hint">
          <Upload size={16} /> {currentBoard.hint}
        </div>

        {success && (
          <div className="lj-form-success">
            <CheckCircle size={18} /> {success}
          </div>
        )}
        {error && (
          <div className="lj-form-error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="lj-submit-form" onSubmit={handleSubmit}>
          {board === 'photo' && (
            <div className="lj-form-grid">
              <div className="lj-form-group">
                <label className="lj-form-label">* 作品名</label>
                <input className="lj-form-input" value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="例如：晨光中的城市" />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">分类</label>
                <select className="lj-form-input" value={pCat} onChange={(e) => setPCat(e.target.value)}>
                  {PHOTO_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">署名（留空则使用你的用户名）</label>
                <input className="lj-form-input" value={pAuthor} onChange={(e) => setPAuthor(e.target.value)} placeholder="例如：张明远" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">作品图片 * <span style={{ fontWeight: 400, color: 'var(--lj-ink-3)' }}>（推荐上传本地文件，也可填写链接）</span></label>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <input
                    ref={pFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoFileChange}
                  />
                  <button
                    type="button"
                    className="lj-btn-secondary"
                    disabled={pUploading}
                    onClick={() => pFileRef.current && pFileRef.current.click()}
                    style={{ display: 'inline-flex', gap: 6, alignItems: 'center', padding: '10px 16px', opacity: pUploading ? 0.6 : 1 }}
                  >
                    <ImagePlus size={16} />
                    {pUploading ? `上传中 ${pUploadProgress}%` : '选择本地图片上传'}
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--lj-ink-3)' }}>
                    支持 JPG / PNG / WEBP，单张 ≤ 5MB
                  </span>
                  {(pPreview || pImage) && (
                    <button
                      type="button"
                      className="lj-btn-ghost"
                      onClick={clearPhotoUpload}
                      style={{ padding: '6px 10px', color: '#F87171', borderColor: 'rgba(248,113,113,0.3)', marginLeft: 'auto' }}
                    >
                      <X size={14} /> 清除图片
                    </button>
                  )}
                </div>

                {pUploading && (
                  <div style={{ width: '100%', height: 6, background: 'var(--lj-bg-alt)', borderRadius: 3, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pUploadProgress}%`, background: 'linear-gradient(90deg, var(--lj-brand), #22d3ee)', transition: 'width .2s' }} />
                  </div>
                )}

                {(pPreview || pImage) && (
                  <div style={{ borderRadius: 10, padding: 8, border: '1px solid var(--lj-border)', marginBottom: 10, background: 'var(--lj-bg-alt)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={pPreview || pImage}
                      alt="上传预览"
                      style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, background: pGrad }}
                      onError={(e) => { e.currentTarget.style.background = pGrad; e.currentTarget.style.opacity = 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>✅ 已设置作品封面</div>
                      <div style={{ fontSize: 12, color: 'var(--lj-ink-3)', wordBreak: 'break-all' }}>
                        {pImage || '(本地预览中... 上传完成后自动填入)'}
                      </div>
                    </div>
                  </div>
                )}

                <label className="lj-form-label" style={{ marginTop: 4, fontSize: 12, color: 'var(--lj-ink-3)' }}>
                  或填写图片网络链接（可选，如已有图床）
                </label>
                <input className="lj-form-input" value={pImage} onChange={(e) => { setPImage(e.target.value); setPPreview('') }} placeholder="https://... （上传了本地图可忽略此项）" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">作品简介（可选）</label>
                <textarea className="lj-form-input" rows={3} value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="一句话介绍这张作品的拍摄背景或灵感…" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">封面配色（无图时使用）</label>
                <div className="lj-grad-presets">
                  {GRAD_PRESETS.map((g, i) => (
                    <button
                      type="button"
                      key={i}
                      style={{ background: g }}
                      className={`lj-grad-opt${pGrad === g ? ' active' : ''}`}
                      onClick={() => setPGrad(g)}
                      aria-label="选择封面配色"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {board === 'resource' && (
            <div className="lj-form-grid">
              <div className="lj-form-group">
                <label className="lj-form-label">* 标题</label>
                <input className="lj-form-input" value={rTitle} onChange={(e) => setRTitle(e.target.value)} placeholder="例如：人像摄影入门完全指南" />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">分类</label>
                <select className="lj-form-input" value={rCat} onChange={(e) => setRCat(e.target.value)}>
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">署名（留空则使用你的用户名）</label>
                <input className="lj-form-input" value={rAuthor} onChange={(e) => setRAuthor(e.target.value)} placeholder="例如：李晨曦" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">* 内容简介</label>
                <textarea className="lj-form-input" rows={2} value={rSummary} onChange={(e) => setRSummary(e.target.value)} placeholder="卡片上展示的一句话描述，例如：从构图到用光…系统学习人像摄影核心技巧" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">完整正文 / 干货内容</label>
                <textarea className="lj-form-input" rows={10} value={rFull} onChange={(e) => setRFull(e.target.value)} placeholder="在这里写完整内容，包含步骤、要点、示例等…" />
              </div>
            </div>
          )}

          {board === 'diary' && (
            <div className="lj-form-grid">
              <div className="lj-form-group">
                <label className="lj-form-label">日期</label>
                <input className="lj-form-input" type="date" value={dDate} onChange={(e) => setDDate(e.target.value)} />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">心情</label>
                <select className="lj-form-input" value={dMood} onChange={(e) => setDMood(e.target.value)}>
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">* 日记标题</label>
                <input className="lj-form-input" value={dTitle} onChange={(e) => setDTitle(e.target.value)} placeholder="例如：春日樱花外拍记录" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">署名（留空则使用你的用户名）</label>
                <input className="lj-form-input" value={dAuthor} onChange={(e) => setDAuthor(e.target.value)} placeholder="例如：小曦光" />
              </div>
              <div className="lj-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="lj-form-label">* 日记内容</label>
                <textarea className="lj-form-input" rows={10} value={dContent} onChange={(e) => setDContent(e.target.value)} placeholder="写下今天发生的事、拍摄的故事、社团活动的点滴…" />
              </div>
            </div>
          )}

          <div className="lj-submit-actions">
            <button type="submit" className="lj-btn-primary" disabled={loading} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <Send size={16} />
              {loading ? '提交中…' : '提交审核'}
            </button>
            <button
              type="button"
              className="lj-btn-ghost"
              onClick={() =>
                navigate(
                  board === 'photo'
                    ? '/gallery'
                    : board === 'resource'
                      ? '/resources'
                      : '/diary',
                )
              }
            >
              返回板块页面
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Submit
