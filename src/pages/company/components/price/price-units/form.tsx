// ** react
import { Fragment, useEffect, useState } from 'react'

// ** mui
import { Button, Checkbox, IconButton, Switch } from '@mui/material'
import { Box } from '@mui/system'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

// ** const values
import { PriceUnits } from '@src/shared/const/price/price-unit'

// ** Third Party Imports
import { Controller, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  PriceFormType,
  priceUnitSchema,
} from '@src/types/schema/price-unit.schema'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** logger

// ** Components

// ** type
import {
  PriceUnitFormType,
  PriceUnitType,
} from '@src/types/common/standard-price'
import { CustomTableRow } from './table'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'

type Props = {
  data?: PriceUnitType
  mutation: (value: any, cancelFunction: void) => void
  showModal: (title: string, onAdd: () => void) => void
  onEditCancel?: () => void
  shouldDisabled?: boolean
}
export default function PriceUnitForm(props: Props) {
  const { mutation, showModal } = props
  const { openModal, closeModal } = useModal()

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
    formState: { errors, dirtyFields, isValid },
  } = useForm<PriceFormType>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(
      priceUnitSchema,
    ) as unknown as Resolver<PriceFormType>,
  })

  console.log("watch", watch('unit'))
  console.log("watch2", watch('title'))
  console.log("errors",errors,isValid)
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

  // ** Desc : sub price는 base price의 unit을 따라가야 하므로, base price의 unit이 변경되면 sub price자동 업데이트하는 코드
  useEffect(() => {
    updateSubPrice()
  }, [unit])

  function addSubPrice() {
    append({
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
    } else {
      resetSubPrice()
    }
  }

  function updateSubPrice() {
    if (subPrices.length) {
      subPrices.forEach((item, idx) => {
        update(idx, { ...item, unit: unit })
      })
    }
  }

  function resetSubPrice() {
    if (subPrices.length === 1) {
      update(0, { ...subPrices[0], title: '', weighting: null })
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
    const data = getValues()
    console.log(data)
    if (data.subPriceUnits?.length) {
      let finalForm: PriceUnitFormType = {
        ...data,
        sortingOrder: 0,
        subPriceUnits: data.subPriceUnits.map((item, idx) => {
          return {
            isActive: item.isActive,
            title: item.title,
            unit: item.unit,
            sortingOrder: idx + 1,
            weighting:
              typeof item.weighting === 'string'
                ? parseFloat(item.weighting!)
                : item.weighting,
          }
        }),
      }
      mutation(finalForm, onCancel())
    } else {
      delete data.subPriceUnits
      mutation({ ...data, sortingOrder: 0 }, onCancel())
    }
  }

  const [expend, setExpend] = useState(true)
  return (
    <Fragment>
      <CustomTableRow
        isDisabled={props?.shouldDisabled ? props.shouldDisabled : false}
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell component='th' scope='row'>
          <Controller
            name='isBase'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Checkbox
                name='base_price'
                onChange={(e, v) => {
                  if (!v) {
                    openModal({
                      type: 'CancelBasePriceModal',
                      children: (
                        <CustomModal
                          title='Are you sure you want to cancel the base price setting? The associated
                        price units will be deleted.'
                          leftButtonText='No'
                          rightButtonText='Cancel'
                          onClose={() => closeModal('CancelBasePriceModal')}
                          onClick={() => {
                            onCancelBasePrice()
                            closeModal('CancelBasePriceModal')
                          }}
                          vary='error'
                        />
                      ),
                    })
                  } else {
                    //@ts-ignore
                    setValue('weighting', 100, setValueOptions)
                    addSubPrice()
                    onChange(v)
                  }
                }}
                checked={value ?? false}
                // disabled={!isValid} // isValid가 동작하지 않아서 임시 조치
                disabled={Boolean(watch('title') === '') || Boolean(watch('unit') === '')}
              />
            )}
          />
          {props.data ? (
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setExpend(!expend)}
            >
              <Icon icon={expend ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
            </IconButton>
          ) : null}
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
                onChange={(e, v) => {
                  if (!v) onChange({ value: '', label: '' })
                  else onChange(v.value)
                }}
                value={
                  PriceUnits.filter(item => item.label === value)[0] || {
                    value: '',
                    label: '',
                  }
                }
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Fixed rate'
                    error={Boolean(errors.unit)}
                  />
                )}
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
                <Switch
                  checked={value}
                  onChange={e => {
                    if (subPrices.length && e.target.checked === false) {
                      subPrices?.map((item, idx) =>
                        setValue(`subPriceUnits.${idx}.isActive`, false),
                      )
                    }
                    onChange(e.target.checked)
                  }}
                />
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
              // isValid가 동작하지 않아서 임시 조치
              disabled={Boolean(watch('title') === '') || Boolean(watch('unit') === '')}
              onClick={onAddClick}
            >
              {props.data ? 'Save' : 'Add'}
            </Button>
          </Box>
        </TableCell>
      </CustomTableRow>
      {isBase ? (
        <Fragment>
          {expend
            ? subPrices?.map((item, idx) => {
                return (
                  <CustomTableRow
                    key={item.id}
                    isDisabled={
                      props?.shouldDisabled ? props.shouldDisabled : false
                    }
                  >
                    <TableCell></TableCell>
                    <TableCell>
                      <Box display='flex' alignItems='center' gap='8px'>
                        <Icon
                          icon='material-symbols:subdirectory-arrow-right'
                          opacity={0.7}
                        />
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
                      </Box>
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
                            value={
                              PriceUnits.filter(
                                item => item.label === field.value,
                              )[0]
                            }
                            renderInput={params => (
                              <TextField {...params} placeholder='Fixed rate' />
                            )}
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
                            <Switch
                              checked={value}
                              onChange={e => {
                                if (!getValues('isActive') && e.target.checked)
                                  setValue('isActive', e.target.checked)
                                onChange(e.target.checked)
                              }}
                            />
                          )}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box width='100%' display='flex' justifyContent='center'>
                        <IconButton onClick={() => removeSubPrice(item.id)}>
                          <Icon icon='mdi:trash-outline' />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </CustomTableRow>
                )
              })
            : null}

          <CustomTableRow
            // key={item.id}
            isDisabled={props?.shouldDisabled ? props.shouldDisabled : false}
          >
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
          </CustomTableRow>
        </Fragment>
      ) : (
        ''
      )}
    </Fragment>
  )
}
