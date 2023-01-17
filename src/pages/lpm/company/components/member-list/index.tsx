import { MembersType, SignUpRequestsType } from 'src/types/company/members'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import RenderMembersChips from './render-members-chips'
import Button from '@mui/material/Button'
import { Dispatch, SetStateAction } from 'react'

interface CellType {
  row: MembersType
}

type Props = {
  membersPage: number
  setMembersPage: Dispatch<SetStateAction<number>>
  membersPageSize: number
  setMembersPageSize: Dispatch<SetStateAction<number>>
  memberList: MembersType[]
}
const MemberList = ({
  membersPage,
  setMembersPage,
  membersPageSize,
  setMembersPageSize,
  memberList,
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
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography
              noWrap
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '.15px',
                color: 'rgba(76, 78, 100, 0.87)',
              }}
            >
              {`${row.firstName} ${
                row.middleName ? `(${row.middleName})` : ''
              } ${row.lastName}`}
            </Typography>
            <Typography
              noWrap
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '.15px',
                color: 'rgba(76, 78, 100, 0.6)',
              }}
            >
              {row.email}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.2,
      field: 'jobTitle',
      minWidth: 250,
      headerName: 'Job title',
      hideSortIcons: true,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.jobTitle ?? '-'}
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
            <RenderMembersChips member={row} />
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
  ]
  return (
    <Card>
      <CardHeader
        title={`Members (${memberList.length})`}
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>
      <Box
        sx={{
          maxHeight: 610,
          width: '100%',
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          components={{
            NoRowsOverlay: () => {
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
                  <Typography variant='subtitle1'>
                    There are no members
                  </Typography>
                </Box>
              )
            },
            NoResultsOverlay: () => {
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
                  <Typography variant='subtitle1'>
                    There are no members
                  </Typography>
                </Box>
              )
            },
          }}
          columns={columns}
          rows={memberList ?? []}
          disableSelectionOnClick
          autoHeight
          // autoPageSize
          pageSize={membersPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={membersPage}
          // pagination
          // paginationMode={'server'}
          rowCount={memberList.length}
          onPageChange={(newPage: number) => {
            setMembersPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) =>
            setMembersPageSize(newPageSize)
          }
        />
      </Box>
    </Card>
  )
}

export default MemberList
