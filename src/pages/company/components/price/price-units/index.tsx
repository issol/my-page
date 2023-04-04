// ** React Imports
import { useState, Fragment } from 'react'

import styled from 'styled-components'

// ** mui
import {
  Button,
  Card,
  Chip,
  Grid,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'
import PriceUnitTable from './table'

export default function PriceUnits() {
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // ** TODO : mock data이므로 지우기
  const list = {
    data: [
      {
        id: 1,
        isBasePrice: true,
        priceUnit: '알라깔라',
        unit: 'Fixed rate',
        weighting: '100%',
        isActive: false,
        subPrice: [
          {
            id: 1,
            priceUnit: '똑깔라비띠',
            unit: 'Fixed rate',
            weighting: '80%',
            isActive: true,
          },
        ],
      },
      {
        id: 2,
        isBasePrice: false,
        priceUnit: '알라깔라',
        unit: 'Fixed rate',
        weighting: '100%',
        isActive: false,
        subPrice: [],
      },
    ],
    totalCount: 2,
  }

  return (
    <Grid item xs={12} mt='24px'>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Price units {/* ({list?.count | 0}) */}
              </Typography>
            </Box>
          }
        />
        <PriceUnitTable
          skip={skip}
          setSkip={setSkip}
          pageSize={pageSize}
          setPageSize={setPageSize}
          list={list}
        />
      </Card>
    </Grid>
  )
}
