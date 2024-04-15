import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getJobRequestHistoryColumns } from '@src/shared/const/columns/job-request-history'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

const RequestHistory = () => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  return (
    <Box sx={{ borderRadius: '10px', border: '1px solid #D8D8DD' }}>
      <Typography>Request history (20)</Typography>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        {/* <DataGrid
          autoHeight
          components={{
            NoRowsOverlay: () => NoList('There is no request history'),
            NoResultsOverlay: () => NoList('There is no request history'),
          }}
          sx={{
            overflowX: 'scroll',
            '& .MuiDataGrid-row': { cursor: 'pointer' },
          }}
          columns={getJobRequestHistoryColumns(auth, timezone.getValue())}
          rows={list.data ?? []}
          rowCount={list.totalCount ?? 0}
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
        /> */}
      </Box>
    </Box>
  )
}

export default RequestHistory
