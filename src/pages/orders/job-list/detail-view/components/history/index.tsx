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
import { ProListJobInfoType } from '@src/types/pro/list'
import { PositionType, ProjectInfoType } from '@src/types/orders/order-detail'
import { PriceUnitListType } from '@src/types/common/standard-price'
import { JobItemType } from '@src/types/common/item.type'
import { useGetJobInfo } from '@src/queries/order/job.query'

type CellType = {
  row: JobHistoryType
}

type Props = {
  jobId: number
  jobCorId: string
  orderDetail: ProjectInfoType
  priceUnitsList: PriceUnitListType[]
  item: JobItemType
  projectTeam: {
    id: string
    userId: number
    position: PositionType
    firstName: string
    middleName: string | null
    lastName: string
    email: string
    jobTitle: string
  }[]
}

/**
 * TODO : createdAt은 타입 바뀔수도 있으므로 확인 후 수정하기
 */
export default function JobHistory({
  jobId,
  jobCorId,
  orderDetail,
  priceUnitsList,
  item,
  projectTeam,
}: Props) {
  const { openModal, closeModal } = useModal()
  const { user } = useContext(AuthContext)
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const {
    data: originJobInfo,

    isLoading: originJobInfoLoading,
  } = useGetJobInfo(jobId, false)

  const { data: list, isLoading } = useGetJobHistory(jobId, {
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
            {FullDateTimezoneHelper(row.requestedAt, user?.timezone?.code!)}
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
            onCellClick={params => {
              closeModal('JobDetailViewModal')
              {
                !originJobInfoLoading &&
                  originJobInfo &&
                  openModal({
                    type: 'history-detail',
                    children: (
                      <Box
                        sx={{
                          maxWidth: '1180px',
                          width: '100%',
                          maxHeight: '90vh',
                          background: '#ffffff',
                          boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
                          borderRadius: '10px',
                          overflow: 'scroll',
                          '&::-webkit-scrollbar': {
                            display: 'none',
                          },
                        }}
                      >
                        <HistoryDetail
                          id={params.row.id}
                          originJobInfo={originJobInfo}
                          title={`[Request .${params.row.version}] ${jobCorId}`}
                          row={params.row}
                          onClose={() => closeModal('history-detail')}
                          orderDetail={orderDetail}
                          priceUnitsList={priceUnitsList}
                          item={item}
                          projectTeam={projectTeam}
                        />
                      </Box>
                    ),
                  })
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
    </Grid>
  )
}
