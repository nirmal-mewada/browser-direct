import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import type { AppName } from '../../../../config/apps.js'
import Button from '../../../shared/components/atoms/button.js'
import { useSelector } from '../../../shared/state/hooks.js'
import { addedRedirectRule, removedRedirectRule } from '../../state/actions.js'
import { Pane } from '../molecules/pane.js'

type RowProps = {
  readonly children?: React.ReactNode
}

const Row = ({ children }: RowProps): JSX.Element => (
  <div className="grid grid-cols-12 gap-8">{children}</div>
)

const Left = ({ children }: RowProps): JSX.Element => (
  <div className="col-span-5 self-center text-right font-medium">{children}</div>
)

const Right = ({ children }: RowProps): JSX.Element => (
  <div className="col-span-7 flex flex-col">{children}</div>
)

export const RedirectsPane = (): JSX.Element => {
  const dispatch = useDispatch()
  const rules = useSelector((state) => state.storage.rules)
  const apps = useSelector((state) => state.storage.apps)

  // Filter only installed apps
  const installedApps = apps.filter((app) => app.isInstalled)

  const [pattern, setPattern] = useState('')
  const [selectedApp, setSelectedApp] = useState<AppName | ''>('')

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedPattern = pattern.trim()
    if (!trimmedPattern || !selectedApp) {
      return
    }

    // Validate duplicate patterns case-insensitively
    const isDuplicate = rules.some(
      (rule) => rule.pattern.toLowerCase() === trimmedPattern.toLowerCase(),
    )
    if (isDuplicate) {
      // eslint-disable-next-line no-alert
      alert('A redirect rule for this pattern already exists.')
      return
    }

    dispatch(
      addedRedirectRule({
        appName: selectedApp,
        id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
        pattern: trimmedPattern,
      }),
    )

    setPattern('')
  }

  return (
    <Pane className="space-y-8 overflow-y-auto" pane="redirects">
      <form className="space-y-6" onSubmit={handleAddRule}>
        <Row>
          <Left>Routing Pattern:</Left>
          <Right>
            <input
              className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. *github.com* or localhost:*"
              type="text"
              value={pattern}
            />
            <p className="mt-1.5 text-xs opacity-75">
              Matches using wildcards (e.g. `*github.com*` or `localhost:*`) or
              substring matches.
            </p>
          </Right>
        </Row>

        <Row>
          <Left>Target Browser:</Left>
          <Right>
            <select
              className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              onChange={(e) => setSelectedApp(e.target.value as AppName | '')}
              value={selectedApp}
            >
              <option value="">Select browser...</option>
              {installedApps.map((app) => (
                <option key={app.name} value={app.name}>
                  {app.name}
                </option>
              ))}
            </select>
          </Right>
        </Row>

        <Row>
          <Left />
          <Right>
            <Button
              className="w-fit"
              disabled={!pattern.trim() || !selectedApp}
              type="submit"
            >
              Add Redirect Rule
            </Button>
          </Right>
        </Row>
      </form>

      <div className="border-t border-gray-300 pt-6 dark:border-gray-700">
        <h3 className="mb-4 text-lg font-medium">Configured Redirects</h3>
        {rules.length === 0 ? (
          <p className="text-sm italic opacity-60">
            No redirect rules configured. Links will default to the browser
            picker window.
          </p>
        ) : (
          <div className="overflow-hidden rounded border border-gray-300 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-300 text-left text-sm dark:divide-gray-700">
              <thead className="bg-black/5 font-medium dark:bg-black/20">
                <tr>
                  <th className="px-4 py-2">Pattern</th>
                  <th className="px-4 py-2">Opens In</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {rules.map((rule) => {
                  const targetApp = apps.find((app) => app.name === rule.appName)
                  const isInstalled = targetApp?.isInstalled ?? false

                  return (
                    <tr key={rule.id}>
                      <td
                        className="max-w-xs truncate px-4 py-2.5 text-xs"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {rule.pattern}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="align-middle">{rule.appName}</span>
                        {!isInstalled && (
                          <span className="ml-2 inline-block rounded border border-red-200 bg-red-100 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                            Not Installed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          className="cursor-default text-xs font-medium text-red-600 hover:text-red-500 focus:outline-none dark:text-red-400 dark:hover:text-red-300"
                          onClick={() =>
                            dispatch(removedRedirectRule({ id: rule.id }))
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Pane>
  )
}
