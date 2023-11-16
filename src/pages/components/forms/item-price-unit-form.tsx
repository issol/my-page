// ** react
import { useRef, useState, useEffect, useMemo } from 'react'

// ** styled components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  ListItem,
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
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
} from 'react-hook-form'

// ** helpers
import {
  formatByRoundingProcedure,
  formatCurrency,
  getCurrencyMark,
} from '@src/shared/helpers/price.helper'

// ** values
import { CurrencyList } from '@src/shared/const/currency/currency'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// import styled from 'styled-components'
import { styled, lighten, darken } from '@mui/material/styles'
import _ from 'lodash'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

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
  remove: UseFieldArrayRemove
  getTotalPrice: () => void
  getEachPrice: (idx: number, isNotApplicable?: boolean) => void
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
  showCurrency?: boolean
  setDarkMode?: boolean
}

const StyledTableCell = styled(TableCell)<{ dark: boolean }>(
  ({ theme, dark }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: dark ?
      background: dark
        ? 'linear-gradient( 0deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) ), #bbbbbb'
        : 'linear-gradient( 0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88) ), #666cff',
      // color: theme.palette.common.white,
    },
  }),
)

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
  showCurrency,
  setDarkMode,
  remove,
}: Props) {
  const detailName: `items.${number}.detail` = `items.${index}.detail`
  const initialPriceName: `items.${number}.initialPrice` = `items.${index}.initialPrice`

  const { openModal, closeModal } = useModal()

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
      quantity: 0,
      price: 0,
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

    const data = [...matchingUnit, ...priceUnit]

    // const uniqueArray = Array.from(new Set(data.map(item => item.priceUnitId)))
    // .map(priceUnitId => data.find(item => item.priceUnitId === priceUnitId))

    if (data?.length) {
      data.forEach(item => {
        if (item && item.parentPriceUnitId === null) {
          nestedData.push(item)
          data.forEach(subItem => {
            if (
              subItem?.parentPriceUnitId === item.priceUnitId &&
              subItem?.groupName === item.groupName &&
              subItem?.priceUnitId
            ) {
              // subPrice가 추가될 부모의 그룹이름이 Price unit이라면 price, quantity를 0으로 초기화 해준다
              if (subItem?.groupName === 'Price unit') {
                item.subPriceUnits?.push({ ...subItem, price: 0 })
              } else {
                item.subPriceUnits?.push(subItem)
              }
            }
          })
          const uniqueArray: PriceUnitListType[] = Array.from(
            new Set(item.subPriceUnits?.map(subItem => subItem.id)),
          ).map(id => item.subPriceUnits?.find(subItem => subItem.id === id)!)

          item.subPriceUnits = uniqueArray
        }
      })
    }

    allPriceUnits.current = _.uniqBy(data, item => item.id + item.groupName)
    return _.uniqBy(data, item => item.id + item.groupName)
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
    const containerRef = useRef<HTMLDivElement | null>(null)

    const options = nestSubPriceUnits(idx)

    const updatePrice = () => {
      const newPrice = getValues(`${detailName}.${idx}`)
      if (type !== 'detail' && type !== 'invoiceDetail')
        getEachPrice(idx, isNotApplicable) //폼 데이터 업데이트 (setValue)
      // getTotalPrice() // 합계 데이터 업데이트 (setValue)

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

    const handleDeletePriceUnit = (idx: number) => {
      closeModal('DeletePriceUnitModal')
      onDeletePriceUnit(idx)
      updateTotalPrice()
    }

    const onClickDeletePriceUnit = (idx: number) => {
      console.log(idx, 'index22')

      if (options.find(item => item.id === idx)) {
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
        onDeletePriceUnit(idx)
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

    console.log(getValues(`${detailName}.${idx}`))

    // const priceFactor = priceData?.languagePairs?.[0]?.priceFactor || null

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
                      sx={{ maxWidth: '85px', padding: 0 }}
                      inputProps={{ inputMode: 'decimal' }}
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

                const findValue =
                  allPriceUnits?.current?.find(
                    item => item.priceUnitId === value,
                  ) || null

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
                      disabled={savedValue.unit === 'Percent'}
                      onChange={e => {
                        onChange(Number(e.target.value))
                        updatePrice()
                      }}
                      sx={{ maxWidth: '104px', padding: 0 }}
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
                {isNotApplicable || showCurrency
                  ? `${getCurrencyMark(
                      getValues(`${initialPriceName}.currency`),
                    )} ${getValues(`${initialPriceName}.currency`) ?? '-'}`
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
      <TableContainer
        component={Paper}
        sx={
          setDarkMode
            ? {
                maxHeight: 400,
                backgroundColor: 'rgba(76, 78, 100, 0)',
                // opacity: 0.7,
              }
            : { maxHeight: 400 }
        }
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <TableRow sx={{ border: '1px solid' }}>
              <StyledTableCell
                sx={{
                  width: '10%',
                  textTransform: 'none',
                }}
                align='left'
                dark={setDarkMode!}
              >
                Quantity
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: 'auto', textTransform: 'none' }}
                align='left'
                dark={setDarkMode!}
              >
                Price unit
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: '15%', textTransform: 'none' }}
                align='left'
                dark={setDarkMode!}
              >
                Unit price
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: '17%', textTransform: 'none' }}
                align='left'
                dark={setDarkMode!}
              >
                Currency
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: '17%', textTransform: 'none' }}
                align='left'
                dark={setDarkMode!}
              >
                Prices
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: '5%', textTransform: 'none' }}
                align='left'
                dark={setDarkMode!}
              ></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details?.map((row, idx) => (
              <Row key={row.id} idx={idx} />
            ))}
            {showMinimum && !isNotApplicable ? (
              <TableRow tabIndex={-1} /* onBlur={() => onItemBoxLeave()} */>
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
                  {type === 'detail' ||
                  type === 'invoiceDetail' ||
                  type === 'invoiceHistory' ||
                  type === 'invoiceCreate' ? null : (
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
      {type === 'detail' ||
      type === 'invoiceDetail' ||
      type === 'invoiceHistory' ||
      type === 'invoiceCreate' ? null : (
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
                  quantity: null,
                  unitPrice: null,
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
            {type === 'detail' ||
            type === 'invoiceDetail' ||
            type === 'invoiceHistory' ||
            type === 'invoiceCreate' ? (
              <Typography fontWeight='bold' fontSize={14}>
                {formatCurrency(
                  formatByRoundingProcedure(
                    // getValues로 가져오면 폼에서 계산된 값이 반영됨
                    // fields에서 가져오면 서버에서 넘어온 값이 반영됨
                    Number(getValues().items[index].totalPrice),
                    // fields?.[index].totalPrice! ?? 0,
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
            {type === 'detail' ||
            type === 'invoiceDetail' ||
            type === 'invoiceHistory' ||
            type === 'invoiceCreate' ? null : (
              <IconButton
                onClick={() => {
                  getTotalPrice()
                }}
              >
                <Icon icon='material-symbols:refresh' />
              </IconButton>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

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
