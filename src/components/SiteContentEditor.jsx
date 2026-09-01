import { useEffect, useState, useMemo, useRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch } from '@heroui/react'
import { X, Save, RotateCcw, Loader2, AlertTriangle, Plus, Minus, Edit3, Image as ImageIcon, FileText, Upload, Trash2 } from 'lucide-react'
import { updateSiteContent, uploadImage, uploadFile } from '../api'
import { SITE_DEFAULTS } from '../siteContentDefaults'
import MarkdownEditor from './MarkdownEditor'
import '../styles/components/site-content-editor.css'

/**
 * 通用站点内容编辑弹窗 (HeroUI 升级版)
 */
export default function SiteContentEditor({
  slug,
  open,
  initialContent,
  onClose,
  onSaved,
}) {
  const defaults = useMemo(() => (SITE_DEFAULTS[slug] ?? {}), [slug])
  const [form, setForm] = useState(() => deepClone(defaults))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const dirtyRef = useRef(false)

  useEffect(() => {
    if (!open) return
    const base = isPlainObject(initialContent) && Object.keys(initialContent).length > 0
      ? mergeDefault(defaults, initialContent)
      : deepClone(defaults)
    setForm(base)
    dirtyRef.current = false
    setError('')
  }, [open, initialContent, defaults])

  const handleReset = () => {
    if (!window.confirm('确定要恢复该板块为默认内容吗？所有自定义修改将丢失。')) return
    setForm(deepClone(defaults))
    dirtyRef.current = true
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await updateSiteContent(slug, form)
      dirtyRef.current = false
      onSaved?.(res?.data?.content ?? form)
      onClose?.()
    } catch (err) {
      setError(err.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleCloseAttempt = () => {
    if (dirtyRef.current && !window.confirm('有未保存的修改，确定关闭吗？')) return
    onClose?.()
  }

  if (!open) return null

  return (
    <Modal
      isOpen={open}
      onClose={handleCloseAttempt}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: 'bg-[var(--lj-surface)] text-[var(--lj-ink)] border border-[var(--lj-surface-2)] shadow-2xl rounded-2xl max-h-[88vh]',
        header: 'border-b border-[var(--lj-surface-2)] py-3 px-5',
        footer: 'border-t border-[var(--lj-surface-2)] py-3 px-5',
        backdrop: 'bg-black/60 backdrop-blur-md',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wider text-[var(--lj-brand)] font-semibold">{slug}</span>
              <div className="flex items-center gap-2 text-lg font-bold">
                <Edit3 size={18} className="text-[var(--lj-brand)]" />
                <span>编辑：{SLUG_LABEL[slug] || slug}</span>
              </div>
            </ModalHeader>

            <ModalBody className="p-5">
              {error && (
                <div className="p-3 mb-4 text-sm rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <FieldRenderer
                path={[]}
                value={form}
                onChange={(next) => { setForm(next); dirtyRef.current = true }}
              />
            </ModalBody>

            <ModalFooter className="flex items-center justify-between">
              <Button
                variant="flat"
                color="warning"
                size="sm"
                isDisabled={saving}
                onClick={handleReset}
                startContent={<RotateCcw size={14} />}
              >
                恢复默认
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="flat"
                  size="sm"
                  isDisabled={saving}
                  onClick={handleCloseAttempt}
                >
                  取消
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  isLoading={saving}
                  onClick={handleSave}
                  startContent={!saving && <Save size={14} />}
                  className="px-5 font-medium"
                >
                  {saving ? '保存中…' : '保存修改'}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

const SLUG_LABEL = {
  home: '首页',
  history: '凌镜历史',
  departments: '部门介绍',
  about: '关于凌镜',
  studio: '工作室',
}

// ================= 递归字段渲染器 =================

function FieldRenderer({ path, value, onChange }) {
  if (Array.isArray(value)) return <ArrayField path={path} value={value} onChange={onChange} />
  if (isPlainObject(value)) return <ObjectField path={path} value={value} onChange={onChange} />
  return <PrimitiveField path={path} value={value} onChange={onChange} />
}

function ObjectField({ path, value, onChange }) {
  const keys = Object.keys(value)
  const updateKey = (k, nextVal) => {
    onChange({ ...value, [k]: nextVal })
  }
  const pathLabel = path.length === 0 ? '页面内容' : path.join(' › ')
  return (
    <div className="lj-sce-object">
      <div className="lj-sce-obj-title">{pathLabel}</div>
      <div className="lj-sce-obj-grid">
        {keys.map((k) => (
          <div className="lj-sce-obj-item" key={k}>
            <div className="lj-sce-key">{camelToLabel(k)}</div>
            <FieldRenderer
              path={[...path, k]}
              value={value[k]}
              onChange={(nv) => updateKey(k, nv)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function ArrayField({ path, value, onChange }) {
  const addItem = () => {
    const proto = value[0]
    const newItem = makePrototypeFor(proto)
    onChange([...value, newItem])
  }
  const removeAt = (i) => {
    if (!window.confirm(`删除第 ${i + 1} 项？`)) return
    const next = value.slice()
    next.splice(i, 1)
    onChange(next)
  }
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = value.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const updateAt = (i, nv) => {
    const next = value.slice()
    next[i] = nv
    onChange(next)
  }
  const arrayLabel = path.length === 0 ? '数组' : path.join(' › ')
  return (
    <div className="lj-sce-array">
      <div className="lj-sce-array-head flex items-center justify-between">
        <div className="lj-sce-array-title">📋 {arrayLabel} <span className="lj-sce-array-count">（共 {value.length} 项）</span></div>
        <Button size="sm" variant="flat" color="primary" onClick={addItem} startContent={<Plus size={14} />}>
          新增一项
        </Button>
      </div>
      <div className="lj-sce-array-list">
        {value.length === 0 && (
          <div className="lj-sce-empty-array">当前为空，请点击"新增一项"开始添加。</div>
        )}
        {value.map((item, i) => (
          <div className="lj-sce-array-item" key={i}>
            <div className="lj-sce-array-item-head">
              <span className="lj-sce-array-item-index">第 {i + 1} 项</span>
              <div className="lj-sce-array-item-actions flex items-center gap-1">
                <Button size="sm" isIconOnly variant="flat" onClick={() => move(i, -1)} isDisabled={i === 0} title="上移">↑</Button>
                <Button size="sm" isIconOnly variant="flat" onClick={() => move(i, 1)} isDisabled={i === value.length - 1} title="下移">↓</Button>
                <Button size="sm" isIconOnly variant="flat" color="danger" onClick={() => removeAt(i)} title="删除">
                  <Minus size={12} />
                </Button>
              </div>
            </div>
            <FieldRenderer path={[...path, i]} value={item} onChange={(nv) => updateAt(i, nv)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PrimitiveField({ path, value, onChange }) {
  const lastKey = path.length ? String(path[path.length - 1]) : ''

  if (typeof value === 'string' && lastKey === 'image') {
    return <ImageUploadField value={value} onChange={onChange} />
  }
  if (typeof value === 'string' && /_file$/.test(lastKey)) {
    return <FileUploadField value={value} onChange={onChange} />
  }

  const isLong = typeof value === 'string' && (value.includes('\n') || value.length > 80)
  const placeholder = typeof value === 'number' ? '请输入数字' : `请输入 ${path[path.length - 1] || '内容'}`

  if (typeof value === 'boolean') {
    return (
      <div className="py-1">
        <Switch
          size="sm"
          color="primary"
          isSelected={!!value}
          onValueChange={(val) => onChange(val)}
        >
          <span className="text-xs">{value ? '是' : '否'}</span>
        </Switch>
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <Input
        size="sm"
        type="number"
        variant="bordered"
        value={String(value)}
        placeholder={placeholder}
        onValueChange={(raw) => {
          if (raw === '' || raw === '-') return onChange(raw)
          const v = Number(raw)
          onChange(Number.isFinite(v) ? v : 0)
        }}
      />
    )
  }

  if (isLong) {
    return (
      <MarkdownEditor
        value={value == null ? '' : String(value)}
        placeholder={placeholder}
        onChange={(v) => onChange(v)}
      />
    )
  }

  return (
    <Input
      size="sm"
      variant="bordered"
      value={value == null ? '' : String(value)}
      placeholder={placeholder}
      onValueChange={(val) => onChange(val)}
    />
  )
}

// ================= 上传控件（图片 / 文档） =================

function ImageUploadField({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [pct, setPct] = useState(0)
  const [err, setErr] = useState('')
  const inputRef = useRef(null)

  const pick = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true); setErr(''); setPct(0)
    try {
      const res = await uploadImage(f, { onProgress: setPct })
      onChange(res.url)
    } catch (er) {
      setErr(er.message || '图片上传失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lj-sce-upload">
      {value ? (
        <div className="lj-sce-upload-preview flex items-center gap-3">
          <div className="lj-sce-upload-thumb">
            <img src={value} alt="配图预览" onError={(e) => { e.target.style.opacity = 0.2 }} />
          </div>
          <div className="lj-sce-upload-actions flex items-center gap-2">
            <Button size="sm" variant="flat" onClick={() => inputRef.current?.click()} isDisabled={busy} startContent={<ImageIcon size={13} />}>
              更换图片
            </Button>
            <Button size="sm" variant="flat" color="danger" onClick={() => onChange('')} isDisabled={busy} startContent={<Trash2 size={13} />}>
              移除
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="flat" color="primary" onClick={() => inputRef.current?.click()} isDisabled={busy} startContent={<ImageIcon size={15} />}>
          {busy ? `上传中 ${pct}%` : '上传配图（jpg/png/webp/gif，≤10MB）'}
        </Button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pick} />
      {err && <div className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertTriangle size={14} /> {err}</div>}
    </div>
  )
}

function FileUploadField({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [pct, setPct] = useState(0)
  const [err, setErr] = useState('')
  const inputRef = useRef(null)

  const pick = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true); setErr(''); setPct(0)
    try {
      const res = await uploadFile(f, { onProgress: setPct })
      onChange(res.url)
    } catch (er) {
      setErr(er.message || '文档上传失败')
    } finally {
      setBusy(false)
    }
  }

  const fileName = (url) => {
    try { return decodeURIComponent(String(url).split('/').pop()) } catch { return String(url) }
  }

  return (
    <div className="lj-sce-upload">
      {value ? (
        <div className="lj-sce-upload-preview flex items-center gap-3">
          <div className="lj-sce-file-chip flex items-center gap-1">
            <FileText size={15} />
            <a href={value} target="_blank" rel="noreferrer" title="点击查看已上传文档">{fileName(value)}</a>
          </div>
          <div className="lj-sce-upload-actions flex items-center gap-2">
            <Button size="sm" variant="flat" onClick={() => inputRef.current?.click()} isDisabled={busy} startContent={<Upload size={13} />}>
              更换文档
            </Button>
            <Button size="sm" variant="flat" color="danger" onClick={() => onChange('')} isDisabled={busy} startContent={<Trash2 size={13} />}>
              移除
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="flat" color="primary" onClick={() => inputRef.current?.click()} isDisabled={busy} startContent={<FileText size={15} />}>
          {busy ? `上传中 ${pct}%` : '上传文档（doc/docx/pdf，≤20MB）'}
        </Button>
      )}
      <input ref={inputRef} type="file" accept=".doc,.docx,.pdf" hidden onChange={pick} />
      {err && <div className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertTriangle size={14} /> {err}</div>}
    </div>
  )
}

function deepClone(v) {
  if (v === null || typeof v !== 'object') return v
  if (Array.isArray(v)) return v.map(deepClone)
  const out = {}
  for (const k of Object.keys(v)) out[k] = deepClone(v[k])
  return out
}

function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function mergeDefault(def, userVal) {
  const base = deepClone(def)
  if (!isPlainObject(userVal)) return base
  for (const k of Object.keys(userVal)) {
    if (Array.isArray(userVal[k])) {
      const defArr = Array.isArray(base[k]) ? base[k] : []
      base[k] = userVal[k].map((x, i) => {
        const dv = defArr[i] || defArr[defArr.length - 1]
        if (isPlainObject(x) && isPlainObject(dv)) return mergeDefault(dv, x)
        return deepClone(x)
      })
    } else if (isPlainObject(userVal[k]) && isPlainObject(base[k])) {
      base[k] = mergeDefault(base[k], userVal[k])
    } else {
      base[k] = deepClone(userVal[k])
    }
  }
  return base
}

function makePrototypeFor(proto) {
  if (proto === undefined || proto === null) return ''
  if (typeof proto === 'string') return ''
  if (typeof proto === 'number') return 0
  if (typeof proto === 'boolean') return false
  if (Array.isArray(proto)) {
    return proto.map((p) => makePrototypeFor(p))
  }
  if (isPlainObject(proto)) {
    const out = {}
    for (const k of Object.keys(proto)) out[k] = makePrototypeFor(proto[k])
    return out
  }
  return ''
}

const LABEL_OVERRIDES = {
  image: '配图（上传图片）',
  full_history_file: '完整历史文档（上传 Word/PDF）',
  full_history_title: '完整历史入口标题',
  year: '年份',
  title: '标题',
  desc: '描述（支持 Markdown）',
  name: '名称',
  value: '数值',
  label: '标签',
  num: '序号',
}

function camelToLabel(str) {
  if (typeof str !== 'string' || !str) return str
  if (LABEL_OVERRIDES[str]) return LABEL_OVERRIDES[str]
  const s = str.replace(/[_-]+/g, ' ')
  const out = s.replace(/([a-z])([A-Z])/g, '$1 $2')
  return out.charAt(0).toUpperCase() + out.slice(1)
}
