import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'

import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import TablePagination from '@mui/material/TablePagination'

import { Dispatch, SetStateAction, useState, MouseEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ClientProjectsRows from './list-row'
import {
  ClientInvoiceListType,
  ClientProjectListType,
} from '@src/types/client/client-projects.type'
import { UserDataType } from '@src/context/types'
import ClientInvoicesRows from './list-row'

type Props = {
  isCardHeader?: boolean
  list: ClientInvoiceListType[]
  listCount?: number
  isLoading?: boolean
  listPage?: number
  setListPage?: Dispatch<SetStateAction<number>>
  listPageSize?: number
  setListPageSize?: Dispatch<SetStateAction<number>>
  user: UserDataType
  handleRowClick: (row: ClientInvoiceListType) => void
  isSelected: (index: number) => boolean
  selected: number | null
  title?: string
}
const ClientInvoiceList = ({
  isCardHeader,
  list,
  listCount,
  isLoading,
  listPage,
  setListPage,
  listPageSize,
  setListPageSize,
  user,
  handleRowClick,
  isSelected,
  selected,
  title,
}: Props) => {
  const separateLine = () => {
    return (
      <TableCell
        sx={{
          height: '54px',

          padding: '16px 0',
          textAlign: 'center',
          flex: 0.0096,
        }}
      >
        <img src='/images/icons/pro-icons/seperator.svg' alt='sep' />
      </TableCell>
    )
  }

  return (
    <>
      {isCardHeader ? (
        <Card sx={{ padding: '20px 0' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px 20px 20px',
            }}
          >
            <Typography variant='h6'>
              {title} ({listCount ?? 0})
            </Typography>
          </Box>
          {isLoading ? null : (
            <>
              <TableContainer component={Paper}>
                <Table aria-label='collapsible table'>
                  <TableHead
                    sx={{
                      background: '#F5F5F7',
                      maxHeight: '54px',
                      textTransform: 'none',
                      width: '100%',
                      display: 'flex',
                    }}
                  >
                    <TableRow
                      sx={{
                        maxHeight: '54px',
                        height: '54px',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          flex: 0.04,
                          maxWidth: '50px',
                          width: '50px',
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
                          <KeyboardArrowDownIcon color='action' />
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          height: '54px',

                          fontWeight: '400 !important',
                          fontSize: '14px !important',
                          // paddingRight: '0 !important',
                          display: 'flex !important',
                          alignItems: 'center',
                          flex: 0.0976,
                          minWidth: '122px',
                        }}
                        size='small'
                      >
                        <Box>No.</Box>
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
                          flex: 0.1952,
                          minWidth: '244px',
                        }}
                        size='small'
                      >
                        <Box>Project name</Box>
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
                          flex: 0.1456,
                          minWidth: '149px',
                        }}
                        size='small'
                      >
                        <Box>Amount</Box>
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
                          flex: 0.224,
                          minWidth: '280px',
                        }}
                        size='small'
                      >
                        <Box>Invoiced date</Box>
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
                          flex: 0.224,
                          minWidth: '280px',
                        }}
                        size='small'
                      >
                        <Box>Payment due</Box>
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
                          flex: 0.0992,
                          minWidth: '124px',
                        }}
                        size='small'
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.length ? (
                      list?.map(row => (
                        <ClientInvoicesRows
                          key={uuidv4()}
                          row={row}
                          selected={selected}
                          handleRowClick={handleRowClick}
                          isSelected={isSelected}
                          user={user}
                        />
                      ))
                    ) : (
                      <Box
                        sx={{
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingRight: '150px',
                        }}
                      >
                        <Typography variant='subtitle1'>
                          There are no invoices for this client
                        </Typography>
                      </Box>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                page={listPage ?? 0}
                component='div'
                count={listCount ?? 0}
                rowsPerPage={listPageSize ?? 0}
                onPageChange={(e, page) => setListPage!(page)}
                rowsPerPageOptions={[10, 25, 50]}
                onRowsPerPageChange={e =>
                  setListPageSize!(Number(e.target.value))
                }
              />
            </>
          )}
        </Card>
      ) : (
        <Card>
          <TableContainer component={Paper}>
            <Table aria-label='collapsible table'>
              <TableHead
                sx={{
                  background: '#F5F5F7',
                  maxHeight: '54px',
                  textTransform: 'none',
                  width: '100%',
                  display: 'flex',
                }}
              >
                <TableRow
                  sx={{
                    maxHeight: '54px',
                    height: '54px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      flex: 0.04,
                      maxWidth: '50px',
                      width: '50px',
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
                      <KeyboardArrowDownIcon color='action' />
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      fontSize: '14px !important',
                      // paddingRight: '0 !important',
                      display: 'flex !important',
                      alignItems: 'center',
                      flex: 0.0976,
                      minWidth: '122px',
                    }}
                    size='small'
                  >
                    <Box>No.</Box>
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
                      flex: 0.1952,
                      minWidth: '244px',
                    }}
                    size='small'
                  >
                    <Box>Invoice name</Box>
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
                      flex: 0.1456,
                      minWidth: '149px',
                    }}
                    size='small'
                  >
                    <Box>Amount</Box>
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
                      flex: 0.224,
                      minWidth: '280px',
                    }}
                    size='small'
                  >
                    <Box>Invoiced date</Box>
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
                      flex: 0.224,
                      minWidth: '280px',
                    }}
                    size='small'
                  >
                    <Box>Payment due</Box>
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
                      flex: 0.0992,
                      minWidth: '124px',
                    }}
                    size='small'
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.length ? (
                  list?.map(row => (
                    <ClientInvoicesRows
                      key={uuidv4()}
                      row={row}
                      selected={selected}
                      handleRowClick={handleRowClick}
                      isSelected={isSelected}
                      user={user}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: '150px',
                    }}
                  >
                    <Typography variant='subtitle1'>
                      There are no invoices for this client
                    </Typography>
                  </Box>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  )
}

export default ClientInvoiceList
