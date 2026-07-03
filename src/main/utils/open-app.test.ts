import type * as ChildProcess from 'node:child_process'
import { execFile } from 'node:child_process'

import { openApp } from './open-app.js'

jest.mock<Partial<typeof ChildProcess>>('node:child_process', () => ({
  execFile: jest.fn() as unknown as typeof execFile,
}))

const execFileMock = jest.mocked(execFile)

beforeEach(() => {
  execFileMock.mockClear()
})

describe('openApp', () => {
  it('should open an app plainly', () => {
    openApp('Google Chrome', 'https://example.com')

    expect(execFileMock).toHaveBeenCalledWith('open', [
      '-a',
      'Google Chrome',
      'https://example.com',
    ])
  })

  it('should open an app in the background', () => {
    openApp('Google Chrome', 'https://example.com', { background: true })

    expect(execFileMock).toHaveBeenCalledWith('open', [
      '-a',
      'Google Chrome',
      '--background',
      'https://example.com',
    ])
  })

  it('should open an app in private mode', () => {
    openApp('Google Chrome', 'https://example.com', { privateMode: true })

    expect(execFileMock).toHaveBeenCalledWith('open', [
      '-a',
      'Google Chrome',
      '--new',
      '--args',
      '--incognito',
      'https://example.com',
    ])
  })

  it('should open an app with a specific profile', () => {
    openApp('Google Chrome', 'https://example.com', { profile: 'Profile 1' })

    expect(execFileMock).toHaveBeenCalledWith('open', [
      '-a',
      'Google Chrome',
      '--new',
      '--args',
      '--profile-directory=Profile 1',
      'https://example.com',
    ])
  })

  it('should combine profile and private mode', () => {
    openApp('Brave Browser', 'https://example.com', {
      privateMode: true,
      profile: 'Default',
    })

    expect(execFileMock).toHaveBeenCalledWith('open', [
      '-a',
      'Brave Browser',
      '--new',
      '--args',
      '--profile-directory=Default',
      '--incognito',
      'https://example.com',
    ])
  })

  it('should ignore a profile for apps without profile support', () => {
    openApp('Safari', 'https://example.com', { profile: 'Profile 1' })

    expect(execFileMock).toHaveBeenCalledWith('open', [
      '-a',
      'Safari',
      'https://example.com',
    ])
  })
})
