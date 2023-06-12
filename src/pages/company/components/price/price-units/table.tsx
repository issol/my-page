// ** react
import { Fragment, useState } from 'react'

// ** mui
import {
  Checkbox,
  IconButton,
  TablePagination,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {
  PriceUnitDataType,
  PriceUnitFormType,
  PriceUnitType,
} from '@src/apis/price-units.api'
import Switch from '@mui/material/Switch'

import styled, { css } from 'styled-components'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import logger from '@src/@core/utils/logger'

// ** components
import TableMenu from './table-menu'
import AddForm from './add-form'
import EditForm from './edit-form'

// ** type
import { UserDataType } from '@src/context/types'

type Props = {
  skip: number
  pageSize: number
  setSkip: (n: number) => void
  setPageSize: (n: number) => void
  list: PriceUnitDataType
  onEditClick: (row: PriceUnitType) => void
  onDeleteClick: (row: PriceUnitType) => void
  onBasePriceClick: (isChecked: boolean, row: PriceUnitType) => void
  addMutation: (row: PriceUnitFormType) => void
  saveMutation: (row: PriceUnitFormType) => void
  editModeRow: PriceUnitType | undefined
  cancelEditing: () => void
  onToggleActive: (id: number, value: boolean) => void
  abilityCheck: (can: 'create' | 'update' | 'delete', id: number) => boolean
  user: UserDataType | null
}

export default function PriceUnitTable({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  onEditClick,
  onDeleteClick,
  onBasePriceClick,
  addMutation,
  saveMutation,
  editModeRow,
  cancelEditing,
  onToggleActive,
  abilityCheck,
  user,
}: Props) {
  const Row = (props: { row: PriceUnitType }) => {
    // ** Props
    const { row } = props

    const [open, setOpen] = useState<boolean>(false)

    return (
      <Fragment>
        {editModeRow?.id === row.id ? (
          <EditForm
            data={editModeRow}
            mutation={saveMutation}
            onEditCancel={cancelEditing}
          />
        ) : (
          <Fragment>
            <CustomTableRow
              isDisabled={!!editModeRow}
              sx={{
                '& > *': { borderBottom: 'unset' },
              }}
            >
              <TableCell component='th' scope='row'>
                <Checkbox
                  name='base_price'
                  checked={row.isBase}
                  disabled={!abilityCheck('update', user?.id!)}
                  onChange={e => onBasePriceClick(e.currentTarget.checked, row)}
                />
                {row.isBase ? (
                  <IconButton
                    aria-label='expand row'
                    size='small'
                    onClick={() => setOpen(!open)}
                  >
                    <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                  </IconButton>
                ) : null}
              </TableCell>
              <TableCell align='left'>
                <Typography sx={{ fontWeight: 'bold' }}>{row.title}</Typography>
              </TableCell>
              <TableCell align='left'>{row.unit ?? '-'}</TableCell>
              <TableCell align='left'>
                {row.weighting ? `${row.weighting}%` : '-'}
              </TableCell>
              <TableCell align='left'>
                <Switch
                  checked={row.isActive}
                  onChange={e => onToggleActive(row.id, e.target.checked)}
                  disabled={!abilityCheck('update', user?.id!)}
                />
              </TableCell>
              <TableCell align='left'>
                <TableMenu
                  row={row}
                  onEditClick={() => onEditClick(row)}
                  onDeleteClick={onDeleteClick}
                  abilityCheck={abilityCheck}
                  userId={user?.id!}
                />
              </TableCell>
            </CustomTableRow>
            {open
              ? row.subPriceUnits?.map(subItem => (
                  <CustomTableRow
                    sx={{ '& > *': { borderBottom: 'unset' } }}
                    key={subItem.id}
                    isDisabled={!!editModeRow}
                  >
                    <TableCell component='th' scope='row'></TableCell>
                    <TableCell align='left'>
                      <Box display='flex' alignItems='center' gap='8px'>
                        <Icon
                          icon='material-symbols:subdirectory-arrow-right'
                          opacity={0.7}
                        />
                        <Typography>{subItem.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align='left'>{subItem.unit ?? '-'}</TableCell>
                    <TableCell align='left'>
                      {subItem.weighting ? `${subItem.weighting}%` : '-'}
                    </TableCell>
                    <TableCell align='left'>
                      <Switch
                        checked={subItem.isActive}
                        onChange={e =>
                          onToggleActive(subItem.id, e.target.checked)
                        }
                        disabled={!abilityCheck('update', user?.id!)}
                      />
                    </TableCell>
                    <TableCell align='left'></TableCell>
                  </CustomTableRow>
                ))
              : null}
          </Fragment>
        )}
      </Fragment>
    )
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label='price unit list'>
          <TableHead style={{ background: '#F5F5F7', textTransform: 'none' }}>
            <TableRow>
              <HeaderCell
                align='left'
                sx={{
                  minWidth: '100px',
                }}
              >
                Base price
                <IconButton aria-label='expand row' size='small'>
                  <Icon icon='mdi:chevron-down' />
                </IconButton>
              </HeaderCell>
              <HeaderCell align='left' sx={{ minWidth: '230px' }}>
                Price unit
              </HeaderCell>
              <HeaderCell align='left'>Unit</HeaderCell>
              <HeaderCell align='left' sx={{ minWidth: '100px' }}>
                Weighting (%)
              </HeaderCell>
              <HeaderCell align='left'>Active</HeaderCell>
              <TableCell align='left'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {abilityCheck('create', user?.id!) ? (
              <>
                <AddForm
                  mutation={addMutation}
                  shouldDisabled={!!editModeRow}
                />

                <TableCell colSpan={6} style={{ padding: 0 }}>
                  <Divider />
                </TableCell>
              </>
            ) : null}

            {!list.data?.length ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <Typography>There are no price units</Typography>
                </TableCell>
              </TableRow>
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

const Divider = styled.div`
  width: 100%;
  height: 10px;
  background: #f5f5f7;
`

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

export const CustomTableRow = styled(TableRow)<{ isDisabled?: boolean }>`
  border-bottom: 1px solid rgba(76, 78, 100, 0.12);
  ${({ isDisabled }) =>
    isDisabled
      ? css`
      pointer-events:none;
          position: relative;
          filter: grayscale(100%);
            &::after {
              position: absolute;
              width: 100%;
              height:100%;
              top: 0;
              left: 0;
              content: "";
              background: rgba(76, 78, 100, 0.12);
              mix-blend-mode:revert;
              filter: grayscale(100%);
  `
      : ``}
`
