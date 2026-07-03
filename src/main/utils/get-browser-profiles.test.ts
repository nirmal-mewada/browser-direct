/* eslint-disable camelcase -- Chromium's "Local State" file uses snake_case keys */
import { parseLocalState } from './get-browser-profiles.js'

describe('parseLocalState', () => {
  it('should extract profiles sorted by display name', () => {
    const localState = {
      profile: {
        info_cache: {
          Default: { name: 'Personal' },
          'Profile 1': { name: 'Client A' },
          'Profile 2': { name: 'Work' },
        },
      },
    }

    expect(parseLocalState(localState)).toStrictEqual([
      { directory: 'Profile 1', name: 'Client A' },
      { directory: 'Default', name: 'Personal' },
      { directory: 'Profile 2', name: 'Work' },
    ])
  })

  it('should ignore guest and system profiles', () => {
    const localState = {
      profile: {
        info_cache: {
          'Default': { name: 'Personal' },
          'Guest Profile': { name: 'Guest' },
          'System Profile': { name: 'System' },
        },
      },
    }

    expect(parseLocalState(localState)).toStrictEqual([
      { directory: 'Default', name: 'Personal' },
    ])
  })

  it('should fall back to the directory when a profile has no name', () => {
    const localState = {
      profile: {
        info_cache: {
          'Profile 3': {},
        },
      },
    }

    expect(parseLocalState(localState)).toStrictEqual([
      { directory: 'Profile 3', name: 'Profile 3' },
    ])
  })

  it('should return an empty list for malformed input', () => {
    expect(parseLocalState(null)).toStrictEqual([])
    expect(parseLocalState('not-an-object')).toStrictEqual([])
    expect(parseLocalState({})).toStrictEqual([])
    expect(parseLocalState({ profile: {} })).toStrictEqual([])
  })
})
