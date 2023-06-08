// ** styled components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Box, Typography } from '@mui/material'
import { HeaderCell } from '@src/pages/orders/add-new'
import { Fragment } from 'react'
import languageHelper from '@src/shared/helpers/language.helper'
import { AnalysisFileType } from '@src/types/common/item.type'

type Props = {
  data: Array<AnalysisFileType>
}

export default function TmAnalysisTable({ data }: Props) {
  return (
    <Fragment>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='subtitle1' mb='24px' fontWeight={600}>
          TM analysis
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {['CAT interface', 'Target language', 'File name'].map(
                (item, idx) => (
                  <HeaderCell key={idx} align='left'>
                    {item}
                  </HeaderCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!data.length ? (
              <TableRow hover tabIndex={-1}>
                <TableCell colSpan={4} align='center'>
                  There are no TM files uploaded
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow hover tabIndex={-1} key={item.id}>
                  <TableCell style={{ textTransform: 'capitalize' }}>
                    {item?.data?.toolName}
                  </TableCell>
                  <TableCell>
                    {languageHelper(item?.data?.targetLanguage)}
                  </TableCell>
                  <TableCell style={{ maxWidth: '330px' }}>
                    {item.name}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  )
}
