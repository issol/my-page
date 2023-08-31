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
      items.map((item,idx) => {
        const matchPriceList = getPricebyPairs(idx)
        const itemPriceId = item.priceId
        const itemPrice = matchPriceList.filter(pair => itemPriceId === pair.id!)
        if (itemPrice[0]?.currency && targetCurrency !== itemPrice[0]?.currency) {
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

  const controlMinimumPriceModal = (price:StandardPriceListType) => {
    if (price.languagePairs[0]?.minimumPrice) {
      openMinimumPriceModal(price)
    }
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
    const message2 = 'Please select the price for the first language pair first.'
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

  function onChangeLanguagePair(v: languageType | null, idx: number) {
    setValue(`items.${idx}.source`, v?.source ?? '', setValueOptions)
    setValue(`items.${idx}.target`, v?.target ?? '', setValueOptions)
    if (v?.price) {
      setValue(`items.${idx}.priceId`, v?.price?.id, setValueOptions)
      controlMinimumPriceModal(v?.price)
    }
  }

  function onItemRemove(idx: number) {
    openModal({
      type: 'delete-item',
      children: (
        <DeleteConfirmModal
          message='Are you sure you want to delete this item?'
          onClose={() => closeModal('delete-item')}
          onDelete={() => remove(idx)}
        />
      ),
    })
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
    const minimumPrice = formatCurrency(
      value?.languagePairs[0]?.minimumPrice,
      value?.currency,
    )
    openModal({
      type: 'info-minimum',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => {
            closeModal('info-minimum')
          }}
          message={`The selected Price includes a Minimum price setting.\n\nMinimum price: ${minimumPrice}\n\nIf the amount of the added Price unit is lower than the Minimum price, the Minimum price will be automatically applied to the Total price.`}
          vary='info'
        />
      ),
    })
  }

  const Row = ({ idx }: { idx: number }) => {
    const [cardOpen, setCardOpen] = useState(true)

    const itemData = getValues(`items.${idx}`)
    /* price unit */
    const itemName: `items.${number}.detail` = `items.${idx}.detail`

    const sourceLanguage = itemData.source
    const targetLanguage = itemData.target

    // standard price에 등록된 데이터중 매칭된 데이터
    const priceData =
    getPriceOptions(itemData.source, itemData.target).find(
      price => price.id === itemData.priceId,
    ) || null
    const languagePairData = priceData?.languagePairs?.find(
      i => i.source === sourceLanguage && i.target === targetLanguage,
    )
    const minimumPrice = languagePairData?.minimumPrice
    const priceFactor = languagePairData?.priceFactor
    // 여기까지

      // 현재 row의 프라이스 유닛에 적용될 minimumPrice 값
    // 신규 item인 경우: 기존에 저장된 price가 없으므로 선택된 price의 standard price정보에서 minimumPrice 추출
    // 기존 item인 경우: 저장된 price가 있으므로(initialPrice) initialPrice에서 minimumPrice 값 추출
    const currentMinimumPrice = () => {
      // 기존 item
      if (itemData?.id && itemData?.id !== -1) return itemData?.minimumPrice!
      // Not Applicable(재설계 필요)
      else if (itemData?.id && itemData?.id === -1) return 0
      // 신규 item
      else return minimumPrice
    }
    // 현재 row의 프라이스 유닛에 적용될 currency 값
    // 신규 item인 경우: 기존에 저장된 price가 없으므로 선택된 price의 standard price정보에서 currency 추출
    // 기존 item인 경우: 저장된 price가 있으므로(initialPrice) initialPrice에서 currency 값 추출
    const currentCurrency = () => {
      // 기존 item
      if (itemData?.id && itemData?.id !== -1) return itemData?.initialPrice?.currency!
      // Not Applicable(재설계 필요)
      else if (itemData?.id && itemData?.id === -1) return 'USD'
      // 신규 item
      else return priceData?.currency!
    }
    const {
      fields: details,
      append,
      update,
      remove,
    } = useFieldArray({
      control,
      name: itemName,
    })

    function onDeletePriceUnit(idx: number) {
      remove(idx)
    }

    function getTotalPrice() {
      let total = 0
      const data = getValues(itemName)
      if (data?.length) {
        const price = data.reduce(
          (res, item) => (res += Number(item.prices)),
          0,
        )
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
      setValue(`items.${idx}.totalPrice`, total, {
        shouldDirty: true,
        shouldValidate: false,
      })
    }

    function getEachPrice(
      index: number,
      showMinimum?: boolean,
      isNotApplicable?: boolean,
    ) {
      const data = getValues(itemName)
      if (!data?.length) return
      let prices = 0
      const detail = data?.[index]
      if (detail && detail.unit === 'Percent') {
        const percentQuantity = data[index].quantity

        const itemMinimumPrice = currentMinimumPrice()
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
      // const currentCurrency = () => {
      //   if (isNotApplicable) return detail?.currency
      //   return fields[idx]?.initialPrice?.currency!
      // }
      const roundingPrice = formatByRoundingProcedure(
        prices,
        priceData?.decimalPlace!
          ? priceData?.decimalPlace!
          : currentCurrency() === 'USD' || currentCurrency() === 'SGD'
          ? 2
          : 1000,
        priceData?.roundingProcedure! ?? 0,
        currentCurrency(),
      )
      // 새롭게 등록할때는 기존 데이터에 언어페어, 프라이스 정보가 없으므로 스탠다드 프라이스 정보를 땡겨와서 채운다
      // 스탠다드 프라이스의 언어페어 정보 : languagePairs
      setValue(`items.${idx}.detail.${index}.currency`, currentCurrency(), {
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
          currency: fields[idx]?.initialPrice?.currency! || 'USD',
          unitPrice: newData.priceUnitPrice,
          prices: item.prices,
          priceFactor: priceFactor ? String(priceFactor) : null,
        })
      })
      getTotalPrice()
    }

    const isNotApplicable = () => {
      const value = getValues().items[idx]
      if (value.priceId === NOT_APPLICABLE) return true
      return false
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
                    ? getValues(`items.${idx}.name`)
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
                    name={`items.${idx}.name`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Item name*'
                        variant='outlined'
                        value={value ?? ''}
                        onChange={onChange}
                        inputProps={{ maxLength: 200 }}
                        error={Boolean(errors?.items?.[idx]?.name)}
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
                      {languageHelper(
                        getValues(`items.${idx}.source`)
                      )}
                      &nbsp;&rarr;&nbsp;
                      {/* {languageHelper(
                        languagePairs.find(
                          item =>
                            item.source === getValues(`items.${idx}.source`) &&
                            item.target === getValues(`items.${idx}.target`),
                        )?.target,
                      )} */}
                      {languageHelper(
                        getValues(`items.${idx}.target`)
                      )}
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
                        idx
                      )
                      return (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={options}
                          groupBy={option => option?.groupName ?? ''}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.priceName === newValue?.priceName
                          }}
                          getOptionLabel={option => `${option.priceName} (${option.currency})`}
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
                                controlMinimumPriceModal(v)
                                if (index !== -1) {
                                  const copyLangPair = [...languagePairs]
                                  copyLangPair[index].price = v
                                }
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
                minimumPrice={currentMinimumPrice()}
                details={details}
                priceData={priceData}
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
                // showMinimum={showMinimum}
                // setShowMinimum={setShowMinimum}
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
                    {getValues(`items.${idx}.description`)}
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
                    priceData={priceData}
                    priceFactor={priceFactor}
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
