// ** react
import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'

// ** style component
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Radio,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { Icon } from '@iconify/react'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  useFieldArray,
} from 'react-hook-form'

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// ** types
import {
  ItemDetailType,
  ItemType,
  PostItemType,
} from '@src/types/common/item.type'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** types & validation
import { MemberType } from '@src/types/schema/project-team.schema'
import { languageType } from '@src/pages/quotes/add-new'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

// ** helpers
import languageHelper from '@src/shared/helpers/language.helper'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import ItemPriceUnitForm from './item-price-unit-form'
import TmAnalysisForm from './tm-analysis-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** values
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { DateTimePickerDefaultOptions } from 'src/shared/const/datePicker'

// ** helpers
import { FullDateHelper } from '@src/shared/helpers/date.helper'
import Link from 'next/link'
import { InvoiceReceivableDetailType } from '@src/types/invoice/receivable.type'
import { getCurrentRole } from '@src/shared/auth/storage'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import { UseMutationResult } from 'react-query'
import { CheckBox, TroubleshootRounded } from '@mui/icons-material'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { RoundingProcedureObj } from '@src/shared/const/rounding-procedure/rounding-procedure'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  getValues: UseFormGetValues<{ items: ItemType[] }>
  setValue: UseFormSetValue<{ items: ItemType[] }>
  errors: FieldErrors<{ items: ItemType[] }>
  fields: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
  remove: UseFieldArrayRemove
  isValid: boolean
  teamMembers?: Array<{ type: MemberType; id: number | null; name?: string }>
  languagePairs: languageType[]
  getPriceOptions: (
    source: string,
    target: string,
    idx?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  priceUnitsList: Array<PriceUnitListType>
  type: 'edit' | 'detail' | 'invoiceDetail' | 'create'
  orderId?: number
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
  }>
  updateItems?: UseMutationResult<
    any,
    unknown,
    {
      id: number
      items: PostItemType[]
    },
    unknown
  >
  project?: ProjectInfoType

  onClickCancelSplitOrder?: () => void
  onClickSplitOrderConfirm?: () => void
  selectedIds?: { id: number; selected: boolean }[]
  setSelectedIds?: Dispatch<
    SetStateAction<
      {
        id: number
        selected: boolean
      }[]
    >
  >
  splitReady?: boolean
  sumTotalPrice: () => void
}

