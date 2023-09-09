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

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${0}.detail`

  const sourceLanguage = itemData.source
  const targetLanguage = itemData.target

  // standard price에 등록된 데이터중 매칭된 데이터
  const priceData = () => {
    return getPriceOptions(itemData.source, itemData.target).find(
      price => price.id === itemData.priceId,
    ) || null
  }
  const languagePairData = () => priceData()?.languagePairs?.find(
    i => i.source === sourceLanguage && i.target === targetLanguage,
  )
  const minimumPrice = () => languagePairData()?.minimumPrice
  const priceFactor = () => languagePairData()?.priceFactor
  // 여기까지

// 현재 row의 프라이스 유닛에 적용될 minimumPrice 값
    // 신규 item인 경우: 기존에 저장된 price가 없으므로 선택된 price의 standard price정보에서 minimumPrice 추출
    // 기존 item인 경우: 저장된 price가 있으므로(initialPrice) initialPrice에서 minimumPrice 값 추출
    const currentMinimumPrice = () => {
      // 기존 item에서 price 변경, 이때는 Standard price의 minimum price 값을 줘야 함
      if (itemData?.id && itemData?.id !== -1 && priceData() && itemData?.initialPrice?.priceId !== priceData()?.id) {
        return minimumPrice()
      }
     
      // 기존 item
      // standard price 데이터가 없다면 쿼츠 작성 후 standard price가 삭제된 케이스이므로 여기서 처리
      else if ((itemData?.id && itemData?.id !== -1) || ((itemData?.id && itemData?.id !== -1) || !priceData())) {
        return itemData?.minimumPrice!
      }
       // Not Applicable(재설계 필요)
      else if (itemData?.id && itemData?.id === -1) return 0

      // 신규 item
      else {
        return minimumPrice()
      }
    }

    // const showMinimum = itemData.minimumPriceApplied
    // const setShowMinimum = (value: boolean) => {
    //   if (value) {
    //     if (currentMinimumPrice()) setValue(`items.${idx}.minimumPriceApplied`, true, setValueOptions)
    //   }
    //   else if(!value) setValue(`items.${idx}.minimumPriceApplied`, false, setValueOptions)
    // }

    // 현재 row의 프라이스 유닛에 적용될 currency 값
    // 신규 item인 경우: 기존에 저장된 price가 없으므로 선택된 price의 standard price정보에서 currency 추출
    // 기존 item인 경우: 저장된 price가 있으므로(initialPrice) initialPrice에서 currency 값 추출
    const currentCurrency = () => {
      // setPriceData(getPriceData())
      // 기존 item
      if (itemData?.id && itemData?.id !== -1)
        return itemData?.initialPrice?.currency!
      // Not Applicable(재설계 필요)
      else if (itemData?.id && itemData?.id === -1) return 'USD'
      // 신규 item
      else return priceData()?.currency!
    }
    
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

      const itemMinimumPrice = currentMinimumPrice()

      if (itemMinimumPrice && price < itemMinimumPrice) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        total += itemMinimumPrice
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
      if (currentMinimumPrice() && showMinimum) {
        prices = (percentQuantity / 100) * currentMinimumPrice()!
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
      return priceData()?.currency!
    }
    const roundingPrice = formatByRoundingProcedure(
      prices,
      priceData()?.decimalPlace!
      ? priceData()?.decimalPlace!
      : (currentCurrency() === 'USD' || currentCurrency() === 'SGD') 
        ? 2 
        : 1000,
      priceData()?.roundingProcedure! ?? 0,
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

  // function onItemBoxLeave() {
  //   const isMinimumPriceConfirmed =
  //     !!minimumPrice &&
  //     minimumPrice > getItem(`items.${0}.totalPrice`) &&
  //     showMinimum.checked

  //   const isNotMinimum =
  //     !minimumPrice || minimumPrice <= getItem(`items.${0}.totalPrice`)

  //   if (!isMinimumPriceConfirmed && !isNotMinimum) {
  //     setShowMinimum({ ...showMinimum, show: true })
  //     openModal({
  //       type: 'info-minimum',
  //       children: (
  //         <SimpleAlertModal
  //           onClose={() => {
  //             closeModal('info-minimum')
  //             setShowMinimum({ show: true, checked: true })
  //           }}
  //           message='The minimum price has been applied to the item(s).'
  //         />
  //       ),
  //     })
  //   }
  //   getTotalPrice()
  // }

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
        minimumPrice={currentMinimumPrice()}
        details={details}
        priceData={priceData()}
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
        showMinimum={false} //이거 쓰나?
        setShowMinimum={(n) => true} //이거 쓰나?
        type={type}
        sumTotalPrice={sumTotalPrice}
      />
      {/* price unit end */}
    </Box>
  )
}

export default Row
