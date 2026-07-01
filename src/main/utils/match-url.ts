import type { RedirectRule } from '../../shared/state/reducer.storage.js'

export function matchUrl(
  url: string,
  rules: RedirectRule[],
): RedirectRule | undefined {
  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl) {
      return undefined
    }
  } catch {
    return undefined
  }

  const specialChars = new Set([
    '.',
    '+',
    '^',
    '$',
    '{',
    '}',
    '(',
    ')',
    '[',
    ']',
    '\\',
    '|',
    '?',
  ])

  for (const rule of rules) {
    const escaped = [...rule.pattern]
      .map((char) => (specialChars.has(char) ? `\\${char}` : char))
      .join('')
    const regexPattern = escaped.split('*').join('.*')
    const regex = new RegExp(regexPattern, 'iu')

    if (regex.test(url)) {
      return rule
    }
  }

  return undefined
}