export type DetailNewDataType = {
  priceUnitPairId: number
  priceUnitTitle: string
  priceUnitQuantity: number
  priceUnitUnit: string
  perWords: number
  priceUnitPrice: number
}
export type onCopyAnalysisParamType = {
  newData: DetailNewDataType | null
  prices: number
}[]
export default function ItemForm({
  control,
  getValues,
  setValue,
  errors,
  fields,
  remove,
  isValid,
  teamMembers,
  languagePairs,
  getPriceOptions,
  priceUnitsList,
  type,
  orderId,
  itemTrigger,
  updateItems,
  project,
  onClickCancelSplitOrder,
  onClickSplitOrderConfirm,
  selectedIds,
  setSelectedIds,
  splitReady,
  sumTotalPrice,
}: Props) {
  const { openModal, closeModal } = useModal()
  const currentRole = getCurrentRole()

  const defaultValue = { value: '', label: '' }
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    if (teamMembers && teamMembers.length) {
      const list = teamMembers
        .filter(item => item.id !== null)
        .map(item => ({
          value: item?.id?.toString()!,
          label: item.name || '',
        }))
      setContactPersonList(list)
    }
  }, [teamMembers])

  const getPricebyPairs = (idx: number) => {
    const options = getPriceOptions(
      getValues(`items.${idx}.source`),
      getValues(`items.${idx}.target`),
    )
    return options
  }
  // Language pair에 price가 변경된 경우 field(item)의 initialPrice.currency와 모든 item의 price의 currency를 비교하여
  // currency가 다른 경우 해당 item의 price를 null 처리한다.
  // 모달은 등록한 Language pair가 1개인 경우에만 발생시킨다.
  // (등록한 Language pair가 여러개인 경우 AddLanguagePairForm 폼에서 처리된다.)
  useEffect(() => {
    const targetCurrency = fields[0]?.initialPrice?.currency ?? null
    let items = getValues('items')
    let isUpdate = false
    if (items.length && targetCurrency) {
      items.map((item, idx) => {
        const matchPriceList = getPricebyPairs(idx)
        const itemPriceId = item.priceId
        const itemPrice = matchPriceList.filter(
          pair => itemPriceId === pair.id!,
        )
        if (
          itemPrice[0]?.currency &&
          targetCurrency !== itemPrice[0]?.currency
        ) {
          setValue(`items.${idx}.priceId`, null, setValueOptions)
          isUpdate = true
        }
      })
      if (languagePairs.length === 1 && isUpdate) {
        selectCurrencyViolation(1)
      }
    }
  }, [languagePairs, fields])

  // item의 Price currency와 field(item)의 initialPrice.currency를 비교한다.
  // 값이 다르면 item의 price를 null 처리한다.
  const checkPriceCurrency = (price: StandardPriceListType, index: number) => {
    const targetCurrency = fields[0]?.initialPrice?.currency ?? null
    if (targetCurrency) {
      if (price?.currency !== targetCurrency) {
        setValue(`items.${index}.priceId`, null, setValueOptions)
        selectCurrencyViolation(1)
        return false
      }
    }
    return true
  }

  const selectNotApplicableOption = () => {
    openModal({
      type: 'info-not-applicable-unavailable',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('info-not-applicable-unavailable')}
          message={`The "Not Applicable" option is currently unavailable.\n\nPlease select a price or\ncreate a new price if there is no suitable price according to the conditions.`}
          vary='info'
        />
      ),
    })
  }

  const selectCurrencyViolation = (type: number) => {
    const message1 = `Please check the currency of the selected price. You can't use different currencies in a quote.`
    const message2 =
      'Please select the price for the first language pair first.'
    openModal({
      type: 'error-currency-violation',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('error-currency-violation')}
          message={type === 1 ? message1 : message2}
          vary={type === 1 ? 'error' : 'info'}
        />
      ),
    })
  }

  function onItemRemove(idx: number) {
    openModal({
      type: 'delete-item',
      children: (
        <DeleteConfirmModal
          message='Are you sure you want to delete this item?'
          onClose={() => closeModal('delete-item')}
          onDelete={() => handleItemRemove(idx)}
        />
      ),
    })
  }

  function handleItemRemove(idx: number) {
    remove(idx)
    sumTotalPrice()
  }

  function findLangPairIndex(source: string, target: string) {
    for (let i = 0; i < languagePairs.length; i++) {
      if (
        languagePairs[i].source === source &&
        languagePairs[i].target === target
      ) {
        return i
      }
    }
    return -1
  }

  const openMinimumPriceModal = (value: any) => {
    const minimumPrice = formatCurrency(value.minimumPrice, value.currency)
    openModal({
      type: 'info-minimum',
      children: (
        <CustomModal
          onClose={() => closeModal('info-minimum')}
          vary='info'
          title={
            <>
              The selected price includes a minimum price setting. <br />
              <br /> Minimum price : {minimumPrice} <br />
              <br />
              If the amount of the added price unit is lower than the minimum
              price, the minimum price will be automatically applied to the
              total price.
            </>
          }
          soloButton={true}
          rightButtonText='Okay'
          onClick={() => closeModal('info-minimum')}
        />
        // <SimpleMultilineAlertModal
        //   onClose={() => {
        //     closeModal('info-minimum')
        //   }}
        //   message={`The selected Price includes a Minimum price setting.\n\nMinimum price: ${minimumPrice}\n\nIf the amount of the added Price unit is lower than the Minimum price, the Minimum price will be automatically applied to the Total price.`}
        //   vary='info'
        // />
      ),
    })
  }

  const Row = ({ idx }: { idx: number }) => {
    const [cardOpen, setCardOpen] = useState(true)
    const itemData = getValues(`items.${idx}`)

    /* price unit */
    const itemName: `items.${number}.detail` = `items.${idx}.detail`

    // standard price에 등록된 데이터중 매칭된 데이터

    const priceData = () => {
      return (
        getPriceOptions(itemData.source, itemData.target).find(
          price => price.id === itemData.priceId,
        ) || null
      )
    }
    // const languagePairData = () => priceData()?.languagePairs?.find(
    //   i => i.source === itemData.source && i.target === itemData.target,
    // )
    // const minimumPrice = () => languagePairData()?.minimumPrice
    // const priceFactor = () => languagePairData()?.priceFactor
    // 여기까지

    // 현재 row의 프라이스 유닛에 적용될 minimumPrice 값
    // 신규 item인 경우: 기존에 저장된 price가 없으므로 선택된 price의 standard price정보에서 minimumPrice 추출
    // 기존 item인 경우: 저장된 price가 있으므로(initialPrice) initialPrice에서 minimumPrice 값 추출
    // const currentMinimumPrice = () => {
    //   console.log("minimum check",itemData.minimumPrice,priceData())
    //   // 기존 item에서 price 변경, 이때는 Standard price의 minimum price 값을 줘야 함
    //   if (
    //     itemData?.id &&
    //     itemData?.id !== -1 &&
    //     priceData() &&
    //     itemData?.initialPrice?.priceId !== priceData()?.id
    //   ) {
    //     console.log("#1",minimumPrice())
    //     return minimumPrice()
    //   }

    //   // 기존 아이템에서 변경되었으나, 기존과 priceId가 같은 경우, 어쨋든 변경된 케이스이므로 Standard price의 minimum price를 줘야 함
    //   if (itemData?.initialPrice?.priceId === priceData()?.id && type === 'edit') {
    //     console.log("#2",minimumPrice())
    //     return minimumPrice()
    //   }
    //   // 기존 item
    //   // standard price 데이터가 없다면 쿼츠 작성 후 standard price가 삭제된 케이스이므로 여기서 처리
    //   else if (
    //     (itemData?.id && itemData?.id !== -1) ||
    //     (itemData?.id && itemData?.id !== -1) ||
    //     !priceData()
    //   ) {
    //     console.log("#3",itemData?.minimumPrice!)
    //     return itemData?.minimumPrice!
    //   }
    //   // Not Applicable(재설계 필요)
    //   else if (itemData?.id && itemData?.id === -1) return 0
    //   // 신규 item
    //   else {
    //     console.log("#4", minimumPrice())
    //     return minimumPrice()
    //   }
    // }

    // const showMinimum = itemData.minimumPriceApplied

    const handleShowMinimum = (value: boolean) => {
      const minimumPrice = Number(getValues(`items.${idx}.minimumPrice`))
      const totalPrice = Number(getValues(`items.${idx}.totalPrice`))
      const minimumPriceApplied = getValues(`items.${idx}.minimumPriceApplied`)

      if (minimumPriceApplied && minimumPrice < totalPrice) return //데이터가 잘못된 케이스
      if (minimumPrice) {
        if (value) {
          if (minimumPrice && minimumPrice >= totalPrice) {
            setValue(`items.${idx}.minimumPriceApplied`, true, setValueOptions)
          } else {
            setValue(`items.${idx}.minimumPriceApplied`, false, setValueOptions)
          }
        } else if (!value) {
          setValue(`items.${idx}.minimumPriceApplied`, false, setValueOptions)
        }
      } else {
        setValue(`items.${idx}.minimumPriceApplied`, false, setValueOptions)
      }
      itemTrigger(`items.${idx}.minimumPriceApplied`)
      getTotalPrice()
    }

    // useEffect(() => {
    //   const minimumPrice = getValues(`items.${idx}.minimumPrice`)
    //   const totalPrice = getValues(`items.${idx}.totalPrice`)
    //   setValue(`items.${idx}.minimumPriceApplied`, totalPrice < minimumPrice! ? true : false, setValueOptions)

    // }, [getValues, setValue])

    // 현재 row의 프라이스 유닛에 적용될 currency 값
    // 신규 item인 경우: 기존에 저장된 price가 없으므로 선택된 price의 standard price정보에서 currency 추출
    // 기존 item인 경우: 저장된 price가 있으므로(initialPrice) initialPrice에서 currency 값 추출
    // const currentCurrency = () => {
    //   // setPriceData(getPriceData())
    //   // 기존 item
    //   if (itemData?.id && itemData?.id !== -1)
    //     return itemData?.initialPrice?.currency!
    //   // Not Applicable(재설계 필요)
    //   else if (itemData?.id && itemData?.id === -1) return 'USD'
    //   // 신규 item
    //   else return priceData()?.currency!
    // }

    const {
      fields: details,
      append,
      update,
      remove,
    } = useFieldArray({
      control,
      name: itemName,
    })

    function onDeletePriceUnit(index: number) {
      remove(index)
      if (getValues(`items.${idx}.detail`)?.length === 0) {
        handleShowMinimum(true)
      }
    }

    function onDeleteAllPriceUnit() {
      details.map((unit, idx) => remove(idx))
      handleShowMinimum(true)
    }

    function getTotalPrice() {
      const itemMinimumPrice = Number(getValues(`items.${idx}.minimumPrice`))
      const showMinimum = getValues(`items.${idx}.minimumPriceApplied`)

      let total = 0
      const data = getValues(itemName)

      if (data?.length) {
        const price = data.reduce(
          (res, item) => (res += Number(item.prices)),
          0,
        )
        if (isNaN(price)) return

        if (itemMinimumPrice && price < itemMinimumPrice && showMinimum) {
          data.forEach(item => {
            total += item.unit === 'Percent' ? Number(item.prices) : 0
          })
          // handleShowMinimum(true)
          total = itemMinimumPrice
        } else if (itemMinimumPrice && price >= itemMinimumPrice && showMinimum){
          total = price
          // 아래 코드 활성화시 미니멈 프라이스가 활성화 되었으나 미니멈 프라이스 값이 없는 경우 무한루프에 빠짐
          if (showMinimum === true) handleShowMinimum(false)
        } else {
          total = price
        }

      } else if (!data?.length && showMinimum){
        // 최초 상태, row는 없이 미니멈프라이스만 설정되어 있는 상태
        total = itemMinimumPrice!
      }
      if (total === itemData.totalPrice) return

      setValue(`items.${idx}.totalPrice`, total, setValueOptions)
      itemTrigger(`items.${idx}.totalPrice`)
      sumTotalPrice()
    }

    function getEachPrice(index: number, isNotApplicable?: boolean) {
      // setPriceData(getPriceData())
      const data = getValues(itemName)
      if (!data?.length) return
      let prices = 0
      const detail = data?.[index]
      if (detail && detail.unit === 'Percent') {
        const percentQuantity = data[index].quantity

        const itemMinimumPrice = getValues(`items.${idx}.minimumPrice`)
        const showMinimum = getValues(`items.${idx}.minimumPriceApplied`)
        if (itemMinimumPrice && showMinimum) {
          prices = (percentQuantity / 100) * itemMinimumPrice
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
      const currency = getValues(`items.${idx}.initialPrice.currency`) ?? 'KRW'
      const roundingPrice = formatByRoundingProcedure(
        prices,
        priceData()?.decimalPlace!
          ? priceData()?.decimalPlace!
          : currency === 'USD' || currency === 'SGD'
          ? 2
          : 1000,
        priceData()?.roundingProcedure! ?? 0,
        currency,
      )
      // 새롭게 등록할때는 기존 데이터에 언어페어, 프라이스 정보가 없으므로 스탠다드 프라이스 정보를 땡겨와서 채운다
      // 스탠다드 프라이스의 언어페어 정보 : languagePairs
      setValue(`items.${idx}.detail.${index}.currency`, currency, {
        shouldDirty: true,
        shouldValidate: false,
      })
      // TODO: NOT_APPLICABLE일때 Price의 Currency를 업데이트 할 수 있는 방법이 필요함
      setValue(`items.${idx}.detail.${index}.prices`, roundingPrice, {
        shouldDirty: true,
        shouldValidate: false,
      })
    }

    // function onItemBoxLeave() {
    //   const isMinimumPriceConfirmed =
    //     !!minimumPrice &&
    //     minimumPrice > getValues(`items.${idx}.totalPrice`) &&
    //     showMinimum.checked

    //   const isNotMinimum =
    //     !minimumPrice || minimumPrice <= getValues(`items.${idx}.totalPrice`)

    //   if (!isMinimumPriceConfirmed && !isNotMinimum && type === 'edit') {
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
    //   itemTrigger('items')
    // }

    /* tm analysis */
    function onCopyAnalysis(data: onCopyAnalysisParamType) {
      const availableData = data.filter(item => item.newData !== null)
      if (!availableData?.length) return

      availableData.forEach(item => {
        const newData = item.newData!
        append({
          priceUnitId: newData.priceUnitPairId,
          quantity: newData.priceUnitQuantity,
          // priceUnit: newData.priceUnitTitle,
          unit: newData.priceUnitUnit,
          currency: fields[idx]?.initialPrice?.currency! || 'KRW',
          unitPrice: newData.priceUnitPrice,
          prices: item.prices,
          priceFactor: getValues(`items.${idx}.priceFactor`)
            ? String(getValues(`items.${idx}.priceFactor`))
            : null,
        })
      })
      getTotalPrice()
    }

    const isNotApplicable = () => {
      const value = getValues().items[idx]
      if (value.priceId === NOT_APPLICABLE) return true
      return false
    }

    function onChangeLanguagePair(v: languageType | null, idx: number) {
      setValue(`items.${idx}.source`, v?.source ?? '', setValueOptions)
      setValue(`items.${idx}.target`, v?.target ?? '', setValueOptions)

      if (v?.price) {
        setValue(`items.${idx}.priceId`, v?.price?.id, setValueOptions)
        const priceData = getPriceOptions(v?.source, v?.target).find(
          price => price.id === v?.price?.id,
        )
        const languagePairData = priceData?.languagePairs?.find(
          i => i.source === v?.source && i.target === v?.target,
        )
        const minimumPrice = languagePairData?.minimumPrice
        const priceFactor = languagePairData?.priceFactor
        const currency = languagePairData?.currency
        const rounding = priceData?.roundingProcedure
        const numberPlace = priceData?.decimalPlace

        setValue(`items.${idx}.totalPrice`, 0, setValueOptions)
        setValue(
          `items.${idx}.minimumPrice`,
          minimumPrice ?? 0,
          setValueOptions,
        )
        setValue(`items.${idx}.priceFactor`, priceFactor ?? 0, setValueOptions)
        setValue(
          `items.${idx}.initialPrice.currency`,
          currency!,
          setValueOptions,
        )
        setValue(
          `items.${idx}.initialPrice.numberPlace`,
          numberPlace!,
          setValueOptions,
        )
        setValue(
          `items.${idx}.initialPrice.rounding`,
          //@ts-ignore
          RoundingProcedureObj[rounding!],
          setValueOptions,
        )
        itemTrigger(`items.${idx}`)
        getTotalPrice()

        handleMinimumPrice()
      }
    }

    function onChangePrice(v: StandardPriceListType, idx: number) {
      if (v?.id) {
        const source = getValues(`items.${idx}.source`)
        const target = getValues(`items.${idx}.target`)
        setValue(`items.${idx}.priceId`, v?.id, setValueOptions)
        const priceData = getPriceOptions(source, target).find(
          price => price.id === v?.id,
        )
        const languagePairData = priceData?.languagePairs?.find(
          i => i.source === source && i.target === target,
        )
        const minimumPrice = languagePairData?.minimumPrice
        const priceFactor = languagePairData?.priceFactor
        const currency = languagePairData?.currency
        const rounding = priceData?.roundingProcedure
        const numberPlace = priceData?.decimalPlace

        setValue(`items.${idx}.totalPrice`, 0, setValueOptions)
        setValue(
          `items.${idx}.minimumPrice`,
          minimumPrice ?? 0,
          setValueOptions,
        )
        setValue(`items.${idx}.priceFactor`, priceFactor ?? 0, setValueOptions)
        setValue(
          `items.${idx}.initialPrice.currency`,
          currency!,
          setValueOptions,
        )
        setValue(
          `items.${idx}.initialPrice.numberPlace`,
          numberPlace!,
          setValueOptions,
        )
        setValue(
          `items.${idx}.initialPrice.rounding`,
          //@ts-ignore
          RoundingProcedureObj[rounding!],
          setValueOptions,
        )
        itemTrigger(`items.${idx}`)
        getTotalPrice()

        handleMinimumPrice()
      }
    }

    const handleMinimumPrice = () => {
      const minimumPrice = getValues(`items.${idx}.minimumPrice`)
      const currency = getValues(`items.${idx}.initialPrice.currency`)
      if (minimumPrice && minimumPrice !== 0) {
        handleShowMinimum(true)
        openMinimumPriceModal({
          minimumPrice: minimumPrice,
          currency: currency,
        })
      } else handleShowMinimum(false)
    }
    return (
      <Box
        style={{
          border: '1px solid rgba(76, 78, 100, 0.22)',
          borderRadius: '10px',
          marginBottom: '14px',
        }}
      >
        <Grid container spacing={6} padding='20px'>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center' gap='8px'>
                {splitReady && selectedIds ? (
                  <Checkbox
                    checked={selectedIds[idx].selected}
                    onChange={e => {
                      setSelectedIds &&
                        setSelectedIds(prev => {
                          const copy = [...prev]
                          copy[idx].selected = e.target.checked
                          return copy
                        })
                    }}
                    sx={{ padding: 0 }}
                    // sx={{ border: '1px solid', padding: 0 }}
                    // icon={<RadioButtonUncheckedIcon />}
                    // checkedIcon={<CheckCircleIcon />}
                  />
                ) : null}
                <IconButton onClick={() => setCardOpen(!cardOpen)}>
                  <Icon
                    icon={`${
                      cardOpen
                        ? 'material-symbols:keyboard-arrow-up'
                        : 'material-symbols:keyboard-arrow-down'
                    }`}
                  />
                </IconButton>
                <Typography fontWeight={500}>
                  {idx + 1 <= 10 ? `0${idx + 1}.` : `${idx + 1}.`}&nbsp;
                  {type === 'detail' || type === 'invoiceDetail'
                    ? getValues(`items.${idx}.itemName`)
                    : null}
                </Typography>
              </Box>
              {type === 'detail' || type === 'invoiceDetail' ? null : (
                <IconButton onClick={() => onItemRemove(idx)}>
                  <Icon icon='mdi:trash-outline' />
                </IconButton>
              )}
            </Box>
          </Grid>
          {cardOpen ? (
            <>
              {type === 'detail' || type === 'invoiceDetail' ? null : (
                <Grid item xs={12}>
                  <Controller
                    name={`items.${idx}.itemName`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Item name*'
                        variant='outlined'
                        value={value ?? ''}
                        onChange={onChange}
                        inputProps={{ maxLength: 200 }}
                        error={Boolean(errors?.items?.[idx]?.itemName)}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                {type === 'detail' || type === 'invoiceDetail' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '21px',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
                      variant='body1'
                    >
                      Item due date
                    </Typography>
                    <Typography variant='body1' fontSize={14}>
                      {FullDateHelper(getValues(`items.${idx}.dueAt`))}
                    </Typography>
                  </Box>
                ) : (
                  <Controller
                    name={`items.${idx}.dueAt`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FullWidthDatePicker
                        {...DateTimePickerDefaultOptions}
                        selected={!value ? null : new Date(value)}
                        onChange={onChange}
                        placeholderText='MM/DD/YYYY, HH:MM'
                        customInput={
                          <CustomInput label='Item due date*' icon='calendar' />
                        }
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                {type === 'detail' || type === 'invoiceDetail' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '21px',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
                      variant='body1'
                    >
                      Contact person for job
                    </Typography>
                    <Typography variant='body1' fontSize={14}>
                      {
                        contactPersonList.find(
                          item =>
                            item.value ===
                            getValues(
                              `items.${idx}.contactPerson.id`,
                            )?.toString(),
                        )?.label
                      }
                    </Typography>
                  </Box>
                ) : (
                  <Controller
                    name={`items.${idx}.contactPerson.id`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={contactPersonList}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.value === newValue.value
                        }}
                        onChange={(e, v) => {
                          onChange(v?.value ?? '')
                        }}
                        value={
                          !value
                            ? defaultValue
                            : contactPersonList.find(
                                item => item.value === value.toString(),
                              )
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Contact person for job*'
                            placeholder='Contact person for job*'
                          />
                        )}
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                {type === 'detail' || type === 'invoiceDetail' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '21px',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
                      variant='body1'
                    >
                      Language pair
                    </Typography>
                    <Typography variant='body1' fontSize={14}>
                      {/* {languageHelper(
                        languagePairs.find(
                          item =>
                            item.source === getValues(`items.${idx}.source`) &&
                            item.target === getValues(`items.${idx}.target`),
                        )?.source,
                      )} */}
                      {languageHelper(getValues(`items.${idx}.source`))}
                      &nbsp;&rarr;&nbsp;
                      {/* {languageHelper(
                        languagePairs.find(
                          item =>
                            item.source === getValues(`items.${idx}.source`) &&
                            item.target === getValues(`items.${idx}.target`),
                        )?.target,
                      )} */}
                      {languageHelper(getValues(`items.${idx}.target`))}
                    </Typography>
                  </Box>
                ) : (
                  <Controller
                    name={`items.${idx}.source`}
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={[...languagePairs].sort((a, b) =>
                            a.source.localeCompare(b.source),
                          )}
                          getOptionLabel={option =>
                            `${languageHelper(
                              option.source,
                            )} -> ${languageHelper(option.target)}`
                          }
                          onChange={(e, v) => {
                            onChangeLanguagePair(v, idx)
                          }}
                          value={
                            !value
                              ? null
                              : languagePairs.find(
                                  item =>
                                    item.source === value &&
                                    item.target ===
                                      getValues(`items.${idx}.target`),
                                )
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errors?.items?.[idx]?.source)}
                              label='Language pair*'
                              placeholder='Language pair*'
                            />
                          )}
                        />
                      )
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                {type === 'detail' || type === 'invoiceDetail' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '21px',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{ width: '193px', fontWeight: 600, fontSize: '14px' }}
                      variant='body1'
                    >
                      Price
                    </Typography>
                    <Typography variant='body1' fontSize={14}>
                      {
                        // getPriceOptions(
                        //   getValues(`items.${idx}.source`),
                        //   getValues(`items.${idx}.target`),
                        // ).find(
                        //   item => item.id === getValues(`items.${idx}.priceId`),
                        // )?.priceName
                        itemData.initialPrice?.name
                      }
                    </Typography>
                  </Box>
                ) : (
                  <Controller
                    name={`items.${idx}.priceId`}
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      const options = getPriceOptions(
                        getValues(`items.${idx}.source`),
                        getValues(`items.${idx}.target`),
                        idx,
                      )
                      let hasMatchingPrice = false
                      let hasStandardPrice = false
                      options.find(option => {
                        if (option.groupName && option.groupName === 'Matching price') hasMatchingPrice = true
                        if (option.groupName && option.groupName === 'Standard client price') hasStandardPrice = true
                      })
                      return (
                        <Autocomplete
                        // <StyledAutocomplete
                          autoHighlight
                          fullWidth
                          options={options}
                          groupBy={option => option?.groupName ?? ''}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.priceName === newValue?.priceName
                          }}
                          getOptionLabel={option =>
                            option.priceName === 'Not applicable' 
                              ? `${option.priceName}`
                              : `${option.priceName} (${option.currency})`
                          }
                          onChange={(e, v) => {
                            // Not Applicable 임시 막기
                            // currency 체크 로직
                            if (v) {
                              if (checkPriceCurrency(v, idx)) {
                                onChange(v?.id)
                                const value = getValues().items[idx]
                                const index = findLangPairIndex(
                                  value?.source!,
                                  value?.target!,
                                )
                                onChangePrice(v, idx)

                                if (index !== -1) {
                                  const copyLangPair = [...languagePairs]
                                  copyLangPair[index].price = v
                                }
                                getTotalPrice()
                              }
                            }
                          }}
                          value={
                            value === null
                              ? null
                              : options[0].groupName === 'Current price'
                              ? options[0]
                              : options.find(item => item.id === value)
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={Boolean(errors?.items?.[idx]?.priceId)}
                              label='Price*'
                              placeholder='Price*'
                            />
                          )}
                          renderGroup={(params) => (
                            <li key={params.key}>
                              {!hasMatchingPrice && params.group
                                ? <GroupHeader>
                                    Matching price <NoResultText>(No result)</NoResultText>
                                  </GroupHeader>
                                : null
                               }
                              {!hasStandardPrice && params.group
                                ? <GroupHeader>
                                    Standard client price <NoResultText>(No result)</NoResultText>
                                  </GroupHeader>
                                : null
                               }
                              <GroupHeader>{params.group}</GroupHeader>
                              <GroupItems>{params.children}</GroupItems>
                            </li>
                          )}
                        />
                      )
                    }}
                  />
                )}
              </Grid>
              {/* price unit start */}
              <ItemPriceUnitForm
                control={control}
                index={idx}
                minimumPrice={getValues(`items.${idx}.minimumPrice`)!}
                details={details}
                priceData={priceData()}
                getValues={getValues}
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
                // isNotApplicable={isNotApplicable()}
                priceUnitsList={priceUnitsList}
                showMinimum={getValues(`items.${idx}.minimumPriceApplied`)}
                setShowMinimum={handleShowMinimum}
                type={type}
                sumTotalPrice={sumTotalPrice}
                fields={fields}
              />
              {/* price unit end */}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='subtitle1' mb='24px' fontWeight={600}>
                    Item description
                  </Typography>

                  {currentRole?.name === 'CLIENT' ? null : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Controller
                        name={`items.${idx}.showItemDescription`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Checkbox
                            disabled={
                              type === 'detail' || type === 'invoiceDetail'
                            }
                            value={value}
                            onChange={e => {
                              onChange(e.target.checked)
                            }}
                            checked={value}
                          />
                        )}
                      />

                      <Typography variant='body2'>
                        Show item description to client
                      </Typography>
                    </Box>
                  )}
                </Box>
                {type === 'detail' || type === 'invoiceDetail' ? (
                  <Typography>
                    {currentRole?.name === 'CLIENT'
                      ? getValues(`items.${idx}.showItemDescription`)
                        ? getValues(`items.${idx}.description`)
                        : '-'
                      : getValues(`items.${idx}.description`) !== ''
                        ? getValues(`items.${idx}.description`)
                        : '-'
                    }
                  </Typography>
                ) : (
                  <Controller
                    name={`items.${idx}.description`}
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <>
                          <TextField
                            rows={4}
                            multiline
                            fullWidth
                            placeholder='Write down an item description.'
                            value={value ?? ''}
                            onChange={onChange}
                            inputProps={{ maxLength: 500 }}
                          />
                          <Typography
                            variant='body2'
                            mt='12px'
                            textAlign='right'
                          >
                            {value?.length ?? 0}/500
                          </Typography>
                        </>
                      )
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {/* TM analysis */}
              {type === 'invoiceDetail' ||
              (currentRole && currentRole.name === 'CLIENT') ? null : (
                <Grid item xs={12}>
                  <TmAnalysisForm
                    control={control}
                    index={idx}
                    details={details}
                    priceData={priceData()}
                    priceFactor={getValues(`items.${idx}.priceFactor`)}
                    onCopyAnalysis={onCopyAnalysis}
                    type={type}
                  />
                </Grid>
              )}
              {/* TM analysis */}
            </>
          ) : null}
        </Grid>
      </Box>
    )
  }

  return (
    <DatePickerWrapper>
      <Grid
        item
        xs={12}
        display='flex'
        padding='20px'
        alignItems='center'
        justifyContent='space-between'
        sx={{ background: '#F5F5F7', marginBottom: '24px' }}
      >
        <Typography variant='h6'>Items ({fields.length ?? 0})</Typography>
        {(type === 'invoiceDetail' || type === 'detail') &&
        currentRole &&
        currentRole.name !== 'CLIENT' &&
        orderId &&
        fields.length ? (
          <Link
            href={`/orders/job-list/details/?orderId=${orderId}`}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            Jobs
            <Icon icon='ic:outline-arrow-forward' color='#666CFF' />
          </Link>
        ) : null}
      </Grid>
      {fields.map((item, idx) => (
        <Row key={item.id} idx={idx} />
      ))}
    </DatePickerWrapper>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
const StyledAutocomplete = styled(Autocomplete)`
  && .MuiAutocomplete-groupLabel {
    margin-left: 0;
    font-weight: bold;
  }
`
const GroupHeader = styled('div')({
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: '20px',
  fontWeight: 'bold',
})

const NoResultText = styled('span')({
  fontWeight: 'normal',
});

const GroupItems = styled('ul')({
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingLeft: '5px',
});