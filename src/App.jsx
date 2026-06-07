import React, { useEffect, useMemo, useState } from 'react'
import { IconSettingsGear1 } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconSettingsGear1'
import { AnimatePresence, motion } from 'motion/react'
import { useDialKit } from 'dialkit'
import CommandPalette from './CommandPalette'

const BACKGROUNDS = [
  {
    id: 'schematic',
    label: '1',
    description: 'Signal trace surface',
    kind: 'image',
    src: '/backgrounds/signal-trace.png',
  },
  {
    id: 'operations',
    label: '2',
    description: 'Concrete poetry surface',
    kind: 'image',
    src: '/backgrounds/concrete-poetry.png',
  },
  {
    id: 'blank',
    label: '3',
    description: 'White canvas',
    kind: 'blank',
  },
]

const TIMING = {
  backgroundSwap: {
    type: 'spring',
    visualDuration: 0.28,
    bounce: 0,
  },
}

function App() {
  const [backgroundId, setBackgroundId] = useState('schematic')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [shadowEnabled, setShadowEnabled] = useState(false)
  const [iconSize, setIconSize] = useState('14px')
  const [iconStroke, setIconStroke] = useState('1.5px')
  const [monoMode, setMonoMode] = useState('headings')
  const [overlayBlurEnabled, setOverlayBlurEnabled] = useState(false)
  const [paletteWidth, setPaletteWidth] = useState('560px')
  const [textScale, setTextScale] = useState('minus')
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const paletteLayout = useDialKit('Command Palette Layout', {
    height: [336, 280, 520, 1],
  })

  const activeBackground = useMemo(
    () => BACKGROUNDS.find((background) => background.id === backgroundId),
    [backgroundId],
  )

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsCommandPaletteOpen((isOpen) => !isOpen)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main
      className="prototype-shell"
      data-background={activeBackground.id}
      style={{
        '--command-icon-size': iconSize,
        '--command-icon-stroke': iconStroke,
        '--command-heading-font': monoMode !== 'off'
          ? '"Geist Mono", ui-monospace, "SFMono-Regular", Menlo, monospace'
          : '"Geist Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        '--command-support-font': monoMode === 'on'
          ? '"Geist Mono", ui-monospace, "SFMono-Regular", Menlo, monospace'
          : '"Geist Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        '--command-support-weight': monoMode === 'on' ? 375 : 400,
        '--command-overlay-blur': overlayBlurEnabled ? 'blur(2px)' : 'none',
        '--command-palette-shadow': shadowEnabled
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          : 'none',
        '--command-palette-width': paletteWidth,
        '--command-palette-height': `${paletteLayout.height}px`,
        '--command-text-10': textScale === 'plus' ? '11px' : '10px',
        '--command-text-12': textScale === 'plus' ? '13px' : '12px',
        '--command-text-14': '14px',
      }}
    >
      {motionEnabled ? (
        <AnimatePresence mode="wait">
          <BackgroundLayer key={activeBackground.id} background={activeBackground} motionEnabled />
        </AnimatePresence>
      ) : (
        <BackgroundLayer key={activeBackground.id} background={activeBackground} motionEnabled={false} />
      )}

      <ControlDock side="left" title="Main">
        <button
          className="icon-button"
          type="button"
          aria-expanded={isSettingsOpen}
          aria-label="Prototype settings"
          title="Settings"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <IconSettingsGear1 aria-hidden="true" className="control-icon" />
        </button>
      </ControlDock>

      <CommandPalette
        open={isCommandPaletteOpen}
        motionEnabled={motionEnabled}
        onOpenChange={setIsCommandPaletteOpen}
      />

      {isSettingsOpen && (
        <SettingsPane
          iconSize={iconSize}
          iconStroke={iconStroke}
          monoMode={monoMode}
          motionEnabled={motionEnabled}
          overlayBlurEnabled={overlayBlurEnabled}
          paletteWidth={paletteWidth}
          shadowEnabled={shadowEnabled}
          textScale={textScale}
          onIconSizeChange={setIconSize}
          onIconStrokeChange={setIconStroke}
          onMonoModeChange={setMonoMode}
          onMotionChange={setMotionEnabled}
          onOverlayBlurChange={setOverlayBlurEnabled}
          onPaletteWidthChange={setPaletteWidth}
          onShadowChange={setShadowEnabled}
          onTextScaleChange={setTextScale}
        />
      )}

      <ControlDock side="right" title="Background">
        <div className="segmented-control" aria-label="Background options">
          {BACKGROUNDS.map((background) => (
            <button
              key={background.id}
              className="segment-button"
              data-active={background.id === backgroundId}
              type="button"
              onClick={() => setBackgroundId(background.id)}
              title={background.description}
            >
              {background.label}
            </button>
          ))}
        </div>
      </ControlDock>
    </main>
  )
}

