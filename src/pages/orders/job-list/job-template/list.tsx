import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getJobTemplateColumns } from '@src/shared/const/columns/job-template'
import { JobTemplateListType } from '@src/types/jobs/job-template.type'
import { useRouter } from 'next/router'

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<JobTemplateListType> | []
    totalCount: number
  }
  isLoading: boolean
  serviceTypeList: Array<{ value: number; label: string }>
}

const JobTemplateList = ({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
  serviceTypeList,
}: Props) => {
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
          NoRowsOverlay: () => NoList('There are no job templates'),
          NoResultsOverlay: () => NoList('There are no job templates'),
        }}
        sx={{
          overflowX: 'scroll',
          '& .MuiDataGrid-row': { cursor: 'pointer' },
        }}
        columns={getJobTemplateColumns(serviceTypeList)}
        rows={list.data ?? []}
        rowCount={list.totalCount ?? 0}
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
  )
}

export default JobTemplateList
