import React from 'react'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'

interface AccountTableProps {
  headers: Array<{ label: string; align?: TableCellProps['align'] }>
}

const AccountTable = ({ headers }: AccountTableProps) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                py: theme => `${theme.spacing(2.5)} !important`,
              },
            }}
          >
            {headers.map(header => (
              <TableCell
                key={`${header.label}`}
                align={header?.align || 'left'}
                sx={{
                  textTransform: 'capitalize',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/*{data.map((row: TabContentType, index: number) => (*/}
          {/*  <TableRow*/}
          {/*    key={index}*/}
          {/*    sx={{*/}
          {/*      '& .MuiTableCell-root': {*/}
          {/*        border: 0,*/}
          {/*        py: theme => `${theme.spacing(3)} !important`,*/}
          {/*      },*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <TableCell>*/}
          {/*      <Typography*/}
          {/*        variant='body2'*/}
          {/*        sx={{*/}
          {/*          fontWeight: 600,*/}
          {/*          whiteSpace: 'nowrap',*/}
          {/*          color: 'text.primary',*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        {row.parameter}*/}
          {/*      </Typography>*/}
          {/*    </TableCell>*/}
          {/*    <TableCell>*/}
          {/*      <Typography*/}
          {/*        variant='body2'*/}
          {/*        sx={{*/}
          {/*          fontWeight: 600,*/}
          {/*          textAlign: 'right',*/}
          {/*          color:*/}
          {/*            row.conversionDifference === 'negative'*/}
          {/*              ? 'error.main'*/}
          {/*              : 'success.main',*/}
          {/*        }}*/}
          {/*      >{`${row.conversion}%`}</Typography>*/}
          {/*    </TableCell>*/}
          {/*    <TableCell>*/}
          {/*      <Typography*/}
          {/*        variant='body2'*/}
          {/*        sx={{*/}
          {/*          fontWeight: 600,*/}
          {/*          textAlign: 'right',*/}
          {/*          color: 'text.primary',*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        {row.totalRevenue}*/}
          {/*      </Typography>*/}
          {/*    </TableCell>*/}
          {/*  </TableRow>*/}
          {/*))}*/}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AccountTable
