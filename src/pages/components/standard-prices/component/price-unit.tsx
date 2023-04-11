import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { PriceUnitListType } from '@src/types/common/standard-price'

type Props = {
  list: PriceUnitListType[]
  listCount: number
  isLoading: boolean
}

const PriceUnit = ({ list, listCount, isLoading }: Props) => {
  const columns: GridColumns<PriceUnitListType> = [
    {
      flex: 0.6,
      minWidth: 348,
      field: 'priceUnit',
      headerName: 'Price unit',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Price Unit</Box>,
      renderCell: ({ row }: { row: PriceUnitListType }) => (
        <Box>
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {row.title} {row.quantity ? `(${row.quantity})` : ''}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.3,
      minWidth: 110,
      field: 'price',
      headerName: 'Price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Price</Box>,
      renderCell: ({ row }: { row: PriceUnitListType }) => (
        <Box>
          {row.currency === 'USD' || row.currency === 'SGD'
            ? '$'
            : row.currency === 'KRW'
            ? '₩'
            : row.currency === 'JPY'
            ? '¥'
            : '-'}
          &nbsp;
          {row.price}
        </Box>
      ),
    },
    {
      flex: 0.2,
      minWidth: 133,
      field: 'weighting',
      headerName: 'Weighting (%)',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Weighting (%)</Box>,
      renderCell: ({ row }: { row: PriceUnitListType }) => (
        <Box sx={{ display: 'flex', gap: '9px' }}>
          <Box sx={{ width: '25px' }}>{row.weighting ?? '-'}</Box>
          <Box>%</Box>
        </Box>
      ),
    },
  ]
  return (
    <Card
      sx={{
        padding: '20px 0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 20px 20px',
        }}
      >
        <Typography variant='h6'>Price units ({listCount ?? 0})</Typography>
        <Button variant='contained'>Set price unit</Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          components={{
            NoRowsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></Box>
              )
            },
            NoResultsOverlay: () => {
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                ></Box>
              )
            },
          }}
          columns={columns}
          loading={isLoading}
          rows={list ?? []}
          autoHeight
          disableSelectionOnClick
          rowCount={listCount ?? 0}
        />
      </Box>
    </Card>
  )
}

export default PriceUnit
