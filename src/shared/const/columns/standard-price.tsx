import Box from '@mui/material/Box'

import { GridCellParams, GridColumns } from '@mui/x-data-grid'
import { JobTypeChip, ServiceTypeChip } from '@src/@core/components/chips/chips'
import { StandardPriceListType } from '@src/types/common/standard-price'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

function CustomCell(value: any) {
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <IconButton size='small' onClick={() => setOpen(!open)}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Typography variant='body1'></Typography>
      {open && (
        <Box sx={{ mt: 2, border: '1px solid', width: '100%' }}>
          <Typography variant='body2'>Additional content goes here</Typography>
        </Box>
      )}
    </Box>
  )
}

export const getStandardPriceColumns = () => {
  const materialColumns: GridColumns<StandardPriceListType> = [
    {
      flex: 0.04,
      minWidth: 50,
      field: 'sort',
      headerName: '',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      headerClassName: 'price-collapsible',
      renderHeader: () => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            width: '100%',
          }}
        >
          <KeyboardArrowDownIcon color='action' />
        </Box>
      ),
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return (
          <Box>
            <CustomCell value={row} />
          </Box>
        )
      },
    },
    {
      flex: 0.34,
      minWidth: 380,
      field: 'priceName',
      headerName: 'Price name',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box>Price name</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.priceName}</Box>
      },
    },

    {
      flex: 0.136,
      minWidth: 170,
      field: 'category',
      headerName: 'Category',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => <Box>Category</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <JobTypeChip type={row.category} label={row.category} />
      },
    },
    {
      flex: 0.264,
      minWidth: 120,
      field: 'serviceType',
      headerName: 'Service type',
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderHeader: () => <Box>Service type</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <ServiceTypeChip label={row.serviceType} />
      },
    },
    {
      flex: 0.096,
      field: 'currency',
      minWidth: 80,
      headerName: 'Currency',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box>Currency</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.currency}</Box>
      },
    },
    {
      flex: 0.104,
      field: 'catBasis',
      minWidth: 80,
      headerName: 'CAT basis',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box>CAT basis</Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box>{row.catBasis}</Box>
      },
    },
    {
      flex: 0.056,
      minWidth: 30,
      field: 'action',
      headerName: '',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box></Box>,
      renderCell: ({ row }: { row: StandardPriceListType }) => {
        return <Box></Box>
      },
    },
  ]

  return materialColumns
}
