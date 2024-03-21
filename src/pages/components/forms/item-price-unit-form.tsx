// ** react
import { useRef, useState } from 'react'

// ** styled components
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { Box, Button, Grid, IconButton, Typography } from '@mui/material'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** types
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'

// ** react hook form
import {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'

// ** helpers
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'

// ** values
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
// import styled from "@emotion/styled"
import { styled } from '@mui/material/styles'
import _ from 'lodash'
import { languageType } from '@src/pages/quotes/add-new'
import Row from './item-price-unit-row'
import { Currency } from '@src/types/common/currency.type'

type Props = {
  control: Control<{ items: ItemType[]; languagePairs: languageType[] }, any>
  index: number
  priceUnitsList: Array<PriceUnitListType>
  minimumPrice: number | undefined
  details: FieldArrayWithId<
    { items: ItemType[] },
    `items.${number}.detail`,
    'id'
  >[]
  priceData: StandardPriceListType | null
  getValues: UseFormGetValues<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  setValue: UseFormSetValue<{
    items: ItemType[]
    languagePairs: languageType[]
  }>
  append: UseFieldArrayAppend<
    { items: ItemType[]; languagePairs: languageType[] },
    `items.${number}.detail`
  >
  update: UseFieldArrayUpdate<
    { items: ItemType[]; languagePairs: languageType[] },
    `items.${number}.detail`
  >
  remove: UseFieldArrayRemove
  getTotalPrice: () => void
  // getEachPrice: (idx: number, isNotApplicable?: boolean) => void
  onDeletePriceUnit: (priceUnitId: number) => void
  onDeleteNoPriceUnit: (index: number) => void
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
  // onItemBoxLeave: () => void
  isValid: boolean
  showMinimum: boolean
  setShowMinimum: (n: boolean) => void
  // isNotApplicable: boolean
  type: string
  sumTotalPrice: () => void
  // checkMinimumPrice: () => void
  fields?: FieldArrayWithId<
    { items: ItemType[]; languagePairs: languageType[] },
    'items',
    'id'
  >[]
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

const styledTd = {
  background:
    'linear-gradient( 0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88) ), #666cff',
  padding: '16px',
  fontSize: '12px',
  fontWeight: 500,
}
export type NestedPriceUnitType = PriceUnitListType & {
  subPriceUnits: PriceUnitListType[] | undefined
  groupName: string
}

export default function ItemPriceUnitForm({
  control,
  index,
  minimumPrice,
  details,
  priceData,
  getValues,
  setValue,
  append,
  update,
  getTotalPrice,
  // getEachPrice,
  onDeletePriceUnit,
  onDeleteNoPriceUnit,
  onChangeCurrency,
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
  console.log(details)

  const detailName: `items.${number}.detail` = `items.${index}.detail`
  const initialPriceName: `items.${number}.initialPrice` = `items.${index}.initialPrice`

  const { openModal, closeModal } = useModal()
  const [id, setId] = useState(0)

  const currentItem = getValues(`${detailName}`) || []
  const currentInitialItem = getValues(`${initialPriceName}`)

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

  const [isNotApplicable, setIsNotApplicable] = useState<boolean[]>([])
  // const [showMinimum, setShowMinimum] = useState(getValues(`items.${index}.minimumPriceApplied`))

  const checkPriceId = () => {
    const checkPriceIds = getValues(`items`).map(
      (item, index) => item.priceId === NOT_APPLICABLE,
    )

    setIsNotApplicable(checkPriceIds)
  }

  const updateTotalPrice = () => {
    checkPriceId()
    getTotalPrice()
    // const newTotalPrice = getValues(`items.${index}.totalPrice`)
    // setTotalPrice(newTotalPrice)

    // sumTotalPrice()
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
      {/* <Box
        sx={{
          maxHeight: 400,
          height: '100%',
          // height: 'fit-content',

          overflow: 'auto',
        }}
      > */}
      {/* <Table
        sx={{
          display: 'block',
          maxHeight: 400,
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <TableHead
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'table',
            width: '100%',
          }}
        >
          <TableRow sx={{ display: 'table', width: '100%' }}>
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
              sx={{ width: '36%', textTransform: 'none' }}
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
        <TableBody sx={{ display: 'block', maxHeight: 400, height: '100%' }}>
          {details?.map((row, idx) => (
            <Row
              key={row.id}
              idx={idx}
              nestSubPriceUnits={nestSubPriceUnits}
              currentItem={currentItem}
              getValues={getValues}
              // getEachPrice={getEachPrice}
              detailName={detailName}
              type={type}
              isNotApplicable={isNotApplicable[index]}
              onDeletePriceUnit={onDeletePriceUnit}
              onDeleteNoPriceUnit={onDeleteNoPriceUnit}
              updateTotalPrice={updateTotalPrice}
              priceData={priceData}
              allPriceUnits={allPriceUnits}
              index={index}
              update={update}
              initialPriceName={initialPriceName}
              onChangeCurrency={onChangeCurrency}
              control={control}
              append={append}
              remove={remove}
              showCurrency={showCurrency}
              setValue={setValue}
              row={row}
            />
          ))}

          {showMinimum && !isNotApplicable[index] ? (
            <TableRow tabIndex={-1}>
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
      </Table> */}
      <table
        style={{
          borderCollapse: 'collapse',
          textAlign: 'left',
          width: '100%',
        }}
      >
        <colgroup>
          <col width='10%'></col>
          <col width='36%'></col>
          <col width='15%'></col>
          <col width='17%'></col>
          <col width='17%'></col>
          <col width='5%'></col>
        </colgroup>
        <thead>
          <tr>
            <td style={styledTd}>Quantity</td>
            <td style={styledTd}>Price unit</td>
            <td style={styledTd}>Unit price</td>
            <td style={styledTd}>Currency</td>
            <td style={styledTd}>Prices</td>
            <td style={styledTd}></td>
          </tr>
        </thead>
      </table>
      <Box
        sx={{
          maxHeight: '250px',
          overflowY: 'scroll',
          width: '100%',
          height: 'fit-content',
        }}
      >
        <table style={{ width: '100%' }}>
          <colgroup>
            <col width='10%'></col>
            <col width='36%'></col>
            <col width='15%'></col>
            <col width='17%'></col>
            <col width='17%'></col>
            <col width='5%'></col>
          </colgroup>
          <tbody>
            {details?.map((row, idx) => (
              <Row
                key={row.id}
                idx={idx}
                nestSubPriceUnits={nestSubPriceUnits}
                currentItem={currentItem}
                getValues={getValues}
                // getEachPrice={getEachPrice}
                detailName={detailName}
                type={type}
                isNotApplicable={isNotApplicable[index]}
                onDeletePriceUnit={onDeletePriceUnit}
                onDeleteNoPriceUnit={onDeleteNoPriceUnit}
                updateTotalPrice={updateTotalPrice}
                priceData={priceData}
                allPriceUnits={allPriceUnits}
                index={index}
                update={update}
                initialPriceName={initialPriceName}
                onChangeCurrency={onChangeCurrency}
                control={control}
                append={append}
                remove={remove}
                showCurrency={showCurrency}
                setValue={setValue}
                row={row}
              />
            ))}
          </tbody>
        </table>
      </Box>
      {/* </Box> */}
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
                  // id: id + index,
                  priceUnitId: -1,
                  quantity: null,
                  unitPrice: null,
                  prices: 0,
                  unit: '',
                  // currency: priceData?.currency ?? 'USD',
                  currency:
                    getValues(`items.${index}.detail.${0}.currency`) ?? null,
                })
                setId(id + 1)
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
                {isNotApplicable[index]
                  ? formatCurrency(
                      formatByRoundingProcedure(
                        Number(getValues(`items.${index}.totalPrice`)),
                        getValues().items?.[0]?.detail?.[0]?.currency ===
                          'USD' ||
                          getValues().items?.[0]?.detail?.[0]?.currency ===
                            'SGD'
                          ? 2
                          : getValues().items?.[0]?.initialPrice?.currency ===
                              'KRW'
                            ? 10
                            : 0,
                        0,
                        getValues().items?.[0]?.detail?.[0]?.currency ?? 'KRW',
                      ),
                      getValues().items?.[0]?.detail?.[0]?.currency ?? null,
                    )
                  : formatCurrency(
                      formatByRoundingProcedure(
                        // getValues로 가져오면 폼에서 계산된 값이 반영됨
                        // fields에서 가져오면 서버에서 넘어온 값이 반영됨
                        Number(getValues(`items.${index}.totalPrice`)),
                        // fields?.[index].totalPrice! ?? 0,
                        getValues(`${initialPriceName}.numberPlace`),
                        getValues(`${initialPriceName}.rounding`),
                        getValues(`${initialPriceName}.currency`) || 'KRW',
                      ),
                      getValues(`${initialPriceName}.currency`) ?? null,
                    )}
              </Typography>
            ) : (
              <Typography fontWeight='bold' fontSize={14}>
                {isNotApplicable[index]
                  ? getValues().items?.[0]?.detail?.[0]?.currency
                    ? formatCurrency(
                        formatByRoundingProcedure(
                          Number(getValues(`items.${index}.totalPrice`)),
                          getValues().items?.[0]?.detail?.[0]?.currency ===
                            'USD' ||
                            getValues().items?.[0]?.detail?.[0]?.currency ===
                              'SGD'
                            ? 2
                            : getValues().items?.[0]?.initialPrice?.currency ===
                                'KRW'
                              ? 10
                              : 1,
                          0,
                          getValues().items?.[0]?.detail?.[0]?.currency ??
                            'KRW',
                        ),
                        getValues().items?.[0]?.detail?.[0]?.currency ?? null,
                      )
                    : formatCurrency(
                        formatByRoundingProcedure(
                          Number(getValues(`items.${index}.totalPrice`)),
                          getValues().items?.[0]?.initialPrice?.currency ===
                            'USD' ||
                            getValues().items?.[0]?.initialPrice?.currency ===
                              'SGD'
                            ? 2
                            : getValues().items?.[0]?.initialPrice?.currency ===
                                'KRW'
                              ? 10
                              : 1,
                          0,
                          getValues().items?.[0]?.initialPrice?.currency ??
                            'KRW',
                        ),
                        getValues().items?.[0]?.initialPrice?.currency ?? null,
                      )
                  : priceData
                    ? formatCurrency(
                        formatByRoundingProcedure(
                          Number(getValues(`items.${index}.totalPrice`)) ?? 0,
                          priceData?.decimalPlace!,
                          priceData?.roundingProcedure!,
                          priceData?.currency! ?? 'KRW',
                        ),
                        priceData?.currency! ?? null,
                      )
                    : currentInitialItem
                      ? formatCurrency(
                          formatByRoundingProcedure(
                            Number(getValues(`items.${index}.totalPrice`)) ?? 0,
                            getValues(`${initialPriceName}.numberPlace`),
                            getValues(`${initialPriceName}.rounding`),
                            getValues(`${initialPriceName}.currency`) || 'KRW',
                          ),
                          getValues(`${initialPriceName}.currency`) || null,
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
                  // getTotalPrice()
                  updateTotalPrice()
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
