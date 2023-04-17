import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { PriceUnitType } from '@src/apis/price-units.api'
import { PriceRoundingResponseEnum } from '@src/shared/const/rounding-procedure/rounding-procedure.enum'
import {
  LanguagePairListType,
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

type Props = {
  list: PriceUnitListType[]
  listCount: number
  isLoading: boolean
  selectedLanguagePair: LanguagePairListType | null
  priceData: StandardPriceListType
  onClickSetPriceUnit: () => void
}

const PriceUnit = ({
  list,
  listCount,
  isLoading,
  selectedLanguagePair,
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

  const adjustRoundingProcedure = (
    value: number,
    decimalPlace: number,
    type: string,
    currency: string,
  ) => {
    if (currency === 'USD' || currency === 'SGD') {
      const factor = Math.pow(
        10,
        type === 'Type_4' ? decimalPlace - 1 : decimalPlace,
      )

      switch (type) {
        case 'Type_0':
          return value.toFixed(decimalPlace)
        case 'Type_1':
          return (Math.ceil(value * factor) / factor).toFixed(2)
        case 'Type_2':
          return (Math.floor(value * factor) / factor).toFixed(2)
        case 'Type_3':
          return (Math.round(value * factor) / factor).toFixed(2)
        case 'Type_4':
          return (Math.ceil(value * factor) / factor).toFixed(2)
      }
    } else {
      const rounded = Math.round(value / decimalPlace) * decimalPlace
      const result = rounded.toString()
      return result.padEnd(
        result.length + Math.max(0, String(decimalPlace).length - 2),
        '0',
      )
    }
  }

  // adjustRoundingProcedure(
  //   row.price,
  //   priceData.decimalPlace,
  //   rounding!,
  //   priceData.currency,
  // )
  function getPrice(price: number) {
    if (selectedLanguagePair?.priceFactor) {
      return price * selectedLanguagePair.priceFactor
    }
    return price
  }

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
              ? getPrice(row.price).toFixed(priceData.decimalPlace)
              : getPrice(row.price)}
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
