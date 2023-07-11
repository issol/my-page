import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { UserDataType } from '@src/context/types'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { NotificationType } from '@src/types/common/notification.type'

type Props = {
  list: Array<NotificationType>
  count: number
  user: UserDataType
  isLoading: boolean
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
}

type CellType = {
  row: NotificationType
}

const NotificationList = ({
  list,
  count,
  user,
  isLoading,
  skip,
  pageSize,
  setSkip,
  setPageSize,
}: Props) => {
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
        <Typography variant='subtitle1'>There are no notifications</Typography>
      </Box>
    )
  }

  const columns: GridColumns<NotificationType> = [
    {
      field: 'Category',
      minWidth: 182,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row.type}</Typography>
      },
    },
    {
      field: 'Content',
      minWidth: 717,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography>[Ver. 2] Q-000001 quote has been deleted.</Typography>
        )
      },
    },
    {
      field: 'Time',
      minWidth: 254,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography>
            {FullDateTimezoneHelper(row.createdAt, user.timezone)}
          </Typography>
        )
      },
    },
  ]

  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>Notifications ({count ?? 0})</Typography>
            <Button variant='contained'>Mark all as read</Button>
          </Box>
        }
        sx={{
          pb: 4,
          '& .MuiCardHeader-title': { letterSpacing: '.15px' },
        }}
      />
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
          rows={list}
          rowCount={count}
          loading={isLoading}
          // onCellClick={params =>
          //   router.push(`/invoice/receivable/detail/${params.id}`)
          // }
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
  )
}

export default NotificationList
