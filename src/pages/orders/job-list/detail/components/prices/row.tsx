import { Box } from '@mui/material'
import ItemPriceUnitForm from '@src/pages/components/forms/item-price-unit-form'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { formatByRoundingProcedure } from '@src/shared/helpers/price.helper'
import { ModalType } from '@src/store/modal'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import {
  LanguagePairListType,
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import {
  Control,
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { languageType } from '@src/pages/orders/add-new'
import { Currency } from '@src/types/common/currency.type'

type Props = {
  getItem: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  getPriceOptions: (
    source: string,
    target: string,
  ) => Array<StandardPriceListType & { groupName?: string }>
  itemControl: Control<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    any
  >
  showMinimum: {
    checked: boolean
    show: boolean
  }
  setItem: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
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
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  isNotApplicable: boolean
  setDarkMode?: boolean
  selectedPrice?:
    | (StandardPriceListType & {
        groupName?: string
      })
    | null
  orderItems?: ItemType[]
  currentOrderItemId?: number
  useUnitPriceOverrideInPrice?: boolean
  findMatchedLanguagePairInItems?: (
    v: StandardPriceListType & {
      groupName?: string | undefined
    },
  ) => LanguagePairListType | undefined
  errorRefs?: MutableRefObject<(HTMLInputElement | null)[]>
  details?: FieldArrayWithId<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`,
    'id'
  >[]
  append?: UseFieldArrayAppend<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`
  >
  remove?: UseFieldArrayRemove
  update?: UseFieldArrayUpdate<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`
  >
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
  isNotApplicable,
  type,
  itemTrigger,
  setDarkMode,
  selectedPrice,
  orderItems,
  currentOrderItemId,
  useUnitPriceOverrideInPrice,
  findMatchedLanguagePairInItems,
  errorRefs,
  details,
  append,
  remove,
  update,
}: Props) => {
  const [cardOpen, setCardOpen] = useState(true)
  const itemData = getItem(`items.${0}`)
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${0}.detail`

  const sourceLanguage = itemData.source!
  const targetLanguage = itemData.target!

  // standard price에 등록된 데이터중 매칭된 데이터
  const priceData = () => {
    return (
      getPriceOptions(itemData.source!, itemData.target!).find(
        price => price.id === itemData.priceId,
      ) || null
    )
  }
  const languagePairData = () =>
    priceData()?.languagePairs?.find(
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
    if (
      itemData?.id &&
      itemData?.id !== -1 &&
      priceData() &&
      itemData?.initialPrice?.priceId !== priceData()?.id
    ) {
      return minimumPrice()
    }

    // 기존 item
    // standard price 데이터가 없다면 쿼츠 작성 후 standard price가 삭제된 케이스이므로 여기서 처리
    else if (
      (itemData?.id && itemData?.id !== -1) ||
      (itemData?.id && itemData?.id !== -1) ||
      !priceData()
    ) {
      return itemData?.minimumPrice!
    }
    // Not Applicable(재설계 필요)
    else if (itemData?.id && itemData?.id === -1) return 0
    // 신규 item
    else {
      return minimumPrice()
    }
  }

  useEffect(() => {
    // Price가 세팅되어 있지 않을때는 Order의 Item에 설정된 Price unit을 설정해준다.
    if (
      orderItems?.length &&
      (!getItem().items[0].detail || !getItem().items?.[0].detail?.length)
    ) {
      const currentItem = orderItems.find(
        orderItem => orderItem.id === currentOrderItemId && currentOrderItemId,
      )
      currentItem?.detail?.map(item => {
        append &&
          append({
            ...item,
            unitPrice: null,
            currency: selectedPrice?.currency!,
          })
      })
    }
  }, [orderItems])

  // useUnitPriceOverrideInPrice가 true일 경우,
  // 선택된(또는 변경된) selectedPrice 값에 포함된 priceUnit과 현재 form의 priceUnit을 비교하여
  // unitPrice 값을 override 한다.
  useEffect(() => {
    if (useUnitPriceOverrideInPrice && useUnitPriceOverrideInPrice === true) {
      if (selectedPrice && selectedPrice?.priceUnit?.length > 0) {
        // selectedPrice에서 현재의 언어페어를 찾는다.
        // 언어페어에서 priceFactor값을 추출하기 위해 사용한다.
        const matchedLanguagePair: LanguagePairListType | undefined =
          findMatchedLanguagePairInItems &&
          findMatchedLanguagePairInItems(selectedPrice)

        selectedPrice.priceUnit.map(selectedUnit => {
          const matchedCurrentUnit = details?.findIndex(
            currentUnit => selectedUnit.priceUnitId === currentUnit.priceUnitId,
          )

          if (matchedCurrentUnit !== -1) {
            // case 1) 현재 unitPrice와 selectedPrice의 unitPrice가 같다면
            // 현재 unitPrice 정보에 selectedPrice의 unitPrice만 업데이트 한다.
            update &&
              details &&
              update(matchedCurrentUnit!, {
                ...details[matchedCurrentUnit!],

                quantity:
                  getItem()?.items[0]?.detail?.[matchedCurrentUnit!]
                    ?.quantity ?? details[matchedCurrentUnit!].quantity,
                unitPrice:
                  selectedUnit?.price && matchedLanguagePair?.priceFactor
                    ? selectedUnit.price * matchedLanguagePair.priceFactor
                    : 0,

                prices:
                  (getItem()?.items[0]?.detail?.[matchedCurrentUnit!]
                    ?.quantity ??
                    details[matchedCurrentUnit!].quantity ??
                    0) *
                  (selectedUnit?.price && matchedLanguagePair?.priceFactor
                    ? selectedUnit.price * matchedLanguagePair.priceFactor
                    : 0),
                // selectedUnit?.weighting && matchedLanguagePair?.priceFactor
                //   ? (selectedUnit?.weighting / 100) *
                //     matchedLanguagePair?.priceFactor
                //   : 0,
              })
            itemTrigger(`items.${0}.detail`)
            getTotalPrice()
          } else {
            // case 2)  현재 unitPrice와 selectedPrice의 unitPrice가 다르다면
            // selectedPrice의 unitPrice를 추가 한다.
            append &&
              append({
                ...selectedUnit,
                prices:
                  (selectedUnit.quantity ?? 0) *
                  (selectedUnit?.price && matchedLanguagePair?.priceFactor
                    ? selectedUnit.price * matchedLanguagePair.priceFactor
                    : 0),
                currency: selectedPrice.currency!,
                weighting: selectedUnit.weighting ?? 100,
                unitPrice:
                  selectedUnit?.price && matchedLanguagePair?.priceFactor
                    ? selectedUnit.price * matchedLanguagePair.priceFactor
                    : 0,
              })

            itemTrigger(`items.${0}.detail`)
            getTotalPrice()
          }
        })
      }
    }
  }, [selectedPrice, useUnitPriceOverrideInPrice])

  function onDeletePriceUnit(index: number) {
    const findIndex = details?.findIndex(item => item.priceUnitId === index)

    if (findIndex !== -1) {
      remove && remove(findIndex)
    }
  }

  const onDeleteNoPriceUnit = (index: number) => {
    remove && remove(index)
  }

  const handleShowMinimum = (value: boolean) => {
    const minimumPrice = Number(getItem(`items.${0}.minimumPrice`))
    const totalPrice = Number(getItem(`items.${0}.totalPrice`))
    const minimumPriceApplied = getItem(`items.${0}.minimumPriceApplied`)

    if (minimumPriceApplied && minimumPrice < totalPrice) return //데이터가 잘못된 케이스
    if (minimumPrice) {
      if (value) {
        if (minimumPrice && minimumPrice >= totalPrice) {
          setItem(`items.${0}.minimumPriceApplied`, true, setValueOptions)
        } else {
          setItem(`items.${0}.minimumPriceApplied`, false, setValueOptions)
        }
      } else if (!value) {
        setItem(`items.${0}.minimumPriceApplied`, false, setValueOptions)
      }
    } else {
      setItem(`items.${0}.minimumPriceApplied`, false, setValueOptions)
    }
    itemTrigger(`items.${0}.minimumPriceApplied`)
    getTotalPrice()
  }

  function getTotalPrice() {
    const itemMinimumPrice = Number(getItem(`items.${0}.minimumPrice`))
    const showMinimum = getItem(`items.${0}.minimumPriceApplied`)

    let total = 0
    const data = getItem(itemName)

    if (data?.length) {
      const itemPrices = data.map(value => Number(value.prices))
      console.log(itemPrices)
      const price = itemPrices.reduce((res, item) => res + item, 0)

      if (isNaN(price)) return

      if (itemMinimumPrice && price < itemMinimumPrice && showMinimum) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        // handleShowMinimum(true)
        total = itemMinimumPrice
      } else if (itemMinimumPrice && price >= itemMinimumPrice && showMinimum) {
        total = price
        // 아래 코드 활성화시 미니멈 프라이스가 활성화 되었으나 미니멈 프라이스 값이 없는 경우 무한루프에 빠짐
        if (showMinimum === true) handleShowMinimum(false)
      } else {
        total = price
      }
    } else if (!data?.length && showMinimum) {
      // 최초 상태, row는 없이 미니멈프라이스만 설정되어 있는 상태
      total = itemMinimumPrice!
    }
    if (total === itemData.totalPrice) return

    console.log(total, itemData.totalPrice, 'totalPrice')

    setItem(`items.${0}.totalPrice`, total, setValueOptions)
  }

  const onChangeCurrency = (
    currency: Currency,
    index: number,
    detail: Array<ItemDetailType>,
    // detail: FieldArrayWithId<
    //   {
    //     items: ItemType[]
    //   },
    //   `items.${number}.detail`,
    //   'id'
    // >,
    detailIndex: number,
  ) => {
    //not applicable일때 모든 price unit의 currency는 동일하게 변경되게 한다.
    getItem().items[0].detail?.map((priceUnit, idx) => {
      setItem(`items.${0}.detail.${idx}.currency`, currency)
    })
    setItem(`items.${index}.currency`, currency)
    itemTrigger(`items.${index}.detail`)
  }

  const sumTotalPrice = () => {
    return true
  }

  console.log(details, 'details')

  return (
    <Box sx={{ height: '100%' }}>
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
        onDeletePriceUnit={onDeletePriceUnit}
        // onItemBoxLeave={onItemBoxLeave}
        isValid={
          !!itemData.source &&
          !!itemData.target &&
          (!!itemData.priceId || itemData.priceId === NOT_APPLICABLE)
        }
        isNotApplicableAtPrice={isNotApplicable}
        // isNotApplicable={itemData.priceId === NOT_APPLICABLE}
        priceUnitsList={priceUnitsList}
        showMinimum={false} //이거 쓰나?
        setShowMinimum={n => true} //이거 쓰나?
        type={type}
        setDarkMode={setDarkMode}
        sumTotalPrice={sumTotalPrice}
        showCurrency={true}
        remove={remove}
        onChangeCurrency={onChangeCurrency}
        setValue={setItem}
        onDeleteNoPriceUnit={onDeleteNoPriceUnit}
        errorRefs={errorRefs}
        itemTrigger={itemTrigger}
      />
      {/* price unit end */}
    </Box>
  )
}

export default Row
