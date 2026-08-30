import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../styles/components/markdown.css'

/**
 * 前端 Markdown 渲染组件
 * props: children(string), className(string)
 * 用法: <MarkdownText>{someString}</MarkdownText>
 */
export default function MarkdownText({ children, className = '', style }) {
  if (children == null || children === '') return null
  return (
    <div className={`lj-markdown ${className}`} style={style}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {String(children)}
      </ReactMarkdown>
    </div>
  )
}
