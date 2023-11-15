import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  QuoteStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { QuotesListType } from '@src/types/common/quotes.type'
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'
import { Loadable } from 'recoil'

type QuotesListCellType = {
  row: QuotesListType
}

export const getQuoteListColumns = (
  role: UserRoleType,
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
) => {
  const columns: GridColumns<QuotesListType> = [
    {
      field: 'corporationId',
      flex: 0.05,
      minWidth: 120,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Box
          sx={{
            display: 'flex',
            minWidth: 80,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>No.</Box>
        </Box>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return <Box>{row.corporationId}</Box>
      },
    },
    {
      flex: 0.05,
      minWidth: 214,
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
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <QuoteStatusChip
            size='small'
            status={row?.status}
            label={row?.status}
          />
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 260,
      field: 'name',
      headerName: 'Company name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          {role.name === 'CLIENT' ? 'LSP' : 'Client name'} / Email
        </Typography>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>
              {role.name === 'CLIENT' ? row?.lsp?.name : row?.client.name}
            </Typography>
            <Typography variant='body2'>
              {role.name === 'CLIENT' ? row?.lsp?.email : row?.client.email}
            </Typography>
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 290,
      field: 'projectName',
      headerName: 'Project name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Project name
        </Typography>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return <Box>{row.projectName}</Box>
      },
    },
    {
      flex: 0.1,
      minWidth: 420,
      field: 'category',
      headerName: 'Category / Service type',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Category / Service type
        </Typography>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {!row.category ? (
              '-'
            ) : (
              <JobTypeChip
                type={row.category}
                label={row.category}
                size='small'
              />
            )}
            {!row.serviceType || !row.serviceType?.length ? null : (
              <ServiceTypeChip size='small' label={row.serviceType[0]} />
            )}

            {row.serviceType?.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={row.serviceType.slice(1).length}
              />
            ) : null}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'quoteRegisteredDate',
      headerName: 'Quote date',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Quote date
        </Typography>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              row.quoteDate,
              auth.getValue().user?.timezone!,
            )}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: role.name === 'CLIENT' ? 'estimatedDeliveryDate' : 'quoteDeadline',
      headerName:
        role.name === 'CLIENT' ? 'Estimated delivery date' : 'Quote deadline',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          {role.name === 'CLIENT'
            ? 'Estimated delivery date'
            : 'Quote deadline'}
        </Typography>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              role.name === 'CLIENT' ? row.estimatedAt : row.quoteDeadline,
              role.name === 'CLIENT'
                ? row.estimatedTimezone
                : row.quoteDeadlineTimezone,
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 280,
      field: role.name === 'CLIENT' ? 'projectDueDate' : 'expiryDate',
      headerName: 'Quote expiry date',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          {role.name === 'CLIENT' ? 'Project due date' : 'Quote expiry date'}
        </Typography>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              role.name === 'CLIENT' ? row.projectDueAt : row.quoteExpiryDate,
              role.name === 'CLIENT'
                ? row.projectDueTimezone
                : row.quoteExpiryDateTimezone,
            )}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 140,
      field: 'totalPrice',
      headerName: 'Total price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {!row.currency
              ? row.subtotal
                ? row.subtotal
                : '-'
              : formatCurrency(Number(row.subtotal), row.currency)}
          </Box>
        )
      },
    },
  ]

  return columns
}