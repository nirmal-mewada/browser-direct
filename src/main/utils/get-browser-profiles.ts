import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { app } from 'electron'

import type { AppName } from '../../config/apps.js'
import { apps } from '../../config/apps.js'
import type { BrowserProfile } from '../../shared/state/reducer.data.js'

// Chromium-internal profiles that should never be offered to the user
const IGNORED_PROFILE_DIRECTORIES = new Set(['Guest Profile', 'System Profile'])

type InfoCacheEntry = {
  name?: string
}

/**
 * Extracts the user profiles from the parsed contents of a Chromium
 * "Local State" JSON file (`profile.info_cache`).
 */
export function parseLocalState(localState: unknown): BrowserProfile[] {
  if (typeof localState !== 'object' || localState === null) {
    return []
  }

  const infoCache = (
    localState as { profile?: { info_cache?: Record<string, InfoCacheEntry> } }
  ).profile?.info_cache

  if (typeof infoCache !== 'object' || infoCache === null) {
    return []
  }

  return Object.entries(infoCache)
    .filter(([directory]) => !IGNORED_PROFILE_DIRECTORIES.has(directory))
    .map(([directory, entry]) => ({
      directory,
      name: entry.name?.trim() || directory,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Reads the profiles of all installed Chromium-based browsers that declare a
 * `profilesDirPath` in the apps config, keyed by app name. Browsers whose
 * "Local State" file is missing or unreadable are silently skipped.
 */
export async function getBrowserProfiles(
  installedAppNames: AppName[],
): Promise<Partial<Record<AppName, BrowserProfile[]>>> {
  const profiles: Partial<Record<AppName, BrowserProfile[]>> = {}

  await Promise.all(
    installedAppNames.map(async (appName) => {
      const selectedApp = apps[appName]

      if (!('profilesDirPath' in selectedApp)) {
        return
      }

      const localStatePath = path.join(
        app.getPath('appData'),
        selectedApp.profilesDirPath,
        'Local State',
      )

      try {
        const localState: unknown = JSON.parse(
          await readFile(localStatePath, 'utf8'),
        )
        const appProfiles = parseLocalState(localState)

        if (appProfiles.length > 0) {
          profiles[appName] = appProfiles
        }
      } catch {
        // Browser not run yet, file missing, or malformed JSON — skip.
      }
    }),
  )

  return profiles
}
