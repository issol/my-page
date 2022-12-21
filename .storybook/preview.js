import '../styles/globals.css'

import * as NextImage from 'next/image'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { darkTheme } from '../src/@core/theme/dark.theme'

/* snipped for brevity */

export const withMuiTheme = Story => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
)

export const decorators = [withMuiTheme]

const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized />
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true, // Adds the description and default columns
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}
