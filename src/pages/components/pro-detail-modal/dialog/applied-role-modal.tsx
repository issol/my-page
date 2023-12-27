import Image from 'next/image'
import {
  SyntheticEvent,
  useContext,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { ModalContext } from 'src/context/ModalContext'
import InputLabel from '@mui/material/InputLabel'
import Icon from 'src/@core/components/icon'
import {
  AddRoleType,
  AssignReviewerType,
  RoleSelectType,
  SelectType,
} from 'src/types/onboarding/list'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import FormControl from '@mui/material/FormControl'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import {
  Control,
  FieldArrayWithId,
  FieldErrorsImpl,
  Controller,
  UseFormGetValues,
  UseFormHandleSubmit,
  useForm,
  useFieldArray,
} from 'react-hook-form'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { JobList } from 'src/shared/const/job/jobs'
import {
  AssignJobType,
  OnboardingListRolePair,
  ProRolePair,
} from 'src/shared/const/role/roles'
import FormHelperText from '@mui/material/FormHelperText'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Checkbox, FormControlLabel } from '@mui/material'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import _ from 'lodash'
import { Job } from '@src/shared/const/job/job.enum'
import useModal from '@src/hooks/useModal'
import { checkDuplicate } from '@src/apis/onboarding.api'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { checkDuplicateResponseEnum } from '@src/types/onboarding/details'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { assignTestSchema } from '@src/types/schema/onboarding.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormErrors } from '@src/shared/const/formErrors'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    minHeight: 38,
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))

const defaultValues: AddRoleType = {
  jobInfo: [
    {
      jobType: { value: '', label: '' },
      role: { value: '', label: '', jobType: [] },
      source: { value: '', label: '' },
      target: { value: '', label: '' },
    },
  ],
}

