import { Box, IconButton, Typography } from '@mui/material'
import {
  ChartBoxIcon,
  ConvertButtonGroup,
  CurrencyUnit,
  LinearMultiProgress,
  Title,
  TotalValueView,
} from '@src/views/dashboard/dashboardItem'
import React, {
  Dispatch,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Currency, TotalItem } from '@src/types/dashboard'
import { RefreshOutlined, SvgIconComponent } from '@mui/icons-material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import styled from '@emotion/styled'
import CustomChip from '@src/@core/components/mui/chip'
import {
  DEFAULT_QUERY_NAME,
  NO_DATE_EFFECT,
  useTotalPrice,
} from '@src/queries/dashboard/dashnaord-lpm'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackSpinner from '@src/@core/components/spinner'
import { QueryClient, useQueryClient } from 'react-query'
import { retry } from '@reduxjs/toolkit/query'

export const ReceivableColors = [
  'rgba(60, 61, 91, 1)',
  'rgba(114, 225, 40, 1)',
  'rgba(224, 68, 64, 1)',
  'rgba(224, 224, 224, 1)',
]

export const payableColors = [
  'rgba(60, 61, 91, 1)',
  'rgba(102, 108, 255, 1)',
  'rgba(224, 68, 64, 1)',
]

export const ReceivableStatusList = ['Invoiced', 'Paid', 'Overdue', 'Canceled']
export const PayableStatusList = ['Invoiced', 'Paid', 'Overdue']

interface TotalChartProps {
  title: string
  handleTitleClick?: () => void
  setOpenInfoDialog: (open: boolean, key: string) => void
  icon: SvgIconComponent
  iconColor: string
  type: 'payable' | 'receivable'
  statusList: Array<string>
  colors: Array<string>
}

const TotalProgressChart = ({
  type,
  title,
  iconColor,
  icon,
  setOpenInfoDialog,
  statusList,
  colors,
  handleTitleClick,
}: TotalChartProps) => {
  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const { data } = useTotalPrice(type, currency)

  const items: Array<[string, TotalItem]> = useMemo(() => {
    const map = new Map()

    statusList.forEach(key => {
      map.set(key, {})
    })

    data?.report.forEach(item => {
      if (map.has(item.name)) {
        map.set(item.name, item)
      }
    })

    return [...map]
  }, [data])

  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  const getTempName = (index: number) => {
    if (type === 'receivable') return ReceivableStatusList[index]
    return PayableStatusList[index]
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Title
          title={title}
          openDialog={setOpenInfoDialog}
          handleClick={handleTitleClick}
        />
      </Box>
      <Box>
        <Box display='flex' justifyContent='flex-end'>
          <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
        </Box>
        <Box display='flex' alignItems='center'>
          <Box sx={{ marginTop: '20px' }}>
            <Typography
              fontSize='14px'
              color='rgba(102, 108, 255, 1)'
              fontWeight={600}
            >
              Total
            </Typography>
            <Typography fontSize='34px' fontWeight={500}>
              {CurrencyUnit[data?.currency || ('$' as Currency)]}
              {data?.totalPrice.toLocaleString() || 0}
            </Typography>
            <Typography
              fontSize='12px'
              color='rgba(76, 78, 100, 0.6)'
              sx={{ marginTop: '-8px' }}
            >
              Total amount
            </Typography>
          </Box>
          <span
            style={{
              display: 'block',
              margin: '40px 20px 0',
              width: '1px',
              height: '58px',
              backgroundColor: 'rgba(76, 78, 100, 0.12)',
            }}
          />
          <Box sx={{ marginTop: '20px' }}>
            <Box sx={{ height: '20px' }} />
            <Typography fontSize='34px' fontWeight={500}>
              {data?.totalCount.toLocaleString() || 0}
            </Typography>
            <Typography
              fontSize='12px'
              color='rgba(76, 78, 100, 0.6)'
              sx={{ marginTop: '-8px' }}
            >
              Total counts
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display='flex' gap='10px' sx={{ margin: '20px 0' }}>
        <Box>
          <ChartBoxIcon icon={icon} color={iconColor} boxSize='50px' />
        </Box>
        <LinearMultiProgress items={data?.report || []} colors={colors} />
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label='total table'>
          <TableHead>
            <TableRow>
              <Cell>Status</Cell>
              <Cell align='center'>Count</Cell>
              <Cell align='right'>Prices</Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(items || []).map(([, row], index) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <Cell color={colors[index]} className='body__cell'>
                  <div className='flex__center'>
                    <span className='status__circle' />
                    {row?.name || getTempName(index)}
                  </div>
                </Cell>
                <Cell className='body__cell' align='center'>
                  {(row?.count || 0).toLocaleString()}
                </Cell>
                <Cell className='body__cell' align='right'>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {CurrencyUnit[data?.currency || ('$' as Currency)]}
                    {(row?.sum || 0).toLocaleString()}
                    <div className='ratio_chip flex__center'>
                      {row?.ratio || '0.0'}%
                    </div>
                  </div>
                </Cell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const ErrorFallback = ({
  title,
  setOpenInfoDialog,
  handleTitleClick,
}: TotalChartProps) => {
  const queryClient = useQueryClient()

  const onChange = () => {
    queryClient.refetchQueries({
      queryKey: [DEFAULT_QUERY_NAME, NO_DATE_EFFECT, 'totalPrice'],
    })
  }
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Title
          title={title}
          openDialog={setOpenInfoDialog}
          handleClick={handleTitleClick}
        />
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        gap='20px'
        sx={{ width: '100%', height: '90%' }}
      >
        <IconButton
          color='primary'
          aria-label='refresh'
          size='large'
          onClick={() => onChange()}
        >
          <RefreshOutlined sx={{ fontSize: '32px' }} />
        </IconButton>
        <Typography>Failed to load data. Please try again.</Typography>
      </Box>
    </Box>
  )
}

export const TotalPrice = (props: TotalChartProps) => {
  const [retry, setRetry] = useState(false)
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback {...props} />}>
        <TotalProgressChart {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}

const Cell = styled(TableCell)<{ color?: string }>(({ color }) => {
  return {
    padding: '5px !important',
    fontWeight: 500,
    textTransform: 'capitalize',

    '&.body__cell': {
      padding: '10px !important',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
    },

    '& .flex__center': {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },

    '& .status__circle': {
      display: 'block',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
    },

    '& .ratio_chip': {
      height: '20px',
      padding: '0 6.5px',
      marginLeft: '10px',
      backgroundColor: 'rgba(109, 120, 141, 1)',
      borderRadius: '64px',
      fontSize: '12px',
      color: '#fff',
    },
  }
})

export default TotalProgressChart
