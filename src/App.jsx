import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Resources from './pages/Resources'
import History from './pages/History'
import Diary from './pages/Diary'
import Departments from './pages/Departments'
import Members from './pages/Members'
import Studio from './pages/Studio'
import About from './pages/About'
import Auth from './pages/Auth'
import Submit from './pages/Submit'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/history" element={<History />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/members" element={<Members />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
