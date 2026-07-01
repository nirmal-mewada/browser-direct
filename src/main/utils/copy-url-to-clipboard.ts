import { clipboard, Notification } from 'electron'

const copyUrlToClipboard = (string: string): boolean => {
  if (string) {
    clipboard.writeText(string)
    new Notification({
      body: 'URL copied to clipboard',
      silent: true,
      title: 'BrowserDirect',
    }).show()
    return true
  }

  return false
}

export default copyUrlToClipboard
