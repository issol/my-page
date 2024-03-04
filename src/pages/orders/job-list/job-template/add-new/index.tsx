import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { useGetServiceType } from '@src/queries/common.query'
import { JobTemplateFormType } from '@src/types/jobs/job-template.type'
import { JobTemplateFormSchema } from '@src/types/schema/job-template.shema'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, Resolver, useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const AddNewJobTemplate = () => {
  const router = useRouter()
  const { data: serviceTypeList, isLoading } = useGetServiceType()
  const { openModal, closeModal } = useModal()

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors, isValid, isSubmitted, touchedFields },
  } = useForm<JobTemplateFormType>({
    mode: 'onSubmit',
    defaultValues: {
      options: [
        {
          serviceTypeId: null,
          order: 0,
          autoNextJob: '1',
          statusCodeForAutoNextJob: 60500,
          autoSharingFile: '1',
        },
        {
          serviceTypeId: null,
          order: 1,
          autoNextJob: '0',
          statusCodeForAutoNextJob: 0,
          autoSharingFile: '0',
        },
      ],
    },
    resolver: yupResolver(
      JobTemplateFormSchema,
    ) as unknown as Resolver<JobTemplateFormType>,
  })

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'options',
  })

  const onClickSave = (data: JobTemplateFormType) => {
    console.log('hi')

    console.log(data)

    //TODO API 연결
    toast.success('Job template created successfully', {
      position: 'bottom-left',
    })
  }

  const onClickCancel = () => {
    openModal({
      type: 'JobTemplateCancel',
      children: (
        <CustomModal
          vary='error'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
                marginBottom: '16px',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Discard changes?
              </Typography>
              Are you sure you want to discard all changes?
            </Box>
          }
          rightButtonText='Discard'
          onClick={() => router.back()}
          onClose={() => closeModal('JobTemplateCancel')}
        />
      ),
    })
  }

  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          padding: '24px',
          // borderBottom: '1px solid #E0E0E0',
        }}
      >
        <IconButton onClick={() => router.back()}>
          <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
        </IconButton>
        <Typography
          variant='body1'
          fontSize={20}
          fontWeight={500}
          lineHeight='32px'
        >
          Create new job template
        </Typography>
        <IconButton sx={{ padding: 0 }}>
          <Icon icon='mdi:info-circle-outline' />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onClickSave)} style={{ height: '100%' }}>
        <Grid container xs={12} sx={{ height: '100%' }}>
          <Grid item xs={8}>
            <Box
              sx={{
                background: '#F2F2F2',
                height: '100%',
                padding: '24px 20px',

                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  width: '65%',
                }}
              >
                {fields.map((item, index) => {
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                      }}
                    >
                      <Card sx={{ padding: '10px 16px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '5px',
                              background: '#EDEDFF',
                            }}
                          >
                            <Icon
                              icon='solar:checklist-minimalistic-linear'
                              fontSize={21}
                              color='#666CFF'
                            />
                          </Box>

                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            component={'div'}
                          >
                            Job {index + 1}&nbsp;
                            <Typography component={'span'} color='#666CFF'>
                              *
                            </Typography>
                          </Typography>
                          <Box
                            sx={{
                              flexGrow: 1,
                              '.MuiFormControl-root, .MuiInputBase-root': {
                                height:
                                  (isSubmitted ||
                                    touchedFields.options?.[index]) &&
                                  !!errors.options?.[index]?.serviceTypeId
                                    ? 'auto'
                                    : '40px',
                              },
                              input: {
                                padding: '0 !important',
                              },
                            }}
                          >
                            <Controller
                              name={`options.${index}.serviceTypeId`}
                              control={control}
                              render={({ field, formState }) => {
                                const showError =
                                  formState.isSubmitted ||
                                  formState.touchedFields.options?.[index]
                                    ?.serviceTypeId
                                return (
                                  <Autocomplete
                                    {...field}
                                    sx={{ ml: 2 }}
                                    value={
                                      serviceTypeList?.find(
                                        value => value.value === field.value,
                                      ) || null
                                    }
                                    onChange={(e, data) => {
                                      if (data) {
                                        field.onChange(data.value)
                                      } else {
                                        field.onChange(null)
                                      }
                                    }}
                                    options={serviceTypeList || []}
                                    loading={isLoading}
                                    getOptionLabel={option => option.label}
                                    renderInput={params =>
                                      (
                                        <TextField
                                          {...params}
                                          autoComplete='off'
                                          // label='Service type'
                                          placeholder='Select service type'
                                          error={
                                            showError &&
                                            !!errors.options?.[index]
                                              ?.serviceTypeId
                                          }
                                          helperText={
                                            showError
                                              ? errors.options?.[index]
                                                  ?.serviceTypeId?.message
                                              : ''
                                          }
                                        />
                                      ) as any
                                    }
                                  />
                                )
                              }}
                            />
                          </Box>
                          {index > 1 ? (
                            <IconButton
                              sx={{ padding: 0 }}
                              onClick={() => remove(index)}
                              // onClick={onClose}
                            >
                              <Icon icon='mdi:close'></Icon>
                            </IconButton>
                          ) : null}
                        </Box>
                      </Card>
                      {fields.length - 1 === index ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px dashed #8D8E9A',
                            borderRadius: '10px',
                            padding: '18.5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            update(index, {
                              ...getValues().options[index],
                              autoNextJob: '1',
                              statusCodeForAutoNextJob: 60500,
                              autoSharingFile: '1',
                            })
                            append({
                              serviceTypeId: null,
                              order: index + 1,
                              autoNextJob: '0',
                              statusCodeForAutoNextJob: 0,
                              autoSharingFile: '0',
                            })
                          }}
                        >
                          <Typography
                            fontSize={14}
                            color='#666CFF'
                            fontWeight={500}
                          >
                            + Add next job
                          </Typography>
                        </Box>
                      ) : (
                        <Card
                          sx={{
                            background: '#F7F8FF',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '8px 16px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'center',
                              }}
                            >
                              <Image
                                src='/images/icons/job-icons/trigger.svg'
                                alt=''
                                width={24}
                                height={24}
                              />
                              <Box sx={{ display: 'flex', gap: '4px' }}>
                                <Typography fontSize={14} fontWeight={600}>
                                  Automatic trigger
                                </Typography>
                                <IconButton sx={{ padding: 0 }}>
                                  <Icon
                                    icon='mdi:info-circle-outline'
                                    fontSize={20}
                                  />
                                </IconButton>
                              </Box>
                            </Box>
                            <Controller
                              name={`options.${index}.autoNextJob`}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  checked={field.value === '1'}
                                  onChange={e =>
                                    field.onChange(e.target.checked ? '1' : '0')
                                  }
                                />
                              )}
                            />
                          </Box>
                          <Divider sx={{ margin: '0 !important' }} />
                          <Grid container xs={12} sx={{ padding: '10px 16px' }}>
                            <Grid item xs={7.4}>
                              <Box>
                                <Typography variant='body2' fontSize={14}>
                                  Automatically to the next task once the former
                                  is marked:
                                </Typography>
                                <Controller
                                  name={`options.${index}.statusCodeForAutoNextJob`}
                                  control={control}
                                  // defaultValue={60300}
                                  render={({ field }) => (
                                    <RadioGroup
                                      name='status'
                                      defaultValue='Delivered'
                                      row
                                    >
                                      <FormControlLabel
                                        value={field.value}
                                        control={<Radio />}
                                        onChange={(e, v) =>
                                          field.onChange(60400)
                                        }
                                        checked={field.value === 60400}
                                        label={'Partially delivered'}
                                      />
                                      <FormControlLabel
                                        value={field.value}
                                        onChange={(e, v) =>
                                          field.onChange(60500)
                                        }
                                        checked={field.value === 60500}
                                        control={<Radio />}
                                        label={'Delivered'}
                                      />
                                    </RadioGroup>
                                  )}
                                />
                              </Box>
                            </Grid>
                            <Divider orientation='vertical' flexItem />
                            <Grid item xs={4.5}>
                              <Box
                                sx={{
                                  paddingLeft: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '16px',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Image
                                    src='/images/icons/job-icons/file-share.svg'
                                    alt=''
                                    width={24}
                                    height={24}
                                  />
                                  <Typography
                                    fontSize={14}
                                    letterSpacing='0.15px'
                                  >
                                    Automatic file share
                                  </Typography>
                                  <IconButton sx={{ padding: 0 }}>
                                    <Icon
                                      icon='mdi:info-circle-outline'
                                      fontSize={20}
                                    />
                                  </IconButton>
                                </Box>
                                <Box>
                                  <Controller
                                    name={`options.${index}.autoSharingFile`}
                                    control={control}
                                    render={({ field }) => (
                                      <Switch
                                        checked={field.value === '1'}
                                        onChange={e =>
                                          field.onChange(
                                            e.target.checked ? '1' : '0',
                                          )
                                        }
                                      />
                                    )}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: 'flex',
                padding: '24px 20px',
                flexDirection: 'column',

                borderTop: '1px solid #E0E0E0',
                gap: '20px',
                height: '100%',
              }}
            >
              <Box
                sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
              >
                <Typography variant='body1' fontSize={14} fontWeight={600}>
                  Job template name
                  <Typography component={'span'} color='#666CFF'>
                    *
                  </Typography>
                </Typography>
                <Controller
                  name='name'
                  control={control}
                  render={({ field, formState }) => {
                    return (
                      <TextField
                        value={field.value}
                        error={!!errors.name && formState.isSubmitted}
                        helperText={
                          formState.isSubmitted ? errors.name?.message : ''
                        }
                        onChange={e => {
                          if (e.target.value) {
                            if (e.target.value.length <= 50) field.onChange(e)
                          } else {
                            field.onChange(null)
                          }
                        }}
                      />
                    )
                  }}
                />
              </Box>
              <Box
                sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}
              >
                <Typography variant='body1' fontSize={14} fontWeight={600}>
                  Description
                </Typography>
                <Controller
                  name='description'
                  control={control}
                  render={({ field, formState }) => {
                    return (
                      <TextField
                        multiline
                        maxRows={3}
                        rows={3}
                        onChange={e => {
                          if (e.target.value.length <= 500) {
                            field.onChange(e)
                            // setDescription(e.target.value)
                          }
                        }}
                      />
                    )
                  }}
                />

                <Typography
                  variant='body2'
                  fontSize={12}
                  textAlign='right'
                  color='#888'
                >
                  {/* {description.length}/500 */}
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
              >
                <Button fullWidth variant='outlined' onClick={onClickCancel}>
                  Cancel
                </Button>
                <Button fullWidth variant='contained' type='submit'>
                  Save
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Card>
  )
}

export default AddNewJobTemplate

AddNewJobTemplate.acl = {
  subject: 'job_list',
  action: 'read',
}
