import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import {
  formatByRoundingProcedure,
  formatCurrency,
  countDecimalPlaces,
} from '@src/shared/helpers/price.helper'
import {
  LanguagePairListType,
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { decimalPlace } from '@src/shared/const/price/decimalPlace'

type Props = {
  list: PriceUnitListType[]
  listCount: number
  isLoading: boolean
  priceData: StandardPriceListType
  selectedLanguagePair: LanguagePairListType | null
  onClickSetPriceUnit: () => void
}

const PriceUnit = ({
  list,
  listCount,
  isLoading,
  priceData,
  selectedLanguagePair,
  onClickSetPriceUnit,
}: Props) => {
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
          <Tooltip
          title={
            formatCurrency(
              formatByRoundingProcedure(
                getPrice(row.price),
                priceData.decimalPlace,
                priceData.roundingProcedure,
                priceData.currency,
              ),
              priceData.currency,
              // price의 currency를 바꾸면 language pair의 currency가 같이 업데이트 되지 않는 이슈가 있음
              // 따라서 currency를 보고 decimalPlace 값을 컨트롤 하는것에 예외 케이스가 많아서, 우선은 decimalPlace 값이 10보다 클경우는 KRW, JPY로 보고
              // 그에 맞는 로직을 타도록 임시 수정 함
              priceData.decimalPlace >= 10 ? countDecimalPlaces(priceData.decimalPlace) : priceData.decimalPlace
            )}
          sx={{
            backgroundColor: 'black',
            color: 'white',
          }}
        >
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {formatCurrency(
                formatByRoundingProcedure(
                  getPrice(row.price),
                  priceData.decimalPlace,
                  priceData.roundingProcedure,
                  priceData.currency,
                ),
                priceData.currency,
                priceData.decimalPlace >= 10 ? countDecimalPlaces(priceData.decimalPlace) : priceData.decimalPlace
              )}
            </Box>
          </Tooltip>
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
