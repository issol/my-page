import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Popper,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** types
import {
  Fragment,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** fetch
import { useGetWorkNameList } from '@src/queries/client.query'

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
import { countries } from 'src/@fake-db/autocomplete'
import { QuotesStatus } from '@src/shared/const/status/statuses'
import { DateTimePickerDefaultOptions } from 'src/shared/const/datePicker'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  QuotesProjectInfoAddNewType,
  QuotesProjectInfoFormType,
} from '@src/types/common/quotes.type'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { ClientFormType } from '@src/types/schema/client.schema'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { useMutation } from 'react-query'
import { addWorkName } from '@src/apis/common.api'
import dayjs from 'dayjs'

type Props = {
  control: Control<QuotesProjectInfoAddNewType, any>
  setValue: UseFormSetValue<QuotesProjectInfoAddNewType>
  watch: UseFormWatch<QuotesProjectInfoAddNewType>
  errors: FieldErrors<QuotesProjectInfoAddNewType>
  clientTimezone?: CountryType | undefined | null
  getClientValue: UseFormGetValues<ClientFormType>
  getValues: UseFormGetValues<QuotesProjectInfoAddNewType>
}
export default function ProjectInfoForm({
  control,
  setValue,
  watch,
  errors,
  clientTimezone,
  getClientValue,
  getValues,
}: Props) {
  const [openPopper, setOpenPopper] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [workNameError, setWorkNameError] = useState(false)
  const [workName, setWorkName] = useState<{ value: string; label: string }[]>(
    [],
  )
  const auth = useRecoilValueLoadable(authState)

  const addWorkNameMutation = useMutation(
    (data: { clientId: number; value: string; label: string }) =>
      addWorkName(data),
  )
  const [newWorkName, setNewWorkName] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  const formattedNow = (now: Date) => {
    const minutes = now.getMinutes()

    const formattedMinutes =
      minutes % 30 === 0 ? minutes : minutes > 30 ? 0 : 30

    const formattedHours = minutes > 30 ? now.getHours() + 1 : now.getHours()
    const formattedTime = `${formattedHours}:${formattedMinutes
      .toString()
      .padStart(2, '0')}`
    const formattedDate = new Date(now)
    formattedDate.setHours(parseInt(formattedTime.split(':')[0]))
    formattedDate.setMinutes(parseInt(formattedTime.split(':')[1]))

    return formattedDate
  }

  const defaultValue = { value: '', label: '' }

  const { openModal, closeModal } = useModal()
  const { data, isSuccess } = useGetWorkNameList(auth.getValue().user!.userId)

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    if (clientTimezone) {
      ;[
        'projectDueDate.timezone',
        'quoteDeadline.timezone',
        'quoteExpiryDate.timezone',
        'estimatedDeliveryDate.timezone',
      ].forEach((item: any) => {
        setValue(item, clientTimezone, setValueOptions)
      })
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

  useEffect(() => {
    if (getClientValue() && !getValues('quoteDate.timezone')) {
      setValue(
        'quoteDate.timezone',
        getClientValue('contacts.timezone')!,
        setValueOptions,
      )
    }
    if (getClientValue() && !getValues('quoteDate.date')) {
      setValue('quoteDate.date', formattedNow(new Date())!, setValueOptions)
    }
  }, [getClientValue, getValues])

  function onWorkNameInputChange(name: string) {
    setWorkNameError(workName?.some(item => item.value === name) || false)
  }
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenPopper(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  function onAddWorkName() {
    openModal({
      type: 'add-work-name',
      children: (
        <AddConfirmModal
          message='Are you sure you want to add this work name?'
          title={newWorkName}
          onClose={() => closeModal('add-work-name')}
          onClick={() => {
            addWorkNameMutation.mutate(
              {
                clientId: getClientValue().clientId!,
                value: newWorkName,
                label: newWorkName,
              },
              {
                onSuccess: () => {
                  setWorkName(
                    workName?.concat({
                      value: newWorkName,
                      label: newWorkName,
                    }),
                  )
                  setNewWorkName('')
                  setIsAddMode(false)
                  setOpenPopper(false)
                  setValue('workName', newWorkName, setValueOptions)
                },
              },
            )
          }}
        />
      ),
    })
  }

  function renderErrorMsg(key: keyof QuotesProjectInfoFormType) {
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

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm A')
  }

  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name='quoteDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              placeholderText='MM/DD/YYYY, HH:MM'
              selected={!value ? null : formattedNow(new Date(value))}
              onChange={e => {
                console.log(e)

                onChange(e)
              }}
              customInput={
                <Box>
                  <CustomInput
                    label='Quote date*'
                    icon='calendar'
                    readOnly
                    value={
                      value ? dateValue(formattedNow(new Date(value))) : ''
                    }
                  />
                </Box>
              }
            />
          )}
        />
        {renderErrorMsg('quoteDate')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='quoteDate.timezone'
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
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone*'
                  error={Boolean(errors?.quoteDate?.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      {/* <Grid item xs={6}>
        <Controller
          name='status'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={QuotesStatus}
              onChange={(e, v) => {
                onChange(v?.value ?? '')
              }}
              value={
                !value
                  ? defaultValue
                  : QuotesStatus.find(item => item.value === value)
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
      </Grid> */}
      <Grid item xs={6} ref={containerRef}>
        <Controller
          name='workName'
          control={control}
          render={({ field: { value, onChange } }) => {
            const finedValue = workName.find(item => item.value === value) || {
              value: value,
              label: value,
            }
            return (
              <Autocomplete
                disableClearable={value ? false : true}
                // autoHighlight
                fullWidth
                options={workName || []}
                onChange={(e, v) => {
                  if (v) {
                    onChange(v?.value)
                    // setIsAddMode(false)
                    // setOpenPopper(false)
                  } else {
                    onChange(null)
                    // setIsAddMode(false)
                    // setOpenPopper(false)
                  }
                  // onChange(v?.value ?? '')
                  // setIsAddMode(false)
                  // setOpenPopper(false)
                }}
                value={
                  !value || !workName
                    ? defaultValue
                    : finedValue ?? defaultValue
                }
                PopperComponent={props => (
                  <>
                    <Popper
                      {...props}
                      sx={{
                        cursor: 'pointer',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0px 2px 10px 0px rgba(76, 78, 100, 0.22)',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 0',
                        }}
                        onMouseDown={() => setIsAddMode(true)}
                      >
                        <IconButton color='primary'>
                          <Icon icon='material-symbols:add-circle-outline' />
                        </IconButton>
                        <Typography variant='body2' color='primary'>
                          Add a new work name
                        </Typography>
                      </Box>
                      {props.children as ReactNode}
                    </Popper>
                  </>
                )}
                // PopperComponent={props => {
                //   const children = props.children as ReactNode
                //   return (
                //     <>
                //       {openPopper ? (
                //         <Box>
                //           {isAddMode ? null : (
                //             <Box>
                //               <Box
                //                 display='flex'
                //                 alignItems='center'
                //                 margin='4px 0'
                //                 onClick={() => setIsAddMode(true)}
                //               >
                //                 <IconButton color='primary'>
                //                   <Icon icon='material-symbols:add-circle-outline' />
                //                 </IconButton>
                //                 <Typography variant='body2' color='primary'>
                //                   Add a new work name
                //                 </Typography>
                //               </Box>
                //               <Box>{children}</Box>
                //             </Box>
                //           )}
                //         </Box>
                //       ) : null}
                //     </>
                //   )
                // }}
                renderInput={params => (
                  <TextField
                    {...params}
                    // onClick={() => setOpenPopper(!openPopper)}
                    error={Boolean(errors.workName)}
                    label='Work name'
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
              disableClearable={value || value !== '' ? false : true}
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
                  label='Category*'
                />
              )}
            />
          )}
        />
        {renderErrorMsg('category')}
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
                disableCloseOnSelect
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
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
                    error={Boolean(errors.serviceType)}
                    label='Service type*'
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} sx={{ mr: 2 }} />
                    {option.label}
                  </li>
                )}
              />
            )
          }}
        />
        {renderErrorMsg('serviceType')}
      </Grid>
      <Grid item xs={12}>
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
                disableCloseOnSelect
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
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
                  <TextField {...params} label='Area of expertise' />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox checked={selected} sx={{ mr: 2 }} />
                    {option.label}
                  </li>
                )}
              />
            )
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* Quote deadline */}
      <Grid item xs={6}>
        <Controller
          name='quoteDeadline.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : new Date(value)}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput label='Quote deadline' icon='calendar' />
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='quoteDeadline.timezone'
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
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
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
      {/* quote expiry date */}
      <Grid item xs={6}>
        <Controller
          name='quoteExpiryDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : new Date(value)}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput label='Quote expiry date' icon='calendar' />
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='quoteExpiryDate.timezone'
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
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
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
      {/* estimated delivery date */}
      <Grid item xs={6}>
        <Controller
          name='estimatedDeliveryDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : new Date(value)}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput label='Estimated delivery date' icon='calendar' />
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='estimatedDeliveryDate.timezone'
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
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
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
      {/* project due date */}
      <Grid item xs={6}>
        <Controller
          name='projectDueDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : new Date(value)}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput label='Project due date' icon='calendar' />
              }
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
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: '20px',
          }}
        >
          <Typography variant='h6'>Project description</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Controller
              name='showDescription'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value}
                  onChange={e => {
                    onChange(e.target.checked)
                  }}
                  checked={value}
                />
              )}
            />

            <Typography variant='body2'>
              Show project description to client
            </Typography>
          </Box>
        </Box>

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
                placeholder='Write down a project description.'
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
