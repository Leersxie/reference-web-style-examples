import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { TransitionProvider } from './transition/TransitionProvider'
import { ToastProvider } from './components/ui'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/transition.css'
import './styles/pages.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

createRoot(root).render(
  <StrictMode>
    <TransitionProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </TransitionProvider>
  </StrictMode>,
)
