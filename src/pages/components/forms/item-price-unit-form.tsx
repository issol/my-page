// ** react
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
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

// ** value
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { languageType } from '@src/pages/orders/add-new'

import { v4 as uuidv4 } from 'uuid'
import useModal from '@src/hooks/useModal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import {
  PriceUnitListType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { defaultOption } from '../form-container/languages-and-items/languages-and-items-container'
import languageHelper from '@src/shared/helpers/language.helper'
import { ItemDetailType, ItemType } from '@src/types/common/item.type'
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from 'react-hook-form'
import {
  formatByRoundingProcedure,
  formatCurrency,
  getPrice,
} from '@src/shared/helpers/price.helper'
import UnitPriceInputField from './unit-price-input-field'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  itemName: `items.${number}.detail`
  isValid: boolean
  priceData: StandardPriceListType | null
  getValues: UseFormGetValues<{ items: ItemType[] }>
}

/* TODO : priceId === NOT_APPLICABLE_PRICE 일 때 form도 제작하기
price unit이 child까지 함께 선택 된 경우 form도 같이 append하기
unitPrice저장 시 priceFactor이 함께 계산된 금액이 저장되도록 하기

*/
export default function ItemPriceUnitForm({
  control,
  itemName,
  isValid,
  priceData,
  getValues,
}: Props) {
  const {
    fields: details,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: itemName,
  })

  const handleMaskedFieldClick = () => {
    const inputField: HTMLElement | null = document.getElementById(
      'priceUnitInputField',
    )
    if (inputField) inputField.focus()
  }

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
    subPriceUnits?: NestedPriceUnitType[]
    groupName: string
  }

  const nestSubPriceUnits = () => {
    const nestedData: Array<NestedPriceUnitType> = []
    if (priceData?.priceUnit.length) {
      const data = priceData?.priceUnit
      data.forEach(item => {
        if (item.parentPriceUnitId === null) {
          const parentItem = {
            ...item,
            subPriceUnits: [],
            groupName: 'Matching price unit',
          }
          nestedData.push(parentItem)
          data.forEach(subItem => {
            if (subItem.parentPriceUnitId === parentItem.priceUnitId) {
              // @ts-ignore
              parentItem.subPriceUnits.push(subItem)
            }
          })
        }
      })
    }

    return nestedData
  }

  function renderPrices(
    savedValue: ItemDetailType,
    currentPrice: number | string,
    priceFactor: number | null,
  ) {
    if (savedValue.unit === 'Percent') return '-'
    else {
      return formatCurrency(
        formatByRoundingProcedure(
          getPrice(Number(currentPrice) * savedValue.quantity, priceFactor),
          priceData?.decimalPlace!,
          priceData?.roundingProcedure!,
          savedValue.currency,
        ),
        savedValue.currency,
      )
    }
  }

  function Row({ idx }: { idx: number }) {
    const savedValue = getValues(`${itemName}.${idx}`)
    const [open, setOpen] = useState(false)
    const [currentPrice, setCurrentPrice] = useState<number | string>(
      savedValue.unitPrice,
    )
    const priceFactor = priceData?.languagePairs?.[0]?.priceFactor || null

    return (
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Controller
            name={`${itemName}.${idx}.quantity`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Box>
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
                priceData?.priceUnit?.find(item => item.title === value) || null
              return (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  options={options}
                  groupBy={option => option?.groupName}
                  getOptionLabel={option => option.title}
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
                              unitPrice: option.price ?? 0,
                            })
                          }}
                        >
                          {option.title}
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
                                unitPrice: sub.price ?? 0,
                              })
                            }}
                          >
                            <Icon
                              icon='material-symbols:subdirectory-arrow-right'
                              opacity={0.7}
                            />
                            {sub.title}
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
              const unitPrice = formatCurrency(
                formatByRoundingProcedure(
                  getPrice(value, priceFactor),
                  priceData?.decimalPlace!,
                  priceData?.roundingProcedure!,
                  savedValue.currency,
                ),
                savedValue.currency,
              )

              return (
                <UnitPriceInputField
                  onChange={onChange}
                  value={value}
                  savedValue={savedValue}
                  setCurrentPrice={setCurrentPrice}
                  unitPrice={unitPrice}
                />
              )
            }}
          />
        </TableCell>
        <TableCell align='center'>currency</TableCell>
        <TableCell align='center'>
          <Typography>
            {renderPrices(savedValue, currentPrice, priceFactor)}
          </Typography>
        </TableCell>
        <TableCell align='center'>
          <IconButton onClick={() => remove(idx)}>
            <Icon icon='mdi:trash-outline' />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Grid item xs={12}>
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
                  <Typography fontWeight='bold'>$ 123.123</Typography>
                  <IconButton>
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
