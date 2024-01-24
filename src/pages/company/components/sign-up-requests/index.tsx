import { MembersType, SignUpRequestsType } from '@src/types/company/members'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import RenderChips from '@src/pages/company/components/sign-up-requests/render-chips'
import Button from '@mui/material/Button'
import { Dispatch, SetStateAction } from 'react'
import RenderRoleChips from '@src/pages/company/components/sign-up-requests/render-chips'
import { getCurrentRole } from '@src/shared/auth/storage'

type Props = {
  data: SignUpRequestsType[]
  requestsPage: number
  requestsPageSize: number
  setRequestsPage: Dispatch<SetStateAction<number>>
  setRequestsPageSize: Dispatch<SetStateAction<number>>
  handleDeleteRole: (
    role: string,
    user: {
      id: number
      roles: string[]
    },
  ) => void
  handleAddRole: (
    role: string,
    user: {
      id: number
      roles: string[]
    },
  ) => void
  handleDeclineSignUpRequest: (user: SignUpRequestsType) => void
  handleApproveSignUpRequest: (user: SignUpRequestsType) => void
  checkPermission: () => boolean
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
  checkPermission,
}: Props) => {
  const isClient = getCurrentRole()?.name === 'CLIENT'
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
      hide: isClient,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {/* {row.role.map(value => {
              return <div>{value}</div>
            })} */}
            <RenderRoleChips
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
              disabled={!checkPermission()}
            >
              Decline
            </Button>
            <Button
              variant='contained'
              size='medium'
              onClick={() => handleApproveSignUpRequest(row)}
              sx={{ textTransform: 'none' }}
              disabled={!checkPermission()}
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
          title={
            isClient
              ? `Registration requests (${data.length})`
              : `Sign up requests (${data.length})`
          }
          sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
        />
        <Box
          sx={{
            maxHeight: 310,
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
            autoHeight
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
      </Card>
    </>
  )
}

export default SignUpRequests
