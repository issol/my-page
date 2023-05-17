import {
  Box,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { AuthContext } from '@src/context/AuthContext'
import useModal from '@src/hooks/useModal'
import { useGetJobHistory } from '@src/queries/jobs.query'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { JobHistoryType } from '@src/types/jobs/jobs.type'
import { useContext, useState } from 'react'
import HistoryDetail from './history-detail'

type CellType = {
  row: JobHistoryType
}

type Props = {
  id: number
}

/**
 * TODO : createdAt은 타입 바뀔수도 있으므로 확인 후 수정하기
 */
export default function JobHistory({ id }: Props) {
  const { openModal, closeModal } = useModal()
  const { user } = useContext(AuthContext)
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const { data: list, isLoading } = useGetJobHistory(id, {
    skip,
    take: skip * pageSize,
  })

  const columns: GridColumns<JobHistoryType> = [
    {
      field: 'version',
      flex: 0.1,
      minWidth: 150,
      headerName: 'Request',
      disableColumnMenu: true,
      renderHeader: () => <Box>Request</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography>Request. {row.version}</Typography>
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'requestor',
      headerName: 'Requestor',
      disableColumnMenu: true,
      renderHeader: () => <Box>Requestor</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography>{row.requestor}</Typography>
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Date&Time',
      disableColumnMenu: true,
      renderHeader: () => <Box>Date&Time</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography>
            {FullDateTimezoneHelper(row.createdAt, user?.timezone?.code!)}
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
        <Typography variant='subtitle1'>There is no request history</Typography>
      </Box>
    )
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Request history ({list?.totalCount ?? 0})
              </Typography>{' '}
            </Box>
          }
          sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
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
            rows={list?.data || []}
            rowCount={list?.totalCount ?? 0}
            loading={isLoading}
            onCellClick={params =>
              openModal({
                type: 'history-detail',
                children: (
                  <Dialog
                    open={true}
                    onClose={() => closeModal('history-detail')}
                  >
                    <DialogContent sx={{ padding: '50px' }}>
                      <HistoryDetail
                        id={params.row.id}
                        title={`Request .${params.row.version} ${params.row.id}`}
                        onClose={() => closeModal('history-detail')}
                      />
                    </DialogContent>
                  </Dialog>
                ),
              })
            }
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
  )
}
