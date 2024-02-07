import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
} from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

import { CountryType } from '@src/types/sign/personalInfoTypes'
import { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { countries } from '@src/@fake-db/autocomplete'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { v4 as uuidv4 } from 'uuid'

import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  onClose: any
  onClick: (data?: {
    taxInvoiceDueAt: string | null
    taxInvoiceDueTimezone: CountryType | null
  }) => void
  contactPersonTimezone: CountryType | null
}

const ConfirmInvoiceModal = ({
  onClose,
  onClick,
  contactPersonTimezone,
}: Props) => {
  const [data, setData] = useState<{
    taxInvoiceDueAt: string | null
    taxInvoiceDueTimezone: CountryType | null
  }>({ taxInvoiceDueAt: null, taxInvoiceDueTimezone: contactPersonTimezone })

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

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
            <AlertIcon type={'successful'} />

            <Typography
              variant='body2'
              textAlign='center'
              mt='10px'
              sx={{ fontSize: '16px' }}
            >
              Are you sure you want to confirm this invoice? Please enter the
              due date for the tax invoice if needed.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: '24px',
              gap: '24px',
            }}
          >
            <FormControl fullWidth>
              <FullWidthDatePicker
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={30}
                selected={
                  data.taxInvoiceDueAt ? new Date(data?.taxInvoiceDueAt!) : null
                }
                dateFormat='MM/dd/yyyy h:mm aa'
                onChange={(date: Date) => {
                  setData({ ...data, taxInvoiceDueAt: date.toString() })
                }}
                customInput={
                  <CustomInput label='Tax invoice due date' icon='calendar' />
                }
                // popperPlacement='bottom-start'
              />
            </FormControl>

            <FormControl fullWidth>
              <Autocomplete
                autoHighlight
                fullWidth
                value={
                  !data.taxInvoiceDueTimezone
                    ? null
                    : data.taxInvoiceDueTimezone
                }
                options={timeZoneList as CountryType[]}
                onChange={(e, v) => {
                  setData({
                    ...data,
                    taxInvoiceDueTimezone: v as CountryType,
                  })
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
                    label='Time zone'
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              mt: '16px',
            }}
          >
            <Button variant='outlined' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' onClick={() => onClick(data)}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </DatePickerWrapper>
  )
}

export default ConfirmInvoiceModal

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
