import Grid from '@mui/material/Grid'

import {
  AddNewPriceType,
  LanguagePairListType,
  PriceUnitListType,
  StandardPriceListType,
  PriceUnitDataType,
} from '@src/types/common/standard-price'
import { useCallback, useEffect, useState } from 'react'

import AddSavePriceModal from '../standard-prices-modal/dialog/add-save-price-modal'

import NoPriceUnitModal from '../standard-prices-modal/modal/no-price-unit-modal'
import PriceActionModal from '../standard-prices-modal/modal/price-action-modal'
import { AddPriceType } from '@src/types/company/standard-client-prices'

import useModal from '@src/hooks/useModal'

import PriceList from './component/price-list'

import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import LanguagePair from './component/language-pair'

import PriceUnit from './component/price-unit'
import AddNewLanguagePairModal from '../standard-prices-modal/dialog/add-new-language-pair-modal'
import SetPriceUnitModal from '../standard-prices-modal/dialog/set-price-unit-modal'
import { useGetPriceUnitList } from '@src/queries/price-units.query'

import CatInterface from './component/cat-interface'

import {
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  MuiEvent,
} from '@mui/x-data-grid'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'
import {
  createPrice,
  deletePrice,
  patchPrice,
} from '@src/apis/company-price.api'
import toast from 'react-hot-toast'
import { useGetStandardPrices } from '@src/queries/company/standard-price'

type Props = {
  clientId?: number
  proId?: number
  title: string
  page: 'pro' | 'client'
}

