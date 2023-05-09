// ** react
import { useRef, useState } from 'react'

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
import { ItemType } from '@src/types/common/item.type'

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
  getTotalPrice: (n?: boolean) => void
  getEachPrice: (idx: number) => void
  onDeletePriceUnit: (idx: number, title: string) => void
  onItemBoxLeave: () => void
  isValid: boolean
  showMinimum: { checked: boolean; show: boolean }
  setShowMinimum: (n: { checked: boolean; show: boolean }) => void
  isNotApplicable: boolean
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
  onItemBoxLeave,
  isValid,
  showMinimum,
  setShowMinimum,
  isNotApplicable,
  priceUnitsList,
}: Props) {
  const itemName: `items.${number}.detail` = `items.${index}.detail`
  type NestedPriceUnitType = PriceUnitListType & {
    subPriceUnits: PriceUnitListType[]
    groupName: string
  }
  const allPriceUnits = useRef<Array<NestedPriceUnitType>>([])

  const nestSubPriceUnits = () => {
    const nestedData: Array<NestedPriceUnitType> = []
    const priceUnit: Array<NestedPriceUnitType> = priceUnitsList.map(item => ({
      ...item,
      subPriceUnits: [],
      groupName: 'Price unit',
    }))
    const matchingUnit: Array<NestedPriceUnitType> =
      priceData?.priceUnit?.map(item => ({
        ...item,
        subPriceUnits: [],
        groupName: 'Matching price unit',
      })) || []
    const data = matchingUnit?.concat(priceUnit)
    if (data?.length) {
      data.forEach(item => {
        if (item.parentPriceUnitId === null) {
          nestedData.push(item)
          data.forEach(subItem => {
            if (subItem.parentPriceUnitId === item.priceUnitId) {
              item.subPriceUnits.push(subItem)
            }
          })
        }
      })
    }
    allPriceUnits.current = data
    return nestedData
  }

  const Row = ({ idx }: { idx: number }) => {
    const savedValue = getValues(`${itemName}.${idx}`)
    const [open, setOpen] = useState(false)
    const priceFactor = priceData?.languagePairs?.[0]?.priceFactor || null

    return (
      <TableRow
        hover
        tabIndex={-1}
        onBlur={() => {
          getEachPrice(idx)
        }}
      >
        <TableCell>
          <Controller
            name={`${itemName}.${idx}.quantity`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Box display='flex' alignItems='center' gap='8px'>
                  <TextField
                    placeholder='0'
                    type='number'
                    value={value}
                    sx={{ maxWidth: '80px', padding: 0 }}
                    inputProps={{ inputMode: 'decimal' }}
                    onChange={onChange}
                  />
                  {savedValue.unit === 'Percent' ? '%' : null}
                </Box>
              )
            }}
          />
        </TableCell>
        <TableCell>
          <Controller
            name={`${itemName}.${idx}.priceUnit`}
            control={control}
            render={({ field: { value, onChange } }) => {
              const options = nestSubPriceUnits()
              const findValue =
                allPriceUnits?.current?.find(item => item.title === value) ||
                null
              return (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  options={options}
                  groupBy={option => option?.groupName}
                  getOptionLabel={option => {
                    const title =
                      option?.quantity && option?.quantity >= 2
                        ? `${option.title} ${option?.quantity}`
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
                            update(idx, {
                              ...savedValue,
                              quantity: option.quantity ?? 0,
                              unit: option.unit,
                              unitPrice: priceFactor
                                ? priceFactor * option.price
                                : option.price,
                              priceFactor: priceFactor?.toString(),
                            })
                            if (option?.subPriceUnits?.length) {
                              option.subPriceUnits.forEach(item => {
                                append({
                                  ...savedValue,
                                  quantity: item.quantity!,
                                  priceUnit: item.title,
                                  unit: item.unit,
                                  unitPrice: priceFactor
                                    ? priceFactor * item.price
                                    : item.price,
                                })
                              })
                            }
                            getEachPrice(idx)
                          }}
                        >
                          {option?.quantity && option?.quantity >= 2
                            ? `${option.title} ${option?.quantity}`
                            : option.title}
                        </Box>
                        {option?.subPriceUnits?.map(sub => (
                          <Box
                            component='li'
                            padding='4px 0'
                            className={props.className}
                            key={sub.id}
                            role={props.role}
                            onClick={() => {
                              setOpen(false)
                              onChange(sub.title)
                              update(idx, {
                                ...savedValue,
                                quantity: sub.quantity ?? 0,
                                unit: sub.unit,
                                unitPrice: priceFactor
                                  ? priceFactor * sub.price
                                  : sub.price,
                                priceFactor: priceFactor?.toString(),
                              })
                              getEachPrice(idx)
                            }}
                          >
                            <Icon
                              icon='material-symbols:subdirectory-arrow-right'
                              opacity={0.7}
                            />
                            {sub?.quantity && sub?.quantity >= 2
                              ? `${sub.title} ${sub?.quantity}`
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
        </TableCell>
        <TableCell align='center'>
          <Controller
            name={`${itemName}.${idx}.unitPrice`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <TextField
                  placeholder='0.00'
                  value={savedValue.unit === 'Percent' ? '-' : value}
                  disabled={savedValue.unit === 'Percent'}
                  onChange={e => {
                    onChange(e)
                  }}
                  sx={{ maxWidth: '80px', padding: 0 }}
                />
              )
            }}
          />
        </TableCell>
        <TableCell align='center'>
          {isNotApplicable ? (
            <Controller
              name={`${itemName}.${0}.currency`}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={CurrencyList}
                    onChange={(e, v) => {
                      if (v?.value) onChange(v.value)
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
        <TableCell align='center'>
          <Typography>
            {!priceData
              ? 0
              : formatCurrency(
                  formatByRoundingProcedure(
                    Number(savedValue.prices),
                    priceData?.decimalPlace!,
                    priceData?.roundingProcedure!,
                    priceData?.currency!,
                  ),
                  priceData?.currency ?? 'USD',
                )}
          </Typography>
        </TableCell>
        <TableCell align='center'>
          <IconButton
            onClick={() => onDeletePriceUnit(idx, savedValue.priceUnit)}
          >
            <Icon icon='mdi:trash-outline' />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Grid item xs={12} onBlur={onItemBoxLeave}>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {[
                'Quantity',
                'Price unit',
                'Unit price',
                'Currency',
                'Prices',
                '',
              ].map((item, idx) => (
                <HeaderCell key={idx} align='left'>
                  {item}
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {details?.map((row, idx) => (
              <Row key={row.id} idx={idx} />
            ))}
            {showMinimum.show ? (
              <TableRow hover tabIndex={-1} onBlur={() => onItemBoxLeave()}>
                <TableCell>
                  <Typography color='primary'>1</Typography>
                </TableCell>
                <TableCell>
                  <Typography color='primary'>
                    Minimum price per item
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography color='primary'>{minimumPrice}</Typography>
                </TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>
                  <Typography color='primary'>
                    {!priceData
                      ? 0
                      : formatCurrency(
                          formatByRoundingProcedure(
                            minimumPrice ?? 0,
                            priceData?.decimalPlace!,
                            priceData?.roundingProcedure!,
                            priceData?.currency!,
                          ),
                          priceData?.currency ?? 'USD',
                        )}
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <IconButton
                    onClick={() =>
                      setShowMinimum({ show: false, checked: true })
                    }
                  >
                    <Icon icon='mdi:trash-outline' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow hover tabIndex={-1}>
              <TableCell colSpan={6}>
                <Button
                  onClick={() =>
                    append({
                      quantity: 0,
                      priceUnit: '',
                      unitPrice: 0,
                      prices: 0,
                      unit: '',
                      currency: priceData?.currency ?? 'USD',
                    })
                  }
                  variant='contained'
                  disabled={!isValid}
                  sx={{ p: 0.7, minWidth: 26 }}
                >
                  <Icon icon='material-symbols:add' />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow tabIndex={-1}>
              <TableCell colSpan={5} align='right'>
                <Typography fontWeight='bold'>Total price</Typography>
              </TableCell>
              <TableCell colSpan={1} align='right'>
                <Box
                  display='flex'
                  alignItems='center'
                  gap='8px'
                  justifyContent='flex-end'
                >
                  <Typography fontWeight='bold'>
                    {!priceData
                      ? 0
                      : formatCurrency(
                          formatByRoundingProcedure(
                            getValues(`items.${index}.totalPrice`),
                            priceData?.decimalPlace!,
                            priceData?.roundingProcedure!,
                            priceData?.currency!,
                          ),
                          priceData?.currency ?? 'USD',
                        )}
                  </Typography>
                  <IconButton onClick={() => getTotalPrice()}>
                    <Icon icon='material-symbols:refresh' />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}
