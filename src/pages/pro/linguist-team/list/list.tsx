import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
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
import { Dispatch, SetStateAction } from 'react'

type Props = {
  data: {
    totalCount: number
    data: Array<LinguistTeamListType>
  }
  isLoading: boolean
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
}

const LinguistTeamList = ({
  data,
  menu,
  setMenu,
  serviceTypeList,
  isLoading,
  skip,
  pageSize,
  setSkip,
  setPageSize,
  handleMenuClick,
  anchorEl,
  handleMenuClose,
}: Props) => {
  const router = useRouter()

  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Linguist team ({data ? data.totalCount.toLocaleString() : 0})
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
        <>
          <Divider />
          <Grid sx={{ padding: '20px' }} container spacing={6} rowSpacing={4}>
            {data.data.length > 0 ? (
              data.data.map((item, index) => {
                return (
                  <Grid key={uuidv4()} item lg={3} md={4} xs={4}>
                    <Card>
                      <CardActionArea>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            padding: '20px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center',
                            }}
                          >
                            {item.isPrivate ? (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: 20,
                                  height: 20,
                                  borderRadius: '5px',
                                  background: '#F7F7F9',
                                }}
                              >
                                <Icon icon='mdi:lock' color='#8D8E9A' />
                              </Box>
                            ) : null}

                            <Typography color='#8D8E9A' fontSize={12}>
                              {item.corporationId}
                            </Typography>
                          </Box>

                          <Typography
                            color='#4C4E64'
                            fontSize={16}
                            fontWeight={600}
                          >
                            {item.name}
                          </Typography>
                          <Typography color='#666CFF' fontSize={14}>
                            {item.client}
                          </Typography>

                          <Box>
                            <ServiceTypeChip
                              label={
                                serviceTypeList.find(
                                  i => i.value === item.serviceTypeId,
                                )?.label || ''
                              }
                            />
                          </Box>
                          <Typography>
                            {languageHelper(item.sourceLanguage)} &rarr;{' '}
                            {languageHelper(item.targetLanguage)}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              mt: '8px',
                            }}
                          >
                            <AvatarGroup>
                              {item.pros.map((i, index) => {
                                if (index > 2) return null
                                return (
                                  <Avatar
                                    key={uuidv4()}
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      fontSize: 14,
                                      border: `2px solid ${item.isPrivate ? '#4C4E6461' : index === 0 ? '#FFA6A4' : index === 1 ? '#B9F094' : index === 2 ? '#FEDA94' : '#FFF'} !important`,
                                      background: item.isPrivate
                                        ? '#ECECEE'
                                        : '#FFF',
                                    }}
                                  >
                                    {item.isPrivate
                                      ? ''
                                      : i.firstName.charAt(0) +
                                        i.lastName.charAt(0)}
                                  </Avatar>
                                )
                              })}
                            </AvatarGroup>
                            {item.pros.length > 3 ? (
                              <Typography color='#8D8E9A' fontSize={14}>
                                +{item.pros.length - 3} linguists
                              </Typography>
                            ) : null}
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )
              })
            ) : (
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  minHeight: '439px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography color='#8D8E9A' fontSize={14}>
                  There are no linguist teams
                </Typography>
              </Box>
            )}
          </Grid>
        </>
      ) : (
        <Box
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => NoList('There are no linguist teams'),
              NoResultsOverlay: () => NoList('There are no linguist teams'),
            }}
            sx={{
              overflowX: 'scroll',
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
            columns={getLinguistTeamColumns(serviceTypeList)}
            rows={data.data ?? []}
            rowCount={data.totalCount ?? 0}
            loading={isLoading}
            rowsPerPageOptions={[10, 25, 50]}
            // onCellClick={params => {
            //   router.push(
            //     `/orders/job-list/job-template/form?mode=detail&id=${params.id}`,
            //   )
            // }}
            pagination
            page={skip}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={setSkip}
            disableSelectionOnClick
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Box>
      )}
    </Card>
  )
}

export default LinguistTeamList
