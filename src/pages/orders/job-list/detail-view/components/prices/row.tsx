import { Box } from '@mui/material'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { ModalType } from '@src/store/modal'
import { ItemType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardClientPriceListType,
  StandardProPriceListType,
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
  ) => (StandardProPriceListType & {
    groupName: string
  })[]
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
  console.log('itemData : ', itemData)

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${0}.detail`
  const priceData =
    getPriceOptions(itemData.source, itemData.target).find(
      price => price.id === itemData.priceId,
    ) || null
  console.log(priceData)

  const sourceLanguage = getItem(`items.${0}.source`)
  const targetLanguage = getItem(`items.${0}.target`)
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
      if (minimumPrice && showMinimum.show && price < minimumPrice) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        total += minimumPrice
      } else {
        total = price
      }
    }

    setItem(`items.${0}.totalPrice`, total, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function getEachPrice(index: number) {
    const data = getItem(itemName)
    if (!data?.length) return
    let prices = 0
    const detail = data?.[index]
    if (detail && detail.unit === 'Percent') {
      const percentQuantity = data[index].quantity
      if (minimumPrice && showMinimum.show) {
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

  console.log(details)

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
        onItemBoxLeave={onItemBoxLeave}
        isValid={
          !!itemData.source &&
          !!itemData.target &&
          (!!itemData.priceId || itemData.priceId === NOT_APPLICABLE)
        }
        isNotApplicable={itemData.priceId === NOT_APPLICABLE}
        priceUnitsList={priceUnitsList}
        showMinimum={showMinimum}
        setShowMinimum={setShowMinimum}
        type={type}
      />
      {/* price unit end */}
    </Box>
  )
}

export default Row
