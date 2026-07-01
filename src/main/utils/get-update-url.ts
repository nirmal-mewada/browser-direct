import { app } from 'electron'

export function getUpdateUrl(): string {
  return `https://update.electronjs.org/nirmal-mewada/browser-direct/darwin-${
    process.arch
  }/${app.getVersion()}`
}
