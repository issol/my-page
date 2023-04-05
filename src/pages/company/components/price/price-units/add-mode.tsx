// ** react
import { Fragment, useContext, useEffect, useState } from 'react'

// ** mui
import { Button, Checkbox, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { PriceUnits } from '@src/shared/const/price/price-unit'

// ** Third Party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  PriceFormType,
  priceUnitSchema,
} from '@src/types/schema/price-unit.schema'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ModalContext } from '@src/context/ModalContext'

//** Components

import logger from '@src/@core/utils/logger'
import CancelModal from './modal/cancel-baseprice-modal'
import AddModal from './modal/add-modal'

/** TODO
 * onAdd에 api연결하기
 */
export default function AddMode() {
  const { setModal } = useContext(ModalContext)

  const defaultValues = {
    isBasePrice: false,
    priceUnit: '',
    subPrice: [],
    unit: '',
    weighting: null,
  }

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<PriceFormType>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(priceUnitSchema),
  })
  console.log(errors)
  const {
    fields: subPrices,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'subPrice',
  })

  const isBasePrice = watch('isBasePrice')
  const unit = watch('unit')
  const settingOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    onCancel()
  }, [])

  // ** Desc : sub price는 base price의 unit을 따라가야 하므로, base price의 unit이 변경되면 sub price자동 업데이트하는 코드
  useEffect(() => {
    updateSubPrice()
  }, [unit])

  function addSubPrice() {
    append({
      isSubPrice: true,
      priceUnit: getValues('priceUnit'),
      unit: unit,
      weighting: getValues('weighting'),
    })
  }

  function removeSubPrice(id: string) {
    if (subPrices.length > 1) {
      const idx = subPrices.map(item => item.id).indexOf(id)
      idx !== -1 && remove(idx)
    }
  }

  function updateSubPrice() {
    if (subPrices.length) {
      subPrices.forEach((item, idx) => {
        update(idx, { ...item, unit: unit })
      })
    }
  }

  function onCancelBasePrice() {
    setValue('weighting', null, settingOptions)
    setValue('isBasePrice', false, settingOptions)
    remove()
  }

  function onCancel() {
    reset()
    reset({ subPrice: [] })
  }

  function onAddClick() {
    setModal(
      <AddModal
        title={getValues('priceUnit')}
        onAdd={onAdd}
        onClose={() => setModal(null)}
      />,
    )
  }

  function onAdd() {
    logger.info(getValues())
  }

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component='th' scope='row'>
          <Controller
            name='isBasePrice'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Checkbox
                name='base_price'
                onChange={(e, v) => {
                  if (!v) {
                    setModal(
                      <CancelModal
                        onCancelBasePrice={onCancelBasePrice}
                        onClose={() => setModal(null)}
                      />,
                    )
                  } else {
                    //@ts-ignore
                    setValue('weighting', 100, settingOptions)
                    addSubPrice()
                    onChange(v)
                  }
                }}
                checked={value ?? false}
                disabled={!isValid}
              />
            )}
          />
        </TableCell>
        <TableCell align='left'>
          <Controller
            name='priceUnit'
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                fullWidth
                id='price-unit'
                error={Boolean(errors.priceUnit)}
                placeholder='0-80 cuts'
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </TableCell>
        <TableCell align='left'>
          <Controller
            name='unit'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                sx={{ minWidth: 200 }}
                fullWidth
                options={PriceUnits}
                placeholder='Fixed rate'
                onChange={(e, v) => onChange(v?.value)}
                value={
                  PriceUnits.filter(item => item.label === value)[0] || {
                    value: '',
                    label: '',
                  }
                }
                getOptionLabel={option => option.label}
                renderInput={params => <TextField {...params} />}
              />
            )}
          />
        </TableCell>
        <TableCell align='left'>
          <Controller
            name='weighting'
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                id='weighing'
                placeholder='-'
                disabled
                value={value ?? ''}
                onChange={onChange}
                InputProps={{ type: 'number' }}
              />
            )}
          />
        </TableCell>
        <TableCell align='left'></TableCell>
        <TableCell align='left'>
          <Box display='flex' gap='10px'>
            <Button variant='outlined' onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant='contained'
              disabled={!isValid}
              onClick={onAddClick}
            >
              Add
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      {isBasePrice ? (
        <Fragment>
          {subPrices.length &&
            subPrices?.map((item, idx) => {
              return (
                <TableRow key={item.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <Controller
                      name={`subPrice.${idx}.priceUnit`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          error={Boolean(
                            errors.subPrice?.length
                              ? errors?.subPrice[idx]?.priceUnit?.message
                              : false,
                          )}
                          id='price-unit'
                          placeholder='0-80 cuts'
                          inputProps={{ maxLength: 100 }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`subPrice.${idx}.unit`}
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          sx={{ minWidth: 250 }}
                          {...field}
                          disabled
                          fullWidth
                          options={PriceUnits}
                          placeholder='Fixed rate'
                          value={
                            PriceUnits.filter(
                              item => item.label === field.value,
                            )[0]
                          }
                          renderInput={params => <TextField {...params} />}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`subPrice.${idx}.weighting`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          id='weighting'
                          placeholder='-'
                          error={Boolean(
                            errors.subPrice?.length
                              ? errors?.subPrice[idx]?.weighting?.message
                              : false,
                          )}
                          onChange={e => {
                            const value = e.target.value
                            if (value.length > 10) return
                            field.onChange(e.target.value)
                          }}
                          value={field.value ?? ''}
                          InputProps={{ type: 'number' }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Box width='100%' display='flex' justifyContent='center'>
                      <IconButton
                        onClick={() => removeSubPrice(item.id)}
                        disabled={!isValid}
                      >
                        <Icon icon='mdi:trash-outline' />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}

          <TableRow>
            <TableCell></TableCell>
            <TableCell colSpan={6}>
              <IconButton onClick={addSubPrice} disabled={!isValid}>
                <img
                  src='/images/signup/add-info-outline.png'
                  width={20}
                  alt='add job information'
                />
              </IconButton>
            </TableCell>
          </TableRow>
        </Fragment>
      ) : (
        ''
      )}
    </Fragment>
  )
}
