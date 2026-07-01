import '../../../shared/preload'

import { fireEvent, render, screen } from '@testing-library/react'
import electron from 'electron'

import { receivedRendererStartupSignal } from '../../../../main/state/actions.js'
import { Channel } from '../../../../shared/state/channels.js'
import { defaultData } from '../../../../shared/state/reducer.data.js'
import Wrapper from '../_bootstrap.js'

const startupWithRules = (
  rules: { appName: string; id: string; pattern: string }[],
) =>
  receivedRendererStartupSignal({
    data: { ...defaultData, prefsTab: 'redirects' },
    storage: {
      apps: [
        { hotCode: null, isInstalled: true, name: 'Safari' },
        { hotCode: null, isInstalled: false, name: 'Firefox' },
      ],
      height: 200,
      isSetup: true,
      rules,
      supportMessage: -1,
    },
  } as never)

test('renders existing redirect rules', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(
    Channel.MAIN,
    startupWithRules([{ appName: 'Safari', id: '1', pattern: '*github.com*' }]),
  )

  expect(screen.getByText('*github.com*')).toBeVisible()
  expect(screen.getByRole('cell', { name: 'Safari' })).toBeVisible()
})

test('shows empty state when no rules configured', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(Channel.MAIN, startupWithRules([]))

  expect(
    screen.getByText(
      'No redirect rules configured. Links will default to the browser picker window.',
    ),
  ).toBeVisible()
})

test('allows adding a new redirect rule', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(Channel.MAIN, startupWithRules([]))

  fireEvent.change(
    screen.getByPlaceholderText('e.g. *github.com* or localhost:*'),
    { target: { value: '*localhost*' } },
  )
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'Safari' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Add Redirect Rule' }))

  expect(screen.getByText('*localhost*')).toBeVisible()
})

test('marks rules pointing at an uninstalled app', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(
    Channel.MAIN,
    startupWithRules([{ appName: 'Firefox', id: '1', pattern: 'localhost' }]),
  )

  expect(screen.getByText('Not Installed')).toBeVisible()
})

test('removes a redirect rule when Remove is clicked', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(
    Channel.MAIN,
    startupWithRules([{ appName: 'Safari', id: '1', pattern: '*github.com*' }]),
  )

  fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

  expect(screen.queryByText('*github.com*')).not.toBeInTheDocument()
})
