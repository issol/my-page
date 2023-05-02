import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { ProjectTeamType } from '@src/types/orders/order-detail'
import { Dispatch, SetStateAction } from 'react'
import Icon from '@src/@core/components/icon'

type Props = {
  list: Array<ProjectTeamType>
  listCount: number
  columns: GridColumns<ProjectTeamType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  type: string
}

const ProjectTeam = ({
  list,
  listCount,
  columns,
  pageSize,
  setPageSize,
  page,
  setPage,
  type,
}: Props) => {
  console.log(list)

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
        }}
      >
        <Typography variant='h6'>Project team</Typography>
        {type === 'detail' ? (
          <IconButton>
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        ) : null}
      </Box>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          autoHeight
          getRowId={row => row?.id}
          // components={{
          //   NoRowsOverlay: () => NoList(),
          //   NoResultsOverlay: () => NoList(),
          // }}
          sx={{ overflowX: 'scroll', cursor: 'pointer' }}
          columns={columns}
          rows={list ?? []}
          rowCount={listCount ?? 0}
          // loading={isLoading}
          // onCellClick={params => {
          //   handleRowClick(params.row)
          // }}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode='server'
          onPageChange={(newPage: number) => {
            // setFilters!((prevState: OrderListFilterType) => ({
            //   ...prevState,
            //   skip: newPage * rowsPerPage!,
            // }))
            setPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            // setFilters!((prevState: OrderListFilterType) => ({
            //   ...prevState,
            //   take: newPageSize,
            // }))
            setPageSize(newPageSize)
          }}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default ProjectTeam
