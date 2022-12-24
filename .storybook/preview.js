import '../styles/globals.css'

import * as NextImage from 'next/image'

import StorybookTheme from 'src/@core/theme/StorybookTheme'
const theme = {
  themeColor: '#666CFF',
  mode: 'light',
  skin: 'default',
  footer: 'static',
  layout: 'vertical',
  lastLayout: 'vertical',
  direction: 'ltr',
  navHidden: false,
  appBarBlur: true,
  navCollapsed: false,
  contentWidth: 'boxed',
  toastPosition: 'top-right',
  verticalNavToggleType: 'accordion',
  appBar: 'fixed',
}

export const withMuiTheme = Story => (
  <StorybookTheme settings={theme}>
    {/* <ThemeProvider theme={darkTheme}> */}
    {/* <CssBaseline /> */}
    <Story />
    {/* </ThemeProvider> */}
  </StorybookTheme>
)

export const decorators = [withMuiTheme]

const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized />,
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true, // Adds the description and default columns
    matchers: {
      // color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
