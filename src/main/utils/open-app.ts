import { execFile } from 'node:child_process'

import type { AppName } from '../../config/apps.js'
import { apps } from '../../config/apps.js'

type OpenAppOptions = {
  background?: boolean
  privateMode?: boolean
  // Chromium profile directory to open the URL in, eg. "Profile 1"
  profile?: string
}

export function openApp(
  appName: AppName,
  url: string,
  { background, privateMode, profile }: OpenAppOptions = {},
): void {
  const selectedApp = apps[appName]

  const convertedUrl =
    'convertUrl' in selectedApp ? selectedApp.convertUrl(url) : url

  // Arguments passed to the app itself (after `open`'s `--args`)
  const appArguments: string[] = []

  // Only Chromium-based apps that declare a profiles dir understand
  // `--profile-directory`; ignore the profile for anything else.
  if (profile && 'profilesDirPath' in selectedApp) {
    appArguments.push(`--profile-directory=${profile}`)
  }

  if (privateMode && 'privateArg' in selectedApp) {
    appArguments.push(selectedApp.privateArg)
  }

  const openArguments = ['-a', appName]

  if (background) {
    openArguments.push('--background')
  }

  // `--new` forces a new instance so the args are honoured even when the
  // app is already running; Chromium's singleton hands the URL over to the
  // requested profile's existing process.
  if (appArguments.length > 0) {
    openArguments.push('--new', '--args', ...appArguments)
  }

  // In order for profile/private mode to work the URL needs to be passed
  // in last, _after_ the respective app arguments
  openArguments.push(convertedUrl)

  execFile('open', openArguments)
}
