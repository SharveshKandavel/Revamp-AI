
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css' // Ensure CSS is loaded

// Ensure the favicon is loaded from public directory
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = '/uploads/ee80d45f-7278-4276-b83d-d8b4bdccbce0.png';
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
