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
import { useState } from 'react'
import styled from 'styled-components'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { countries } from '@src/@fake-db/autocomplete'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'

type Props = {
  onClose: any
  onClick: (data?: {
    taxInvoiceDueAt: string | null
    taxInvoiceDueTimezone: CountryType | null
  }) => void
}

const ConfirmInvoiceModal = ({ onClose, onClick }: Props) => {
  const [data, setData] = useState<{
    taxInvoiceDueAt: string | null
    taxInvoiceDueTimezone: CountryType | null
  }>({ taxInvoiceDueAt: null, taxInvoiceDueTimezone: null })
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
                timeIntervals={15}
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
                options={countries as CountryType[]}
                onChange={(e, v) => {
                  setData({
                    ...data,
                    taxInvoiceDueTimezone: v as CountryType,
                  })
                }}
                getOptionLabel={option => getGmtTime(option.code)}
                renderOption={(props, option) => (
                  <Box component='li' {...props}>
                    {getGmtTime(option.code)}
                  </Box>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
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
