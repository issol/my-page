import { useContext, useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { styled } from '@mui/system'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import {
  TableTitleTypography,
  TitleTypography,
} from '@src/@core/styles/typography'

// ** contexts
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** apis
import { useGetJobsTrackerDetail } from '@src/queries/jobs/jobs.query'
import { updateIsDelivered } from '@src/apis/jobs/jobs.api'
import { useMutation, useQueryClient } from 'react-query'

// ** helpers
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import languageHelper from '@src/shared/helpers/language.helper'

// ** types
import { JobsTrackerDetailType } from '@src/types/jobs/jobs.type'

// ** NextJS
import { useRouter } from 'next/router'
import Link from 'next/link'

// ** etc
import { toast } from 'react-hot-toast'
import { job_list } from '@src/shared/const/permission-class'
import { timezoneSelector } from '@src/states/permission'

export type DetailFilterType = {
  workName: string
  isMyJobs: boolean
  isDelivered: boolean
  isDueDatePast: boolean
  isAwaiting: boolean
  skip: number
  take: number
}

export type DetailFilterResponseType = {
  workName: string
  isMyJobs: '0' | '1'
  isDelivered: '0' | '1'
  isDueDatePast: '0' | '1'
  isAwaiting: '0' | '1'
  skip: number
  take: number
}

export const initialFilter: DetailFilterType = {
  workName: '',
  isMyJobs: false,
  isDelivered: true,
  isDueDatePast: true,
  isAwaiting: true,
  skip: 0,
  take: 10,
}

// ** TODO : api들 엔드포인트 교체
// status아이콘 추가
export default function JobTrackerDetail() {
  const router = useRouter()
  const workName = router.query.workName

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const ability = useContext(AbilityContext)

  const User = new job_list(auth.getValue().user?.id!)
  const isUpdatable = ability.can('update', User)

  const queryClient = useQueryClient()

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<DetailFilterType>({ ...initialFilter })

  const { data: list, isLoading } = useGetJobsTrackerDetail({
    workName: workName! as string,
    take: pageSize,
    skip: skip * pageSize,
    isMyJobs: filter.isMyJobs ? '1' : '0',
    isDelivered: filter.isDelivered ? '1' : '0',
    isDueDatePast: filter.isDueDatePast ? '1' : '0',
    isAwaiting: filter.isAwaiting ? '1' : '0',
  })

  const updateIsDeliveredMutation = useMutation(
    (data: { isDelivered: boolean; trackerId: number }) =>
      updateIsDelivered(data.isDelivered, data.trackerId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`jobTrackerDetail`)
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  type CellType = {
    row: JobsTrackerDetailType
  }

  const columns: GridColumns<JobsTrackerDetailType> = [
    {
      field: 'isDelivered',
      flex: 0.05,
      minWidth: 90,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>Delivered</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Checkbox
            size='medium'
            disabled={!isUpdatable}
            onChange={e =>
              updateIsDeliveredMutation.mutate({
                isDelivered: e.target.checked,
                trackerId: row.id,
              })
            }
            checked={row.isDelivered}
            color='success'
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />
        )
      },
    },
    {
      flex: 0.05,
      minWidth: 150,
      field: 'name',
      headerName: 'Job name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job name</Box>,
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'itemDueDate',
      headerName: 'Item due date',
      headerClassName: 'sky-blue-header',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Item due date</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={convertTimeToTimezone(
              row?.itemDueDate,
              auth.getValue().user?.timezone?.code!,
              timezone.getValue(),
            )}
          >
            <div>
              {convertTimeToTimezone(
                row?.itemDueDate,
                auth.getValue().user?.timezone?.code!,
                timezone.getValue(),
              )}
            </div>
          </Tooltip>
        )
      },
    },

    {
      flex: 0.08,
      minWidth: 190,
      field: 'contactPerson',
      headerClassName: 'sky-blue-header',
      headerName: 'Contact person for job',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Contact person for job</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography display='flex' alignItems='center' gap='8px'>
            {row?.contactPerson?.name ?? '-'}
          </Typography>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'jobDueDate',
      headerClassName: 'light-orange-header',
      headerName: 'Job due date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Job due date</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={convertTimeToTimezone(
              row?.jobDueDate,
              auth.getValue().user?.timezone?.code!,
              timezone.getValue(),
            )}
          >
            <div style={{ overflow: 'scroll' }}>
              {convertTimeToTimezone(
                row?.jobDueDate,
                auth.getValue().user?.timezone?.code!,
                timezone.getValue(),
              )}
            </div>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'assignedPro',
      headerClassName: 'light-orange-header',
      headerName: 'Assigned Pro',
      disableColumnMenu: true,
      renderHeader: () => <Box>Assigned Pro</Box>,
      renderCell: ({ row }: CellType) => {
        return row.assignedPro ? (
          <Box maxWidth='100%' display='flex' alignItems='center' gap='12px'>
            <Box width='32px' height='32px'>
              <img
                alt=''
                aria-hidden
                src={
                  row?.assignedPro?.isOnboarded && row?.assignedPro?.isActive
                    ? `/images/icons/onboarding-icons/pro-active.png`
                    : !row?.assignedPro?.isOnboarded
                      ? `/images/icons/onboarding-icons/pro-onboarding.png`
                      : row?.assignedPro?.isOnboarded &&
                          !row?.assignedPro?.isActive
                        ? `/images/icons/onboarding-icons/pro-inactive.png`
                        : ''
                }
              />
            </Box>

            <Box overflow='hidden'>
              <Link
                href={`/onboarding/detail/${row.assignedPro.id}`}
                style={{ textDecoration: 'none' }}
              >
                <TitleTypography fontWeight={600}>
                  {row.assignedPro.name}
                </TitleTypography>
              </Link>
              <TableTitleTypography variant='body2'>
                {row.assignedPro.email}
              </TableTitleTypography>
            </Box>
          </Box>
        ) : null
      },
    },
    {
      flex: 0.05,
      minWidth: 150,
      field: 'serviceType',
      headerName: 'Job',
      disableColumnMenu: true,
      renderHeader: () => <Box>Job</Box>,
      renderCell: ({ row }: CellType) => {
        return <ServiceTypeChip label={row.serviceType} size='small' />
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'source, target',
      headerName: 'Language pair',
      disableColumnMenu: true,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: CellType) => (
        <Typography>
          {languageHelper(row.source)} &rarr; {languageHelper(row.target)}
        </Typography>
      ),
    },
  ]

  function NoList() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>There are no jobs</Typography>
      </Box>
    )
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader>
          <IconButton
            onClick={() =>
              router.push({
                pathname: '/orders/job-list',
                query: { menu: 'tracker' },
              })
            }
          >
            <Icon icon='material-symbols:arrow-back-ios-new' />
          </IconButton>
          <img src='/images/icons/etc/folder-icon.png' aria-hidden alt='' />
          <Typography sx={{ paddingLeft: '8px' }} variant='h5'>
            {workName ?? '-'}
          </Typography>
        </PageHeader>
      </Grid>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          gap='4px'
          justifyContent='flex-end'
        >
          <Typography>See only my jobs</Typography>
          <Switch
            checked={filter.isMyJobs}
            onChange={e =>
              setFilter({
                ...filter,
                isMyJobs: e.target.checked,
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>
                  Jobs ({list?.totalCount ?? 0})
                </Typography>{' '}
                <Box display='flex' alignItems='center' gap='18px'>
                  <FormControlLabel
                    label={
                      <Box display='flex' alignItems='center' gap='4px'>
                        <IconButton
                          color='success'
                          sx={{ cursor: 'default', padding: 0 }}
                        >
                          <Icon icon='mdi:clock-outline' />
                        </IconButton>
                        Delivered
                      </Box>
                    }
                    checked={filter.isDelivered}
                    control={
                      <Checkbox
                        name='isDelivered'
                        onChange={e =>
                          setFilter({
                            ...filter,
                            isDelivered: e.target.checked,
                          })
                        }
                      />
                    }
                  />

                  <FormControlLabel
                    label={
                      <Box display='flex' alignItems='center' gap='4px'>
                        <IconButton
                          color='error'
                          sx={{ cursor: 'default', padding: 0 }}
                        >
                          <Icon icon='mdi:clock-outline' />
                        </IconButton>
                        Past job due date
                      </Box>
                    }
                    checked={filter.isDueDatePast}
                    control={
                      <Checkbox
                        name='isDueDatePast'
                        onChange={e =>
                          setFilter({
                            ...filter,
                            isDueDatePast: e.target.checked,
                          })
                        }
                      />
                    }
                  />
                  <FormControlLabel
                    label={
                      <Box display='flex' alignItems='center' gap='4px'>
                        <IconButton
                          disabled
                          sx={{ cursor: 'default', padding: 0 }}
                        >
                          <Icon icon='mdi:clock-outline' />
                        </IconButton>
                        Awaiting
                      </Box>
                    }
                    checked={filter.isAwaiting}
                    control={
                      <Checkbox
                        name='isAwaiting'
                        onChange={e =>
                          setFilter({
                            ...filter,
                            isAwaiting: e.target.checked,
                          })
                        }
                      />
                    }
                  />
                </Box>
              </Box>
            }
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <Box
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'none',
              },
              '& .sky-blue-header': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #26C6F9;',
              },
              '& .light-orange-header': {
                background:
                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528;',
              },
            }}
          >
            <DataGrid
              autoHeight
              components={{
                NoRowsOverlay: () => NoList(),
                NoResultsOverlay: () => NoList(),
              }}
              sx={{ overflowX: 'scroll' }}
              columns={columns}
              rows={list?.data || []}
              rowCount={list?.totalCount ?? 0}
              loading={isLoading}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              page={skip}
              pageSize={pageSize}
              paginationMode='server'
              onPageChange={setSkip}
              disableSelectionOnClick
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
JobTrackerDetail.acl = {
  subject: 'job_list',
  action: 'read',
}

const PageHeader = styled(Box)`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 20px 10px;
  background: #ffffff;
  border-radius: 6px;
`
