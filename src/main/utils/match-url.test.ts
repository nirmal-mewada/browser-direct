import type { RedirectRule } from '../../shared/state/reducer.storage.js'
import { matchUrl } from './match-url.js'

describe('matchUrl', () => {
  const rules: RedirectRule[] = [
    { appName: 'Safari', id: '1', pattern: 'github.com' },
    { appName: 'Google Chrome', id: '2', pattern: '*google.com*' },
    { appName: 'Firefox', id: '3', pattern: 'localhost:*' },
  ]

  it('should match direct substring', () => {
    expect(matchUrl('https://github.com/will-stone', rules)).toStrictEqual(
      rules[0],
    )
  })

  it('should match wildcard pattern', () => {
    expect(matchUrl('https://news.google.com/feed', rules)).toStrictEqual(
      rules[1],
    )
  })

  it('should match wildcard port pattern', () => {
    expect(matchUrl('http://localhost:8080/dashboard', rules)).toStrictEqual(
      rules[2],
    )
  })

  it('should be case insensitive', () => {
    expect(matchUrl('HTTPS://GITHUB.COM/will-stone', rules)).toStrictEqual(
      rules[0],
    )
  })

  it('should return undefined if no match is found', () => {
    expect(matchUrl('https://microsoft.com', rules)).toBeUndefined()
  })

  it('should return undefined if rules list is empty', () => {
    expect(matchUrl('https://github.com', [])).toBeUndefined()
  })

  it('should return undefined for invalid URLs gracefully', () => {
    expect(matchUrl('not-a-valid-url', rules)).toBeUndefined()
  })
})
