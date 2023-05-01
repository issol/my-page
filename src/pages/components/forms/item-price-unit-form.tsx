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
import { Control, Controller, useFieldArray } from 'react-hook-form'

type Props = {
  control: Control<{ items: ItemType[] }, any>
  itemName: `items.${number}.detail`
  isValid: boolean
  parentData: ItemType
  priceData: StandardPriceListType | null
}

// ** TODO : priceId === NOT_APPLICABLE_PRICE 일 때 form도 제작하기
export default function ItemPriceUnitForm({
  control,
  itemName,
  isValid,
  parentData,
  priceData,
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
  //   console.log(priceData)
  function appendDetail() {
    append({
      quantity: 0,
      priceUnit: '',
      unitPrice: 0,
      prices: 0,
      unit: '',
      currency: 'USD',
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

  const [open, setOpen] = useState(false)
  const [priceUnit, setPriceUnit] = useState<NestedPriceUnitType | null>(null)

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
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell>
                  <Controller
                    name={`${itemName}.${idx}.quantity`}
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <TextField
                          placeholder='0'
                          type='number'
                          value={value}
                          sx={{ maxWidth: '80px', padding: 0 }}
                          inputProps={{ inputMode: 'decimal' }}
                          onChange={onChange}
                        />
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
                                    setPriceUnit(option)
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
                                      setPriceUnit(sub)
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
                          value={priceUnit}
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
                          //   type='number'
                          // ** TODO : decimal 등 옵션 적용해서 표기하기
                          value={value.toString()}
                          sx={{ maxWidth: '80px', padding: 0 }}
                          onChange={onChange}
                        />
                      )
                    }}
                  />
                </TableCell>
                <TableCell align='center'>currency</TableCell>
                <TableCell align='center'>
                  <Typography>00000</Typography>
                </TableCell>
                <TableCell align='center'>
                  <IconButton onClick={() => remove(idx)}>
                    <Icon icon='mdi:trash-outline' />
                  </IconButton>
                </TableCell>
              </TableRow>
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
