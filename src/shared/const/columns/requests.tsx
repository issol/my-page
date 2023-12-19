import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ClientRequestStatusChip,
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'
import { RequestListType } from '@src/types/requests/list.type'
import { TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { Loadable } from 'recoil'

type CellType = {
  row: RequestListType
}

export const getRequestListColumns = (
  statusList: {
    value: number
    label: string
  }[],
  role: UserRoleType,
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
  timezoneList: TimeZoneType[],
) => {
  const columns: GridColumns<RequestListType> = [
    {
      field: 'corporationId',
      flex: 0.064,
      minWidth: 120,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.corporationId}>
            <TableTitleTypography fontSize={14}>
              {row.corporationId}
            </TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Status',
      flex: 0.1142,
      minWidth: 214,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: CellType) => {
        const label = statusList?.find(i => i.label === row.status)?.label
        if (label) return <>{ClientRequestStatusChip(row.status)}</>
      },
    },
    {
      field: 'Client / Email',
      flex: 0.1387,
      minWidth: 260,

      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box>{role.name === 'CLIENT' ? 'LSP / Email' : 'Client / Email'}</Box>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography fontWeight={600}>
              {role.name === 'CLIENT'
                ? row.lsp.name ?? '-'
                : row.client.name ?? '-'}
            </Typography>
            <Typography variant='body2'>
              {role.name === 'CLIENT'
                ? row.lsp.email ?? '-'
                : row.client.email ?? '-'}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.1814,
      minWidth: 340,
      field: 'name',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Item name</Box>,
      renderCell: ({ row }: CellType) => {
        const itemName = row.items.length ? row.items[0].name : undefined
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            <Typography>{itemName}</Typography>
            {row.items.length > 1 && (
              <ExtraNumberChip
                size='small'
                label={`+ ${row.items.length - 1}`}
              />
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.2241,
      minWidth: 420,
      field: 'category',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Category / Service type</Box>,
      renderCell: ({ row }: CellType) => {
        const category = row.items.length ? row.items[0]?.category : undefined
        const serviceTypes = row.items.length ? row.items[0]?.serviceType : []
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            {category && (
              <JobTypeChip size='small' type={category} label={category} />
            )}
            {serviceTypes.length ? (
              <ServiceTypeChip size='small' label={serviceTypes[0]} />
            ) : null}
            {serviceTypes.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={`+ ${serviceTypes.length - 1}`}
              />
            ) : null}
          </Box>
        )
      },
    },
    {
      flex: 0.1494,
      minWidth: 280,
      field: 'requestedAt',
      disableColumnMenu: true,
      // sortable: false,
      renderHeader: () => <Box>Request date</Box>,
      renderCell: ({ row }: CellType) => (
        <Box>
          {convertTimeToTimezone(
            row.requestedAt,
            auth.getValue().user?.timezone,
            timezoneList,
          )}
        </Box>
      ),
    },
    {
      flex: 0.1281,
      minWidth: 240,
      field: 'desiredDueDate',
      disableColumnMenu: true,
      // sortable: false,
      renderHeader: () => <Box>Desired due date</Box>,
      renderCell: ({ row }: CellType) => {
        const dueDate = row.items.length
          ? row.items[0]?.desiredDueDate
          : undefined
        return (
          <Box>
            {!dueDate
              ? '-'
              : convertTimeToTimezone(
                  dueDate,
                  auth.getValue().user?.timezone,
                  timezoneList,
                )}
          </Box>
        )
      },
    },
  ]

  return columns
}
