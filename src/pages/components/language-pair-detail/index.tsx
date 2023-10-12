// ** react
import { ChangeEvent, Fragment, useState } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Box, Grid, Typography } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** parent value imports
import { HeaderCell } from '@src/pages/orders/add-new'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

// ** types
import { LanguagePairTypeInItem } from '@src/types/orders/order-detail'
import { ItemType } from '@src/types/common/item.type'

type Props = {
  languagePairs: LanguagePairTypeInItem[]
  items?: ItemType[]
}
export default function LanguagePairTable({ languagePairs, items }: Props) {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const header = ['Language pair', 'Price unit']

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  function NoList() {
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
          There are no contact persons
        </Typography>
      </Box>
    )
  }

  return (
    <Fragment>
      {/* table */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {header.map((item, idx) => (
                  <HeaderCell
                    style={{ padding: '8px 16px' }}
                    key={idx}
                    align='left'
                  >
                    {item}
                  </HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!items?.length ? (
                <TableRow hover tabIndex={-1}>
                  <TableCell colSpan={3} align='center'>
                    There are no language pairs
                  </TableCell>
                </TableRow>
              ) : null}
              {items && items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>
                        <Box display='flex' alignItems='center' gap='4px'>
                          <Typography fontWeight='bold' variant='body2'>
                            {/* {languageHelper(row.source)} */}
                            {languageHelper(items?.[idx].sourceLanguage)}
                          </Typography>

                          <Icon
                            icon='material-symbols:arrow-forward'
                            fontSize='20px'
                            opacity={0.7}
                          />
                          <Typography fontWeight='bold' variant='body2'>
                            {/* {languageHelper(row.target)} */}
                            {languageHelper(items?.[idx].targetLanguage)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body1' fontSize={14}>
                          {/* {row.price?.name} */}
                          {items?.[idx].initialPrice?.name}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 30]}
          component='div'
          count={items?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Fragment>
  )
}