type Props = {
  onClose: any

  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
  handleAssignTest: (jobInfo: AddRoleType) => void
  handleAssignRole: (jobInfo: AddRoleType) => void
  proId: number
}
export default function AppliedRoleModal({
  onClose,

  languageList,

  proId,
  handleAssignTest,
  handleAssignRole,
}: Props) {
  const [lastCalledJobInfo, setLastCalledJobInfo] = useState<{
    jobType: { value: string; label: string }
    role: { value: string; label: string; jobType: string[] }
    source: { value: string; label: string } | null
    target: { value: string; label: string } | null
  } | null>(null)

  const [lastCalledRoleJobInfo, setLastCalledRoleJobInfo] = useState<{
    jobType: { value: string; label: string }
    role: { value: string; label: string; jobType: string[] }
    source: { value: string; label: string } | null
    target: { value: string; label: string } | null
  } | null>(null)

  const [jobTypeOptions, setJobTypeOptions] = useState<
    Array<{
      index: number
      data: SelectType[]
    }>
  >([{ index: 0, data: JobList }])
  const [roleOptions, setRoleOptions] = useState<
    Array<{
      index: number
      data: RoleSelectType[]
    }>
  >([{ index: 0, data: OnboardingListRolePair }])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors, dirtyFields, isValid: isTestValid, isDirty },
  } = useForm<AddRoleType>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(assignTestSchema),
  })

  const {
    control: roleControl,
    handleSubmit: handleRoleSubmit,
    reset: roleReset,
    watch: roleWatch,
    trigger: roleTrigger,
    getValues: roleGetValues,
    formState: { errors: roleErrors, isValid: isRoleValid },
  } = useForm<AddRoleType>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(assignTestSchema),
  })

  console.log(isRoleValid)
  console.log(roleGetValues())

  const {
    fields: jobInfoFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'jobInfo',
  })

  const {
    fields: roleJobInfoFields,
    append: roleAppend,
    remove: roleRemove,
    update: roleUpdate,
  } = useFieldArray({
    control: roleControl,
    name: 'jobInfo',
  })
  const lastCalledIndex = useRef(-1)
  const lastCalledIndexRole = useRef(-1)

  const [value, setValue] = useState<string>('1')
  const { openModal, closeModal } = useModal()
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setJobTypeOptions([{ index: 0, data: JobList }])
    setRoleOptions([{ index: 0, data: OnboardingListRolePair }])
    setValue(newValue)
  }

  // const onChangeJobInfo = (
  //   id: string,
  //   value: any,
  //   item: 'jobType' | 'role' | 'source' | 'target',
  //   type: string,
  // ) => {
  //   if (type === 'test') {
  //     const filtered = jobInfoFields.filter(f => f.id! === id)[0]
  //     const index = jobInfoFields.findIndex(f => f.id! === id)
  //     let newVal = { ...filtered, [item]: value }
  //     if (item === 'role' && (value === 'DTPer' || value === 'DTP QCer')) {
  //       newVal = { ...filtered, [item]: value, source: '', target: '' }
  //     }
  //     if (JSON.stringify(newVal) !== JSON.stringify(filtered)) {
  //       update(index, newVal)
  //     }
  //   } else if (type === 'role') {
  //     const filtered = roleJobInfoFields.filter(f => f.id! === id)[0]
  //     const index = roleJobInfoFields.findIndex(f => f.id! === id)
  //     let newVal = { ...filtered, [item]: value }
  //     if (item === 'role' && (value === 'DTPer' || value === 'DTP QCer')) {
  //       newVal = { ...filtered, [item]: value, source: '', target: '' }
  //     }
  //     if (JSON.stringify(newVal) !== JSON.stringify(filtered)) {
  //       roleUpdate(index, newVal)
  //     }
  //   }
  // }

  const addJobInfo = (type: string) => {
    if (jobInfoFields.length >= 10 || roleJobInfoFields.length >= 10) {
      openModal({
        type: 'ExceedMaxJobInfoModal',
        children: (
          <CustomModal
            title='You can select up to 10 at maximum.'
            vary='error'
            onClick={() => closeModal('ExceedMaxJobInfoModal')}
            onClose={() => closeModal('ExceedMaxJobInfoModal')}
            soloButton
            rightButtonText='Okay'
          />
        ),
      })

      return
    }
    type === 'test'
      ? append({
          jobType: { value: '', label: '' },
          role: { value: '', label: '', jobType: [] },
          source: { value: '', label: '' },
          target: { value: '', label: '' },
        })
      : roleAppend({
          jobType: { value: '', label: '' },
          role: { value: '', label: '', jobType: [] },
          source: { value: '', label: '' },
          target: { value: '', label: '' },
        })

    setJobTypeOptions(prevOptions => {
      // Copy the previous options
      const newOptions = [...prevOptions]

      // Update the option at the idx position
      newOptions.push({
        index: jobInfoFields.length,
        data: JobList,
      })

      // Return the new options
      return newOptions
    })

    setRoleOptions(prevOptions => {
      // Copy the previous options
      const newOptions = [...prevOptions]

      // Update the option at the idx position
      newOptions.push({
        index: jobInfoFields.length,
        data: OnboardingListRolePair,
      })

      // Return the new options
      return newOptions
    })
  }

  const removeJobInfo = (item: { id: string }, type: string) => {
    if (type === 'test') {
      const idx = jobInfoFields.map(item => item.id).indexOf(item.id)
      idx !== -1 && remove(idx)
    } else if (type === 'role') {
      const idx = roleJobInfoFields.map(item => item.id).indexOf(item.id)
      idx !== -1 && roleRemove(idx)
    }
  }

  const onClickAssignTest = () => {
    openModal({
      type: 'AssignTestModal',
      children: (
        <CustomModal
          title='Are you sure to assign the test?'
          vary='successful'
          onClose={() => closeModal('AssignTestModal')}
          onClick={() => {
            handleAssignTest(getValues())
            closeModal('AssignTestModal')
          }}
          rightButtonText='Assign'
        />
      ),
    })
  }

  const onClickAssignRole = () => {
    openModal({
      type: 'AssignRoleModal',
      children: (
        <CustomModal
          title='Are you sure to assign the role?'
          vary='successful'
          onClose={() => closeModal('AssignRoleModal')}
          onClick={() => {
            handleAssignRole(roleGetValues())
            closeModal('AssignRoleModal')
          }}
          rightButtonText='Assign'
        />
      ),
    })
  }

  const onClickCancelTest = () => {
    openModal({
      type: 'CancelTestModal',
      children: (
        <CustomModal
          title='Are you sure to cancel the assignment of the test?'
          vary='error'
          onClose={() => closeModal('CancelTestModal')}
          onClick={() => {
            closeModal('CancelTestModal')
            closeModal('AssignRoleModal')
          }}
          rightButtonText='Cancel'
          leftButtonText='No'
        />
      ),
    })
  }

  const onClickCancelRole = () => {
    openModal({
      type: 'CancelRoleModal',
      children: (
        <CustomModal
          title='Are you sure to cancel the assignment of the role?'
          vary='error'
          onClose={() => closeModal('CancelRoleModal')}
          onClick={() => {
            closeModal('CancelRoleModal')
            closeModal('AssignRoleModal')
          }}
          rightButtonText='Cancel'
          leftButtonText='No'
        />
      ),
    })
  }

  const resetData = (idx: number) => {
    // reset(defaultValues)

    update(idx, {
      jobType: { value: '', label: '' },
      role: { value: '', label: '', jobType: [] },
      source: { value: '', label: '' },
      target: { value: '', label: '' },
    })
    setJobTypeOptions([{ index: 0, data: JobList }])
    setRoleOptions([{ index: 0, data: OnboardingListRolePair }])
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const completeFieldIndex: number = value.jobInfo
        ? value.jobInfo.findIndex((value, index) => {
            return (
              (index !== lastCalledIndex.current ||
                JSON.stringify(value) !== JSON.stringify(lastCalledJobInfo)) &&
              value?.jobType?.value !== '' &&
              value?.role?.value !== '' &&
              value?.source?.value !== '' &&
              value?.target?.value !== ''
            )
          })
        : -1
      if (completeFieldIndex !== -1) {
        // At least one field set is complete, call the API
        checkDuplicate({
          jobType:
            getValues('jobInfo')[completeFieldIndex].jobType?.label ?? '',
          role: getValues('jobInfo')[completeFieldIndex].role?.label ?? '',
          source: getValues('jobInfo')[completeFieldIndex].source?.value ?? '',
          target: getValues('jobInfo')[completeFieldIndex].target?.value ?? '',
          checkType: 'test',
          userId: proId,
        })
          .then(res => {
            console.log(res.code)

            switch (res.code) {
              case checkDuplicateResponseEnum.CAN_BE_CREATED:
                break
              case checkDuplicateResponseEnum.ALREADY_HAVE_A_ROLE:
                openModal({
                  type: 'AlreadyHaveRoleModal',
                  children: (
                    <CustomModal
                      title='The Pro already has the same certified role.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('AlreadyHaveRoleModal')
                      }}
                      onClose={() => closeModal('AlreadyHaveRoleModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break
              case checkDuplicateResponseEnum.ALREADY_REQUESTED_ROLE:
              case checkDuplicateResponseEnum.ROLE_REQUEST_DUPLICATED:
                openModal({
                  type: 'RoleAlreadyAppliedModal',
                  children: (
                    <CustomModal
                      title='The same role has already been assigned to the Pro, and the response is now being awaited.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('TestAlreadyAppliedModal')
                      }}
                      onClose={() => closeModal('TestAlreadyAppliedModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break

              case checkDuplicateResponseEnum.TEST_REQUEST_DUPLICATED:
                openModal({
                  type: 'TestAlreadyAppliedModal',
                  children: (
                    <CustomModal
                      title='The Pro has already applied to the same role.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('TestAlreadyAppliedModal')
                      }}
                      onClose={() => closeModal('TestAlreadyAppliedModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break

              case checkDuplicateResponseEnum.NOT_RESPONDED_PRO:
                openModal({
                  type: 'TestAlreadyAssignedModal',
                  children: (
                    <CustomModal
                      title='The same test has been assigned to the Pro, and the response is now being awaited.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('TestAlreadyAssignedModal')
                      }}
                      onClose={() => closeModal('TestAlreadyAssignedModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break

              case checkDuplicateResponseEnum.REQUEST_ACCEPTED_PRO:
                openModal({
                  type: 'AlreadyTestingModal',
                  children: (
                    <CustomModal
                      title='The Pro is currently taking the same test.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('AlreadyTestingModal')
                      }}
                      onClose={() => closeModal('AlreadyTestingModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            // closeModal()
          })
        lastCalledIndex.current = completeFieldIndex
        setLastCalledJobInfo(getValues(`jobInfo.${completeFieldIndex}`))
      }
      // setPrevJobInfo(value.jobInfo)
    })
    return () => subscription.unsubscribe()
  }, [watch, lastCalledJobInfo])

  useEffect(() => {
    const subscription = roleWatch((value, { name, type }) => {
      const completeFieldIndex: number = value.jobInfo
        ? value.jobInfo.findIndex((value, index) => {
            return (
              (index !== lastCalledIndexRole.current ||
                JSON.stringify(value) !==
                  JSON.stringify(lastCalledRoleJobInfo)) &&
              value?.jobType?.value !== '' &&
              value?.role?.value !== '' &&
              value?.source?.value !== '' &&
              value?.target?.value !== ''
            )
          })
        : -1
      if (completeFieldIndex !== -1) {
        // At least one field set is complete, call the API
        checkDuplicate({
          jobType:
            roleGetValues('jobInfo')[completeFieldIndex].jobType?.label ?? '',
          role: roleGetValues('jobInfo')[completeFieldIndex].role?.label ?? '',
          source:
            roleGetValues('jobInfo')[completeFieldIndex].source?.value ?? '',
          target:
            roleGetValues('jobInfo')[completeFieldIndex].target?.value ?? '',
          checkType: 'role',
          userId: proId,
        })
          .then(res => {
            console.log(res.code)

            switch (res.code) {
              case checkDuplicateResponseEnum.CAN_BE_CREATED:
                break
              case checkDuplicateResponseEnum.ALREADY_HAVE_A_ROLE:
                openModal({
                  type: 'AlreadyHaveRoleModal',
                  children: (
                    <CustomModal
                      title='The Pro already has the same certified role.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('AlreadyHaveRoleModal')
                      }}
                      onClose={() => closeModal('AlreadyHaveRoleModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break
              case checkDuplicateResponseEnum.ALREADY_REQUESTED_ROLE:
              case checkDuplicateResponseEnum.ROLE_REQUEST_DUPLICATED:
                openModal({
                  type: 'RoleAlreadyAppliedModal',
                  children: (
                    <CustomModal
                      title='The same role has already been assigned to the Pro, and the response is now being awaited.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('TestAlreadyAppliedModal')
                      }}
                      onClose={() => closeModal('TestAlreadyAppliedModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break

              case checkDuplicateResponseEnum.TEST_REQUEST_DUPLICATED:
                openModal({
                  type: 'TestAlreadyAppliedModal',
                  children: (
                    <CustomModal
                      title='The Pro has already applied to the same role.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('TestAlreadyAppliedModal')
                      }}
                      onClose={() => closeModal('TestAlreadyAppliedModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break

              case checkDuplicateResponseEnum.NOT_RESPONDED_PRO:
                openModal({
                  type: 'TestAlreadyAssignedModal',
                  children: (
                    <CustomModal
                      title='The same test has been assigned to the Pro, and the response is now being awaited.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('TestAlreadyAssignedModal')
                      }}
                      onClose={() => closeModal('TestAlreadyAssignedModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break

              case checkDuplicateResponseEnum.REQUEST_ACCEPTED_PRO:
                openModal({
                  type: 'AlreadyTestingModal',
                  children: (
                    <CustomModal
                      title='The Pro is currently taking the same test.'
                      vary='error'
                      onClick={() => {
                        resetData(completeFieldIndex)
                        closeModal('AlreadyTestingModal')
                      }}
                      onClose={() => closeModal('AlreadyTestingModal')}
                      soloButton
                      rightButtonText='Okay'
                    />
                  ),
                })
                break
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            // closeModal()
          })
        lastCalledIndexRole.current = completeFieldIndex
        setLastCalledRoleJobInfo(roleGetValues(`jobInfo.${completeFieldIndex}`))
      }
      // setPrevJobInfo(value.jobInfo)
    })
    return () => subscription.unsubscribe()
  }, [roleWatch, lastCalledRoleJobInfo])

  return (
    <Box
      sx={{
        maxWidth: '820px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton> */}
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='customized tabs example'>
            <Tab
              value='1'
              label='Assign test'
              icon={
                <img
                  src={`/images/icons/onboarding-icons/assign-test-${
                    value === '1' ? 'active' : 'inactive'
                  }.svg`}
                />
              }
              sx={{ textTransform: 'none' }}
              iconPosition='start'
            />
            <Tab
              value='2'
              label='Assign role'
              icon={<Icon icon='mdi:account-outline'></Icon>}
              iconPosition='start'
              sx={{ textTransform: 'none' }}
            />
          </TabList>
          <TabPanel value='1' sx={{ padding: 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '30px',
              }}
            >
              <form onSubmit={handleSubmit(onClickAssignTest)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* JobInfos */}
                  {jobInfoFields?.map((item, idx) => {
                    return (
                      <Box key={item.id}>
                        {/* job type & role */}
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
                          {jobInfoFields.length > 1 && (
                            <IconButton
                              onClick={() => removeJobInfo(item, 'test')}
                              sx={{ padding: 1 }}
                            >
                              <Icon icon='mdi:delete-outline'></Icon>
                            </IconButton>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              control={control}
                              name={`jobInfo.${idx}.jobType`}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  fullWidth
                                  // onClose={() => {
                                  //   setInputStyle(false)
                                  // }}
                                  // onOpen={() => {
                                  //   setInputStyle(true)
                                  // }}
                                  isOptionEqualToValue={(option, newValue) => {
                                    return option.value === newValue.value
                                  }}
                                  onChange={(event, item) => {
                                    onChange(item)

                                    if (item) {
                                      const arr: {
                                        label: string
                                        value: string
                                        jobType: string[]
                                      }[] = []

                                      const jobTypeValue = item.value

                                      const res = OnboardingListRolePair.filter(
                                        value =>
                                          value.jobType.includes(jobTypeValue),
                                      )

                                      console.log(res)

                                      arr.push(...res)

                                      setRoleOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: arr,
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                    } else {
                                      setRoleOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: OnboardingListRolePair,
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                    }
                                  }}
                                  value={value}
                                  options={
                                    jobTypeOptions.find(
                                      option => option.index === idx,
                                    )?.data ?? []
                                  }
                                  id='jobType'
                                  getOptionLabel={option => option.label}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Job type*'
                                      error={
                                        getValues(`jobInfo.${idx}.jobType`) ===
                                        null
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                            {/* {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.jobType && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.jobType?.message}
                                  </FormHelperText>
                                )
                              : ''} */}

                            {getValues(`jobInfo.${idx}.jobType`) === null ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                          <FormControl sx={{ mb: 4 }} fullWidth>
                            <Controller
                              control={control}
                              name={`jobInfo.${idx}.role`}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  fullWidth
                                  // onClose={() => {
                                  //   setInputStyle(false)
                                  // }}
                                  // onOpen={() => {
                                  //   setInputStyle(true)
                                  // }}
                                  isOptionEqualToValue={(option, newValue) => {
                                    return option.value === newValue.value
                                  }}
                                  onChange={(event, item) => {
                                    onChange(item)

                                    if (item) {
                                      const arr: {
                                        label: string
                                        value: string
                                      }[] = []

                                      item.jobType.map(value => {
                                        const jobType = JobList.filter(
                                          data => data.value === value,
                                        )
                                        arr.push(...jobType)
                                        trigger(`jobInfo.${idx}.jobType`)
                                      })

                                      setJobTypeOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: _.uniqBy(arr, 'value'),
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                      if (
                                        item.value === 'DTPer' ||
                                        item.value === 'DTP QCer'
                                      ) {
                                        update(idx, {
                                          ...getValues(`jobInfo.${idx}`),
                                          source: null,
                                          target: null,
                                        })
                                      }
                                    } else {
                                      setJobTypeOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: JobList,
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                    }
                                  }}
                                  value={value}
                                  options={
                                    roleOptions
                                      .find(option => option.index === idx)
                                      ?.data?.filter(
                                        value =>
                                          value.label !== 'DTPer' &&
                                          value.label !== 'DTP QCer',
                                      ) ?? []
                                  }
                                  id='role'
                                  getOptionLabel={option => option.label}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Role*'
                                      error={
                                        getValues(`jobInfo.${idx}.role`) ===
                                        null
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            {getValues(`jobInfo.${idx}.role`) === null ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        </Box>
                        {/* languages */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.source`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  // {...field}
                                  // disableClearable
                                  disabled={
                                    getValues(`jobInfo.${idx}.role`)?.label ===
                                      'DTPer' ||
                                    getValues(`jobInfo.${idx}.role`)?.label ===
                                      'DTP QCer'
                                  }
                                  value={
                                    // languageList.filter(
                                    //   l => l.value === value?.value,
                                    // )[0]
                                    value
                                  }
                                  options={languageList}
                                  // onChange={(e, v) =>
                                  //   onChangeJobInfo(
                                  //     item.id,
                                  //     v?.value,
                                  //     'source',
                                  //     'test',
                                  //   )
                                  // }
                                  onChange={(e, item) => {
                                    onChange(item)
                                  }}
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label={
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTPer' &&
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTP QCer'
                                          ? 'Source*'
                                          : 'Source'
                                      }
                                      error={
                                        getValues(`jobInfo.${idx}.source`) ===
                                          null &&
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTPer' &&
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTP QCer'
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            {getValues(`jobInfo.${idx}.source`) === null &&
                            getValues(`jobInfo.${idx}.role`).label !==
                              'DTPer' &&
                            getValues(`jobInfo.${idx}.role`).label !==
                              'DTP QCer' ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.target`}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  // disableClearable
                                  disabled={
                                    getValues(`jobInfo.${idx}.role`)?.label ===
                                      'DTPer' ||
                                    getValues(`jobInfo.${idx}.role`)?.label ===
                                      'DTP QCer'
                                  }
                                  value={value}
                                  options={languageList}
                                  onChange={(e, item) => {
                                    onChange(item)
                                  }}
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label={
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTPer' &&
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTP QCer'
                                          ? 'Target*'
                                          : 'Target'
                                      }
                                      error={
                                        getValues(`jobInfo.${idx}.target`) ===
                                          null &&
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTPer' &&
                                        getValues(`jobInfo.${idx}.role`)
                                          ?.label !== 'DTP QCer'
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            {getValues(`jobInfo.${idx}.target`) === null &&
                            getValues(`jobInfo.${idx}.role`)?.label !==
                              'DTPer' &&
                            getValues(`jobInfo.${idx}.role`)?.label !==
                              'DTP QCer' ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}
                  <Box>
                    <IconButton
                      onClick={() => addJobInfo('test')}
                      color='primary'
                      disabled={!isTestValid}
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
                    <Button variant='outlined' onClick={onClickCancelTest}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      type='submit'
                      // disabled={jobInfoFields.some(item => {
                      //   if (
                      //     item.role.label === 'DTPer' ||
                      //     item.role.label === 'DTP QCer'
                      //   ) {
                      //     return !item.jobType.value || !item.role.value
                      //   } else {
                      //     return (
                      //       !item.jobType.value ||
                      //       !item.role.value ||
                      //       !item.target ||
                      //       !item.source
                      //     )
                      //   }
                      // })}
                      disabled={!isTestValid}
                    >
                      Assign test
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </TabPanel>
          <TabPanel value='2' sx={{ padding: 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '30px',
              }}
            >
              <form onSubmit={handleRoleSubmit(onClickAssignRole)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* JobInfos */}
                  {roleJobInfoFields?.map((item, idx) => {
                    return (
                      <Box key={item.id}>
                        {/* job type & role */}
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
                          {roleJobInfoFields.length > 1 && (
                            <IconButton
                              onClick={() => removeJobInfo(item, 'role')}
                              sx={{ padding: 1 }}
                            >
                              <Icon icon='mdi:delete-outline'></Icon>
                            </IconButton>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              control={roleControl}
                              name={`jobInfo.${idx}.jobType`}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  fullWidth
                                  // onClose={() => {
                                  //   setInputStyle(false)
                                  // }}
                                  // onOpen={() => {
                                  //   setInputStyle(true)
                                  // }}
                                  isOptionEqualToValue={(option, newValue) => {
                                    return option.value === newValue.value
                                  }}
                                  onChange={(event, item) => {
                                    onChange(item)

                                    if (item) {
                                      const arr: {
                                        label: string
                                        value: string
                                        jobType: string[]
                                      }[] = []

                                      const jobTypeValue = item.value

                                      const res = OnboardingListRolePair.filter(
                                        value =>
                                          value.jobType.includes(jobTypeValue),
                                      )

                                      console.log(res)

                                      arr.push(...res)

                                      setRoleOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: arr,
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                    } else {
                                      setRoleOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: OnboardingListRolePair,
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                    }
                                  }}
                                  value={value}
                                  options={
                                    jobTypeOptions.find(
                                      option => option.index === idx,
                                    )?.data ?? []
                                  }
                                  id='jobType'
                                  getOptionLabel={option => option.label}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Job type*'
                                      error={
                                        roleGetValues(
                                          `jobInfo.${idx}.jobType`,
                                        ) === null
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                            {/* {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.jobType && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.jobType?.message}
                                  </FormHelperText>
                                )
                              : ''} */}

                            {roleGetValues(`jobInfo.${idx}.jobType`) ===
                            null ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                          <FormControl sx={{ mb: 4 }} fullWidth>
                            <Controller
                              control={roleControl}
                              name={`jobInfo.${idx}.role`}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  fullWidth
                                  // onClose={() => {
                                  //   setInputStyle(false)
                                  // }}
                                  // onOpen={() => {
                                  //   setInputStyle(true)
                                  // }}
                                  isOptionEqualToValue={(option, newValue) => {
                                    return option.value === newValue.value
                                  }}
                                  onChange={(event, item) => {
                                    onChange(item)

                                    if (item) {
                                      const arr: {
                                        label: string
                                        value: string
                                      }[] = []

                                      item.jobType.map(value => {
                                        const jobType = JobList.filter(
                                          data => data.value === value,
                                        )
                                        arr.push(...jobType)
                                        trigger(`jobInfo.${idx}.jobType`)
                                      })

                                      setJobTypeOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: _.uniqBy(arr, 'value'),
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                      if (
                                        item.value === 'DTPer' ||
                                        item.value === 'DTP QCer'
                                      ) {
                                        roleUpdate(idx, {
                                          ...roleGetValues(`jobInfo.${idx}`),
                                          source: null,
                                          target: null,
                                        })
                                      }
                                    } else {
                                      setJobTypeOptions(prevOptions => {
                                        // Copy the previous options
                                        const newOptions = [...prevOptions]

                                        // Update the option at the idx position
                                        newOptions[idx] = {
                                          index: idx,
                                          data: JobList,
                                        }

                                        // Return the new options
                                        return newOptions
                                      })
                                    }
                                  }}
                                  value={value}
                                  options={
                                    roleOptions.find(
                                      option => option.index === idx,
                                    )?.data ?? []
                                  }
                                  id='role'
                                  getOptionLabel={option => option.label}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Role*'
                                      error={
                                        roleGetValues(`jobInfo.${idx}.role`) ===
                                        null
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            {roleGetValues(`jobInfo.${idx}.role`) === null ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        </Box>
                        {/* languages */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.source`}
                              control={roleControl}
                              render={({ field: { value, onChange } }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  // {...field}
                                  // disableClearable
                                  disabled={
                                    roleGetValues(`jobInfo.${idx}.role`)
                                      ?.label === 'DTPer' ||
                                    roleGetValues(`jobInfo.${idx}.role`)
                                      ?.label === 'DTP QCer'
                                  }
                                  value={
                                    // languageList.filter(
                                    //   l => l.value === value?.value,
                                    // )[0]
                                    value
                                  }
                                  options={languageList}
                                  // onChange={(e, v) =>
                                  //   onChangeJobInfo(
                                  //     item.id,
                                  //     v?.value,
                                  //     'source',
                                  //     'test',
                                  //   )
                                  // }
                                  onChange={(e, item) => {
                                    onChange(item)
                                  }}
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label={
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTPer' &&
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTP QCer'
                                          ? 'Source*'
                                          : 'Source'
                                      }
                                      error={
                                        roleGetValues(
                                          `jobInfo.${idx}.source`,
                                        ) === null &&
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTPer' &&
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTP QCer'
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            {roleGetValues(`jobInfo.${idx}.source`) === null &&
                            roleGetValues(`jobInfo.${idx}.role`).label !==
                              'DTPer' &&
                            roleGetValues(`jobInfo.${idx}.role`).label !==
                              'DTP QCer' ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.target`}
                              control={roleControl}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  // disableClearable
                                  disabled={
                                    roleGetValues(`jobInfo.${idx}.role`)
                                      ?.label === 'DTPer' ||
                                    roleGetValues(`jobInfo.${idx}.role`)
                                      ?.label === 'DTP QCer'
                                  }
                                  value={value}
                                  options={languageList}
                                  onChange={(e, item) => {
                                    onChange(item)
                                  }}
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label={
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTPer' &&
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTP QCer'
                                          ? 'Target*'
                                          : 'Target'
                                      }
                                      error={
                                        roleGetValues(
                                          `jobInfo.${idx}.target`,
                                        ) === null &&
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTPer' &&
                                        roleGetValues(`jobInfo.${idx}.role`)
                                          .label !== 'DTP QCer'
                                      }
                                    />
                                  )}
                                />
                              )}
                            />

                            {roleGetValues(`jobInfo.${idx}.target`) === null &&
                            roleGetValues(`jobInfo.${idx}.role`).label !==
                              'DTPer' &&
                            roleGetValues(`jobInfo.${idx}.role`).label !==
                              'DTP QCer' ? (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {FormErrors.required}
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}
                  <Box>
                    <IconButton
                      onClick={() => addJobInfo('role')}
                      color='primary'
                      disabled={!isRoleValid}
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
                    <Button variant='outlined' onClick={onClickCancelRole}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      type='submit'
                      disabled={!isRoleValid}
                    >
                      Assign role
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}
