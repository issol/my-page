import { JobStatusType, JobsListType } from '@src/types/jobs/jobs.type'

// ** style components
import { Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'

// ** NextJs
import { useRouter } from 'next/router'

// ** values
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { JobTypeChip } from '@src/@core/components/chips/chips'

// ** helpers
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

// ** context
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useContext } from 'react'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { statusType } from '@src/types/common/status.type'
import { timezoneSelector } from '@src/states/permission'

type CellType = {
  row: JobsListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<JobsListType> | []
    totalCount: number
  }
  isLoading: boolean
  statusList: Array<statusType>
}

export default function JobsList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
  statusList,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const router = useRouter()

  console.log('list', list)

  const columns: GridColumns<JobsListType> = [
    {
      field: 'corporationId',

      minWidth: 182,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.corporationId}>
            <TableTitleTypography fontSize={14}>
              {row.corporationId}
            </TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      minWidth: 214,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: CellType) => {
        return JobsStatusChip(row.status as JobStatusType, statusList)
      },
    },
    {
      minWidth: 260,
      field: 'name',
      headerName: 'Client / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Client / Email</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>
              {row.contactPerson
                ? getLegalName({
                    firstName: row.contactPerson.firstName!,
                    middleName: row.contactPerson.middleName,
                    lastName: row.contactPerson.lastName!,
                  })
                : row.client.name}
            </Typography>
            <Typography variant='body2'>
              {row.contactPerson ? row.contactPerson.email : row.client.email}
            </Typography>
          </Box>
        )
      },
    },
    {
      minWidth: 290,
      field: 'jobName',
      headerName: 'Job name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job name</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{row.jobName ?? '-'}</Typography>
      },
    },
    {
      minWidth: 420,
      field: 'category , serviceType',
      headerName: 'Category / Service type',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Category / Service type</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            {row?.category ? (
              <JobTypeChip
                size='small'
                type={row?.category}
                label={row?.category}
              />
            ) : (
              '-'
            )}
            <ServiceTypeChip size='small' label={row?.serviceType} />
          </Box>
        )
      },
    },
    {
      minWidth: 280,
      field: 'startedAt',
      headerName: 'Job start date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Job start date</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={convertTimeToTimezone(
              row?.startedAt,
              auth.getValue().user?.timezone?.code!,
              timezone.getValue(),
            )}
          >
            <div>
              {convertTimeToTimezone(
                row?.startedAt,
                auth.getValue().user?.timezone?.code!,
                timezone.getValue(),
              )}
            </div>
          </Tooltip>
        )
      },
    },
    {
      minWidth: 280,
      field: 'dueAt',
      headerName: 'Job due date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Job due date</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={convertTimeToTimezone(
              row?.dueAt,
              auth.getValue().user?.timezone?.code!,
              timezone.getValue(),
            )}
          >
            <div>
              {convertTimeToTimezone(
                row?.dueAt,
                auth.getValue().user?.timezone?.code!,
                timezone.getValue(),
              )}
            </div>
          </Tooltip>
        )
      },
    },
    {
      minWidth: 140,
      field: 'totalPrice',
      headerName: 'Total price',
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontWeight={600}>
            {getCurrencyMark(row.currency)}
            {Number(row.totalPrice).toLocaleString()}
          </Typography>
        )
      },
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
          NoRowsOverlay: () => NoList(),
          NoResultsOverlay: () => NoList(),
        }}
        sx={{ overflowX: 'scroll', cursor: 'pointer' }}
        columns={columns}
        rows={list.data ?? []}
        rowCount={list.totalCount ?? 0}
        loading={isLoading}
        onCellClick={params => {
          router.push({
            pathname: '/orders/job-list/details/',
            query: { orderId: params.row.orderId, jobId: params.row.id },
          })
        }}
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
  )
}