const StandardPrices = ({ clientId, page, title, proId }: Props) => {
  const queryClient = useQueryClient()
  const { data: priceUnit, refetch: priceUnitRefetch } = useGetPriceUnitList({
    skip: 0,
    take: 1000,
  })

  const [standardPriceListPage, setStandardPriceListPage] = useState<number>(0)
  const [standardPriceListPageSize, setStandardPriceListPageSize] =
    useState<number>(10)

  const {
    data: standardPrices,
    isLoading,
    refetch,
  } = useGetStandardPrices(page, {
    take: standardPriceListPageSize,
    skip: standardPriceListPage * standardPriceListPageSize,
  })

  const [languagePairListPage, setLanguagePairListPage] = useState<number>(0)
  const [languagePairListPageSize, setLanguagePairListPageSize] =
    useState<number>(5)

  const [selectedPriceData, setSelectedPriceData] =
    useState<StandardPriceListType | null>(null)

  const [selectedLanguagePair, setSelectedLanguagePair] =
    useState<LanguagePairListType | null>(null)

  const [priceUnitList, setPriceUnitList] = useState<PriceUnitListType[]>([])

  const [selectedModalType, setSelectedModalType] = useState('')

  const [selected, setSelected] = useState<number | null>(null)

  const [isEditingCatInterface, setIsEditingCatInterface] = useState(false)

  const handleRowClick = (row: StandardPriceListType) => {
    if (row.id === selected) {
      setSelected(null)
      setSelectedPriceData(null)
    } else {
      setSelected(row.id)
      setSelectedPriceData(row)
    }
  }

  const isSelected = (index: number) => {
    return index === selected
  }

  const { openModal, closeModal } = useModal()

  const addNewPriceMutation = useMutation(
    (data: AddNewPriceType) => createPrice(data, page),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(`standard-${page}-prices`)

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const patchPriceMutation = useMutation(
    (value: { data: AddNewPriceType; id: number }) =>
      patchPrice(value.data, value.id, page),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(`standard-${page}-prices`)

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const deletePriceMutation = useMutation(
    (id: number) => deletePrice(id, page),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(`standard-${page}-prices`)

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
  const onClickAction = (
    type: string,
    data?: AddPriceType,
    selectedData?: StandardPriceListType,
  ) => {
    if (type === 'Add' || type === 'Cancel') {
      if (type === 'Add') {
        const obj: AddNewPriceType = {
          isStandard: clientId || proId ? false : true,
          priceName: data?.priceName!,
          category: data?.category.value!,
          serviceType: data?.serviceType.map(value => value.value)!,
          currency: data?.currency.value!,
          decimalPlace: data?.decimalPlace!,
          roundingProcedure: data?.roundingProcedure.value!,
          memoForPrice: data?.memoForPrice!,
        }
        if (page === 'client') {
          obj['catBasis'] = data?.catBasis!.value!
        }
        if (clientId) {
          obj['clientId'] = clientId
        } else if (proId) {
          obj['proId'] = proId
        }

        addNewPriceMutation.mutate(obj)
      }
      closeModal(`${selectedModalType}PriceModal`)
    } else if (type === 'Delete') {
      deletePriceMutation.mutate(selectedData?.id!)
    } else if (type === 'Save') {
      const obj: AddNewPriceType = {
        isStandard: clientId || proId ? false : true,
        priceName: data?.priceName!,
        category: data?.category.value!,
        serviceType: data?.serviceType.map(value => value.value)!,
        currency: data?.currency.value!,

        decimalPlace: data?.decimalPlace!,
        roundingProcedure: data?.roundingProcedure.value!,
        memoForPrice: data?.memoForPrice!,
      }
      if (page === 'client') {
        obj['catBasis'] = data?.catBasis!.value!
      }
      if (clientId) {
        obj['clientId'] = clientId
      } else if (proId) {
        obj['proId'] = proId
      }
      patchPriceMutation.mutate({ data: obj, id: selectedData?.id! })
      closeModal(`${selectedModalType}PriceModal`)
    }
  }
  const onSubmit = (
    selectedData: StandardPriceListType,
    data: AddPriceType,
    modalType: string,
  ) => {
    console.log(selectedData)

    openModal({
      type: `${modalType}Price${modalType === 'Edit' ? 'Save' : 'Add'}Modal`,
      children: (
        <PriceActionModal
          onClose={() =>
            closeModal(
              `${modalType}Price${modalType === 'Edit' ? 'Save' : 'Add'}Modal`,
            )
          }
          priceData={data!}
          selectedPriceData={selectedData!}
          type={modalType === 'Add' ? 'Add' : 'Save'}
          onClickAction={onClickAction}
        />
      ),
    })
  }

  const onClickAddNewPrice = () => {
    setSelectedModalType('Add')
    if (priceUnit) {
      openModal({
        type: 'AddPriceModal',
        children: (
          <AddSavePriceModal
            open={true}
            onClose={() => closeModal('AddPriceModal')}
            type={'Add'}
            onSubmit={onSubmit}
            onClickAction={onClickAction}
            page={page}
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
  }

  const onClickEditPrice = (priceData: StandardPriceListType) => {
    setSelectedPriceData(priceData)
    setSelectedModalType('Edit')
    console.log(priceData)

    openModal({
      type: 'EditPriceModal',
      children: (
        <AddSavePriceModal
          open={true}
          onClose={() => closeModal('EditPriceModal')}
          type={'Edit'}
          onSubmit={onSubmit}
          selectedPriceData={priceData!}
          onClickAction={onClickAction}
          page={page}
        />
      ),
    })
  }

  const onClickDeletePrice = (priceData: StandardPriceListType) => {
    setSelectedPriceData(priceData)
    openModal({
      type: 'DeletePriceModal',
      children: (
        <PriceActionModal
          onClose={() => closeModal(`DeletePriceModal`)}
          priceName={priceData.priceName}
          type={'Delete'}
          onClickAction={onClickAction}
          selectedPriceData={priceData!}
        />
      ),
    })
  }

  const onClickLanguagePair = (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent>,
  ) => {
    // if (params.row !== selectedLanguagePair) {
    console.log(params.row)
    if (selectedPriceData?.priceUnit.length) {
      setSelectedLanguagePair(params.row)
    }

    // setSelectedLanguagePair(params.row)
    // setPriceUnitList(prevState => {
    //   const res = prevState?.map(value => ({
    //     ...value,
    //     price: params.row.priceFactor * value.price,
    //   }))
    //   return res
    // })
    // }
  }

  const onClickAddNewLanguagePair = () => {
    openModal({
      type: 'addNewLanguagePairModal',
      children: (
        <AddNewLanguagePairModal
          onClose={() => closeModal('addNewLanguagePairModal')}
          priceData={selectedPriceData!}
          page={page}
        />
      ),
    })
  }

  const filterPriceUnitList = (priceUnitData:PriceUnitDataType) => {
    // Set price unit에서는 price unit data의 isActive가 true인것만 보여줘야 함.
    // 추후에 백엔드에서 isActive가 true인것만 받아오는 api가 있어도 되겠음
    const filteredData = priceUnitData.data.filter(item => item.isActive)

    const filteredWithSubPriceUnits = filteredData.filter(item => {
      return item.isActive || item.subPriceUnits.some(subItem => subItem.isActive)
    })

    return filteredWithSubPriceUnits.map(item => {
      const filteredSubPriceUnits = item.subPriceUnits.filter(subItem => subItem.isActive)
      return {
        ...item,
        subPriceUnits: filteredSubPriceUnits,
      }
    })
  }

  const sortPriceUnitList = (priceUnitData:PriceUnitListType[]) => {
    const sortedData = [...priceUnitData].sort((a, b) => a.priceUnitId - b.priceUnitId)
    const sortedWithNestedPriceUnits: PriceUnitListType[] = []

    sortedData.forEach(item => {
      if (!item.parentPriceUnitId) {
        sortedWithNestedPriceUnits.push(item)
        const nestedItems = sortedData.filter(parentItem => parentItem.parentPriceUnitId === item.priceUnitId)
        sortedWithNestedPriceUnits.push(...nestedItems)
      }
    })

    return sortedWithNestedPriceUnits;
  }
  const onClickSetPriceUnit = () => {
    openModal({
      type: 'setPriceUnitModal',
      children: (
        <SetPriceUnitModal
          onClose={() => closeModal('setPriceUnitModal')}
          currency={selectedPriceData?.currency!}
          priceUnit={filterPriceUnitList(priceUnit!)}
          price={selectedPriceData!}
          priceUnitPair={sortPriceUnitList(selectedPriceData?.priceUnit!)}
          setIsEditingCatInterface={setIsEditingCatInterface}
          refetch={refetch}
          page={page}
        />
      ),
    })
  }

  useEffect(() => {
    if (selectedPriceData) {
      setPriceUnitList(selectedPriceData.priceUnit)
    } else {
      setPriceUnitList([])
    }
  }, [selectedPriceData])

  useEffect(() => {
    if (standardPrices && selectedPriceData) {
      const updatedData: StandardPriceListType | null =
        standardPrices.data?.find(
          (value: StandardPriceListType) => value.id === selectedPriceData.id,
        ) ?? null

      setSelectedPriceData(updatedData!)
      setPriceUnitList(updatedData?.priceUnit!)
    }
  }, [standardPrices, selectedPriceData])

  return (
    <Grid container xs={12} spacing={6} mt={1}>
      <Grid item xs={12}>
        <PriceList
          list={standardPrices?.data!}
          listCount={standardPrices?.count!}
          isLoading={isLoading}
          listPage={standardPriceListPage}
          setListPage={setStandardPriceListPage}
          listPageSize={standardPriceListPageSize}
          setListPageSize={setStandardPriceListPageSize}
          setSelectedRow={setSelectedPriceData}
          onClickAddNewPrice={onClickAddNewPrice}
          onClickEditPrice={onClickEditPrice}
          onClickDeletePrice={onClickDeletePrice}
          handleRowClick={handleRowClick}
          isSelected={isSelected}
          selected={selected}
          title={title}
          page={page}
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
                  list={selectedPriceData?.languagePairs!}
                  listCount={selectedPriceData?.languagePairs?.length}
                  isLoading={isLoading}
                  listPage={languagePairListPage}
                  setListPage={setLanguagePairListPage}
                  listPageSize={languagePairListPageSize}
                  setListPageSize={setLanguagePairListPageSize}
                  onCellClick={onClickLanguagePair}
                  onClickAddNewLanguagePair={onClickAddNewLanguagePair}
                  existPriceUnit={priceUnitList.length > 0}
                  selectedLanguagePair={selectedLanguagePair!}
                  priceData={selectedPriceData!}
                  page={page}
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
                  list={sortPriceUnitList(priceUnitList)}
                  listCount={priceUnitList.length}
                  isLoading={isLoading}
                  priceData={selectedPriceData!}
                  selectedLanguagePair={selectedLanguagePair}
                  onClickSetPriceUnit={onClickSetPriceUnit}
                />
              </Box>
            </Card>
          </Grid>
          {page === 'client' && (
            <Grid item xs={12}>
              <CatInterface
                priceUnitList={sortPriceUnitList(priceUnitList)}
                priceData={selectedPriceData}
                existPriceUnit={priceUnitList.length > 0}
                setIsEditingCatInterface={setIsEditingCatInterface}
                isEditingCatInterface={isEditingCatInterface}
              />
            </Grid>
          )}
        </>
      ) : null}
    </Grid>
  )
}

export default StandardPrices
