import { Fragment, useEffect, useState } from 'react'

// ** style components
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'
import Chip from 'src/@core/components/mui/chip'

// ** components
import About from './about'
import ProProfileForm from '@src/pages/components/forms/pro/profile.form'
import WorkDaysCalendar from './work-days-calendar'
import AvailableCalendarWrapper from '@src/@core/styles/libs/available-calendar'
import TimelineDot from '@src/@core/components/mui/timeline-dot'
import OffDayForm from './off-day-form'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import FileInfo from '@src/@core/components/file-info'
import MyRoles from './my-roles'
import FilePreviewDownloadModal from '@src/pages/components/pro-detail-modal/modal/file-preview-download-modal'
import Contracts from '@src/pages/components/pro-detail-component/contracts'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

// ** types & schemas
import { UserDataType } from '@src/context/types'
import {
  PersonalInfo,
  ProUserInfoType,
  ProUserResumeInfoType,
} from '@src/types/sign/personalInfoTypes'
import { getProfileSchema } from '@src/types/schema/profile.schema'
import { OffDayEventType } from '@src/types/common/calendar.type'
import { offDaySchema } from '@src/types/schema/off-day.schema'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { DetailUserType } from '@src/types/common/detail-user.type'
import { FileItemType } from '@src/@core/components/swiper/file-swiper-s3'

// ** third parties
import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'

// ** api
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import {
  deleteOffDays,
  createMyOffDays,
  updateWeekends,
  updateMyOffDays,
} from '@src/apis/pro/pro-details.api'
import { useGetProWorkDays } from '@src/queries/pro/pro-details.query'

// ** value
import { ExperiencedYears } from '@src/shared/const/experienced-years'
import { AreaOfExpertiseList } from '@src/shared/const/area-of-expertise/area-of-expertise'
import { getResumeFilePath } from '@src/shared/transformer/filePath.transformer'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import {
  clientBillingAddressDefaultValue,
  clientBillingAddressSchema,
} from '@src/types/schema/client-billing-address.schema'
import { updateConsumerUserInfo } from '@src/apis/user.api'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import useAuth from '@src/hooks/useAuth'
import { useRouter } from 'next/router'
import EditProfileModal from './edit-profile-modal'
import dayjs from 'dayjs'

type Props = {
  userInfo: DetailUserType
  user: UserDataType
}

