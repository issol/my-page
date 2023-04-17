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

import { Row } from './price-list-row'
import TablePagination from '@mui/material/TablePagination'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useState, MouseEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  list: StandardPriceListType[]
  listCount: number
  isLoading: boolean
  listPage: number
  setListPage: Dispatch<SetStateAction<number>>
  listPageSize: number
  setListPageSize: Dispatch<SetStateAction<number>>
  onClickAddNewPrice: () => void
  onClickEditPrice: (priceData: StandardPriceListType) => void
  onClickDeletePrice: (priceData: StandardPriceListType) => void
  setSelectedRow: Dispatch<SetStateAction<StandardPriceListType | null>>
  handleRowClick: (row: StandardPriceListType) => void
  isSelected: (index: number) => boolean
  selected: number | null
}
const PriceList = ({
  list,
  listCount,
  isLoading,
  listPage,
  setListPage,
  listPageSize,
  setListPageSize,
  onClickAddNewPrice,
  onClickEditPrice,
  setSelectedRow,
  onClickDeletePrice,
  handleRowClick,
  isSelected,
  selected,
}: Props) => {
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
        <Typography variant='h6'>
          Standard client prices ({listCount ?? 0})
        </Typography>
        <Button variant='contained' onClick={onClickAddNewPrice}>
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
                {list?.map(row => (
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
                ))}
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

      {/* <Box
    sx={{
      '& .MuiDataGrid-columnHeaderTitle': {
        textTransform: 'none',
      },
      '& .MuiDataGrid-columnHeader.price-collapsible': {
        padding: '0 !important',
        paddingLeft: '0 !important',

        display: 'flex',
        justifyContent: 'center',

        '& .MuiDataGrid-columnHeaderTitleContainerContent': {
          margin: '0 auto',
        },
      },
    }}
  >
    <DataGrid
      components={{
        NoRowsOverlay: () => {
          return (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant='subtitle1'>
                There are no Pros
              </Typography>
            </Box>
          )
        },
        NoResultsOverlay: () => {
          return (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant='subtitle1'>
                There are no Pros
              </Typography>
            </Box>
          )
        },
      }}
      sx={{ overflowX: 'scroll' }}
      columns={getStandardPriceColumns()}
      loading={isLoading}
      rows={list ?? []}
      autoHeight
      disableSelectionOnClick
      paginationMode='server'
      pageSize={standardClientPriceListPageSize}
      rowsPerPageOptions={[5, 10, 25, 50]}
      page={standardClientPriceListPage}
      rowCount={listCount}

      // onPageChange={(newPage: number) => {
      //   setFilters((prevState: ProListFilterType) => ({
      //     ...prevState,
      //     skip: newPage * proListPageSize,
      //   }))
      //   setProListPage(newPage)
      // }}
      // onPageSizeChange={(newPageSize: number) => {
      //   setFilters((prevState: ProListFilterType) => ({
      //     ...prevState,
      //     take: newPageSize,
      //   }))
      //   setProListPageSize(newPageSize)
      // }}
    />
  </Box> */}
    </Card>
  )
}

export default PriceList
