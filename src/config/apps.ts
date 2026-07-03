type App = {
  privateArg?: string
  convertUrl?: (url: string) => string
  /**
   * For Chromium-based browsers that support multiple user profiles:
   * path of the browser's user-data directory, relative to
   * `~/Library/Application Support`. The directory is expected to contain a
   * "Local State" JSON file listing the profiles (`profile.info_cache`).
   */
  profilesDirPath?: string
}

const typeApps = <T extends Record<string, App>>(apps: T) => apps

const apps = typeApps({
  Arc: {},
  Basilisk: {},
  Blisk: {},
  'Brave Browser': {
    privateArg: '--incognito',
    profilesDirPath: 'BraveSoftware/Brave-Browser',
  },
  'Brave Browser Beta': {
    privateArg: '--incognito',
    profilesDirPath: 'BraveSoftware/Brave-Browser-Beta',
  },
  'Brave Browser Nightly': {
    privateArg: '--incognito',
    profilesDirPath: 'BraveSoftware/Brave-Browser-Nightly',
  },
  'Brave Dev': {
    privateArg: '--incognito',
  },
  Chromium: {
    privateArg: '--incognito',
    profilesDirPath: 'Chromium',
  },
  'Chromium-Gost': {
    privateArg: '--incognito',
  },
  Comet: {},
  Dia: {},
  Discord: {
    convertUrl: (url) =>
      url.replace(
        /^https?:\/\/(?:(?:ptb|canary)\.)?discord\.com\//u,
        'discord://-/',
      ),
  },
  'Discord Canary': {
    convertUrl: (url) =>
      url.replace(
        /^https?:\/\/(?:(?:ptb|canary)\.)?discord\.com\//u,
        'discord://-/',
      ),
  },
  'Discord PTB': {
    convertUrl: (url) =>
      url.replace(
        /^https?:\/\/(?:(?:ptb|canary)\.)?discord\.com\//u,
        'discord://-/',
      ),
  },
  Dissenter: {},
  DuckDuckGo: {},
  Epic: {},
  Figma: {},
  'Figma Beta': {},
  Finicky: {},
  Firefox: {
    privateArg: '--private-window',
  },
  'Firefox Developer Edition': {
    privateArg: '--private-window',
  },
  'Firefox Nightly': {
    privateArg: '--private-window',
  },
  Floorp: {},
  Framer: {},
  FreeTube: {},
  'Google Chrome': {
    privateArg: '--incognito',
    profilesDirPath: 'Google/Chrome',
  },
  'Google Chrome Beta': {
    privateArg: '--incognito',
    profilesDirPath: 'Google/Chrome Beta',
  },
  'Google Chrome Canary': {
    privateArg: '--incognito',
    profilesDirPath: 'Google/Chrome Canary',
  },
  'Google Chrome Dev': {
    privateArg: '--incognito',
    profilesDirPath: 'Google/Chrome Dev',
  },
  IceCat: {
    privateArg: '--private-window',
  },
  Iridium: {},
  Island: {},
  Lagrange: {},
  LibreWolf: {
    privateArg: '--private-window',
  },
  Linear: {},
  Maxthon: {},
  'Microsoft Edge': {
    privateArg: '--inprivate',
    profilesDirPath: 'Microsoft Edge',
  },
  'Microsoft Edge Beta': {
    privateArg: '--inprivate',
    profilesDirPath: 'Microsoft Edge Beta',
  },
  'Microsoft Edge Canary': {
    privateArg: '--inprivate',
    profilesDirPath: 'Microsoft Edge Canary',
  },
  'Microsoft Edge Dev': {
    privateArg: '--inprivate',
    profilesDirPath: 'Microsoft Edge Dev',
  },
  'Microsoft Teams': {
    convertUrl: (url) =>
      url.replace('https://teams.microsoft.com/', 'msteams:/'),
  },
  'Microsoft Teams (work or school)': {
    convertUrl: (url) =>
      url.replace('https://teams.microsoft.com/', 'msteams:/'),
  },
  'Microsoft Teams classic': {
    convertUrl: (url) =>
      url.replace('https://teams.microsoft.com/', 'msteams:/'),
  },
  Min: {},
  Miro: {},
  'Mullvad Browser': {
    privateArg: '--private-window',
  },
  'NAVER Whale': {},
  Notion: {},
  Opera: {},
  'Opera Beta': {},
  'Opera CD': {},
  'Opera Crypto': {},
  'Opera Dev': {},
  'Opera Developer': {},
  'Opera GX': {},
  'Opera Neon': {},
  Orion: {},
  'Orion RC': {},
  'Pale Moon': {},
  Pocket: {
    convertUrl: (url) => `pocket://add?url=${url}`,
  },
  Polypane: {},
  'PrivateWindow': {},
  'PublicWindow': {},
  qutebrowser: {},
  Safari: {},
  'Safari Technology Preview': {},
  Sidekick: {
    privateArg: '--incognito',
  },
  SigmaOS: {},
  Sizzy: {},
  Slack: {},
  Spotify: {},
  Thorium: {
    privateArg: '--incognito',
  },
  'Tor Browser': {},
  Twilight: {
    privateArg: '--incognito',
  },
  Twitter: {},
  Ulaa: {
    privateArg: '--incognito',
  },
  Vivaldi: {
    profilesDirPath: 'Vivaldi',
  },
  'Vivaldi Snapshot': {
    profilesDirPath: 'Vivaldi Snapshot',
  },
  Waterfox: {},
  Wavebox: {
    privateArg: '--incognito',
  },
  Whist: {},
  Yandex: {},
  Yattee: {},
  'Zen': {
    privateArg: '--private-window',
  },
  'Zen Browser': {},
  'zoom.us': {},
})

type Apps = typeof apps

type AppName = keyof typeof apps

export { AppName, Apps, apps }
