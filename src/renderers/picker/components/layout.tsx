import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import type { AppName } from '../../../config/apps.js'
import { Spinner } from '../../shared/components/atoms/spinner.js'
import {
  useDeepEqualSelector,
  useInstalledApps,
  useKeyCodeMap,
  useSelector,
} from '../../shared/state/hooks.js'
import { appsRef, appsScrollerRef } from '../refs.js'
import { clickedApp, startedPicker } from '../state/actions.js'
import AppLogo from './atoms/app-logo.js'
import Kbd from './atoms/kbd.js'
import { useKeyboardEvents } from './hooks/use-keyboard-events.js'
import SupportMessage from './organisms/support-message.js'
import UpdateBar from './organisms/update-bar.js'
import UrlBar from './organisms/url-bar.js'

const rowClassName = clsx(
  'flex h-12 w-full shrink-0 items-center justify-between space-x-4 px-4 py-2 text-left',
  'focus:bg-blue-500 focus:text-white focus:outline-none focus:dark:bg-blue-700',
  'hover:bg-black/10 hover:dark:bg-blue-50/10',
  'rounded-xl',
)

const rowKeyDownHandler =
  (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.code === 'ArrowDown') {
      event.preventDefault()
      event.stopPropagation()
      appsRef.current?.[index + 1]?.focus()
    } else if (event.code === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      appsRef.current?.[index - 1]?.focus()
    }
  }

const setRowRef = (index: number) => (element: HTMLButtonElement | null) => {
  if (!appsRef.current) {
    appsRef.current = []
  }

  if (element) {
    appsRef.current[index] = element
  } else {
    // React calls the ref with null on unmount; dropping the entry keeps
    // keyboard navigation from focusing rows of a previous view.
    delete appsRef.current[index]
  }
}

type PickerRowProps = {
  readonly index: number
  readonly ariaLabel: string
  readonly onClick: React.MouseEventHandler<HTMLButtonElement>
  readonly children: React.ReactNode
}

const PickerRow = ({
  index,
  ariaLabel,
  onClick,
  children,
}: PickerRowProps): JSX.Element => (
  <button
    ref={setRowRef(index)}
    aria-label={ariaLabel}
    className={rowClassName}
    onClick={onClick}
    onKeyDown={rowKeyDownHandler(index)}
    type="button"
  >
    {children}
  </button>
)

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(startedPicker())
  }, [dispatch])
}

const App: React.FC = () => {
  const dispatch = useDispatch()

  /**
   * Tell main that renderer is available
   */
  useAppStarted()

  /**
   * Setup keyboard listeners
   */
  useKeyboardEvents()

  const apps = useInstalledApps()
  const url = useSelector((state) => state.data.url)
  const icons = useDeepEqualSelector((state) => state.data.icons)
  const profiles = useSelector((state) => state.data.profiles)

  const keyCodeMap = useKeyCodeMap()

  /**
   * Which app's profile submenu is currently shown, or null for the app list
   */
  const [expandedApp, setExpandedApp] = useState<AppName | null>(null)

  // Show the app list again whenever a new URL is opened
  useEffect(() => {
    setExpandedApp(null)
  }, [url])

  const expandedAppProfiles = (expandedApp && profiles[expandedApp]) || []

  // When switching between the app list and a profile submenu, scroll back
  // to the top and move focus to the first row for keyboard navigation.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    appsScrollerRef.current?.scrollTo(0, 0)
    requestAnimationFrame(() => appsRef.current?.[0]?.focus())
  }, [expandedApp])

  // While a profile submenu is open, Escape goes back to the app list
  // instead of dismissing the picker. Capture phase so this runs before the
  // global pressedKey listener (which would hide the window).
  useEffect(() => {
    if (!expandedApp) {
      // eslint-disable-next-line unicorn/no-useless-undefined -- effect cleanup signature
      return undefined
    }

    const handler = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        setExpandedApp(null)
      }
    }

    document.addEventListener('keydown', handler, { capture: true })

    return function cleanup() {
      document.removeEventListener('keydown', handler, { capture: true })
    }
  }, [expandedApp])

  return (
    <div
      className="relative flex h-screen w-screen select-none flex-col items-center px-2 pt-4 dark:text-white"
      title={url}
    >
      {!apps[0] && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      <div
        ref={appsScrollerRef}
        className="relative w-full grow overflow-y-auto px-2 pb-2"
      >
        {expandedApp ? (
          <>
            <PickerRow
              ariaLabel="Back to apps"
              index={0}
              onClick={() => setExpandedApp(null)}
            >
              <span>
                <span className="opacity-60">‹ </span>
                {expandedApp}
              </span>
              <AppLogo
                className="size-6 shrink-0"
                icon={icons[expandedApp]}
                name={expandedApp}
              />
            </PickerRow>

            {expandedAppProfiles.map((profile, profileIndex) => (
              <PickerRow
                key={profile.directory}
                ariaLabel={`${expandedApp} ${profile.name} Profile`}
                index={profileIndex + 1}
                onClick={(event) =>
                  dispatch(
                    clickedApp({
                      appName: expandedApp,
                      isAlt: event.altKey,
                      isShift: event.shiftKey,
                      profile: profile.directory,
                    }),
                  )
                }
              >
                <span className="pl-4">{profile.name}</span>
                <AppLogo
                  className="size-6 shrink-0"
                  icon={icons[expandedApp]}
                  name={expandedApp}
                />
              </PickerRow>
            ))}
          </>
        ) : (
          apps.map((app, index) => {
            const hasProfilesSubmenu = (profiles[app.name]?.length ?? 0) > 1

            return (
              <PickerRow
                key={app.name}
                ariaLabel={`${app.name} App`}
                index={index}
                onClick={(event) => {
                  if (hasProfilesSubmenu) {
                    setExpandedApp(app.name)
                  } else {
                    dispatch(
                      clickedApp({
                        appName: app.name,
                        isAlt: event.altKey,
                        isShift: event.shiftKey,
                      }),
                    )
                  }
                }}
              >
                <span>{app.name}</span>
                <span className="flex items-center space-x-4">
                  {app.hotCode ? (
                    <Kbd className="shrink-0">{keyCodeMap[app.hotCode]}</Kbd>
                  ) : null}
                  <AppLogo
                    className="size-6 shrink-0"
                    icon={icons[app.name]}
                    name={app.name}
                  />
                  {hasProfilesSubmenu ? (
                    <span aria-hidden className="shrink-0 opacity-60">
                      ›
                    </span>
                  ) : null}
                </span>
              </PickerRow>
            )
          })
        )}
      </div>

      <UrlBar />

      <UpdateBar />

      <SupportMessage />
    </div>
  )
}

export default App
