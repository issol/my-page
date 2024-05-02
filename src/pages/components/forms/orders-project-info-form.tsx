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
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

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
import { RevenueFrom } from '@src/shared/const/revenue-from'
import { DateTimePickerDefaultOptions } from '@src/shared/const/datePicker'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { ClientFormType } from '@src/types/schema/client.schema'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import dayjs from 'dayjs'
import { useMutation } from 'react-query'
import { addWorkName } from '@src/apis/common.api'

import { timezoneSelector } from '@src/states/permission'
import PushPinIcon from '@mui/icons-material/PushPin'
import { getTimezonePin, setTimezonePin } from '@src/shared/auth/storage'

type Props = {
  control: Control<OrderProjectInfoFormType, any>
  setValue: UseFormSetValue<OrderProjectInfoFormType>
  watch: UseFormWatch<OrderProjectInfoFormType>
  errors: FieldErrors<OrderProjectInfoFormType>
  clientTimezone?: CountryType | undefined | null
  getClientValue: UseFormGetValues<ClientFormType>
  getValues: UseFormGetValues<OrderProjectInfoFormType>
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
  const auth = useRecoilValueLoadable(authState)

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

  const [newWorkName, setNewWorkName] = useState('')

  const addWorkNameMutation = useMutation(
    (data: { clientId: number; value: string; label: string }) =>
      addWorkName(data),
  )

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
    if (clientTimezone && !getValues().projectDueTimezone && timezoneList.length > 0) {
      const timezoneLabel = clientTimezone.label
      const getClientTimezone = timezoneList.find(
        (zone) => zone.label === timezoneLabel
      ) ?? { id: undefined, code: '', label: '', pinned: false }
      setValue('projectDueTimezone', getClientTimezone, setValueOptions)
    }
  }, [clientTimezone, getValues, timezoneList])

  useEffect(() => {
    if (getClientValue() && !getValues('orderTimezone') && timezoneList.length > 0) {
      const timezoneLabel = getClientValue('contacts.timezone')?.label!
      const getContactsTimezone = timezoneList.find(
        (zone) => zone.label === timezoneLabel
      ) ?? { id: undefined, code: '', label: '', pinned: false }
      setValue(
        'orderTimezone',
        getContactsTimezone,
        setValueOptions,
      )
    }
  }, [getClientValue, getValues, timezoneList])

  useEffect(() => {
    if (isSuccess && data) {
      let result = data

      data.unshift({
        value: 'add',
        label: 'Add new a work name',
      })
      setWorkName(result)
    }
  }, [isSuccess, data])

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

                  setValue('workName', newWorkName, setValueOptions)
                },
              },
            )
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
          name='orderedAt'
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
                    label='Order date*'
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
        {renderErrorMsg('orderedAt')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='orderTimezone'
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
                  error={Boolean(errors?.orderTimezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ position: 'relative' }}>
          <Controller
            name='workName'
            control={control}
            render={({ field: { value, onChange } }) => {
              const finedValue = workName.find(
                item => item.value === value,
              ) || {
                value: value,
                label: value,
              }
              return (
                <Autocomplete
                  disableClearable={value ? false : true}
                  fullWidth
                  options={workName || []}
                  onChange={(e, v) => {
                    if (v) {
                      if (v.value === 'add') {
                        onChange(null)
                        setIsAddMode(true)
                      } else {
                        onChange(v?.value)
                      }
                    } else {
                      onChange(null)
                    }
                  }}
                  value={
                    !value || !workName
                      ? defaultValue
                      : finedValue ?? defaultValue
                  }
                  renderOption={(props, option) => {
                    if (option.value === 'add') {
                      return (
                        <li {...props} style={{ paddingLeft: 4 }}>
                          <IconButton color='primary'>
                            <Icon icon='material-symbols:add-circle-outline' />
                          </IconButton>
                          <Typography variant='body1' color='primary'>
                            Add a new work name
                          </Typography>
                        </li>
                      )
                    } else {
                      return <li {...props}>{option.label}</li>
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      // onClick={() => setOpenPopper(!openPopper)}
                      error={Boolean(errors.workName)}
                      label='Work name'
                      // placeholder='Work name'
                    />
                  )}
                />
              )
            }}
          />
          {isAddMode ? (
            <Card
              sx={{ position: 'absolute', top: 60, width: '100%', zIndex: 100 }}
            >
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

                <Box
                  display='flex'
                  justifyContent='flex-end'
                  gap='8px'
                  mt='8px'
                >
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      setIsAddMode(false)

                      setNewWorkName('')
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
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='projectName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
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
              fullWidth
              options={CategoryList}
              disableClearable={value ? false : true}
              onChange={(e, v) => {
                setValue('serviceType', [], setValueOptions)
                setValue('genre', [], setValueOptions)

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
                  label='Category'
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
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
                disableCloseOnSelect
                options={
                  !category || !ServiceTypePair[category]
                    ? ServiceTypeList
                    : ServiceTypePair[category]
                }
                limitTags={2}
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
                    label='Service type'
                    // placeholder='Service type'
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
      <Grid item xs={6}>
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
                disableCloseOnSelect
                fullWidth
                disabled={!category}
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
                multiple
                limitTags={2}
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
                    // placeholder='Area of expertise'
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
      <Grid item xs={6}>
        <Controller
          name='revenueFrom'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                fullWidth
                options={RevenueFrom.sort((a, b) =>
                  a.value > b.value ? 1 : b.value > a.value ? -1 : 0,
                )}
                onChange={(e, v) => {
                  onChange(v?.value ?? null)
                }}
                disableClearable={value ? false : true}
                value={
                  RevenueFrom.find(item => value?.includes(item.value)) || {
                    value: '',
                    label: '',
                  }
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    error={Boolean(errors.revenueFrom)}
                    label='Revenue from*'
                    // placeholder='Revenue from*'
                  />
                )}
              />
            )
          }}
        />
        {renderErrorMsg('revenueFrom')}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='projectDueAt'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : new Date(value)}
              onChange={onChange}
              placeholderText='MM/DD/YYYY, HH:MM'
              customInput={
                <Box>
                  <CustomInput
                    label='Project due date'
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
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='projectDueTimezone'
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
                  error={Boolean(errors?.projectDueTimezone)}
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
                autoComplete='off'
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
