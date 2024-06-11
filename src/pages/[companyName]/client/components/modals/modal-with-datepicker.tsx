import {
  Box,
  Button,
  Typography,
  FormControl,
  Autocomplete,
  IconButton,
} from '@mui/material'
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
import PushPinIcon from '@mui/icons-material/PushPin'
import { getTimezonePin, setTimezonePin } from '@src/shared/auth/storage'

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

  const handleDateChange = (date: Date) => {
    setData({ ...data, paymentAt: formattedNow(date) })
  }

  const handleTimezoneChange = (v: any) => {
    const selectedTimezone = timezoneList.find(zone => zone.label === v.label)
    if (!selectedTimezone) return
    setData({
      ...data,
      paymentTimezone: {
        label: selectedTimezone.label,
        code: selectedTimezone.code,
      },
    })
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
    // 사용자 타임존 설정
    setData({
      paymentAt: formattedNow(new Date()),
      paymentTimezone: contactPersonTimezone,
    })
  }, [timezone])

  const handleTimezonePin = (option: {
    id: number | undefined
    code: string
    label: string
    pinned: boolean
  }) => {
    const newOptions = timezoneList.map(opt =>
      opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt,
    )
    setTimezoneList(newOptions)
    setTimezonePin(newOptions)
  }

  const pinSortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1 // 핀 상태에 따라 정렬
  })

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
            {message ? (
              <Typography
                variant='body1'
                textAlign='center'
                sx={{ color: '#8D8E9A' }}
              >
                {message}
              </Typography>
            ) : null}
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
              <Typography
                variant='subtitle1'
                sx={{ color: '#4C4E64', fontWeight: 'bold' }}
              >
                Payment Date
              </Typography>
              <Typography
                variant='subtitle1'
                sx={{ color: '#666CFF', fontWeight: 'bold' }}
              >
                *
              </Typography>
            </Box>
            <FormControl fullWidth>
              <FullWidthDatePicker
                {...DateTimePickerDefaultOptions}
                selected={
                  data.paymentAt ? data.paymentAt : formattedNow(new Date())
                }
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
              <Typography
                variant='subtitle1'
                sx={{ color: '#4C4E64', fontWeight: 'bold' }}
              >
                Time zone
              </Typography>
              <Typography
                variant='subtitle1'
                sx={{ color: '#666CFF', fontWeight: 'bold' }}
              >
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
                    : timezoneList.find(
                        zone => zone.label === data.paymentTimezone?.label,
                      )!
                }
                options={pinSortedOptions}
                onChange={(e, v) => {
                  handleTimezoneChange(v)
                }}
                getOptionLabel={option =>
                  timeZoneFormatter(option, timezone.getValue()) ?? ''
                }
                renderOption={(props, option) => (
                  <Box
                    component='li'
                    {...props}
                    key={uuidv4()}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {timeZoneFormatter(option, timezone.getValue())}
                    </Typography>
                    <IconButton
                      onClick={event => {
                        event.stopPropagation() // 드롭다운이 닫히는 것 방지
                        handleTimezonePin(option)
                      }}
                      size='small'
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
