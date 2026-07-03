import type { AppName } from '../../../config/apps.js'
import type { PrefsTab } from '../../../shared/state/reducer.data.js'
import type { RedirectRule } from '../../../shared/state/reducer.storage.js'
import { actionNamespacer } from '../../../shared/utils/action-namespacer.js'

const prefs = actionNamespacer('prefs')

const startedPrefs = prefs('started')

const clickedTabButton = prefs<PrefsTab>('tab-button/clicked')

const clickedSetAsDefaultBrowserButton = prefs(
  'set-as-default-browser-button/clicked',
)

const clickedRescanApps = prefs('rescan-apps/clicked')
const clickedUpdateButton = prefs('update-button/clicked')
const clickedUpdateRestartButton = prefs('update-restart-button/clicked')
const confirmedReset = prefs('reset/confirmed')

const updatedHotCode = prefs<{ appName: AppName; value: string }>(
  'hot-code/updated',
)

const reorderedApp = prefs<{ sourceName: AppName; destinationName: AppName }>(
  'app/reordered',
)

const clickedHomepageButton = prefs('homepage-button/clicked')
const clickedOpenIssueButton = prefs('open-issue-button/clicked')

const addedRedirectRule = prefs<RedirectRule>('redirects/added')
const removedRedirectRule = prefs<{ id: string }>('redirects/removed')

export {
  addedRedirectRule,
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedTabButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  confirmedReset,
  removedRedirectRule,
  reorderedApp,
  startedPrefs,
  updatedHotCode,
}
