import { Icon } from '@iconify/react'
import { Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { ProStatusChip } from '@src/@core/components/chips/chips'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { ProListCellType, ProListType } from '@src/types/pro/list'

type CellType = {
  row: ProListType
}

export const getProJobAssignColumns = (
  isPrioritized: boolean,
  searchPro: boolean,
  requestPro: boolean,
) => {
  const columns: GridColumns<ProListType> = [
    {
      field: 'order',

      flex: requestPro ? 0.0936 : 0.0503,
      // disableColumnMenu: true,
      hide: !isPrioritized || searchPro,
      renderHeader: () => (
        // <Icon
        //   icon='mdi:arrow-up'
        //   color='rgba(76, 78, 100, 0.54)'
        //   fontSize={20}
        // />
        <></>
      ),

      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
            {row.order}
          </Typography>
        )
      },
    },
    {
      field: 'name',

      flex: requestPro ? 0.3974 : 0.4025,
      headerName: 'Legal name / Email',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Legal name / Email
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,

              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
          />
        )
      },
    },

    {
      flex: requestPro ? 0.2308 : 0.2264,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <ProStatusChip status={row.status} label={row.status} />
      },
    },
    {
      flex: 0.1321,
      field: 'avg',
      hideSortIcons: true,
      sortable: false,
      disableColumnMenu: true,
      hide: !searchPro,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Avg. response time
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <Typography> 10 min(s)</Typography>
      },
    },
    {
      flex: searchPro ? 0.1635 : requestPro ? 0.2782 : 0.2453,
      field: 'jobs',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Ongoing jobs
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <Typography> {row.ongoingJobCount} job(s)</Typography>
      },
    },
  ]

  return columns
}
