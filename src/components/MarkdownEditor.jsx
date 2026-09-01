import { useState, useRef } from 'react'
import { Button, Tooltip, Tabs, Tab, Textarea } from '@heroui/react'
import { Bold, Italic, List, Quote, Code, Eye, Pencil, Link as LinkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../styles/components/markdown-editor.css'

/**
 * 轻量 Markdown 富文本编辑器 (HeroUI 增强版)
 */
export default function MarkdownEditor({ value, onChange, placeholder }) {
  const [activeTab, setActiveTab] = useState('write')
  const taRef = useRef(null)

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
    <div className="lj-md-editor border border-[var(--lj-surface-2)] rounded-xl overflow-hidden bg-[var(--lj-surface)]">
      <div className="lj-md-toolbar flex items-center justify-between px-3 py-2 border-b border-[var(--lj-surface-2)] bg-[var(--lj-surface-2)]/30">
        <div className="lj-md-tools flex items-center gap-1">
          {tools.map((t, i) => (
            <Tooltip key={i} content={t.label}>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="min-w-7 h-7 bg-transparent hover:bg-[var(--lj-surface-2)] text-[var(--lj-ink-2)]"
                onClick={t.fn}
              >
                {t.icon ? <t.icon size={14} /> : <span className="font-bold text-xs">{t.text}</span>}
              </Button>
            </Tooltip>
          ))}
        </div>

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(String(key))}
          size="sm"
          color="primary"
          variant="flat"
          aria-label="编辑器模式"
        >
          <Tab
            key="write"
            title={
              <div className="flex items-center gap-1 text-xs">
                <Pencil size={13} />
                <span>编辑</span>
              </div>
            }
          />
          <Tab
            key="preview"
            title={
              <div className="flex items-center gap-1 text-xs">
                <Eye size={13} />
                <span>预览</span>
              </div>
            }
          />
        </Tabs>
      </div>

      {activeTab === 'preview' ? (
        <div className="lj-md-preview lj-markdown p-4 min-h-[160px]">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <span className="text-[var(--lj-ink-3)] italic text-sm">暂无内容，切换到编辑模式开始输入</span>
          )}
        </div>
      ) : (
        <textarea
          ref={taRef}
          className="lj-md-textarea w-full p-4 bg-transparent text-[var(--lj-ink)] outline-none border-none resize-y min-h-[160px] text-sm font-sans"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '支持 Markdown 语法，使用顶部工具栏快速插入格式...'}
        />
      )}
    </div>
  )
}
