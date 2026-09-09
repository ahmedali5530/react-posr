import { i18nReady } from '@/lib/i18n.ts'
import { registerServiceWorker } from '@/lib/push-notifications.ts'
import App from './app.tsx'
import ReactDOM from 'react-dom/client'

await i18nReady

// Register PWA service worker (offline caching + push notifications)
registerServiceWorker()

// StrictMode double-mounts effects and can tear down the Surreal WS while React
// state still reports connected (especially with the auth gateway relay).
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
