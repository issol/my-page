import {
  Autocomplete,
  Box,
  IconButton,
  TableCell,
  TextField,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { CurrencyList } from '@src/shared/const/currency/currency'
import { styled } from '@mui/material/styles'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import Icon from 'src/@core/components/icon'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import { NestedPriceUnitType } from './item-price-unit-form'
import { languageType } from 'src/pages/[companyName]/quotes/add-new'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { Currency } from '@src/types/common/currency.type'

interface Props {
  idx: number
  nestSubPriceUnits: (idx: number) => NestedPriceUnitType[]
  onDeleteNoPriceUnit: (index: number) => void
  getValues: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  setValue: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  currentItem: ItemDetailType[]
  // getEachPrice: (idx: number, isNotApplicable?: boolean | undefined) => void
  detailName: `items.${number}.detail`
  type: string
  isNotApplicable: boolean
  onDeletePriceUnit: (idx: number) => void
  updateTotalPrice: () => void
  control: Control<{ items: ItemType[]; languagePairs: languageType[] }, any>
  remove?: UseFieldArrayRemove
  priceData: StandardPriceListType | null
  allPriceUnits: MutableRefObject<NestedPriceUnitType[]>
  index: number
  update?: UseFieldArrayUpdate<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`
  >
  append?: UseFieldArrayAppend<
    { items: ItemType[]; languagePairs: languageType[] },
    `items.${number}.detail`
  >
  showCurrency?: boolean
  initialPriceName: `items.${number}.initialPrice`
  onChangeCurrency: (
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
  ) => void
  row: FieldArrayWithId<
    {
      items: ItemType[]
    },
    `items.${number}.detail`,
    'id'
  >
  errorRefs?: MutableRefObject<(HTMLInputElement | null)[]>
  itemTrigger?: UseFormTrigger<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
}

const Row = ({
  idx,
  nestSubPriceUnits,
  currentItem,
  getValues,
  // getEachPrice,
  onDeleteNoPriceUnit,
  detailName,
  type,
  isNotApplicable,
  onDeletePriceUnit,
  updateTotalPrice,
  control,
  remove,
  priceData,
  allPriceUnits,
  index,
  update,
  append,
  showCurrency,
  initialPriceName,
  onChangeCurrency,

  setValue,
  row,
  errorRefs,
  itemTrigger,
}: Props) => {
  const prevValueRef = useRef()
  const [savedValue, setSavedValue] = useState<ItemDetailType>(currentItem[idx])
  const [price, setPrice] = useState(savedValue?.prices || 0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { openModal, closeModal } = useModal()

  const options = nestSubPriceUnits(idx)

  // index: item의 index, job price에서는 항상 0임
  // unitIndex: item의 detail의 index, 각 unit price의 index
  function getEachPrice(unitIndex: number) {
    const data = getValues(`items.${index}.detail`)
    const notApplicable = getValues(`items`).map(
      value => value.priceId === NOT_APPLICABLE,
    )[index]

    if (!data?.length) return
    let prices = 0
    const detail = data?.[unitIndex]
    console.log(getValues(), 'priceData')

    if (detail) {
      setSavedValue(detail) // setValue된 값 가져오기
      setPrice(detail?.prices) // setValue된 값에서 price 정보 가져오기
      if (detail && detail.unit === 'Percent') {
        const percentQuantity = data[unitIndex].quantity

        const itemMinimumPrice = getValues(`items.${index}.minimumPrice`)
        const showMinimum = getValues(`items.${index}.minimumPriceApplied`)

        if (itemMinimumPrice && showMinimum) {
          prices =
            percentQuantity !== null
              ? (percentQuantity / 100) * itemMinimumPrice
              : 0
        } else {
          const generalPrices = data.filter(item => item?.unit !== 'Percent')
          generalPrices.forEach(item => {
            prices += item.unitPrice ?? 0
          })
          prices *= percentQuantity !== null ? percentQuantity / 100 : 0
        }
      } else {
        prices =
          detail?.unitPrice !== null && detail?.quantity !== null
            ? detail?.unitPrice * detail?.quantity
            : 0
      }

      // if (prices === data[index].prices) return
      const currency =
        getValues(`items.${index}.initialPrice.currency`) ??
        getValues(`items.${index}.detail.${unitIndex}`)?.currency ??
        priceData?.currency

      console.log(prices, 'each price prices')
      const roundingPrice = formatByRoundingProcedure(
        prices,
        priceData?.decimalPlace!
          ? priceData?.decimalPlace!
          : currency === 'USD' || currency === 'SGD'
            ? 2
            : currency === 'KRW'
              ? 10
              : 0,
        priceData?.roundingProcedure && priceData?.roundingProcedure !== ''
          ? priceData?.roundingProcedure!
          : 0,
        currency,
      )

      // 새롭게 등록할때는 기존 데이터에 언어페어, 프라이스 정보가 없으므로 스탠다드 프라이스 정보를 땡겨와서 채운다
      // NOT_APPLICAABLE일때는 제외
      // 스탠다드 프라이스의 언어페어 정보 : languagePairs
      if (!notApplicable) {
        setValue(`items.${index}.detail.${unitIndex}.currency`, currency, {
          shouldDirty: true,
          shouldValidate: false,
        })
      }
      console.log(roundingPrice, 'prices data')
      setValue(
        `items.${index}.detail.${unitIndex}.prices`,
        isNaN(Number(roundingPrice)) ? 0 : Number(roundingPrice),
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      )
      itemTrigger && itemTrigger(`items.${index}.detail.${unitIndex}.prices`)
      // setIsDirty(false)
    }
  }

  const updatePrice = (rowIndex: number) => {
    const newPrice = getValues(`${detailName}.${rowIndex}`)
    if (type !== 'detail' && type !== 'invoiceDetail') getEachPrice(rowIndex) //폼 데이터 업데이트 (setValue)

    // getTotalPrice() // 합계 데이터 업데이트 (setValue)
    if (newPrice) {
    }
  }

  const handleDeletePriceUnit = (idx: number) => {
    onDeletePriceUnit(idx)
    updateTotalPrice()
    remove && remove(idx)
    closeModal('DeletePriceUnitModal')
  }

  function PercentPrice(quantity: number) {
    let prices = 0
    if (currentItem) {
      const percentQuantity = quantity
      const generalPrices = currentItem.filter(item => item?.unit !== 'Percent')
      generalPrices.forEach(item => {
        prices += item.unitPrice ?? 0
      })
      prices *= percentQuantity / 100
    }
    return prices
  }

  const onClickDeletePriceUnit = (idx: number, id: number) => {
    const findItem = options.find(item => item.id === id)
    if (findItem) {
      openModal({
        type: 'DeletePriceUnitModal',
        children: (
          <CustomModal
            onClose={() => closeModal('DeletePriceUnitModal')}
            onClick={() => handleDeletePriceUnit(idx)}
            title={
              <>
                Are you sure you want to delete this price unit???
                <Typography variant='body2' fontWeight={700} fontSize={16}>
                  {findItem.title ?? ''}
                </Typography>
              </>
            }
            vary='error'
            rightButtonText='Delete'
          />
        ),
      })
    } else {
      remove && remove(idx)
      updateTotalPrice()
    }
  }

  console.log(type)

  //init
  useEffect(() => {
    // row init시에 동작하는 로직, 불필요한 리랜더링이 발생할 수 있다
    if (type === 'job-edit' || type === 'job-detail') return
    updatePrice(idx)
    updateTotalPrice()
  }, [type])

  useEffect(() => {
    // row 외부가 클릭될때 마다 액션을 준다
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLLIElement)
      ) {
        // 필요한 액션

        if (type === 'job-edit' || type === 'job-detail') return
        updatePrice(idx)
        updateTotalPrice()
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const [open, setOpen] = useState(false)

  return (
    <tr
    // tabIndex={-1}

    // onMouseLeave={() => {
    //   updateTotalPrice()
    // }}
    >
      <TableCell ref={containerRef}>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ||
        type === 'job-detail' ? (
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(76, 78, 100, 0.87)',
              lineHeight: '21px',
            }}
          >
            {Number(getValues(`${detailName}.${idx}.quantity`))}
            {/* <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {Number(getValues(`${detailName}.${idx}.quantity`))}
            </Typography> */}
          </Box>
        ) : (
          <Controller
            name={`${detailName}.${idx}.quantity`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Box display='flex' alignItems='center' gap='8px'>
                  <TextField
                    placeholder='0'
                    autoComplete='off'
                    type='number'
                    inputRef={ref => {
                      if (errorRefs) {
                        errorRefs.current[
                          idx +
                            1 +
                            (idx > 0 ? (isNotApplicable ? 3 : 2) * idx : 0)
                        ] = ref
                      }
                    }}
                    onFocus={e =>
                      e.target.addEventListener(
                        'wheel',
                        function (e) {
                          e.preventDefault()
                        },
                        { passive: false },
                      )
                    }
                    value={value ? Number(value) : null}
                    sx={{
                      maxWidth: '85px',
                      padding: 0,
                      'input::placeholder': {
                        color: '#ff4d49',
                        opacity: 1,
                      },
                    }}
                    inputProps={{
                      inputMode: 'decimal',
                    }}
                    error={value === null || value === 0}
                    onChange={e => {
                      onChange(Number(e.target.value))

                      updatePrice(idx)
                      updateTotalPrice()
                    }}
                  />
                  {savedValue?.unit === 'Percent' ? '%' : null}
                </Box>
              )
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ||
        type == 'job-detail' ? (
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(76, 78, 100, 0.87)',
              lineHeight: '21px',
            }}
          >
            {/* <Typography variant='subtitle1' fontSize={14} lineHeight={21}> */}
            {allPriceUnits?.current?.find(
              item =>
                item.priceUnitId ===
                getValues(`${detailName}.${idx}.priceUnitId`),
            )?.title ?? getValues(`${detailName}.${idx}.title`)}
            {/* </Typography> */}
          </Box>
        ) : (
          <Controller
            name={`${detailName}.${idx}.priceUnitId`}
            control={control}
            render={({ field: { value, onChange } }) => {
              // const options = nestSubPriceUnits()

              // 저장된 프라이스 유닛을 에딧할때는 스탠다드 프라이스의 정보가 아니라 해당 아이템에 속한 정보를 보여줘야 함
              const showValue = {
                ...getValues(`${detailName}.${idx}`),
                isBase: false,
                price: 0,
                title: getValues(`${detailName}.${idx}`)?.title
                  ? getValues(`${detailName}.${idx}`).title!
                  : getValues(`${detailName}.${idx}.initialPriceUnit.title`)
                    ? getValues(`${detailName}.${idx}.initialPriceUnit.title`)!
                    : '',
                id: getValues(`${detailName}.${idx}`)?.id!,
                weighting: Number(
                  getValues(`${detailName}.${idx}`)?.weighting!,
                ),
                subPriceUnits: [],
                groupName: '',
              }

              const findValue = allPriceUnits?.current?.find(
                item => item.priceUnitId === value,
              )
                ? allPriceUnits?.current?.find(
                    item => item.priceUnitId === value,
                  )
                : showValue
                  ? showValue
                  : null

              return (
                <Autocomplete
                  fullWidth
                  options={options}
                  groupBy={option => option?.groupName}
                  renderGroup={params => (
                    <li key={params.key}>
                      <GroupHeader>
                        <Typography
                          variant='body1'
                          fontWeight={700}
                          fontSize={16}
                          // sx={{ border: '1px solid', lineHeight: '16px' }}
                        >
                          {params.group}
                        </Typography>
                      </GroupHeader>
                      <GroupItems>{params.children}</GroupItems>
                    </li>
                  )}
                  getOptionLabel={option => {
                    return !isNotApplicable &&
                      option?.quantity &&
                      option?.quantity >= 2
                      ? `${option?.quantity} ${option.title}`
                      : option.title
                  }}
                  onChange={(e, v) => {
                    if (v) {
                      const priceFactor = Number(
                        getValues(`items.${index}`)?.priceFactor,
                      )
                      setOpen(false)

                      onChange(v.priceUnitId)

                      const unitPrice = priceFactor
                        ? priceFactor * v.price
                        : v.price

                      if (!isNotApplicable) {
                        update &&
                          update(idx, {
                            ...savedValue,
                            priceUnitId: v.priceUnitId,
                            quantity: v.quantity ?? 0,
                            unit: v?.unit,
                            unitPrice: unitPrice,
                            priceFactor: priceFactor?.toString(),
                            prices:
                              v?.unit !== 'Percent'
                                ? Number(v.quantity! * unitPrice)
                                : PercentPrice(v.quantity!),
                          })
                      } else {
                        update &&
                          update(idx, {
                            ...savedValue,
                            priceUnitId: v.priceUnitId,
                            unit: v?.unit,
                            priceFactor: priceFactor?.toString(),
                            prices:
                              v?.unit !== 'Percent'
                                ? Number(
                                    getValues(
                                      `${detailName}.${idx}.quantity`,
                                    ) ?? 0 * unitPrice,
                                  )
                                : PercentPrice(
                                    getValues(
                                      `${detailName}.${idx}.quantity`,
                                    ) ?? 0,
                                  ),
                          })
                      }

                      if (v.subPriceUnits && v.subPriceUnits.length > 0) {
                        v.subPriceUnits.forEach(item => {
                          const unitPrice = priceFactor
                            ? priceFactor * item.price
                            : item.price

                          append &&
                            append({
                              ...savedValue,
                              priceFactor: priceFactor?.toString(),
                              priceUnitId: item.priceUnitId,
                              quantity: item.quantity!,
                              unit: item?.unit,
                              unitPrice: unitPrice,
                              prices:
                                item?.unit !== 'Percent'
                                  ? Number(item.quantity! * unitPrice)
                                  : PercentPrice(item.quantity!),
                            })
                        })
                      }
                    } else {
                      onChange(null)
                    }
                  }}
                  // disableClearable={value !== null}
                  renderOption={(props, option, state) => {
                    return (
                      <>
                        <li {...props}>
                          {option.parentPriceUnitId === null ? null : (
                            <Icon
                              icon='material-symbols:subdirectory-arrow-right'
                              opacity={0.7}
                            />
                          )}
                          {option?.quantity && option?.quantity >= 2
                            ? `${option?.quantity} ${option.title}`
                            : option.title}
                        </li>
                      </>
                    )
                  }}
                  open={open}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                  value={!value ? showValue : findValue ?? null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      // label='Price unit*'
                      placeholder={open ? '' : 'Price unit*'}
                      inputRef={ref => {
                        if (errorRefs) {
                          errorRefs.current[
                            idx +
                              2 +
                              (idx > 0 ? (isNotApplicable ? 3 : 2) * idx : 0)
                          ] = ref
                        }
                      }}
                    />
                  )}
                />
              )
            }}
          />
        )}
      </TableCell>
      <TableCell
        align={
          type === 'detail' ||
          type === 'invoiceDetail' ||
          type === 'invoiceHistory' ||
          type === 'invoiceCreate' ||
          type === 'job-detail'
            ? 'left'
            : 'left'
        }
        sx={{ width: '15%' }}
      >
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ||
        type === 'job-detail' ? (
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(76, 78, 100, 0.87)',
              lineHeight: '21px',
            }}
          >
            {/* <Typography variant='subtitle1' fontSize={14} lineHeight={21}> */}
            {formatCurrency(
              getValues(`${detailName}.${idx}.unitPrice`) || 0,
              getValues(`${initialPriceName}.currency`) || 'KRW',
              getValues(`${initialPriceName}.priceId`) === -1
                ? 4
                : Number(getValues(`${initialPriceName}.numberPlace`)) || 4,
            ) ?? '-'}
            {/* </Typography> */}
          </Box>
        ) : (
          <Controller
            name={`${detailName}.${idx}.unitPrice`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Box>
                  <TextField
                    placeholder='0.00'
                    autoComplete='off'
                    inputProps={{ inputMode: 'decimal' }}
                    type='number'
                    onFocus={e =>
                      e.target.addEventListener(
                        'wheel',
                        function (e) {
                          e.preventDefault()
                        },
                        { passive: false },
                      )
                    }
                    value={
                      value
                        ? savedValue?.unit === 'Percent'
                          ? '-'
                          : value
                        : null
                    }
                    error={value === null || value === 0}
                    disabled={savedValue?.unit === 'Percent'}
                    onChange={e => {
                      if (e.target.value) {
                        onChange(Number(e.target.value))
                      } else {
                        onChange(null)
                      }
                      updatePrice(idx)
                      updateTotalPrice()
                    }}
                    sx={{
                      maxWidth: '104px',
                      padding: 0,
                      'input::placeholder': {
                        color: '#ff4d49',
                        opacity: 1,
                      },
                    }}
                    inputRef={ref => {
                      if (errorRefs) {
                        errorRefs.current[
                          idx +
                            3 +
                            (idx > 0 ? (isNotApplicable ? 3 : 2) * idx : 0)
                        ] = ref
                      }
                    }}
                  />
                </Box>
              )
            }}
          />
        )}
      </TableCell>
      <TableCell align='center'>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ||
        type === 'job-detail' ? (
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            {/* <Typography variant='subtitle1' fontSize={14} lineHeight={21}> */}
            {isNotApplicable || showCurrency
              ? `${getCurrencyMark(
                  getValues(`${detailName}.${idx}.currency`),
                )} ${getValues(`${detailName}.${idx}.currency`) ?? '-'}`
              : null}
            {/* </Typography> */}
          </Box>
        ) : isNotApplicable ? (
          <Controller
            name={`${detailName}.${idx}.currency`}
            control={control}
            render={({ field: { value, onChange } }) => {
              console.log(value)

              return (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  options={CurrencyList}
                  onChange={(e, v) => {
                    if (v) {
                      onChange(v.value)

                      onChangeCurrency(
                        v.value,
                        index,
                        getValues(`items.${index}.detail`) ?? [],
                        // row,
                        idx,
                      )
                      updateTotalPrice()
                      updatePrice(idx)
                    } else {
                      onChange(null)
                    }
                  }}
                  value={value ? { label: value, value: value } : null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      label='Currency*'
                      error={value === null}
                      inputRef={ref => {
                        if (errorRefs) {
                          errorRefs.current[
                            idx +
                              4 +
                              (idx > 0 ? (isNotApplicable ? 3 : 2) * idx : 0)
                          ] = ref
                        }
                      }}
                    />
                  )}
                />
              )
            }}
          />
        ) : null}
      </TableCell>
      <TableCell align='left'>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ||
        type === 'job-detail' ? (
          <Typography fontSize={14}>
            {isNotApplicable
              ? formatCurrency(
                  formatByRoundingProcedure(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    savedValue?.currency === 'USD' ||
                      savedValue.currency === 'SGD'
                      ? 2
                      : savedValue?.currency === 'KRW'
                        ? 10
                        : 0,
                    0,
                    savedValue?.currency ?? 'KRW',
                  ),
                  savedValue?.currency ?? null,
                )
              : formatCurrency(
                  Number(getValues(`${detailName}.${idx}.prices`)),
                  getValues(`${initialPriceName}.currency`) || 'KRW',
                )}
          </Typography>
        ) : (
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(76, 78, 100, 0.87)',
              lineHeight: '21px',
            }}
          >
            {isNotApplicable
              ? savedValue?.currency
                ? formatCurrency(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    savedValue?.currency ?? null,
                  )
                : formatCurrency(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    getValues(`${initialPriceName}.currency`) ?? null,
                  )
              : priceData
                ? formatCurrency(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    priceData?.currency! ?? null,
                  )
                : formatCurrency(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    getValues(`${initialPriceName}.currency`) ?? null,
                  )}
          </Box>
        )}
      </TableCell>
      <TableCell align='center'>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ||
        type === 'job-detail' ? null : (
          <IconButton
            onClick={() => {
              if (
                getValues(`${detailName}.${idx}.priceUnitId`) === null ||
                getValues(`${detailName}.${idx}.priceUnitId`) === -1
              ) {
                onDeleteNoPriceUnit(idx)
                updatePrice(idx)
                updateTotalPrice()
              } else {
                onClickDeletePriceUnit(
                  idx,
                  getValues(`${detailName}.${idx}.priceUnitId`)!,
                )
              }
            }}
          >
            <Icon icon='mdi:trash-outline' />
          </IconButton>
        )}
      </TableCell>
    </tr>
  )
}

export default Row
const GroupHeader = styled('div')(({ theme }) => ({
  // position: 'sticky',
  // top: '-8px',
  // height: '50px',
  display: 'flex',

  padding: '6px 16px',
}))

const GroupItems = styled('ul')({
  padding: '6px 16px',
})