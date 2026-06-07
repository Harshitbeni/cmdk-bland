import React from 'react'
import { createRoot } from 'react-dom/client'
import { DialRoot } from 'dialkit'
import 'dialkit/styles.css'
import '@fontsource/geist-sans/latin-400.css'
import '@fontsource/geist-sans/latin-500.css'
import '@fontsource/geist-mono/latin-300.css'
import '@fontsource/geist-mono/latin-400.css'
import '@fontsource/geist-mono/latin-500.css'
import '@fontsource/inter/latin-400.css'
import App from './App.jsx'
import DeveloperTools from './DeveloperTools.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <DeveloperTools />
    <DialRoot position="top-right" defaultOpen={false} theme="light" />
  </React.StrictMode>,
)
