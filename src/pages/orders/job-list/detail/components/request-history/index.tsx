import { Box, Typography } from '@mui/material'
import { DataGrid, GridRowsProp } from '@mui/x-data-grid'
import useModal from '@src/hooks/useModal'
import NoList from '@src/pages/components/no-list'
import { getJobRequestHistoryColumns } from '@src/shared/const/columns/job-request-history'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { JobRequestHistoryType } from '@src/types/jobs/jobs.type'
import { useEffect, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import InfoModal from './info-modal'

type Props = {
  history: {
    data: JobRequestHistoryType[]
    count: number
    totalCount: number
  }
  jobId: number
}

function loadServerRows(
  page: number,
  pageSize: number,
  data: JobRequestHistoryType[],
): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data.slice(page * pageSize, (page + 1) * pageSize))
    }, 200) // simulate network latency
  })
}

const RequestHistory = ({ history, jobId }: Props) => {
  const { openModal, closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState<JobRequestHistoryType[]>([])
  const [loading, setLoading] = useState(false)

  const onCellClick = (historyId: number, round: number) => {
    // openModal({})
    openModal({
      type: 'historyInfoModal',
      children: (
        <InfoModal
          onClose={() => closeModal('historyInfoModal')}
          historyId={historyId}
          jobId={jobId}
          round={round}
        />
      ),
    })
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      setLoading(true)
      const newRows = await loadServerRows(page, pageSize, history.data)

      if (!active) {
        return
      }

      setRows(newRows)
      setLoading(false)
    })()

    return () => {
      active = false
    }
  }, [page, pageSize, history])

  return (
    <Box
      sx={{ borderRadius: '10px', border: '1px solid #D8D8DD', height: '100%' }}
    >
      <Typography fontSize={20} fontWeight={500} sx={{ padding: '20px' }}>
        Request history ({history.totalCount})
      </Typography>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
          height: '100%',
        }}
      >
        <DataGrid
          autoHeight
          components={{
            NoRowsOverlay: () => NoList('There is no request history'),
            NoResultsOverlay: () => NoList('There is no request history'),
          }}
          sx={{
            overflowX: 'scroll',
            '& .MuiDataGrid-row': { cursor: 'pointer' },
            height: '100%',
            minHeight: 'calc(100% - 70px)',
          }}
          columns={getJobRequestHistoryColumns(auth, timezone.getValue())}
          rows={rows ?? []}
          rowCount={history.totalCount ?? 0}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          getRowId={row => row.historyId}
          onCellClick={params =>
            onCellClick(params.row.historyId, params.row.round)
          }
          pagination
          page={page}
          pageSize={pageSize}
          keepNonExistentRowsSelected
          paginationMode='server'
          onPageChange={setPage}
          disableSelectionOnClick
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      </Box>
    </Box>
  )
}

export default RequestHistory
