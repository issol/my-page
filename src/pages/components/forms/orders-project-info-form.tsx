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
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** types
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import { ReactNode, useEffect, useState } from 'react'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { OrderStatus } from '@src/shared/const/status/statuses'
import { useGetWorkNameList } from '@src/queries/pro-project/project.query'
import useModal from '@src/hooks/useModal'
import AddConfirmModal from '@src/pages/client/components/modals/add-confirm-with-title-modal'

import { CategoryList } from '@src/shared/const/category/categories'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { ServiceTypePair } from '@src/shared/const/service-type/service-types'
import {
  AreaOfExpertisePair,
  AreaOfExpertiseList,
} from '@src/shared/const/area-of-expertise/area-of-expertise'
import { RevenueFrom } from '@src/shared/const/revenue-from'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { countries } from 'src/@fake-db/autocomplete'
import { getClientFormData } from '@src/shared/auth/storage'
type Props = {
  control: Control<OrderProjectInfoFormType, any>
  getValues: UseFormGetValues<OrderProjectInfoFormType>
  setValue: UseFormSetValue<OrderProjectInfoFormType>
  watch: UseFormWatch<OrderProjectInfoFormType>
  errors: FieldErrors<OrderProjectInfoFormType>
  isValid: boolean
  handleBack: () => void
  onNextStep: () => void
}
export default function ProjectInfoForm({
  control,
  getValues,
  setValue,
  watch,
  errors,
  isValid,
  handleBack,
  onNextStep,
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

  const clientData = getClientFormData()

  useEffect(() => {
    if (clientData) {
      if (clientData?.timezone) {
        setValue(
          'projectDueDate.timezone',
          clientData?.timezone!,
          setValueOptions,
        )
      }
    }
  }, [])

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
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Controller
            name='orderDate'
            control={control}
            render={({ field: { value, onChange } }) => (
              <FullWidthDatePicker
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                selected={new Date(value)}
                dateFormat='MM/dd/yyyy h:mm aa'
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

                <Box
                  display='flex'
                  justifyContent='flex-end'
                  gap='8px'
                  mt='8px'
                >
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => setIsAddMode(false)}
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
                    !category ? ServiceTypeList : ServiceTypePair[category]
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
                    !category
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
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                selected={!value ? null : new Date(value)}
                dateFormat='MM/dd/yyyy h:mm aa'
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
                value={field.value}
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
        <Grid item xs={12} display='flex' justifyContent='space-between'>
          <Button variant='outlined' color='secondary' onClick={handleBack}>
            <Icon icon='material-symbols:arrow-back-rounded' />
            Previous
          </Button>
          <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
            Next <Icon icon='material-symbols:arrow-forward-rounded' />
          </Button>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
