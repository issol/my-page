import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import Icon from 'src/@core/components/icon'

import useModal from '@src/hooks/useModal'
import { JobList } from '@src/shared/const/job/jobs'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import {
  AddNewLanguagePair,
  LanguagePairParams,
  StandardClientPriceListType,
} from '@src/types/common/standard-price'
import { languagePairSchema } from '@src/types/schema/price-unit.schema'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import LanguagePairActionModal from '../modal/language-pair-action-modal'
import { Input } from './set-price-unit-modal'
import { useMutation, useQueryClient } from 'react-query'
import { createLanguagePair } from '@src/apis/company-price.api'
import toast from 'react-hot-toast'

const defaultValues: AddNewLanguagePair = {
  pair: [{ source: '', target: '', priceFactor: null, minimumPrice: null }],
}

type Props = {
  onClose: any

  priceData: StandardClientPriceListType
}

const AddNewLanguagePairModal = ({ onClose, priceData }: Props) => {
  const { closeModal, openModal } = useModal()

  const languageList = getGloLanguage()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<AddNewLanguagePair>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(languagePairSchema),
  })

  const {
    fields: pairFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'pair',
  })

  const addLanguagePairMutation = useMutation(
    (data: LanguagePairParams[]) => createLanguagePair(data),
    {
      onSuccess: data => {
        // refetch()
        queryClient.invalidateQueries('standard-client-prices')

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const onSubmit = (data: AddNewLanguagePair) => {
    const res = data.pair.map(value => ({
      priceId: priceData.id,
      source: value.source,
      target: value.target,
      priceFactor: value.priceFactor,
      minimumPrice: value.minimumPrice,
      currency: priceData.currency,
    }))
    openModal({
      type: 'addLanguagePairModal',
      children: (
        <LanguagePairActionModal
          onClose={() => closeModal('addLanguagePairModal')}
          onClickAction={onClickAction}
          type='Add'
          data={res}
        />
      ),
    })
  }

  const removePair = (item: { id: string }) => {
    const idx = pairFields.map(item => item.id).indexOf(item.id)
    idx !== -1 && remove(idx)
  }

  const addPair = () => {
    if (pairFields.length >= 10) {
      openModal({
        type: 'MaximumPairModal',
        children: (
          <Box
            sx={{
              padding: '24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '14px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src='/images/icons/project-icons/status-alert-error.png'
                width={60}
                height={60}
                alt='role select error'
              />
              <Typography variant='body2'>
                You can select up to 10 at maximum.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
              <Button
                variant='contained'
                onClick={() => closeModal('MaximumPairModal')}
              >
                Okay
              </Button>
            </Box>
          </Box>
        ),
      })
      return
    }

    append({ source: '', target: '', priceFactor: null, minimumPrice: null })
  }

  const onChangePair = (
    id: string,
    value: any,
    item: 'source' | 'target' | 'priceFactor' | 'minimumPrice',
  ) => {
    const filtered = pairFields.filter(f => f.id! === id)[0]
    const index = pairFields.findIndex(f => f.id! === id)
    let newVal = { ...filtered, [item]: value }

    update(index, newVal)
    trigger('pair')
  }

  const onClickAction = (type: string, data?: LanguagePairParams[]) => {
    closeModal('setPriceUnitModal')
    if (type === 'Discard') {
      reset({
        pair: [
          { source: '', target: '', priceFactor: null, minimumPrice: null },
        ],
      })
    } else if (type === 'Add') {
      addLanguagePairMutation.mutate(data!)
    }
  }

  console.log(errors)

  // const handleUpdate = (index: number, values: any) => {
  //   pairFields
  //   update(index, values)
  // }

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='md'
    >
      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        <Typography variant='h5' sx={{ mb: '30px' }}>
          Add new language pair
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pairFields?.map((item, idx) => {
              return (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 4,
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {idx < 9 ? 0 : null}
                      {idx + 1}.
                    </Typography>
                    {pairFields.length > 1 && (
                      <IconButton
                        onClick={() => removePair(item)}
                        sx={{ padding: 1 }}
                      >
                        <Icon icon='mdi:delete-outline'></Icon>
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: '16px' }}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name={`pair.${idx}.source`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            // {...field}
                            value={languageList.find(
                              option => option.value === value || null,
                            )}
                            options={languageList}
                            // onChange={(e, v) => {
                            //   onChangePair(item.id, v?.value, 'source')
                            // }}
                            onChange={(event, newValue) => {
                              onChange(newValue ? newValue.value : null)
                              onChangePair(item.id, newValue?.value, 'source')
                            }}
                            renderOption={(props, option) => (
                              <Box component='li' {...props} key={props.id}>
                                {option.label}
                              </Box>
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Source*'
                                error={
                                  errors.pair?.length
                                    ? !!errors.pair[idx]?.source
                                    : false
                                }
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password',
                                }}
                              />
                            )}
                          />
                        )}
                      />
                      {errors.pair?.length
                        ? errors.pair[idx]?.source && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors?.pair[idx]?.source?.message}
                            </FormHelperText>
                          )
                        : ''}
                    </FormControl>
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name={`pair.${idx}.target`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            // {...field}
                            // value={
                            //   languageList.filter(
                            //     l => l.value === item.target,
                            //   )[0]
                            // }
                            value={languageList.find(
                              option => option.value === value || null,
                            )}
                            options={languageList}
                            // onChange={(e, v) => {
                            //   onChangePair(item.id, v?.value, 'target')
                            // }}
                            onChange={(event, newValue) => {
                              onChange(newValue ? newValue.value : null)
                              onChangePair(
                                item.id,
                                newValue ? newValue.value : null,

                                'target',
                              )
                            }}
                            renderOption={(props, option) => (
                              <Box component='li' {...props} key={props.id}>
                                {option.label}
                              </Box>
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Target*'
                                error={
                                  errors.pair?.length
                                    ? !!errors.pair[idx]?.target
                                    : false
                                }
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password',
                                }}
                              />
                            )}
                          />
                        )}
                      />

                      {errors.pair?.length
                        ? errors.pair[idx]?.target && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors?.pair[idx]?.target?.message}
                            </FormHelperText>
                          )
                        : ''}
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', gap: '16px' }}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name={`pair.${idx}.priceFactor`}
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Input
                            // type='number'
                            id='icons-start-adornment'
                            label='Price factor*'
                            value={value}
                            // onBlur={e => {
                            //   onChangePair(
                            //     item.id,
                            //     e.target.value,
                            //     'priceFactor',
                            //   )
                            // }}
                            onChange={e => {
                              const { value } = e.target
                              if (value === '') {
                                onChange(null)
                              } else {
                                const filteredValue = value
                                  .replace(
                                    /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                    '',
                                  )
                                  .slice(0, 10)
                                e.target.value = filteredValue
                                onChange(e.target.value)
                              }
                            }}
                            onBlur={e =>
                              onChangePair(
                                item.id,
                                e.target.value,
                                'priceFactor',
                              )
                            }
                            error={
                              errors.pair?.length
                                ? !!errors.pair[idx]?.priceFactor
                                : false
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  {priceData.currency === 'USD'
                                    ? '($ USD)'
                                    : priceData.currency === 'KRW'
                                    ? '(₩ KRW)'
                                    : priceData.currency === 'JPY'
                                    ? '(¥ JPY)'
                                    : priceData.currency === 'SGD'
                                    ? '($ SGD)'
                                    : '-'}
                                </InputAdornment>
                              ),
                              // inputProps: {
                              //   maxLength: 10,
                              //   type: 'number',
                              //   pattern: '[0-9]*',
                              // },
                            }}
                          />
                        )}
                      />

                      {errors.pair?.length
                        ? errors.pair[idx]?.priceFactor && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors?.pair[idx]?.priceFactor?.message}
                            </FormHelperText>
                          )
                        : ''}
                    </FormControl>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name={`pair.${idx}.minimumPrice`}
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                          <Input
                            // type='number'
                            id='icons-start-adornment'
                            label='Minimum price per item'
                            value={value}
                            // onBlur={e => {
                            //   onChangePair(
                            //     item.id,
                            //     e.target.value,
                            //     'minimumPrice',
                            //   )
                            // }}
                            onChange={e => {
                              const { value } = e.target
                              if (value === '') {
                                onChange(null)
                              } else {
                                const filteredValue = value
                                  .replace(
                                    /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                    '',
                                  )
                                  .slice(0, 10)
                                e.target.value = filteredValue
                                onChange(e.target.value)
                              }
                            }}
                            onBlur={e => {
                              const { value } = e.target
                              if (value === '') {
                                onChangePair(item.id, null, 'minimumPrice')
                              } else {
                                const filteredValue = value
                                  .replace(
                                    /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                    '',
                                  )
                                  .slice(0, 10)
                                e.target.value = filteredValue
                                onChangePair(
                                  item.id,
                                  e.target.value,
                                  'minimumPrice',
                                )
                              }
                            }}
                            inputProps={{ maxLength: 10 }}
                            error={
                              errors.pair?.length
                                ? !!errors.pair[idx]?.minimumPrice
                                : false
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  {priceData.currency === 'USD'
                                    ? '($ USD)'
                                    : priceData.currency === 'KRW'
                                    ? '(₩ KRW)'
                                    : priceData.currency === 'JPY'
                                    ? '(¥ JPY)'
                                    : priceData.currency === 'SGD'
                                    ? '($ SGD)'
                                    : '-'}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />

                      {errors.pair?.length
                        ? errors.pair[idx]?.minimumPrice && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors?.pair[idx]?.minimumPrice?.message}
                            </FormHelperText>
                          )
                        : ''}
                    </FormControl>
                  </Box>
                </Box>
              )
            })}
            <Box>
              <IconButton
                onClick={() => addPair()}
                color='primary'
                disabled={pairFields.some(item => {
                  return !item.priceFactor || !item.target || !item.source
                })}
                sx={{ padding: 0 }}
              >
                <Icon icon='mdi:plus-box' width={26}></Icon>
              </IconButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
              }}
            >
              <Button
                variant='outlined'
                onClick={() =>
                  openModal({
                    type: 'discardLanguagePairModal',
                    children: (
                      <LanguagePairActionModal
                        onClose={() => closeModal('discardLanguagePairModal')}
                        onClickAction={onClickAction}
                        type='Discard'
                      />
                    ),
                  })
                }
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                type='submit'
                disabled={pairFields.some(item => {
                  return !item.priceFactor || !item.target || !item.source
                })}
              >
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewLanguagePairModal
