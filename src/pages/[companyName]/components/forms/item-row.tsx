import { formatCurrency } from '@src/shared/helpers/price.helper'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  useFieldArray,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { onCopyAnalysisParamType } from './items-form'
import { languageType } from 'src/pages/[companyName]/quotes/add-new'
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'
import { FullDateHelper } from '@src/shared/helpers/date.helper'
import { styled } from '@mui/system'
import DatePicker from 'react-datepicker'
import TmAnalysisForm from './tm-analysis-form'
import ItemPriceUnitForm from './item-price-unit-form'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { getCurrentRole } from '@src/shared/auth/storage'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { DateTimePickerDefaultOptions } from '@src/shared/const/datePicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import languageHelper from '@src/shared/helpers/language.helper'
import { RoundingProcedureObj } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { MemberType } from '@src/types/schema/project-team.schema'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { FormErrors } from '@src/shared/const/formErrors'
import { Currency } from '@src/types/common/currency.type'

type Props = {
  idx: number
  setValue: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  getValues: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  getPriceOptions: (
    source: string,
    target: string,
    idx?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  fields: FieldArrayWithId<
    { items: ItemType[]; languagePairs: languageType[] },
    'items',
    'id'
  >[]

  itemTrigger: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  control: Control<{ items: ItemType[]; languagePairs: languageType[] }, any>
  sumTotalPrice: () => void
  // openMinimumPriceModal: (value: {
  //   minimumPrice: number
  //   currency: CurrencyType
  // }) => void
  splitReady: boolean
  type:
    | 'edit'
    | 'detail'
    | 'invoiceDetail'
    | 'create'
    | 'invoiceCreate'
    | 'invoiceHistory'
  onItemRemove: (idx: number, itemId: number) => void

  selectedIds?: { id: number; selected: boolean }[]
  setSelectedIds?: Dispatch<
    SetStateAction<
      {
        id: number
        selected: boolean
      }[]
    >
  >
  errors: FieldErrors<{ items: ItemType[] }>
  languagePairs: languageType[]
  selectNotApplicableModal: () => void
  priceUnitsList: Array<PriceUnitListType>
  checkPriceCurrency: (price: StandardPriceListType, index: number) => boolean
  validateCurrency: () => void
  findLangPairIndex: (source: string, target: string) => number
  teamMembers?: Array<{ type: MemberType; id: number | null; name?: string }>
  indexing?: number
  from: 'quote' | 'order' | 'invoice'
}

const Row = ({
  idx,
  control,
  setValue,
  getValues,
  getPriceOptions,
  fields,
  itemTrigger,
  sumTotalPrice,

  // openMinimumPriceModal,
  splitReady,
  type,
  onItemRemove,

  selectedIds,
  setSelectedIds,
  errors,
  languagePairs,
  selectNotApplicableModal,
  priceUnitsList,
  checkPriceCurrency,
  validateCurrency,
  findLangPairIndex,
  teamMembers,
  indexing,
  from,
}: Props) => {
  const [cardOpen, setCardOpen] = useState(true)
  const [contactPersonList, setContactPersonList] = useState<
    Array<{ value: number; label: string }>
  >([])
  const setValueOptions = { shouldDirty: true, shouldValidate: true }
  const itemData = getValues(`items.${idx}`)
  const currentRole = getCurrentRole()
  const defaultValue = { value: 0, label: '' }
  const { openModal, closeModal } = useModal()

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${idx}.detail`

  // standard price에 등록된 데이터중 매칭된 데이터
  const priceData = () => {
    if (!itemData) {
      const source = getValues(`items.${idx}.source`)
      const target = getValues(`items.${idx}.target`)
      const priceId = getValues(`items.${idx}.priceId`)
      return (
        getPriceOptions(source!, target!).find(price => price.id === priceId) ||
        null
      )
    } else {
      return (
        getPriceOptions(itemData.source!, itemData.target!).find(
          price => price.id === itemData.priceId,
        ) || null
      )
    }
  }

  const openMinimumPriceModal = (value: {
    minimumPrice: number
    currency: Currency
  }) => {
    const minimumPrice = formatCurrency(value.minimumPrice, value.currency)

    openModal({
      type: 'info-minimum',
      children: (
        <CustomModal
          onClose={() => {
            closeModal('info-minimum')
          }}
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
          onClick={() => {
            closeModal('info-minimum')
          }}
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

  useEffect(() => {
    if (teamMembers && teamMembers.length) {
      const list = teamMembers
        .filter(item => item.id !== null)
        .map(item => ({
          value: item?.id!,
          label: item.name || '',
        }))
      setContactPersonList(list)
    }
  }, [teamMembers])

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

  const {
    fields: details,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: itemName,
  })

  function onDeletePriceUnit(priceUnitId: number) {
    const findIndex = getValues(`items.${idx}.detail`)?.findIndex(
      item => item.priceUnitId === priceUnitId,
    )

    if (findIndex !== -1) {
      remove(findIndex)
    }

    if (getValues(`items.${idx}.detail`)?.length === 0) {
      handleShowMinimum(true)
    }
  }

  const onDeleteNoPriceUnit = (index: number) => {
    const item = getValues(`items.${idx}.detail`)
    const detailItem = getValues(`items.${idx}.detail.${index}`)
    if (detailItem && item) {
      const indexToRemove = item.findIndex(field => field === detailItem)

      remove(index)
    }

    itemTrigger(`items.${idx}.detail`)
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
      const price = data.reduce((res, item) => (res += Number(item.prices)), 0)
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

    setValue(`items.${idx}.totalPrice`, total, setValueOptions)
    itemTrigger(`items.${idx}.totalPrice`)
    sumTotalPrice()
  }

  /* tm analysis */
  function onCopyAnalysis(data: onCopyAnalysisParamType) {
    const availableData = data.filter(item => item.newData !== null)
    if (!availableData?.length) return

    availableData.forEach(item => {
      const newData = item.newData!
      append({
        priceUnitId: newData.priceUnitId,
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

      setValue(`items.${idx}.totalPrice`, minimumPrice ?? 0, setValueOptions)
      setValue(`items.${idx}.minimumPrice`, minimumPrice ?? 0, setValueOptions)
      setValue(`items.${idx}.priceFactor`, priceFactor ?? 0, setValueOptions)
      setValue(`items.${idx}.initialPrice.currency`, currency!, setValueOptions)
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

  function onChangePrice(
    v: StandardPriceListType,
    idx: number,
    options: (StandardPriceListType & {
      groupName?: string | undefined
    })[],
  ) {
    if (v?.id) {
      // TODO: 이부분 레리엘과 코드리뷰 해야 함(Jay)
      // const items = getValues('items')

      // const priceIds = items.map(item => item.priceId)
      // const matchingOptions = options.filter(option =>
      //   priceIds.includes(option.id),
      // )
      // const currencies = matchingOptions
      //   .map(option => option.currency)
      //   .filter(detailItem => detailItem !== null)

      // 첫번째 아이템의 currnecy가 order의 기준 currency가 된다.
      const baseCurrency = getValues(`items.${0}.currency`)
      if (baseCurrency && baseCurrency !== v?.currency) {
        validateCurrency()
      } else if (v.id === NOT_APPLICABLE) {
        const source = getValues(`items.${idx}.source`)!
        const target = getValues(`items.${idx}.target`)!
        setValue(`items.${idx}.priceId`, v?.id)
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
        setValue(`items.${idx}.totalPrice`, 0)
        setValue(`items.${idx}.currency`, null)
        setValue(`items.${idx}.minimumPrice`, minimumPrice ?? 0)
        setValue(`items.${idx}.priceFactor`, priceFactor ?? 0)
        setValue(`items.${idx}.initialPrice.currency`, currency!)
        setValue(`items.${idx}.initialPrice.numberPlace`, numberPlace!)
        setValue(
          `items.${idx}.initialPrice.rounding`,
          //@ts-ignore
          RoundingProcedureObj[rounding!],
        )
        itemTrigger(`items.${idx}`)
        getTotalPrice()
        handleMinimumPrice()
      } else {
        const source = getValues(`items.${idx}.source`)!
        const target = getValues(`items.${idx}.target`)!
        setValue(`items.${idx}.priceId`, v?.id)
        const priceData = getPriceOptions(source, target).find(
          price => price.id === v?.id,
        )
        const languagePairData = priceData?.languagePairs?.find(
          i => i.source === source && i.target === target,
        )

        const minimumPrice = languagePairData?.minimumPrice
        const priceFactor = languagePairData?.priceFactor
        const currency = languagePairData?.currency ?? null
        const priceCurrency = priceData?.currency ?? null

        const rounding = priceData?.roundingProcedure
        const numberPlace = priceData?.decimalPlace

        setValue(`items.${idx}.currency`, priceCurrency)
        setValue(`items.${idx}.totalPrice`, 0)
        setValue(`items.${idx}.minimumPrice`, minimumPrice ?? 0)
        setValue(`items.${idx}.priceFactor`, priceFactor ?? 0)
        setValue(`items.${idx}.initialPrice.currency`, currency!)
        setValue(`items.${idx}.initialPrice.numberPlace`, numberPlace!)
        setValue(
          `items.${idx}.initialPrice.rounding`,
          //@ts-ignore
          RoundingProcedureObj[rounding!],
        )
        itemTrigger(`items.${idx}`)
        getTotalPrice()
        handleMinimumPrice()
      }
    }
  }

  // TODO: 네임 헬퍼 써야 함

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
  const findCurrency = (
    items: ItemType[],
    index: number,
    detailIndex: number,
  ) => {
    // Find an item with a currency property
    const itemWithCurrency = items.find(item => item.currency)

    if (itemWithCurrency) {
      return itemWithCurrency.currency
    }

    // If no item with a currency property was found, look in the details
    const filteredDetails = items
      .filter(value => value.detail && value.detail.length > 0)
      .map(item => {
        if (item.detail) return item.detail
        else return []
      })
      .flat()

    const detailWithCurrency = filteredDetails.find(
      detail => detail.currency !== null,
    )
    if (detailWithCurrency) {
      return detailWithCurrency.currency
    }

    return null
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
    const items = getValues('items')

    // const currencies = items.flatMap(item =>
    //   item.detail && item.detail.length > 0
    //     ? item.detail
    //         .filter(detailItem => detailItem.currency !== null) // Exclude items where currency is null
    //         .filter(detailItem => !detail.find(d => d.id === detailItem.id)) // Exclude the recently added detail
    //         .map(detailItem => detailItem.currency)
    //     : [],
    // )
    const detailCurrency = findCurrency(items, index, detailIndex)

    const baseCurrency = getValues(`items.${0}.currency`)
    if (baseCurrency && currency && baseCurrency !== currency && index !== 0) {
      openModal({
        type: 'CurrencyMatchModal',
        children: (
          <CustomModal
            title={`Please check the currency of the price unit. You can't use different currencies in an ${from}.`}
            soloButton
            rightButtonText='Okay'
            onClick={() => {
              closeModal('CurrencyMatchModal')
              setValue(`items.${index}.detail.${detailIndex}.currency`, null)
            }}
            onClose={() => closeModal('CurrencyMatchModal')}
            vary='error'
          />
        ),
      })
      return
    }

    //not applicable일때 모든 price unit의 currency는 동일하게 변경되게 한다.
    detail.map((priceUnit, idx) => {
      setValue(`items.${index}.detail.${idx}.currency`, currency)
    })
    setValue(`items.${index}.currency`, currency)
    itemTrigger(`items.${index}.detail`)
    validateCurrency()
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
                {indexing !== undefined &&
                (type === 'invoiceDetail' ||
                  type === 'invoiceHistory' ||
                  type === 'invoiceCreate')
                  ? `${
                      indexing + 1 <= 10
                        ? `0${indexing + 1}.`
                        : `${indexing + 1}.`
                    }`
                  : `${idx + 1 <= 10 ? `0${idx + 1}.` : `${idx + 1}.`}`}
                &nbsp;
                {type === 'detail' ||
                type === 'invoiceDetail' ||
                type === 'invoiceHistory' ||
                type === 'invoiceCreate'
                  ? getValues(`items.${idx}.itemName`)
                  : null}
              </Typography>
            </Box>
            {type === 'detail' ||
            type === 'invoiceDetail' ||
            type === 'invoiceHistory' ||
            type === 'invoiceCreate' ? null : (
              <IconButton
                onClick={() => onItemRemove(idx, getValues(`items.${idx}.id`)!)}
              >
                <Icon icon='mdi:trash-outline' />
              </IconButton>
            )}
          </Box>
        </Grid>
        {cardOpen ? (
          <>
            {type === 'detail' ||
            type === 'invoiceDetail' ||
            type === 'invoiceHistory' ||
            type === 'invoiceCreate' ? null : (
              <Grid item xs={12}>
                <Controller
                  name={`items.${idx}.itemName`}
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => {
                    return (
                      <TextField
                        fullWidth
                        autoComplete='off'
                        autoFocus={Boolean(value && value?.length < 2)}
                        label='Item name*'
                        variant='outlined'
                        value={value ?? ''}
                        onChange={(e: any) => {
                          if (e.target.value) {
                            onChange(e.target.value)
                          } else {
                            onChange('')
                          }
                        }}
                        inputProps={{ maxLength: 200 }}
                        error={value === ''}
                        helperText={value === '' ? FormErrors.required : ''}
                      />
                    )
                  }}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              {type === 'detail' ||
              type === 'invoiceDetail' ||
              type === 'invoiceHistory' ||
              type === 'invoiceCreate' ? (
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
                    <Box
                      sx={{
                        '&:hover .react-datepicker__close-icon': {
                          right: '25px !important',
                          opacity: 0.7,
                        },
                        '& .react-datepicker__close-icon': {
                          right: '25px !important',
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
                        },
                      }}
                    >
                      <FullWidthDatePicker
                        {...DateTimePickerDefaultOptions}
                        selected={!value ? null : new Date(value)}
                        onChange={(e, v) => {
                          if (e) {
                            onChange(new Date(e.toString()).toISOString())
                          }
                        }}
                        isClearable={from === 'quote'}
                        placeholderText='MM/DD/YYYY, HH:MM'
                        customInput={
                          <CustomInput
                            label={
                              from === 'quote'
                                ? 'Item due date'
                                : 'Item due date*'
                            }
                            icon='calendar'
                          />
                        }
                      />
                    </Box>
                  )}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {type === 'detail' ||
              type === 'invoiceDetail' ||
              type === 'invoiceHistory' ||
              type === 'invoiceCreate' ? (
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
                    {type === 'invoiceDetail'
                      ? getLegalName({
                          firstName: getValues(`items.${idx}.contactPerson`)
                            ?.firstName,
                          middleName: getValues(`items.${idx}.contactPerson`)
                            ?.middleName,
                          lastName: getValues(`items.${idx}.contactPerson`)
                            ?.lastName,
                        })
                      : // TODO: G-3406 items의 contactPerson(LPM 정보) 타입 맞추기 전까지 임시 코드
                        // quote에서는 이름 정보만 리턴되고 order에서는 id 정보만 리턴됨
                        // getLegalName(getValues(`items.${idx}.contactPerson`)!)
                        contactPersonList.find(
                          item =>
                            item.value ===
                            getValues(`items.${idx}.contactPersonId`),
                        )?.label}
                  </Typography>
                </Box>
              ) : (
                contactPersonList.length > 0 && (
                  <Controller
                    name={`items.${idx}.contactPersonId`}
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          options={contactPersonList}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.value === newValue?.value
                          }}
                          disableClearable={value ? false : true}
                          onChange={(e, v) => {
                            if (v) {
                              onChange(v.value)
                            } else {
                              onChange(null)
                            }
                          }}
                          value={
                            type === 'edit'
                              ? value
                                ? contactPersonList.find(
                                    item => item.value === value,
                                  )
                                : null
                              : value
                                ? contactPersonList.find(
                                    item =>
                                      item.value ===
                                      teamMembers?.find(
                                        member =>
                                          member.type === 'projectManagerId',
                                      )?.id!,
                                  )
                                : null
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              autoComplete='off'
                              label={
                                from === 'quote'
                                  ? 'Contact person form job'
                                  : 'Contact person for job*'
                              }
                              // placeholder='Contact person for job*'
                            />
                          )}
                        />
                      )
                    }}
                  />
                )
              )}
            </Grid>
            <Grid item xs={6}>
              {type === 'detail' ||
              type === 'invoiceDetail' ||
              type === 'invoiceHistory' ||
              type === 'invoiceCreate' ? (
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
                        fullWidth
                        options={[...languagePairs].sort((a, b) =>
                          a.source.localeCompare(b.source),
                        )}
                        getOptionLabel={option =>
                          `${languageHelper(
                            option.source,
                          )} ${String.fromCharCode(8594)} ${languageHelper(
                            option.target,
                          )}`
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
                            autoComplete='off'
                            error={Boolean(errors?.items?.[idx]?.source)}
                            label='Language pair*'
                          />
                        )}
                      />
                    )
                  }}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {/* TODO: role이 client 일때는 price를 숨긴다 */}
              {currentRole?.name === 'CLIENT' ? null : type === 'detail' ||
                type === 'invoiceDetail' ||
                type === 'invoiceHistory' ||
                type === 'invoiceCreate' ? (
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
                      getValues(`items.${idx}.source`)!,
                      getValues(`items.${idx}.target`)!,
                      idx,
                    )
                    let hasMatchingPrice = false
                    let hasStandardPrice = false
                    options.find(option => {
                      if (
                        option.groupName &&
                        option.groupName === 'Matching price'
                      )
                        hasMatchingPrice = true
                      if (
                        option.groupName &&
                        option.groupName === 'Standard client price'
                      )
                        hasStandardPrice = true
                    })
                    return (
                      <Autocomplete
                        // <StyledAutocomplete

                        fullWidth
                        options={options}
                        groupBy={option => option?.groupName ?? ''}
                        isOptionEqualToValue={(option, newValue) => {
                          return option.priceName === newValue?.priceName
                        }}
                        getOptionLabel={option => option.priceName}
                        onChange={(e, v) => {
                          // Not Applicable 임시 막기
                          // currency 체크 로직
                          if (v) {
                            // if (v && v.id === -1) {
                            //   selectNotApplicableModal()
                            // } else {
                            // if (checkPriceCurrency(v, idx)) {
                            // }
                            onChange(v?.id)
                            const value = getValues().items[idx]
                            const index = findLangPairIndex(
                              value?.source!,
                              value?.target!,
                            )
                            onChangePrice(v, idx, options)

                            if (index !== -1) {
                              const copyLangPair = [...languagePairs]
                              copyLangPair[index].price = v
                            }
                            getTotalPrice()
                          }
                          // }
                        }}
                        value={
                          value === null
                            ? null
                            : options.find(item => item.id === value)
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            error={Boolean(errors?.items?.[idx]?.priceId)}
                            label='Price*'
                          />
                        )}
                        renderGroup={params => (
                          <li key={params.key}>
                            {!hasMatchingPrice && params.group ? (
                              <GroupHeader>
                                Matching price{' '}
                                <NoResultText>(No result)</NoResultText>
                              </GroupHeader>
                            ) : null}
                            {!hasStandardPrice && params.group ? (
                              <GroupHeader>
                                Standard client price{' '}
                                <NoResultText>(No result)</NoResultText>
                              </GroupHeader>
                            ) : null}
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
              setValue={setValue}
              priceData={priceData()}
              getValues={getValues}
              append={append}
              update={update}
              getTotalPrice={getTotalPrice}
              // getEachPrice={getEachPrice}
              onDeletePriceUnit={onDeletePriceUnit}
              onDeleteNoPriceUnit={onDeleteNoPriceUnit}
              // onItemBoxLeave={onItemBoxLeave}
              isValid={
                !!getValues(`items.${idx}.source`) &&
                !!getValues(`items.${idx}.target`) &&
                (!!getValues(`items.${idx}.priceId`) ||
                  getValues(`items.${idx}.priceId`) === NOT_APPLICABLE)
              }
              // isNotApplicable={isNotApplicable()}
              priceUnitsList={priceUnitsList}
              showMinimum={getValues(`items.${idx}.minimumPriceApplied`)}
              setShowMinimum={handleShowMinimum}
              type={type}
              sumTotalPrice={sumTotalPrice}
              fields={fields}
              remove={remove}
              onChangeCurrency={onChangeCurrency}
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
                            type === 'detail' ||
                            type === 'invoiceDetail' ||
                            type === 'invoiceHistory' ||
                            type === 'invoiceCreate'
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
              {type === 'detail' ||
              type === 'invoiceDetail' ||
              type === 'invoiceHistory' ||
              type === 'invoiceCreate' ? (
                <Typography>
                  {currentRole?.name === 'CLIENT'
                    ? getValues(`items.${idx}.showItemDescription`)
                      ? getValues(`items.${idx}.description`)
                      : '-'
                    : getValues(`items.${idx}.description`) !== '' &&
                        getValues(`items.${idx}.description`) !== null
                      ? getValues(`items.${idx}.description`)
                      : '-'}
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
                          autoComplete='off'
                          multiline
                          fullWidth
                          placeholder='Write down an item description.'
                          value={value ?? ''}
                          onChange={onChange}
                          inputProps={{ maxLength: 500 }}
                        />
                        <Typography variant='body2' mt='12px' textAlign='right'>
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
            type === 'invoiceHistory' ||
            type === 'invoiceCreate' ||
            (currentRole && currentRole.name === 'CLIENT') ? null : (
              <Grid item xs={12}>
                <TmAnalysisForm
                  control={control}
                  index={idx}
                  details={details}
                  priceData={priceData()}
                  priceFactor={getValues(`items.${idx}.priceFactor`)}
                  getValues={getValues}
                  onCopyAnalysis={onCopyAnalysis}
                  type={type}
                  from={from}
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

export default Row

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`

const GroupHeader = styled('div')({
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: '20px',
  fontWeight: 'bold',
})

const NoResultText = styled('span')({
  fontWeight: 'normal',
})

const GroupItems = styled('ul')({
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingLeft: '5px',
})
