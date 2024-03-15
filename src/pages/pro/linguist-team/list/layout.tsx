import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'

import { v4 as uuidv4 } from 'uuid'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import languageHelper from '@src/shared/helpers/language.helper'
import { Icon } from '@iconify/react'
import { DataGrid } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getLinguistTeamColumns } from '@src/shared/const/columns/linguist-team'
import { useRouter } from 'next/router'
import { MenuType } from '..'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { InfiniteData } from 'react-query'
import LinguistTeamCardList from './card'
import LinguistTeamList from './list'
import { FilterType } from 'src/pages/pro/linguist-team/index'

type Props = {
  menu: MenuType
  setMenu: Dispatch<SetStateAction<MenuType>>
  serviceTypeList: Array<{
    value: number
    label: string
  }>
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  handleMenuClick: (event: React.MouseEvent<HTMLElement>) => void
  anchorEl: HTMLElement | null
  handleMenuClose: () => void
  clientList: {
    clientId: number
    name: string
  }[]
  activeFilter: FilterType
}

const LinguistTeamLayout = ({
  menu,
  setMenu,
  serviceTypeList,
  skip,
  pageSize,
  setSkip,
  setPageSize,
  handleMenuClick,
  anchorEl,
  handleMenuClose,
  clientList,
  activeFilter,
}: Props) => {
  const router = useRouter()
  const [ listCount, setListCount ] = useState<number>(0)

  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Linguist team ({listCount ? listCount.toLocaleString() : 0})
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
              }}
            >
              <Box>
                <IconButton
                  sx={{ width: '24px', height: '24px', padding: 0 }}
                  onClick={handleMenuClick}
                >
                  {menu === 'card' ? (
                    <Icon icon='carbon:grid' color='#8D8E9A' />
                  ) : (
                    <Icon icon='humbleicons:view-list' color='#8D8E9A' />
                  )}{' '}
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={anchorEl}
                  id='customized-menu'
                  onClose={handleMenuClose}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem
                    sx={{
                      gap: 2,
                      '&:hover': {
                        background: 'inherit',
                        cursor: 'default',
                      },
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      padding: 0,
                    }}
                  >
                    <Button
                      fullWidth
                      startIcon={<Icon icon='carbon:grid' color='#8D8E9A' />}
                      onClick={() => {
                        setMenu('card')
                        handleMenuClose()
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '6px 16px',
                        color: 'rgba(76, 78, 100, 0.87)',
                        borderRadius: 0,
                      }}
                    >
                      Card view
                    </Button>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      gap: 2,
                      '&:hover': {
                        background: 'inherit',
                        cursor: 'default',
                      },
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      padding: 0,
                    }}
                  >
                    <Button
                      startIcon={
                        <Icon icon='humbleicons:view-list' color='#8D8E9A' />
                      }
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '6px 16px',
                        color: 'rgba(76, 78, 100, 0.87)',
                        borderRadius: 0,
                      }}
                      onClick={() => {
                        setMenu('list')
                        handleMenuClose()
                      }}
                      // onClick={onClickDeleteButton}
                    >
                      List view
                    </Button>
                  </MenuItem>
                </Menu>
              </Box>
              <Button
                variant='contained'
                onClick={() => {
                  router.push('/pro/linguist-team/add-new')
                }}
              >
                Create new team
              </Button>
            </Box>
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>

      {menu === 'card' ? (
        <LinguistTeamCardList
          serviceTypeList={serviceTypeList}
          skip={skip}
          pageSize={pageSize}
          setSkip={setSkip}
          setPageSize={setPageSize}
          setListCount={setListCount}
          clientList={clientList}
          activeFilter={activeFilter}
        />
      ) : (
        <LinguistTeamList
          serviceTypeList={serviceTypeList}
          skip={skip}
          pageSize={pageSize}
          setSkip={setSkip}
          setPageSize={setPageSize}
          setListCount={setListCount}
          clientList={clientList}
          activeFilter={activeFilter}
        />
      )}
    </Card>
  )
}

export default LinguistTeamLayout
