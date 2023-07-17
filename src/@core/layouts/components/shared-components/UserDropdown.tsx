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
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { RoleType, UserRoleType } from 'src/context/types'

// ** hooks
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux'
import { Switch } from '@mui/material'
// import { setCurrentRole } from '@src/store/permission'
import { setCurrentRole, getCurrentRole } from 'src/shared/auth/storage'

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
  const dispatch = useAppDispatch()

  // ** redux
  const { role } = useAppSelector(state => state.userAccess)

  const auth = useAuth()

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

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
    if (role && hasTadAndLpm(role)) {
      const currentRole = getCurrentRole()
      if (currentRole?.name === 'TAD') setChecked(false)
      else if (currentRole?.name === 'LPM') setChecked(true)
      else setChecked(false)
    }
  }, [role])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    // 스위치가 바뀔때 Role을 세션 스토리지에 저장
    if (hasTadAndLpm(role)) {
      setCurrentRole(
        event.target.checked
          ? role.find(item => item.name === 'LPM')
          : role.find(item => item.name === 'TAD'),
      )
    }
    router.push('/home')
  }

  function hasTadAndLpm(role: UserRoleType[]): boolean {
    return (
      role.some(value => value.name === 'TAD') &&
      role.some(value => value.name === 'LPM')
    )
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary',
    },
  }

  const handleLogout = () => {
    logout()
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
                {auth?.user?.username?.includes('undefined')
                  ? 'anonymous'
                  : auth?.user?.username}
              </Typography>

              {role && hasTadAndLpm(role) ? (
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
                role?.map((value, index) => {
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
