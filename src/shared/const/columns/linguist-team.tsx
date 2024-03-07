import { Icon } from '@iconify/react'
import { Box, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { LinguistTeamListType, ProsType } from '@src/types/pro/linguist-team'

type CellType = {
  row: LinguistTeamListType
}

export const getLinguistTeamColumns = (
  serviceTypeList: Array<{
    value: number
    label: string
  }>,
) => {
  const columns: GridColumns<LinguistTeamListType> = [
    {
      field: 'corporationId',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' fontWeight={400} fontSize={14}>
            {row.corporateId}
          </Typography>
        )
      },
    },
    {
      field: 'name',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Team name
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <Typography variant='body1' fontWeight={600}>
              {row.name}
            </Typography>
            {row.isPrivate ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '5px',
                  background: '#F7F7F9',
                }}
              >
                <Icon icon='mdi:lock' color='#8D8E9A' />
              </Box>
            ) : null}
          </Box>
        )
      },
    },
    {
      field: 'client',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Client
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body1'>{row.client}</Typography>
      },
    },
    {
      field: 'languagePair',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Language pair
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.source?.toUpperCase()} &rarr; {row.target?.toUpperCase()}
          </Typography>
        )
      },
    },
    {
      field: 'serviceType',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Service type
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <ServiceTypeChip
              label={
                serviceTypeList.find(i => i.value === row.serviceTypeId)
                  ?.label || ''
              }
            />
          </Box>
        )
      },
    },
    {
      field: 'numberOfLinguist',
      flex: 0.1,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Number of linguist
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body1' fontWeight={400} fontSize={12}>
            {row.pros.length ?? 0}
          </Typography>
        )
      },
    },
  ]

  return columns
}

export const getLinguistTeamProColumns = (isPriorityMode: boolean) => {
  const columns: GridColumns<ProsType> = [
    {
      flex: 0.0584,
      field: 'move',
      disableColumnMenu: true,
      sortable: false,
      hide: isPriorityMode ? false : true,
      renderHeader: () => <></>,
      renderCell: () => <></>,
    },
    {
      flex: 0.248,
      field: 'name',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Legal name / Email
        </Typography>
      ),
      renderCell: () => <></>,
    },
    {
      flex: 0.144,
      field: 'status',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: () => <></>,
    },
    {
      flex: 0.144,
      field: 'client',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Client
        </Typography>
      ),
      renderCell: () => <></>,
    },
    {
      flex: 0.264,
      field: 'jobTypeRole',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job type / Role
        </Typography>
      ),
      renderCell: () => <></>,
    },
    {
      flex: isPriorityMode ? 0.0936 : 0.152,
      field: 'experience',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography
          variant='subtitle1'
          fontWeight={500}
          fontSize={14}
          sx={{
            overflow: 'hidden',
            wordWrap: 'break-word',
            // overflowWrap: 'break-word',
            height: '100%',
          }}
        >
          Years of experience
        </Typography>
      ),
      renderCell: () => <></>,
    },
    {
      flex: 0.048,
      field: 'action',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <></>,
      renderCell: () => <></>,
    },
  ]

  return columns
}
