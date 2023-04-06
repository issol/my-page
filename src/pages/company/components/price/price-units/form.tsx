// ** react
import { Fragment, ReactNode, useContext, useEffect, useState } from 'react'

// ** mui
import { Button, Checkbox, IconButton, Switch } from '@mui/material'
import { Box } from '@mui/system'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

// ** const values
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

// ** logger
import logger from '@src/@core/utils/logger'

// ** Components
import CancelModal from './modal/cancel-baseprice-modal'

// ** type
import { PriceUnitType } from '@src/apis/price-units.api'

/** TODO
 * onAdd에 api연결하기
 */

type Props = {
  data?: PriceUnitType
  mutation: (value: any) => void
  showModal: (title: string, onAdd: () => void) => void
  onEditCancel?: () => void
}

export default function PriceUnitForm(props: Props) {
  const { mutation, showModal } = props
  const { setModal } = useContext(ModalContext)

  const defaultValues = {
    isBase: false,
    title: '',
    subPriceUnits: [],
    unit: '',
    weighting: null,
    isActive: true,
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

  const {
    fields: subPrices,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'subPriceUnits',
  })

  const isBase = watch('isBase')
  const unit = watch('unit')
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    if (props.data) {
      const { data } = props
      reset(data)
    }
  }, [props?.data])

  console.log(errors)
  // ** Desc : sub price는 base price의 unit을 따라가야 하므로, base price의 unit이 변경되면 sub price자동 업데이트하는 코드
  useEffect(() => {
    updateSubPrice()
  }, [unit])

  function addSubPrice() {
    append({
      isSubPrice: true,
      title: getValues('title'),
      unit: unit,
      weighting: getValues('weighting'),
      isActive: true,
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
    setValue('weighting', null, setValueOptions)
    setValue('isBase', false, setValueOptions)
    remove()
  }

  function onCancel() {
    if (!props?.data) {
      reset()
      reset({ subPriceUnits: [] })
    } else {
      props?.onEditCancel && props.onEditCancel()
    }
  }

  function onAddClick() {
    showModal(getValues('title'), onAdd)
  }

  function onAdd() {
    logger.info(getValues())
    mutation(getValues())
  }

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component='th' scope='row'>
          <Controller
            name='isBase'
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
                    setValue('weighting', 100, setValueOptions)
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
            name='title'
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                fullWidth
                id='price-unit'
                error={Boolean(errors.title)}
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
        <TableCell align='left'>
          {!props?.data ? (
            ''
          ) : (
            <Controller
              name='isActive'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          )}
        </TableCell>
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
              {props.data ? 'Save' : 'Add'}
            </Button>
          </Box>
        </TableCell>
      </TableRow>
      {isBase ? (
        <Fragment>
          {subPrices?.map((item, idx) => {
            return (
              <TableRow key={item.id}>
                <TableCell></TableCell>
                <TableCell>
                  <Controller
                    name={`subPriceUnits.${idx}.title`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        error={Boolean(
                          errors.subPriceUnits?.length
                            ? errors?.subPriceUnits[idx]?.title?.message
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
                    name={`subPriceUnits.${idx}.unit`}
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
                    name={`subPriceUnits.${idx}.weighting`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id='weighting'
                        placeholder='-'
                        error={Boolean(
                          errors.subPriceUnits?.length
                            ? errors?.subPriceUnits[idx]?.weighting?.message
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
                <TableCell>
                  {!props?.data ? (
                    ''
                  ) : (
                    <Controller
                      name={`subPriceUnits.${idx}.isActive`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Switch checked={value} onChange={onChange} />
                      )}
                    />
                  )}
                </TableCell>
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
