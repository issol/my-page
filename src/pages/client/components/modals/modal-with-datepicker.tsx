import { Box, Button, Typography, FormControl, Autocomplete } from '@mui/material'
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
import { SmallModalContainer } from './add-confirm-with-title-modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

import DatePicker from 'react-datepicker'
import { DateTimePickerDefaultOptions } from '@src/shared/const/datePicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

import { styled } from '@mui/system'
import { dateValue, formattedNow } from '@src/shared/helpers/date.helper'

import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  title: string
  message?: string
  iconType?: AlertType
  leftButtonName?: string
  rightButtonName?: string
  onClose: () => void
  onClick: ({
    paymentAt,
    paymentTimezone,
  }: {
    paymentAt: Date
    paymentTimezone: CountryType
  }) => void
  contactPersonTimezone: CountryType | null
}
export default function ModalWithDatePicker({
  message,
  title,
  iconType,
  leftButtonName,
  rightButtonName,
  onClose,
  onClick,
  contactPersonTimezone,
}: Props) {
  const [data, setData] = useState<{
    paymentAt: Date | null
    paymentTimezone: CountryType | null
  }>({ paymentAt: null, paymentTimezone: null })

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const handleDateChange = (date: Date) => {
    setData({ ...data, paymentAt: formattedNow(date) })
  }

  const handleTimezoneChange = (e: any) => {
    setData({ ...data, paymentTimezone: e.target.value })
  }

  useEffect(() => {
    const timezoneList = timezone.getValue()
    const filteredTimezone = timezoneList.map(list => {
      return {
        code: list.timezoneCode,
        label: list.timezone,
        phone: '',
      }
    })
    setTimeZoneList(filteredTimezone)
    // 사용자 타임존 설정
    setData({ paymentAt: formattedNow(new Date()), paymentTimezone: contactPersonTimezone })
  }, [timezone])

  return (
    <DatePickerWrapper>
      <Box
        sx={{
          maxWidth: '430px',
          width: '100%',
          background: '#ffffff',
          boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
          borderRadius: '10px',
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertIcon type={iconType ?? 'successful'} />
            <Typography variant='h6' textAlign='center'>
              {title}
            </Typography>
            {message ? <Typography variant='body1' textAlign='center' sx={{ color: '#8D8E9A' }}>{message}</Typography> : null}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: '24px',
              gap: '8px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '4px',
              }}
            >
              <Typography variant='subtitle1' sx={{ color: '#4C4E64', fontWeight: 'bold' }}>
                Payment Date
              </Typography>
              <Typography variant='subtitle1' sx={{ color: '#666CFF', fontWeight: 'bold' }}>
                *
              </Typography>
            </Box>
            <FormControl fullWidth>
              <FullWidthDatePicker
                {...DateTimePickerDefaultOptions}
                selected={ data.paymentAt ? data.paymentAt : formattedNow(new Date()) }
                onChange={(date: Date) => handleDateChange(date)}
                customInput={
                  <CustomInput
                    // label='Payment date *'
                    icon='calendar'
                  />
                }
              />
            </FormControl>

            <Box
              sx={{
                marginTop: '12px',
                display: 'flex',
                flexDirection: 'row',
                gap: '4px',
              }}
            >
              <Typography variant='subtitle1' sx={{ color: '#4C4E64', fontWeight: 'bold' }}>
                Time zone
              </Typography>
              <Typography variant='subtitle1' sx={{ color: '#666CFF', fontWeight: 'bold' }}>
                *
              </Typography>
            </Box>
            <FormControl fullWidth>
              <Autocomplete
                autoHighlight
                fullWidth
                value={
                  !data.paymentTimezone
                    ? null
                    : data.paymentTimezone
                }
                options={timeZoneList as CountryType[]}
                onChange={(e, v) => {
                  handleTimezoneChange(e)
                }}
                getOptionLabel={option =>
                  timeZoneFormatter(option, timezone.getValue()) ?? ''
                }
                renderOption={(props, option) => (
                  <Box component='li' {...props} key={uuidv4()}>
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Box>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    // label='Time zone *'
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>
        
          <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
            <Button
              fullWidth
              sx={{
                height: '42px',
              }}
              variant='outlined'
              onClick={onClose}
            >
              {leftButtonName ? leftButtonName : 'Cancel'}
            </Button>
            <Button
              fullWidth
              sx={{
                height: '42px',
              }}
              variant='contained'
              onClick={() => {
                onClick({
                  paymentAt: data.paymentAt!,
                  paymentTimezone: data.paymentTimezone!,
                })
                onClose()
              }}
              disabled={!data.paymentAt || !data.paymentTimezone}
            >
              {rightButtonName ? rightButtonName : 'Okay'}
            </Button>
          </Box>
        </Box>
      </Box>
    </DatePickerWrapper>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`