function BackgroundLayer({ background, motionEnabled }) {
  const content =
    background.kind === 'image' ? (
      <img src={background.src} alt="" className="background-image" />
    ) : (
      <div className="blank-canvas" />
    )

  if (!motionEnabled) {
    return (
      <section
        className="canvas-layer"
        aria-label={`Prototype background: ${background.description}`}
      >
        {content}
      </section>
    )
  }

  return (
    <motion.section
      className="canvas-layer"
      aria-label={`Prototype background: ${background.description}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={TIMING.backgroundSwap}
    >
      {content}
    </motion.section>
  )
}

function SettingsPane({
  iconSize,
  iconStroke,
  monoMode,
  motionEnabled,
  overlayBlurEnabled,
  paletteWidth,
  shadowEnabled,
  textScale,
  onIconSizeChange,
  onIconStrokeChange,
  onMonoModeChange,
  onMotionChange,
  onOverlayBlurChange,
  onPaletteWidthChange,
  onShadowChange,
  onTextScaleChange,
}) {
  return (
    <aside className="settings-pane" aria-label="Prototype settings panel">
      <div className="settings-row">
        <span className="settings-label">Motion</span>
        <div className="settings-toggle" role="group" aria-label="Motion mode">
          <button
            type="button"
            className="settings-option"
            data-active={!motionEnabled}
            onClick={() => onMotionChange(false)}
          >
            No motion
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={motionEnabled}
            onClick={() => onMotionChange(true)}
          >
            Motion
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Shadow</span>
        <div className="settings-toggle" role="group" aria-label="Palette shadow">
          <button
            type="button"
            className="settings-option"
            data-active={!shadowEnabled}
            onClick={() => onShadowChange(false)}
          >
            Off
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={shadowEnabled}
            onClick={() => onShadowChange(true)}
          >
            On
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Icon stroke</span>
        <div className="settings-toggle" role="group" aria-label="Icon stroke">
          <button
            type="button"
            className="settings-option"
            data-active={iconStroke === '1px'}
            onClick={() => onIconStrokeChange('1px')}
          >
            1px
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={iconStroke === '1.5px'}
            onClick={() => onIconStrokeChange('1.5px')}
          >
            1.5px
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Icon size</span>
        <div className="settings-toggle settings-toggle-three" role="group" aria-label="Icon size">
          <button
            type="button"
            className="settings-option"
            data-active={iconSize === '16px'}
            onClick={() => onIconSizeChange('16px')}
          >
            16px
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={iconSize === '14px'}
            onClick={() => onIconSizeChange('14px')}
          >
            14px
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={iconSize === '12px'}
            onClick={() => onIconSizeChange('12px')}
          >
            12px
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Text</span>
        <div className="settings-toggle" role="group" aria-label="Text size">
          <button
            type="button"
            className="settings-option"
            data-active={textScale === 'minus'}
            onClick={() => onTextScaleChange('minus')}
          >
            -
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={textScale === 'plus'}
            onClick={() => onTextScaleChange('plus')}
          >
            +
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Mono</span>
        <div className="settings-toggle settings-toggle-three" role="group" aria-label="Mono typography">
          <button
            type="button"
            className="settings-option"
            data-active={monoMode === 'off'}
            onClick={() => onMonoModeChange('off')}
          >
            Off
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={monoMode === 'headings'}
            onClick={() => onMonoModeChange('headings')}
          >
            Headings
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={monoMode === 'on'}
            onClick={() => onMonoModeChange('on')}
          >
            On
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Blur</span>
        <div className="settings-toggle" role="group" aria-label="Overlay blur">
          <button
            type="button"
            className="settings-option"
            data-active={!overlayBlurEnabled}
            onClick={() => onOverlayBlurChange(false)}
          >
            Off
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={overlayBlurEnabled}
            onClick={() => onOverlayBlurChange(true)}
          >
            On
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Width</span>
        <div className="settings-toggle settings-toggle-three" role="group" aria-label="Palette width">
          <button
            type="button"
            className="settings-option"
            data-active={paletteWidth === '400px'}
            onClick={() => onPaletteWidthChange('400px')}
          >
            400
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={paletteWidth === '560px'}
            onClick={() => onPaletteWidthChange('560px')}
          >
            560
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={paletteWidth === '800px'}
            onClick={() => onPaletteWidthChange('800px')}
          >
            800
          </button>
        </div>
      </div>
    </aside>
  )
}

function ControlDock({ children, side, title }) {
  return (
    <aside className="control-dock" data-side={side} aria-label={`${title} controls`}>
      <div className="dock-controls">{children}</div>
    </aside>
  )
}

export default App
