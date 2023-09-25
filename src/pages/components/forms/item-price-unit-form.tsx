// ** react
import { useRef, useState, useEffect, useMemo } from 'react'

// ** styled components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { HeaderCell } from '@src/pages/orders/add-new'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** types
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  UseFormGetValues,
} from 'react-hook-form'

// ** helpers
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'

// ** values
import { CurrencyList } from '@src/shared/const/currency/currency'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

import styled from 'styled-components'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  index: number
  priceUnitsList: Array<PriceUnitListType>
  minimumPrice: number | undefined
  details: FieldArrayWithId<
    { items: ItemType[] },
    `items.${number}.detail`,
    'id'
  >[]
  priceData: StandardPriceListType | null
  getValues: UseFormGetValues<{ items: ItemType[] }>
  append: UseFieldArrayAppend<{ items: ItemType[] }, `items.${number}.detail`>
  update: UseFieldArrayUpdate<{ items: ItemType[] }, `items.${number}.detail`>
  getTotalPrice: () => void
  getEachPrice: (
    idx: number,
    isNotApplicable?: boolean,
  ) => void
  onDeletePriceUnit: (idx: number) => void
  // onItemBoxLeave: () => void
  isValid: boolean
  showMinimum: boolean
  setShowMinimum: (n: boolean) => void
  // isNotApplicable: boolean
  type: string
  sumTotalPrice: () => void
  // checkMinimumPrice: () => void
  fields?: FieldArrayWithId<{ items: ItemType[] }, 'items', 'id'>[]
}

