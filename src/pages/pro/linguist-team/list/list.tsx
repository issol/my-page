import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getLinguistTeamColumns } from '@src/shared/const/columns/linguist-team'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGetLinguistTeam } from '@src/queries/pro/linguist-team'
import { FilterType } from 'src/pages/pro/linguist-team/index'

type Props = {
  serviceTypeList: Array<{
    value: number
    label: string
  }>
  skip: number
  pageSize: number
  setPageSize: (num: number) => void
  setListCount: (num: number) => void
  clientList: {
    clientId: number
    name: string
  }[]
  activeFilter: FilterType
  page: number
  setPage: (num: number) => void
}

const LinguistTeamList = ({
  serviceTypeList,
  skip,
  pageSize,
  setPageSize,
  setListCount,
  clientList,
  activeFilter,
  page,
  setPage,
}: Props) => {
  const router = useRouter()

  const { data: linguistList, isLoading } = useGetLinguistTeam(activeFilter)

  useEffect(() => {
    let listCount = 0
    if (linguistList && linguistList.totalCount) {
      listCount = linguistList.totalCount
    }
    setListCount(listCount)
  }, [linguistList])

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
          NoRowsOverlay: () => NoList('There are no linguist teams'),
          NoResultsOverlay: () => NoList('There are no linguist teams'),
        }}
        sx={{
          overflowX: 'scroll',
          '& .MuiDataGrid-row': { cursor: 'pointer' },
        }}
        columns={getLinguistTeamColumns(serviceTypeList, clientList)}
        rows={linguistList?.data ?? []}
        rowCount={linguistList?.totalCount ?? 0}
        loading={isLoading}
        rowsPerPageOptions={[10, 25, 50]}
        onCellClick={params => {
          router.push(`/pro/linguist-team/detail/${params.id}`)
        }}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode='server'
        onPageChange={setPage}
        disableSelectionOnClick
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Box>
  )
}

export default LinguistTeamList
