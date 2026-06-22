
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css' // Ensure CSS is loaded

// Error boundary for the whole app
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red; background: #fff; font-family: sans-serif;">
      <h1>Runtime Error</h1>
      <pre>${message}</pre>
      <pre>${error?.stack}</pre>
    </div>`;
  }
  return false;
};

// Ensure the favicon is loaded from public directory
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = '/uploads/ee80d45f-7278-4276-b83d-d8b4bdccbce0.png';
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
