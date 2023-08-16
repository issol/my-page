import { Box } from '@mui/material'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { formatByRoundingProcedure, formatCurrency } from '@src/shared/helpers/price.helper'
import { ModalType } from '@src/store/modal'
import { ItemType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  Control,
  UseFormGetValues,
  UseFormSetValue,
  useFieldArray,
} from 'react-hook-form'

type Props = {
  getItem: UseFormGetValues<{
    items: ItemType[]
  }>
  getPriceOptions: (
    source: string,
    target: string,
  ) => Array<StandardPriceListType & { groupName?: string }>
  itemControl: Control<
    {
      items: ItemType[]
    },
    any
  >
  showMinimum: {
    checked: boolean
    show: boolean
  }
  setItem: UseFormSetValue<{
    items: ItemType[]
  }>
  setShowMinimum: Dispatch<
    SetStateAction<{
      checked: boolean
      show: boolean
    }>
  >
  openModal: ({ type, children, isCloseable }: ModalType) => void
  closeModal: (type: string) => void
  priceUnitsList: PriceUnitListType[]
  type: string
}

const Row = ({
  getItem,
  getPriceOptions,
  itemControl,
  showMinimum,
  setItem,
  setShowMinimum,
  openModal,
  closeModal,
  priceUnitsList,
  type,
}: Props) => {
  const [cardOpen, setCardOpen] = useState(true)
  const itemData = getItem(`items.${0}`)

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${0}.detail`
  const priceData =
    getPriceOptions(itemData.source, itemData.target).find(
      price => price.id === itemData.priceId,
    ) || null
  // console.log(priceData)

  const sourceLanguage = itemData.source
  const targetLanguage = itemData.target
  const languagePairData = priceData?.languagePairs?.find(
    i => i.source === sourceLanguage && i.target === targetLanguage,
  )
  const minimumPrice = languagePairData?.minimumPrice
  const priceFactor = languagePairData?.priceFactor

  const {
    fields: details,
    append,
    update,
    remove,
  } = useFieldArray({
    control: itemControl,
    name: itemName,
  })

  function onDeletePriceUnit(idx: number) {
    remove(idx)
  }

  function getTotalPrice() {
    let total = 0
    const data = getItem(itemName)
    if (data?.length) {
      const price = data.reduce((res, item) => (res += Number(item.prices)), 0)
      if (minimumPrice && price < minimumPrice) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        total += minimumPrice
      } else {
        total = price
      }
    }
    if (total === itemData.totalPrice) return
    setItem(`items.${0}.totalPrice`, total, {
      shouldDirty: true,
      shouldValidate: false,
    })
  }

  function getEachPrice(index: number, showMinimum?:boolean, isNotApplicable?:boolean) {
    const data = getItem(itemName)
    if (!data?.length) return
    let prices = 0
    const detail = data?.[index]
    if (detail && detail.unit === 'Percent') {
      const percentQuantity = data[index].quantity
      if (minimumPrice && showMinimum) {
        prices = (percentQuantity / 100) * minimumPrice
      } else {
        const generalPrices = data.filter(item => item.unit !== 'Percent')
        generalPrices.forEach(item => {
          prices += item.unitPrice
        })
        prices *= percentQuantity / 100
      }
    } else {
      prices = detail.unitPrice * detail.quantity
    }

    // if (prices === data[index].prices) return
    const currentCurrency = () => {
      if (isNotApplicable) return detail?.currency
      return priceData?.currency!
    }
    const roundingPrice = formatByRoundingProcedure(
      prices,
      priceData?.decimalPlace!
      ? priceData?.decimalPlace!
      : (currentCurrency() === 'USD' || currentCurrency() === 'SGD') 
        ? 2 
        : 1000,
      priceData?.roundingProcedure! ?? 0,
      currentCurrency(),
    )
    setItem(`items.${0}.detail.${index}.currency`, currentCurrency(), {
      shouldDirty: true,
      shouldValidate: false,
    })
    // TODO: NOT_APPLICABLE일때 Price의 Currency를 업데이트 할 수 있는 방법이 필요함
    setItem(`items.${0}.detail.${index}.prices`, prices, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function onItemBoxLeave() {
    const isMinimumPriceConfirmed =
      !!minimumPrice &&
      minimumPrice > getItem(`items.${0}.totalPrice`) &&
      showMinimum.checked

    const isNotMinimum =
      !minimumPrice || minimumPrice <= getItem(`items.${0}.totalPrice`)

    if (!isMinimumPriceConfirmed && !isNotMinimum) {
      setShowMinimum({ ...showMinimum, show: true })
      openModal({
        type: 'info-minimum',
        children: (
          <SimpleAlertModal
            onClose={() => {
              closeModal('info-minimum')
              setShowMinimum({ show: true, checked: true })
            }}
            message='The minimum price has been applied to the item(s).'
          />
        ),
      })
    }
    getTotalPrice()
  }
  const sumTotalPrice = () => {
    return true
  }
  
  // console.log(details)

  return (
    <Box
      style={{
        border: '1px solid #F5F5F7',
        borderRadius: '8px',
        marginBottom: '14px',
      }}
    >
      {/* price unit start */}
      <ItemPriceUnitForm
        control={itemControl}
        index={0}
        minimumPrice={minimumPrice}
        details={details}
        priceData={priceData}
        getValues={getItem}
        append={append}
        update={update}
        getTotalPrice={getTotalPrice}
        getEachPrice={getEachPrice}
        onDeletePriceUnit={onDeletePriceUnit}
        // onItemBoxLeave={onItemBoxLeave}
        isValid={
          !!itemData.source &&
          !!itemData.target &&
          (!!itemData.priceId || itemData.priceId === NOT_APPLICABLE)
        }
        // isNotApplicable={itemData.priceId === NOT_APPLICABLE}
        priceUnitsList={priceUnitsList}
        // showMinimum={showMinimum}
        // setShowMinimum={setShowMinimum}
        type={type}
        sumTotalPrice={sumTotalPrice}
      />
      {/* price unit end */}
    </Box>
  )
}

export default Row
