import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { MouseEvent, useContext, useEffect, useRef } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import FallbackSpinner from '@src/@core/components/spinner'
import {
  createJobTemplate,
  deleteJobTemplate,
  editJobTemplate,
} from '@src/apis/jobs/job-template.api'
import useModal from '@src/hooks/useModal'
import { useGetServiceType } from '@src/queries/common.query'
import { useGetJobTemplateDetail } from '@src/queries/jobs/job-template.query'
import { JobTemplateFormType } from '@src/types/jobs/job-template.type'
import { JobTemplateFormSchema } from '@src/types/schema/job-template.shema'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Suspense, useState } from 'react'
import {
  Controller,
  FieldError,
  FieldErrors,
  Resolver,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { job_template } from '@src/shared/const/permission-class'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { FormErrors } from '@src/shared/const/formErrors'

const AddNewJobTemplate = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const mode = router.query.mode as string
  const id = router.query.id as string
  const { data: serviceTypeList, isLoading } = useGetServiceType()
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const auth = useRecoilValueLoadable(authState)
  const ability = useContext(AbilityContext)
  const { data: templateInfo, isLoading: templateInfoLoading } =
    useGetJobTemplateDetail(
      Number(id),
      mode === 'detail' || mode === 'edit' ? true : false,
    )
  const { openModal, closeModal } = useModal()
  const [formMode, setFormMode] = useState(mode)
  const errorRefs = useRef<(HTMLInputElement | null)[]>([])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const Writer = new job_template(templateInfo?.authorId!)
  const isUpdatable = ability.can('update', Writer)
  const isDeletable = ability.can('delete', Writer)

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    setError,
    setFocus,
    watch,
    reset,
    formState: { errors, isValid, isSubmitted, touchedFields, isDirty },
  } = useForm<JobTemplateFormType>({
    mode: 'onSubmit',

    resolver: yupResolver(
      JobTemplateFormSchema,
    ) as unknown as Resolver<JobTemplateFormType>,
  })

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const displayCustomToast = (message: string, vary: 'error' | 'success') => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // setSelectedUser(undefined)
        resolve('ok')
      }, 100)
    })

    return toast.promise(
      myPromise,
      {
        loading: <></>,
        success: (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography>{message}</Typography>

            <IconButton onClick={() => toast.dismiss()}>
              <Icon icon='mdi:close' />
            </IconButton>
          </Box>
        ),
        error: 'Error when fetching',
      },
      {
        position: 'bottom-left',
        style: {
          padding: '16px',
          width: '350px',
        },
        loading: {
          icon: '',
          style: {
            display: 'none',
          },
        },
        success: {
          icon:
            vary === 'success' ? (
              <Icon icon='mdi:check-circle' fontSize={24} color='#72E128' />
            ) : (
              <Icon icon='mdi:trash-can-circle' fontSize={24} color='#FF4D49' />
            ),
          duration: 1000 * 4,
          style: {
            width: '350px',
            justifyContent: 'flex-start',
          },
        },
        error: {
          style: {
            display: 'none',
          },
        },
      },
    )
  }

  const createMutation = useMutation(
    (data: JobTemplateFormType) => createJobTemplate(data),
    {
      onSuccess: data => {
        queryClient.invalidateQueries('jobTemplateList')
        router.replace(
          `/orders/job-list/job-template/form?mode=detail&id=${data.id}`,
        )

        displayCustomToast('Saved successfully.', 'success')
      },
      onError: (error: any) => {
        if (error.response.data.code === 'jobTemplate.create.duplicatedName') {
          setError(
            'name',
            {
              type: 'custom',
              message: 'Same name exists',
            },
            { shouldFocus: true },
          )
        }
      },
    },
  )

  const editMutation = useMutation(
    (data: { id: number; params: JobTemplateFormType }) =>
      editJobTemplate(data.id, data.params),
    {
      onSuccess: data => {
        queryClient.invalidateQueries('jobTemplateList')
        router.replace(
          `/orders/job-list/job-template/form?mode=detail&id=${data.id}`,
        )
        displayCustomToast('Saved successfully.', 'success')
      },
    },
  )

  const deleteMutation = useMutation((id: number) => deleteJobTemplate(id), {
    onSuccess: () => {
      closeModal('DeleteJobTemplate')
      queryClient.invalidateQueries('jobTemplateList')
      displayCustomToast('Deleted successfully.', 'error')
      router.replace('/orders/job-list/?tab=template')
    },
  })

  console.log(isDirty, getValues(), 'dirty')

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'options',
  })

  const onClickSave = (data: JobTemplateFormType) => {
    const params = {
      ...data,
      options: data.options.map((value, index) => {
        return {
          ...value,
          order: index,
        }
      }),
    }

    if (mode === 'create') {
      createMutation.mutate(params)
    } else if (mode === 'edit') {
      openModal({
        type: 'EditJobTemplate',
        children: (
          <CustomModal
            vary='successful'
            title={
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                }}
              >
                <Typography variant='body1' fontSize={20} fontWeight={500}>
                  Save changes?
                </Typography>
                Are you sure you want to save all changes?
              </Box>
            }
            rightButtonText='Save'
            onClick={() => {
              closeModal('EditJobTemplate')
              editMutation.mutate({ id: Number(id), params })
            }}
            onClose={() => closeModal('EditJobTemplate')}
          />
        ),
      })
    }
  }

  const onClickCancel = () => {
    if (!isDirty) {
      router.replace(
        mode === 'edit'
          ? `/orders/job-list/job-template/form?mode=detail&id=${id}`
          : '/orders/job-list/?tab=template',
      )
      return
    }
    openModal({
      type: 'JobTemplateCancel',
      children: (
        <CustomModal
          vary='error-alert'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                {mode === 'create' ? 'Discard draft?' : 'Discard changes?'}
              </Typography>
              {mode === 'create'
                ? 'Are you sure you want to discard the draft?'
                : 'Are you sure you want to discard all changes?'}
            </Box>
          }
          rightButtonText='Discard'
          onClick={() => {
            closeModal('JobTemplateCancel')
            router.replace(
              mode === 'edit'
                ? `/orders/job-list/job-template/form?mode=detail&id=${id}`
                : '/orders/job-list/?tab=template',
            )
          }}
          onClose={() => closeModal('JobTemplateCancel')}
        />
      ),
    })
  }

  const onClickJobTemplateHelpIcon = () => {
    openModal({
      type: 'JobTemplateHelp',
      isCloseable: true,
      children: (
        <CustomModal
          vary='info'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Job template
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                Job Template feature allows multiple related jobs to be created
                into a single template, enabling automatic notifications to the
                next assignee or sharing of files.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('JobTemplateHelp')}
          onClose={() => closeModal('JobTemplateHelp')}
        />
      ),
    })
  }

  const onClickAutoTriggerHelpIcon = () => {
    openModal({
      type: 'AutoTriggerHelp',
      isCloseable: true,
      children: (
        <CustomModal
          vary='info'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Automatic trigger
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                The automatic trigger is a job automation feature that enables
                the next assignee to receive automatic notifications of job
                initiation through preconfigured triggers without manual
                confirmation by the LPM.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('AutoTriggerHelp')}
          onClose={() => closeModal('AutoTriggerHelp')}
        />
      ),
    })
  }

  const onClickAutoFileShareHelpIcon = () => {
    openModal({
      type: 'AutoFileShareHelp',
      isCloseable: true,
      children: (
        <CustomModal
          vary='info'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Automatic file share
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                "Automatic file share" is an option where files previously
                worked on are automatically transferred to the next worker once
                the previous task is completed. The criteria for considering the
                previous task completed may vary depending on the automatic
                trigger.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('AutoFileShareHelp')}
          onClose={() => closeModal('AutoFileShareHelp')}
        />
      ),
    })
  }

  const onClickDeleteJobTemplate = () => {
    handleClose()
    openModal({
      type: 'DeleteJobTemplate',
      children: (
        <CustomModal
          vary='error-alert'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
                // marginBottom: '16px',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Delete job template?
              </Typography>
              The change will be applied not just to you, but whole team.
            </Box>
          }
          rightButtonText='Delete'
          onClick={() => deleteMutation.mutate(Number(id))}
          onClose={() => closeModal('DeleteJobTemplate')}
        />
      ),
    })
  }

  const onError = (errors: FieldErrors<JobTemplateFormType>) => {
    if (Object.keys(errors).includes('options')) {
      const firstErrorIndex = Object.keys(errors.options || {}).sort()[0]
      errorRefs.current[Number(firstErrorIndex)]?.focus()
      // setFocus('options')
      // return
    } else {
      const firstErrorName: keyof JobTemplateFormType = Object.keys(
        errors,
      )[0] as keyof JobTemplateFormType
      setFocus(firstErrorName)
      // trigger(firstErrorName)
    }

    // const firstErrorName: keyof JobTemplateFormType = Object.keys(
    //   errors,
    // )[0] as keyof JobTemplateFormType
    // console.log(firstErrorName)

    // setFocus(firstErrorName)
    // trigger(firstErrorName)
  }

  useEffect(() => {
    if (!router.isReady) return
    setFormMode(mode)
    if (mode === 'create') {
      setValue('options', [
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
      ])
    } else {
      if (templateInfo) {
        console.log(templateInfo)

        reset({
          name: templateInfo.name,
          description: templateInfo.description,
          options: templateInfo.options.map(value => ({
            serviceTypeId: value.serviceTypeId,
            order: value.order,
            autoNextJob: value.autoNextJob ? '1' : '0',
            statusCodeForAutoNextJob: value.statusCodeForAutoNextJob,
            autoSharingFile: value.autoSharingFile ? '1' : '0',
          })),
        })
      }
    }
  }, [mode, templateInfo])

  return (
    <Card sx={{ height: '100%' }}>
      <Suspense fallback={<FallbackSpinner />}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '24px',
            // borderBottom: '1px solid #E0E0E0',
            justifyContent:
              formMode === 'create' ? 'flex-start' : 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <Typography
              variant='body1'
              fontSize={20}
              fontWeight={500}
              lineHeight='32px'
            >
              {formMode === 'create'
                ? 'Create new job template'
                : formMode === 'edit'
                  ? 'Edit new job template'
                  : templateInfo?.name}
            </Typography>
            {formMode === 'create' ? (
              <IconButton
                sx={{ padding: 0 }}
                onClick={onClickJobTemplateHelpIcon}
              >
                <Icon icon='mdi:info-circle-outline' />
              </IconButton>
            ) : null}
          </Box>
          {formMode === 'detail' ? (
            <Box>
              <IconButton
                sx={{ width: '24px', height: '24px', padding: 0 }}
                onClick={handleClick}
              >
                <Icon icon='mdi:dots-horizontal' />
              </IconButton>
              <Menu
                elevation={8}
                anchorEl={anchorEl}
                id='customized-menu'
                onClose={handleClose}
                open={Boolean(anchorEl)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem
                  sx={{
                    gap: 2,
                    '&:hover': {
                      background: 'inherit',
                      cursor: 'default',
                    },
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: 0,
                  }}
                >
                  <Tooltip
                    title='Not authorized'
                    disableHoverListener={isUpdatable}
                  >
                    <Box>
                      <Button
                        fullWidth
                        startIcon={<Icon icon='mdi:pencil-outline' />}
                        disabled={!isUpdatable}
                        onClick={() => {
                          handleClose()

                          router.replace(
                            `/orders/job-list/job-template/form?mode=edit&id=${id}`,
                          )
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          color: 'rgba(76, 78, 100, 0.87)',
                          borderRadius: 0,
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Tooltip>
                </MenuItem>

                <MenuItem
                  sx={{
                    gap: 2,
                    '&:hover': {
                      background: 'inherit',
                      cursor: 'default',
                    },
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: 0,
                  }}
                >
                  <Tooltip
                    title='Not authorized'
                    disableHoverListener={isDeletable}
                  >
                    <Box>
                      <Button
                        startIcon={<Icon icon='mdi:trash-outline' />}
                        disabled={!isDeletable}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          color: '#FF4D49',
                          borderRadius: 0,
                        }}
                        onClick={onClickDeleteJobTemplate}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Tooltip>
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
        </Box>
        <form
          onSubmit={handleSubmit(onClickSave, onError)}
          style={{ height: '100%' }}
        >
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
                    width: '70%',
                    height: 'fit-content',
                    paddingLeft: '20px',
                    borderLeft: '3px solid #D8D8DD',
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
                              {mode === 'detail' ? (
                                `Job #${index + 1}`
                              ) : (
                                <>
                                  Job {index + 1}&nbsp;
                                  <Typography
                                    component={'span'}
                                    color='#666CFF'
                                  >
                                    *
                                  </Typography>
                                </>
                              )}
                            </Typography>
                            {mode === 'detail' ? (
                              <Box sx={{ ml: 2 }}>
                                <ServiceTypeChip
                                  size='small'
                                  label={
                                    serviceTypeList?.find(
                                      value =>
                                        value.value === item.serviceTypeId,
                                    )
                                      ? serviceTypeList.find(
                                          value =>
                                            value.value === item.serviceTypeId,
                                        )?.label
                                      : '-'
                                  }
                                />
                              </Box>
                            ) : (
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
                                  rules={{ required: FormErrors.required }}
                                  render={({ field, formState }) => {
                                    const showError = formState.isSubmitted

                                    return (
                                      <Autocomplete
                                        {...field}
                                        sx={{ ml: 2 }}
                                        value={
                                          serviceTypeList?.find(
                                            value =>
                                              value.value === field.value,
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
                                              // inputRef={field.ref}
                                              inputRef={ref => {
                                                errorRefs.current[index] = ref
                                              }}
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
                            )}

                            {index > 1 && mode !== 'detail' ? (
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
                          mode !== 'detail' ? (
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
                          ) : null
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
                                  <IconButton
                                    sx={{ padding: 0 }}
                                    onClick={onClickAutoTriggerHelpIcon}
                                  >
                                    <Icon
                                      icon='mdi:info-circle-outline'
                                      fontSize={20}
                                    />
                                  </IconButton>
                                </Box>
                              </Box>
                              {mode === 'detail' ? (
                                <Box
                                  sx={{
                                    padding: '3px 4px',
                                    borderRadius: '5px',
                                    background:
                                      item.autoNextJob === '1'
                                        ? '#EEFBE5'
                                        : '#E9EAEC',
                                  }}
                                >
                                  <Typography
                                    fontSize={13}
                                    color={
                                      item.autoNextJob === '1'
                                        ? '#6AD721'
                                        : '#BBBCC4'
                                    }
                                  >
                                    {item.autoNextJob === '1' ? 'On' : 'Off'}
                                  </Typography>
                                </Box>
                              ) : (
                                <Controller
                                  name={`options.${index}.autoNextJob`}
                                  control={control}
                                  render={({ field }) => {
                                    console.log(index)

                                    return (
                                      <Switch
                                        checked={field.value === '1'}
                                        onChange={e => {
                                          field.onChange(
                                            e.target.checked ? '1' : '0',
                                          )

                                          if (!e.target.checked) {
                                            setValue(
                                              `options.${index}.statusCodeForAutoNextJob`,
                                              0,
                                            )
                                            setValue(
                                              `options.${index}.autoSharingFile`,
                                              '0',
                                            )
                                          }
                                          trigger('options')
                                        }}
                                      />
                                    )
                                  }}
                                />
                              )}
                            </Box>
                            {getValues().options[index].autoNextJob === '1' && (
                              <>
                                <Divider sx={{ margin: '0 !important' }} />
                                <Grid
                                  container
                                  xs={12}
                                  sx={{ padding: '10px 16px' }}
                                >
                                  <Grid item xs={7.4}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                      }}
                                    >
                                      <Typography variant='body2' fontSize={14}>
                                        When the previous job is marked:
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
                                              disabled={mode === 'detail'}
                                              onChange={(e, v) =>
                                                field.onChange(60400)
                                              }
                                              checked={field.value === 60400}
                                              label={'Partially delivered'}
                                            />
                                            <FormControlLabel
                                              value={field.value}
                                              disabled={mode === 'detail'}
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
                                        <IconButton
                                          sx={{ padding: 0 }}
                                          onClick={onClickAutoFileShareHelpIcon}
                                        >
                                          <Icon
                                            icon='mdi:info-circle-outline'
                                            fontSize={20}
                                          />
                                        </IconButton>
                                      </Box>
                                      <Box>
                                        {mode === 'detail' ? (
                                          <Box
                                            sx={{
                                              padding: '3px 4px',
                                              borderRadius: '5px',
                                              width: 'fit-content',
                                              background:
                                                item.autoSharingFile === '1'
                                                  ? '#EEFBE5'
                                                  : '#E9EAEC',
                                            }}
                                          >
                                            <Typography
                                              fontSize={13}
                                              color={
                                                item.autoSharingFile === '1'
                                                  ? '#6AD721'
                                                  : '#BBBCC4'
                                              }
                                            >
                                              {item.autoSharingFile === '1'
                                                ? 'On'
                                                : 'Off'}
                                            </Typography>
                                          </Box>
                                        ) : (
                                          <Controller
                                            name={`options.${index}.autoSharingFile`}
                                            control={control}
                                            render={({ field }) => (
                                              <Switch
                                                checked={field.value === '1'}
                                                onChange={e =>
                                                  field.onChange(
                                                    e.target.checked
                                                      ? '1'
                                                      : '0',
                                                  )
                                                }
                                              />
                                            )}
                                          />
                                        )}
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </>
                            )}
                          </Card>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {mode === 'detail' ? (
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
                    sx={{
                      display: 'flex',
                      gap: '4px',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography fontSize={12} color='#8D8E9A'>
                      Creator
                    </Typography>
                    <Typography fontSize={14} color='#4C4E64'>
                      {templateInfo && templateInfo.author
                        ? `${getLegalName({
                            firstName: templateInfo?.author?.firstName,
                            lastName: templateInfo?.author?.lastName,
                            middleName: templateInfo?.author?.middleName,
                          })} (${templateInfo?.author?.email ?? '-'})`
                        : '-'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '4px',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography fontSize={12} color='#8D8E9A'>
                      Last updated
                    </Typography>
                    <Typography fontSize={14} color='#4C4E64'>
                      {templateInfo
                        ? convertTimeToTimezone(
                            templateInfo.updatedAt,
                            auth.getValue().user?.timezone,
                            timezone.getValue(),
                          )
                        : '-'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '4px',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography fontSize={12} color='#8D8E9A'>
                      Description
                    </Typography>
                    <Typography fontSize={14} color='#4C4E64'>
                      {templateInfo?.description || '-'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
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
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      flexDirection: 'column',
                    }}
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
                            inputRef={field.ref}
                            value={field.value}
                            error={!!errors.name && formState.isSubmitted}
                            helperText={
                              formState.isSubmitted ? errors.name?.message : ''
                            }
                            onChange={e => {
                              if (e.target.value) {
                                if (e.target.value.length <= 50)
                                  field.onChange(e)
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
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      flexDirection: 'column',
                    }}
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
                            value={field.value}
                            onChange={e => {
                              console.log(e.target.value)

                              if (e.target.value) {
                                if (e.target.value.length <= 500) {
                                  field.onChange(e)
                                  trigger('description')
                                  // setDescription(e.target.value)
                                }
                              } else {
                                field.onChange(null)
                                trigger('description')
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
                      {getValues('description')?.length || 0}/500
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      fullWidth
                      variant='outlined'
                      onClick={onClickCancel}
                    >
                      Cancel
                    </Button>
                    <Button fullWidth variant='contained' type='submit'>
                      {formMode === 'create' ? 'Save' : 'Save changes'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </form>
      </Suspense>
    </Card>
  )
}

export default AddNewJobTemplate

AddNewJobTemplate.acl = {
  subject: 'job_list',
  action: 'read',
}
