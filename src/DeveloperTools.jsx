import React, { Suspense, lazy, useCallback, useState } from 'react'

const AgentationLayer = import.meta.env.DEV
  ? lazy(() => import('agentation').then((module) => ({ default: module.Agentation })))
  : null

const InterfaceKitLayer = import.meta.env.DEV
  ? lazy(() => import('interface-kit/react').then((module) => ({ default: module.InterfaceKit })))
  : null

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to the older browser copy path.
    }
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '0'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

function DeveloperTools() {
  const [copyFallback, setCopyFallback] = useState(null)

  const handleAgentationCopy = useCallback(async (markdown) => {
    window.__lastAgentationCopy = markdown
    localStorage.setItem('agentation:last-copy', markdown)

    const copied = await copyText(markdown)
    setCopyFallback(copied ? null : markdown)
  }, [])

  if (!import.meta.env.DEV) return null

  return (
    <>
      {AgentationLayer && (
        <Suspense fallback={null}>
          <AgentationLayer
            className="agentation-feedback-layer"
            copyToClipboard={false}
            onCopy={handleAgentationCopy}
          />
        </Suspense>
      )}
      {InterfaceKitLayer && (
        <Suspense fallback={null}>
          <InterfaceKitLayer className="interface-kit-layer" />
        </Suspense>
      )}
      {copyFallback && (
        <aside className="copy-fallback-panel" aria-label="Agentation copy fallback">
          <div className="copy-fallback-header">
            <span>Agentation output</span>
            <button type="button" onClick={() => setCopyFallback(null)}>
              Close
            </button>
          </div>
          <textarea readOnly value={copyFallback} onFocus={(event) => event.target.select()} />
        </aside>
      )}
    </>
  )
}

export default DeveloperTools

