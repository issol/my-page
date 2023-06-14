import { Card, IconButton, TablePagination } from '@mui/material'
import { Fragment } from 'react'
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
import styled from 'styled-components'

export default function InvoiceJobList() {
  function Row() {
    return (
      <TableRow>
        <TableCell>
          <IconButton>
            <Icon icon='mdi:chevron-down' fontSize={18} />
          </IconButton>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
    )
  }
  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead style={{ background: '#F5F5F7', textTransform: 'none' }}>
            <TableRow>
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
            {/* {list?.map(row => (
              <Row
                key={uuidv4()}
                row={row}
                onClickEditPrice={onClickEditPrice}
                onClickDeletePrice={onClickDeletePrice}
                setSelectedRow={setSelectedRow}
                selected={selected}
                handleRowClick={handleRowClick}
                isSelected={isSelected}
              />
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        page={skip}
        component='div'
        count={list.totalCount}
        rowsPerPage={pageSize}
        onPageChange={(e, page) => setSkip(page)}
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={e => setPageSize(Number(e.target.value))}
      /> */}
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