/* TODO
1. My profile 업데이트 api연동하기
2. Notes to LPM / TAD 업데이트 api연동하기
3. Specialties 업데이트 api연동하기
4. Resume 업로드, 삭제 api연동하기
*/
export default function MyPageOverview({ user, userInfo }: Props) {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const auth = useRecoilValueLoadable(authState)
  const setAuth = useAuth()
  const router = useRouter()

  const invalidateUserInfo = () =>
    queryClient.invalidateQueries({
      queryKey: `myId:${user.userId!}`,
    })
  const invalidateOffDay = () =>
    queryClient.invalidateQueries({
      queryKey: `myOffDays:${user.userId!}`,
    })

  const [editProfile, setEditProfile] = useState(false)
  const [editNote, setEditNote] = useState(false)
  const [editOffDay, setEditOffDay] = useState(false)
  const [editExperience, setEditExperience] = useState(false)
  const [editSpecialties, setEditSpecialties] = useState(false)
  const [offDayId, setOffDayId] = useState<number | null>(null)

  //forms
  const [note, setNote] = useState(userInfo.notesFromUser)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [experience, setExperience] = useState(userInfo.experience)
  const [specialties, setSpecialties] = useState(userInfo?.specialties ?? [])
  const [resume, setResume] = useState(
    userInfo.resume
      ? userInfo.resume.map(item => `${item.fileName}.${item.fileExtension}`)
      : [],
  )
  //pagination
  const [rolePage, setRolePage] = useState(0)
  const roleRowsPerPage = 4
  const roleOffset = rolePage * roleRowsPerPage

  const handleChangeRolePage = (direction: string) => {
    const changedPage =
      direction === 'prev'
        ? Math.max(rolePage - 1, 0)
        : direction === 'next'
        ? rolePage + 1
        : 0

    setRolePage(changedPage)
  }

  const { data: offDays } = useGetProWorkDays(user.userId!, year, month)

  // function onCloseProfile() {
  //   if (isFieldDirty) {
  //     openModal({
  //       type: 'closeProfileForm',
  //       children: (
  //         <DiscardChangesModal
  //           onClose={() => closeModal('closeProfileForm')}
  //           onDiscard={() => {
  //             reset()
  //             setEditProfile(false)
  //           }}
  //         />
  //       ),
  //     })
  //   } else {
  //     setEditProfile(false)
  //   }
  // }

  const updateUserInfoMutation = useMutation(
    (data: (ProUserInfoType | ProUserResumeInfoType) & { userId: number }) =>
      updateConsumerUserInfo(data),
    {
      onSuccess: () => {
        const { userId, email, accessToken } = router.query
        const accessTokenAsString: string = accessToken as string
        setAuth.updateUserInfo({
          userId: auth.getValue().user!.id,
          email: auth.getValue().user!.email,
          accessToken: accessTokenAsString,
        })
        invalidateUserInfo()

        // router.push('/home')
      },
    },
  )

  function onProfileSave(
    data: Omit<PersonalInfo, 'address'>,
    address: ClientAddressType,
  ) {
    updateUserInfoMutation.mutate(
      {
        userId: auth.getValue().user?.id || 0,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.timezone.label,
        birthday: data.birthday?.toISOString()!,
        extraData: {
          havePreferredName: data.havePreferred,
          jobInfo: data.jobInfo,
          middleName: data.middleName,
          experience: data.experience,
          legalNamePronunciation: data.legalNamePronunciation,
          mobilePhone: data.mobile,
          telephone: data.phone,
          preferredName: data.preferredName,
          resume: data.resume?.length ? data.resume.map(file => file.name) : [],
          preferredNamePronunciation: data.preferredNamePronunciation,
          pronounce: data.pronounce,
          specialties: data.specialties?.map(item => item.value),
          timezone: data.timezone,
          addresses: [address],
        },
      },
      {
        onSuccess: () => {
          closeModal('saveProfileForm')
          closeModal('EditProfileModal')
        },
      },
    )
    // console.log('data', data)
    //TODO: mutation붙이기 + confirm modal
  }

  const onResumeSave = (files: Array<string>) => {
    updateUserInfoMutation.mutate(
      {
        userId: auth.getValue().user?.id || 0,
        extraData: {
          resume: files,
        },
      },
      {
        onSuccess: () => {
          closeModal('deleteResume')
        },
      },
    )
  }

  const onClickProfileSave = (
    data: Omit<PersonalInfo, 'address'>,
    address: ClientAddressType,
  ) => {
    openModal({
      type: 'saveProfileForm',
      children: (
        <CustomModal
          onClose={() => closeModal('saveProfileForm')}
          onClick={() => onProfileSave(data, address)}
          title='Are you sure you want to save all changes?'
          rightButtonText='Save'
          vary='successful'
        />
      ),
    })
  }

  function onNoteSave() {
    //TODO: mutation붙이기 + confirm modal
    setEditNote(false)
  }

  /* available work days */
  const {
    control: offDayControl,
    getValues: getOffDayValues,
    setValue: setOffDayValues,
    watch: watchOffDays,
    reset: resetOffDay,
    formState: { dirtyFields: offDayDirtyFields, isValid: isOffDayValid },
  } = useForm<OffDayEventType & { otherReason?: string }>({
    // mode: 'onChange',
    mode: 'onChange',
    resolver: yupResolver(offDaySchema),
  })

  const createOffDay = useMutation(
    (data: { start: string; end: string; reason?: string }) =>
      createMyOffDays(user.userId!, data.start, data.end, data.reason),
    {
      onSuccess: () => invalidateOffDay(),
      onError: (e: any) => {
        if (e.message === '406') {
          openModal({
            type: 'duplicateOffDay',
            children: (
              <SimpleAlertModal
                message='There is already an unavailable day selected on the chosen date.
            Please deselect the already chosen date and proceed again.'
                onClose={() => closeModal('duplicateOffDay')}
              />
            ),
          })
        } else {
          onError()
        }
      },
    },
  )

  const updateOffDays = useMutation(
    ({
      offDayId,
      start,
      end,
      reason,
    }: {
      offDayId: number
      start: string
      end: string
      reason?: string
    }) => updateMyOffDays(offDayId, start, end, reason),
    {
      onSuccess: () => invalidateOffDay(),
      onError: () => onError(),
    },
  )

  function onOffDaySave() {
    setEditOffDay(false)
    let data = getOffDayValues()

    data = {
      ...data,
      start: dayjs(data.start).format('YYYY-MM-DD'),
      end: dayjs(data.end).format('YYYY-MM-DD'),
    }

    if (data?.otherReason) {
      data = {
        ...data,
        reason: data.otherReason,
      }
    }

    if (offDayId !== null) {
      updateOffDays.mutate({
        ...data,
        offDayId,
      })
      setOffDayId(null)
    } else {
      createOffDay.mutate(data)
    }
    resetOffDay({})
  }

  const updateWeekendsMutation = useMutation(
    (offOnWeekends: 0 | 1) => updateWeekends(user.userId!, offOnWeekends),
    {
      onSuccess: () => {
        invalidateOffDay()
        invalidateUserInfo()
      },
      onError: () => onError(),
    },
  )

  function onOffOnWeekendsClick(offOnWeekends: 0 | 1) {
    openModal({
      type: 'updateWeekends',
      children: (
        <CustomModal
          vary='error'
          onClose={() => closeModal('updateWeekends')}
          onClick={() => {
            updateWeekendsMutation.mutate(offOnWeekends)
            closeModal('updateWeekends')
          }}
          rightButtonText='Save'
          title={
            offOnWeekends
              ? 'Are you sure you want to mark yourself as unavailable on weekends?'
              : 'Are you sure you want to mark yourself as available on weekends?'
          }
        />
      ),
    })
  }

  const deleteOffMutation = useMutation((id: number) => deleteOffDays(id), {
    onSuccess: () => invalidateOffDay(),
    onError: () => onError(),
  })

  function deleteOffDay(id: number) {
    openModal({
      type: 'deleteOffDay',
      children: (
        <CustomModal
          onClose={() => closeModal('deleteOffDay')}
          onClick={() => {
            deleteOffMutation.mutate(id)
            closeModal('deleteOffDay')
          }}
          title='Are you sure to delete the off day?'
          vary='error'
          rightButtonText='Delete'
        />
      ),
    })
  }

  const offDayOptions = [
    'I’ll be unavailable due to the other projects.',
    'I’ll be on vacation.',
    'Prefer not to share',
    'etc.',
  ]

  /* resume */
  const downloadAllFile = (
    file:
      | {
          url: string
          filePath: string
          fileName: string
          fileExtension: string
        }[]
      | null,
  ) => {
    if (file) {
      file.map(value => {
        getDownloadUrlforCommon(S3FileType.RESUME, value.filePath).then(res => {
          const previewFile = {
            url: res.url,
            fileName: value.fileName,
            fileExtension: value.fileExtension,
          }
          fetch(previewFile.url, { method: 'GET' })
            .then(res => {
              return res.blob()
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${value.fileName}.${value.fileExtension}`
              document.body.appendChild(a)
              a.click()
              setTimeout((_: any) => {
                window.URL.revokeObjectURL(url)
              }, 60000)
              a.remove()
              // onClose()
            })
            .catch(error => onError())
        })
      })
    }
  }

  function uploadFiles(files: File[]) {
    let fileData: Array<string> = resume
    if (files?.length) {
      const promiseArr = files.map((file, idx) => {
        return getUploadUrlforCommon(
          S3FileType.RESUME,
          getResumeFilePath(user.id as number, file.name),
        )
          .then(res => {
            return uploadFileToS3(res.url, file)
          })
          .then(res => {
            fileData.push(file.name)
          })
      })
      setResume(fileData)
      Promise.all(promiseArr)
        .then(res => {
          onResumeSave(fileData)
          // invalidateUserInfo()
        })
        .catch(err => {
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          )
        })
    }
  }

  const onClickDeleteResume = (fileName: string) => {
    if (resume.includes(fileName)) {
      const updatedResume = resume.filter(item => item !== fileName)
      setResume(updatedResume)
      onResumeSave(updatedResume)
    }
  }
  // const deleteResumeMutation = useMutation(
  //   (fileId: number) => deleteResume(user.userId!, fileId),
  //   {
  //     onSuccess: () => {
  //       onSuccess()
  //       invalidateUserInfo()
  //     },
  //     onError: () => onError(),
  //   },
  // )

  function onDeleteFile(file: FileItemType) {
    if (userInfo?.resume?.length && userInfo.resume.length <= 1) {
      openModal({
        type: 'cannotDeleteResume',
        children: (
          <SimpleAlertModal
            message='You cannot delete the last remaining resume.'
            onClose={() => closeModal('cannotDeleteResume')}
          />
        ),
      })
    } else if (userInfo?.resume?.length && userInfo.resume.length > 1) {
      openModal({
        type: 'deleteResume',
        children: (
          <DeleteConfirmModal
            message='Are you sure you want to delete this file?'
            title={file.fileName}
            onDelete={() =>
              onClickDeleteResume(`${file.fileName}.${file.fileExtension}`)
            }
            onClose={() => closeModal('cannotDeleteResume')}
          />
        ),
      })
    }
  }

  function onSaveExperience() {
    setEditExperience(false)
    //TODO: mutation붙이기
  }

  /* Contracts */
  const onClickFile = (
    file: {
      url: string
      filePath: string
      fileName: string
      fileExtension: string
    },
    fileType: string,
  ) => {
    getDownloadUrlforCommon(fileType, file.filePath).then(res => {
      file.url = res.url
      openModal({
        type: 'preview',
        children: (
          <FilePreviewDownloadModal
            open={true}
            onClose={() => closeModal('preview')}
            docs={[file]}
          />
        ),
      })
    })
  }

  function onSaveSpecialties() {
    setEditSpecialties(false)
    //TODO: mutation붙이기
  }

  function onSuccess() {
    toast.success('Saved successfully.', {
      position: 'bottom-left',
    })
  }

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }

  const onClickEditProfile = () => {
    openModal({
      type: 'EditProfileModal',
      children: (
        <EditProfileModal
          userInfo={userInfo!}
          onClick={onClickProfileSave}
          onClose={() => closeModal('EditProfileModal')}
        />
      ),
    })
  }

  console.log(userInfo)

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          md={12}
          lg={3}
          display='flex'
          flexDirection='column'
          gap='24px'
        >
          {/* My Profile */}
          <Card sx={{ padding: '20px' }}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              mb='24px'
            >
              <Typography variant='h6'>My profile</Typography>
              {/* <IconButton onClick={() => setEditProfile(!editProfile)}> */}
              <IconButton onClick={onClickEditProfile}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            </Box>
            <About
              userInfo={{
                email: user.email!,
                preferredName: userInfo.preferredName ?? '',
                pronounce: userInfo.pronounce,
                preferredNamePronunciation:
                  userInfo.preferredNamePronunciation ?? '',
                birthday: userInfo.birthday,
                address:
                  userInfo.addresses && userInfo.addresses.length > 0
                    ? userInfo?.addresses[0]
                    : null,
                mobilePhone: user.mobilePhone,
                telephone: user.telephone ?? '',
                timezone: userInfo.timezone!,
              }}
            />
          </Card>

          {/* Available work days */}
          <AvailableCalendarWrapper>
            <Card sx={{ padding: '20px' }}>
              <CardHeader
                title={
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Typography variant='h6'>Available work days</Typography>
                    <IconButton onClick={() => setEditOffDay(true)}>
                      <Icon
                        style={{ color: 'rgb(102, 108, 255)' }}
                        icon='gridicons:add'
                      />
                    </IconButton>
                  </Box>
                }
                sx={{ mb: '24px', padding: 0 }}
              />
              <WorkDaysCalendar
                event={offDays ?? []}
                year={year}
                month={month}
                setMonth={setMonth}
                setYear={setYear}
                showToolbar={true}
                onEventClick={(
                  type: 'edit' | 'delete',
                  info: OffDayEventType,
                ) => {
                  if (type === 'edit') {
                    const isEtc =
                      offDayOptions.find(opt => opt === info.reason) ===
                      undefined
                    resetOffDay({
                      ...info,
                      reason: isEtc ? 'etc.' : info.reason,
                      otherReason: isEtc ? info.reason : '',
                    })
                    setOffDayId(info.id!)
                    setEditOffDay(true)
                  } else {
                    deleteOffDay(info.id!)
                  }
                }}
              />
              <Box
                display='flex'
                justifyContent='space-between'
                gap='10px'
                mt='11px'
              >
                <FormControlLabel
                  label='Off on weekends'
                  onChange={e => {
                    //@ts-ignore
                    onOffOnWeekendsClick(e.target?.checked ? 1 : 0)
                  }}
                  control={
                    <Checkbox
                      checked={userInfo.isOffOnWeekends}
                      name='Off on weekends'
                    />
                  }
                />

                <Box display='flex' alignItems='center' gap='8px'>
                  <TimelineDot color='grey' />
                  <Typography
                    variant='caption'
                    sx={{
                      lineHeight: '14px',
                      color: 'rgba(76, 78, 100, 0.87)',
                    }}
                  >
                    Unavailable
                  </Typography>
                </Box>
              </Box>
            </Card>
          </AvailableCalendarWrapper>

          {/* Notes to LPM / TAD */}
          <Card sx={{ padding: '20px' }}>
            <CardHeader
              title={
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h6'>Notes to LPM / TAD</Typography>
                  <IconButton onClick={() => setEditNote(true)}>
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                </Box>
              }
              sx={{ padding: 0 }}
            />
            <Divider sx={{ my: theme => `${theme.spacing(7)} !important` }} />
            <CardContent sx={{ padding: 0 }}>
              {userInfo.notesFromUser
                ? userInfo.notesFromUser
                : 'No notes have been written.'}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={9}>
          <Grid container spacing={6}>
            {/* Resume */}
            <Grid item xs={6} md={6} lg={6}>
              <Card
                sx={{
                  padding: '24px',
                  paddingBottom: '2px',
                  minHeight: '186px',
                }}
              >
                <FileInfo
                  title='Resume'
                  fileList={userInfo.resume ?? []}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg'],
                    'text/csv': ['.cvs'],
                    'application/pdf': ['.pdf'],
                    'text/plain': ['.txt'],
                    'application/vnd.ms-powerpoint': ['.ppt'],
                    'application/msword': ['.doc'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                      ['.docx'],
                  }}
                  fileType={S3FileType.RESUME}
                  onDownloadAll={downloadAllFile}
                  onFileDrop={uploadFiles}
                  onDeleteFile={onDeleteFile}
                  isUpdatable={true}
                  isDeletable={true}
                />
              </Card>
            </Grid>
            {/* Years of experience */}
            <Grid item md={6} lg={6} xs={6}>
              <Card sx={{ padding: '24px' }}>
                <CardHeader
                  title={
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <Typography variant='h6'>Years of experience</Typography>
                      <IconButton onClick={() => setEditExperience(true)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                    </Box>
                  }
                  sx={{ mb: '24px', padding: 0 }}
                />

                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 600,
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    borderRadius: '10px',
                    padding: '31px 24px',
                  }}
                >
                  {userInfo.experience}
                </Typography>
              </Card>
            </Grid>
            {/* My Roles */}
            <Grid item xs={12}>
              <MyRoles
                userInfo={userInfo?.appliedRoles || []}
                page={rolePage}
                rowsPerPage={roleRowsPerPage}
                handleChangePage={handleChangeRolePage}
                offset={roleOffset}
              />
            </Grid>
            {/* Contracts */}
            <Grid item xs={6}>
              <Contracts userInfo={userInfo!} onClickContracts={onClickFile} />
            </Grid>
            {/* Specialties */}
            <Grid item xs={6}>
              <Card sx={{ padding: '20px', height: '100%' }}>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  paddingBottom='24px'
                >
                  <Typography variant='h6'>Specialties</Typography>
                  <IconButton onClick={() => setEditSpecialties(true)}>
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                </Box>

                <CardContent sx={{ padding: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {userInfo.specialties && userInfo.specialties.length ? (
                      userInfo.specialties.map((value, idx) => {
                        return (
                          <Chip
                            key={idx}
                            size='small'
                            label={value}
                            skin='light'
                            color='primary'
                            sx={{
                              textTransform: 'capitalize',
                              '& .MuiChip-label': { lineHeight: '18px' },
                            }}
                          />
                        )
                      })
                    ) : (
                      <Box>-</Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* My profile form modal */}
      {/* <Dialog
        open={editProfile}
        onClose={() => setEditProfile(false)}
        maxWidth='md'
      >
        <DialogContent style={{ padding: '50px 60px' }}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6'>My Profile</Typography>
            </Grid>
            <ProProfileForm control={control} errors={errors} watch={watch} />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={6} mb={4}>
                <Grid item xs={12}>
                  <Typography fontWeight={600}>Permanent address</Typography>
                </Grid>
                <ClientBillingAddressesForm
                  control={addressControl}
                  errors={addressError}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              display='flex'
              gap='16px'
              justifyContent='center'
            >
              <Button variant='outlined' onClick={onCloseProfile}>
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={
                  !isValid ||
                  // (!isFieldDirty && !isAddressFieldDirty) ||
                  !isAddressValid
                }
                onClick={onClickProfileSave}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog> */}

      {/* Note form */}
      <Dialog open={editNote} onClose={() => setEditNote(false)}>
        <DialogContent sx={{ padding: '24px' }}>
          <Typography variant='h6' mb='24px'>
            Notes to LPM / TAD
          </Typography>
          <TextField
            sx={{ width: '470px' }}
            rows={4}
            multiline
            fullWidth
            placeholder='Please write down the note to share with LPM / TAD.'
            value={note}
            onChange={e => setNote(e.target.value)}
            inputProps={{ maxLength: 500 }}
          />
          <Typography variant='body2' mt='12px' textAlign='right'>
            {note?.length ?? 0}/500
          </Typography>
          <Box display='flex' gap='16px' justifyContent='center'>
            <Button
              variant='outlined'
              onClick={() => {
                setEditNote(false)
                setNote(userInfo?.notesFromUser)
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' disabled={!note} onClick={onNoteSave}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Available day form */}
      <Dialog
        open={editOffDay}
        onClose={() => setEditOffDay(false)}
        maxWidth='xs'
      >
        <DialogContent>
          <Grid container spacing={6}>
            <OffDayForm
              options={offDayOptions}
              control={offDayControl}
              setValue={setOffDayValues}
              getValues={getOffDayValues}
            />
            <Grid
              item
              xs={12}
              display='flex'
              alignItems='center'
              gap='16px'
              justifyContent='center'
            >
              <Button
                variant='outlined'
                onClick={() => {
                  resetOffDay({})
                  setEditOffDay(false)
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={onOffDaySave}
                disabled={!isOffDayValid || _.isEmpty(offDayDirtyFields)}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Years of ex form */}
      <Dialog open={editExperience} maxWidth='xs'>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6'>Years of experience</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='experience'>Years of experience</InputLabel>
                <Select
                  value={experience}
                  label='Years of experience'
                  placeholder='Years of experience'
                  onChange={e => setExperience(e.target.value)}
                >
                  {ExperiencedYears.map((item, idx) => (
                    <MenuItem value={item.value} key={idx}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              display='flex'
              gap='16px'
              justifyContent='center'
            >
              <Button
                variant='outlined'
                onClick={() => {
                  setEditExperience(false)
                  setExperience(userInfo?.experience)
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={experience === userInfo?.experience}
                onClick={onSaveExperience}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Specialties form */}
      <Dialog open={editSpecialties} maxWidth='xs'>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant='h6'>Specialties</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  autoHighlight
                  fullWidth
                  multiple
                  value={
                    AreaOfExpertiseList.filter(st =>
                      specialties.includes(st.value),
                    ) || []
                  }
                  options={AreaOfExpertiseList}
                  onChange={(e, v: any) => {
                    setSpecialties(
                      v.map((i: { value: string; label: string }) => i.value),
                    )
                  }}
                  limitTags={3}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Specialties'
                      placeholder='Specialties'
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              display='flex'
              gap='16px'
              justifyContent='center'
            >
              <Button
                variant='outlined'
                onClick={() => {
                  setEditSpecialties(false)
                  setSpecialties(userInfo?.specialties || [])
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={_.isEqual(userInfo?.specialties, specialties)}
                onClick={onSaveSpecialties}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
