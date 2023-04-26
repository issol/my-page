import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popper,
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
import { ElementType, Fragment, ReactElement, ReactNode, useState } from 'react'

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
  const { data: workName, isLoading } = useGetWorkNameList()

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
  const [openPopper, setOpenPopper] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [workNameError, setWorkNameError] = useState(false)
  function onWorkNameInputChange(name: string) {
    setWorkNameError(workName?.some(item => item.value === name) || false)
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
                  if (!v) onChange({ value: '', label: '' })
                  else onChange(v.value)
                }}
                value={
                  !value
                    ? { value: '', label: '' }
                    : OrderStatus.find(item => item.value === value)
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    onClick={() => setOpenPopper(!openPopper)}
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
              console.log('value', value)
              return (
                <Autocomplete
                  disableClearable
                  autoHighlight
                  fullWidth
                  options={workName || []}
                  onChange={(e, v) => {
                    if (!v) onChange({ value: '', label: '' })
                    else onChange(v.value)
                  }}
                  value={
                    !value || !workName
                      ? { value: '', label: '' }
                      : workName.find(item => item.value === value)
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
                                >
                                  <IconButton
                                    color='primary'
                                    onClick={() => setIsAddMode(true)}
                                  >
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
                  onChange={e => onWorkNameInputChange(e.target.value)}
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
                    disabled={workNameError}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : null}
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
