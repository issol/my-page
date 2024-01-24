// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from '@src/@core/context/settingsContext'

// ** Components
import UserDropdown from '@src/@core/layouts/components/shared-components/UserDropdown'

import NotificationDropdown from '@src/@core/layouts/components/shared-components/NotificationDropdown'
import { ShortcutsType } from '@src/@core/layouts/components/shared-components/ShortcutsDropdown'
import { useGetNotificationList } from '@src/queries/notification.query'
import { Suspense } from 'react'
import { useInfiniteQuery, useMutation } from 'react-query'
import { getNotificationList, markAsRead } from '@src/apis/notification.api'
import { Button, Typography } from '@mui/material'
import useModal from '@src/hooks/useModal'
import LoginRequiredModal from '@src/@core/components/common-modal/login-modal'
import { useRouter } from 'next/router'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
  publicPage?: boolean
}

// const notifications: NotificationsType[] = [
//   {
//     meta: 'Today',
//     avatarAlt: 'Flora',
//     title: 'Congratulation Flora! 🎉',
//     avatarImg: '/images/avatars/4.png',
//     subtitle: 'Won the monthly best seller badge',
//   },
//   {
//     meta: 'Yesterday',
//     avatarColor: 'primary',
//     subtitle: '5 hours ago',
//     avatarText: 'Robert Austin',
//     title: 'New user registered.',
//   },
//   {
//     meta: '11 Aug',
//     avatarAlt: 'message',
//     title: 'New message received 👋🏻',
//     avatarImg: '/images/avatars/5.png',
//     subtitle: 'You have 10 unread messages',
//   },
//   {
//     meta: '25 May',
//     title: 'Paypal',
//     avatarAlt: 'paypal',
//     subtitle: 'Received Payment',
//     avatarImg: '/images/misc/paypal.png',
//   },
//   {
//     meta: '19 Mar',
//     avatarAlt: 'order',
//     title: 'Received Order 📦',
//     avatarImg: '/images/avatars/3.png',
//     subtitle: 'New order received from John',
//   },
//   {
//     meta: '27 Dec',
//     avatarAlt: 'chart',
//     subtitle: '25 hrs ago',
//     avatarImg: '/images/misc/chart.png',
//     title: 'Finance report has been generated',
//   },
// ]

const shortcuts: ShortcutsType[] = [
  {
    title: 'Calendar',
    url: '/apps/calendar',
    subtitle: 'Appointments',
    icon: 'mdi:calendar-month-outline',
  },
  {
    title: 'Invoice App',
    url: '/apps/invoice/list',
    subtitle: 'Manage Accounts',
    icon: 'mdi:receipt-text-outline',
  },
  {
    title: 'Users',
    url: '/apps/user/list',
    subtitle: 'Manage Users',
    icon: 'mdi:account-outline',
  },
  {
    url: '/apps/roles',
    title: 'Role Management',
    subtitle: 'Permissions',
    icon: 'mdi:shield-check-outline',
  },
  {
    url: '/',
    title: 'Dashboard',
    icon: 'mdi:chart-pie',
    subtitle: 'User Dashboard',
  },
  {
    title: 'Settings',
    icon: 'mdi:cog-outline',
    subtitle: 'Account Settings',
    url: '/pages/account-settings/account',
  },
  {
    title: 'Help Center',
    subtitle: 'FAQs & Articles',
    icon: 'mdi:help-circle-outline',
    url: '/pages/help-center',
  },
  {
    title: 'Dialogs',
    subtitle: 'Useful Dialogs',
    icon: 'mdi:window-maximize',
    url: '/pages/dialog-examples',
  },
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, publicPage } = props
  const { openModal, closeModal } = useModal()
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {publicPage ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            sx={{ textDecoration: 'underline', color: '#666CFF' }}
            onClick={() =>
              openModal({
                type: 'LoginRequiredModal',
                children: (
                  <LoginRequiredModal
                    onClose={() => closeModal('LoginRequiredModal')}
                    onClick={() => closeModal('LoginRequiredModal')}
                    path={router.pathname ?? '/'}
                  />
                ),
              })
            }
          >
            Log in
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              router.push('/signup')
            }}
          >
            Sign up
          </Button>
        </Box>
      ) : (
        <Box>
          {!process.env.NEXT_PUBLIC_DISPLAY_MODE
            ? 'local'
            : process.env.NEXT_PUBLIC_DISPLAY_MODE === 'Development' ||
                process.env.NEXT_PUBLIC_DISPLAY_MODE === 'Test'
              ? process.env.NEXT_PUBLIC_DISPLAY_MODE
              : null}
          <UserDropdown settings={settings} />
        </Box>
      )}
    </Box>
  )
}

export default AppBarContent
