import { useState, useRef } from 'react'
import { Bold, Italic, List, Quote, Code, Eye, Pencil, Link as LinkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../styles/components/markdown-editor.css'

/**
 * 轻量 Markdown 富文本编辑器
 * props: value(string), onChange(string), placeholder(string)
 */
export default function MarkdownEditor({ value, onChange, placeholder }) {
  const [preview, setPreview] = useState(false)
  const taRef = useRef(null)

  // 包裹选中文本（行内格式：粗体、斜体、链接、代码）
  const wrap = (before, after = '', ph = '文本') => {
    const ta = taRef.current
    if (!ta) return
    const s = ta.selectionStart
    const e = ta.selectionEnd
    const sel = value.substring(s, e) || ph
    const nv = value.substring(0, s) + before + sel + after + value.substring(e)
    onChange(nv)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s + before.length, s + before.length + sel.length)
    })
  }

  // 在当前行首插入前缀（块级格式：标题、列表、引用）
  const prefixLine = (prefix) => {
    const ta = taRef.current
    if (!ta) return
    const s = ta.selectionStart
    const ls = value.lastIndexOf('\n', s - 1) + 1
    const nv = value.substring(0, ls) + prefix + value.substring(ls)
    onChange(nv)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s + prefix.length, s + prefix.length)
    })
  }

  const tools = [
    { icon: Bold, label: '粗体 **', fn: () => wrap('**', '**', '粗体') },
    { icon: Italic, label: '斜体 *', fn: () => wrap('*', '*', '斜体') },
    { text: 'H2', label: '二级标题 ##', fn: () => prefixLine('## ') },
    { text: 'H3', label: '三级标题 ###', fn: () => prefixLine('### ') },
    { icon: List, label: '列表 -', fn: () => prefixLine('- ') },
    { icon: LinkIcon, label: '链接 [](url)', fn: () => wrap('[', '](https://)', '链接文字') },
    { icon: Quote, label: '引用 >', fn: () => prefixLine('> ') },
    { icon: Code, label: '行内代码 `', fn: () => wrap('`', '`', 'code') },
  ]

  return (
    <div className="lj-md-editor">
      <div className="lj-md-toolbar">
        <div className="lj-md-tools">
          {tools.map((t, i) => (
            <button key={i} type="button" className="lj-md-tool" onClick={t.fn} title={t.label}>
              {t.icon ? <t.icon size={15} /> : <span className="lj-md-tool-text">{t.text}</span>}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`lj-md-mode${preview ? ' active' : ''}`}
          onClick={() => setPreview(!preview)}
        >
          {preview ? <><Pencil size={14} /> 编辑</> : <><Eye size={14} /> 预览</>}
        </button>
      </div>
      {preview ? (
        <div className="lj-md-preview lj-markdown">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <span style={{ color: 'var(--lj-ink-3)' }}>暂无内容，切换到编辑模式开始输入</span>
          )}
        </div>
      ) : (
        <textarea
          ref={taRef}
          className="lj-md-textarea"
          rows={Math.max(4, Math.min(12, (value || '').split('\n').length + 1))}
          value={value || ''}
          placeholder={placeholder || '输入内容… 支持 Markdown 语法'}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}
