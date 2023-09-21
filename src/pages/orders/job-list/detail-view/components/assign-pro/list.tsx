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
import { JobType } from '@src/types/common/item.type'
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
  setPage: Dispatch<SetStateAction<number>>
  isLoading: boolean
  pageSize: number
  page: number
  hideOffBoard: boolean
  setHideOffBoard: Dispatch<SetStateAction<boolean>>
  selectionModel: GridSelectionModel
  handleSelectionModelChange: (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => void
  onClickRequestJob: () => void
  type: string
  jobInfo: JobType
}

const AssignProList = ({
  listCount,
  list,
  columns,
  setFilters,
  setPageSize,
  setPage,
  isLoading,
  pageSize,
  page,
  hideOffBoard,
  setHideOffBoard,
  selectionModel,
  handleSelectionModelChange,
  onClickRequestJob,
  type,
  jobInfo,
}: Props) => {
  // console.log(page, pageSize, listCount)

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
        <Typography variant='subtitle1'>There are no Pros</Typography>
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
              {type === 'history' ? null : (
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
              )}
            </Box>
            {type === 'history' 
              ? null 
              : !jobInfo?.proId
                ? (<Button
                    variant='contained'
                    sx={{ height: '30px' }}
                    disabled={selectionModel.length === 0}
                    onClick={onClickRequestJob}
                  >
                    <Icon icon='ic:outline-send' fontSize='18px' />
                    &nbsp; Request job
                  </Button>
                ) : (
                  <Button
                    variant='outlined'
                    sx={{ height: '30px' }}
                    disabled={[60800,60900,601100,601200,601300,601400,60400].includes(jobInfo.status)} //Partially delivered, delivered, Approved, Invoiced, without invoice, paid, canceled
                    onClick={onClickRequestJob}
                  >
                    &nbsp; Re-assign
                  </Button>
                )}
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
          sx={{
            overflowX: 'scroll',
            cursor: 'pointer',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          columns={columns}
          rows={list ?? []}
          getRowId={row => row.userId}
          rowCount={listCount ?? 0}
          loading={isLoading}
          // onCellClick={params => {
          //   handleRowClick(params.row)
          // }}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode='server'
          checkboxSelection={type === 'history' ? false : true}
          onSelectionModelChange={handleSelectionModelChange}
          onPageChange={(newPage: number) => {
            setFilters!((prevState: AssignProFilterPostType) => ({
              ...prevState,
              skip: newPage * pageSize!,
            }))
            setPage!(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters!((prevState: AssignProFilterPostType) => ({
              ...prevState,
              take: newPageSize,
            }))
            setPageSize!(newPageSize)
          }}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default AssignProList
