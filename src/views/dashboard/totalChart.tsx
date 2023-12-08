import { Box } from '@mui/material'
import {
  ChartBoxIcon,
  ConvertButtonGroup,
  LinearMultiProgress,
  Title,
  TotalValueView,
} from '@src/views/dashboard/dashboardItem'
import React, { useState } from 'react'
import { Currency, TotalItem } from '@src/types/dashboard'
import { SvgIconComponent } from '@mui/icons-material'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import styled from '@emotion/styled'
import CustomChip from 'src/@core/components/mui/chip'

interface TotalChartProps {
  title: string
  setOpenInfoDialog: (open: boolean, key: string) => void
  icon: SvgIconComponent
  iconColor: string
}

const TotalChart = ({
  title,
  iconColor,
  icon,
  setOpenInfoDialog,
}: TotalChartProps) => {
  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const Icon = icon

  const TempProgress: Array<TotalItem> = [
    {
      label: 'Invoiced',
      color: 'rgba(60, 61, 91, 1)',
      count: 234332,
      price: 100000,
      ratio: 32.0,
    },
    {
      label: 'Paid',
      color: 'rgba(114, 225, 40, 1)',
      count: 234332,
      price: 100000,
      ratio: 15.6,
    },
    {
      label: 'Overdue',
      color: 'rgba(224, 68, 64, 1)',
      count: 234332,
      price: 100000,
      ratio: 42.0,
    },
    {
      label: 'Canceled',
      color: 'rgba(224, 224, 224, 1)',
      count: 234332,
      price: 100000,
      ratio: 18.0,
    },
  ]
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Title title={title} openDialog={setOpenInfoDialog} />
        <Box display='flex' justifyContent='flex-end'>
          <ConvertButtonGroup onChangeCurrency={setCurrency} />
        </Box>
      </Box>
      <TotalValueView
        label='Total'
        amountLabel='Total amount'
        countLabel='Total counts'
      />
      <Box sx={{ margin: '20px 0' }}>
        <ChartBoxIcon
          icon={<Icon sx={{ color: `rgba(${iconColor}, 1)` }} />}
          backgroundColor={`rgba(${iconColor}, 0.2)`}
          boxSize=''
        />
        <LinearMultiProgress items={TempProgress} />
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
            {TempProgress.map(row => (
              <TableRow
                key={row.label}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <Cell color={row.color} className='body__cell'>
                  <div className='flex__center'>
                    <span className='status__circle' />
                    {row.label}
                  </div>
                </Cell>
                <Cell className='body__cell' align='center'>
                  {row.count.toLocaleString()}
                </Cell>
                <Cell className='body__cell' align='right'>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {row.price.toLocaleString()}
                    <div className='ratio_chip flex__center'>{row.ratio}%</div>
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

const Cell = styled(TableCell)<{ color?: string }>(({ color }) => {
  return {
    padding: '10px !important',
    fontWeight: 500,
    textTransform: 'capitalize',

    '&.body__cell': {
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

export default TotalChart
