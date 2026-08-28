import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Image,
  FileText,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Filter,
  Eye,
  ChevronDown,
  AlertTriangle,
  LogIn,
  UserCog,
  Crown,
  Search,
  Layers,
  Edit3,
  Home,
  History,
  Building2,
  Info,
  Video,
  ExternalLink,
} from 'lucide-react'
import {
  getAdminStats,
  listAdminSubmissions,
  listAdminUsers,
  reviewSubmission,
  deleteSubmission,
  listAdminContent,
  deleteContent,
  setUserRole,
  deleteUser,
  getSiteContent,
} from '../api'
import { isAdmin as authIsAdmin, logout } from '../auth'
import SiteContentEditor from '../components/SiteContentEditor'
import { SITE_DEFAULTS, SITE_SLUG_LABEL, mergeSiteContent } from '../siteContentDefaults'
import '../styles/pages/admin.css'
import '../styles/components/site-content-editor.css'

const STATUSES = [
  { key: '', label: '全部', icon: Filter },
  { key: 'pending', label: '待审核', icon: Clock },
  { key: 'approved', label: '已通过', icon: CheckCircle2 },
  { key: 'rejected', label: '未通过', icon: XCircle },
]
const BOARDS = [
  { key: '', label: '全部板块', icon: Filter },
  { key: 'photo', label: '作品展示', icon: Image },
  { key: 'resource', label: '资源库', icon: FileText },
  { key: 'diary', label: '日记本', icon: BookOpen },
]

function fmtTime(ts) {
  if (!ts) return '-'
  try {
    const d = new Date(Number(ts) * 1000)
    return d.toLocaleString('zh-CN', { hour12: false })
  } catch {
    return '-'
  }
}

