import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { getStandardPriceColumns } from '@src/shared/const/columns/standard-price'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Icon from 'src/@core/components/icon'

import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Divider from '@mui/material/Divider'
import { JobTypeChip, ServiceTypeChip } from '@src/@core/components/chips/chips'
import TablePagination from '@mui/material/TablePagination'

function Row(props: { row: StandardPriceListType }) {
  const { row } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          maxHeight: '54px',
          height: '54px',
          display: 'flex',
        }}
      >
        <TableCell
          sx={{
            height: '54px',
            maxWidth: '50px',
            width: '50px',
            flex: 0.04,

            justifyContent: 'center',
            alignItems: 'center',
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
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon color='action' />
            ) : (
              <KeyboardArrowDownIcon color='action' />
            )}
          </Box>
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            // paddingRight: '0 !important',
            display: 'flex',
            alignItems: 'center',

            flex: 0.34,
          }}
          size='small'
        >
          <Box>{row.priceName}</Box>
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            flex: 0.136,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
          }}
          size='small'
        >
          <JobTypeChip type={row.category} label={row.category} />
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
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
          <ServiceTypeChip label={row.serviceType} />
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            flex: 0.096,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
          }}
          size='small'
        >
          {row.currency}
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            flex: 0.104,
            height: '54px',
            display: 'flex',
            alignItems: 'center',
          }}
          size='small'
        >
          {row.catBasis}
        </TableCell>
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        ></TableCell>
        <TableCell
          sx={{
            height: '54px',

            fontWeight: '400 !important',
            fontSize: '14px !important',
            borderBottom: 'unset',
            // paddingRight: '0 !important',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 0.056,
          }}
          size='small'
        >
          <IconButton sx={{ width: '24px', height: '24px', padding: 0 }}>
            <Icon icon='mdi:dots-horizontal' />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                History
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

type Props = {
  list: StandardPriceListType[]
  listCount: number
  isLoading: boolean
  standardClientPriceListPage: number
  setStandardClientPriceListPage: Dispatch<SetStateAction<number>>
  standardClientPriceListPageSize: number
  setStandardClientPriceListPageSize: Dispatch<SetStateAction<number>>
}
const StandardPrices = ({
  list,
  listCount,
  isLoading,
  standardClientPriceListPage,
  setStandardClientPriceListPage,
  standardClientPriceListPageSize,
  setStandardClientPriceListPageSize,
}: Props) => {
  return (
    <Grid container xs={12} spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ padding: '20px 0' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px 20px 20px',
            }}
          >
            <Typography variant='h6'>Standard client prices ({0})</Typography>
            <Button variant='contained'>Add new price</Button>
          </Box>

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
                  <Row key={uuidv4()} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            page={standardClientPriceListPage}
            component='div'
            count={listCount}
            rowsPerPage={standardClientPriceListPageSize}
            onPageChange={(e, page) => setStandardClientPriceListPage(page)}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={e =>
              setStandardClientPriceListPageSize(Number(e.target.value))
            }
          />
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
      </Grid>
    </Grid>
  )
}

export default StandardPrices
