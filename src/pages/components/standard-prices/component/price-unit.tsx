import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import { PriceUnitListType } from '@src/types/common/standard-price'

type Props = {
  list: PriceUnitListType[]
  listCount: number
  isLoading: boolean
  decimalPlace: number
  roundingProcedure: string
  price?: number
}

const PriceUnit = ({
  list,
  listCount,
  isLoading,
  decimalPlace,
  roundingProcedure,
  price,
}: Props) => {
  function getKeyByValue<T extends { [key: string]: string }>(
    object: T,
    value: string,
  ): keyof T | undefined {
    return Object.keys(object).find(key => object[key] === value) as
      | keyof T
      | undefined
  }

  const rounding = getKeyByValue(PriceRoundingResponseEnum, roundingProcedure)

  const columns: GridColumns<PriceUnitListType> = [
    {
      flex: 0.2,
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
      flex: 0.2,
      minWidth: 110,
      field: 'price',
      headerName: 'Price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Price</Box>,
      renderCell: ({ row }: { row: PriceUnitListType }) => {
        return (
          <Box>
            {row.currency === 'USD' || row.currency === 'SGD'
              ? '$'
              : row.currency === 'KRW'
              ? '₩'
              : row.currency === 'JPY'
              ? '¥'
              : '-'}
            &nbsp;
            {rounding === 'Type_0'
              ? row.price.toFixed(decimalPlace)
              : row.price}
          </Box>
        )
      },
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
