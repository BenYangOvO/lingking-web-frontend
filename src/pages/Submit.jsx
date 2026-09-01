import { useState, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardBody, Tabs, Tab, Input, Select, SelectItem, Textarea, Button, Chip, Spinner } from '@heroui/react'
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
          author: pAuthor.trim() || undefined,
          desc: pDesc.trim() || undefined,
          image: pImage.trim() || undefined,
          grad: pGrad,
        }
      } else if (board === 'resource') {
        if (!rTitle.trim()) throw new Error('请填写资源/干货标题')
        payload = {
          title: rTitle.trim(),
          cat: rCat,
          author: rAuthor.trim() || undefined,
          summary: rSummary.trim() || undefined,
          fullContent: rFull.trim() || undefined,
        }
      } else if (board === 'diary') {
        if (!dTitle.trim()) throw new Error('请填写日记标题')
        if (!dContent.trim()) throw new Error('请填写日记正文')
        payload = {
          date: dDate || new Date().toISOString().slice(0, 10),
          title: dTitle.trim(),
          author: dAuthor.trim() || undefined,
          mood: dMood,
          content: dContent.trim(),
        }
      }
      const res = await submitWork(board, payload)
      setSuccess(res.message || '投稿提交成功，管理员审核通过后将正式公开发布！')
      if (board === 'photo') {
        setPTitle(''); setPDesc(''); setPImage(''); setPPreview(''); setPAuthor('')
      } else if (board === 'resource') {
        setRTitle(''); setRSummary(''); setRFull(''); setRAuthor('')
      } else if (board === 'diary') {
        setDTitle(''); setDContent(''); setDAuthor('')
      }
    } catch (err) {
      setError(err.message || '提交失败')
    } finally {
      setLoading(false)
    }
  }

  async function loadMine() {
    if (!isLoggedIn()) return
    try {
      const data = await listMySubmissions()
      setMine(data.submissions || [])
      setShowMine(true)
    } catch (err) {
      setError(err.message || '加载我的投稿失败')
    }
  }

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setPPreview(localUrl)
    setPUploading(true)
    setError('')
    setPUploadProgress(0)
    try {
      const res = await uploadImage(file, { onProgress: (pct) => setPUploadProgress(pct) })
      setPImage(res.url)
    } catch (err) {
      setError(err.message || '上传失败')
      setPPreview('')
    } finally {
      setPUploading(false)
    }
  }

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">投稿作品</span>
          </div>
          <h1 className="lj-page-title">在线投稿</h1>
          <p className="lj-page-subtitle">欢迎投稿你的摄影作品、技术干货或外拍日记（提交后需管理员审核）</p>
        </div>
      </section>

      <div className="lj-submit-container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch">
          {BOARDS.map((b) => {
            const Icon = b.icon
            const active = board === b.key
            return (
              <Card
                key={b.key}
                isPressable
                onClick={() => { setBoard(b.key); setError(''); setSuccess('') }}
                className={`flex-1 border transition-all ${
                  active
                    ? 'border-[var(--lj-brand)] bg-[var(--lj-surface-2)]/60 shadow-lg shadow-indigo-500/10'
                    : 'border-[var(--lj-surface-2)] bg-[var(--lj-surface)] hover:border-default-400'
                }`}
              >
                <CardBody className="p-4 flex flex-row items-center gap-3">
                  <div className={`p-3 rounded-xl ${active ? 'bg-[var(--lj-brand)] text-white' : 'bg-default-100 text-default-500'}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{b.label}</h3>
                    <p className="text-xs text-default-400 mt-0.5 line-clamp-1">{b.desc}</p>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>

        <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-2 md:p-6">
          <CardBody className="gap-6">
            <div className="flex items-center justify-between border-b border-[var(--lj-surface-2)] pb-4">
              <div>
                <h2 className="text-xl font-bold">{currentBoard.label} 投稿</h2>
                <p className="text-xs text-default-400 mt-1">{currentBoard.hint}</p>
              </div>
              {isLoggedIn() && (
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClick={loadMine}
                  startContent={<Eye size={14} />}
                >
                  查看我的历史投稿
                </Button>
              )}
            </div>

            {error && (
              <div className="p-3 text-sm rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {board === 'photo' && (
                <>
                  <Input
                    label="作品名称"
                    placeholder="如：夜幕星河 / 街头掠影"
                    value={pTitle}
                    onValueChange={setPTitle}
                    variant="bordered"
                    isRequired
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="作品分类"
                      selectedKeys={[pCat]}
                      onChange={(e) => setPCat(e.target.value)}
                      variant="bordered"
                    >
                      {PHOTO_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="作者署名（可选）"
                      placeholder="留空则自动使用你当前登录的用户名"
                      value={pAuthor}
                      onValueChange={setPAuthor}
                      variant="bordered"
                    />
                  </div>

                  <Textarea
                    label="作品简介 / 拍摄故事（可选）"
                    placeholder="分享拍摄时的参数、镜头选择或创作心得..."
                    value={pDesc}
                    onValueChange={setPDesc}
                    variant="bordered"
                    minRows={3}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-default-600">作品图片 / 封面预览</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Button
                        size="md"
                        color="primary"
                        variant="flat"
                        onClick={() => pFileRef.current?.click()}
                        isLoading={pUploading}
                        startContent={!pUploading && <ImagePlus size={18} />}
                      >
                        {pUploading ? `上传中 ${pUploadProgress}%` : '选择本地作品图片上传'}
                      </Button>
                      <input ref={pFileRef} type="file" accept="image/*" hidden onChange={handlePickFile} />
                      <span className="text-xs text-default-400">支持 jpg / png / webp 格式（≤10MB）</span>
                    </div>

                    {(pPreview || pImage) && (
                      <div className="relative mt-2 w-48 h-32 rounded-xl overflow-hidden border border-[var(--lj-surface-2)] group">
                        <img src={pPreview || pImage} alt="预览" className="w-full h-full object-cover" />
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="solid"
                          className="absolute top-1 right-1 opacity-80 hover:opacity-100 min-w-6 h-6"
                          onClick={() => { setPImage(''); setPPreview('') }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {board === 'resource' && (
                <>
                  <Input
                    label="干货标题"
                    placeholder="如：《人像构图五大要素》"
                    value={rTitle}
                    onValueChange={setRTitle}
                    variant="bordered"
                    isRequired
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="资源分类"
                      selectedKeys={[rCat]}
                      onChange={(e) => setRCat(e.target.value)}
                      variant="bordered"
                    >
                      {RESOURCE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="作者署名（可选）"
                      placeholder="留空则自动使用用户名"
                      value={rAuthor}
                      onValueChange={setRAuthor}
                      variant="bordered"
                    />
                  </div>

                  <Textarea
                    label="内容简介"
                    placeholder="简要概括文章核心点，将展示在列表卡片中"
                    value={rSummary}
                    onValueChange={setRSummary}
                    variant="bordered"
                    minRows={2}
                  />

                  <Textarea
                    label="完整正文（支持 Markdown 格式）"
                    placeholder="在此编写干货全文，可使用 # 标题、*斜体*、**粗体**、代码块等..."
                    value={rFull}
                    onValueChange={setRFull}
                    variant="bordered"
                    minRows={8}
                  />
                </>
              )}

              {board === 'diary' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="date"
                      label="记录日期"
                      value={dDate}
                      onValueChange={setDDate}
                      variant="bordered"
                    />

                    <Select
                      label="拍摄心情"
                      selectedKeys={[dMood]}
                      onChange={(e) => setDMood(e.target.value)}
                      variant="bordered"
                    >
                      {MOOD_OPTIONS.map((m) => (
                        <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="作者署名（可选）"
                      placeholder="留空则自动使用用户名"
                      value={dAuthor}
                      onValueChange={setDAuthor}
                      variant="bordered"
                    />
                  </div>

                  <Input
                    label="日记标题"
                    placeholder="如：2026 校园早樱采风记"
                    value={dTitle}
                    onValueChange={setDTitle}
                    variant="bordered"
                    isRequired
                  />

                  <Textarea
                    label="日记正文"
                    placeholder="记录今日拍摄经历、遇到的趣事或灵感闪现..."
                    value={dContent}
                    onValueChange={setDContent}
                    variant="bordered"
                    minRows={6}
                    isRequired
                  />
                </>
              )}

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                startContent={!loading && <Send size={18} />}
                className="w-full font-bold shadow-md shadow-indigo-500/20 mt-4"
              >
                {loading ? '提交中…' : '提交投稿'}
              </Button>
            </form>
          </CardBody>
        </Card>

        {showMine && mine && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
              <span>我的历史投稿记录</span>
              <Button size="sm" variant="light" onClick={() => setShowMine(false)}>隐藏</Button>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {mine.length === 0 ? (
                <p className="text-default-400 text-sm py-4 text-center">暂无历史投稿记录</p>
              ) : (
                mine.map((sub) => (
                  <Card key={sub.id} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-2">
                    <CardBody className="flex flex-row items-center justify-between p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Chip size="sm" variant="flat" color="primary">{sub.board}</Chip>
                          <span className="font-bold text-sm">{sub.title}</span>
                        </div>
                        <p className="text-xs text-default-400 mt-1">提交于 {new Date(sub.created_at).toLocaleString()}</p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'}
                      >
                        {sub.status === 'approved' ? '已通过' : sub.status === 'rejected' ? '已驳回' : '待审核'}
                      </Chip>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Submit
