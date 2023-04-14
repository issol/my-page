import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { PriceUnitType } from '@src/apis/price-units.api'
import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

type Props = {
  list: PriceUnitListType[]
  listCount: number
  isLoading: boolean
  priceData: StandardPriceListType
  onClickSetPriceUnit: () => void
}

const PriceUnit = ({
  list,
  listCount,
  isLoading,
  priceData,
  onClickSetPriceUnit,
}: Props) => {
  function getKeyByValue<T extends { [key: string]: string }>(
    object: T,
    value: string,
  ): keyof T | undefined {
    return Object.keys(object).find(key => object[key] === value) as
      | keyof T
      | undefined
  }

  const rounding = getKeyByValue(
    PriceRoundingResponseEnum,
    priceData.roundingProcedure,
  )

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
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {row.parentPriceUnitId !== null ? (
            <img src='/images/icons/price-icons/sub-price-arrow.svg' alt='' />
          ) : null}

          <Typography
            variant='body1'
            sx={{ fontWeight: 600, fontSize: '14px' }}
          >
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
            {priceData.currency === 'USD' || priceData.currency === 'SGD'
              ? '$'
              : priceData.currency === 'KRW'
              ? '₩'
              : priceData.currency === 'JPY'
              ? '¥'
              : '-'}
            &nbsp;
            {rounding === 'Type_0'
              ? row.price.toFixed(priceData.decimalPlace)
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
        <Box>{row.weighting ?? '-'} %</Box>
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
        <Typography variant='body1' sx={{ fontWeight: 600 }}>
          Price units ({listCount ?? 0})
        </Typography>
        <Button variant='contained' size='small' onClick={onClickSetPriceUnit}>
          Set price unit
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '262px',
          overflow: 'scroll',
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
          hideFooter
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
