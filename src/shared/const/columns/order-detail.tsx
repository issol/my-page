import { Box } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import {
  ProjectTeamCellType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'

export const getProjectTeamColumns = (role?: string) => {
  const columns: GridColumns<ProjectTeamListType> = [
    {
      field: 'position',
      flex: role ? 0.2002 : 0.3355,

      headerName: 'Position',
      disableColumnMenu: true,
      renderHeader: () => <Box>Position</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.position}</Box>
      },
    },
    {
      flex: role ? 0.2402 : 0.3363,
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
      flex: role ? 0.2794 : 0.3283,
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
      flex: role ? 0.2802 : 0.3283,
      field: 'email',
      headerName: 'Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      hide: role === 'CLIENT',
      renderHeader: () => <Box>Email</Box>,
      renderCell: ({ row }: ProjectTeamCellType) => {
        return <Box>{row.email}</Box>
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
