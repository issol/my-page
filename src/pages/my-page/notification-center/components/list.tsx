import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'
import { UserDataType } from '@src/context/types'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { transformMessage } from '@src/shared/transformer/notification-message'
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
  onClickMarkAllAsRead: () => void
  onClickNotification: (id: number, url: string, isRead: boolean) => void
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
  onClickMarkAllAsRead,
  onClickNotification,
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
      flex: 0.208,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.type}
          </Typography>
        )
      },
    },
    {
      field: 'Content',
      flex: 0.52,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
            <Typography variant='body1' fontWeight={400}>
              {transformMessage(row)}
            </Typography>
            {row.action === 'deleted' ? null : (
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={600}
                sx={{ textDecoration: 'underline' }}
                onClick={() =>
                  onClickNotification(
                    row.id,
                    row.connectedLink ?? '',
                    row.isRead,
                  )
                }
              >
                Go to check
              </Typography>
            )}
          </Box>
        )
      },
    },

    {
      field: 'Time',
      flex: 0.272,
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
            <Button variant='outlined' onClick={onClickMarkAllAsRead}>
              Mark all as read
            </Button>
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
          sx={{
            overflowX: 'scroll',
            cursor: 'pointer',
            [`& .${gridClasses.row}.disabled`]: {
              opacity: 0.5,
              // cursor: 'not-allowed',
            },
          }}
          columns={columns}
          rows={list}
          rowCount={count}
          loading={isLoading}
          getRowClassName={params =>
            params.row.isRead === true ? 'disabled' : 'normal'
          }
          // isRowSelectable={params =>
          //   role.name === 'CLIENT' && params.row.status !== 'Under revision'
          // }
          onCellClick={params => {
            if (
              params.row.action === 'deleted' &&
              params.row.isRead === false
            ) {
              console.log('hi')

              onClickNotification(
                params.row.id,
                params.row.connectedLink ?? '',
                params.row.isRead,
              )
            }
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
    </Card>
  )
}

export default NotificationList
