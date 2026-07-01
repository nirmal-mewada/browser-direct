import type { RedirectRule } from '../../shared/state/reducer.storage.js'

export function matchPattern(urlStr: string, pattern: string): boolean {
  try {
    const parsedUrl = new URL(urlStr)
    const lowerPattern = pattern.toLowerCase()

    // 1. Substring domain/path matching (no wildcard)
    if (!lowerPattern.includes('*')) {
      const hostname = parsedUrl.hostname.toLowerCase()
      // If it's a domain-only pattern (no path or port components)
      if (!lowerPattern.includes('/') && !lowerPattern.includes(':')) {
        return (
          hostname === lowerPattern || hostname.endsWith(`.${lowerPattern}`)
        )
      }
      return urlStr.toLowerCase().includes(lowerPattern)
    }

    // 2. Wildcard (glob) matching
    const host = parsedUrl.host.toLowerCase()
    const hostname = parsedUrl.hostname.toLowerCase()
    const fullUrl = urlStr.toLowerCase()

    /* eslint-disable unicorn/prefer-string-replace-all, unicorn/prefer-string-raw */
    const escaped = lowerPattern
      .replace(/[$()+.[\\\]^{|}]/gu, '\\$&')
      .replace(/\*/gu, '.*')
    /* eslint-enable unicorn/prefer-string-replace-all, unicorn/prefer-string-raw */
    const regex = new RegExp(`^${escaped}$`, 'iu')

    return regex.test(host) || regex.test(hostname) || regex.test(fullUrl)
  } catch {
    return false
  }
}

export function matchUrl(
  url: string,
  rules: RedirectRule[],
): RedirectRule | undefined {
  return rules.find((rule) => matchPattern(url, rule.pattern))
}
