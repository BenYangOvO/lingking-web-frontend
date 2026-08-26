import { Link } from 'react-router-dom'
import '../styles/pages/members.css'

const MEMBERS = [
  { name: '林若曦', nickname: '小曦光', dept: '摄影部', deptClass: 'photo', bio: '永远在找光', happy: true, smile: true, bg: 'linear-gradient(135deg, #C4B5FD, #A78BFA, #DDD6FE)', color: '#5B21B6' },
  { name: '陈逸飞', nickname: '像素猎人', dept: '技术部', deptClass: 'tech', bio: '修图狂魔', happy: false, smile: false, bg: 'linear-gradient(135deg, #BAE6FD, #7DD3FC, #E0F2FE)', color: '#0369A1' },
  { name: '苏雨晴', nickname: '快门少女', dept: '摄影部', deptClass: 'photo', bio: '快门杀手', happy: true, smile: true, bg: 'linear-gradient(135deg, #FBCFE8, #F9A8D4, #FCE7F3)', color: '#9D174D' },
  { name: '赵明轩', nickname: '构图大师', dept: '摄影部', deptClass: 'photo', bio: '构图强迫症', happy: false, smile: false, bg: 'linear-gradient(135deg, #BBF7D0, #86EFAC, #DCFCE7)', color: '#166534' },
  { name: '周艺凡', nickname: '魔法师', dept: '技术部', deptClass: 'tech', bio: '后期魔法师', happy: true, smile: true, bg: 'linear-gradient(135deg, #FEF08A, #FDE047, #FEF9C3)', color: '#854D0E' },
  { name: '吴天佑', nickname: '器材控', dept: '摄影部', deptClass: 'photo', bio: '镜头收藏家', happy: false, smile: false, bg: 'linear-gradient(135deg, #FED7AA, #FDBA74, #FFEDD5)', color: '#9A3412' },
  { name: '许晨光', nickname: '追光者', dept: '宣传部', deptClass: 'media', bio: '日出猎人', happy: true, smile: true, bg: 'linear-gradient(135deg, #99F6E4, #5EEAD4, #CCFBF1)', color: '#115E59' },
  { name: '方梓涵', nickname: '调色侠', dept: '技术部', deptClass: 'tech', bio: '色彩感知者', happy: false, smile: false, bg: 'linear-gradient(135deg, #FECDD3, #FDA4AF, #FFE4E6)', color: '#9F1239' },
]

function ChibiFace({ happy, smile }) {
  return (
    <div className="lj-chibi-face">
      <div className="lj-chibi-eyes">
        <span className={`lj-chibi-eye${happy ? ' happy' : ''}`} />
        <span className={`lj-chibi-eye${happy ? ' happy' : ''}`} />
      </div>
      <div className={`lj-chibi-mouth ${smile ? 'smile' : 'grin'}`} />
      <div className="lj-chibi-blush left" />
      <div className="lj-chibi-blush right" />
    </div>
  )
}

function Members() {
  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">凌镜成员</span>
          </div>
          <h1 className="lj-page-title">凌镜成员</h1>
          <p className="lj-page-subtitle">漫画风格Q版 · 每个人都是主角</p>
        </div>
      </section>

      <div className="lj-glow-line" />

      <section style={{ paddingTop: 64 }}>
        <div className="lj-members-grid">
          {MEMBERS.map((m) => (
            <div className="lj-member-card" key={m.name}>
              <div className="lj-chibi-avatar" style={{ background: m.bg, color: m.color }}>
                <ChibiFace happy={m.happy} smile={m.smile} />
              </div>
              <div className="lj-member-name">{m.name}</div>
              <div className="lj-member-nickname">"{m.nickname}"</div>
              <span className={`lj-member-dept-tag ${m.deptClass}`}>{m.dept}</span>
              <div className="lj-member-bio">{m.bio}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Members