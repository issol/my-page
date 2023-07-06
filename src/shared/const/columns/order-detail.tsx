import { Box } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import {
  ProjectTeamCellType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'

export const getProjectTeamColumns = (role: string) => {
  console.log(role)

  const columns: GridColumns<ProjectTeamListType> = [
    {
      field: 'position',

      minWidth: 410,
      headerName: 'Position',
      disableColumnMenu: true,
      renderHeader: () => <Box>Position</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.position}</Box>
      },
    },
    {
      minWidth: 420,
      field: 'member',
      headerName: 'Member',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Member</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return (
          <Box>
            {getLegalName({
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
            })}
          </Box>
        )
      },
    },
    {
      minWidth: 410,
      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job title</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.jobTitle}</Box>
      },
    },
  ]

  const clientColumns: GridColumns<ProjectTeamListType> = [
    {
      field: 'position',

      flex: 0.2182,

      headerName: 'Position',
      disableColumnMenu: true,
      renderHeader: () => <Box>Position</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.position}</Box>
      },
    },
    {
      flex: 0.2618,

      field: 'member',
      headerName: 'Member',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Member</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return (
          <Box>
            {getLegalName({
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
            })}
          </Box>
        )
      },
    },
    {
      flex: 0.3045,

      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job title</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.jobTitle}</Box>
      },
    },
    {
      flex: 0.3054,

      field: 'email',
      headerName: 'Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Email</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.email}</Box>
      },
    },
  ]

  return role === 'CLIENT' ? clientColumns : columns
}
