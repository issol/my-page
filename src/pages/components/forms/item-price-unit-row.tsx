import {
  Autocomplete,
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { CurrencyList } from '@src/shared/const/currency/currency'
import { styled } from '@mui/material/styles'
import {
  formatCurrency,
  getCurrencyMark,
  formatByRoundingProcedure,
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
} from 'react-hook-form'
import { NestedPriceUnitType } from './item-price-unit-form'
import { languageType } from '@src/pages/quotes/add-new'
import {
  CurrencyType,
  StandardPriceListType,
} from '@src/types/common/standard-price'

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
  remove: UseFieldArrayRemove
  priceData: StandardPriceListType | null
  allPriceUnits: MutableRefObject<NestedPriceUnitType[]>
  index: number
  update: UseFieldArrayUpdate<
    {
      items: ItemType[]
      languagePairs: languageType[]
    },
    `items.${number}.detail`
  >
  append: UseFieldArrayAppend<
    { items: ItemType[]; languagePairs: languageType[] },
    `items.${number}.detail`
  >
  showCurrency?: boolean
  initialPriceName: `items.${number}.initialPrice`
  onChangeCurrency: (
    currency: CurrencyType,
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
}: Props) => {
  console.log(idx)
  console.log(row)

  const prevValueRef = useRef()
  const [savedValue, setSavedValue] = useState<ItemDetailType>(currentItem[idx])
  const [price, setPrice] = useState(savedValue?.prices || 0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { openModal, closeModal } = useModal()

  const options = nestSubPriceUnits(idx)

  // index: item의 index, job price에서는 항상 0임
  // unitIndex: item의 detail의 index, 각 unit price의 index
  function getEachPrice(unitIndex: number, isNotApplicable?: boolean) {
    const data = getValues(`items.${index}.detail`)

    if (!data?.length) return
    let prices = 0
    const detail = data?.[unitIndex]

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
        console.log(detail)

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

      const roundingPrice = formatByRoundingProcedure(
        prices,
        priceData?.decimalPlace!
          ? priceData?.decimalPlace!
          : currency === 'USD' || currency === 'SGD'
          ? 2
          : 1000,
        priceData?.roundingProcedure && priceData?.roundingProcedure !== ''
          ? priceData?.roundingProcedure!
          : 0,
        currency,
      )
      console.log(getValues(`items.${index}.detail`), 'check')

      // 새롭게 등록할때는 기존 데이터에 언어페어, 프라이스 정보가 없으므로 스탠다드 프라이스 정보를 땡겨와서 채운다
      // 스탠다드 프라이스의 언어페어 정보 : languagePairs
      setValue(`items.${index}.detail.${unitIndex}.currency`, currency, {
        shouldDirty: true,
        shouldValidate: false,
      })
      // TODO: NOT_APPLICABLE일때 Price의 Currency를 업데이트 할 수 있는 방법이 필요함
      setValue(
        `items.${index}.detail.${unitIndex}.prices`,
        isNaN(Number(roundingPrice)) ? 0 : Number(roundingPrice),
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      )
    }
  }

  const updatePrice = (rowIndex: number) => {
    const newPrice = getValues(`${detailName}.${rowIndex}`)
    if (type !== 'detail' && type !== 'invoiceDetail')
      getEachPrice(rowIndex, isNotApplicable) //폼 데이터 업데이트 (setValue)

    // getTotalPrice() // 합계 데이터 업데이트 (setValue)
    console.log(newPrice)
    if (newPrice) {
    }
  }

  const handleDeletePriceUnit = (idx: number) => {
    onDeletePriceUnit(idx)
    updateTotalPrice()
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

  const onClickDeletePriceUnit = (idx: number) => {
    console.log(options)
    console.log(idx)

    if (
      options.find(item => item.id === idx)
      // (idx !== -1 &&
      //   getValues().items[0].detail?.find(item => item.priceUnitId === idx))
    ) {
      openModal({
        type: 'DeletePriceUnitModal',
        children: (
          <CustomModal
            onClose={() => closeModal('DeletePriceUnitModal')}
            onClick={() => handleDeletePriceUnit(idx)}
            title={
              <>
                Are you sure you want to delete this price unit?
                <Typography variant='body2' fontWeight={700} fontSize={16}>
                  {options.find(item => item.id === idx)?.title ?? ''}
                </Typography>
              </>
            }
            vary='error'
            rightButtonText='Delete'
          />
        ),
      })
    } else {
      remove(idx)
      updateTotalPrice()
    }
  }

  //init
  useEffect(() => {
    // row init시에 동작하는 로직, 불필요한 리랜더링이 발생할 수 있다
    updatePrice(idx)
    updateTotalPrice()
  }, [])

  useEffect(() => {
    // row 외부가 클릭될때 마다 액션을 준다
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLLIElement)
      ) {
        console.log('outside')
        // 필요한 액션
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
    <TableRow
      tabIndex={-1}
      // onMouseLeave={() => {
      //   updateTotalPrice()
      // }}
    >
      <TableCell sx={{ width: '10%' }} ref={containerRef}>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ? (
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {Number(getValues(`${detailName}.${idx}.quantity`))}
            </Typography>
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
                    }}
                  />
                  {savedValue?.unit === 'Percent' ? '%' : null}
                </Box>
              )
            }}
          />
        )}
      </TableCell>
      <TableCell sx={{ width: 'auto' }}>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ? (
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {allPriceUnits?.current?.find(
                item =>
                  item.priceUnitId ===
                  getValues(`${detailName}.${idx}.priceUnitId`),
              )?.title ?? getValues(`${detailName}.${idx}.title`)}
            </Typography>
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
                title: getValues(`${detailName}.${idx}`).title
                  ? getValues(`${detailName}.${idx}`).title!
                  : getValues(`${detailName}.${idx}.initialPriceUnit.title`)
                  ? getValues(`${detailName}.${idx}.initialPriceUnit.title`)!
                  : '',
                id: getValues(`${detailName}.${idx}`).id!,
                weighting: Number(getValues(`${detailName}.${idx}`).weighting!),
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
                    const title =
                      !isNotApplicable &&
                      option?.quantity &&
                      option?.quantity >= 2
                        ? `${option?.quantity} ${option.title}`
                        : option.title
                    return title
                  }}
                  onChange={(e, v) => {
                    if (v) {
                      const priceFactor = Number(
                        getValues(`items.${index}`).priceFactor,
                      )
                      setOpen(false)

                      onChange(v.priceUnitId)

                      const unitPrice = priceFactor
                        ? priceFactor * v.price
                        : v.price

                      if (!isNotApplicable) {
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
                        update(idx, {
                          ...savedValue,
                          priceUnitId: v.priceUnitId,
                          unit: v?.unit,
                          priceFactor: priceFactor?.toString(),
                          prices:
                            v?.unit !== 'Percent'
                              ? Number(
                                  getValues(`${detailName}.${idx}.quantity`) ??
                                    0 * unitPrice,
                                )
                              : PercentPrice(
                                  getValues(`${detailName}.${idx}.quantity`) ??
                                    0,
                                ),
                        })
                      }

                      if (v.subPriceUnits && v.subPriceUnits.length > 0) {
                        v.subPriceUnits.forEach(item => {
                          const unitPrice = priceFactor
                            ? priceFactor * item.price
                            : item.price

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
                      // label='Price unit*'
                      placeholder={open ? '' : 'Price unit*'}
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
          type === 'invoiceCreate'
            ? 'left'
            : 'left'
        }
        sx={{ width: '15%' }}
      >
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ? (
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {formatCurrency(
                getValues(`${detailName}.${idx}.unitPrice`) || 0,
                getValues(`${initialPriceName}.currency`) || 'KRW',
              ) ?? '-'}
            </Typography>
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
                      onChange(Number(e.target.value))
                      updatePrice(idx)
                    }}
                    sx={{
                      maxWidth: '104px',
                      padding: 0,
                      'input::placeholder': {
                        color: '#ff4d49',
                        opacity: 1,
                      },
                    }}
                  />
                </Box>
              )
            }}
          />
        )}
      </TableCell>
      <TableCell sx={{ width: '15%' }} align='center'>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ? (
          <Box display='flex' alignItems='center' gap='8px' height={38}>
            <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
              {/* {isNotApplicable || showCurrency
                ? `${getCurrencyMark(
                    getValues(`${initialPriceName}.currency`),
                  )} ${getValues(`${initialPriceName}.currency`) ?? '-'}`
                : null} */}
              {isNotApplicable || showCurrency
                ? `${getCurrencyMark(
                    getValues(`${detailName}.${idx}.currency`),
                  )} ${getValues(`${detailName}.${idx}.currency`) ?? '-'}`
                : null}
            </Typography>
          </Box>
        ) : isNotApplicable ? (
          <Controller
            name={`${detailName}.${idx}.currency`}
            control={control}
            render={({ field: { value, onChange } }) => {
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
                      updatePrice(idx)
                      updateTotalPrice()
                    } else {
                      onChange(null)
                    }
                  }}
                  value={
                    value ? { label: value, value: value } : null
                    // CurrencyList.find(item => item.value === value)
                    // value
                    //   ? CurrencyList.find(item => item.value === value) ||
                    //     null
                    //   : {
                    //       label: getValues(`${initialPriceName}.currency`),
                    //       value: getValues(`${initialPriceName}.currency`),
                    //     }
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Currency*'
                      error={value === null}
                    />
                  )}
                />
              )
            }}
          />
        ) : null}
      </TableCell>
      <TableCell sx={{ width: '20%' }} align='left'>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ? (
          <Typography fontSize={14}>
            {formatCurrency(
              formatByRoundingProcedure(
                Number(getValues(`${detailName}.${idx}.prices`)),
                // Number(fields?.[index]?.detail?.[idx]?.prices) || 0,
                getValues(`${initialPriceName}.numberPlace`),
                getValues(`${initialPriceName}.rounding`),
                getValues(`${initialPriceName}.currency`) || 'KRW',
              ),
              getValues(`${initialPriceName}.currency`) || 'KRW',
            )}
          </Typography>
        ) : (
          <Typography fontSize={14}>
            {isNotApplicable
              ? savedValue?.currency
                ? formatCurrency(
                    formatByRoundingProcedure(
                      Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                      savedValue?.currency === 'USD' ||
                        savedValue.currency === 'SGD'
                        ? 2
                        : 1,
                      0,
                      savedValue?.currency ?? 'KRW',
                    ),
                    savedValue?.currency ?? null,
                  )
                : formatCurrency(
                    formatByRoundingProcedure(
                      Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                      getValues(`${initialPriceName}.currency`) === 'USD' ||
                        getValues(`${initialPriceName}.currency`) === 'SGD'
                        ? 2
                        : 1,
                      0,
                      getValues(`${initialPriceName}.currency`) ?? 'KRW',
                    ),
                    getValues(`${initialPriceName}.currency`) ?? null,
                  )
              : priceData
              ? formatCurrency(
                  formatByRoundingProcedure(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    priceData?.decimalPlace!,
                    priceData?.roundingProcedure!,
                    priceData?.currency! ?? 'KRW',
                  ),
                  priceData?.currency! ?? null,
                )
              : formatCurrency(
                  formatByRoundingProcedure(
                    Number(getValues(`${detailName}.${idx}.prices`)) ?? 0,
                    getValues(`${initialPriceName}.numberPlace`),
                    getValues(`${initialPriceName}.rounding`),
                    getValues(`${initialPriceName}.currency`) || 'KRW',
                  ),
                  getValues(`${initialPriceName}.currency`) ?? null,
                )}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ width: '5%' }} align='center'>
        {type === 'detail' ||
        type === 'invoiceDetail' ||
        type === 'invoiceHistory' ||
        type === 'invoiceCreate' ? null : (
          <IconButton
            onClick={() => {
              console.log(getValues(`${detailName}.${idx}.priceUnitId`))

              if (
                getValues(`${detailName}.${idx}.priceUnitId`) === null ||
                getValues(`${detailName}.${idx}.priceUnitId`) === -1
              ) {
                onDeleteNoPriceUnit(idx)
                updatePrice(idx)
                updateTotalPrice()
              } else {
                onClickDeletePriceUnit(
                  getValues(`${detailName}.${idx}.priceUnitId`)!,
                )
              }
            }}
          >
            <Icon icon='mdi:trash-outline' />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
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
