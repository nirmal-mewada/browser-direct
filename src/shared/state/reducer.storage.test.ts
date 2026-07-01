import {
  addedRedirectRule,
  removedRedirectRule,
} from '../../renderers/prefs/state/actions.js'
import type { Storage } from './reducer.storage.js'
import { defaultStorage, storage } from './reducer.storage.js'

describe('storage reducer - redirect rules', () => {
  it('should add a redirect rule with unique id', () => {
    const initialState: Storage = {
      ...defaultStorage,
      rules: [],
    }
    const action = addedRedirectRule({
      appName: 'Safari',
      id: 'rule-test-123',
      pattern: '*github.com*',
    })
    const nextState = storage(initialState, action)

    expect(nextState.rules).toHaveLength(1)
    expect(nextState.rules[0].pattern).toBe('*github.com*')
    expect(nextState.rules[0].appName).toBe('Safari')
    expect(nextState.rules[0].id).toBe('rule-test-123')
  })

  it('should remove a redirect rule by id', () => {
    const initialState: Storage = {
      ...defaultStorage,
      rules: [
        {
          appName: 'Google Chrome',
          id: 'rule-1',
          pattern: 'localhost',
        },
      ],
    }
    const action = removedRedirectRule({ id: 'rule-1' })
    const nextState = storage(initialState, action)

    expect(nextState.rules).toHaveLength(0)
  })
})
