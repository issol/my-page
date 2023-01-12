import { SignUpRequestsType } from 'src/pages/tad/company/types'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import RenderChips from 'src/pages/tad/company/components/sign-up-requests/render-chips'
import Button from '@mui/material/Button'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  data: SignUpRequestsType[]
  requestsPage: number
  requestsPageSize: number
  setRequestsPage: Dispatch<SetStateAction<number>>
  setRequestsPageSize: Dispatch<SetStateAction<number>>
  handleDeleteRole: (role: string, user: SignUpRequestsType) => void
  handleAddRole: (role: string, user: SignUpRequestsType) => void
  handleDeclineSignUpRequest: (user: SignUpRequestsType) => void
  handleApproveSignUpRequest: (user: SignUpRequestsType) => void
}

interface CellType {
  row: SignUpRequestsType
}

const SignUpRequests = ({
  data,
  requestsPage,
  requestsPageSize,
  setRequestsPage,
  setRequestsPageSize,
  handleDeleteRole,
  handleAddRole,
  handleDeclineSignUpRequest,
  handleApproveSignUpRequest,
}: Props) => {
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 70,
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        )
      },
    },
    {
      flex: 0.2,
      field: 'role',
      minWidth: 250,
      headerName: 'Role',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {/* {row.role.map(value => {
              return <div>{value}</div>
            })} */}
            <RenderChips
              user={row}
              handleDeleteRole={handleDeleteRole}
              handleAddRole={handleAddRole}
            />
            {/* {RenderChips(row.role, handleDeleteRole)} */}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      field: 'permission',
      minWidth: 150,
      headerName: 'Permission',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.permission}
          </Typography>
        )
      },
    },
    {
      flex: 0.15,
      field: 'action',
      minWidth: 150,
      headerName: 'Action',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant='outlined'
              size='medium'
              sx={{ textTransform: 'none' }}
              onClick={() => handleDeclineSignUpRequest(row)}
            >
              Decline
            </Button>
            <Button
              variant='contained'
              size='medium'
              onClick={() => handleApproveSignUpRequest(row)}
              sx={{ textTransform: 'none' }}
            >
              Approve
            </Button>
          </Box>
        )
      },
    },
  ]
  return (
    <>
      <Card>
        <CardHeader
          title={` Sign up requests : ${data.length}`}
          sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
        ></CardHeader>
        <Box
          sx={{
            height: 310,
            width: '100%',
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            columns={columns}
            rows={data ?? []}
            disableSelectionOnClick
            // autoPageSize
            pageSize={requestsPageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            page={requestsPage}
            // pagination
            // paginationMode={'server'}
            rowCount={data.length}
            onPageChange={(newPage: number) => {
              setRequestsPage(newPage)
            }}
            onPageSizeChange={(newPageSize: number) =>
              setRequestsPageSize(newPageSize)
            }
          />
        </Box>

        {/* <Box sx={{ height: 600 }}>
        <DataGrid
          loading={isFetching}
          rows={members?.data ?? []}
          columns={columns}
          checkboxSelection
          pageSize={pageSize}
          disableSelectionOnClick
          selectionModel={selectionModel}
          hideFooterSelectedRowCount
          page={page}
          sx={{
            '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
            '& .MuiDataGrid-columnHeaderCheckbox': {
              visibility: 'hidden',
            },
          }}
          onPageChange={(newPage: number) => {
            setPage(newPage)
            setSearch(true)
          }}
          // onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          rowCount={members?.count}
          paginationMode={'server'}
          pagination
          onCellClick={() => router.push('/admin/member/pro/detail')}
          onSelectionModelChange={selection => {
            if (selection.length > 1) {
              const selectionSet = new Set(selectionModel)
              const result = selection.filter(s => !selectionSet.has(s))
              onRowsSelectionHandler(result)
              setSelectionModel(result)
            } else {
              onRowsSelectionHandler(selection)
              setSelectionModel(selection)
            }
          }}
        />
      </Box> */}
      </Card>
    </>
  )
}

export default SignUpRequests
