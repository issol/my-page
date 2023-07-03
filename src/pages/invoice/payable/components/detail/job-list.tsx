import { Card, Checkbox, IconButton, TablePagination } from '@mui/material'
import { Fragment, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'
import { InvoicePayableJobType } from '@src/types/invoice/payable.type'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { CurrencyType } from '@src/types/common/standard-price'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

type Props = {
  data: {
    count: number
    totalCount: number
    data: InvoicePayableJobType[]
  }
  currency: CurrencyType | undefined
  onRowClick: (id: number) => void
  selectedJobs: number[]
  setSelectedJobs: (id: number[]) => void
  isUpdatable: boolean
}
export default function InvoiceJobList({
  data,
  currency,
  onRowClick,
  selectedJobs,
  setSelectedJobs,
  isUpdatable,
}: Props) {
  const { data: jobList } = data

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isAllSelected, setIsAllSelected] = useState(false)

  function Row({ item }: { item: InvoicePayableJobType }) {
    const [open, setOpen] = useState(false)
    const currencyMark = getCurrencyMark(currency)
    const disabledTextUi = {
      textDecoration: !!item.deletedAt ? 'line-through' : '',
    }
    console.log('item', item)
    return (
      <Fragment>
        <CustomTableRow $isDisabled={!!item.deletedAt}>
          <TableCell>
            <Checkbox
              disabled={!isUpdatable}
              checked={selectedJobs.includes(item.id)}
              onChange={() => setSelectedJobs([...selectedJobs, item.id])}
            />
          </TableCell>
          <TableCell>
            <IconButton onClick={() => setOpen(!open)}>
              <Icon
                icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                fontSize={18}
              />
            </IconButton>
          </TableCell>
          {/* No. */}
          <TableCell sx={{ textDecoration: 'line-through' }}>
            <Button
              variant='text'
              color='secondary'
              onClick={() => onRowClick(9)}
            >
              <Typography sx={disabledTextUi}>{item.id}</Typography>
            </Button>
          </TableCell>
          {/* Job (Service type) */}
          <TableCell>
            <ServiceTypeChip label={item.serviceType} size='small' />
          </TableCell>
          {/* Job name */}
          <TableCell>
            <Typography sx={disabledTextUi}>{item.name}</Typography>
          </TableCell>
          {/* Prices */}
          <TableCell>
            <Typography
              fontWeight={600}
              sx={disabledTextUi}
            >{`${currencyMark} ${item.totalPrice?.toLocaleString()}`}</Typography>
          </TableCell>
          {/* Contact person */}
          <TableCell sx={disabledTextUi}>{item.contactPerson}</TableCell>
        </CustomTableRow>
        {open ? (
          <TableRow>
            <TableCell>{/* empty */}</TableCell>
            <TableCell>{/* empty */}</TableCell>
            <TableCell colSpan={5}>
              <Box>
                <Typography fontSize={14} fontWeight={600}>
                  Price details
                </Typography>
                <ul>
                  {item?.priceUnits?.map((price, i) => {
                    const unitPrice = `${currencyMark} ${price.unitPrice.toLocaleString()}`
                    const priceUnit =
                      price.quantity < 1
                        ? unitPrice
                        : `(${unitPrice} X ${price.quantity})`
                    return (
                      <li key={i}>
                        <Box display='flex' gap='24px' alignItems='center'>
                          <Typography fontWeight={600}>
                            {price?.title}
                          </Typography>
                          <Typography variant='body2'>{priceUnit}</Typography>
                          <Typography variant='body2'>
                            {`${currencyMark} ${price.prices.toLocaleString()}`}
                          </Typography>
                        </Box>
                      </li>
                    )
                  })}
                </ul>
              </Box>
            </TableCell>
          </TableRow>
        ) : null}
      </Fragment>
    )
  }

  function selectAll() {
    if (isAllSelected) {
      setIsAllSelected(false)
      setSelectedJobs([])
    } else {
      const ids = jobList
        ?.slice(page * pageSize, page * pageSize + pageSize)
        ?.map(job => job.id)
      setSelectedJobs(ids)
      setIsAllSelected(true)
    }
  }

  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead style={{ background: '#F5F5F7', textTransform: 'none' }}>
            <TableRow>
              <HeaderCell width='18px'>
                <Checkbox onChange={selectAll} />
              </HeaderCell>
              <HeaderCell width='18px'>
                <Icon icon='mdi:chevron-down' fontSize={18} />
              </HeaderCell>
              <HeaderCell align='left' width='200px'>
                No.
              </HeaderCell>
              <HeaderCell align='left' width='220px'>
                Job
              </HeaderCell>
              <HeaderCell align='left' width='200px'>
                Job name
              </HeaderCell>
              <HeaderCell align='left' width='200px'>
                Prices
              </HeaderCell>
              <HeaderCell align='left' width='230px'>
                Contact person for job
              </HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobList
              ?.slice(page * pageSize, page * pageSize + pageSize)
              ?.map((item, idx) => (
                <Row key={idx} item={item} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        page={page}
        component='div'
        count={data.totalCount}
        rowsPerPage={pageSize}
        onPageChange={(e, page) => setPage(page)}
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={e => setPageSize(Number(e.target.value))}
      />
    </Fragment>
  )
}

const HeaderCell = styled(TableCell)`
  height: 20px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 0px;
    width: 2px;
    height: 30%;
    background: rgba(76, 78, 100, 0.12);
  }
`

const CustomTableRow = styled(TableRow)<{ $isDisabled?: boolean }>`
  border-bottom: 1px solid rgba(76, 78, 100, 0.12);
  ${({ $isDisabled }) =>
    $isDisabled
      ? css`
      pointer-events:none;
      position: relative;
      width: 100%;
      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height:100%;
        top: 0;
        left: 0;
        mix-blend-mode:multiply;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49;
  `
      : ``}
`
