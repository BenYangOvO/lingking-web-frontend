import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { applyTheme } from './prefs'
import './styles/globals.css'


// 首次加载不触发颜色过渡，避免奇怪的闪烁
// JS 挂载完成后解除限制，用户切换主题时播放丝滑转场
document.documentElement.classList.add('no-lj-theme-transition');
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.documentElement.classList.remove('no-lj-theme-transition');
    }, 120);
  });
});


// 渲染前应用保存的主题（深色原版/白色简约版），避免白屏闪烁
applyTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)