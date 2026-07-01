# BrowserDirect

BrowserDirect is an open-source browser prompter and direct router for macOS. It
works by setting itself as the default web browser: any link clicked outside of
a browser (in Slack, Mail, an IDE, etc.) is sent to BrowserDirect first, which
then either:

1. **Auto-routes** the link straight to a specific browser based on your own
   wildcard/substring rules, with no prompt at all, or
2. Shows a lightweight **picker** — a pop-up menu of your installed browsers —
   so you can choose where the link should open.

It's a menu-bar-only agent app (no Dock icon, no window until you need one),
designed to stay out of your way.

## Features

- **Auto-Routing Rules** — Define patterns such as `*github.com*` or
  `localhost:*` to send matching links straight to a chosen browser, skipping
  the picker entirely. Rules support glob-style wildcards (`*`) as well as plain
  substring/domain matching, and are managed from the **Redirects** preferences
  pane.
- **Browser Picker** — When no rule matches, a small window pops up listing your
  installed browsers (and other compatible apps) so you can pick one.
  - **Keyboard-driven:** press a letter to jump straight to that app's assigned
    hotkey, use the Up/Down arrow keys to navigate, or press `Enter`/click to
    open.
  - **Modifier keys:** hold `⌥ Option` while opening an app to launch it in the
    background; hold `⇧ Shift` to open the link in that browser's
    private/incognito mode (where supported).
  - **Copy instead of open:** press `⌘ C`, or click the URL shown at the bottom
    of the picker, to copy the link to your clipboard instead of opening it.
  - Press `Esc` at any time to dismiss the picker without opening anything.
- **Broad App Support** — Ships with a large built-in list of browsers and
  browser-like apps (Safari, Chrome, Firefox, Arc, Brave, Edge, Opera, Vivaldi,
  and dozens more), including apps that use custom URL schemes rather than
  `http(s)://` (e.g. Discord). See [`src/config/apps.ts`](src/config/apps.ts)
  for the full, up-to-date list.
- **Customizable App List** — In the **Apps** pane, drag and drop installed apps
  to reorder them and assign a single-key hotkey to each one for instant,
  keyboard-only routing.
- **Auto-Updating** — Checks for new releases via
  [`update.electronjs.org`](https://update.electronjs.org) and lets you download
  and install updates from the **General** pane.
- **Native macOS UI** — A clean, native-feeling preferences window (General /
  Apps / Redirects / About tabs) with automatic light/dark mode support.
- **Privacy-Respecting** — BrowserDirect does not collect or transmit any of
  your data or browsing activity. The only outbound network call it makes is to
  check for app updates. See [`guide/privacy.md`](guide/privacy.md) for details.

## How It Works

1. BrowserDirect registers itself as the default handler for `http`/`https`
   links (and the `file` protocol, for local HTML files).
2. When a link is opened outside of a browser, macOS hands it to BrowserDirect
   instead of opening a browser directly.
3. BrowserDirect checks the link against your configured **Redirects** rules, in
   order:
   - If a rule matches, the link opens immediately in that rule's target app.
   - If nothing matches, the picker window appears so you can choose an app
     manually.

## Installation

### Download a prebuilt release

Prebuilt, unsigned `.dmg` installers (for both Apple Silicon and Intel Macs) are
published automatically to the
[Releases](https://github.com/nirmal-mewada/browser-direct/releases) page
whenever a change lands on `main`. Since the app isn't signed/notarized, macOS
Gatekeeper will flag it on first launch — right-click (or Control-click) the app
in `/Applications` and choose **Open** to bypass the warning once.

### Build from source

See [`guide/setting-up-for-development.md`](guide/setting-up-for-development.md)
for full instructions. In short:

```sh
git clone git@github.com:nirmal-mewada/browser-direct.git
cd browser-direct
npm i
npm start        # run in dev mode
npm run package  # build an unpacked .app for local testing
npm run make     # build a distributable .dmg/.zip
```

## Getting Started

1. Launch BrowserDirect and open **Preferences → General**, then click **Set As
   Default Browser**. macOS will ask you to confirm.
2. Click **Rescan** on the same pane any time you install or remove a compatible
   browser/app, so BrowserDirect picks up the change.
3. In the **Apps** pane, drag to reorder your browsers and click into an app's
   key field to assign it a single-letter hotkey.
4. In the **Redirects** pane, add rules for domains you always want to open in a
   specific browser (e.g. work sites in one profile, personal browsing in
   another).
5. Click any link outside of a browser to see the picker in action, or watch a
   matching link auto-route silently if you've set up a rule for it.

## Keyboard Shortcuts (Picker Window)

| Key                       | Action                                                 |
| ------------------------- | ------------------------------------------------------ |
| Letter key                | Open the app assigned to that hotkey                   |
| `⌥ Option` + letter/click | Open the app in the background                         |
| `⇧ Shift` + letter/click  | Open the link in private/incognito mode (if supported) |
| `↑` / `↓`                 | Move focus between apps in the list                    |
| `Enter`                   | Open the focused app                                   |
| `⌘ C`                     | Copy the current URL to the clipboard                  |
| `Esc`                     | Dismiss the picker                                     |

## Development

This repo uses [Electron Forge](https://www.electronforge.io/) with Vite. Useful
scripts (see [`package.json`](package.json) for the full list):

| Script              | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `npm start`         | Run the app in development mode               |
| `npm test`          | Run the Jest test suite                       |
| `npm run lint`      | Lint with ESLint                              |
| `npm run typecheck` | Type-check with `tsc`                         |
| `npm run doctor`    | Run lint + typecheck + test together          |
| `npm run package`   | Build an unpacked `.app` (both architectures) |
| `npm run make`      | Build distributable `.dmg`/`.zip` artifacts   |

Additional guides live in the [`guide`](guide) directory, covering
[adding support for a new browser/app](guide/supporting-a-browser-or-app.md),
[creating the app icon](guide/creating-app-icon.md), and
[publishing a release](guide/publishing.md).

Contributions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Privacy

BrowserDirect does not collect, store, or transmit any of your browsing data.
The only outgoing network call it makes is to check for app updates. Full
details: [`guide/privacy.md`](guide/privacy.md).

## License

[GPL-3.0-only](LICENSE.md)

---

## Attribution

BrowserDirect was adapted from the excellent, now-retired
[Browserosaurus](https://github.com/will-stone/browserosaurus) project created
by [Will Stone](https://github.com/will-stone). Since the original project is
retired, BrowserDirect is maintained locally as a customized tool.
