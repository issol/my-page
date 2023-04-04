// ** react
import { Fragment, MouseEvent, useState } from 'react'

// ** mui
import {
  Button,
  Card,
  Checkbox,
  Grid,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import { PriceUnitDataType, PriceUnitType } from '@src/apis/price-units.api'
import Switch from '@mui/material/Switch'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import TableMenu from './table-menu'
import logger from '@src/@core/utils/logger'

type Props = {
  skip: number
  pageSize: number
  setSkip: (n: number) => void
  setPageSize: (n: number) => void
  list: PriceUnitDataType
}

export default function PriceUnitTable({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
}: Props) {
  function onEditClick(id: number) {
    logger.info(id)
  }

  function onDeleteClick(row: PriceUnitType) {
    logger.info(row)
  }

  const Row = (props: { row: PriceUnitType }) => {
    // ** Props
    const { row } = props

    return (
      <Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell component='th' scope='row'>
            <Checkbox name='base_price' checked={row.isBasePrice} />
          </TableCell>
          <TableCell align='left'>
            <Typography sx={{ fontWeight: 'bold' }}>{row.priceUnit}</Typography>
          </TableCell>
          <TableCell align='left'>{row.unit ?? '-'}</TableCell>
          <TableCell align='left'>{row.weighting ?? '-'}</TableCell>
          <TableCell align='left'>
            <Switch checked={row.isActive} />
          </TableCell>
          <TableCell align='left'>
            <TableMenu
              row={row}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          </TableCell>
        </TableRow>
      </Fragment>
    )
  }

  return (
    <Box
      sx={{
        '& .hide': {
          position: 'relative',
          filter: 'grayscale(100%)',
          '&:hover': {
            background: 'rgba(76, 78, 100, 0.12)',
          },
          '&::after': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            content: "''",
            background: 'rgba(76, 78, 100, 0.12)',
            mixBlendMode: 'revert',
            filter: 'grayscale(100%)',
          },
        },
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label='price unit list'>
          <TableHead style={{ background: '#F5F5F7', textTransform: 'none' }}>
            <TableRow>
              <TableCell>Base price</TableCell>
              <TableCell align='left'>Price unit</TableCell>
              <TableCell align='left'>Unit</TableCell>
              <TableCell align='left'>Weighting (%)</TableCell>
              <TableCell align='left'>Active</TableCell>
              <TableCell align='left'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!list.data?.length ? (
              <TableCell colSpan={6} align='center'>
                <Typography>There are no price units</Typography>
              </TableCell>
            ) : (
              list.data?.map(row => <Row key={row.id} row={row} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        page={skip}
        component='div'
        count={list.totalCount}
        rowsPerPage={pageSize}
        onPageChange={(e, page) => setSkip(page)}
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={e => setPageSize(Number(e.target.value))}
      />
    </Box>
  )
}
