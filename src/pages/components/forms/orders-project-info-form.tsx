import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** types
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import { Fragment, ReactNode, useEffect, useState } from 'react'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** fetch
import { useGetWorkNameList } from '@src/queries/pro-project/project.query'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import AddConfirmModal from '@src/pages/client/components/modals/add-confirm-with-title-modal'

// ** values
import { CategoryList } from '@src/shared/const/category/categories'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { ServiceTypePair } from '@src/shared/const/service-type/service-types'
import {
  AreaOfExpertisePair,
  AreaOfExpertiseList,
} from '@src/shared/const/area-of-expertise/area-of-expertise'
import { RevenueFrom } from '@src/shared/const/revenue-from'
import { countries } from 'src/@fake-db/autocomplete'
import { OrderStatus } from '@src/shared/const/status/statuses'
import { DateTimePickerDefaultOptions } from 'src/shared/const/datePicker'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'

type Props = {
  control: Control<OrderProjectInfoFormType, any>
  setValue: UseFormSetValue<OrderProjectInfoFormType>
  watch: UseFormWatch<OrderProjectInfoFormType>
  errors: FieldErrors<OrderProjectInfoFormType>
  clientTimezone?: CountryType | undefined
}
export default function ProjectInfoForm({
  control,
  setValue,
  watch,
  errors,
  clientTimezone,
}: Props) {
  const [openPopper, setOpenPopper] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [workNameError, setWorkNameError] = useState(false)
  const [workName, setWorkName] = useState<{ value: string; label: string }[]>(
    [],
  )
  const [newWorkName, setNewWorkName] = useState('')

  const defaultValue = { value: '', label: '' }

  const { openModal, closeModal } = useModal()
  const { data, isSuccess } = useGetWorkNameList()

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    if (clientTimezone) {
      setValue('projectDueDate.timezone', clientTimezone, setValueOptions)
    }
  }, [clientTimezone])

  useEffect(() => {
    if (isSuccess) {
      setWorkName(data)
    }
  }, [isSuccess])

  useEffect(() => {
    onWorkNameInputChange(newWorkName)
  }, [newWorkName])

  function onWorkNameInputChange(name: string) {
    setWorkNameError(workName?.some(item => item.value === name) || false)
  }

  function onAddWorkName() {
    openModal({
      type: 'add-work-name',
      children: (
        <AddConfirmModal
          message='Are you sure you want to add this work name?'
          title={newWorkName}
          onClose={() => closeModal('add-work-name')}
          onClick={() => {
            setWorkName(
              workName?.concat({ value: newWorkName, label: newWorkName }),
            )
            setNewWorkName('')
            setIsAddMode(false)
            setOpenPopper(false)
            setValue('workName', newWorkName, setValueOptions)
          }}
        />
      ),
    })
  }

  function renderErrorMsg(key: keyof OrderProjectInfoFormType) {
    return (
      <>
        {errors[key] && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors[key]?.message}
          </FormHelperText>
        )}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name='orderDate'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={new Date(value)}
              onChange={onChange}
              customInput={<CustomInput label='Order date*' />}
            />
          )}
        />
        {renderErrorMsg('orderDate')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='status'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={OrderStatus}
              onChange={(e, v) => {
                onChange(v?.value ?? '')
              }}
              value={
                !value
                  ? defaultValue
                  : OrderStatus.find(item => item.value === value)
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.status)}
                  label='Status*'
                  placeholder='Status*'
                />
              )}
            />
          )}
        />
        {renderErrorMsg('status')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='workName'
          control={control}
          render={({ field: { value, onChange } }) => {
            const finedValue = workName.find(item => item.value === value)
            return (
              <Autocomplete
                disableClearable
                autoHighlight
                fullWidth
                options={workName || []}
                onChange={(e, v) => {
                  onChange(v?.value ?? '')
                  setIsAddMode(false)
                  setOpenPopper(false)
                }}
                value={
                  !value || !workName
                    ? defaultValue
                    : finedValue ?? defaultValue
                }
                PopperComponent={props => {
                  const children = props.children as ReactNode
                  return (
                    <>
                      {openPopper ? (
                        <Box>
                          {isAddMode ? null : (
                            <Box>
                              <Box
                                display='flex'
                                alignItems='center'
                                margin='4px 0'
                                onClick={() => setIsAddMode(true)}
                              >
                                <IconButton color='primary'>
                                  <Icon icon='material-symbols:add-circle-outline' />
                                </IconButton>
                                <Typography variant='body2' color='primary'>
                                  Add a new work name
                                </Typography>
                              </Box>
                              <Box>{children}</Box>
                            </Box>
                          )}
                        </Box>
                      ) : null}
                    </>
                  )
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    onClick={() => setOpenPopper(!openPopper)}
                    error={Boolean(errors.workName)}
                    label='Work name'
                    placeholder='Work name'
                  />
                )}
              />
            )
          }}
        />
        {isAddMode ? (
          <Card>
            <CardContent>
              <TextField
                fullWidth
                error={workNameError}
                onChange={e => setNewWorkName(e.target.value)}
                value={newWorkName}
                label='Work name*'
                variant='outlined'
                sx={{ margin: '4px 0' }}
              />
              {workNameError ? (
                <FormHelperText sx={{ color: 'error.main' }}>
                  The same work name already exists
                </FormHelperText>
              ) : null}

              <Box display='flex' justifyContent='flex-end' gap='8px' mt='8px'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    setIsAddMode(false)
                    setOpenPopper(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  disabled={workNameError || !newWorkName}
                  onClick={onAddWorkName}
                >
                  Add
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : null}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='projectName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoFocus
              label='Project name*'
              variant='outlined'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
              error={Boolean(errors.projectName)}
            />
          )}
        />
        {renderErrorMsg('projectName')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='category'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={CategoryList}
              onChange={(e, v) => {
                if (!v) {
                  setValue('serviceType', [], setValueOptions)
                  setValue('expertise', [], setValueOptions)
                }
                onChange(v?.value ?? '')
              }}
              value={
                !value
                  ? defaultValue
                  : CategoryList.find(item => item.value === value)
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.category)}
                  label='Category'
                  placeholder='Category'
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='serviceType'
          control={control}
          render={({ field: { value, onChange } }) => {
            const category = watch('category') as keyof typeof ServiceTypePair
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                disabled={!category}
                multiple
                options={
                  !category || !ServiceTypePair[category]
                    ? ServiceTypeList
                    : ServiceTypePair[category]
                }
                onChange={(e, v) => {
                  onChange(v.map(item => item.value))
                }}
                value={ServiceTypeList.filter(item =>
                  value?.includes(item.value),
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Service type'
                    placeholder='Service type'
                  />
                )}
              />
            )
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='expertise'
          control={control}
          render={({ field: { value, onChange } }) => {
            const category = watch(
              'category',
            ) as keyof typeof AreaOfExpertisePair
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                disabled={!category}
                multiple
                options={
                  !category || !AreaOfExpertisePair[category]
                    ? AreaOfExpertiseList
                    : AreaOfExpertisePair[category]
                }
                onChange={(e, v) => {
                  onChange(v.map(item => item.value))
                }}
                value={AreaOfExpertiseList.filter(item =>
                  value?.includes(item.value),
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Area of expertise'
                    placeholder='Area of expertise'
                  />
                )}
              />
            )
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='revenueFrom'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                options={RevenueFrom}
                onChange={(e, v) => {
                  onChange(v?.value ?? '')
                }}
                value={
                  RevenueFrom.find(item => value?.includes(item.value)) || {
                    value: '',
                    label: '',
                  }
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.revenueFrom)}
                    label='Revenue from*'
                    placeholder='Revenue from*'
                  />
                )}
              />
            )
          }}
        />
        {renderErrorMsg('revenueFrom')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='projectDueDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : new Date(value)}
              onChange={onChange}
              customInput={<CustomInput label='Project due date' />}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='projectDueDate.timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              value={
                !field.value ? { code: '', phone: '', label: '' } : field.value
              }
              options={countries as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone*'
                  error={Boolean(errors?.projectDueDate?.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' mb='24px'>
          Project description
        </Typography>
        <Controller
          name='projectDescription'
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <TextField
                rows={4}
                multiline
                fullWidth
                error={Boolean(errors.projectDescription)}
                label='Write down a project description.'
                value={value ?? ''}
                onChange={onChange}
                inputProps={{ maxLength: 500 }}
              />
              <Typography variant='body2' mt='12px' textAlign='right'>
                {value?.length ?? 0}/500
              </Typography>
            </>
          )}
        />
      </Grid>
    </Fragment>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
