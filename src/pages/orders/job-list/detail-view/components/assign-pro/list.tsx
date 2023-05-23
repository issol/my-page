import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Switch,
  Typography,
} from '@mui/material'
import {
  DataGrid,
  GridCallbackDetails,
  GridColumns,
  GridSelectionModel,
} from '@mui/x-data-grid'
import {
  AssignProFilterPostType,
  AssignProListType,
} from '@src/types/orders/job-detail'
import { set } from 'nprogress'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  listCount: number
  list: AssignProListType[]
  columns: GridColumns<AssignProListType>
  setFilters: Dispatch<SetStateAction<AssignProFilterPostType>>
  setPageSize: Dispatch<SetStateAction<number>>
  setRowsPerPage: Dispatch<SetStateAction<number>>
  isLoading: boolean
  pageSize: number
  rowsPerPage: number
  hideOffBoard: boolean
  setHideOffBoard: Dispatch<SetStateAction<boolean>>
  selectionModel: GridSelectionModel
  handleSelectionModelChange: (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => void
}

const AssignProList = ({
  listCount,
  list,
  columns,
  setFilters,
  setPageSize,
  setRowsPerPage,
  isLoading,
  pageSize,
  rowsPerPage,
  hideOffBoard,
  setHideOffBoard,
  selectionModel,
  handleSelectionModelChange,
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
        <Typography variant='subtitle1'>There are no orders</Typography>
      </Box>
    )
  }
  return (
    <Card sx={{ mt: '30px' }}>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Box display='flex' gap='20px' alignItems='center'>
              <Typography variant='h6'>Pros ({listCount ?? 0})</Typography>
              <Box>
                <Typography
                  component='label'
                  htmlFor='hideBlocked'
                  variant='body2'
                  fontSize='16px'
                >
                  Hide off-boarded Pros
                </Typography>
                <Switch
                  id='hideBlocked'
                  checked={hideOffBoard}
                  onChange={e => {
                    setHideOffBoard(e.target.checked)
                    setFilters((prevState: AssignProFilterPostType) => ({
                      ...prevState,
                      isOffBoard: e.target.checked,
                    }))
                  }}
                />
              </Box>
            </Box>

            <Button
              variant='contained'
              sx={{ height: '30px' }}
              disabled={selectionModel.length === 0}
            >
              <Icon icon='ic:outline-send' fontSize='18px' />
              &nbsp; Request job
            </Button>
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>
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
          rows={list ?? []}
          rowCount={listCount ?? 0}
          loading={isLoading}
          // onCellClick={params => {
          //   handleRowClick(params.row)
          // }}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
          page={rowsPerPage}
          pageSize={pageSize}
          paginationMode='server'
          checkboxSelection
          onSelectionModelChange={handleSelectionModelChange}
          onPageChange={(newPage: number) => {
            setFilters!((prevState: AssignProFilterPostType) => ({
              ...prevState,
              skip: newPage * rowsPerPage!,
            }))
            setPageSize!(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters!((prevState: AssignProFilterPostType) => ({
              ...prevState,
              take: newPageSize,
            }))
            setRowsPerPage!(newPageSize)
          }}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default AssignProList
