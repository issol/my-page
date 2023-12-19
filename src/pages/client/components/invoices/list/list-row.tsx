import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import { InvoiceReceivableChip } from '@src/@core/components/chips/chips'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { ClientInvoiceListType } from '@src/types/client/client-projects.type'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { UserDataType } from '@src/context/types'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { useGetStatusList } from '@src/queries/common.query'

export default function ClientInvoicesRows(props: {
  row: ClientInvoiceListType
  user: UserDataType
  selected: number | null
  handleRowClick: (row: ClientInvoiceListType) => void
  isSelected: (index: number) => boolean
}) {
  const { row, user, selected, handleRowClick, isSelected } = props

  const { data: statusList } = useGetStatusList('InvoiceReceivable')
  const statusLabel =
    statusList?.find(i => i.value === row.invoiceStatus)?.label || ''

  const separateLine = () => {
    return (
      <TableCell
        sx={{
          height: '54px',

          padding: '16px 0',
          textAlign: 'center',
          flex: 0.0096,
        }}
      ></TableCell>
    )
  }

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          maxHeight: '54px',
          height: '54px',
          display: 'flex',
          cursor: 'pointer',
        }}
        // hover
        onClick={event => {
          handleRowClick(row)
        }}
        // selected={isSelected(row.id)}
      >
        <TableCell
          sx={{
            height: '54px',
            maxWidth: '50px',
            width: '50px',
            flex: 0.04,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          size='small'
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isSelected(row.id) ? (
              <KeyboardArrowUpIcon color='action' />
            ) : (
              <KeyboardArrowDownIcon color='action' />
            )}
          </Box>
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            display: 'flex',
            alignItems: 'center',
            minWidth: '122px',
            flex: 0.0976,
          }}
          size='small'
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(76, 78, 100, 0.87)',
            }}
          >
            {row.corporationId}
          </Typography>
        </TableCell>
        {separateLine()}

        <TableCell
          sx={{
            height: '54px',
            display: 'flex',

            alignItems: 'center',
            flex: 0.1952,
            minWidth: '244px',
          }}
          size='small'
        >
          <Typography variant='body1'>{row.orders.projectName}</Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            height: '54px',
            display: 'flex',

            alignItems: 'center',
            flex: 0.1456,
            minWidth: '149px',
          }}
          size='small'
        >
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {formatCurrency(row.totalPrice, row.currency ?? 'USD')}
          </Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            // paddingRight: '0 !important',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flex: 0.224,
            minWidth: '280px',
          }}
          size='small'
        >
          <Typography variant='body1'>
            {convertTimeToTimezone(row.invoicedAt, user.timezone)}
          </Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 0.224,
            minWidth: '280px',
          }}
          size='small'
        >
          <Typography variant='body1'>
            {convertTimeToTimezone(row.payDueAt, row.payDueTimezone)}
          </Typography>
        </TableCell>
        {separateLine()}
        <TableCell
          sx={{
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            flex: 0.0992,
            minWidth: '124px',
          }}
          size='small'
        >
          {InvoiceReceivableChip(statusLabel, row.invoiceStatus)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ p: '0 !important' }}>
          <Collapse in={row.id === selected} timeout='auto' unmountOnExit>
            <Grid container xs={12} padding='20px 64px'>
              <Grid item xs={3}>
                <Title>Invoice description</Title>
                <Desc>{row.description ?? '-'}</Desc>
              </Grid>
            </Grid>
            {/* <Grid container xs={12} padding='0 60px 20px 60px'>
              <Grid item xs={4}>
                <Title>Rounding procedure</Title>
                <Desc>{row.roundingProcedure}</Desc>
              </Grid>
            </Grid> */}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const Title = styled(Typography)`
  color: #4c4e64;
  font-size: 0.875rem;
  font-weight: 700;
`
const Desc = styled(Typography)`
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
