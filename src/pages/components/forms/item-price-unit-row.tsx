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
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
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
  getValues: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  currentItem: ItemDetailType[]
  getEachPrice: (idx: number, isNotApplicable?: boolean | undefined) => void
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
    detailIndex: number,
  ) => void
}

const Row = ({
  idx,
  nestSubPriceUnits,
  currentItem,
  getValues,
  getEachPrice,
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
}: Props) => {
  const [savedValue, setSavedValue] = useState<ItemDetailType>(currentItem[idx])
  const [price, setPrice] = useState(savedValue.prices || 0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { openModal, closeModal } = useModal()

  const options = nestSubPriceUnits(idx)

  const updatePrice = () => {
    const newPrice = getValues(`${detailName}.${idx}`)
    if (type !== 'detail' && type !== 'invoiceDetail')
      getEachPrice(idx, isNotApplicable) //폼 데이터 업데이트 (setValue)
    // getTotalPrice() // 합계 데이터 업데이트 (setValue)

    setSavedValue(newPrice) // setValue된 값 가져오기
    setPrice(newPrice.prices) // setValue된 값에서 price 정보 가져오기
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
      const generalPrices = currentItem.filter(item => item.unit !== 'Percent')
      generalPrices.forEach(item => {
        prices += item.unitPrice ?? 0
      })
      prices *= percentQuantity / 100
    }
    return prices
  }

  const onClickDeletePriceUnit = (idx: number) => {
    if (
      options.find(item => item.id === idx) ||
      (idx !== -1 &&
        getValues().items[0].detail?.find(item => item.priceUnitId === idx))
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
    updatePrice()
    updateTotalPrice()
  }, [])

  useEffect(() => {
    // row 외부가 클릭될때 마다 액션을 준다
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // 필요한 액션
        updatePrice()
        updateTotalPrice()
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const [open, setOpen] = useState(false)

  console.log(savedValue)

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
                      updatePrice()
                    }}
                  />
                  {savedValue.unit === 'Percent' ? '%' : null}
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
                      option?.quantity && option?.quantity >= 2
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

                      update(idx, {
                        ...savedValue,
                        priceUnitId: v.priceUnitId,
                        quantity: v.quantity ?? 0,
                        unit: v.unit,
                        unitPrice: unitPrice,
                        priceFactor: priceFactor?.toString(),
                        prices:
                          v.unit !== 'Percent'
                            ? Number(v.quantity! * unitPrice)
                            : PercentPrice(v.quantity!),
                      })
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
                            unit: item.unit,
                            unitPrice: unitPrice,
                            prices:
                              item.unit !== 'Percent'
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
                        ? savedValue.unit === 'Percent'
                          ? '-'
                          : value
                        : null
                    }
                    error={value === null || value === 0}
                    disabled={savedValue.unit === 'Percent'}
                    onChange={e => {
                      onChange(Number(e.target.value))
                      updatePrice()
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
              console.log(value)

              return (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  options={CurrencyList}
                  onChange={(e, v) => {
                    console.log(v)
                    if (v) {
                      onChange(v.value)

                      onChangeCurrency(
                        v.value,
                        index,
                        getValues(`items.${index}.detail`) ?? [],
                        idx,
                      )
                      updatePrice()
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
              ? savedValue.currency
                ? formatCurrency(
                    formatByRoundingProcedure(
                      Number(price),
                      savedValue.currency === 'USD' ||
                        savedValue.currency === 'SGD'
                        ? 2
                        : 1,
                      0,
                      savedValue.currency ?? 'KRW',
                    ),
                    savedValue.currency ?? null,
                  )
                : formatCurrency(
                    formatByRoundingProcedure(
                      Number(price),
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
                    Number(price) ?? 0,
                    priceData?.decimalPlace!,
                    priceData?.roundingProcedure!,
                    priceData?.currency! ?? 'KRW',
                  ),
                  priceData?.currency! ?? null,
                )
              : formatCurrency(
                  formatByRoundingProcedure(
                    Number(price) ?? 0,
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
              if (getValues(`${detailName}.${idx}.priceUnitId`) === null) {
                remove(idx)
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
