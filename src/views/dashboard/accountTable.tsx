import React, { Dispatch, Suspense, useEffect, useMemo } from 'react'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import {
  AccountItem,
  DEFAULT_QUERY_NAME,
  useAccountCount,
} from '@src/queries/dashnaord.query'
import Typography from '@mui/material/Typography'
import FallbackSpinner from '@src/@core/components/spinner'
import { ErrorBoundary } from 'react-error-boundary'
import { TryAgain } from '@src/views/dashboard/suspense'

type Keys = 'Japan' | 'Korea' | 'Singapore' | 'US'

interface AccountTableProps {
  path: string
  headers: Array<{ label: string; align?: TableCellProps['align'] }>
  from: string
  to: string
  setItemData: Dispatch<Array<AccountItem>>
}

const Unit = ['¥', '₩', '$', '$']
const AccountCountTable = ({
  path,
  headers,
  from,
  to,
  setItemData,
}: AccountTableProps) => {
  const { data } = useAccountCount(path, {
    from,
    to,
  })

  const filterData = useMemo(() => {
    return {
      Japan: data?.report.find(item => item.currency === 'JPY'),
      Korea: data?.report.find(item => item.currency === 'KRW'),
      Singapore: data?.report.find(item => item.currency === 'SGD'),
      US: data?.report.find(item => item.currency === 'USD'),
    } as Record<Keys, AccountItem>
  }, [data])

  useEffect(() => {
    setItemData(data?.report || [])
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

const AccountTable = (props: AccountTableProps) => {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ErrorBoundary
        fallback={
          <TryAgain
            refreshDataQueryKey={[
              DEFAULT_QUERY_NAME,
              'AccountCount',
              props.path,
            ]}
          />
        }
      >
        <AccountCountTable {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}
export default AccountTable
