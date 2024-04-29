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
import { styled } from '@mui/system'
import { v4 as uuidv4 } from 'uuid'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** types
import { Fragment, ReactNode, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'

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
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import {
  AreaOfExpertiseList,
  AreaOfExpertisePair,
} from '@src/shared/const/area-of-expertise/area-of-expertise'
import { DateTimePickerDefaultOptions } from '@src/shared/const/datePicker'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  QuotesProjectInfoAddNewType,
  QuotesProjectInfoFormType,
} from '@src/types/common/quotes.type'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { ClientFormType } from '@src/types/schema/client.schema'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { useMutation } from 'react-query'
import { addWorkName } from '@src/apis/common.api'
import dayjs from 'dayjs'

import { timezoneSelector } from '@src/states/permission'
import { getTimezonePin, setTimezonePin } from '@src/shared/auth/storage'
import PushPinIcon from '@mui/icons-material/PushPin'

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
  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

  const loadTimezonePin = ():
    | {
        id: number
        code: string
        label: string
        pinned: boolean
      }[]
    | null => {
    const storedOptions = getTimezonePin()
    return storedOptions ? JSON.parse(storedOptions) : null
  }

  useEffect(() => {
    if (timezoneList.length !== 0) return
    const zoneList = timezone.getValue()
    const loadTimezonePinned = loadTimezonePin()
    const filteredTimezone = zoneList.map((list, idx) => {
      return {
        id: idx,
        code: list.timezoneCode,
        label: list.timezone,
        pinned:
          loadTimezonePinned && loadTimezonePinned.length > 0
            ? loadTimezonePinned[idx].pinned
            : false,
      }
    })
    setTimezoneList(filteredTimezone)
  }, [timezone])

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

  function add30DaysAndSetTimeTo9AM(date: Date) {
    // 30일을 더합니다.
    date.setDate(date.getDate() + 30)

    // 시간을 오전 9시로 설정합니다.
    date.setHours(9, 0, 0, 0)

    return date
  }

  const defaultValue = { value: '', label: '' }

  const { openModal, closeModal } = useModal()
  const { data, isSuccess } = useGetWorkNameList(auth.getValue().user!.userId)

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    if (clientTimezone && timezoneList) {
      const timezoneLabel = clientTimezone.label
      const getClientTimezone = timezoneList.find(
        (zone) => zone.label === clientTimezone.label
      )
      ;[
        'quoteDate.timezone',
        'projectDueDate.timezone',
        'quoteDeadline.timezone',
        'quoteExpiryDate.timezone',
        'estimatedDeliveryDate.timezone',
      ].forEach((item: any) => {
        setValue(item, getClientTimezone, setValueOptions)
      })
    }
  }, [clientTimezone, timezoneList])

  useEffect(() => {
    if (isSuccess) {
      const sortedData = data
        .slice()
        .sort((a, b) => a.value.localeCompare(b.value))
      setWorkName(sortedData)
    }
  }, [isSuccess])

  useEffect(() => {
    onWorkNameInputChange(newWorkName)
  }, [newWorkName])

  useEffect(() => {
    if (
      getClientValue('contacts.timezone') &&
      !getValues('quoteDate.timezone') &&
      timezoneList.length > 0
    ) {
      const getUserTimezone = timezoneList.find(
        (zone) => zone.code === getClientValue('contacts.timezone')?.code
      ) ?? { id: undefined, code: '', label: '', pinned: false }
      setValue(
        'quoteDate.timezone',
        getUserTimezone,
        setValueOptions,
      )
    }
    if (getClientValue() && !getValues('quoteDate.date')) {
      setValue('quoteDate.date', formattedNow(new Date())!, setValueOptions)
    }
    if (!getValues('quoteExpiryDate.date')) {
      setValue(
        'quoteExpiryDate.date',
        add30DaysAndSetTimeTo9AM(formattedNow(new Date()))!,
        setValueOptions,
      )
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

  const handleTimezonePin = (option: {
    id: number | undefined;
    code: string;
    label: string;
    pinned: boolean;
  }) => {
    const newOptions = timezoneList.map((opt) =>
        opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt
    );
    setTimezoneList(newOptions)
    setTimezonePin(newOptions)
  }

  const pinSortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id; // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1; // 핀 상태에 따라 정렬
  });

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
                !field.value ? { id: undefined, code: '', label: '', pinned: false } : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={(event) => {
                        event.stopPropagation(); // 드롭다운이 닫히는 것 방지
                        handleTimezonePin(option)
                    }}
                    size="small"
                    style={{ color: option.pinned ? '#FFAF66' : undefined }} 
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
                    autoComplete='off'
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
                autoComplete='off'
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
              autoComplete='off'
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
                  setValue('genre', [], setValueOptions)
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
                  autoComplete='off'
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
                    autoComplete='off'
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
          name='genre'
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
                  <TextField
                    {...params}
                    autoComplete='off'
                    label='Area of expertise'
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
              selected={!value ? null : formattedNow(new Date(value))}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput
                  label='Quote deadline'
                  icon='calendar'
                  readOnly
                  value={value ? dateValue(formattedNow(new Date(value))) : ''}
                />
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
                !field.value ? { id: undefined, code: '', label: '', pinned: false } : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={(event) => {
                        event.stopPropagation(); // 드롭다운이 닫히는 것 방지
                        handleTimezonePin(option)
                    }}
                    size="small"
                    style={{ color: option.pinned ? '#FFAF66' : undefined }} 
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
            <Box
              sx={{
                '&:hover .react-datepicker__close-icon': {
                  right: '25px !important',
                  opacity: 0.7,
                },
                '& .react-datepicker__close-icon': {
                  right: '25px !important',
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                },
              }}
            >
              <FullWidthDatePicker
                {...DateTimePickerDefaultOptions}
                selected={!value ? null : formattedNow(new Date(value))}
                onChange={onChange}
                isClearable
                placeholderText='MM/DD/YYYY, HH:MM'
                customInput={
                  <CustomInput
                    label='Quote expiry date'
                    icon='calendar'
                    readOnly
                    value={
                      value ? dateValue(formattedNow(new Date(value))) : ''
                    }
                  />
                }
              />
            </Box>
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
                !field.value ? { id: undefined, code: '', label: '', pinned: false } : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={(event) => {
                        event.stopPropagation(); // 드롭다운이 닫히는 것 방지
                        handleTimezonePin(option)
                    }}
                    size="small"
                    style={{ color: option.pinned ? '#FFAF66' : undefined }} 
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
              selected={!value ? null : formattedNow(new Date(value))}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput
                  label='Estimated delivery date'
                  icon='calendar'
                  readOnly
                  value={value ? dateValue(formattedNow(new Date(value))) : ''}
                />
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
                !field.value ? { id: undefined, code: '', label: '', pinned: false } : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={(event) => {
                        event.stopPropagation(); // 드롭다운이 닫히는 것 방지
                        handleTimezonePin(option)
                    }}
                    size="small"
                    style={{ color: option.pinned ? '#FFAF66' : undefined }} 
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
              selected={!value ? null : formattedNow(new Date(value))}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <CustomInput
                  label='Project due date'
                  icon='calendar'
                  readOnly
                  value={value ? dateValue(formattedNow(new Date(value))) : ''}
                />
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
                !field.value ? { id: undefined, code: '', label: '', pinned: false } : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              disableClearable
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={(event) => {
                        event.stopPropagation(); // 드롭다운이 닫히는 것 방지
                        handleTimezonePin(option)
                    }}
                    size="small"
                    style={{ color: option.pinned ? '#FFAF66' : undefined }} 
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
                autoComplete='off'
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
