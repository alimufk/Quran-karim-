import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// التقاط أي خطأ في السكربت وعرضه للمستخدم بدلاً من الشاشة الخضراء
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: red; background: white; font-family: sans-serif; direction: ltr; text-align: left;">
        <h2 style="color: darkred;">⚠️ Runtime Error:</h2>
        <p style="font-weight: bold; font-size: 16px;">${event.message}</p>
        <p style="color: #666; font-size: 12px;">Source: ${event.filename}:${event.lineno}</p>
      </div>
    `;
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
