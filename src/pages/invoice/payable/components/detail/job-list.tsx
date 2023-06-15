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

/* TODO:
실데이터 표기로 교체
disabled디자인 추가하기 (text decoration)

*/

type Props = {
  onRowClick: (id: number) => void
  selectedJobs: number[]
  setSelectedJobs: (id: number[]) => void
  isUpdatable: boolean
}
export default function InvoiceJobList({
  onRowClick,
  selectedJobs,
  setSelectedJobs,
  isUpdatable,
}: Props) {
  function Row() {
    const [open, setOpen] = useState(false)
    return (
      <Fragment>
        <CustomTableRow isDisabled={false}>
          <TableCell>
            <Checkbox disabled={!isUpdatable} />
          </TableCell>
          <TableCell>
            <IconButton onClick={() => setOpen(!open)}>
              <Icon
                icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                fontSize={18}
              />
            </IconButton>
          </TableCell>

          <TableCell sx={{ textDecoration: 'line-through' }}>
            <Button
              variant='text'
              color='secondary'
              onClick={() => onRowClick(9)}
            >
              dd
            </Button>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </CustomTableRow>
        {open ? (
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell colSpan={5}>
              <Box>
                <Typography fontSize={14} fontWeight={600}>
                  Price details
                </Typography>
                <ul>
                  <li>
                    <Box display='flex' gap='24px'>
                      <Typography fontWeight={600}>Munute subtitle</Typography>
                      <Typography variant='body2'>(2,000 X 15)</Typography>
                      <Typography variant='body2'>30,000</Typography>
                    </Box>
                  </li>
                </ul>
              </Box>
            </TableCell>
          </TableRow>
        ) : null}
      </Fragment>
    )
  }
  return (
    <Fragment>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead style={{ background: '#F5F5F7', textTransform: 'none' }}>
            <TableRow>
              <HeaderCell width='18px'>
                <Checkbox /* onClick={()=> setSelectedJobs()} */ />
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
            {[1]?.map((row, idx) => (
              <Row key={idx} />
            ))}
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

const CustomTableRow = styled(TableRow)<{ isDisabled?: boolean }>`
  border-bottom: 1px solid rgba(76, 78, 100, 0.12);
  ${({ isDisabled }) =>
    isDisabled
      ? css`
      pointer-events:none;
          position: relative;
            &::after {
              position: absolute;
              width: 100%;
              height:100%;
              top: 0;
              left: 0;
              content: "";
              mix-blend-mode:multiply;
              background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49;
  `
      : ``}
`
