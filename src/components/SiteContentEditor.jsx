import { useEffect, useState, useMemo, useRef } from 'react'
import { X, Save, RotateCcw, Loader2, AlertTriangle, Plus, Minus, Edit3 } from 'lucide-react'
import { updateSiteContent } from '../api'
import { SITE_DEFAULTS } from '../siteContentDefaults'
import '../styles/components/site-content-editor.css'

/**
 * 通用站点内容编辑弹窗
 *  props:
 *    slug: 'home' | 'history' | 'departments' | 'about' | 'studio'
 *    open: bool
 *    initialContent: object|null (通常是页面 GET /api/site/:slug 拿到的 content)
 *    onClose: () => void
 *    onSaved?: (savedContent) => void   // 保存成功后父页面刷新数据
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

  // 每次打开时，把 initialContent（若有）作为初始值；否则用 defaults
  useEffect(() => {
    if (!open) return
    const base = isPlainObject(initialContent) && Object.keys(initialContent).length > 0
      ? mergeDefault(defaults, initialContent)   // 补全新字段，避免旧版本缺 key
      : deepClone(defaults)
    setForm(base)
    dirtyRef.current = false
    setError('')
  }, [open, initialContent, defaults])

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (dirtyRef.current && !window.confirm('有未保存的修改，确定关闭吗？')) return
        onClose?.()
      }
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

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

  if (!open) return null

  return (
    <div className="lj-sce-mask" onClick={() => {
      if (dirtyRef.current && !window.confirm('有未保存的修改，确定关闭吗？')) return
      onClose?.()
    }}>
      <div className="lj-sce-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="lj-sce-head">
          <div>
            <div className="lj-sce-sub">{slug}</div>
            <h2 className="lj-sce-title">
              <Edit3 size={18} />
              编辑：{SLUG_LABEL[slug] || slug}
            </h2>
          </div>
          <button type="button" className="lj-sce-close" onClick={() => {
            if (dirtyRef.current && !window.confirm('有未保存的修改，确定关闭吗？')) return
            onClose?.()
          }} aria-label="关闭">
            <X size={18} />
          </button>
        </header>

        {error && (
          <div className="lj-sce-err">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <div className="lj-sce-body">
          <FieldRenderer
            path={[]}
            value={form}
            onChange={(next) => { setForm(next); dirtyRef.current = true }}
          />
        </div>

        <footer className="lj-sce-foot">
          <button type="button" className="lj-btn-ghost" onClick={handleReset} disabled={saving}>
            <RotateCcw size={14} /> 恢复默认
          </button>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="lj-btn-secondary"
            disabled={saving}
            onClick={() => {
              if (dirtyRef.current && !window.confirm('有未保存的修改，确定取消吗？')) return
              onClose?.()
            }}
          >
            取消
          </button>
          <button
            type="button"
            className="lj-btn-primary"
            disabled={saving}
            onClick={handleSave}
            style={{ minWidth: 110 }}
          >
            {saving ? (
              <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> 保存中…</>
            ) : (
              <><Save size={14} /> 保存修改</>
            )}
          </button>
        </footer>
      </div>
    </div>
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
      <div className="lj-sce-array-head">
        <div className="lj-sce-array-title">📋 {arrayLabel} <span className="lj-sce-array-count">（共 {value.length} 项）</span></div>
        <button type="button" className="lj-btn-ghost" onClick={addItem} style={{ fontSize: 13 }}>
          <Plus size={14} /> 新增一项
        </button>
      </div>
      <div className="lj-sce-array-list">
        {value.length === 0 && (
          <div className="lj-sce-empty-array">当前为空，请点击"新增一项"开始添加。</div>
        )}
        {value.map((item, i) => (
          <div className="lj-sce-array-item" key={i}>
            <div className="lj-sce-array-item-head">
              <span className="lj-sce-array-item-index">第 {i + 1} 项</span>
              <div className="lj-sce-array-item-actions">
                <button type="button" className="lj-sce-iconbtn" onClick={() => move(i, -1)} disabled={i === 0} title="上移">↑</button>
                <button type="button" className="lj-sce-iconbtn" onClick={() => move(i, 1)} disabled={i === value.length - 1} title="下移">↓</button>
                <button type="button" className="lj-sce-iconbtn lj-sce-del" onClick={() => removeAt(i)} title="删除">
                  <Minus size={12} />
                </button>
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
  // 多行文本：检测到包含换行或长度>80的字符串
  const isLong = typeof value === 'string' && (value.includes('\n') || value.length > 80)
  const placeholder = typeof value === 'number' ? '请输入数字' : `请输入 ${path[path.length - 1] || '内容'}`

  if (typeof value === 'boolean') {
    return (
      <label className="lj-sce-check">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{value ? '是' : '否'}（点击切换）</span>
      </label>
    )
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        className="lj-sce-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '' || raw === '-') return onChange(raw)
          const v = Number(raw)
          onChange(Number.isFinite(v) ? v : 0)
        }}
      />
    )
  }

  if (isLong) {
    return (
      <textarea
        className="lj-sce-textarea"
        rows={Math.max(3, Math.min(10, value.split('\n').length + 1))}
        value={value == null ? '' : String(value)}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  return (
    <input
      type="text"
      className="lj-sce-input"
      value={value == null ? '' : String(value)}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

// ================= 工具函数 =================

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

// 将用户保存的 content 与 defaults 合并：以 defaults 的所有 key 为基础，用户已有值覆盖；新增字段不再丢失
function mergeDefault(def, userVal) {
  const base = deepClone(def)
  if (!isPlainObject(userVal)) return base
  for (const k of Object.keys(userVal)) {
    if (Array.isArray(userVal[k])) {
      // 数组：完全使用用户版本（因为可能用户增删了项）
      base[k] = deepClone(userVal[k])
    } else if (isPlainObject(userVal[k]) && isPlainObject(base[k])) {
      base[k] = mergeDefault(base[k], userVal[k])
    } else {
      base[k] = deepClone(userVal[k])
    }
  }
  return base
}

// 给数组"新增一项"造一个原型：根据同数组现有第一项推断字段
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

// 将 camelCase / snake_case 字段名转成人类可读标签（仅作参考，不影响数据）
function camelToLabel(str) {
  if (typeof str !== 'string' || !str) return str
  const s = str.replace(/[_-]+/g, ' ')
  const out = s.replace(/([a-z])([A-Z])/g, '$1 $2')
  return out.charAt(0).toUpperCase() + out.slice(1)
}
