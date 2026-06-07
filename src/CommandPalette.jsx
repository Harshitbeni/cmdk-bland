import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useDialKit } from 'dialkit'
import { IconMacbook } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconMacbook'
import { IconNewspaper2 } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconNewspaper2'
import { IconPeople } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconPeople'
import { IconServer } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconServer'
import { IconTasks } from '@central-icons-react/square-outlined-radius-0-stroke-1/IconTasks'
import {
  ALL_COMMAND_SECTIONS,
  COMMAND_SECTIONS,
  COMMAND_SUB_TABS,
  COMMAND_TABS,
  SMARTBAR_ITEMS,
} from './commandData'

const MOTION_TIMING = {
  palette: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  paletteExit: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  results: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
  subTabs: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  subTabsCollapseExit: { duration: 0.16, ease: [0.4, 0, 0.2, 1] },
  subTabsContentExit: { duration: 0.16, ease: [0.4, 0, 1, 1] },
}

const COPIED_RESET_DELAY = 1100
const DEFAULT_TAB = 'All'
const DEFAULT_LOADING_QUERY_KEY = 'resting'
const SUB_TAB_EXIT_DELAY = 190

function CommandPalette({ open, motionEnabled, onOpenChange }) {
  const [query, setQuery] = useState('')
  const [hasSearchLoadingCompleted, setHasSearchLoadingCompleted] = useState(false)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [selectionMode, setSelectionMode] = useState('mouse')
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const [activeSubTab, setActiveSubTab] = useState(null)
  const [exitingSubTabPanel, setExitingSubTabPanel] = useState(null)
  const [copiedActionId, setCopiedActionId] = useState(null)
  const activeActionsRef = useRef([])
  const copiedActionIdRef = useRef(null)
  const inputRef = useRef(null)
  const resultsBodyRef = useRef(null)
  const subTabExitTimerRef = useRef(null)
  const loadingDelayTimerRef = useRef(null)
  const loadingTimerRef = useRef(null)
  const suppressNextInputRef = useRef(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = motionEnabled && !shouldReduceMotion
  const loadingMotion = useDialKit('Search Loading', {
    enabled: true,
    triggerDelayMs: [400, 0, 800, 25],
    visibleMs: [2000, 400, 4000, 50],
    rowCount: [8, 3, 9, 1],
    rowActiveMs: [120, 60, 320, 10],
    rowStaggerMs: [35, 20, 180, 5],
    rowY: [1, -4, 4, 0.5],
    fillColor: '#f5f5f5',
    idleColor: '#ffffff',
  })
  const isFiltering = Boolean(query.trim())

  const visibleSmartbarItems = useMemo(() => {
    if (query.trim() || activeTab !== 'All') {
      return []
    }

    return SMARTBAR_ITEMS
  }, [activeTab, query])

  const visibleSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const sourceSections = activeTab === 'All' && !normalizedQuery
      ? ALL_COMMAND_SECTIONS
      : COMMAND_SECTIONS

    return sourceSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!matchesActiveFilter(item, activeTab, activeSubTab)) {
            return false
          }

          if (!normalizedQuery) {
            return true
          }

          const searchableText = [item.label, item.meta, item.email, ...item.keywords]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return searchableText.includes(normalizedQuery)
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [activeSubTab, activeTab, query])

  const visibleItems = useMemo(
    () => visibleSections.flatMap((section) => section.items),
    [visibleSections],
  )
  const hasSearchResults = !isFiltering || visibleItems.length > 0
  const shouldQueueSearchLoading = isFiltering && loadingMotion.enabled && !hasSearchResults
  const shouldShowSearchLoading = shouldQueueSearchLoading && isSearchLoading
  const shouldHoldEmptyState = shouldQueueSearchLoading && !isSearchLoading && !hasSearchLoadingCompleted

  const selectableItems = useMemo(
    () => {
      if (shouldShowSearchLoading) {
        return []
      }

      return [
        ...visibleSmartbarItems.map((item) => ({ ...item, type: 'smartbar' })),
        ...visibleItems.map((item) => ({ ...item, type: 'row' })),
      ]
    },
    [shouldShowSearchLoading, visibleItems, visibleSmartbarItems],
  )

  const selectedItem = useMemo(
    () => selectableItems.find((item) => item.id === selectedId) || null,
    [selectableItems, selectedId],
  )

  const activeItem = useMemo(
    () => selectedItem || getFirstCopyableItem(selectableItems),
    [selectableItems, selectedItem],
  )

  const activeActions = useMemo(
    () => getActionsForItem(activeItem),
    [activeItem],
  )

  useEffect(() => {
    if (!open) {
      setQuery('')
      setHasSearchLoadingCompleted(false)
      setIsSearchLoading(false)
      setSelectedId(null)
      setSelectionMode('mouse')
      setExitingSubTabPanel(null)
      return
    }

    setQuery('')
    setHasSearchLoadingCompleted(false)
    setIsSearchLoading(false)
    setSelectedId(null)
    setSelectionMode('mouse')
    setExitingSubTabPanel(null)

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(focusTimer)
  }, [open])

  useEffect(() => {
    return () => {
      if (subTabExitTimerRef.current) {
        window.clearTimeout(subTabExitTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (loadingDelayTimerRef.current) {
      window.clearTimeout(loadingDelayTimerRef.current)
      loadingDelayTimerRef.current = null
    }

    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current)
      loadingTimerRef.current = null
    }

    if (!open || !shouldQueueSearchLoading) {
      setHasSearchLoadingCompleted(false)
      setIsSearchLoading(false)
      return undefined
    }

    setHasSearchLoadingCompleted(false)
    setIsSearchLoading(false)
    loadingDelayTimerRef.current = window.setTimeout(() => {
      setIsSearchLoading(true)
      loadingDelayTimerRef.current = null
      const loadingDuration = getAlignedLoadingDuration(loadingMotion)
      loadingTimerRef.current = window.setTimeout(() => {
        setHasSearchLoadingCompleted(true)
        setIsSearchLoading(false)
        loadingTimerRef.current = null
      }, loadingDuration)
    }, loadingMotion.triggerDelayMs)

    return () => {
      if (loadingDelayTimerRef.current) {
        window.clearTimeout(loadingDelayTimerRef.current)
        loadingDelayTimerRef.current = null
      }

      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current)
        loadingTimerRef.current = null
      }
    }
  }, [
    loadingMotion.enabled,
    loadingMotion.rowActiveMs,
    loadingMotion.rowCount,
    loadingMotion.rowStaggerMs,
    loadingMotion.triggerDelayMs,
    loadingMotion.visibleMs,
    open,
    query,
    shouldQueueSearchLoading,
  ])

  useEffect(() => {
    setSelectedId(null)
    setSelectionMode('mouse')
  }, [activeSubTab, activeTab, query])

  useEffect(() => {
    setCopiedActionId(null)
  }, [selectedId])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const selectedElement = resultsBodyRef.current?.querySelector('[aria-selected="true"]')
    selectedElement?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

  useEffect(() => {
    activeActionsRef.current = activeActions
  }, [activeActions])

  useEffect(() => {
    copiedActionIdRef.current = copiedActionId
  }, [copiedActionId])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    function triggerActiveCopy(event) {
      const copyAction = activeActionsRef.current.find((action) => action.copyValue)

      if (!copyAction) {
        return false
      }

      event.preventDefault()
      event.stopPropagation()

      if (!copiedActionIdRef.current) {
        triggerCopyAction(copyAction)
      }

      return true
    }

    function handleDocumentKeyDown(event) {
      if (getAltCopyShortcutAction(event, activeActionsRef.current)) {
        suppressNextInputRef.current = true
        window.setTimeout(() => {
          suppressNextInputRef.current = false
        }, 0)
        triggerActiveCopy(event)
      }
    }

    function handleInputBeforeInput(event) {
      if (suppressNextInputRef.current) {
        event.preventDefault()
      }
    }

    function handleInput(event) {
      if (suppressNextInputRef.current) {
        event.currentTarget.value = query
      }
    }

    const input = inputRef.current
    document.addEventListener('keydown', handleDocumentKeyDown, true)
    input?.addEventListener('beforeinput', handleInputBeforeInput, true)
    input?.addEventListener('input', handleInput, true)

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown, true)
      input?.removeEventListener('beforeinput', handleInputBeforeInput, true)
      input?.removeEventListener('input', handleInput, true)
    }
  }, [open, query])

  function handleAction(action) {
    if (action.copyValue) {
      triggerCopyAction(action)
    }
  }

  function triggerCopyAction(action) {
    setCopiedActionId(action.id)
    void copyActionValue(action.copyValue)
    window.setTimeout(() => {
      setCopiedActionId((currentId) => (currentId === action.id ? null : currentId))
    }, COPIED_RESET_DELAY)
  }

  function selectWithMouse(id) {
    setSelectionMode('mouse')
    setSelectedId(id)
  }

  function selectWithKeyboard(getNextId) {
    setSelectionMode('keyboard')
    setSelectedId(getNextId)
  }

  function handleTabChange(tab) {
    queueSubTabExit(tab)
    setActiveTab(tab)
    setActiveSubTab(null)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleSubTabChange(subTab) {
    setActiveSubTab(subTab)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  function activateItem(item) {
    if (!item?.tab) {
      return false
    }

    queueSubTabExit(item.tab)
    setActiveTab(item.tab)
    setActiveSubTab(item.subTab || null)
    window.requestAnimationFrame(() => inputRef.current?.focus())
    return true
  }

  function resetToDefaultTab() {
    queueSubTabExit(DEFAULT_TAB)
    setActiveTab(DEFAULT_TAB)
    setActiveSubTab(null)
  }

  function queueSubTabExit(nextTab) {
    if (subTabExitTimerRef.current) {
      window.clearTimeout(subTabExitTimerRef.current)
      subTabExitTimerRef.current = null
    }

    if (
      !shouldAnimate ||
      activeTab === nextTab ||
      !COMMAND_SUB_TABS[activeTab]?.length
    ) {
      setExitingSubTabPanel(null)
      return
    }

    setExitingSubTabPanel(activeTab)
    subTabExitTimerRef.current = window.setTimeout(() => {
      setExitingSubTabPanel(null)
      subTabExitTimerRef.current = null
    }, SUB_TAB_EXIT_DELAY)
  }

  function moveTabSelection(direction) {
    const tabOptions = getVisibleTabOptions(activeTab)
    const activeOptionId = activeSubTab
      ? `${activeTab}:${activeSubTab}`
      : activeTab
    const activeIndex = tabOptions.findIndex((option) => option.id === activeOptionId)
    const nextIndex = (
      activeIndex + direction + tabOptions.length
    ) % tabOptions.length
    const nextOption = tabOptions[nextIndex]

    setSelectionMode('keyboard')
    queueSubTabExit(nextOption.tab)
    setActiveTab(nextOption.tab)
    setActiveSubTab(nextOption.subTab || null)
  }

  function handleKeyDown(event) {
    if (event.altKey) {
      const copyAction = getAltCopyShortcutAction(event, activeActions)

      if (copyAction) {
        event.preventDefault()
        event.stopPropagation()
        suppressNextInputRef.current = true
        window.setTimeout(() => {
          suppressNextInputRef.current = false
        }, 0)
        triggerCopyAction(copyAction)
        return
      }

      const tabIndex = getAltShortcutIndex(event)

      if (tabIndex >= 0 && tabIndex < COMMAND_TABS.length) {
        event.preventDefault()
        event.stopPropagation()
        suppressNextInputRef.current = true
        window.setTimeout(() => {
          suppressNextInputRef.current = false
        }, 0)
        handleTabChange(COMMAND_TABS[tabIndex])
        return
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      resetToDefaultTab()
      onOpenChange(false)
      return
    }

    if (selectableItems.length === 0) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectWithKeyboard((currentId) => {
        const currentIndex = getSelectedIndex(selectableItems, currentId)
        return selectableItems[(currentIndex + 1) % selectableItems.length].id
      })
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectWithKeyboard((currentId) => {
        const currentIndex = getSelectedIndex(selectableItems, currentId)
        return selectableItems[
          (currentIndex - 1 + selectableItems.length) % selectableItems.length
        ].id
      })
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveTabSelection(1)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveTabSelection(-1)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (selectedItem?.type === 'smartbar') {
        activateItem(selectedItem)
      }
    }
  }

  const palette = (
    <div
      className="command-layer"
      data-motion={shouldAnimate}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      <section
        className="command-palette"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        data-motion={shouldAnimate}
        data-selection-mode={selectionMode}
      >
        <label className="command-search-row">
          <span className="command-search-text-frame">
            <span className="sr-only">Search commands</span>
            <input
              ref={inputRef}
              className="command-search-input"
              value={query}
              placeholder="Search..."
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
              onBeforeInput={(event) => {
                if (suppressNextInputRef.current) {
                  event.preventDefault()
                }
              }}
            />
          </span>
        </label>

        <div className="command-results" role="listbox" aria-label="Command results">
          <CommandTabs
            activeSubTab={activeSubTab}
            activeTab={activeTab}
            exitingSubTabPanel={exitingSubTabPanel}
            motionEnabled={shouldAnimate}
            onSubTabChange={handleSubTabChange}
            onTabChange={handleTabChange}
          />
          {shouldAnimate ? (
            <AnimatePresence mode="wait">
              <motion.div
                className="command-results-body"
                ref={resultsBodyRef}
                key={`${activeTab}-${activeSubTab || 'none'}-${query}-${shouldShowSearchLoading ? 'loading' : 'results'}`}
                initial={shouldShowSearchLoading
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 2, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={shouldShowSearchLoading
                  ? { opacity: 0, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: -2, filter: 'blur(2px)' }}
                transition={shouldShowSearchLoading
                  ? { duration: 0.14, ease: [0.4, 0, 1, 1] }
                  : MOTION_TIMING.results}
              >
                <CommandResultsContent
                  motionEnabled={shouldAnimate}
                  selectedId={selectedId}
                  holdEmptyState={shouldHoldEmptyState}
                  searchLoading={shouldShowSearchLoading}
                  loadingMotion={loadingMotion}
                  loadingMotionEnabled={!shouldReduceMotion}
                  loadingKey={query.trim() || DEFAULT_LOADING_QUERY_KEY}
                  visibleItems={visibleItems}
                  visibleSections={visibleSections}
                  visibleSmartbarItems={visibleSmartbarItems}
                  onActivate={activateItem}
                  onSelect={selectWithMouse}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="command-results-body" ref={resultsBodyRef}>
              <CommandResultsContent
                motionEnabled={false}
                selectedId={selectedId}
                holdEmptyState={shouldHoldEmptyState}
                searchLoading={shouldShowSearchLoading}
                loadingMotion={loadingMotion}
                loadingMotionEnabled={!shouldReduceMotion}
                loadingKey={query.trim() || DEFAULT_LOADING_QUERY_KEY}
                visibleItems={visibleItems}
                visibleSections={visibleSections}
                visibleSmartbarItems={visibleSmartbarItems}
                onActivate={activateItem}
                onSelect={selectWithMouse}
              />
            </div>
          )}
        </div>
        <CommandActionBar
          copiedActionId={copiedActionId}
          actions={activeActions}
          motionEnabled={shouldAnimate}
          onAction={handleAction}
        />
      </section>
    </div>
  )

  if (!shouldAnimate) {
    return open ? palette : null
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-motion-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={MOTION_TIMING.paletteExit}
        >
          <motion.div
            className="command-motion-frame"
            initial={{ opacity: 0, y: -5, scale: 0.992, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -3, scale: 0.996, filter: 'blur(2px)' }}
            transition={MOTION_TIMING.palette}
          >
            {palette}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CommandResultsContent({
  holdEmptyState,
  loadingKey,
  loadingMotion,
  loadingMotionEnabled,
  motionEnabled,
  searchLoading,
  selectedId,
  visibleItems,
  visibleSections,
  visibleSmartbarItems,
  onActivate,
  onSelect,
}) {
  if (searchLoading) {
    return (
      <CommandLoadingRows
        key={loadingKey}
        motionEnabled={loadingMotionEnabled}
        settings={loadingMotion}
      />
    )
  }

  if (holdEmptyState) {
    return <div className="command-empty" aria-hidden="true" />
  }

  if (visibleItems.length === 0 && visibleSmartbarItems.length === 0) {
    return <div className="command-empty">No results</div>
  }

  return (
    <>
      {visibleSmartbarItems.length > 0 && (
        <CommandSmartbar
          items={visibleSmartbarItems}
          motionEnabled={motionEnabled}
          selectedId={selectedId}
          onActivate={onActivate}
          onSelect={onSelect}
        />
      )}
      <CommandSections
        motionEnabled={motionEnabled}
        sections={visibleSections}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </>
  )
}

function CommandLoadingRows({ motionEnabled, settings }) {
  const rowCount = Math.round(settings.rowCount)
  const activeSeconds = msToSeconds(settings.rowActiveMs)
  const staggerSeconds = msToSeconds(settings.rowStaggerMs)
  const phaseSeconds = activeSeconds + staggerSeconds * Math.max(rowCount - 1, 0)
  const cycleSeconds = Math.max(phaseSeconds * 2, 0.1)
  const idleColor = settings.idleColor
  const fillColor = settings.fillColor

  return (
    <div
      className="command-loading-rows"
      aria-busy="true"
      aria-label="Loading results"
      role="presentation"
    >
      {Array.from({ length: rowCount }, (_, index) => {
        const downStart = staggerSeconds * index
        const upStart = phaseSeconds + staggerSeconds * (rowCount - 1 - index)
        const fillInSeconds = Math.min(activeSeconds * 0.28, 0.045)
        const downIn = Math.min(downStart + fillInSeconds, cycleSeconds)
        const downOut = Math.min(downStart + activeSeconds, cycleSeconds)
        const upIn = Math.min(upStart + fillInSeconds, cycleSeconds)
        const upOut = Math.min(upStart + activeSeconds, cycleSeconds)
        const times = [
          0,
          downStart / cycleSeconds,
          downIn / cycleSeconds,
          downOut / cycleSeconds,
          upStart / cycleSeconds,
          upIn / cycleSeconds,
          upOut / cycleSeconds,
          1,
        ]
        const rowStyle = {
          '--loading-row-idle': idleColor,
          '--loading-row-fill': fillColor,
        }

        if (!motionEnabled) {
          return (
            <div
              className="command-loading-row"
              data-active={index === 0}
              key={index}
              role="presentation"
              style={rowStyle}
            />
          )
        }

        return (
          <motion.div
            className="command-loading-row"
            key={index}
            role="presentation"
            style={rowStyle}
            initial={{ backgroundColor: idleColor, y: 0 }}
            animate={{
              backgroundColor: [
                idleColor,
                idleColor,
                fillColor,
                idleColor,
                idleColor,
                fillColor,
                idleColor,
                idleColor,
              ],
              y: [0, 0, settings.rowY, 0, 0, -settings.rowY, 0, 0],
            }}
            transition={{
              backgroundColor: {
                duration: cycleSeconds,
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                times,
              },
              y: {
                duration: cycleSeconds,
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                times,
              },
            }}
          />
        )
      })}
    </div>
  )
}

function CommandTabs({
  activeSubTab,
  activeTab,
  exitingSubTabPanel,
  motionEnabled,
  onSubTabChange,
  onTabChange,
}) {
  return (
    <div className="command-tabs" aria-label="Result filters">
      {COMMAND_TABS.map((tab, index) => {
        const subTabs = COMMAND_SUB_TABS[tab] || []
        const hasSubTabs = subTabs.length > 0
        const hasVisibleSubTabs = tab === activeTab && subTabs.length > 0
        const hasExitingSubTabs = motionEnabled && tab === exitingSubTabPanel && !hasVisibleSubTabs

        if (hasSubTabs) {
          return (
            <div className="command-tab-group" key={tab}>
              <button
                className="command-tab command-tab-parent"
                type="button"
                data-active={tab === activeTab}
                data-filtering={tab === activeTab && Boolean(activeSubTab)}
                aria-pressed={tab === activeTab}
                title={`Alt+${index + 1}`}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
              {(hasVisibleSubTabs || hasExitingSubTabs) && (
                <SubTabPanel
                  activeSubTab={activeSubTab}
                  motionEnabled={motionEnabled}
                  phase={hasExitingSubTabs ? 'closing' : 'open'}
                  subTabs={subTabs}
                  onSubTabChange={onSubTabChange}
                />
              )}
            </div>
          )
        }

        return (
          <button
            key={tab}
            className="command-tab"
            type="button"
            data-active={tab === activeTab}
            aria-pressed={tab === activeTab}
            title={`Alt+${index + 1}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

function SubTabPanel({
  activeSubTab,
  motionEnabled,
  phase,
  subTabs,
  onSubTabChange,
}) {
  const contentRef = useRef(null)
  const [panelWidth, setPanelWidth] = useState(0)
  const content = subTabs.map((subTab) => (
    <button
      key={subTab}
      className="command-tab command-sub-tab"
      type="button"
      data-active={subTab === activeSubTab}
      aria-pressed={subTab === activeSubTab}
      onClick={() => onSubTabChange(subTab)}
    >
      {subTab}
    </button>
  ))

  useLayoutEffect(() => {
    if (motionEnabled && phase === 'open') {
      setPanelWidth(contentRef.current?.scrollWidth || 0)
    }
  }, [motionEnabled, phase, subTabs])

  if (!motionEnabled) {
    return (
      <div className="command-sub-tabs-panel">
        <div className="command-sub-tabs-content">{content}</div>
      </div>
    )
  }

  const closing = phase === 'closing'

  return (
    <motion.div
      className="command-sub-tabs-panel"
      initial={closing ? false : { width: 0 }}
      animate={{ width: closing ? 0 : panelWidth }}
      transition={closing ? MOTION_TIMING.subTabsCollapseExit : MOTION_TIMING.subTabs}
    >
      <motion.div
        className="command-sub-tabs-content"
        ref={contentRef}
        initial={closing ? false : { opacity: 0, x: -4, filter: 'blur(2px)' }}
        animate={closing
          ? { opacity: 0, x: -4, filter: 'blur(2px)' }
          : { opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={closing
          ? MOTION_TIMING.subTabsContentExit
          : MOTION_TIMING.subTabs}
      >
        {content}
      </motion.div>
    </motion.div>
  )
}

function CommandSmartbar({ items, motionEnabled, selectedId, onActivate, onSelect }) {
  return (
    <div className="command-smartbar" aria-label="Current status">
      {items.map((item) => (
        <button
          className="smartbar-card"
          key={item.id}
          type="button"
          role="option"
          aria-selected={item.id === selectedId}
          data-selected={item.id === selectedId}
          data-motion={motionEnabled}
          onClick={() => onActivate(item)}
          onPointerMove={() => onSelect(item.id)}
        >
          <p className="smartbar-eyebrow">{item.eyebrow}</p>
          <div className="smartbar-content">
            <SmartbarBadge item={item} />
            <div className="smartbar-copy">
              <p className="smartbar-title">{item.title}</p>
              <p className="smartbar-detail">{item.detail}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function SmartbarBadge({ item }) {
  if (item.avatars) {
    return (
      <span className="smartbar-avatar-stack" aria-hidden="true">
        {item.avatars.map((avatar) => (
          <span className="smartbar-avatar" key={avatar}>
            {avatar}
          </span>
        ))}
      </span>
    )
  }

  if (item.avatar) {
    return <span className="smartbar-avatar">{item.avatar}</span>
  }

  return (
    <span className="smartbar-status" data-tone={item.tone}>
      <CommandIcon name={item.icon} size="large" />
    </span>
  )
}

function CommandSections({ motionEnabled, sections, selectedId, onSelect }) {
  return sections.map((section) => (
    <section className="command-section" key={section.id}>
      <div className="command-section-heading">
        <span>{section.label}</span>
      </div>
      {section.items.map((item) => (
        <CommandRow
          key={item.id}
          item={item}
          motionEnabled={motionEnabled}
          selected={item.id === selectedId}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </section>
  ))
}

function CommandRow({ item, motionEnabled, selected, onSelect }) {
  const isMember = item.kind === 'member'
  const isAsset = item.kind === 'asset'

  return (
    <button
      className="command-row"
      type="button"
      role="option"
      aria-selected={selected}
      data-alert={item.hasAlert || undefined}
      data-selected={selected}
      data-motion={motionEnabled}
      data-row-kind={item.kind}
      onPointerMove={onSelect}
    >
      <span className="command-row-main">
        {isMember ? (
          <AvatarBadge initials={item.avatar} />
        ) : (
          <span className="command-row-icon-frame">
            <CommandIcon name={item.icon} />
          </span>
        )}
        <span className="command-copy">
          <span className="command-label">{item.label}</span>
          {item.meta && (
            <span
              className="command-meta"
              data-state={item.meta.toLowerCase().replace(/\s+/g, '-')}
            >
              {item.meta}
            </span>
          )}
        </span>
      </span>
      {isMember && item.email && (
        <span className="command-row-accessory command-row-email">{item.email}</span>
      )}
      {isAsset && item.ownerAvatar && (
        <span className="command-row-accessory">
          <AvatarBadge initials={item.ownerAvatar} state={item.ownerState} />
        </span>
      )}
    </button>
  )
}

function AvatarBadge({ initials, state }) {
  return <span className="command-avatar-badge" data-state={state}>{initials}</span>
}

function CommandActionBar({ actions, copiedActionId, motionEnabled, onAction }) {
  return (
    <div className="command-action-bar" aria-label="Available actions">
      <div className="command-actions" data-motion={motionEnabled}>
        {actions.map((action, index) => (
          <ActionGroup
            action={action}
            copied={action.id === copiedActionId}
            onAction={onAction}
            key={`${index}-${getActionKey(action, action.id === copiedActionId)}`}
          >
            <span className="command-action-label">
              {action.id === copiedActionId ? 'Copied' : action.label}
            </span>
            {action.keys.map((key) => (
              <kbd className="command-key" key={key}>
                {formatKey(key)}
              </kbd>
            ))}
          </ActionGroup>
        ))}
      </div>
    </div>
  )
}

function ActionGroup({ action, children, copied, onAction }) {
  return (
    <button
      className="command-action"
      data-copied={copied}
      data-primary={action.primary === true}
      type="button"
      onClick={() => onAction(action)}
    >
      {children}
    </button>
  )
}

function CommandIcon({ name, size = 'default' }) {
  const className = size === 'large' ? 'command-status-icon' : 'command-row-icon'
  const CentralIcon = {
    book: IconNewspaper2,
    laptop: IconMacbook,
    person: IconPeople,
    server: IconServer,
    tasks: IconTasks,
  }[name]

  if (CentralIcon) {
    return <CentralIcon aria-hidden="true" className={className} />
  }

  if (name === 'check') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 20 20">
        <path d="M6.25 10.25 8.75 12.75 13.75 7.25" />
      </svg>
    )
  }

  if (name === 'exclamation-triangle') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
        <path d="M12 3 21.75 19.5H2.25L12 3Z" />
        <path d="M12 9.5V14" />
        <path d="M12 16.49V16.5" />
      </svg>
    )
  }

  if (name === 'person') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 16 16">
        <circle cx="8" cy="4.5" r="2.5" />
        <path d="M2.5 14c.7-3 2.5-4.5 5.5-4.5S12.8 11 13.5 14" />
      </svg>
    )
  }

  if (name === 'laptop') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 16 16">
        <path d="M3 4h10v7H3z" />
        <path d="M1.5 13h13" />
      </svg>
    )
  }

  if (name === 'server') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 16 16">
        <path d="M2 2.5h12v5H2z" />
        <path d="M2 8.5h12v5H2z" />
        <path d="M4.5 5h1" />
      </svg>
    )
  }

  if (name === 'tasks') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 16 16">
        <path d="M2.5 3h11v10h-11z" />
        <path d="M7.75 6.25h3" />
        <path d="M7.75 9.75h3" />
        <path d="M4.75 5.75h1.25v1.25H4.75z" />
        <path d="M4.75 9.25h1.25v1.25H4.75z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16">
      <path d="M2.5 3h4.25c.8 0 1.25.45 1.25 1.25V13c0-.8-.45-1.25-1.25-1.25H2.5z" />
      <path d="M13.5 3H9.25C8.45 3 8 3.45 8 4.25V13c0-.8.45-1.25 1.25-1.25h4.25z" />
    </svg>
  )
}

function matchesActiveFilter(item, activeTab, activeSubTab) {
  if (activeTab === 'All') {
    return true
  }

  if (item.tab !== activeTab) {
    return false
  }

  if (!activeSubTab) {
    return true
  }

  if (activeTab === 'Members' && activeSubTab === 'On-call') {
    return item.meta === 'On-call'
  }

  if (activeTab === 'Incidents' && activeSubTab === 'Ongoing') {
    return item.incidentState === 'ongoing'
  }

  if (activeTab === 'Incidents' && activeSubTab === 'Resolved') {
    return item.incidentState === 'resolved'
  }

  return item.subTab === activeSubTab
}

function msToSeconds(value) {
  return Math.max(Number(value) || 0, 0) / 1000
}

function getAlignedLoadingDuration(settings) {
  const rowCount = Math.round(settings.rowCount)
  const phaseMs = Number(settings.rowActiveMs) + Number(settings.rowStaggerMs) * Math.max(rowCount - 1, 0)
  const visibleMs = Number(settings.visibleMs) || 0

  if (!Number.isFinite(phaseMs) || phaseMs <= 0) {
    return visibleMs
  }

  return Math.ceil(visibleMs / phaseMs) * phaseMs
}

function getVisibleTabOptions(activeTab) {
  return COMMAND_TABS.flatMap((tab) => {
    const options = [{ id: tab, tab }]

    if (tab === activeTab) {
      options.push(
        ...(COMMAND_SUB_TABS[tab] || []).map((subTab) => ({
          id: `${tab}:${subTab}`,
          tab,
          subTab,
        })),
      )
    }

    return options
  })
}

function getSelectedIndex(items, selectedId) {
  if (!selectedId) {
    return -1
  }

  const selectedIndex = items.findIndex((item) => item.id === selectedId)
  return selectedIndex === -1 ? -1 : selectedIndex
}

function getActionsForItem(item) {
  if (!item?.actions) {
    return [{ id: 'view', label: 'View', keys: ['Enter'], primary: true }]
  }

  return item.actions
}

function getFirstCopyableItem(items) {
  return items.find((item) => item.actions?.some((action) => action.copyValue)) || null
}

function formatKey(key) {
  if (key === 'Alt') {
    return '⌥'
  }

  if (key === 'Meta') {
    return '⌘'
  }

  if (key === 'Enter') {
    return '⏎'
  }

  return key
}

function getActionKey(action, copied = false) {
  return `${action.id}-${copied ? 'copied' : action.label}-${action.keys.join('-')}`
}

function getAltCopyShortcutAction(event, actions) {
  if (!isAltCopyShortcut(event)) {
    return null
  }

  return actions.find((action) => action.copyValue)
}

function isAltCopyShortcut(event) {
  if (!event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) {
    return false
  }

  return event.key.toLowerCase() === 'c' || event.code === 'KeyC'
}

async function copyActionValue(value) {
  try {
    await navigator.clipboard?.writeText(value)
  } catch {
    // This is a prototype feedback state; clipboard access can be blocked in browsers.
  }
}

function getAltShortcutIndex(event) {
  const keyIndex = Number(event.key) - 1

  if (Number.isInteger(keyIndex)) {
    return keyIndex
  }

  const codeMatch = event.code?.match(/^Digit([1-5])$/)

  if (codeMatch) {
    return Number(codeMatch[1]) - 1
  }

  return -1
}

export default CommandPalette
