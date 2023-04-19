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
import { StandardPriceListType } from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useState, MouseEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Row from '../standard-prices/component/price-list-row'

type Props = {
  list: StandardPriceListType[] | []
  listCount: number
  isLoading: boolean
  listPage: number
  setListPage: Dispatch<SetStateAction<number>>
  listPageSize: number
  setListPageSize: Dispatch<SetStateAction<number>>
  onAddPrice: () => void
  onEditPrice: (priceData: StandardPriceListType) => void
  onDeletePrice: (priceData: StandardPriceListType) => void
  setSelectedRow: Dispatch<SetStateAction<StandardPriceListType | null>>
}
const ClientPriceList = ({
  list,
  listCount,
  isLoading,
  listPage,
  setListPage,
  listPageSize,
  setListPageSize,
  onAddPrice,
  onEditPrice,
  setSelectedRow,
  onDeletePrice,
}: Props) => {
  const [selected, setSelected] = useState<number | null>(null)

  const handleRowClick = (row: StandardPriceListType) => {
    if (row.id === selected) {
      setSelected(null)
      setSelectedRow(null)
    } else {
      setSelected(row.id)
      setSelectedRow(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }
  return (
    <Card sx={{ padding: '20px 0' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 20px 20px',
        }}
      >
        <Typography variant='h6'>Client prices ({listCount ?? 0})</Typography>
        <Button variant='contained' onClick={onAddPrice}>
          Add new price
        </Button>
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
                      flex: 0.34,
                    }}
                    size='small'
                  >
                    <Box>Price name</Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      height: '54px',
                      width: '12px',
                      padding: '16px 0',
                      textAlign: 'center',
                      flex: 0.0096,
                    }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      fontSize: '14px !important',
                      // paddingRight: '0 !important',
                      display: 'flex',
                      alignItems: 'center',
                      flex: 0.136,
                    }}
                    size='small'
                  >
                    <Box>Category</Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      height: '54px',
                      width: '12px',
                      padding: '16px 0',
                      textAlign: 'center',
                      flex: 0.0096,
                    }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      fontSize: '14px !important',
                      // paddingRight: '0 !important',
                      display: 'flex',
                      alignItems: 'center',
                      flex: 0.264,
                    }}
                    size='small'
                  >
                    <Box>Service type</Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      height: '54px',

                      padding: '16px 0',
                      textAlign: 'center',
                      flex: 0.0096,
                    }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      fontSize: '14px !important',
                      // paddingRight: '0 !important',
                      display: 'flex',
                      alignItems: 'center',
                      flex: 0.096,
                    }}
                    size='small'
                  >
                    <Box>Currency</Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      height: '54px',

                      padding: '16px 0',
                      textAlign: 'center',
                      flex: 0.0096,
                    }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      fontSize: '14px !important',
                      // paddingRight: '0 !important',
                      display: 'flex',

                      alignItems: 'center',
                      flex: 0.104,
                    }}
                    size='small'
                  >
                    <Box>CAT basis</Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      height: '54px',
                      padding: '16px 0',
                      textAlign: 'center',
                      flex: 0.0096,
                    }}
                  >
                    <img
                      src='/images/icons/pro-icons/seperator.svg'
                      alt='sep'
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      height: '54px',

                      fontWeight: '400 !important',
                      fontSize: '14px !important',
                      // paddingRight: '0 !important',
                      display: 'flex',
                      alignItems: 'center',
                      flex: 0.056,
                    }}
                    size='small'
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!list?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      <Typography>There are no client prices</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  list?.map(row => (
                    <Row
                      key={uuidv4()}
                      row={row}
                      onClickEditPrice={onEditPrice}
                      onClickDeletePrice={onDeletePrice}
                      setSelectedRow={setSelectedRow}
                      selected={selected}
                      handleRowClick={handleRowClick}
                      isSelected={isSelected}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            page={listPage ?? 0}
            component='div'
            count={listCount ?? 0}
            rowsPerPage={listPageSize ?? 0}
            onPageChange={(e, page) => setListPage(page)}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={e => setListPageSize(Number(e.target.value))}
          />
        </>
      )}
    </Card>
  )
}

export default ClientPriceList
