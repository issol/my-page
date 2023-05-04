// ** react
import { useRef, useState } from 'react'

// ** MUI Imports
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

import styled from 'styled-components'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { v4 as uuidv4 } from 'uuid'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  useFieldArray,
} from 'react-hook-form'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import { CurrencyList } from '@src/shared/const/currency/currency'
import InfoConfirmModal from '@src/pages/client/components/modals/info-confirm-modal'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  index: number
  isValid: boolean
  isNotApplicable: boolean
  priceData: StandardPriceListType | null
  getValues: UseFormGetValues<{ items: ItemType[] }>
  trigger: UseFormTrigger<{ items: ItemType[] }>
  setValue: UseFormSetValue<{ items: ItemType[] }>
  priceUnitsList: Array<PriceUnitListType>
  showMinimum: { checked: boolean; show: boolean }
  setShowMinimum: (n: { checked: boolean; show: boolean }) => void
}

export default function ItemPriceUnitForm({
  control,
  index,
  isValid,
  isNotApplicable,
  priceData,
  getValues,
  trigger,
  setValue,
  priceUnitsList,
  showMinimum,
  setShowMinimum,
}: Props) {
  const itemName: `items.${number}.detail` = `items.${index}.detail`
  const minimumPrice = priceData?.languagePairs?.[0]?.minimumPrice || null

  const {
    fields: details,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: itemName,
  })
  const { openModal, closeModal } = useModal()

  function appendDetail() {
    append({
      quantity: 0,
      priceUnit: '',
      unitPrice: 0,
      prices: 0,
      unit: '',
      currency: priceData?.currency ?? 'USD',
    })
  }

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

  function onDeletePriceUnit(idx: number, title: string) {
    openModal({
      type: 'delete-unit',
      children: (
        <DeleteConfirmModal
          message='Are you sure you want to delete this price unit?'
          title={title}
          onClose={() => closeModal('delete-unit')}
          onDelete={() => remove(idx)}
        />
      ),
    })
  }

  function getTotalPrice(isRefresh = false) {
    if (isRefresh) {
      trigger()
    }
    let total = 0
    const data = getValues(itemName)
    if (data?.length) {
      if (minimumPrice && showMinimum.show) {
        data.forEach(item => {
          total += item.unit === 'Percent' ? Number(item.prices) : 0
        })
        total += minimumPrice
      } else {
        data.forEach(item => {
          total += Number(item.prices)
        })
      }
    }

    setValue(`items.${index}.totalPrice`, total, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function getEachPrice(idx: number) {
    const data = getValues(itemName)
    if (!data?.length) return

    trigger()
    let prices = 0
    const detail = data?.[idx]
    if (detail && detail.unit === 'Percent') {
      const percentQuantity = data[idx].quantity
      if (minimumPrice && showMinimum.show) {
        prices = (percentQuantity / 100) * minimumPrice
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

    setValue(`items.${index}.detail.${idx}.prices`, prices, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function onItemBoxLeave() {
    const isMinimumPriceConfirmed =
      !!minimumPrice &&
      minimumPrice > getValues(`items.${index}.totalPrice`) &&
      showMinimum.checked

    const isNotMinimum =
      !minimumPrice || minimumPrice <= getValues(`items.${index}.totalPrice`)

    if (!isMinimumPriceConfirmed && !isNotMinimum) {
      setShowMinimum({ ...showMinimum, show: true })
      openModal({
        type: 'info-minimum',
        children: (
          <InfoConfirmModal
            onClose={() => {
              closeModal('info-minimum')
              setShowMinimum({ show: true, checked: true })
            }}
            message='The minimum price has been applied to the item(s).'
          />
        ),
      })
    }
    getTotalPrice(true)
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
                  onClick={appendDetail}
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
                  <IconButton onClick={() => getTotalPrice(true)}>
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

const HeaderCell = styled(TableCell)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  height: 20px;
  position: relative;
  text-transform: none;
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 0px;
    width: 2px;
    height: 30%;
    background: rgba(76, 78, 100, 0.12);
  }
`
