// ** style components
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

// ** react hook form
import { Control, Controller, FieldErrors } from 'react-hook-form'

// ** helpers
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { FullDateHelper } from '@src/shared/helpers/date.helper'

// ** types
import { JobType } from '@src/types/common/item.type'

type Props = {
  control: Control<
    {
      name: string
      contactPersonId: number
    },
    any
  >
  errors: FieldErrors<{
    name: string
    contactPersonId: number
  }>
  row: JobType
  contactPersonList: Array<{ value: string; label: string; userId: number }>
}

const EditJobInfo = ({ control, errors, row, contactPersonList }: Props) => {
  return (
    <>
      <DatePickerWrapper sx={{ width: '100%' }}>
        <Grid container xs={12} spacing={6} mb='20px'>
          <Grid item xs={12}>
            <Controller
              name='name'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  value={value || ''}
                  onBlur={onBlur}
                  label='Job name*'
                  onChange={e => {
                    const { value } = e.target
                    if (value === '') {
                      onChange('')
                    } else {
                      const filteredValue = value.slice(0, 100)
                      e.target.value = filteredValue
                      onChange(e.target.value)
                    }
                  }}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.name?.message || errors.name?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth value={row.status} label='Status*' disabled />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name='contactPersonId'
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  fullWidth
                  onChange={(event, item) => {
                    if (item) {
                      onChange(item.userId)
                    } else {
                      onChange(null)
                    }
                  }}
                  value={
                    //value || { value: '', label: '', userId: 0 }
                    contactPersonList.find(person => person.userId === value) ||
                    null
                  }
                  options={contactPersonList}
                  id='contactPerson'
                  getOptionLabel={option => option.label || ''}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Contact person for job*'
                      error={Boolean(errors.contactPersonId)}
                    />
                  )}
                />
              )}
            />
            {errors.contactPersonId && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.contactPersonId?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled
              value={row.serviceType}
              label='Service type*'
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              label='Language pair*'
              value={`${languageHelper(row.sourceLanguage)} -> ${languageHelper(
                row.targetLanguage,
              )}`}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              label='Job start date'
              value={FullDateHelper(row.startedAt)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              value={getGmtTimeEng(row.startTimezone?.code)}
              label='Timezone'
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              value={FullDateHelper(row.dueAt)}
              label='Job due date*'
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              value={getGmtTimeEng(row.dueTimezone?.code)}
              label='Timezone*'
            />
          </Grid>
        </Grid>
        <Divider />
        <Box
          mt='20px'
          mb='20px'
          sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body1' fontWeight={600}>
              Job description
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox disabled checked={row.isShowDescription} />
              <Typography variant='body2'>
                Show job description to Pro
              </Typography>
            </Box>
          </Box>
          <Box>
            <TextField
              disabled
              multiline
              fullWidth
              rows={4}
              value={row.description}
              placeholder='Write down a job description.'
              id='textarea-standard-controlled'
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontSize: '12px',
              lineHeight: '25px',
              color: '#888888',
            }}
          >
            {row.description?.length ?? 0}/500
          </Box>
        </Box>
      </DatePickerWrapper>
    </>
  )
}

export default EditJobInfo