export default function ItemPriceUnitForm({
  control,
  index,
  minimumPrice,
  details,
  priceData,
  getValues,
  append,
  update,
  getTotalPrice,
  getEachPrice,
  onDeletePriceUnit,
  // onItemBoxLeave,
  isValid,
  showMinimum,
  setShowMinimum,
  // isNotApplicable,
  priceUnitsList,
  type,
  sumTotalPrice,
  // checkMinimumPrice,
  fields,
}: Props) {
  const detailName: `items.${number}.detail` = `items.${index}.detail`
  const initialPriceName: `items.${number}.initialPrice` = `items.${index}.initialPrice`

  const currentItem = getValues(`${detailName}`) || []
  const currentInitialItem = getValues(`${initialPriceName}`)
  type NestedPriceUnitType = PriceUnitListType & {
    subPriceUnits: PriceUnitListType[] | undefined
    groupName: string
  }
  const allPriceUnits = useRef<Array<NestedPriceUnitType>>([])
  const nestSubPriceUnits = (idx: number) => {
    const nestedData: Array<NestedPriceUnitType> = []
    const priceUnit: Array<NestedPriceUnitType> = priceUnitsList.map(item => ({
      ...item,
      quantity: Number(item.quantity) ?? 0,
      priceUnitId: item.id,
      subPriceUnits: [],
      groupName: 'Price unit',
    }))
    const matchingUnit: Array<NestedPriceUnitType> =
      priceData?.priceUnit?.map(item => ({
        ...item,
        subPriceUnits: [],
        groupName: 'Matching price unit',
      })) || []

    const filteredPriceUnit = priceUnit.filter(
      item2 =>
        !matchingUnit.some(item1 => item1.priceUnitId === item2.priceUnitId),
    )

    const data = matchingUnit?.concat(filteredPriceUnit)

    // const uniqueArray = Array.from(new Set(data.map(item => item.priceUnitId)))
    // .map(priceUnitId => data.find(item => item.priceUnitId === priceUnitId))

    if (data?.length) {
      data.forEach(item => {
        if (item && item.parentPriceUnitId === null) {
          nestedData.push(item)
          data.forEach(subItem => {
            if (
              subItem?.parentPriceUnitId === item.priceUnitId &&
              subItem?.priceUnitId
            ) {
              item.subPriceUnits?.push(subItem)
            }
          })
        }
      })
    }

    // // quote 생성 시점에 선택한 price unit 값이 있다면 해당 값을 Initial price unit으로 추가
    // if (currentInitialItem?.priceUnits?.[idx]) {
    //   const initialUsePriceUnit = {
    //     id: currentInitialItem?.priceUnits[idx].id!,
    //     priceUnitId: currentInitialItem?.priceUnits[idx].id!,
    //     isBase: false,
    //     title: currentInitialItem?.priceUnits[idx].title,
    //     unit: currentInitialItem?.priceUnits[idx].unit,
    //     weighting: null,
    //     quantity: currentInitialItem?.priceUnits[idx].quantity!,
    //     price: currentInitialItem?.priceUnits[idx].price!,
    //     subPriceUnits: [],
    //     groupName: 'Initial price unit',
    //   }
    //   nestedData.unshift(initialUsePriceUnit)
    //   data.unshift(initialUsePriceUnit)
    // }

    // // 현재 Row에 설정된 price unit 값이 있다면 해당 값을 Current price unit으로 추가
    // if (currentItem?.[idx] && currentItem?.[idx].priceUnitId !== -1) {
    //   const currentUsePriceUnit = {
    //     id: currentItem?.[idx].priceUnitId,
    //     priceUnitId: currentItem?.[idx].priceUnitId,
    //     isBase: false,
    //     title: currentItem?.[idx].initialPriceUnit?.title!,
    //     unit: currentItem?.[idx].unit,
    //     weighting: null,
    //     quantity: currentItem?.[idx].quantity,
    //     price: Number(currentItem?.[idx].prices),
    //     subPriceUnits: [],
    //     groupName: 'Current price unit',
    //   }
    //   nestedData.unshift(currentUsePriceUnit)
    //   data.unshift(currentUsePriceUnit)
    // }

    allPriceUnits.current = data
    return nestedData
  }

  function PercentPrice(quantity: number) {
    let prices = 0
    if (currentItem) {
      const percentQuantity = quantity
      const generalPrices = currentItem.filter(item => item.unit !== 'Percent')
      generalPrices.forEach(item => {
        prices += item.unitPrice
      })
      prices *= percentQuantity / 100
    }
    return prices
  }
  const [totalPrice, setTotalPrice] = useState(
    getValues(`items.${index}.totalPrice`),
  )
  const [isNotApplicable, setIsNotApplicable] = useState(
    getValues(`items.${index}.priceId`) === NOT_APPLICABLE ? true : false,
  )
  // const [showMinimum, setShowMinimum] = useState(getValues(`items.${index}.minimumPriceApplied`))


  const checkPriceId = () => {
    setIsNotApplicable(
      getValues(`items.${index}.priceId`) === NOT_APPLICABLE ? true : false,
    )
  }
  // useEffect(() => {
  //   console.log("check minimum price",totalPrice,minimumPrice)
  //     if (
  //       minimumPrice &&
  //       totalPrice <= minimumPrice &&
  //       // type === 'edit' &&
  //       !showMinimum
  //     ) {
  //       setShowMinimum(true)
  //     }
  //     if (
  //       minimumPrice &&
  //       totalPrice > minimumPrice &&
  //       // type === 'edit' &&
  //       showMinimum
  //     ) {
  //       setShowMinimum(false)
  //     }
  // }, [totalPrice, showMinimum])

  const Row = ({ idx }: { idx: number }) => {
    const [savedValue, setSavedValue] = useState<ItemDetailType>(
      currentItem[idx],
    )
    const [price, setPrice] = useState(savedValue.prices || 0)
    const containerRef = useRef<HTMLDivElement | null>(null);

    const updatePrice = () => {
      const newPrice = getValues(`${detailName}.${idx}`)
      if (type !== 'detail' && type !== 'invoiceDetail')
        getEachPrice(idx, isNotApplicable) //폼 데이터 업데이트 (setValue)
      getTotalPrice() // 합계 데이터 업데이트 (setValue)
      setSavedValue(newPrice) // setValue된 값 가져오기
      setPrice(newPrice.prices) // setValue된 값에서 price 정보 가져오기
    }

    const updateTotalPrice = () => {
      checkPriceId()
      getTotalPrice()
      const newTotalPrice = getValues(`items.${index}.totalPrice`)
      setTotalPrice(newTotalPrice)
      // sumTotalPrice()
    }

    const onClickDeletePriceUnit = (idx: number) => {
      onDeletePriceUnit(idx)
      updateTotalPrice()
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
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          // 필요한 액션
          updatePrice()
          updateTotalPrice()
        }
      };

      window.addEventListener('mousedown', handleOutsideClick);

      return () => {
        window.removeEventListener('mousedown', handleOutsideClick);
      }
    }, [])

    const [open, setOpen] = useState(false)
    const priceFactor = priceData?.languagePairs?.[0]?.priceFactor || null
    const options = nestSubPriceUnits(idx)
    return (
      <TableRow
        hover
        tabIndex={-1}
        // onMouseLeave={() => {
        //   updateTotalPrice()
        // }}
      >
        <TableCell sx={{ width: '10%' }} ref={containerRef}>
          {type === 'detail' || type === 'invoiceDetail' ? (
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
                      value={Number(value)}
                      sx={{ maxWidth: '85px', padding: 0 }}
                      inputProps={{ inputMode: 'decimal' }}
                      onChange={e => {
                        onChange(Number(e.target.value))
                        // updatePrice(e)
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
          {type === 'detail' || type === 'invoiceDetail' ? (
            <Box display='flex' alignItems='center' gap='8px' height={38}>
              <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
                {
                  allPriceUnits?.current?.find(
                    item =>
                      item.priceUnitId ===
                      getValues(`${detailName}.${idx}.priceUnitId`),
                  )?.title ?? getValues(`${detailName}.${idx}.title`)
                }
              </Typography>
            </Box>
          ) : (
            <Controller
              name={`${detailName}.${idx}.priceUnitId`}
              control={control}
              render={({ field: { value, onChange } }) => {
                // const options = nestSubPriceUnits()
                const findValue =
                  allPriceUnits?.current?.find(
                    item => item.priceUnitId === value,
                  ) || null
                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={options}
                    groupBy={option => option?.groupName}
                    getOptionLabel={option => {
                      const title =
                        option?.quantity && option?.quantity >= 2
                          ? `${option?.quantity} ${option.title}`
                          : option.title
                      return title
                    }}
                    renderOption={(props, option, state) => {
                      return (
                        <Box>
                          <Box
                            component='li'
                            padding='4px 0'
                            {...props}
                            onClick={() => {
                              setOpen(false)
                              onChange(option.title)
                              const unitPrice = priceFactor
                                ? priceFactor * option.price
                                : option.price
                              update(idx, {
                                ...savedValue,
                                priceUnitId: option.priceUnitId,
                                quantity: option.quantity ?? 0,
                                unit: option.unit,
                                unitPrice: priceFactor
                                  ? priceFactor * option.price
                                  : option.price,
                                priceFactor: priceFactor?.toString(),
                                prices:
                                  option.unit !== 'Percent'
                                    ? option.quantity! * unitPrice
                                    : PercentPrice(option.quantity!),
                              })
                              if (option?.subPriceUnits?.length) {
                                option.subPriceUnits.forEach(item => {
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
                                        ? item.quantity! * unitPrice
                                        : PercentPrice(item.quantity!),
                                  })
                                })
                              }
                            }}
                          >
                            {option?.quantity && option?.quantity >= 2
                              ? `${option?.quantity} ${option.title}`
                              : option.title}
                          </Box>
                          {option?.subPriceUnits?.map(sub => (
                            <Box
                              component='li'
                              padding='4px 0'
                              className={props.className}
                              key={sub.priceUnitId}
                              role={props.role}
                              onClick={() => {
                                setOpen(false)
                                onChange(sub.title)
                                update(idx, {
                                  ...savedValue,
                                  priceUnitId: sub.priceUnitId,
                                  quantity: sub.quantity ?? 0,
                                  unit: sub.unit,
                                  unitPrice: priceFactor
                                    ? priceFactor * sub.price
                                    : sub.price,
                                  priceFactor: priceFactor?.toString(),
                                })
                              }}
                            >
                              <Icon
                                icon='material-symbols:subdirectory-arrow-right'
                                opacity={0.7}
                              />
                              {sub?.quantity && sub?.quantity >= 2
                                ? `${sub?.quantity} ${sub.title}`
                                : sub.title}
                            </Box>
                          ))}
                        </Box>
                      )
                    }}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={
                      findValue
                        ? {
                            ...findValue,
                            subPriceUnits: [],
                            groupName: '',
                          }
                        : null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Price unit*'
                        placeholder='Price unit*'
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
            type === 'detail' || type === 'invoiceDetail' ? 'left' : 'left'
          }
          sx={{ width: '15%' }}
        >
          {type === 'detail' || type === 'invoiceDetail' ? (
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
                  <TextField
                    placeholder='0.00'
                    inputProps={{ inputMode: 'decimal' }}
                    type='number'
                    value={savedValue.unit === 'Percent' ? '-' : value}
                    disabled={savedValue.unit === 'Percent'}
                    onChange={e => {
                      onChange(e)
                      // updatePrice(e)
                    }}
                    sx={{ maxWidth: '104px', padding: 0 }}
                  />
                )
              }}
            />
          )}
        </TableCell>
        <TableCell sx={{ width: '15%' }} align='center'>
          {type === 'detail' || type === 'invoiceDetail' ? (
            <Box display='flex' alignItems='center' gap='8px' height={38}>
              <Typography variant='subtitle1' fontSize={14} lineHeight={21}>
                {isNotApplicable
                  ? getValues(`${detailName}.${idx}.currency`) ?? '-'
                  : null}
              </Typography>
            </Box>
          ) : isNotApplicable ? (
            <Controller
              name={`${detailName}.${0}.currency`}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={CurrencyList}
                    onChange={(e, v) => {
                      if (v?.value) onChange(v.value)
                      // updatePrice(e)
                    }}
                    value={
                      CurrencyList.find(item => item.value === value) || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Currency*'
                        placeholder='Currency*'
                      />
                    )}
                  />
                )
              }}
            />
          ) : null}
        </TableCell>
        <TableCell sx={{ width: '20%' }} align='left'>
          {type === 'detail' || type === 'invoiceDetail' ? (
            <Typography fontSize={14}>
              {formatCurrency(
                formatByRoundingProcedure(
                  // Number(getValues(`${detailName}.${idx}.prices`)),
                  Number(fields?.[index]?.detail?.[idx]?.prices) || 0,
                  getValues(`${initialPriceName}.numberPlace`),
                  getValues(`${initialPriceName}.rounding`),
                  getValues(`${initialPriceName}.currency`) || 'KRW',
                ),
                getValues(`${initialPriceName}.currency`) || 'KRW',
              )}
            </Typography>
          ) : (
            <Typography fontSize={14}>
              {
                // TODO: Not Applicable 기능 재정의 해야 함
                isNotApplicable
                  ? formatCurrency(
                      formatByRoundingProcedure(
                        Number(price),
                        savedValue.currency === 'USD' ||
                          savedValue.currency === 'SGD'
                          ? 2
                          : 1000,
                        0,
                        savedValue.currency ?? 'KRW',
                      ),
                      savedValue.currency ?? 'KRW',
                    )
                  : priceData
                  ? formatCurrency(
                      formatByRoundingProcedure(
                        Number(price) ?? 0,
                        priceData?.decimalPlace!,
                        priceData?.roundingProcedure!,
                        priceData?.currency! ?? 'KRW',
                      ),
                      priceData?.currency! ?? 'KRW',
                    )
                  : formatCurrency(
                      formatByRoundingProcedure(
                        Number(price) ?? 0,
                        getValues(`${initialPriceName}.numberPlace`),
                        getValues(`${initialPriceName}.rounding`),
                        getValues(`${initialPriceName}.currency`) || 'KRW',
                      ),
                      getValues(`${initialPriceName}.currency`) || 'KRW',
                    )
              }
            </Typography>
          )}
        </TableCell>
        <TableCell sx={{ width: '5%' }} align='center'>
          {type === 'detail' || type === 'invoiceDetail' ? null : (
            <IconButton onClick={() => onClickDeletePriceUnit(idx)}>
              <Icon icon='mdi:trash-outline' />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Grid
      item
      xs={12}
      // onMouseLeave={() => {
      //   if (type !== 'invoiceDetail' && type !== 'detail') {
      //     // onItemBoxLeave()
      //   }
      // }}
    >
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <TableRow>
              <HeaderCell
                sx={{ width: '10%', textTransform: 'none' }}
                align='left'
              >
                Quantity
              </HeaderCell>
              <HeaderCell
                sx={{ width: 'auto', textTransform: 'none' }}
                align='left'
              >
                Price unit
              </HeaderCell>
              <HeaderCell
                sx={{ width: '15%', textTransform: 'none' }}
                align='left'
              >
                Unit price
              </HeaderCell>
              <HeaderCell
                sx={{ width: '17%', textTransform: 'none' }}
                align='left'
              >
                Currency
              </HeaderCell>
              <HeaderCell
                sx={{ width: '17%', textTransform: 'none' }}
                align='left'
              >
                Prices
              </HeaderCell>
              <HeaderCell
                sx={{ width: '5%', textTransform: 'none' }}
                align='left'
              ></HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details?.map((row, idx) => (
              <Row key={row.id} idx={idx} />
            ))}
            {showMinimum && !isNotApplicable ? (
              <TableRow
                hover
                tabIndex={-1} /* onBlur={() => onItemBoxLeave()} */
              >
                <TableCell>
                  <Typography color='primary' fontSize={14}>
                    1
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color='primary' fontSize={14}>
                    Minimum price per item
                  </Typography>
                </TableCell>
                <TableCell align='left'>
                  <Typography color='primary' fontSize={14}>
                    {!priceData ||
                    priceData.id === NOT_APPLICABLE ||
                    type === 'edit'
                      ? formatByRoundingProcedure(
                          minimumPrice ?? 0,
                          priceData?.decimalPlace!,
                          priceData?.roundingProcedure!,
                          priceData?.currency! ?? 'KRW',
                        )
                      : formatCurrency(
                          formatByRoundingProcedure(
                            minimumPrice ?? 0,
                            priceData?.decimalPlace!,
                            priceData?.roundingProcedure!,
                            priceData?.currency! ?? 'KRW',
                          ),
                          priceData?.currency ?? 'KRW',
                        )}
                  </Typography>
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='left'>
                  <Typography color='primary' fontSize={14}>
                    {!priceData || priceData.id === NOT_APPLICABLE
                      ? minimumPrice ?? 0
                      : formatCurrency(
                          formatByRoundingProcedure(
                            minimumPrice ?? 0,
                            priceData?.decimalPlace!,
                            priceData?.roundingProcedure!,
                            priceData?.currency! ?? 'KRW',
                          ),
                          priceData?.currency ?? 'KRW',
                        )}
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  {type === 'detail' || type === 'invoiceDetail' ? null : (
                    <IconButton onClick={() => setShowMinimum(false)}>
                      <Icon icon='mdi:trash-outline' />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
      {type === 'detail' || type === 'invoiceDetail' ? null : (
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='flex'
            height={60}
            marginLeft={5}
          >
            <Button
              onClick={() => {
                append({
                  priceUnitId: -1,
                  quantity: 0,
                  unitPrice: 0,
                  prices: 0,
                  unit: '',
                  currency: priceData?.currency ?? 'USD',
                })
              }}
              variant='contained'
              disabled={!isValid}
              sx={{ p: 0.7, minWidth: 26 }}
            >
              <Icon icon='material-symbols:add' />
            </Button>
          </Box>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          height={60}
        >
          <Typography fontWeight='bold' fontSize={14}>
            Total price
          </Typography>
          <Box
            display='flex'
            alignItems='center'
            marginLeft={20}
            marginRight={5}
          >
            {type === 'detail' || type === 'invoiceDetail' ? (
              <Typography fontWeight='bold' fontSize={14}>
                {formatCurrency(
                  formatByRoundingProcedure(
                    // getValues로 가져오면 폼에서 계산된 값이 반영됨
                    // fields에서 가져오면 서버에서 넘어온 값이 반영됨
                    // Number(getValues(`${itemName}.totalPrice`)),
                    fields?.[index].totalPrice! ?? 0,
                    getValues(`${initialPriceName}.numberPlace`),
                    getValues(`${initialPriceName}.rounding`),
                    getValues(`${initialPriceName}.currency`) || 'KRW',
                  ),
                  getValues(`${initialPriceName}.currency`) || 'KRW',
                )}
              </Typography>
            ) : (
              <Typography fontWeight='bold' fontSize={14}>
                {/* {!priceData
                    // 정보가 없으므로 기본값으로 처리함, Not Applicable 케이스는 다를수 있으므로 일단 분리만 해둠
                    ? 0
                    : priceData.id === NOT_APPLICABLE
                      ? formatCurrency(
                        formatByRoundingProcedure(
                          totalPrice,
                          getValues(`${initialPriceName}.numberPlace`),
                          getValues(`${initialPriceName}.rounding`),
                          getValues(`${initialPriceName}.currency`),
                        ),
                        getValues(`${initialPriceName}.currency`),
                      )
                      : currentInitialItem
                        ? formatCurrency(
                            formatByRoundingProcedure(
                              totalPrice,
                              getValues(`${initialPriceName}.numberPlace`),
                              getValues(`${initialPriceName}.rounding`),
                              getValues(`${initialPriceName}.currency`),
                            ),
                            getValues(`${initialPriceName}.currency`),
                          )
                        //currentInitialItem 값이 없다면 새로운 row 추가 케이스임
                        : formatCurrency(
                            formatByRoundingProcedure(
                              totalPrice,
                              priceData?.decimalPlace,
                              priceData?.roundingProcedure,
                              priceData?.currency,
                            ),
                            priceData?.currency,
                          )
                    } */}
                {priceData
                  ? formatCurrency(
                      formatByRoundingProcedure(
                        totalPrice ?? 0,
                        priceData?.decimalPlace!,
                        priceData?.roundingProcedure!,
                        priceData?.currency! ?? 'KRW',
                      ),
                      priceData?.currency! ?? 'KRW',
                    )
                  : currentInitialItem
                  ? formatCurrency(
                      formatByRoundingProcedure(
                        totalPrice ?? 0,
                        getValues(`${initialPriceName}.numberPlace`),
                        getValues(`${initialPriceName}.rounding`),
                        getValues(`${initialPriceName}.currency`) || 'KRW',
                      ),
                      getValues(`${initialPriceName}.currency`) || 'KRW',
                    )
                  : 0}
              </Typography>
            )}
            {type === 'detail' || type === 'invoiceDetail' ? null : (
              <IconButton onClick={() => {
                getTotalPrice()
              }}>
                <Icon icon='material-symbols:refresh' />
              </IconButton>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

const CustomTableCell = styled(TableCell)`
  display: flex !important;
  align-items: center;
  height: 65px;
  margin: 0px;
  padding: 5px;
`
