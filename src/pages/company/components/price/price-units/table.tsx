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
import AddMode from './add-mode'

type Props = {
  skip: number
  pageSize: number
  setSkip: (n: number) => void
  setPageSize: (n: number) => void
  list: PriceUnitDataType
}

/** TODO
 * 1. onEdit, onDelete함수 완성
 * 2. onEdit, onDelete시 모달 추가
 * 3. isActive 활성화 로직 추가
 * 4. editMode 컴포넌트 심기
 * 5. editMode가 있는 경우 나머지 row비활성화 처리
 * 6. subPrice도 display
 * 7. basePrice 체크/해제 시 모달 추가
 * 8. basePrice 체크 시 자동 editMode되는 로직 추가
 *
 */
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

  function onAdd(data: any) {
    console.log(data)
  }

  return (
    <Box>
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
            <AddMode />
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
