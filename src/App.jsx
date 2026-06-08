import React, { useEffect, useMemo, useState } from 'react'
import { IconSettingsGear1 } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconSettingsGear1'
import { IconSettingsSliderVer } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconSettingsSliderVer'
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

const DEFAULT_PROTOTYPE_CONTROLS = {
  dotsMode: 'headings',
  fontSmoothingEnabled: true,
  iconSize: '14px',
  iconStroke: '1px',
  iconsVisibility: 'show',
  infoVisibility: 'hover',
  itemPadding: 'default',
  monoMode: 'headings',
  motionEnabled: false,
  overlayBlurEnabled: false,
  paletteWidth: '560px',
  selectionTone: 'mono',
  shadowEnabled: false,
  textScale: 'minus',
}

const POLISHED_PROTOTYPE_CONTROLS = {
  dotsMode: 'off',
  fontSmoothingEnabled: false,
  iconSize: '16px',
  iconStroke: '1.5px',
  iconsVisibility: 'show',
  infoVisibility: 'hover',
  itemPadding: 'double-plus',
  monoMode: 'off',
  motionEnabled: true,
  overlayBlurEnabled: true,
  paletteWidth: '560px',
  selectionTone: 'mono',
  shadowEnabled: true,
  textScale: 'plus',
}

const COMPACT_PROTOTYPE_CONTROLS = {
  dotsMode: 'all',
  fontSmoothingEnabled: true,
  iconSize: '12px',
  iconStroke: '1px',
  iconsVisibility: 'hide',
  infoVisibility: 'always',
  itemPadding: 'double-minus',
  monoMode: 'on',
  motionEnabled: false,
  overlayBlurEnabled: false,
  paletteWidth: '560px',
  selectionTone: 'blue',
  shadowEnabled: false,
  textScale: 'minus',
}

function getControlsKey(controls) {
  return JSON.stringify(controls)
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall back to the older browser copy path below.
    }
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    return document.execCommand('copy')
  } finally {
    document.body.removeChild(textArea)
  }
}

