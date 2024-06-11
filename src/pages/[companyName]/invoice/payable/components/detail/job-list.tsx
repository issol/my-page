import { Checkbox, IconButton, TablePagination } from '@mui/material'
import { Fragment, useState } from 'react'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Icon } from '@iconify/react'
import { css, styled } from '@mui/system'
import { InvoicePayableJobType } from '@src/types/invoice/payable.type'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'

import {
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { getCurrentRole } from '@src/shared/auth/storage'
import { ClientUserType, UserDataType } from '@src/context/types'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { Currency } from '@src/types/common/currency.type'

type Props = {
  data: {
    count: number
    totalCount: number
    data: InvoicePayableJobType[]
  }
  currency: Currency | undefined
  onRowClick: (id: number) => void
  selectedJobs: number[]
  setSelectedJobs: (id: number[]) => void
  isUpdatable: boolean
  auth: {
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }
}
export default function InvoiceJobList({
  data,
  currency,
  onRowClick,
  selectedJobs,
  setSelectedJobs,
  isUpdatable,
  auth,
}: Props) {
  const router = useRouter()
  const { data: jobList } = data

  const currentRole = getCurrentRole()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isAllSelected, setIsAllSelected] = useState(false)

  function Row({ item }: { item: InvoicePayableJobType }) {
    const [open, setOpen] = useState(false)
    const currencyMark = getCurrencyMark(currency)
    const disabledTextUi = {
      textDecoration: item.isRemove ? 'line-through' : '',
    }

    const priceNames = item?.prices?.map(price => price.name)
    const prices = item?.prices?.map(price => {
      return `${formatCurrency(price.prices, currency!)}`
    })

    const priceUnits = item?.prices?.map(price => {
      const unitPrice = `${formatCurrency(price.unitPrice, currency!)}`
      const priceUnit =
        price.quantity < 1 ? unitPrice : `(${unitPrice} X ${price.quantity})`

      return priceUnit
    })

    return (
      <Fragment>
        <CustomTableRow $isDisabled={item.isRemove}>
          {currentRole && currentRole.name === 'PRO' ? null : (
            <TableCell sx={{ width: '65px', maxWidth: '65px' }}>
              <Checkbox
                disabled={!isUpdatable}
                checked={selectedJobs.includes(item.id)}
                onChange={() => setSelectedJobs([...selectedJobs, item.id])}
              />
            </TableCell>
          )}

          <TableCell sx={{ width: '50px', maxWidth: '50px' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.isRemove ? (
                <Icon
                  icon='ic:sharp-remove-circle-outline'
                  fontSize={24}
                  color='#FF4D49'
                />
              ) : (
                <IconButton onClick={() => setOpen(!open)}>
                  <Icon
                    icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                    fontSize={24}
                  />
                </IconButton>
              )}
            </Box>
          </TableCell>
          {/* No. */}
          <TableCell sx={{ flex: 0.1639 }}>
            <Typography
              sx={{
                textDecoration: item.isRemove ? 'line-through' : 'underline',
                cursor: item.isRemove ? 'inherit' : 'pointer',
              }}
              variant='body1'
              color='secondary'
              onClick={() => {
                if (auth?.user?.roles?.some(role => role.name === 'PRO')) {
                  router.push(`/jobs/detail/${item.id}`)
                } else {
                  onRowClick(item.id)
                }
              }}
            >
              {item.corporationId}
            </Typography>
          </TableCell>
          {/* Job (Service type) */}
          <TableCell sx={{ flex: 0.1967 }}>
            <ServiceTypeChip label={item.serviceType} size='small' />
          </TableCell>
          {/* Job name */}
          <TableCell sx={{ flex: 0.2705 }}>
            <Typography sx={disabledTextUi}>{item.name}</Typography>
          </TableCell>
          {/* Prices */}
          <TableCell sx={{ flex: 0.1148 }}>
            <Typography fontWeight={600} sx={disabledTextUi}>
              {/* {`${currencyMark} ${item.totalPrice?.toLocaleString()}`} */}
              {formatCurrency(item.totalPrice, currency!)}
            </Typography>
          </TableCell>
          {/* Contact person */}
          <TableCell
            sx={{
              textDecoration: item.isRemove ? 'line-through' : '',
              flex: 0.2131,
            }}
          >
            {item.contactPerson}
          </TableCell>
        </CustomTableRow>
        {open ? (
          <TableRow>
            <TableCell colSpan={5}>
              <Box paddingLeft={30}>
                <Typography fontSize={14} fontWeight={600}>
                  Price details
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: '24px',
                    marginLeft: '8px',
                    marginTop: '10px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
                    {priceNames.map(value => {
                      return (
                        <Typography
                          key={uuidv4()}
                          fontWeight={600}
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <Typography fontSize={10} component={'span'}>
                            ⦁
                          </Typography>
                          {value}
                        </Typography>
                      )
                    })}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
                    {priceUnits.map(value => {
                      return (
                        <Typography
                          key={uuidv4()}
                          variant='body2'
                          fontSize={16}
                          lineHeight={1.5}
                        >
                          {value}
                        </Typography>
                      )
                    })}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
                    {prices.map(value => {
                      return (
                        <Typography
                          key={uuidv4()}
                          variant='body2'
                          fontSize={16}
                          lineHeight={1.5}
                        >
                          {value}
                        </Typography>
                      )
                    })}
                  </Box>
                </Box>
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
      {currentRole ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label='collapsible table'>
              <TableHead
                style={{
                  background: '#F5F5F7',
                  textTransform: 'none',
                  width: '100%',
                }}
              >
                <TableRow>
                  {currentRole.name === 'PRO' ? null : (
                    <HeaderCell>
                      <Checkbox onChange={selectAll} />
                    </HeaderCell>
                  )}

                  <HeaderCell>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        icon='mdi:chevron-down'
                        fontSize={24}
                        color='#4C4E6499'
                      />
                    </Box>
                  </HeaderCell>
                  <HeaderCell align='left'>
                    <Typography variant='subtitle1' fontSize={14}>
                      No.
                    </Typography>
                  </HeaderCell>
                  <HeaderCell align='left'>
                    <Typography variant='subtitle1' fontSize={14}>
                      Job
                    </Typography>
                  </HeaderCell>
                  <HeaderCell align='left'>
                    <Typography variant='subtitle1' fontSize={14}>
                      Job name
                    </Typography>
                  </HeaderCell>
                  <HeaderCell align='left'>
                    <Typography variant='subtitle1' fontSize={14}>
                      Prices
                    </Typography>
                  </HeaderCell>
                  <HeaderCell align='left'>
                    <Typography variant='subtitle1' fontSize={14}>
                      Contact person for job
                    </Typography>
                  </HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobList
                  ?.slice(page * pageSize, page * pageSize + pageSize)
                  ?.map((item, idx) => <Row key={idx} item={item} />)}
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
        </>
      ) : null}
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
        pointer-events: none;
        position: relative;
        width: 100%;

        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          mix-blend-mode: multiply;
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49;
      `
      : ``}
`
