import { Link } from 'react-router-dom'
import { Calendar, Heart, MessageCircle, Sparkles } from 'lucide-react'
import '../styles/pages/diary.css'

const FEATURED = {
  title: '凌晨四点的日出',
  date: '2026-07-15',
  mood: '震撼',
  moodClass: 'mood-wonder',
  tag: '摄影心得',
  excerpt:
    '为了拍下这张日出，我在凌晨三点爬上了山顶。当第一缕阳光穿透云层的那一刻，所有的困倦和寒冷都烟消云散了。镜头里的世界仿佛被重新涂上了一层金色的油彩，那种宁静而壮丽的感觉，是任何后期都无法复刻的。摄影教会我，有些美好只属于愿意等待的人。',
  author: '王浩宇',
  avatar: '王',
  avatarBg: 'linear-gradient(135deg,#4A90D9,#6AADE8)',
  readTime: '8 分钟阅读',
  likes: 214,
  comments: 36,
}

const ENTRIES = [
  { title: '雨后的校园', date: '2026-07-10', mood: '宁静', moodClass: 'mood-peaceful', excerpt: '夏天的雨来得快去得也快。雨停之后，校园里的每一片叶子都挂着晶莹的水珠，倒映着天光。我喜欢在这样的时刻拿着相机出门，因为雨后的世界总有一种被洗刷过的新鲜感。', author: '李思琪', avatar: '李', avatarBg: 'linear-gradient(135deg,#34D399,#6EE7B7)', readTime: '5 分钟', likes: 96, comments: 18, bg: 'linear-gradient(145deg,#0F766E,#14B8A6,#5EEAD4)' },
  { title: '胶片的味道', date: '2026-07-05', mood: '怀旧', moodClass: 'mood-nostalgic', excerpt: '第一次冲洗自己的胶卷，看到影像在显影液中慢慢浮现，那种等待和惊喜交织的感觉，是数码摄影里体验不到的。胶片的颗粒感不是缺陷，而是一种温暖的质感。', author: '陈雨薇', avatar: '陈', avatarBg: 'linear-gradient(135deg,#F59E0B,#FCD34D)', readTime: '6 分钟', likes: 132, comments: 24, bg: 'linear-gradient(150deg,#78350F,#B45309,#F59E0B,#FCD34D)' },
  { title: '光影实验笔记', date: '2026-06-28', mood: '好奇', moodClass: 'mood-curious', excerpt: '这周尝试了一些新的布光技巧，用黑色卡纸和锡纸自制了反光板和束光筒。效果出奇地好——有时候限制反而能激发更多创意，器材不够想象力来凑。', author: '周思远', avatar: '周', avatarBg: 'linear-gradient(135deg,#78716C,#A8A29E)', readTime: '4 分钟', likes: 87, comments: 15, bg: 'linear-gradient(140deg,#1C1917,#44403C,#78716C,#A8A29E)' },
  { title: '第一次拍星空', date: '2026-06-20', mood: '敬畏', moodClass: 'mood-inspired', excerpt: '带上新买的赤道仪，驱车两小时远离城市光污染。当眼睛适应黑暗后，银河慢慢显现——那种浩瀚让人说不出来话。30秒长曝光下的星空，比肉眼看到的还要震撼十倍。', author: '林子涵', avatar: '林', avatarBg: 'linear-gradient(135deg,#7C3AED,#A78BFA)', readTime: '7 分钟', likes: 178, comments: 42, bg: 'linear-gradient(155deg,#1E1B4B,#312E81,#4F46E5,#818CF8)' },
  { title: '街角咖啡馆', date: '2026-06-14', mood: '热情', moodClass: 'mood-excited', excerpt: '街拍最有趣的地方在于，你永远不知道下一秒会遇见什么。这家咖啡馆的光线简直完美，透过落地窗洒进来的自然光让每一个角落都像一幅画。', author: '赵一凡', avatar: '赵', avatarBg: 'linear-gradient(135deg,#EA580C,#FB923C)', readTime: '3 分钟', likes: 65, comments: 9, bg: 'linear-gradient(148deg,#7C2D12,#C2410C,#FB923C,#FDBA74)' },
]

function DiaryStats({ likes, comments }) {
  return (
    <div className="lj-diary-stats">
      <span className="lj-diary-stat">
        <Heart style={{ width: 14, height: 14 }} /> {likes}
      </span>
      <span className="lj-diary-stat">
        <MessageCircle style={{ width: 14, height: 14 }} /> {comments}
      </span>
    </div>
  )
}

function Diary() {
  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">凌镜日记本</span>
          </div>
          <h1 className="lj-page-title">凌镜日记本</h1>
          <p className="lj-page-subtitle">记录每一帧灵感与感悟</p>
        </div>
      </section>

      {/* Featured */}
      <div className="lj-diary-featured">
        <div className="lj-diary-featured-card">
          <div className="lj-diary-featured-cover" />
          <div className="lj-diary-featured-body">
            <div className="lj-diary-featured-meta">
              <span className="lj-diary-date-badge">
                <Calendar style={{ width: 11, height: 11 }} />
                {FEATURED.date}
              </span>
              <span className={`lj-diary-mood-tag ${FEATURED.moodClass}`}>
                {FEATURED.mood}
              </span>
              <span className="lj-tag">{FEATURED.tag}</span>
            </div>
            <h2 className="lj-diary-featured-title">{FEATURED.title}</h2>
            <p className="lj-diary-featured-excerpt">{FEATURED.excerpt}</p>
            <div className="lj-diary-featured-footer">
              <div className="lj-diary-author">
                <div className="lj-diary-avatar" style={{ background: FEATURED.avatarBg }}>
                  {FEATURED.avatar}
                </div>
                <div className="lj-diary-author-info">
                  <span className="lj-diary-author-name">{FEATURED.author}</span>
                  <span className="lj-diary-read-time">{FEATURED.readTime}</span>
                </div>
              </div>
              <DiaryStats likes={FEATURED.likes} comments={FEATURED.comments} />
            </div>
          </div>
        </div>
      </div>

      <div className="lj-diary-grid">
        {ENTRIES.map((e) => (
          <div className="lj-diary-card" key={e.title}>
            <div className="lj-diary-card-cover" style={{ background: e.bg }} />
            <div className="lj-diary-card-body">
              <div className="lj-diary-card-meta">
                <span className="lj-diary-date-badge">
                  <Calendar style={{ width: 11, height: 11 }} />
                  {e.date}
                </span>
                <span className={`lj-diary-mood-tag ${e.moodClass}`}>
                  {e.mood}
                </span>
              </div>
              <h3 className="lj-diary-card-title">{e.title}</h3>
              <p className="lj-diary-card-excerpt">{e.excerpt}</p>
              <div className="lj-diary-card-footer">
                <div className="lj-diary-author">
                  <div className="lj-diary-avatar" style={{ width: 30, height: 30, fontSize: 12, background: e.avatarBg }}>
                    {e.avatar}
                  </div>
                  <div className="lj-diary-author-info">
                    <span className="lj-diary-author-name" style={{ fontSize: 13 }}>{e.author}</span>
                    <span className="lj-diary-read-time">{e.readTime}</span>
                  </div>
                </div>
                <DiaryStats likes={e.likes} comments={e.comments} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Diary