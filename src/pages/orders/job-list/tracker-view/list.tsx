// ** style components
import { Button, Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import { StyledNextLink } from '@src/@core/components/customLink'
import {
  ExtraNumberChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { JobTypeChip } from '@src/@core/components/chips/chips'

// ** types
import { JobsTrackerListType } from '@src/types/jobs/jobs.type'

// ** NextJs
import { useRouter } from 'next/router'

// ** contexts
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useContext } from 'react'

// ** helpers
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

type CellType = {
  row: JobsTrackerListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<JobsTrackerListType> | []
    totalCount: number
  }
  isLoading: boolean
}

export default function JobsTrackerList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const router = useRouter()

  console.log("tracker",list)
  const columns: GridColumns<JobsTrackerListType> = [
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Client / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Client / Email</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>{row?.client?.name}</Typography>
            <Typography variant='body2'>{row?.client?.email}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'jobName',
      headerName: 'Work name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Work name</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{row?.name}</Typography>
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'category , serviceType',
      headerName: 'Category / Service type',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Category / Service type</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            {
              row?.category?.length ? (
                <JobTypeChip
                  size='small'
                  type={row?.category}
                  label={row?.category}
                />
              ) : null}
            
            <Box></Box>
            {row?.serviceType?.length ? (
              <Box display='flex' gap='8px'>
                <ServiceTypeChip size='small' label={row?.serviceType[0]} />
                {row?.serviceType.length > 1 ? (
                  <ExtraNumberChip
                    size='small'
                    label={`+ ${row?.serviceType.length - 1}`}
                  />
                ) : null}
              </Box>
            ) : (
              ''
            )}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 180,
      field: 'totalPrice',
      headerName: 'Total price',
      disableColumnMenu: true,
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
        rows={list.data}
        rowCount={list.totalCount}
        loading={isLoading}
        onCellClick={params => {
          router.push({
            pathname: `/orders/job-list/tracker-view/${params.row.id}`,
            query: { workName: params.row.name },
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
