import Grid from '@mui/material/Grid'

import { StandardPriceListType } from '@src/types/common/standard-price'
import { useState } from 'react'

import AddSavePriceModal from '../standard-prices-modal/dialog/add-save-price-modal'

import NoPriceUnitModal from '../standard-prices-modal/modal/no-price-unit-modal'
import PriceActionModal from '../standard-prices-modal/modal/price-action-modal'
import { AddPriceType } from '@src/types/company/standard-client-prices'

import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import useModal from '@src/hooks/useModal'
import { useGetStandardPrices } from '@src/queries/company/standard-price'
import PriceList from './component/price-list'
import Prices from './component/language-pair'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LanguagePair from './component/language-pair'

const StandardPrices = () => {
  const { data: standardPrices, isLoading } = useGetStandardPrices()
  const [standardClientPriceListPage, setStandardClientPriceListPage] =
    useState<number>(0)
  const [standardClientPriceListPageSize, setStandardClientPriceListPageSize] =
    useState<number>(10)

  const [languagePairListPage, setLanguagePairListPage] = useState<number>(0)
  const [languagePairListPageSize, setLanguagePairListPageSize] =
    useState<number>(5)

  const [selectedPriceData, setSelectedPriceData] =
    useState<StandardPriceListType | null>(null)

  const [selectedModalType, setSelectedModalType] = useState('')
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)

  const { openModal, closeModal } = useModal()
  const onClickAction = (type: string) => {
    if (type === 'Add' || type === 'Discard') {
      closeModal(`${selectedModalType}PriceModal`)
    }
  }

  const onClickAddNewPrice = () => {
    // TODO Price unit 있는지 판단 후 alert 모달 띄우기
    // openModal({
    //   type: 'NoPriceUnitModal',
    //   children: (
    //     <NoPriceUnitModal
    //       open={true}
    //       onClose={() => closeModal('NoPriceUnitModal')}
    //     />
    //   ),
    // })

    openModal({
      type: 'AddPriceModal',
      children: (
        <AddSavePriceModal
          open={true}
          onClose={() => closeModal('AddPriceModal')}
          type={'Add'}
          onSubmit={onSubmit}
          serviceTypeList={serviceTypeList}
          setServiceTypeList={setServiceTypeList}
          onClickAction={onClickAction}
        />
      ),
    })
    setSelectedModalType('Add')
  }

  const onClickEditPrice = (priceData: StandardPriceListType) => {
    setSelectedPriceData(priceData)
    setSelectedModalType('Edit')
    openModal({
      type: 'EditPriceModal',
      children: (
        <AddSavePriceModal
          open={true}
          onClose={() => closeModal('EditPriceModal')}
          type={'Edit'}
          onSubmit={onSubmit}
          serviceTypeList={serviceTypeList}
          setServiceTypeList={setServiceTypeList}
          selectedPriceData={selectedPriceData!}
          onClickAction={onClickAction}
        />
      ),
    })
  }

  const onClickDeletePrice = (priceData: StandardPriceListType) => {
    openModal({
      type: 'DeletePriceModal',
      children: (
        <PriceActionModal
          onClose={() => closeModal(`DeletePriceModal`)}
          priceName={priceData.priceName}
          type={'Delete'}
          onClickAction={onClickAction}
        />
      ),
    })
  }

  const onSubmit = (data: AddPriceType) => {
    closeModal(`${selectedModalType}PriceModal`)

    openModal({
      type: `${selectedModalType}Price${
        selectedModalType === 'Edit' ? 'Cancel' : 'Discard'
      }Modal`,
      children: (
        <PriceActionModal
          onClose={() =>
            closeModal(
              `${selectedModalType}Price${
                selectedModalType === 'Edit' ? 'Cancel' : 'Discard'
              }Modal`,
            )
          }
          priceData={data!}
          type={selectedModalType === 'Add' ? 'Add' : 'Save'}
          onClickAction={onClickAction}
        />
      ),
    })
  }

  return (
    <Grid container xs={12} spacing={6}>
      <Grid item xs={12}>
        <PriceList
          list={standardPrices?.data!}
          listCount={standardPrices?.totalCount!}
          isLoading={isLoading}
          listPage={standardClientPriceListPage}
          setListPage={setStandardClientPriceListPage}
          listPageSize={standardClientPriceListPageSize}
          setListPageSize={setStandardClientPriceListPageSize}
          setSelectedRow={setSelectedPriceData}
          onClickAddNewPrice={onClickAddNewPrice}
          onClickEditPrice={onClickEditPrice}
          onClickDeletePrice={onClickDeletePrice}
        />
      </Grid>
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
              list={selectedPriceData?.languagePair!}
              listCount={1}
              isLoading={isLoading}
              listPage={languagePairListPage}
              setListPage={setLanguagePairListPage}
              listPageSize={languagePairListPageSize}
              setListPageSize={setLanguagePairListPageSize}
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
            <LanguagePair
              list={selectedPriceData?.languagePair!}
              listCount={1}
              isLoading={isLoading}
              listPage={languagePairListPage}
              setListPage={setLanguagePairListPage}
              listPageSize={languagePairListPageSize}
              setListPageSize={setLanguagePairListPageSize}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default StandardPrices
