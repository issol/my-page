import { formatByRoundingProcedure } from '@src/shared/helpers/price.helper'
import { ItemType } from '@src/types/common/item.type'
import {
  CurrencyType,
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  useFieldArray,
} from 'react-hook-form'
import { onCopyAnalysisParamType } from './items-form'
import { languageType } from '@src/pages/quotes/add-new'
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
import styled from 'styled-components'
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

type Props = {
  idx: number
  setValue: UseFormSetValue<{ items: ItemType[] }>
  getValues: UseFormGetValues<{ items: ItemType[] }>
  getPriceOptions: (
    source: string,
    target: string,
    idx?: number,
  ) => Array<StandardPriceListType & { groupName?: string }>
  fields: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
  itemTrigger: UseFormTrigger<{
    items: ItemType[]
  }>
  control: Control<{ items: ItemType[] }, any>
  sumTotalPrice: () => void
  openMinimumPriceModal: (value: {
    minimumPrice: number
    currency: CurrencyType
  }) => void
  splitReady: boolean
  type: 'edit' | 'detail' | 'invoiceDetail' | 'create'
  onItemRemove: (idx: number) => void

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
  findLangPairIndex: (source: string, target: string) => number
  teamMembers?: Array<{ type: MemberType; id: number | null; name?: string }>
  indexing?: number
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
  openMinimumPriceModal,
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
  findLangPairIndex,
  teamMembers,
  indexing,
}: Props) => {
  const [cardOpen, setCardOpen] = useState(true)
  const [contactPersonList, setContactPersonList] = useState<
    Array<{ value: number; label: string }>
  >([])
  const setValueOptions = { shouldDirty: true, shouldValidate: true }
  const itemData = getValues(`items.${idx}`)
  const currentRole = getCurrentRole()
  const defaultValue = { value: 0, label: '' }

  /* price unit */
  const itemName: `items.${number}.detail` = `items.${idx}.detail`

  // standard price에 등록된 데이터중 매칭된 데이터

  const priceData = () => {
    return (
      getPriceOptions(itemData.source!, itemData.target!).find(
        price => price.id === itemData.priceId,
      ) || null
    )
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
        prices =
          percentQuantity !== null
            ? (percentQuantity / 100) * itemMinimumPrice
            : 0
      } else {
        const generalPrices = data.filter(item => item.unit !== 'Percent')
        generalPrices.forEach(item => {
          prices += item.unitPrice ?? 0
        })
        prices *= percentQuantity !== null ? percentQuantity / 100 : 0
      }
    } else {
      prices =
        detail.unitPrice !== null && detail.quantity !== null
          ? detail.unitPrice * detail.quantity
          : 0
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
    setValue(
      `items.${idx}.detail.${index}.prices`,
      isNaN(Number(roundingPrice)) ? 0 : roundingPrice,
      {
        shouldDirty: true,
        shouldValidate: false,
      },
    )
  }

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

  function onChangePrice(v: StandardPriceListType, idx: number) {
    if (v?.id) {
      const source = getValues(`items.${idx}.source`)!
      const target = getValues(`items.${idx}.target`)!
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
  console.log(
    'getValues(`items.${idx}.contactPerson`)',
    getValues(`items.${idx}`),
  )

  console.log(contactPersonList)

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
                {indexing !== undefined && type === 'invoiceDetail'
                  ? `${
                      indexing + 1 <= 10
                        ? `0${indexing + 1}.`
                        : `${indexing + 1}.`
                    }`
                  : `${idx + 1 <= 10 ? `0${idx + 1}.` : `${idx + 1}.`}`}
                &nbsp;
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
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      fullWidth
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
                            onChange(v?.value ?? '')
                          }}
                          value={
                            !value
                              ? // 신규 생성일땐 프로젝트 매니저가 기본으로 들어감
                                contactPersonList.find(
                                  item =>
                                    item.value ===
                                    teamMembers?.find(
                                      member =>
                                        member.type === 'projectManagerId',
                                    )?.id!,
                                )
                              : // 수정일땐 기존 설정된 값이 들어감
                                contactPersonList.find(
                                  item => item.value === value,
                                )
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Contact person for job*'
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
                            if (v && v.id === -1) {
                              selectNotApplicableModal()
                            } else {
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
                          }
                        }}
                        value={
                          value === null
                            ? null
                            : options.find(item => item.id === value)
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
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
