import { Button, Card, Grid, Typography } from '@mui/material'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import
import { clientGuide } from 'src/@fake-db/table/static-data'
import Link from 'next/link'
import { JobInfoType } from 'src/types/sign/personalInfoTypes'

import styled from 'styled-components'

// ** helpers
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

type CellType = {
  row: {
    id: number
    title: string
    client: string
    category: string
    serviceType: Array<string>
    dueAt: string
  }
}

export default function ClientGuideLineList() {
  const columns = [
    {
      flex: 0.28,
      field: 'title',
      minWidth: 80,
      headerName: 'Title',
      renderHeader: () => <Box>Title.</Box>,
      renderCell: ({ row }: CellType) => (
        <Title title={row.title}>{row.title}</Title>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'client',
      headerName: 'Client',
      renderHeader: () => <Box>Client</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{row.client}</Typography>
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'category',
      headerName: 'Category',
      renderHeader: () => <Box>Category</Box>,
      renderCell: ({ row }: CellType) => (
        <CategoryChip>{row.client}</CategoryChip>
      ),
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'serviceType',
      headerName: 'Service type',
      renderHeader: () => <Box>Service type</Box>,
      renderCell: ({ row }: CellType) => {
        console.log(row)
        return (
          <Box sx={{ overflow: 'scroll', display: 'flex', gap: '5px' }}>
            {!row?.serviceType.length
              ? '-'
              : row?.serviceType?.map(item => (
                  <Box key={row.id} sx={{ display: 'flex', gap: '8px' }}>
                    <ServiceType>{item}</ServiceType>
                  </Box>
                ))}
          </Box>
        )
      },
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'dueAt',
      headerName: 'Date & Time',
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>
          {FullDateTimezoneHelper(row.dueAt)}
        </Box>
      ),
    },
  ]

  function noData() {
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
          There are no client guidelines
        </Typography>
      </Box>
    )
  }
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>Guidelines (0)</Typography>{' '}
              <Button variant='contained'>Add client guideline</Button>
            </Box>
          }
        />
        <Box sx={{ height: 500 }}>
          <DataGrid
            components={{
              NoRowsOverlay: () => noData(),
              NoResultsOverlay: () => noData(),
            }}
            columns={columns}
            autoHeight
            rows={clientGuide.slice(0, 10)}
          />
        </Box>
      </Card>
    </Grid>
  )
}

// ** TODO : chip style 컬러 추가해야 함
const CategoryChip = styled.p`
  padding: 2px 6px;
  background: #ff9e91;
  border-radius: 16px;

  color: #111111;
  font-weight: 500;
  font-size: 0.813rem;
`
const ServiceType = styled.p`
  padding: 2px 6px;
  text-align: center;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  border: 1px solid rgba(102, 108, 255, 0.5);
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.813rem;
`

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
