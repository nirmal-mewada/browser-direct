# BrowserDirect

BrowserDirect is an open-source browser prompter and direct router for macOS. It works by setting itself as the default web browser. Any clicked links in non-browser apps are sent to BrowserDirect, where you can either:
1. Automatically redirect to a specific browser based on custom wildcard/substring rules.
2. Choose from a visual pop-up menu of your installed browsers if no auto-routing rules match.

## Features
* **Auto-Routing Rules:** Configure patterns like `*github.com*` to open automatically in Safari, or `localhost:*` in Google Chrome, bypassing the picker entirely.
* **Mac App Integration:** Support for hotkeys and custom URL schemes.
* **Clean & Modern UI:** Sleek macOS preferences window with native dark mode support.

## Installation & Development
See the guide files in the `guide` directory for detailed instructions on compiling, configuring, and packaging the application locally.

---

## Attribution

BrowserDirect was adapted from the excellent, now-retired [Browserosaurus](https://github.com/will-stone/browserosaurus) project created by [Will Stone](https://github.com/will-stone). Since the original project is retired, BrowserDirect is maintained locally as a customized tool.
