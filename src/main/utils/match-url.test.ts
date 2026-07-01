import type { RedirectRule } from '../../shared/state/reducer.storage.js'
import { matchPattern, matchUrl } from './match-url.js'

describe('matchPattern', () => {
  it('should match direct hostname exactly', () => {
    expect(matchPattern('https://github.com/will-stone', 'github.com')).toBe(
      true,
    )
  })

  it('should match subdomains for host patterns', () => {
    expect(
      matchPattern('https://sub.github.com/will-stone', 'github.com'),
    ).toBe(true)
  })

  it('should NOT match host suffixes (hijacking protection)', () => {
    expect(
      matchPattern('https://github.com.attacker.com/path', 'github.com'),
    ).toBe(false)
  })

  it('should NOT match unrelated prefixes', () => {
    expect(matchPattern('https://evilgithub.com/path', 'github.com')).toBe(
      false,
    )
  })

  it('should NOT match search queries / query parameters containing host string', () => {
    expect(
      matchPattern('https://google.com/search?q=github.com', 'github.com'),
    ).toBe(false)
  })

  it('should match wildcard pattern against full URL', () => {
    expect(
      matchPattern('https://news.google.com/feed', '*google.com*'),
    ).toBe(true)
  })

  it('should match wildcard port pattern against host', () => {
    expect(
      matchPattern('http://localhost:8080/dashboard', 'localhost:*'),
    ).toBe(true)
  })

  it('should be case insensitive', () => {
    expect(
      matchPattern('HTTPS://GITHUB.COM/will-stone', 'github.com'),
    ).toBe(true)
  })

  it('should handle invalid URLs gracefully', () => {
    expect(matchPattern('invalid-url-string', 'github.com')).toBe(false)
  })
})

describe('matchUrl', () => {
  const rules: RedirectRule[] = [
    { appName: 'Safari', id: '1', pattern: 'github.com' },
    { appName: 'Google Chrome', id: '2', pattern: '*google.com*' },
    { appName: 'Firefox', id: '3', pattern: 'localhost:*' },
  ]

  it('should return the first matching rule', () => {
    expect(matchUrl('https://github.com/will-stone', rules)).toStrictEqual(
      rules[0],
    )
  })

  it('should return undefined when no rules match', () => {
    expect(matchUrl('https://microsoft.com', rules)).toBeUndefined()
  })

  it('should return undefined for empty rules list', () => {
    expect(matchUrl('https://github.com', [])).toBeUndefined()
  })
})