function App() {
  const [backgroundId, setBackgroundId] = useState('schematic')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [shadowEnabled, setShadowEnabled] = useState(false)
  const [dotsMode, setDotsMode] = useState('headings')
  const [fontSmoothingEnabled, setFontSmoothingEnabled] = useState(true)
  const [iconSize, setIconSize] = useState('14px')
  const [iconStroke, setIconStroke] = useState('1px')
  const [iconsVisibility, setIconsVisibility] = useState('show')
  const [itemPadding, setItemPadding] = useState('default')
  const [monoMode, setMonoMode] = useState('headings')
  const [overlayBlurEnabled, setOverlayBlurEnabled] = useState(false)
  const [paletteWidth, setPaletteWidth] = useState('560px')
  const [selectionTone, setSelectionTone] = useState('mono')
  const [textScale, setTextScale] = useState('minus')
  const [infoVisibility, setInfoVisibility] = useState('hover')
  const [devToolsVisible, setDevToolsVisible] = useState(true)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isApplyingPreset, setIsApplyingPreset] = useState(false)
  const [activePresetId, setActivePresetId] = useState(1)
  const [presetCopyState, setPresetCopyState] = useState('idle')
  const [presets, setPresets] = useState(() => [
    { id: 1, controls: DEFAULT_PROTOTYPE_CONTROLS },
    { id: 2, controls: POLISHED_PROTOTYPE_CONTROLS },
    { id: 3, controls: COMPACT_PROTOTYPE_CONTROLS },
  ])
  const paletteLayout = useDialKit('Command Palette Layout', {
    height: [336, 280, 520, 1],
  })
  const headingDots = useDialKit('Heading Dots', {
    spacing: [4, 2, 8, 1],
    size: [0.8, 0.5, 2, 0.1],
    rows: [3, 1, 4, 1],
  })
  const actionBarDots = useDialKit('Action Bar Dots', {
    spacing: [4, 2, 8, 1],
    size: [0.8, 0.5, 2, 0.1],
    rows: [5, 1, 6, 1],
  })

  const activeBackground = useMemo(
    () => BACKGROUNDS.find((background) => background.id === backgroundId),
    [backgroundId],
  )
  const currentControls = useMemo(
    () => ({
      dotsMode,
      fontSmoothingEnabled,
      iconSize,
      iconStroke,
      iconsVisibility,
      infoVisibility,
      itemPadding,
      monoMode,
      motionEnabled,
      overlayBlurEnabled,
      paletteWidth,
      selectionTone,
      shadowEnabled,
      textScale,
    }),
    [
      dotsMode,
      fontSmoothingEnabled,
      iconSize,
      iconStroke,
      iconsVisibility,
      infoVisibility,
      itemPadding,
      monoMode,
      motionEnabled,
      overlayBlurEnabled,
      paletteWidth,
      selectionTone,
      shadowEnabled,
      textScale,
    ],
  )
  const activePreset = presets.find((preset) => preset.id === activePresetId)
  const hasUnsavedPresetChanges = getControlsKey(currentControls) !== getControlsKey(activePreset?.controls)

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

  useEffect(() => {
    document.body.dataset.devTools = devToolsVisible ? 'visible' : 'hidden'
    return () => {
      delete document.body.dataset.devTools
    }
  }, [devToolsVisible])

  function applyPreset(preset) {
    setIsApplyingPreset(true)
    setDotsMode(getDotsMode(preset.controls))
    setFontSmoothingEnabled(preset.controls.fontSmoothingEnabled ?? true)
    setIconSize(preset.controls.iconSize)
    setIconStroke(preset.controls.iconStroke)
    setIconsVisibility(preset.controls.iconsVisibility)
    setInfoVisibility(preset.controls.infoVisibility)
    setItemPadding(preset.controls.itemPadding ?? 'default')
    setMonoMode(preset.controls.monoMode)
    setMotionEnabled(preset.controls.motionEnabled)
    setOverlayBlurEnabled(preset.controls.overlayBlurEnabled)
    setPaletteWidth(preset.controls.paletteWidth)
    setSelectionTone(preset.controls.selectionTone)
    setShadowEnabled(preset.controls.shadowEnabled)
    setTextScale(preset.controls.textScale)
    setActivePresetId(preset.id)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsApplyingPreset(false))
    })
  }

  function savePreset() {
    const nextPresetId = Math.max(...presets.map((preset) => preset.id)) + 1
    setPresets((currentPresets) => [
      ...currentPresets,
      { id: nextPresetId, controls: currentControls },
    ])
    setActivePresetId(nextPresetId)
  }

  async function copyPresetControls() {
    const presetJson = JSON.stringify(currentControls, null, 2)

    try {
      const copied = await copyText(presetJson)
      setPresetCopyState(copied ? 'copied' : 'failed')
      window.setTimeout(() => setPresetCopyState('idle'), 1000)
    } catch {
      setPresetCopyState('failed')
      window.setTimeout(() => setPresetCopyState('idle'), 1000)
    }
  }

  return (
    <main
      className="prototype-shell"
      data-background={activeBackground.id}
      style={{
        '--command-icon-size': iconSize,
        '--command-icon-stroke': iconStroke,
        '--command-font-smoothing': fontSmoothingEnabled ? 'antialiased' : 'auto',
        '--command-heading-font': monoMode !== 'off'
          ? '"Geist Mono", ui-monospace, "SFMono-Regular", Menlo, monospace'
          : '"Geist Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        '--command-row-height': itemPadding === 'double-minus' ? '24px' : itemPadding === 'plus' ? '32px' : itemPadding === 'double-plus' ? '36px' : '28px',
        '--command-row-padding-x': itemPadding === 'double-minus' ? '6px' : itemPadding === 'plus' ? '10px' : itemPadding === 'double-plus' ? '12px' : '8px',
        '--command-row-padding-y': itemPadding === 'double-minus' ? '2px' : itemPadding === 'plus' ? '6px' : itemPadding === 'double-plus' ? '8px' : '4px',
        '--command-heading-padding-x': itemPadding === 'double-minus' ? '6px' : itemPadding === 'plus' ? '10px' : itemPadding === 'double-plus' ? '12px' : '8px',
        '--command-heading-padding-y': itemPadding === 'double-minus' ? '2px' : itemPadding === 'plus' ? '6px' : itemPadding === 'double-plus' ? '8px' : '4px',
        '--command-dot-color': '#D4D4D4',
        '--command-heading-dot-color': '#E5E5E5',
        '--command-heading-dot-size': `${headingDots.size}px`,
        '--command-heading-dot-spacing': `${headingDots.spacing}px`,
        '--command-heading-dot-area-height': `${headingDots.rows * headingDots.spacing}px`,
        '--command-action-dot-size': `${actionBarDots.size}px`,
        '--command-action-dot-spacing': `${actionBarDots.spacing}px`,
        '--command-action-dot-area-height': `${actionBarDots.rows * actionBarDots.spacing}px`,
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
        '--command-selection-fill': selectionTone === 'green' ? '#F0FDF4' : selectionTone === 'blue' ? '#EDF3FD' : '#f5f5f5',
        '--command-text-10': textScale === 'plus' ? '11px' : '10px',
        '--command-text-12': textScale === 'plus' ? '13px' : '12px',
        '--command-text-14': '14px',
      }}
    >
      {motionEnabled && !isApplyingPreset ? (
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
        <button
          className="icon-button"
          type="button"
          aria-label={devToolsVisible ? 'Hide developer controls' : 'Show developer controls'}
          aria-pressed={devToolsVisible}
          data-active={devToolsVisible}
          title={devToolsVisible ? 'Hide developer controls' : 'Show developer controls'}
          onClick={() => setDevToolsVisible((isVisible) => !isVisible)}
        >
          <IconSettingsSliderVer aria-hidden="true" className="control-icon" />
        </button>
      </ControlDock>

      <CommandPalette
        dotsMode={dotsMode}
        iconsVisibility={iconsVisibility}
        infoVisibility={infoVisibility}
        open={isCommandPaletteOpen}
        motionEnabled={motionEnabled && !isApplyingPreset}
        onOpenChange={setIsCommandPaletteOpen}
      />

      {isSettingsOpen && (
        <SettingsPane
          iconSize={iconSize}
          iconStroke={iconStroke}
          dotsMode={dotsMode}
          fontSmoothingEnabled={fontSmoothingEnabled}
          iconsVisibility={iconsVisibility}
          infoVisibility={infoVisibility}
          itemPadding={itemPadding}
          monoMode={monoMode}
          motionEnabled={motionEnabled}
          overlayBlurEnabled={overlayBlurEnabled}
          paletteWidth={paletteWidth}
          selectionTone={selectionTone}
          shadowEnabled={shadowEnabled}
          textScale={textScale}
          onIconSizeChange={setIconSize}
          onIconStrokeChange={setIconStroke}
          onDotsChange={setDotsMode}
          onFontSmoothingChange={setFontSmoothingEnabled}
          onIconsVisibilityChange={setIconsVisibility}
          onInfoVisibilityChange={setInfoVisibility}
          onItemPaddingChange={setItemPadding}
          onMonoModeChange={setMonoMode}
          onMotionChange={setMotionEnabled}
          onOverlayBlurChange={setOverlayBlurEnabled}
          onPaletteWidthChange={setPaletteWidth}
          onSelectionToneChange={setSelectionTone}
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

      <ControlDock side="center" title="Presets">
        <div className="segmented-control" aria-label="Preset options">
          {presets.map((preset) => (
            <button
              key={preset.id}
              className="segment-button"
              data-active={!hasUnsavedPresetChanges && preset.id === activePresetId}
              type="button"
              onClick={() => applyPreset(preset)}
              title={`Preset ${preset.id}`}
            >
              {preset.id}
            </button>
          ))}
          {hasUnsavedPresetChanges && (
            <>
              <button
                className="segment-button"
                type="button"
                onClick={savePreset}
                title="Save preset"
              >
                +
              </button>
              <button
                className="segment-button preset-copy-button"
                type="button"
                onClick={copyPresetControls}
                title="Copy controls as JSON"
              >
                {presetCopyState === 'copied' ? 'done' : presetCopyState === 'failed' ? 'error' : 'copy'}
              </button>
            </>
          )}
        </div>
      </ControlDock>
    </main>
  )
}

function getDotsMode(controls) {
  if (controls.dotsMode) {
    return controls.dotsMode
  }

  if (controls.dotsEnabled === true) {
    return 'all'
  }

  return 'off'
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
  dotsMode,
  fontSmoothingEnabled,
  iconsVisibility,
  infoVisibility,
  itemPadding,
  monoMode,
  motionEnabled,
  overlayBlurEnabled,
  paletteWidth,
  selectionTone,
  shadowEnabled,
  textScale,
  onIconSizeChange,
  onIconStrokeChange,
  onDotsChange,
  onFontSmoothingChange,
  onIconsVisibilityChange,
  onInfoVisibilityChange,
  onItemPaddingChange,
  onMonoModeChange,
  onMotionChange,
  onOverlayBlurChange,
  onPaletteWidthChange,
  onSelectionToneChange,
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
            Off
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={motionEnabled}
            onClick={() => onMotionChange(true)}
          >
            On
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
        <span className="settings-label">Smooth fonts</span>
        <div className="settings-toggle" role="group" aria-label="Smooth fonts">
          <button
            type="button"
            className="settings-option"
            data-active={fontSmoothingEnabled}
            onClick={() => onFontSmoothingChange(true)}
          >
            On
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={!fontSmoothingEnabled}
            onClick={() => onFontSmoothingChange(false)}
          >
            Off
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Dots</span>
        <div className="settings-toggle settings-toggle-three" role="group" aria-label="Dot texture">
          <button
            type="button"
            className="settings-option"
            data-active={dotsMode === 'off'}
            onClick={() => onDotsChange('off')}
          >
            Off
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={dotsMode === 'headings'}
            onClick={() => onDotsChange('headings')}
          >
            Head
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={dotsMode === 'all'}
            onClick={() => onDotsChange('all')}
          >
            All
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
        <span className="settings-label">Icons</span>
        <div className="settings-toggle" role="group" aria-label="Row icons visibility">
          <button
            type="button"
            className="settings-option"
            data-active={iconsVisibility === 'show'}
            onClick={() => onIconsVisibilityChange('show')}
          >
            Show
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={iconsVisibility === 'hide'}
            onClick={() => onIconsVisibilityChange('hide')}
          >
            Hide
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Selection</span>
        <div className="settings-toggle settings-toggle-three" role="group" aria-label="Selection color">
          <button
            type="button"
            className="settings-option"
            data-active={selectionTone === 'mono'}
            onClick={() => onSelectionToneChange('mono')}
          >
            mono
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={selectionTone === 'green'}
            onClick={() => onSelectionToneChange('green')}
          >
            green
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={selectionTone === 'blue'}
            onClick={() => onSelectionToneChange('blue')}
          >
            blue
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
        <span className="settings-label">Padding</span>
        <div className="settings-toggle settings-toggle-four" role="group" aria-label="List item padding">
          <button
            type="button"
            className="settings-option"
            data-active={itemPadding === 'double-minus'}
            onClick={() => onItemPaddingChange('double-minus')}
          >
            --
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={itemPadding === 'default'}
            onClick={() => onItemPaddingChange('default')}
          >
            -
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={itemPadding === 'plus'}
            onClick={() => onItemPaddingChange('plus')}
          >
            +
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={itemPadding === 'double-plus'}
            onClick={() => onItemPaddingChange('double-plus')}
          >
            ++
          </button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Info</span>
        <div className="settings-toggle" role="group" aria-label="Row info visibility">
          <button
            type="button"
            className="settings-option"
            data-active={infoVisibility === 'always'}
            onClick={() => onInfoVisibilityChange('always')}
          >
            Always
          </button>
          <button
            type="button"
            className="settings-option"
            data-active={infoVisibility === 'hover'}
            onClick={() => onInfoVisibilityChange('hover')}
          >
            Hover
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
