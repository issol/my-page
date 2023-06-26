import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import Chip from '@src/@core/components/mui/chip'
import { getTypeList } from '@src/shared/transformer/type.transformer'
import {
  CompanyAddressFormType,
  CompanyInfoFormType,
  CompanyInfoType,
} from '@src/types/company/info'
import { Dispatch, SetStateAction } from 'react'
import { Control, Controller, FieldArrayWithId } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  companyInfo: CompanyInfoType
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  control: Control<
    {
      address: Array<CompanyAddressFormType>
    },
    any
  >
  isValid: boolean
  addressFields: FieldArrayWithId<
    {
      address: Array<CompanyAddressFormType>
    },
    'address',
    'id'
  >[]
  onClickCancel: (type: 'info' | 'address') => void
  onClickSave: (type: 'info' | 'address') => void
  onClickAddAddress: () => void
  onClickDeleteAddress: (id: string) => void
  isUpdatable: boolean
}

const CompanyInfoAddress = ({
  companyInfo,
  edit,
  setEdit,
  addressFields,
  control,
  isValid,
  onClickCancel,
  onClickSave,
  onClickAddAddress,
  onClickDeleteAddress,
  isUpdatable,
}: Props) => {
  const country = getTypeList('CountryCode')
  return (
    <Card sx={{ padding: '24px', mt: '20px' }}>
      {edit ? (
        <Box>
          {addressFields.map((item, idx) => {
            return (
              <Grid key={uuidv4()} container xs={12} spacing={4} mb='16px'>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='subtitle1' fontWeight={600}>
                      {(idx + 1).toString().padStart(2, '0')}.
                    </Typography>
                    {addressFields.length > 1 && (
                      <IconButton onClick={() => onClickDeleteAddress(item.id)}>
                        <Icon icon='mdi:trash-outline' />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`address.${idx}.name`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='Office name'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`address.${idx}.baseAddress`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='Street 1'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`address.${idx}.detailAddress`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='Street 2'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`address.${idx}.city`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='City'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`address.${idx}.state`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='State'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`address.${idx}.country`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={country}
                        onChange={(e, v) => {
                          console.log(v)
                          if (!v) {
                            onChange({ value: '', label: '' })
                          } else {
                            onChange(v)
                          }
                        }}
                        value={
                          !value
                            ? { value: '', label: '' }
                            : country.filter(
                                item => item.value === value.value,
                              )[0] || null
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Country'
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
                  <Controller
                    name={`address.${idx}.zipCode`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        value={value || ''}
                        onChange={onChange}
                        label='ZIP code'
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )
          })}
          <Button
            variant='contained'
            disabled={addressFields.length >= 2}
            onClick={onClickAddAddress}
            sx={{ p: 0.7, minWidth: 26 }}
          >
            <Icon icon='material-symbols:add' fontSize={18} />
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              mt: '24px',
            }}
          >
            <Button variant='outlined' onClick={() => onClickCancel('address')}>
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={() => onClickSave('address')}
              disabled={!isValid}
            >
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6'>Address</Typography>

            {isUpdatable && (
              <IconButton onClick={() => setEdit(true)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            )}
          </Box>
          <Box>
            <Divider />
            {addressFields &&
              addressFields?.map((value, index) => {
                return (
                  <Box
                    key={uuidv4()}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <Box sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        {value.name && (
                          <Chip
                            label={value.name}
                            rounded
                            color={
                              value.name === 'Korea office'
                                ? 'info'
                                : value.name === 'Japan office'
                                ? 'success'
                                : 'default'
                            }
                            skin='light'
                            sx={{ color: '#000' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          Street:
                        </Typography>
                        <Typography variant='subtitle2' fontSize={16}>
                          {value.baseAddress ?? '-'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          Street 2:
                        </Typography>
                        <Typography
                          variant='subtitle2'
                          fontSize={16}
                          fontWeight={400}
                        >
                          {value.detailAddress ?? '-'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          City:
                        </Typography>
                        <Typography variant='subtitle2' fontSize={16}>
                          {value.city ?? '-'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          State:
                        </Typography>
                        <Typography variant='subtitle2' fontSize={16}>
                          {value.state ?? '-'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          Country:
                        </Typography>
                        <Typography variant='subtitle2' fontSize={16}>
                          {(value.country && value.country.label) ?? '-'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight={600}>
                          ZIP code:
                        </Typography>
                        <Typography variant='subtitle2' fontSize={16}>
                          {value.zipCode ?? '-'}
                        </Typography>
                      </Box>
                    </Box>
                    {index === addressFields.length - 1 ? null : <Divider />}
                  </Box>
                )
              })}
          </Box>
        </>
      )}
    </Card>
  )
}

export default CompanyInfoAddress
