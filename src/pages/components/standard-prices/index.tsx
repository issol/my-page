import Grid from '@mui/material/Grid'

import {
  LanguagePairListType,
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { useEffect, useState, MouseEvent } from 'react'

import AddSavePriceModal from '../standard-prices-modal/dialog/add-save-price-modal'

import NoPriceUnitModal from '../standard-prices-modal/modal/no-price-unit-modal'
import PriceActionModal from '../standard-prices-modal/modal/price-action-modal'
import { AddPriceType } from '@src/types/company/standard-client-prices'

import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import useModal from '@src/hooks/useModal'
import {
  useGetCatInterface,
  useGetStandardPrices,
} from '@src/queries/company/standard-price'
import PriceList from './component/price-list'
import Prices from './component/language-pair'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LanguagePair from './component/language-pair'
import PriceUnits from '@src/pages/company/components/price/price-units'
import PriceUnit from './component/price-unit'
import AddNewLanguagePairModal from '../standard-prices-modal/dialog/add-new-language-pair-modal'
import SetPriceUnitModal from '../standard-prices-modal/dialog/set-price-unit-modal'
import { useGetPriceUnitList } from '@src/queries/price-units.query'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { styled } from '@mui/material/styles'
import CatInterface from './component/cat-interface'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

type Props = {
  standardPrices: { data: StandardPriceListType[]; count: number }
  isLoading: boolean
}

const StandardPrices = ({ standardPrices, isLoading }: Props) => {
  const { data: priceUnit, refetch } = useGetPriceUnitList({
    skip: 0,
    take: 1000,
  })

  const [standardClientPriceListPage, setStandardClientPriceListPage] =
    useState<number>(0)
  const [standardClientPriceListPageSize, setStandardClientPriceListPageSize] =
    useState<number>(10)

  const [languagePairListPage, setLanguagePairListPage] = useState<number>(0)
  const [languagePairListPageSize, setLanguagePairListPageSize] =
    useState<number>(5)

  const [selectedPriceData, setSelectedPriceData] =
    useState<StandardPriceListType | null>(null)

  const [selectedLanguagePair, setSelectedLanguagePair] =
    useState<LanguagePairListType | null>(null)

  const [priceUnitList, setPriceUnitList] = useState<PriceUnitListType[]>([])

  const [selectedModalType, setSelectedModalType] = useState('')
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)

  const { openModal, closeModal } = useModal()
  const onClickAction = (type: string) => {
    if (type === 'Add' || type === 'Discard') {
      closeModal(`${selectedModalType}PriceModal`)
    }
  }

  const onClickAddNewPrice = () => {
    if (priceUnit) {
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
    } else {
      openModal({
        type: 'NoPriceUnitModal',
        children: (
          <NoPriceUnitModal
            open={true}
            onClose={() => closeModal('NoPriceUnitModal')}
          />
        ),
      })
    }
    // TODO Price unit 있는지 판단 후 alert 모달 띄우기

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

  const onClickLanguagePair = (params: any, event: any) => {
    if (params.row !== selectedLanguagePair) {
      setSelectedLanguagePair(params.row)
      setPriceUnitList(prevState => {
        const res = prevState?.map(value => ({
          ...value,
          price: params.row.priceFactor * value.price,
        }))
        return res
      })
    }
  }

  const onClickAddNewLanguagePair = () => {
    openModal({
      type: 'addNewLanguagePairModal',
      children: (
        <AddNewLanguagePairModal
          onClose={() => closeModal('addNewLanguagePairModal')}
          currency={selectedPriceData?.currency!}
        />
      ),
    })
  }

  const onClickSetPriceUnit = () => {
    openModal({
      type: 'setPriceUnitModal',
      children: (
        <SetPriceUnitModal
          onClose={() => closeModal('setPriceUnitModal')}
          currency={selectedPriceData?.currency!}
          priceUnit={priceUnit?.data!}
          price={selectedPriceData!}
        />
      ),
    })
  }

  useEffect(() => {
    if (selectedPriceData) {
      setPriceUnitList(selectedPriceData.priceUnit)
    }
  }, [selectedPriceData])

  return (
    <Grid container xs={12} spacing={6}>
      <Grid item xs={12}>
        <PriceList
          list={standardPrices?.data!}
          listCount={standardPrices?.count!}
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
      {selectedPriceData ? (
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
                  list={selectedPriceData?.languagePair!}
                  listCount={1}
                  isLoading={isLoading}
                  listPage={languagePairListPage}
                  setListPage={setLanguagePairListPage}
                  listPageSize={languagePairListPageSize}
                  setListPageSize={setLanguagePairListPageSize}
                  onCellClick={onClickLanguagePair}
                  onClickAddNewLanguagePair={onClickAddNewLanguagePair}
                  existPriceUnit={priceUnitList.length > 0}
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
                  list={priceUnitList}
                  listCount={1}
                  isLoading={isLoading}
                  decimalPlace={selectedPriceData?.decimalPlace!}
                  roundingProcedure={selectedPriceData?.roundingProcedure!}
                  onClickSetPriceUnit={onClickSetPriceUnit}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <CatInterface
              priceUnitList={priceUnitList}
              priceData={selectedPriceData}
              existPriceUnit={priceUnitList.length > 0}
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  )
}

export default StandardPrices
