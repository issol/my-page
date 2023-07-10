// ** React Imports
import {
  useState,
  SyntheticEvent,
  Fragment,
  ReactNode,
  useContext,
} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports

import { Settings } from 'src/@core/context/settingsContext'
import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import

import { NotificationType } from '@src/types/common/notification.type'
import { useRouter } from 'next/router'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { AuthContext } from '@src/context/AuthContext'
import { UseMutationResult } from 'react-query'

interface Props {
  settings: Settings
  notifications: Array<NotificationType>
  markAllAsReadMutation: UseMutationResult<void, unknown, number[], unknown>
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  '& .MuiMenu-list': {
    padding: 0,
  },
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344,
})

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
  width: 38,
  height: 38,
  fontSize: '1.125rem',
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75),
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

const ScrollWrapper = ({
  children,
  hidden,
}: {
  children: ReactNode
  hidden: boolean
}) => {
  if (hidden) {
    return (
      <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </Box>
    )
  } else {
    return (
      <PerfectScrollbar
        options={{ wheelPropagation: false, suppressScrollX: true }}
      >
        {children}
      </PerfectScrollbar>
    )
  }
}

const NotificationDropdown = (props: Props) => {
  // ** Props
  const { settings, notifications, markAllAsReadMutation } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const router = useRouter()
  const { user } = useContext(AuthContext)

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const onClickNotification = (id: number, url: string) => {
    // TODO id로 해당 notification read로 만들어주기
    router.push(url)
  }

  const onClickMarkAllAsRead = () => {
    const ids = notifications.map(item => item.id)
    markAllAsReadMutation.mutate(ids)
  }

  return (
    <Fragment>
      <IconButton
        color='inherit'
        aria-haspopup='true'
        onClick={handleDropdownOpen}
        aria-controls='customized-menu'
      >
        <Badge
          color='error'
          variant='dot'
          invisible={!notifications.length}
          sx={{
            '& .MuiBadge-badge': {
              top: 4,
              right: 4,
              boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
            },
          }}
        >
          <Icon icon='mdi:bell-outline' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'ltr' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'ltr' ? 'right' : 'left',
        }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Typography sx={{ cursor: 'text', fontWeight: 600 }}>
                Notifications
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label={`${notifications?.length}`}
                sx={{
                  height: 20,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: '10px',
                }}
              />
            </Box>
            <Box>
              <Button
                variant='contained'
                size='small'
                disabled={notifications.length === 0}
                onClick={onClickMarkAllAsRead}
              >
                Mark all as read
              </Button>
            </Box>
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {notifications &&
            notifications?.map(
              (notification: NotificationType, index: number) => (
                <MenuItem
                  key={index}
                  onClick={() =>
                    onClickNotification(
                      notification.id,
                      notification.connectedLink
                        ? notification.connectedLink
                        : '',
                    )
                  }
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src='/images/icons/quotes-icons/book.png'
                        width={48}
                        height={48}
                        alt="notification's icon"
                      />
                    </Box>
                    <Box
                      sx={{
                        mx: 4,
                        flex: '1 1',
                        display: 'flex',
                        overflow: 'hidden',
                        flexDirection: 'column',
                      }}
                    >
                      <MenuItemTitle>{notification.type}</MenuItemTitle>
                      <MenuItemSubtitle variant='body2'>
                        {FullDateTimezoneHelper(
                          notification.createdAt,
                          user?.timezone,
                        )}
                      </MenuItemSubtitle>
                    </Box>
                  </Box>
                </MenuItem>
              ),
            )}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            py: 3.5,
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Go to notification center
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
