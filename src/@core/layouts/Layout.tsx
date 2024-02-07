// ** React Import
import { useEffect, useRef } from 'react'

// ** Type Import
import { LayoutProps } from '@src/@core/layouts/types'

// ** Layout Components
import HorizontalLayout from './HorizontalLayout'

const Layout = (props: LayoutProps) => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props
  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)

  useEffect(() => {
    if (hidden) {
      if (settings.navCollapsed) {
        saveSettings({ ...settings, navCollapsed: false, layout: 'vertical' })
        isCollapsed.current = true
      }
    } else {
      if (isCollapsed.current) {
        saveSettings({
          ...settings,
          navCollapsed: true,
          layout: settings.lastLayout,
        })
        isCollapsed.current = false
      } else {
        if (settings.lastLayout !== settings.layout) {
          saveSettings({ ...settings, layout: settings.lastLayout })
        }
      }
    }
  }, [hidden])

  return <HorizontalLayout {...props}>{children}</HorizontalLayout>
}

export default Layout
