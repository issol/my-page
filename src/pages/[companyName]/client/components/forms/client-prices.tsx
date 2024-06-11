import { Dispatch, SetStateAction, useState } from 'react'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** mui
import { Box, Button, Card, Grid, Typography } from '@mui/material'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** components
import LanguagePair from 'src/pages/[companyName]/components/client-prices/language-pair'
import PriceUnit from 'src/pages/[companyName]/components/standard-prices/component/price-unit'
import ClientPriceList from 'src/pages/[companyName]/components/client-prices/price-list'
import CatInterface from 'src/pages/[companyName]/components/client-prices/cat-interface'

// ** types
import {
  LanguagePairListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

// ** fetches
import { GridCellParams, MuiEvent } from '@mui/x-data-grid'

type Props = {
  priceList: StandardPriceListType[] | []
  onAddPrice: () => void
  onEditPrice: (priceData: StandardPriceListType) => void
  onDeletePrice: (priceData: StandardPriceListType) => void
  selectedPrice: StandardPriceListType | null
  setSelectedPrice: Dispatch<SetStateAction<StandardPriceListType | null>>
  onSetPriceUnitClick: () => void
  selectedLanguagePair: LanguagePairListType | null
  onLanguageListClick: (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent>,
  ) => void
  onAddLanguagePair: () => void
  onEditLanguagePair: (data: LanguagePairListType) => void
  onDeleteLanguagePair: (id: any) => void
  handleBack: () => void
  onSubmit: () => void
}

export default function ClientPrices({
  priceList,
  onAddPrice,
  onEditPrice,
  onDeletePrice,
  selectedPrice,
  setSelectedPrice,
  onSetPriceUnitClick,
  selectedLanguagePair,
  onLanguageListClick,
  onAddLanguagePair,
  onEditLanguagePair,
  onDeleteLanguagePair,
  handleBack,
  onSubmit,
}: Props) {
  const [priceListSkip, setPriceListSkip] = useState(0)
  const [priceListPageSize, setPriceListPageSize] = useState(10)
  const [langListSkip, setLangListSkip] = useState(0)
  const [langListPageSize, setLangListPageSize] = useState(10)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClientPriceList
          list={priceList}
          listCount={priceList?.length ?? 0}
          isLoading={false}
          listPage={priceListSkip}
          setListPage={setPriceListSkip}
          listPageSize={priceListPageSize}
          setListPageSize={setPriceListPageSize}
          setSelectedRow={setSelectedPrice}
          onAddPrice={onAddPrice}
          onEditPrice={onEditPrice}
          onDeletePrice={onDeletePrice}
        />
      </Grid>
      {selectedPrice ? (
        <>
          <Grid item xs={12}>
            <Card
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <Typography variant='h6'>Prices</Typography>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <LanguagePair
                  list={selectedPrice?.languagePairs!}
                  listCount={selectedPrice?.languagePairs?.length}
                  isLoading={false}
                  listPage={langListSkip}
                  setListPage={setLangListSkip}
                  listPageSize={langListPageSize}
                  setListPageSize={setLangListPageSize}
                  onCellClick={onLanguageListClick}
                  onAddLanguagePair={onAddLanguagePair}
                  onEditLanguagePair={onEditLanguagePair}
                  onDeleteLanguagePair={onDeleteLanguagePair}
                  existPriceUnit={selectedPrice?.priceUnit?.length > 0}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 1,
                    mr: 1,
                  }}
                >
                  <img src='/images/icons/price-icons/menu-arrow.svg' alt='' />
                </Box>
                <PriceUnit
                  list={selectedPrice?.priceUnit}
                  listCount={selectedPrice?.priceUnit.length}
                  isLoading={false}
                  selectedLanguagePair={selectedLanguagePair}
                  priceData={selectedPrice!}
                  onClickSetPriceUnit={onSetPriceUnitClick}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <CatInterface
              priceUnitList={selectedPrice?.priceUnit}
              setSelectedPrice={setSelectedPrice}
              priceData={selectedPrice}
              existPriceUnit={selectedPrice?.priceUnit.length > 0}
            />
          </Grid>
        </>
      ) : null}
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        mt='24px'
      >
        <Button variant='outlined' color='secondary' onClick={handleBack}>
          <Icon icon='material-symbols:arrow-back-rounded' />
          Previous
        </Button>
        <Button variant='contained' onClick={onSubmit}>
          Save <Icon icon='material-symbols:arrow-forward-rounded' />
        </Button>
      </Grid>
    </Grid>
  )
}
