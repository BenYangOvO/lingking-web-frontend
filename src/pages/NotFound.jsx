import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="lj-hero">
      <h1 className="lj-hero-title" style={{ fontSize: '5rem' }}>
        404
      </h1>
      <p className="lj-hero-subtitle">页面不存在，或已被移动</p>
      <div className="lj-hero-ctas">
        <Link to="/" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
          返回首页
        </Link>
      </div>
    </section>
  )
}

export default NotFound