function SubmissionPreview({ s, onClose }) {
  if (!s) return null
  const board = s.board
  const p = s.payload || {}
  const BoardIcon = board === 'photo' ? Image : board === 'resource' ? FileText : BookOpen
  return (
    <div className="lj-modal-mask" onClick={onClose}>
      <div className="lj-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lj-modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`lj-status-chip lj-status-${s.status}`}>
              {s.status === 'pending' && '⏳ 待审核'}
              {s.status === 'approved' && '✅ 已通过'}
              {s.status === 'rejected' && '❌ 未通过'}
            </span>
            <span className="lj-my-board">
              <BoardIcon size={12} style={{ display: 'inline-block', marginRight: 4, verticalAlign: '-2px' }} />
              {board === 'photo' ? '作品' : board === 'resource' ? '资源' : '日记'}
            </span>
          </div>
          <button className="lj-btn-ghost" onClick={onClose}>关闭</button>
        </div>

        <div className="lj-modal-body">
          <div className="lj-meta-row">
            <span><b>ID:</b> {s.id}</span>
            <span><b>提交者:</b> {s.submitter_uname || s.submitter_name || `UID ${s.submitter_id}`}</span>
            <span><b>时间:</b> {fmtTime(s.created_at)}</span>
          </div>

          {board === 'photo' && (
            <div className="lj-preview-photo">
              {p.image ? (
                <img src={p.image} alt={p.title} onError={(e) => (e.target.style.display = 'none')} />
              ) : (
                <div className="lj-preview-photo-placeholder" style={{ background: p.grad || GRAD_FALLBACK }}>
                  <span>📷 无预览图</span>
                </div>
              )}
              <div className="lj-preview-meta">
                <h3>{p.title || '（无标题）'}</h3>
                <p className="lj-preview-line"><b>分类：</b>{p.cat || '-'}</p>
                <p className="lj-preview-line"><b>署名：</b>{p.author || '-'}</p>
                {p.desc && <p className="lj-preview-desc">{p.desc}</p>}
              </div>
            </div>
          )}

          {board === 'resource' && (
            <div className="lj-preview-resource">
              <h3 style={{ marginTop: 0 }}>{p.title}</h3>
              <p className="lj-preview-line"><b>分类：</b>{p.cat || '-'} &nbsp; <b>署名：</b>{p.author || '-'}</p>
              {p.summary && (
                <div className="lj-preview-section">
                  <h4>简介</h4>
                  <p>{p.summary}</p>
                </div>
              )}
              {(p.fullDesc || p.full_desc) && (
                <div className="lj-preview-section">
                  <h4>正文</h4>
                  <pre className="lj-preview-code">{p.fullDesc || p.full_desc}</pre>
                </div>
              )}
            </div>
          )}

          {board === 'diary' && (
            <div className="lj-preview-diary">
              <h3 style={{ marginTop: 0 }}>{p.title}</h3>
              <p className="lj-preview-line">
                <b>日期：</b>{p.date || '-'} &nbsp; <b>心情：</b>{p.mood || '-'} &nbsp; <b>署名：</b>{p.author || '-'}
              </p>
              <div className="lj-preview-section">
                <h4>正文</h4>
                <pre className="lj-preview-code">{p.content}</pre>
              </div>
            </div>
          )}

          {s.reviewed_at && (
            <div className="lj-review-history">
              <h4>审核记录</h4>
              <p style={{ margin: 0 }}>
                <b>审核时间：</b>{fmtTime(s.reviewed_at)} &nbsp; <b>状态：</b>
                {s.status === 'approved' ? '✅ 通过' : '❌ 拒绝'}
              </p>
              {s.review_note && (
                <p style={{ margin: '4px 0 0', color: 'var(--lj-ink-2)' }}>
                  <b>备注：</b>
                  {typeof s.review_note === 'string' ? s.review_note : s.review_note.note || ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const GRAD_FALLBACK = 'linear-gradient(135deg,#2D5F8A,#4A90D9,#6AADE8)'

const CONTENT_TYPES = [
  { key: 'photo', label: '作品展示', icon: Image },
  { key: 'resource', label: '资源库', icon: FileText },
  { key: 'diary', label: '日记本', icon: BookOpen },
]

// 固定板块（站点内容）快速编辑入口
const SITE_EDIT_QUICK = [
  { slug: 'home',        label: '首页',         icon: Home,      path: '/' },
  { slug: 'history',     label: '凌镜历史',     icon: History,   path: '/history' },
  { slug: 'departments', label: '部门介绍',     icon: Building2, path: '/departments' },
  { slug: 'about',       label: '关于凌镜',     icon: Info,      path: '/about' },
  { slug: 'studio',      label: '工作室',       icon: Video,     path: '/studio' },
]


function Admin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [subs, setSubs] = useState([])
  const [users, setUsers] = useState([])
  const [usersTab, setUsersTab] = useState(false)
  const [contentTab, setContentTab] = useState(false)
  const [filterBoard, setFilterBoard] = useState('')
  const [filterStatus, setFilterStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [acting, setActing] = useState(null)

  // 内容管理状态
  const [contentType, setContentType] = useState('photo')
  const [contentList, setContentList] = useState([])
  const [contentLoading, setContentLoading] = useState(false)

  // 固定板块（SiteContent）编辑弹窗状态
  const [siteEditorSlug, setSiteEditorSlug] = useState(null)
  const [siteEditorContent, setSiteEditorContent] = useState(null)
  const [siteEditorOpen, setSiteEditorOpen] = useState(false)

  async function openSiteQuickEditor(slug) {
    let content = SITE_DEFAULTS[slug]
    try {
      const res = await getSiteContent(slug)
      content = mergeSiteContent(SITE_DEFAULTS[slug] || {}, res?.content)
    } catch (_) { /* 失败时使用默认值 */ }
    setSiteEditorSlug(slug)
    setSiteEditorContent(content)
    setSiteEditorOpen(true)
  }

  const isAdminUser = authIsAdmin()

  async function loadAll() {
    setError('')
    try {
      const [s, list, u] = await Promise.all([
        getAdminStats(),
        listAdminSubmissions({ board: filterBoard, status: filterStatus }),
        listAdminUsers(),
      ])
      setStats(s)
      setSubs(list.submissions || [])
      setUsers(u.users || [])
    } catch (err) {
      setError(err.message || '加载失败，请确认已以管理员身份登录')
    }
  }

  async function loadContent() {
    setContentLoading(true)
    setError('')
    try {
      const res = await listAdminContent(contentType)
      setContentList(res.items || [])
    } catch (err) {
      setError(err.message || '加载内容失败')
      setContentList([])
    } finally {
      setContentLoading(false)
    }
  }

  useEffect(() => {
    if (isAdminUser && !contentTab) loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBoard, filterStatus, isAdminUser])

  useEffect(() => {
    if (isAdminUser && contentTab) loadContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, contentTab, isAdminUser])

  const filteredList = useMemo(() => {
    if (!search) return subs
    const q = search.toLowerCase()
    return subs.filter((s) => {
      const p = s.payload || {}
      const hay = [
        p.title,
        p.author,
        p.summary,
        s.submitter_uname || s.submitter_name,
        s.board,
        String(s.id),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [subs, search])

  async function handleReview(id, status) {
    const note = status === 'rejected' ? (window.prompt('请输入拒绝原因（可选）：') || '') : ''
    setActing(id)
    try {
      await reviewSubmission(id, status, note)
      await loadAll()
    } catch (err) {
      setError(err.message || '操作失败')
    } finally {
      setActing(null)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('确定要删除这条投稿吗？删除后不可恢复。')) return
    setActing(id)
    try {
      await deleteSubmission(id)
      setPreview(null)
      await loadAll()
    } catch (err) {
      setError(err.message || '删除失败')
    } finally {
      setActing(null)
    }
  }

  async function handleRole(uid, role) {
    try {
      await setUserRole(uid, role)
      await loadAll()
    } catch (err) {
      setError(err.message || '操作失败')
    }
  }

  async function handleDeleteUser(u) {
    if (!u) return
    if (u.role === 'admin' && !window.confirm(`管理员"${u.username || u.id}"有较高权限，确定要删除该账号吗？（会同时删除其所有投稿）`)) {
      if (u.role !== 'admin') return
      return
    }
    if (u.role !== 'admin') {
      const ok = window.confirm(
        `确定要删除成员账号 "${u.username || u.nickname || u.id}" 吗？\n该操作会同时删除其全部投稿，且不可恢复。`
      )
      if (!ok) return
    }
    setActing(`user-${u.id}`)
    try {
      await deleteUser(u.id)
      await loadAll()
    } catch (err) {
      setError(err.message || '删除失败')
    } finally {
      setActing(null)
    }
  }

  async function handleDeleteContent(id) {
    const label = id >= 10000 ? '此投稿内容' : '此静态内容'
    if (!window.confirm(`确定要从公开页面移除${label}吗？`)) return
    setActing(id)
    try {
      await deleteContent(contentType, id)
      await loadContent()
    } catch (err) {
      setError(err.message || '删除失败')
    } finally {
      setActing(null)
    }
  }

  if (!isAdminUser) {
    return (
      <section className="lj-admin-page">
        <div className="lj-admin-noauth">
          <ShieldAlert size={56} style={{ color: '#FBBF24' }} />
          <h2>管理员入口</h2>
          <p>你需要以管理员身份登录才能访问审核后台。</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/auth" className="lj-btn-primary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <LogIn size={16} />
              前往登录
            </Link>
            <button
              className="lj-btn-ghost"
              onClick={() => {
                logout()
                navigate('/auth')
              }}
            >
              切换账号
            </button>
          </div>
          <p style={{ fontSize: 13, marginTop: 20, color: 'var(--lj-ink-3)' }}>
            默认管理员账号：用户名 <code style={{ color: 'var(--lj-brand-light)' }}>admin</code> / 密码 <code style={{ color: 'var(--lj-brand-light)' }}>admin123</code>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="lj-admin-page">
      <div className="lj-admin-inner">
        <header className="lj-admin-header">
          <div>
            <h1 className="lj-page-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Crown size={24} style={{ color: 'var(--lj-brand-light)' }} />
              凌镜社团管理后台
            </h1>
            <p className="lj-page-subtitle">平台式可视化审核 · 用户管理 · 数据统计</p>
          </div>
          <div className="lj-admin-head-actions">
            <Link to="/submit" className="lj-btn-secondary">📝 创作投稿</Link>
            <Link to="/" className="lj-btn-ghost">返回首页</Link>
          </div>
        </header>

        {error && (
          <div className="lj-form-error" style={{ marginBottom: 16 }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {/* ---- 数据统计卡片 ---- */}
        <div className="lj-admin-stats">
          <StatCard
            icon={BarChart3}
            label="投稿总数"
            value={stats?.submissions_count ?? '-'}
            color="#60A5FA"
            sub={`待审核 ${stats?.pending_count ?? '-'}`}
          />
          <StatCard
            icon={CheckCircle2}
            label="已通过"
            value={stats?.approved_count ?? '-'}
            color="#34D399"
            sub={`通过率: ${stats?.submissions_count ? Math.round(((stats?.approved_count ?? 0) / stats.submissions_count) * 100) : 0}%`}
          />
          <StatCard
            icon={XCircle}
            label="未通过"
            value={stats?.rejected_count ?? '-'}
            color="#F87171"
            sub={`拒绝数: ${stats?.rejected_count ?? 0}`}
          />
          <StatCard
            icon={Users}
            label="注册用户"
            value={stats?.users_count ?? '-'}
            color="#C084FC"
            sub={`作品: ${stats?.by_board?.photo ?? 0} · 资源: ${stats?.by_board?.resource ?? 0} · 日记: ${stats?.by_board?.diary ?? 0}`}
          />
        </div>

        {/* ---- Tabs: 投稿 / 内容 / 用户 ---- */}
        <div className="lj-admin-tabs">
          <button
            className={`lj-admin-tab${!usersTab && !contentTab ? ' active' : ''}`}
            onClick={() => { setUsersTab(false); setContentTab(false) }}
          >
            <ShieldAlert size={16} /> 投稿审核 <span className="lj-tab-count">{stats?.pending_count ?? 0}</span>
          </button>
          <button
            className={`lj-admin-tab${contentTab ? ' active' : ''}`}
            onClick={() => { setUsersTab(false); setContentTab(true) }}
          >
            <Layers size={16} /> 内容管理
          </button>
          <button
            className={`lj-admin-tab${usersTab ? ' active' : ''}`}
            onClick={() => { setUsersTab(true); setContentTab(false) }}
          >
            <UserCog size={16} /> 用户管理
          </button>
        </div>

        {contentTab ? (
          <>
            {/* ---- 固定板块快速编辑 ---- */}
            <div style={{
              marginBottom: 28,
              padding: 20,
              background: 'rgba(74, 144, 217, 0.05)',
              border: '1px solid rgba(74, 144, 217, 0.18)',
              borderRadius: 14,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--lj-brand-light)',
                    fontWeight: 600,
                  }}>STATIC PAGES</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--lj-ink)' }}>
                    固定板块快速编辑
                  </span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--lj-ink-3)' }}>
                  直接在后台编辑即可，保存后立即生效
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: 12,
              }}>
                {SITE_EDIT_QUICK.map((item) => {
                  const IconComp = item.icon
                  return (
                    <div
                      key={item.slug}
                      style={{
                        background: 'var(--lj-surface)',
                        border: '1px solid var(--lj-border)',
                        borderRadius: 12,
                        padding: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(74, 144, 217, 0.5)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = ''
                        e.currentTarget.style.transform = ''
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, rgba(74,144,217,0.18), rgba(106,173,232,0.08))',
                          color: 'var(--lj-brand-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <IconComp size={17} />
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--lj-ink)', fontSize: 14.5 }}>
                          {item.label}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: 'var(--lj-ink-3)',
                        marginBottom: 2,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      }}>
                        /{item.slug === 'home' ? '' : item.slug}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                        <button
                          className="lj-btn-primary"
                          style={{
                            padding: '7px 12px',
                            fontSize: 12.5,
                            flex: 1,
                            justifyContent: 'center',
                          }}
                          onClick={() => openSiteQuickEditor(item.slug)}
                        >
                          <Edit3 size={13} /> 编辑
                        </button>
                        <Link
                          to={item.path}
                          className="lj-btn-secondary"
                          style={{
                            padding: '7px 10px',
                            fontSize: 12.5,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="在新标签页查看页面"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ---- 内容管理板块选择 ---- */}
            <div className="lj-admin-filters">
              <div className="lj-filter-group">
                <label className="lj-filter-label"><Layers size={14} /> 板块</label>
                <div className="lj-chip-group">
                  {CONTENT_TYPES.map((c) => {
                    const Icon = c.icon
                    return (
                      <button
                        key={c.key}
                        className={`lj-chip${contentType === c.key ? ' active' : ''}`}
                        onClick={() => setContentType(c.key)}
                      >
                        <Icon size={14} /> {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <button className="lj-btn-ghost" onClick={loadContent}>刷新</button>
            </div>

            {/* ---- 内容列表 ---- */}
            {contentLoading ? (
              <div className="lj-empty"><p style={{ color: 'var(--lj-ink-2)' }}>加载中...</p></div>
            ) : contentList.length === 0 ? (
              <div className="lj-empty">
                <CheckCircle2 size={32} style={{ color: 'var(--lj-ink-3)' }} />
                <p style={{ color: 'var(--lj-ink-2)' }}>当前板块暂无内容。</p>
              </div>
            ) : (
              <div className="lj-sub-list">
                {contentList.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    type={contentType}
                    onDelete={() => handleDeleteContent(item.id)}
                    acting={acting === item.id}
                  />
                ))}
              </div>
            )}
          </>
        ) : !usersTab ? (
          <>
            {/* ---- 过滤栏 ---- */}
            <div className="lj-admin-filters">
              <div className="lj-filter-group">
                <label className="lj-filter-label"><Filter size={14} /> 状态</label>
                <div className="lj-chip-group">
                  {STATUSES.map((s) => {
                    const Icon = s.icon
                    return (
                      <button
                        key={s.key}
                        className={`lj-chip${filterStatus === s.key ? ' active' : ''}`}
                        onClick={() => setFilterStatus(s.key)}
                      >
                        <Icon size={14} /> {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="lj-filter-group">
                <label className="lj-filter-label"><Filter size={14} /> 板块</label>
                <div className="lj-chip-group">
                  {BOARDS.map((b) => {
                    const Icon = b.icon
                    return (
                      <button
                        key={b.key}
                        className={`lj-chip${filterBoard === b.key ? ' active' : ''}`}
                        onClick={() => setFilterBoard(b.key)}
                      >
                        <Icon size={14} /> {b.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="lj-search-wrap">
                <Search size={15} />
                <input
                  placeholder="搜索标题 / 作者 / 提交者 / ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="lj-btn-ghost" onClick={loadAll}>刷新</button>
            </div>

            {/* ---- 投稿列表 ---- */}
            {filteredList.length === 0 ? (
              <div className="lj-empty">
                <CheckCircle2 size={32} style={{ color: 'var(--lj-ink-3)' }} />
                <p style={{ color: 'var(--lj-ink-2)' }}>当前筛选条件下没有内容。</p>
              </div>
            ) : (
              <div className="lj-sub-list">
                {filteredList.map((s) => (
                  <SubmissionCard
                    key={s.id}
                    s={s}
                    onPreview={() => setPreview(s)}
                    onApprove={() => handleReview(s.id, 'approved')}
                    onReject={() => handleReview(s.id, 'rejected')}
                    onDelete={() => handleDelete(s.id)}
                    acting={acting === s.id}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* ---- 用户管理表格 ---- */
          <div className="lj-user-table-wrap">
            <table className="lj-user-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>头像</th>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>邮箱</th>
                  <th>昵称</th>
                  <th>角色</th>
                  <th>注册时间</th>
                  <th style={{ width: 120 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div
                        className="lj-user-avatar-sm"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: u.avatar
                            ? `center/cover no-repeat url(${u.avatar})`
                            : 'linear-gradient(135deg,#4A90D9,#6AADE8)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          fontWeight: 600,
                          border: '1px solid rgba(255,255,255,0.1)',
                          flexShrink: 0,
                        }}
                      >
                        {!u.avatar && (u.nickname || u.username || '?').slice(0, 1).toUpperCase()}
                      </div>
                    </td>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.nickname || '-'}</td>
                    <td>
                      {u.role === 'admin' ? (
                        <span className="lj-role-chip admin">🛡 管理员</span>
                      ) : (
                        <span className="lj-role-chip member">👤 成员</span>
                      )}
                    </td>
                    <td>{fmtTime(u.created_at)}</td>
                    <td>
                      <div className="lj-dropdown">
                        <button className="lj-btn-ghost" disabled={acting === `user-${u.id}`}>
                          {acting === `user-${u.id}` ? '处理中…' : (
                            <><ChevronDown size={14} /> 操作</>
                          )}
                        </button>
                        <div className="lj-dropdown-menu">
                          <button onClick={() => handleRole(u.id, u.role === 'admin' ? 'member' : 'admin')}>
                            <UserCog size={14} />
                            {u.role === 'admin' ? '降为成员' : '设为管理员'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            style={{ color: '#f87171' }}
                          >
                            <XCircle size={14} />
                            删除账号
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {preview && <SubmissionPreview s={preview} onClose={() => setPreview(null)} />}

      {/* 固定板块内容编辑弹窗 */}
      <SiteContentEditor
        slug={siteEditorSlug || 'home'}
        open={siteEditorOpen && !!siteEditorSlug}
        initialContent={siteEditorContent}
        onClose={() => {
          setSiteEditorOpen(false)
          setSiteEditorSlug(null)
        }}
        onSaved={(saved) => {
          // 保存后更新本地缓存，避免重复打开时读取旧缓存
          if (siteEditorSlug) {
            setSiteEditorContent(mergeSiteContent(SITE_DEFAULTS[siteEditorSlug] || {}, saved))
          }
        }}
      />
    </section>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="lj-stat-card">
      <div className="lj-stat-icon" style={{ background: `${color}22`, color }}>
        <Icon size={22} />
      </div>
      <div className="lj-stat-body">
        <span className="lj-stat-label">{label}</span>
        <span className="lj-stat-value">{value}</span>
        {sub && <span className="lj-stat-sub">{sub}</span>}
      </div>
    </div>
  )
}

function SubmissionCard({ s, onPreview, onApprove, onReject, onDelete, acting }) {
  const p = s.payload || {}
  const boardInfo =
    s.board === 'photo'
      ? { label: '作品', icon: Image, cover: p.image || p.grad }
      : s.board === 'resource'
        ? { label: '资源', icon: FileText, cover: p.coverGrad }
        : { label: '日记', icon: BookOpen, cover: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }
  const Icon = boardInfo.icon
  const isActing = acting

  return (
    <article className={`lj-sub-card lj-status-${s.status}`}>
      <div
        className="lj-sub-cover"
        style={
          s.board === 'photo' && p.image
            ? { backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: boardInfo.cover || GRAD_FALLBACK }
        }
      >
        <Icon size={22} style={{ opacity: 0.85 }} />
      </div>

      <div className="lj-sub-body">
        <div className="lj-sub-headline">
          <h3>{p.title || p.name || '（无标题）'}</h3>
          <span className={`lj-status-chip lj-status-${s.status}`}>
            {s.status === 'pending' && '⏳ 待审核'}
            {s.status === 'approved' && '✅ 已通过'}
            {s.status === 'rejected' && '❌ 未通过'}
          </span>
        </div>
        <div className="lj-sub-meta">
          <span className="lj-my-board">{boardInfo.label}</span>
          {p.cat && <span>分类: {p.cat}</span>}
          <span>提交者: {s.submitter_uname || s.submitter_name || `UID ${s.submitter_id}`}</span>
          <span>{fmtTime(s.created_at)}</span>
        </div>
        <p className="lj-sub-excerpt">
          {s.board === 'photo'
            ? (p.desc || '暂无作品描述').slice(0, 100)
            : s.board === 'resource'
              ? (p.summary || p.full_desc || p.fullDesc || '').slice(0, 120)
              : (p.content || '').slice(0, 120)}
        </p>
        <div className="lj-sub-actions">
          <button className="lj-btn-ghost" onClick={onPreview}>
            <Eye size={14} /> 预览
          </button>
          {s.status !== 'approved' && (
            <button
              className="lj-btn-primary"
              onClick={onApprove}
              disabled={isActing}
              style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
            >
              <CheckCircle2 size={14} />
              {isActing ? '处理中…' : '通过'}
            </button>
          )}
          {s.status !== 'rejected' && (
            <button
              className="lj-btn-secondary"
              onClick={onReject}
              disabled={isActing}
              style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
            >
              <XCircle size={14} />
              拒绝
            </button>
          )}
          <button
            className="lj-btn-danger"
            onClick={onDelete}
            disabled={isActing}
            style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
          >
            <Trash2 size={14} />
            删除
          </button>
        </div>
      </div>
    </article>
  )
}

function ContentCard({ item, type, onDelete, acting }) {
  const isSubmission = item.from_submission || item.id >= 10000
  let cover = GRAD_FALLBACK
  let title = ''
  let excerpt = ''
  let meta = ''

  if (type === 'photo') {
    cover = item.image ? undefined : (item.grad || GRAD_FALLBACK)
    title = item.title || '（无标题）'
    excerpt = (item.desc || '暂无描述').slice(0, 100)
    meta = `${item.cat || '摄影'} · ${item.author || '佚名'} · ${item.likes || 0} 赞`
  } else if (type === 'resource') {
    cover = item.coverGrad || 'linear-gradient(135deg,#667EEA,#764BA2)'
    title = item.title || '（无标题）'
    excerpt = (item.summary || item.fullDesc || '').slice(0, 120)
    meta = `${item.cat || '资源'} · ${item.author || '佚名'} · ${item.views || 0} 浏览`
  } else {
    cover = 'linear-gradient(135deg,#6366F1,#8B5CF6)'
    title = item.title || '（无标题）'
    excerpt = (item.content || '').slice(0, 120)
    meta = `${item.date || ''} · ${item.author || '佚名'} · ${item.mood || ''}`
  }

  return (
    <article className="lj-sub-card lj-status-approved">
      <div
        className="lj-sub-cover"
        style={
          type === 'photo' && item.image
            ? { backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: cover }
        }
      >
        {type === 'photo' && <Image size={22} style={{ opacity: 0.85 }} />}
        {type === 'resource' && <FileText size={22} style={{ opacity: 0.85 }} />}
        {type === 'diary' && <BookOpen size={22} style={{ opacity: 0.85 }} />}
      </div>
      <div className="lj-sub-body">
        <div className="lj-sub-headline">
          <h3>{title}</h3>
          <span className="lj-status-chip lj-status-approved">
            {isSubmission ? '📝 投稿' : '📦 原始'}
          </span>
        </div>
        <div className="lj-sub-meta">
          <span>{meta}</span>
          <span>ID: {item.id}</span>
        </div>
        <p className="lj-sub-excerpt">{excerpt}</p>
        <div className="lj-sub-actions">
          <button
            className="lj-btn-danger"
            onClick={onDelete}
            disabled={acting}
            style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
          >
            <Trash2 size={14} />
            {acting ? '删除中…' : '删除内容'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default Admin
