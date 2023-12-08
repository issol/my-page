import { GridItem } from '@src/views/dashboard/dashboardItem'
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import { PermissionChip } from '@src/@core/components/chips/chips'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import Switch from '@mui/material/Switch'
import ChartDateHeader from '@src/views/dashboard/chartDateHeader'
import Button from '@mui/material/Button'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DownloadIcon from '@mui/icons-material/Download'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { LogoutOutlined } from '@mui/icons-material'
import React, { MouseEvent, useEffect, useState } from 'react'
import { DashboardForm } from '@src/pages/dashboards/lpm'
import { DEFAULT_QUERY_NAME } from '@src/queries/dashboard/dashnaord-lpm'
import { useQueryClient } from 'react-query'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import { dashboardState } from '@src/states/dashboard'
import { authState } from '@src/states/auth'
import { currentRoleSelector } from '@src/states/permission'
import MemberSearchList from '@src/views/dashboard/member-search'

interface SwitchTypeHeaderProps {
  isShowMemberView: boolean
  hiddenMemberView: () => void
  showMemberView: () => void
}

const SwitchTypeHeader = ({
  isShowMemberView,
  showMemberView,
  hiddenMemberView,
}: SwitchTypeHeaderProps) => {
  const queryClient = useQueryClient()

  const { contents: auth, state: authFetchState } =
    useRecoilValueLoadable(authState)
  const { contents: role, state: roleFetchState } =
    useRecoilValueLoadable(currentRoleSelector)

  const { control, setValue } = useFormContext<DashboardForm>()
  const [viewSwitch, dateRange, selectedRangeDate, userViewDate] = useWatch({
    control,
    name: ['viewSwitch', 'dateRange', 'selectedRangeDate', 'userViewDate'],
  })

  const [dashboardStateValue, setDashboardState] =
    useRecoilState(dashboardState)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isOpenMemberDialog, setIsOpenMemberDialog] = useState(false)

  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChangeViewMode = async (val: boolean) => {
    if (val) {
      setDashboardState({ ...dashboardStateValue, view: 'personal' })
    } else {
      setDashboardState({ ...dashboardStateValue, view: 'company' })
    }
    await queryClient.invalidateQueries({
      queryKey: [DEFAULT_QUERY_NAME],
    })
  }

  const onChangeMemberView = () => {
    setIsOpenMemberDialog(true)
    handleClose()
  }

  const onChangeMyDashboard = async () => {
    handleClose()
    setDashboardState({
      ...dashboardStateValue,
      userId: auth?.user?.id || null || dashboardStateValue.userId,
      userInfo: undefined,
    })

    await queryClient.invalidateQueries(DEFAULT_QUERY_NAME)
  }

  const isPermissionMemberView = () => {
    if (role?.name !== 'LPM') return false
    return role?.type === 'Master' || role?.type === 'Manager'
  }

  useEffect(() => {
    if (authFetchState !== 'hasValue' || roleFetchState !== 'hasValue') return

    if (role?.type === 'Master' || role?.type === 'Manager') {
      setDashboardState({
        view: 'company',
        userId: auth?.user?.id || null,
        role: role?.type,
      })
      setValue('view', 'company')
      setValue('viewSwitch', false)
    } else {
      setDashboardState({
        view: 'personal',
        userId: auth?.user?.id || null,
        role: role?.type,
      })
      setValue('view', 'personal')
      setValue('viewSwitch', true)
    }
  }, [])

  useEffect(() => {
    if (dashboardStateValue.userInfo) {
      showMemberView()
      return
    }

    hiddenMemberView()
  }, [dashboardStateValue.userInfo])

  return (
    <>
      {isShowMemberView ? (
        <GridItem width={420} height={76}>
          <Box sx={{ width: '100%' }}>
            <Box display='flex' gap='16px' alignItems='center'>
              <Typography fontSize='24px' fontWeight={500}>
                {`${dashboardStateValue.userInfo?.firstName}`}
                {dashboardStateValue.userInfo?.middleName &&
                  `(${dashboardStateValue.userInfo?.middleName})`}{' '}
                {dashboardStateValue.userInfo?.lastName}
              </Typography>
              {PermissionChip(dashboardStateValue.userInfo?.type || 'General')}
            </Box>
            <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
              {`${dashboardStateValue.userInfo?.department || '-'} | ${
                dashboardStateValue.userInfo?.jobTitle || '-'
              }`}
            </Typography>
          </Box>
        </GridItem>
      ) : (
        <GridItem width={290} height={76}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color:
                  dashboardStateValue.view === 'company'
                    ? 'rgba(102, 108, 255, 1)'
                    : 'rgba(189, 189, 189, 1)',
              }}
            >
              Company view
            </Typography>
            <div style={{ width: '40px' }}>
              <Controller
                control={control}
                name='viewSwitch'
                defaultValue={viewSwitch}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    size='small'
                    inputProps={{ 'aria-label': 'controlled' }}
                    checked={value}
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
                    onChange={(event, val) => {
                      onChange(val)
                      onChangeViewMode(val)
                    }}
                  />
                )}
              />
            </div>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color:
                  dashboardStateValue.view === 'personal'
                    ? 'rgba(102, 108, 255, 1)'
                    : 'rgba(189, 189, 189, 1)',
              }}
            >
              Personal view
            </Typography>
          </Box>
        </GridItem>
      )}
      <ChartDateHeader />
      <GridItem width={76} height={76}>
        <Box>
          <Button onClick={handleClick}>
            <MoreVertIcon
              sx={{ width: '36px', color: 'rgba(76, 78, 100, 0.54)' }}
            />
          </Button>
          <Menu
            id='dashboard-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem
              onClick={handleClose}
              sx={{
                color: 'rgba(76, 78, 100, 0.87)',
              }}
            >
              <ListItemIcon
                sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
              >
                <DownloadIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Download csv</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => onChangeMemberView()}
              sx={{
                display: isPermissionMemberView() ? 'flex' : 'none',
                color: 'rgba(76, 78, 100, 0.87)',
              }}
            >
              <ListItemIcon
                sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
              >
                <RemoveRedEyeIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>
                {isShowMemberView ? 'Change Member' : 'View member dashboard'}
              </ListItemText>
            </MenuItem>
            {isShowMemberView && (
              <MenuItem
                onClick={() => onChangeMyDashboard()}
                sx={{
                  display: 'flex',
                  color: 'rgba(76, 78, 100, 0.87)',
                }}
              >
                <ListItemIcon
                  sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
                >
                  <LogoutOutlined fontSize='small' />
                </ListItemIcon>
                <ListItemText>Back to my dashboard</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </GridItem>
      <MemberSearchList
        open={isOpenMemberDialog}
        onClose={() => setIsOpenMemberDialog(false)}
      />
    </>
  )
}

export default SwitchTypeHeader
