import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'
import { TimeZoneType } from '@src/types/sign/personalInfoTypes'
import { Loadable } from 'recoil'

type CellType = {
  row: InvoiceReceivableListType
}

export const getInvoiceReceivableListColumns = (
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
  const columns: GridColumns<InvoiceReceivableListType> = [
    {
      field: 'corporationId',
      minWidth: 130,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
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
      minWidth: 240,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const label = statusList?.find(
          i => i.value === row.invoiceStatus,
        )?.label
        if (label) return <>{InvoiceReceivableChip(label, row.invoiceStatus)}</>
      },
    },
    {
      field: 'Client / Email',
      minWidth: 260,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          {role.name === 'CLIENT' ? 'LSP / Email' : 'Client / Email'}
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            {role.name === 'CLIENT' ? (
              <>
                <Typography fontWeight={600}>
                  {row.client.name ?? '-'}
                </Typography>
                <Typography variant='body2'>
                  {row.projectManager?.email ?? '-'}
                </Typography>
              </>
            ) : (
              <>
                {!row.contactPerson ? (
                  <>
                    <Typography fontWeight={600}>
                      {row.client?.name ?? '-'}
                    </Typography>
                    <Typography variant='body2'>
                      {row.client?.email ?? '-'}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography fontWeight={600}>
                      {getLegalName({
                        firstName: row.contactPerson?.firstName,
                        middleName: row.contactPerson?.middleName,
                        lastName: row.contactPerson?.lastName,
                      })}
                    </Typography>
                    <Typography variant='body2'>
                      {row.client?.email ?? '-'}
                    </Typography>
                  </>
                )}
              </>
            )}
          </Box>
        )
      },
    },
    {
      field: 'Project name',
      minWidth: 290,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Project name
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.order?.projectName}>
            <TableTitleTypography fontSize={14}>
              {row.projectName ?? '-'}
            </TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Category / Service type',
      minWidth: 420,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Category / Service type
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {row.order?.category ? (
              <JobTypeChip
                size='small'
                type={row.order.category}
                label={row.order.category}
              />
            ) : (
              '-'
            )}

            {row.order?.serviceType?.length ? (
              <>
                <ServiceTypeChip
                  size='small'
                  label={row.order.serviceType[0]}
                />
                {row.order?.serviceType.length > 1 ? (
                  <ExtraNumberChip
                    size='small'
                    label={`+${row.order?.serviceType.slice(1).length}`}
                  />
                ) : null}
              </>
            ) : (
              '-'
            )}
          </Box>
        )
      },
    },
    {
      field: 'invoicedAt',
      minWidth: 280,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Invoice date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        if (auth.state === 'hasValue' && auth.getValue().user) {
          const date = convertTimeToTimezone(
            row.invoicedAt,
            auth.getValue().user?.timezone,
            timezoneList,
          )
          console.log('date', row.invoicedAt)
          return (
            <Tooltip title={date}>
              <Typography variant='body2'>{date}</Typography>
            </Tooltip>
          )
        }
      },
    },
    {
      field: 'payDueAt',
      minWidth: 280,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment due
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.payDueAt,
          auth.getValue().user?.timezone,
          timezoneList,
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'paidAt',
      minWidth: 280,
      disableColumnMenu: true,
      hide: role.name === 'CLIENT',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.paidAt,
          auth.getValue().user?.timezone,
          timezoneList,
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'totalPrice',
      minWidth: 130,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Total price
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const subtotal = row.orders.reduce(
          (total, obj) => total + Number(obj.subtotal),
          0,
        )

        const price = `${getCurrencyMark(row.currency)} ${
          row.isTaxable
            ? (subtotal * (Number(row.tax!) / 100) + subtotal).toLocaleString(
                'ko-KR',
              )
            : subtotal.toLocaleString('ko-KR')
        }`

        const date = convertTimeToTimezone(
          row.salesCheckedAt,
          row?.salesCheckedDateTimezone,
          timezoneList,
        )
        return (
          <Tooltip
            title={
              <Box>
                <Typography color='#ffffff' fontSize={11}>
                  Revenue from : {row.revenueFrom ?? '-'}
                </Typography>
                <Typography color='#ffffff' fontSize={11}>
                  Sales category : {row.salesCategory ?? '-'}
                </Typography>
                <Typography color='#ffffff' fontSize={11}>
                  Sales recognition date : {date}
                </Typography>
              </Box>
            }
          >
            <Typography fontWeight={600}>{price}</Typography>
          </Tooltip>
        )
      },
    },
  ]

  return columns
}
