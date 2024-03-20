import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { Box, Grid, IconButton, TextField, Typography } from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { JobType } from '@src/types/common/item.type'
import { AddJobInfoFormType } from '@src/types/orders/job-detail'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import { Controller, Resolver, useForm } from 'react-hook-form'

type Props = {
  onClose: () => void
  statusList: {
    value: number
    label: string
  }[]
  jobInfo: JobType
}

const InfoEditModal = ({ onClose, statusList, jobInfo }: Props) => {
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    getValues,
    setValue,

    formState: { errors, dirtyFields, isValid },
  } = useForm<AddJobInfoFormType>({
    mode: 'onSubmit',

    resolver: yupResolver(addJobInfoFormSchema) as Resolver<AddJobInfoFormType>,
  })

  const onSubmit = () => {
    console.log('submit')
  }
  return (
    <Box
      sx={{
        maxWidth: '702px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E4E4',
          padding: '32px 20px',
        }}
      >
        <Typography fontSize={20} fontWeight={500}>
          Edit job info
        </Typography>
        <IconButton
          sx={{ padding: 0, height: 'fit-content' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
      </Box>

      <DatePickerWrapper sx={{ width: '100%', padding: '32px 20px 20px 20px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box className='filterFormControl'>
                <Controller
                  name='name'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      fullWidth
                      autoComplete='off'
                      value={value || ''}
                      onBlur={onBlur}
                      label='Job name*'
                      sx={{ height: '46px' }}
                      inputProps={{
                        style: {
                          height: '46px',
                          padding: '0 14px',
                        },
                      }}
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
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled
                autoComplete='off'
                id='status'
                label='Status*'
                fullWidth
                defaultValue={
                  statusList?.find(list => list.value === jobInfo.status)
                    ?.label!
                }
              />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </form>
      </DatePickerWrapper>
    </Box>
  )
}

export default InfoEditModal
