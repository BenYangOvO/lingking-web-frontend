import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from '@heroui/react'
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
  { key: 'all', label: '全部状态', icon: Filter },
  { key: 'pending', label: '待审核', icon: Clock },
  { key: 'approved', label: '已通过', icon: CheckCircle2 },
  { key: 'rejected', label: '未通过', icon: XCircle },
]

const BOARDS = [
  { key: 'all', label: '全部板块', icon: Filter },
  { key: 'photo', label: '作品展示', icon: Image },
  { key: 'resource', label: '资源库', icon: FileText },
  { key: 'diary', label: '日记本', icon: BookOpen },
]

const SITE_EDIT_QUICK = [
  { slug: 'home', label: '首页核心卡片/轮播', icon: Home, desc: '轮播图、社团金句、活动预告' },
  { slug: 'history', label: '凌镜历史与大事记', icon: History, desc: '社团建立历史、发展历程与时间线' },
  { slug: 'departments', label: '部门与组织架构', icon: Building2, desc: '暗房部、外拍部、数码部等说明' },
  { slug: 'about', label: '关于凌镜 (社团简介)', icon: Info, desc: '社团理念、联系方式、入社须知' },
  { slug: 'studio', label: '工作室与暗房设备', icon: Video, desc: '暗房设备、影棚器材、借用说明' },
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
    <Modal
      isOpen={!!s}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: 'bg-[var(--lj-surface)] text-[var(--lj-ink)] border border-[var(--lj-surface-2)] shadow-2xl rounded-2xl',
        header: 'border-b border-[var(--lj-surface-2)] py-3 px-5',
        footer: 'border-t border-[var(--lj-surface-2)] py-3 px-5',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color={s.status === 'approved' ? 'success' : s.status === 'rejected' ? 'danger' : 'warning'}
                >
                  {s.status === 'pending' && '⏳ 待审核'}
                  {s.status === 'approved' && '✅ 已通过'}
                  {s.status === 'rejected' && '❌ 未通过'}
                </Chip>
                <Chip size="sm" variant="flat" color="primary" startContent={<BoardIcon size={12} />}>
                  {board === 'photo' ? '作品' : board === 'resource' ? '资源' : '日记'}
                </Chip>
              </div>
            </ModalHeader>

            <ModalBody className="p-5 flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs text-default-400 bg-[var(--lj-surface-2)]/40 p-3 rounded-xl">
                <div><b>ID:</b> {s.id}</div>
                <div><b>提交者:</b> {s.submitter_uname || s.submitter_name || `UID ${s.submitter_id}`}</div>
                <div><b>提交时间:</b> {fmtTime(s.created_at)}</div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-xs text-default-400 font-semibold">标题</div>
                <div className="text-lg font-bold">{p.title || '(无标题)'}</div>
              </div>

              {p.cat && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-default-400">分类:</span>
                  <Chip size="sm" variant="flat">{p.cat}</Chip>
                </div>
              )}

              {p.author && (
                <div className="text-xs text-default-400">
                  署名: <span className="text-[var(--lj-ink)] font-medium">{p.author}</span>
                </div>
              )}

              {p.desc && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-400 font-semibold">描述 / 简介</span>
                  <div className="p-3 rounded-xl bg-[var(--lj-surface-2)]/30 text-xs whitespace-pre-wrap">{p.desc}</div>
                </div>
              )}

              {p.image && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-400 font-semibold">作品图片</span>
                  <img src={p.image} alt="预览" className="max-h-64 object-contain rounded-xl border border-[var(--lj-surface-2)] bg-black/20" />
                </div>
              )}

              {p.summary && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-400 font-semibold">干货摘要</span>
                  <div className="p-3 rounded-xl bg-[var(--lj-surface-2)]/30 text-xs">{p.summary}</div>
                </div>
              )}

              {p.fullContent && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-400 font-semibold">正文预览</span>
                  <div className="p-3 rounded-xl bg-[var(--lj-surface-2)]/30 text-xs max-h-48 overflow-y-auto whitespace-pre-wrap font-mono">{p.fullContent}</div>
                </div>
              )}

              {p.content && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-400 font-semibold">日记正文</span>
                  <div className="p-3 rounded-xl bg-[var(--lj-surface-2)]/30 text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">{p.content}</div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button size="sm" variant="flat" onClick={onClose}>关闭</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('submissions') // submissions | content | users | site
  const [stats, setStats] = useState(null)
  const [subs, setSubs] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [filterBoard, setFilterBoard] = useState('all')
  const [filterStatus, setFilterStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [acting, setActing] = useState(null)

  // 内容管理状态
  const [contentType, setContentType] = useState('photo')
  const [contentList, setContentList] = useState([])
  const [contentLoading, setContentLoading] = useState(false)

  // 固定板块编辑弹窗状态
  const [siteEditorSlug, setSiteEditorSlug] = useState(null)
  const [siteEditorContent, setSiteEditorContent] = useState(null)
  const [siteEditorOpen, setSiteEditorOpen] = useState(false)
  const [siteInfo, setSiteInfo] = useState({})
  const [siteInfoLoading, setSiteInfoLoading] = useState(false)

  async function openSiteQuickEditor(slug) {
    let content = SITE_DEFAULTS[slug]
    try {
      const res = await getSiteContent(slug)
      content = mergeSiteContent(SITE_DEFAULTS[slug] || {}, res?.content)
    } catch (_) { /* 降级 */ }
    setSiteEditorSlug(slug)
    setSiteEditorContent(content)
    setSiteEditorOpen(true)
  }

  async function loadSiteInfo() {
    setSiteInfoLoading(true)
    setError('')
    try {
      const slugs = SITE_EDIT_QUICK.map(s => s.slug)
      const results = await Promise.all(slugs.map(s => getSiteContent(s)))
      const info = {}
      slugs.forEach((slug, i) => { info[slug] = results[i] })
      setSiteInfo(info)
    } catch (err) {
      setError(err.message || '加载站点内容失败')
    } finally {
      setSiteInfoLoading(false)
    }
  }

  const isAdminUser = authIsAdmin()

  async function loadAll() {
    setError('')
    try {
      const bParam = filterBoard === 'all' ? '' : filterBoard
      const sParam = filterStatus === 'all' ? '' : filterStatus
      const [s, list, u] = await Promise.all([
        getAdminStats(),
        listAdminSubmissions({ board: bParam, status: sParam }),
        listAdminUsers(),
      ])
      setStats(s)
      setSubs(list.submissions || [])
      setUsers(u.users || [])
    } catch (err) {
      setError(err.message || '加载失败，请确认以管理员身份登录')
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
    if (isAdminUser && activeTab === 'submissions') loadAll()
  }, [filterBoard, filterStatus, isAdminUser, activeTab])

  useEffect(() => {
    if (isAdminUser && activeTab === 'content') loadContent()
  }, [contentType, activeTab, isAdminUser])

  useEffect(() => {
    if (isAdminUser && activeTab === 'site') loadSiteInfo()
  }, [activeTab, isAdminUser])

  const filteredList = useMemo(() => {
    if (!search) return subs
    const q = search.toLowerCase()
    return subs.filter((s) => {
      const p = s.payload || {}
      const hay = [s.id, s.submitter_name, s.submitter_uname, p.title, p.author, p.cat].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [subs, search])

  async function handleReview(id, status, reason = '') {
    setActing(id)
    try {
      await reviewSubmission(id, status, reason)
      loadAll()
    } catch (err) {
      alert(err.message || '操作失败')
    } finally {
      setActing(null)
    }
  }

  async function handleDeleteSub(id) {
    if (!window.confirm(`确定要彻底删除投稿 ID ${id} 吗？`)) return
    setActing(id)
    try {
      await deleteSubmission(id)
      loadAll()
    } catch (err) {
      alert(err.message || '删除失败')
    } finally {
      setActing(null)
    }
  }

  async function handleDeleteContentItem(type, id) {
    if (!window.confirm(`确定要永久彻底删除该条正式内容 (ID ${id}) 吗？`)) return
    setActing(id)
    try {
      await deleteContent(type, id)
      loadContent()
      getAdminStats().then(setStats).catch(() => {})
    } catch (err) {
      alert(err.message || '删除失败')
    } finally {
      setActing(null)
    }
  }

  async function handleRole(uid, role) {
    try {
      await setUserRole(uid, role)
      loadAll()
    } catch (err) {
      alert(err.message || '修改角色失败')
    }
  }

  async function handleDeleteUser(uid, uname) {
    if (!window.confirm(`确认删除用户 "${uname}" (UID: ${uid}) 吗？`)) return
    try {
      await deleteUser(uid)
      loadAll()
    } catch (err) {
      alert(err.message || '删除用户失败')
    }
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center bg-[var(--lj-surface)] border border-[var(--lj-surface-2)]">
          <CardBody className="items-center gap-4">
            <ShieldAlert size={48} className="text-amber-500" />
            <h2 className="text-xl font-bold">需要管理员权限</h2>
            <p className="text-sm text-default-400">当前账号不是管理员，无法访问管理后台。</p>
            <div className="flex gap-2 mt-2">
              <Button as={Link} to="/" variant="flat">返回首页</Button>
              <Button as={Link} to="/auth" color="primary" onClick={() => logout()}>切换账号</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">管理后台</span>
          </div>
          <h1 className="lj-page-title flex items-center gap-2">
            <Crown className="text-amber-400" /> 凌镜后台管理
          </h1>
          <p className="lj-page-subtitle">审查投稿、管理发布内容、用户权限配置与可视化修改</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 顶部统计面板卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-1">
              <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-xs text-default-400">待审核投稿</div>
                  <div className="text-2xl font-extrabold">{stats.pendingSubmissions || 0}</div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-1">
              <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Image size={24} />
                </div>
                <div>
                  <div className="text-xs text-default-400">展示作品总数</div>
                  <div className="text-2xl font-extrabold">{stats.photos || 0}</div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-1">
              <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="text-xs text-default-400">干货资源文章</div>
                  <div className="text-2xl font-extrabold">{stats.resources || 0}</div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-1">
              <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-xs text-default-400">注册成员</div>
                  <div className="text-2xl font-extrabold">{stats.users || 0}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-2 text-sm">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 核心 Tab 切换 */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(String(key))}
          color="primary"
          variant="solid"
          size="lg"
          className="mb-6"
        >
          <Tab
            key="submissions"
            title={
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>投稿审核</span>
                {stats?.pendingSubmissions > 0 && (
                  <Chip size="sm" color="danger" variant="solid" className="min-w-5 h-5 px-1 font-bold text-xs">
                    {stats.pendingSubmissions}
                  </Chip>
                )}
              </div>
            }
          />

          <Tab
            key="site"
            title={
              <div className="flex items-center gap-2">
                <Edit3 size={16} />
                <span>站点可视化修改</span>
              </div>
            }
          />

          <Tab
            key="content"
            title={
              <div className="flex items-center gap-2">
                <Layers size={16} />
                <span>正式发布内容</span>
              </div>
            }
          />

          <Tab
            key="users"
            title={
              <div className="flex items-center gap-2">
                <UserCog size={16} />
                <span>用户权限管理</span>
              </div>
            }
          />
        </Tabs>

        {/* Tab 1: 投稿审核 */}
        {activeTab === 'submissions' && (
          <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-2 md:p-4">
            <CardBody className="gap-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Select
                    size="sm"
                    label="板块"
                    selectedKeys={[filterBoard]}
                    onChange={(e) => setFilterBoard(e.target.value)}
                    className="w-36"
                  >
                    {BOARDS.map((b) => (
                      <SelectItem key={b.key} value={b.key}>{b.label}</SelectItem>
                    ))}
                  </Select>

                  <Select
                    size="sm"
                    label="审核状态"
                    selectedKeys={[filterStatus]}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-36"
                  >
                    {STATUSES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                <Input
                  size="sm"
                  placeholder="搜索标题 / 提交者..."
                  value={search}
                  onValueChange={setSearch}
                  startContent={<Search size={16} className="text-default-400" />}
                  className="w-full md:w-64"
                />
              </div>

              {/* 投稿列表 Table */}
              <Table aria-label="投稿管理列表" shadow="none" classNames={{ wrapper: 'p-0 bg-transparent' }}>
                <TableHeader>
                  <TableColumn>ID / 板块</TableColumn>
                  <TableColumn>标题 / 内容摘要</TableColumn>
                  <TableColumn>提交者</TableColumn>
                  <TableColumn>状态</TableColumn>
                  <TableColumn>时间</TableColumn>
                  <TableColumn align="center">操作</TableColumn>
                </TableHeader>
                <TableBody emptyContent="暂无符合条件的投稿记录">
                  {filteredList.map((s) => {
                    const p = s.payload || {}
                    const isBusy = acting === s.id
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-xs">#{s.id}</span>
                            <Chip size="sm" variant="flat" color="primary">
                              {s.board === 'photo' ? '作品' : s.board === 'resource' ? '资源' : '日记'}
                            </Chip>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="font-bold text-sm">{p.title || '(无标题)'}</div>
                          {p.cat && <span className="text-xs text-default-400 font-mono">[{p.cat}]</span>}
                        </TableCell>

                        <TableCell>
                          <span className="text-xs">{s.submitter_uname || s.submitter_name || `UID ${s.submitter_id}`}</span>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={s.status === 'approved' ? 'success' : s.status === 'rejected' ? 'danger' : 'warning'}
                          >
                            {s.status === 'approved' ? '已通过' : s.status === 'rejected' ? '未通过' : '待审核'}
                          </Chip>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs text-default-400">{fmtTime(s.created_at)}</span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" isIconOnly variant="flat" onClick={() => setPreview(s)} title="预览">
                              <Eye size={15} />
                            </Button>

                            {s.status !== 'approved' && (
                              <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                isLoading={isBusy}
                                onClick={() => handleReview(s.id, 'approved')}
                              >
                                通过
                              </Button>
                            )}

                            {s.status !== 'rejected' && (
                              <Button
                                size="sm"
                                color="warning"
                                variant="flat"
                                isLoading={isBusy}
                                onClick={() => handleReview(s.id, 'rejected')}
                              >
                                驳回
                              </Button>
                            )}

                            <Button
                              size="sm"
                              isIconOnly
                              color="danger"
                              variant="flat"
                              isLoading={isBusy}
                              onClick={() => handleDeleteSub(s.id)}
                              title="删除"
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Tab 2: 站点可视化修改 */}
        {activeTab === 'site' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SITE_EDIT_QUICK.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.slug} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-2">
                  <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-[var(--lj-brand)]/10 text-[var(--lj-brand)]">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{item.label}</h3>
                        <p className="text-xs text-default-400 mt-1">{item.desc}</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => openSiteQuickEditor(item.slug)}
                      startContent={<Edit3 size={14} />}
                    >
                      修改
                    </Button>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}

        {/* Tab 3: 正式内容管理 */}
        {activeTab === 'content' && (
          <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-2 md:p-4">
            <CardBody className="gap-4">
              <div className="flex items-center gap-3">
                <Select
                  size="sm"
                  label="正式板块"
                  selectedKeys={[contentType]}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-48"
                >
                  <SelectItem key="photo" value="photo">作品展示</SelectItem>
                  <SelectItem key="resource" value="resource">资源库干货</SelectItem>
                  <SelectItem key="diary" value="diary">社团日记</SelectItem>
                </Select>
              </div>

              {contentLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner color="primary" label="加载内容列表中..." />
                </div>
              ) : (
                <Table aria-label="正式发布内容列表" shadow="none" classNames={{ wrapper: 'p-0 bg-transparent' }}>
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>标题</TableColumn>
                    <TableColumn>作者</TableColumn>
                    <TableColumn align="center">操作</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="该板块暂无发布内容">
                    {contentList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><span className="font-bold text-xs">#{item.id}</span></TableCell>
                        <TableCell><span className="font-bold text-sm">{item.title}</span></TableCell>
                        <TableCell><span className="text-xs">{item.author || item.submitter_name || '-'}</span></TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              isLoading={acting === item.id}
                              onClick={() => handleDeleteContentItem(contentType, item.id)}
                              startContent={<Trash2 size={14} />}
                            >
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        )}

        {/* Tab 4: 用户权限管理 */}
        {activeTab === 'users' && (
          <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-2 md:p-4">
            <CardBody className="gap-4">
              <Table aria-label="用户管理列表" shadow="none" classNames={{ wrapper: 'p-0 bg-transparent' }}>
                <TableHeader>
                  <TableColumn>UID</TableColumn>
                  <TableColumn>用户名</TableColumn>
                  <TableColumn>邮箱</TableColumn>
                  <TableColumn>角色</TableColumn>
                  <TableColumn align="center">操作</TableColumn>
                </TableHeader>
                <TableBody emptyContent="暂无注册用户">
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell><span className="font-bold text-xs">#{u.id}</span></TableCell>
                      <TableCell><span className="font-bold text-sm">{u.username}</span></TableCell>
                      <TableCell><span className="text-xs text-default-400">{u.email}</span></TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={u.role === 'admin' ? 'warning' : 'default'}
                          startContent={u.role === 'admin' ? <Crown size={12} className="text-amber-400" /> : null}
                        >
                          {u.role === 'admin' ? '管理员' : '普通成员'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {u.role === 'admin' ? (
                            <Button size="sm" variant="flat" onClick={() => handleRole(u.id, 'member')}>
                              降级为成员
                            </Button>
                          ) : (
                            <Button size="sm" color="warning" variant="flat" onClick={() => handleRole(u.id, 'admin')}>
                              设为管理员
                            </Button>
                          )}
                          <Button size="sm" color="danger" variant="flat" onClick={() => handleDeleteUser(u.id, u.username)}>
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>

      <SubmissionPreview s={preview} onClose={() => setPreview(null)} />

      {siteEditorOpen && (
        <SiteContentEditor
          slug={siteEditorSlug}
          open={siteEditorOpen}
          initialContent={siteEditorContent}
          onClose={() => setSiteEditorOpen(false)}
          onSaved={() => loadSiteInfo()}
        />
      )}
    </>
  )
}

export default Admin
