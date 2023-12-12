// ** React Imports
import { ElementType, Fragment, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Util Imports
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { handleURLQueries } from 'src/@core/layouts/utils'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import LoginRequiredModal from '@src/@core/components/common-modal/login-modal'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<
  ListItemProps & {
    component?: ElementType
    href: string
    target?: '_blank' | undefined
  }
>(({ theme }) => ({
  width: 'auto',
  paddingTop: theme.spacing(2.25),
  color: theme.palette.text.primary,
  paddingBottom: theme.spacing(2.25),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.active, &.active:hover': {
    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
  },
  '&.active .MuiTypography-root, &.active .MuiListItemIcon-root': {
    color: theme.palette.primary.main,
  },
  '&:focus-visible': {
    outline: 0,
    backgroundColor: theme.palette.action.focus,
  },
}))

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props
  const { openModal, closeModal } = useModal()
  const user = useRecoilValueLoadable(authState)

  // ** Hook & Vars
  const router = useRouter()
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const icon = item.icon ? item.icon : navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment
  const ability = useContext(AbilityContext)

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper
        {...(!hasParent
          ? {
              component: 'div',
              sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 },
            }
          : {})}
      >
        <ListItem
          component={Link}
          disabled={item.disabled}
          {...(item.disabled && { tabIndex: -1 })}
          className={clsx({ active: isNavLinkActive() })}
          target={item.openInNewTab ? '_blank' : undefined}
          href={item.path === undefined ? '/' : `${item.path}`}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            } else if (!(ability && ability.can(item?.action, item?.subject))) {
              if (!user.getValue().user) {
                e.preventDefault()
                e.stopPropagation()
                openModal({
                  type: 'LoginRequiredModal',
                  children: (
                    <LoginRequiredModal
                      onClose={() => closeModal('LoginRequiredModal')}
                      onClick={() => closeModal('LoginRequiredModal')}
                    />
                  ),
                })
              }
            }
          }}
          sx={{
            ...(item.disabled
              ? { pointerEvents: 'none' }
              : { cursor: 'pointer' }),
            ...(!hasParent
              ? {
                  borderRadius: '8px',
                  '&.active, &.active:hover': {
                    backgroundColor: 'primary.main',
                    '&:focus-visible': { backgroundColor: 'primary.dark' },
                    '& .MuiTypography-root, & .MuiListItemIcon-root': {
                      color: 'common.white',
                    },
                  },
                }
              : {
                  '&.active, &.active:hover': {
                    '&:focus-visible': {
                      backgroundColor: theme =>
                        hexToRGBA(theme.palette.primary.main, 0.24),
                    },
                  },
                }),
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' }),
              }}
            >
              <ListItemIcon
                sx={{ mr: hasParent ? 3 : 2.5, color: 'text.primary' }}
              >
                <UserIcon
                  icon={icon}
                  fontSize={icon === navSubItemIcon ? '0.5rem' : '1.5rem'}
                />
              </ListItemIcon>
              <Typography {...(menuTextTruncate && { noWrap: true })}>
                <Translations text={item.title} />
              </Typography>
            </Box>
            {item.badgeContent ? (
              <Chip
                size='small'
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  ml: 1.5,
                  '& .MuiChip-label': {
                    px: 2.5,
                    lineHeight: 1.385,
                    textTransform: 'capitalize',
                  },
                }}
              />
            ) : null}
          </Box>
        </ListItem>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
