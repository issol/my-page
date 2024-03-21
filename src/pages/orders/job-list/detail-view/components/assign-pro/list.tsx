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
  GridRowParams,
  GridSelectionModel,
} from '@mui/x-data-grid'
import { JobType } from '@src/types/common/item.type'

import {
  AssignProFilterPostType,
  AssignProListType,
} from '@src/types/orders/job-detail'
import { Dispatch, SetStateAction } from 'react'
import { JobStatus } from '@src/types/common/status.type'

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
  onClickRequestJob: (n: 'assign' | 're-assign') => void
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
                        isOffBoard: e.target.checked ? '1' : '0',
                      }))
                    }}
                  />
                </Box>
              )}
            </Box>
            {type === 'history' ? null : !jobInfo?.pro ? (
              <Button
                variant='contained'
                sx={{ height: '30px' }}
                disabled={selectionModel.length === 0}
                onClick={() => onClickRequestJob('assign')}
              >
                <Icon icon='ic:outline-send' fontSize='18px' />
                &nbsp; Request job
              </Button>
            ) : (
              <Button
                variant='outlined'
                sx={{ height: '30px' }}
                disabled={[
                  60400, 60500, 60600, 60700, 60800, 60900, 601000,
                ].includes(jobInfo.status as JobStatus)} //Partially delivered, delivered, Approved, Invoiced, without invoice, paid, canceled
                onClick={() => onClickRequestJob('re-assign')}
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
          checkboxSelection={type === 'history' || jobInfo.pro ? false : true}
          isRowSelectable={(params: GridRowParams<AssignProListType>) =>
            params.row.assignmentStatus === null ? true : false
          }
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
