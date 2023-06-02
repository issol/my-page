import { Box, Card, CardHeader, Grid, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { ProStatusChip } from '@src/@core/components/chips/chips'
import {
  TableTitleTypography,
  TitleTypography,
} from '@src/@core/styles/typography'
import { AuthContext } from '@src/context/AuthContext'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import Link from 'next/link'
import { useContext } from 'react'

type AssignProType = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  status: string
  isActive: boolean
  responseRate: number
  assignmentStatus: string
  assignmentDate: string
  message: {
    id: number
    unReadCount: number
  }
}
type Props = {
  list: {
    totalCount: number
    data: Array<AssignProType>
  }
  isLoading: boolean
  skip: number
  setSkip: (n: number) => void
  pageSize: number
  setPageSize: (n: number) => void
}

type CellType = {
  row: AssignProType
}
/** TODO: AssignProType 수정 (import하기)
 * 부모 컴포넌트에서 list, isLoading 데이터 수정하기
 * Link클릭 시 해당 프로의 디테일로 잘 이동하는지 체크
 */
export default function HistoryAssignPro({
  list,
  isLoading,
  skip,
  setSkip,
  pageSize,
  setPageSize,
}: Props) {
  const { user } = useContext(AuthContext)
  const columns: GridColumns<AssignProType> = [
    {
      field: 'corporationId',
      flex: 0.2,
      minWidth: 140,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box maxWidth='100%' display='flex' alignItems='center' gap='12px'>
            <Box width='32px' height='32px'>
              <img
                alt=''
                aria-hidden
                src={
                  row?.isActive
                    ? `/images/icons/onboarding-icons/pro-active.png`
                    : `/images/icons/onboarding-icons/pro-inactive.png`
                }
              />
            </Box>

            <Box overflow='hidden'>
              <Link
                href={`/onboarding/detail/${row.id}`}
                style={{ textDecoration: 'none' }}
              >
                <TitleTypography fontWeight={600}>
                  {getLegalName({
                    firstName: row.firstName!,
                    middleName: row.middleName,
                    lastName: row.lastName!,
                  })}
                </TitleTypography>
              </Link>
              <TableTitleTypography variant='body2'>
                {row.email}
              </TableTitleTypography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.05,
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: CellType) => (
        <ProStatusChip status={row.status} label={row.status} />
      ),
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'responseRate',
      headerName: 'Response rate',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Response rate</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontWeight='bold'>
            {row?.responseRate ? row.responseRate.toFixed(2) : '-'} %
          </Typography>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'assignmentStatus',
      headerName: 'Assignment status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Assignment status</Box>,
      /* TODO : Chip디자인 추가해야 함 */
      renderCell: ({ row }: CellType) => (
        <Typography>{row.assignmentStatus}</Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'assignmentDate',
      headerName: 'Date&Time',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date&Time</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography>
            {FullDateTimezoneHelper(row.assignmentDate, user?.timezone?.code!)}
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
        <Typography variant='subtitle1'>There is no assigned Pro</Typography>
      </Box>
    )
  }
  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>Pros ({list?.totalCount ?? 0})</Typography>{' '}
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      />
      <Grid container>
        <Grid item xs={12}>
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
              sx={{ overflowX: 'scroll' }}
              columns={columns}
              rows={list.data}
              rowCount={list.totalCount}
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
        </Grid>
      </Grid>
    </Card>
  )
}
