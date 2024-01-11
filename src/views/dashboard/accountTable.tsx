import React, { useMemo } from 'react'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import { Currency } from '@src/types/dashboard'
import { AccountItem } from '@src/queries/dashnaord.query'
import Typography from '@mui/material/Typography'
import { CurrencyUnit } from '@src/views/dashboard/dashboardItem'

type Keys = 'Japan' | 'Korea' | 'Singapore' | 'US'
interface AccountTableProps {
  data: Array<AccountItem>
  headers: Array<{ label: string; align?: TableCellProps['align'] }>
}

const Unit = ['¥', '₩', '$', '$']
const AccountTable = ({ data, headers }: AccountTableProps) => {
  const filterData = useMemo(() => {
    return {
      Japan: data?.find(item => item.currency === 'JPY'),
      Korea: data?.find(item => item.currency === 'KRW'),
      Singapore: data?.find(item => item.currency === 'SGD'),
      US: data?.find(item => item.currency === 'USD'),
    } as Record<Keys, AccountItem>
  }, [data])

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
          {Object.keys(filterData).map((key, index) => {
            return (
              <TableRow
                key={`${key}-${index}`}
                sx={{
                  '& .MuiTableCell-root': {
                    border: 0,
                    py: theme => `${theme.spacing(3)} !important`,
                  },
                }}
              >
                <TableCell>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      color: 'text.primary',
                    }}
                  >
                    {key}
                  </Typography>
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    display: headers.find(item => item.label === 'Count')
                      ? 'block'
                      : 'none',
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      color: 'text.primary',
                    }}
                  >
                    {(filterData[key as Keys]?.count || 0).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      color: 'text.primary',
                    }}
                  >
                    {`${Unit[index]} ${(
                      filterData[key as Keys]?.prices || 0
                    ).toLocaleString()}`}
                  </Typography>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AccountTable
