import '../styles/globals.css'

import * as NextImage from 'next/image'
import ModalProvider from 'src/context/ModalContext'
import StorybookTheme from 'src/@core/theme/StorybookTheme'

import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'
import { Toaster } from 'react-hot-toast'

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
    <ModalProvider selector='modal'>
      <div id='modal'></div>
      <Story />
    </ModalProvider>
    <ReactHotToast>
      <Toaster
        position={theme.toastPosition}
        toastOptions={{ className: 'react-hot-toast' }}
      />
    </ReactHotToast>
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
      // color: /(background|color)$/i, => color라는 이름의 prop이 있으면 자동으로 color picker를 보여주는 옵션인데, invalid한 코드가 들어가면 에러가 나므로 주석처리
      date: /Date$/,
    },
  },
}
