// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { RoleType, UserRoleType } from 'src/context/types'

// ** hooks
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux'
import { Switch } from '@mui/material'

import { getCurrentRole } from 'src/shared/auth/storage'
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'

import { authState } from '@src/states/auth'
import useAuth from '@src/hooks/useAuth'
import {
  currentRoleSelector,
  roleSelector,
  roleState,
} from '@src/states/permission'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props
  const [checked, setChecked] = useState<boolean>(false)
  const [currentRole, setCurrentRole] =
    useRecoilStateLoadable(currentRoleSelector)
  const role = useRecoilValueLoadable(roleState)

  // ** redux

  const user = useRecoilValueLoadable(authState)

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const auth = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  useEffect(() => {
    if (role.state === 'hasValue' && hasTadAndLpm(role.getValue())) {
      if (
        currentRole.state === 'hasValue' &&
        currentRole.getValue()?.name === 'TAD'
      )
        setChecked(false)
      else if (
        currentRole.state === 'hasValue' &&
        currentRole.getValue()?.name === 'LPM'
      )
        setChecked(true)
      else setChecked(false)
    }
  }, [role])

  const hasTadAndLpm = (role: UserRoleType[]): boolean => {
    return (
      role.some(value => value.name === 'TAD') &&
      role.some(value => value.name === 'LPM')
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)

    // 스위치가 바뀔때 Role을 세션 스토리지에 저장
    if (role.state !== 'hasValue' && !hasTadAndLpm(role.getValue())) return

    const switchedRole: UserRoleType | undefined = event.target.checked
      ? role.getValue().find(item => item.name === 'LPM')
      : role.getValue().find(item => item.name === 'TAD')

    setCurrentRole(switchedRole!)

    if (switchedRole?.name === 'TAD') {
      router.push('/dashboards/tad')
      return
    }

    router.push('/dashboards/lpm')
  }

  const handleLogout = async () => {
    await auth.logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Avatar
          alt={''}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={'/images/avatars/1.png'}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction === 'ltr' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'ltr' ? 'right' : 'left',
        }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Avatar
                alt='John Doe'
                src='/images/avatars/1.png'
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box
              sx={{
                display: 'flex',
                ml: 3,
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {user.state === 'hasValue' &&
                user.getValue().user?.username?.includes('undefined')
                  ? 'anonymous'
                  : user.getValue().user?.username}
              </Typography>

              {role.state === 'hasValue' && hasTadAndLpm(role.getValue()) ? (
                <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <Typography
                    fontSize={14}
                    fontWeight={checked ? 400 : 600}
                    color={checked ? '#BDBDBD' : '#666CFF'}
                  >
                    TAD
                  </Typography>
                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                    sx={{
                      '.MuiSwitch-switchBase:not(.Mui-checked)': {
                        color: '#666CFF',
                        '.MuiSwitch-thumb': {
                          color: '#666CFF',
                        },
                      },
                      '.MuiSwitch-track': {
                        backgroundColor: '#666CFF',
                      },
                    }}
                  />
                  <Typography
                    fontSize={14}
                    fontWeight={checked ? 600 : 400}
                    color={checked ? '#666CFF' : '#BDBDBD'}
                  >
                    LPM
                  </Typography>
                </Box>
              ) : (
                role.getValue()?.map((value, index) => {
                  return (
                    <Typography
                      key={index}
                      variant='body2'
                      sx={{
                        fontSize: '0.8rem',
                        color: 'text.disabled',
                        display: 'flex',
                        gap: '4px',
                      }}
                    >
                      {value?.name}
                    </Typography>
                  )
                })
              )}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        {role && (
          <MenuItem
            onClick={() => {
              router.push('/company/my-account')
              handleDropdownClose()
            }}
            sx={{
              py: 2,
              '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' },
            }}
          >
            <Icon icon='mdi:account-cog' />
            My Account
          </MenuItem>
        )}
        <Divider sx={{ mt: '10px !important' }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 2,
            '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' },
          }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
