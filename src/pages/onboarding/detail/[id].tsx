import { Card, Grid, Typography } from '@mui/material'

import { useRouter } from 'next/router'

import { Box } from '@mui/system'

import styled from 'styled-components'
import toast from 'react-hot-toast'

import About from '../components/detail/about'
import AppliedRole from '../components/detail/applied-role'
import CertificationTest from '../components/detail/certification-test'
import NoteFromPro from '../components/detail/note-pro'
import Specialties from '../components/detail/specialities'
import Contracts from '../components/detail/contracts'
import CommentsAboutPro from '../components/detail/comments-pro'
import Resume from '../components/detail/resume'
import Experience from '../components/detail/experience'
import { ChangeEvent, Suspense, useContext, useEffect, useState } from 'react'

import _ from 'lodash'
import {
  AddRoleType,
  SelectedJobInfoType,
  CommentsOnProType,
  AddRolePayloadType,
} from 'src/types/onboarding/list'
import { useMutation, useQueryClient } from 'react-query'

import { ModalContext } from 'src/context/ModalContext'
import TestDetailsModal from '../components/detail/dialog/test-details-modal'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  useGetAppliedRole,
  useGetCertifiedRole,
  useGetOnboardingProDetails,
} from 'src/queries/onboarding/onboarding-query'
import AppliedRoleModal from '../components/detail/dialog/applied-role-modal'
import { RoleType } from 'src/context/types'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import Button from '@mui/material/Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { assignTestSchema } from 'src/types/schema/onboarding.schema'
import AssignTestModal from '../components/detail/modal/assign-test.modal'
import CancelTestModal from '../components/detail/modal/cancel-test-modal'
import AssignRoleModal from '../components/detail/modal/assign-role-modal'
import CancelRoleModal from '../components/detail/modal/cancel-role-modal'
import EditCommentModal from '../components/detail/modal/edit-comment-modal'
import CancelEditCommentModal from '../components/detail/modal/edit-cancel-comment-modal'
import CancelSaveCommentModal from '../components/detail/modal/cancel-comment-modal'
import SaveCommentModal from '../components/detail/modal/save-comment-modal'
import DeleteCommentModal from '../components/detail/modal/delete-comment-modal'
import FilePreviewDownloadModal from '../components/detail/modal/file-preview-download-modal'

import { getLegalName } from 'src/shared/helpers/legalname.helper'
import FallbackSpinner from 'src/@core/components/spinner'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

import {
  AppliedRoleType,
  OnboardingProDetailsType,
} from 'src/types/onboarding/details'
import {
  addCommentOnPro,
  addCreatedAppliedRole,
  deleteCommentOnPro,
  editCommentOnPro,
  patchAppliedRole,
  patchTestStatus,
} from 'src/apis/onboarding.api'
import { AuthContext } from 'src/context/AuthContext'
import NegativeActionsTestModal from '../components/detail/modal/negative-actions-test-modal'
import CertifiedRole from '../components/detail/certified-role'
import CertifyRoleModal from '../components/detail/modal/certify-role-modal'
import ReasonModal from '../components/detail/modal/reason-modal'
import ResumeTestModal from '../components/detail/modal/resume-test-modal'
import TestAssignModal from '../components/detail/modal/test-assign-modal'
import SkipBasicTestModal from '../components/detail/modal/basic-test-action-modal'

import BasicTestActionModal from '../components/detail/modal/basic-test-action-modal'
import SkillTestActionModal from '../components/detail/modal/skill-test-action-modal'

const defaultValues: AddRoleType = {
  jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
}

const OnboardingDetails = () => (
  <Suspense fallback={<FallbackSpinner />}>
    <OnboardingDetail />
  </Suspense>
)

function OnboardingDetail() {
  const router = useRouter()
  const { id } = router.query
  const { data: userInfo } = useGetOnboardingProDetails(id!)

  const { data: appliedRole } = useGetAppliedRole(userInfo!.userId)
  const { data: certifiedRole } = useGetCertifiedRole(userInfo!.userId)

  const { user } = useContext(AuthContext)

  const [hideFailedTest, setHideFailedTest] = useState(false)
  const [selectedUserInfo, setSelectedUserInfo] =
    useState<OnboardingProDetailsType | null>(null)
  const [jobInfo, setJobInfo] = useState(userInfo!.jobInfo)

  const [appliedRoleList, setAppliedRoleList] = useState<
    AppliedRoleType[] | null
  >(appliedRole!)

  const [selectedJobInfo, setSelectedJobInfo] =
    useState<AppliedRoleType | null>(null)

  const [actionId, setActionId] = useState(0)

  const [rolePage, setRolePage] = useState(0)
  const [roleRowsPerPage, setRoleRowsPerPage] = useState(4)
  const roleOffset = rolePage * roleRowsPerPage

  const [commentsProPage, setCommentsProPage] = useState(0)
  const [commentsProRowsPerPage, setCommentProRowsPerPage] = useState(3)
  const commentsProOffset = commentsProPage * commentsProRowsPerPage

  const [appliedRoleModalOpen, setAppliedRoleModalOpen] = useState(false)

  const [assignTestModalOpen, setAssignTestModalOpen] = useState(false)
  const [cancelTestModalOpen, setCancelTestModalOpen] = useState(false)
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false)
  const [cancelRoleModalOpen, setCancelRoleModalOpen] = useState(false)

  const [clickedEditComment, setClickedEditComment] = useState(false)
  const [selectedComment, setSelectedComment] =
    useState<CommentsOnProType | null>(null)
  const [comment, setComment] = useState<string>('')
  const [addComment, setAddComment] = useState<string>('')
  const [clickedAddComment, setClickedAddComment] = useState(false)

  const [assignTestJobInfo, setAssignTestJobInfo] =
    useState<AddRoleType>(defaultValues)
  const [assignRoleJobInfo, setAssignRoleJobInfo] =
    useState<AddRoleType>(defaultValues)

  const languageList = getGloLanguage()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<AddRoleType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(assignTestSchema),
  })

  const {
    control: roleControl,
    handleSubmit: handleRoleSubmit,
    reset: roleReset,

    trigger: roleTrigger,
    getValues: roleGetValues,
    formState: { errors: roleErrors },
  } = useForm<AddRoleType>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(assignTestSchema),
  })

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

  const { setModal } = useContext(ModalContext)

  const queryClient = useQueryClient()

  const appliedRoleActionMutation = useMutation(
    (value: {
      id: number
      reply: string
      reason?: string
      messageToUser?: string
    }) =>
      patchAppliedRole(
        value.id,
        value.reply,
        value.reason,
        value.messageToUser,
      ),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`applied-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
      },
    },
  )

  const patchTestStatusMutation = useMutation(
    (value: { id: number; status: string }) =>
      patchTestStatus(value.id, value.status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`applied-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
      },
    },
  )

  const addTestMutation = useMutation(
    (jobInfo: AddRolePayloadType[]) => addCreatedAppliedRole(jobInfo),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`applied-role-${variables[0].userId}`)
      },
    },
  )

  const deleteCommentMutation = useMutation(
    (value: { commentId: number }) => deleteCommentOnPro(value.commentId),
    {
      onSuccess: (data, variables) => {
        toast.error('Successfully deleted!', {
          position: 'bottom-left',

          icon: (
            <IconButton
              color='error'
              sx={{
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                padding: 0.6,
              }}
            >
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          ),
        })
        queryClient.invalidateQueries(`${id}`)
      },
    },
  )

  const editCommentMutation = useMutation(
    (value: { commentId: number; comment: string }) =>
      editCommentOnPro(value.commentId, value.comment),
    {
      onSuccess: (data, variables) => {
        toast.success('Successfully edited!', {
          position: 'bottom-right',
        })
        queryClient.invalidateQueries(`${id}`)
      },
    },
  )

  const addCommentMutation = useMutation(
    (value: { userId: number; comment: string }) =>
      addCommentOnPro(value.userId, value.comment),
    {
      onSuccess: (data, variables) => {
        toast.success('Successfully saved!', {
          position: 'bottom-right',
        })
        queryClient.invalidateQueries(`${id}`)
      },
    },
  )
  const handleChangeRolePage = (direction: string) => {
    // window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const changedPage =
      direction === 'prev'
        ? Math.max(rolePage - 1, 0)
        : direction === 'next'
        ? rolePage + 1
        : 0

    setRolePage(changedPage)
    setSelectedJobInfo(null)
  }

  const handleChangeCommentsProPage = (direction: string) => {
    // window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const changedPage =
      direction === 'prev'
        ? Math.max(commentsProPage - 1, 0)
        : direction === 'next'
        ? commentsProPage + 1
        : 0

    setCommentsProPage(changedPage)
  }

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  const handleHideFailedTestChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideFailedTest(event.target.checked)

    if (appliedRoleList) {
      if (event.target.checked) {
        let prevState = appliedRoleList

        const res = prevState.filter(
          (value: AppliedRoleType) =>
            !(
              value.testStatus === 'Skill failed' ||
              value.testStatus === 'Basic failed' ||
              value.requestStatus === 'Rejected' ||
              value.requestStatus === 'Paused'
            ),
        )
        console.log(res)

        prevState = res
        setAppliedRoleList(prevState)
      } else {
        let prevState = appliedRole!

        setAppliedRoleList(prevState)
      }
    }
  }

  const handleClickRoleCard = (jobInfo: AppliedRoleType) => {
    setSelectedJobInfo(jobInfo)
  }

  const handleCertifyRole = (id: number) => {
    appliedRoleActionMutation.mutate({
      id: id,
      reply: 'certify',
    })
  }

  const handleTestAssign = (id: number, status?: string) => {
    status === 'none'
      ? appliedRoleActionMutation.mutate({
          id: id,
          reply: 'assign_test',
        })
      : null
  }

  const handleRejectRole = (
    id: number,
    rejectReason: string,
    messageToUser: string,
  ) => {
    appliedRoleActionMutation.mutate({
      id: id,
      reply: 'reject',
      reason: rejectReason,
      messageToUser: messageToUser,
    })
  }

  const handlePauseRole = (
    id: number,
    pauseReason: string,
    messageToUser: string,
  ) => {
    appliedRoleActionMutation.mutate({
      id: id,
      reply: 'pause',
      reason: pauseReason,
      messageToUser: messageToUser,
    })
  }

  const handleResumeTest = (id: number) => {
    appliedRoleActionMutation.mutate({
      id: id,
      reply: 'resume',
    })
  }

  const handleActionBasicTest = (id: number, type: string) => {
    patchTestStatusMutation.mutate({ id: id, status: type })
  }

  const handleActionSkillTest = (id: number, status: string) => {
    patchTestStatusMutation.mutate({ id: id, status: status })
  }

  const onClickRejectOrPause = (jobInfo: AppliedRoleType, type: string) => {
    setModal(
      <NegativeActionsTestModal
        open={true}
        onClose={() => setModal(null)}
        type={type}
        jobInfo={jobInfo}
        userInfo={userInfo!}
        handleRejectRole={handleRejectRole}
        handlePauseRole={handlePauseRole}
      />,
    )
  }

  const onClickCertify = (jobInfo: AppliedRoleType) => {
    setActionId(jobInfo.id)
    setModal(
      <CertifyRoleModal
        open={true}
        onClose={() => setModal(null)}
        userInfo={jobInfo}
        handleCertifyRole={handleCertifyRole}
      />,
    )
  }

  const onClickResumeTest = (jobInfo: AppliedRoleType) => {
    setActionId(jobInfo.id)
    setModal(
      <ResumeTestModal
        open={true}
        onClose={() => setModal(null)}
        userInfo={jobInfo}
        handleResumeTest={handleResumeTest}
      />,
    )
  }

  const onClickReason = (type: string, message: string, reason: string) => {
    setModal(
      <ReasonModal
        open={true}
        onClose={() => setModal(null)}
        messageToUser={message}
        reason={reason}
        type={type}
      />,
    )
  }

  const onClickTestAssign = (jobInfo: AppliedRoleType, status?: string) => {
    setActionId(jobInfo.id)
    setModal(
      <TestAssignModal
        open={true}
        onClose={() => setModal(null)}
        status={status ?? 'none'}
        userInfo={jobInfo}
        handleAssignRole={handleTestAssign}
      />,
    )
  }

  const onClickBasicTestAction = (jobInfo: AppliedRoleType, type: string) => {
    setActionId(jobInfo.id)

    setModal(
      <BasicTestActionModal
        open={true}
        onClose={() => setModal(null)}
        userInfo={jobInfo}
        type={type}
        handleActionBasicTest={handleActionBasicTest}
      />,
    )
  }

  const onClickSkillTestAction = (jobInfo: AppliedRoleType, type: string) => {
    setActionId(jobInfo.id)
    setModal(
      <SkillTestActionModal
        open={true}
        onClose={() => setModal(null)}
        userInfo={jobInfo}
        type={type}
        handleActionSkillTest={handleActionSkillTest}
      />,
    )
  }

  const onClickAddRole = () => {
    setAppliedRoleModalOpen(true)
  }

  const onChangeJobInfo = (
    id: string,
    value: any,
    item: 'jobType' | 'role' | 'source' | 'target',
    type: string,
  ) => {
    if (type === 'test') {
      const filtered = jobInfoFields.filter(f => f.id! === id)[0]
      const index = jobInfoFields.findIndex(f => f.id! === id)
      let newVal = { ...filtered, [item]: value }
      if (item === 'jobType' && value === 'DTP') {
        newVal = { ...filtered, [item]: value, source: '', target: '' }
      }
      update(index, newVal)
      trigger('jobInfo')
    } else if (type === 'role') {
      const filtered = roleJobInfoFields.filter(f => f.id! === id)[0]
      const index = roleJobInfoFields.findIndex(f => f.id! === id)
      let newVal = { ...filtered, [item]: value }
      if (item === 'jobType' && value === 'DTP') {
        newVal = { ...filtered, [item]: value, source: '', target: '' }
      }
      roleUpdate(index, newVal)
      roleTrigger('jobInfo')
    }
  }

  const onClickTestDetails = (jobInfo: AppliedRoleType, type: string) => {
    setModal(
      <TestDetailsModal jobInfo={jobInfo} reviewerList={[]} type={type} />,
    )
  }

  const onClickAssignTest = (data: AddRoleType) => {
    console.log(data)
    setAssignTestJobInfo(data)
    setAssignTestModalOpen(true)
  }

  const onClickCancelTest = () => {
    setCancelTestModalOpen(true)
  }

  const handleAssignTest = (jobInfo: AddRoleType) => {
    const res = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      jobType: value.jobType,
      role: value.role,
      source: value.source,
      target: value.target,
    }))

    //** TODO : Assign 연결 */

    addTestMutation.mutate(res)
  }

  const onClickAssignRole = (data: AddRoleType) => {
    setAssignRoleJobInfo(data)
    setAssignRoleModalOpen(true)
  }
  const onClickCancelRole = () => {
    setCancelRoleModalOpen(true)
  }

  const handelAssignRole = (jobInfo: AddRoleType) => {
    console.log(jobInfo)
  }

  const onCloseModal = (type: string) => {
    type === 'test'
      ? reset({ jobInfo: [{ jobType: '', role: '', source: '', target: '' }] })
      : roleReset({
          jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
        })
    setAppliedRoleModalOpen(false)
  }

  const addJobInfo = (type: string) => {
    if (jobInfoFields.length >= 10 || roleJobInfoFields.length >= 10) {
      setModal(
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
            <Button variant='contained' onClick={() => setModal(null)}>
              Okay
            </Button>
          </Box>
        </Box>,
      )
      return
    }
    type === 'test'
      ? append({ jobType: '', role: '', source: '', target: '' })
      : roleAppend({ jobType: '', role: '', source: '', target: '' })
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

  const handleEditComment = () => {
    editCommentMutation.mutate({
      commentId: selectedComment!.id,
      comment: comment,
    })

    setClickedEditComment(false)

    setSelectedComment(null)
  }

  const handleEditCancelComment = () => {
    setClickedEditComment(false)

    setSelectedComment(null)
  }

  const handleAddComment = () => {
    setAddComment('')
    setClickedAddComment(false)
    addCommentMutation.mutate({ userId: userInfo!.userId, comment: addComment })
  }

  const handleAddCancelComment = () => {
    setAddComment('')
    setClickedAddComment(false)
  }

  const handleDeleteComment = (comment: CommentsOnProType) => {
    deleteCommentMutation.mutate({ commentId: comment.id })
  }

  const onClickEditConfirmComment = () => {
    setModal(
      <EditCommentModal
        open={true}
        onClose={() => setModal(null)}
        editComment={handleEditComment}
      />,
    )
  }

  const onClickEditCancelComment = () => {
    setModal(
      <CancelEditCommentModal
        open={true}
        onClose={() => setModal(null)}
        cancelEdit={handleEditCancelComment}
      />,
    )
  }

  const onClickAddConfirmComment = () => {
    setModal(
      <SaveCommentModal
        open={true}
        onClose={() => setModal(null)}
        saveComment={handleAddComment}
      />,
    )
  }

  const onClickAddCancelComment = () => {
    setModal(
      <CancelSaveCommentModal
        open={true}
        onClose={() => setModal(null)}
        cancelSave={handleAddCancelComment}
      />,
    )
  }

  const onClickDeleteComment = (comment: CommentsOnProType) => {
    setModal(
      <DeleteCommentModal
        open={true}
        onClose={() => setModal(null)}
        deleteComment={() => handleDeleteComment(comment)}
      />,
    )
  }

  const onClickEditComment = (comment: CommentsOnProType) => {
    setComment(comment.comment)
    setSelectedComment(comment)
    setClickedEditComment(true)
  }

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleAddCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddComment(event.target.value)
  }

  const onClickAddComment = () => {
    setClickedAddComment(true)
  }

  useEffect(() => {
    setAppliedRoleList(appliedRole!)
  }, [appliedRole])

  const onClickFile = (file: {
    id: number
    uri: string
    fileName: string
    fileType: string
  }) => {
    setModal(
      <FilePreviewDownloadModal
        open={true}
        onClose={() => setModal(null)}
        docs={[file]}
      />,
    )
  }

  return (
    <Grid container xs={12} spacing={6}>
      <AppliedRoleModal
        open={appliedRoleModalOpen}
        onClose={() => {
          reset({
            jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
          })
          setAppliedRoleModalOpen(false)
        }}
        jobInfoFields={jobInfoFields}
        roleJobInfoFields={roleJobInfoFields}
        control={control}
        errors={errors}
        onChangeJobInfo={onChangeJobInfo}
        languageList={languageList}
        addJobInfo={addJobInfo}
        removeJobInfo={removeJobInfo}
        getValues={getValues}
        handleSubmit={handleSubmit}
        onClickAssignTest={onClickAssignTest}
        onClickCancelTest={onClickCancelTest}
        onClickAssignRole={onClickAssignRole}
        onClickCancelRole={onClickCancelRole}
        roleControl={roleControl}
        handleRoleSubmit={handleRoleSubmit}
        roleGetValues={roleGetValues}
        roleErrors={roleErrors}
      />

      <AssignTestModal
        open={assignTestModalOpen}
        onClose={() => setAssignTestModalOpen(false)}
        onAssignClose={() => {
          onCloseModal('test')
        }}
        assignTest={handleAssignTest}
        jobInfo={assignTestJobInfo}
      />
      <CancelTestModal
        open={cancelTestModalOpen}
        onClose={() => setCancelTestModalOpen(false)}
        onCloseAssignTestModal={() => {
          onCloseModal('test')
        }}
      />

      <AssignRoleModal
        open={assignRoleModalOpen}
        onClose={() => setAssignRoleModalOpen(false)}
        onAssignClose={() => {
          onCloseModal('role')
        }}
        assignRole={handelAssignRole}
        jobInfo={assignRoleJobInfo}
      />
      <CancelRoleModal
        open={cancelRoleModalOpen}
        onClose={() => setCancelRoleModalOpen(false)}
        onCloseAssignRoleModal={() => {
          console.log('close')

          onCloseModal('role')
        }}
      />
      <Grid item xs={12}>
        <DesignedCard>
          <Card sx={{ padding: '24px' }}>
            <Box sx={{ position: 'relative', display: 'flex', gap: '30px' }}>
              <Card>
                <img
                  width={110}
                  height={110}
                  src={getProfileImg('TAD')}
                  alt=''
                />
              </Card>
              <Box sx={{ alignSelf: 'self-end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Typography variant='h5'>
                    {getLegalName(userInfo!)}
                  </Typography>
                  <img
                    width={32}
                    height={32}
                    src={
                      userInfo!.isOnboarded && userInfo!.isActive
                        ? `/images/icons/onboarding-icons/pro-active.png`
                        : !userInfo!.isOnboarded
                        ? `/images/icons/onboarding-icons/pro-onboarding.png`
                        : userInfo!.isOnboarded && !userInfo!.isActive
                        ? `/images/icons/onboarding-icons/pro-inactive.png`
                        : ''
                    }
                    alt='onboarding'
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'rgba(76, 78, 100, 0.6)',
                  }}
                >
                  {userInfo!.legalNamePronunciation
                    ? userInfo!.legalNamePronunciation
                    : '-'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </DesignedCard>
      </Grid>
      <Grid
        item
        xs={5}
        gap='24px'
        display='flex'
        direction='column'
        height='100%'
      >
        <Grid item xs={12}>
          <About userInfo={userInfo!} />
        </Grid>
        <Grid item xs={12}>
          <CertifiedRole userInfo={certifiedRole!} />
        </Grid>
        <Grid item xs={12}>
          <NoteFromPro userInfo={userInfo!} />
        </Grid>
      </Grid>

      <Grid item xs={7} display='flex' gap='24px' direction='column'>
        <Grid item xs={12} display='flex' gap='24px'>
          <Grid item xs={6}>
            <Resume userInfo={userInfo!} onClickResume={onClickFile} />
          </Grid>
          <Grid item xs={6}>
            <Experience userInfo={userInfo!} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Suspense>
            <AppliedRole
              userInfo={appliedRoleList!}
              hideFailedTest={hideFailedTest}
              handleHideFailedTestChange={handleHideFailedTestChange}
              selectedJobInfo={selectedJobInfo}
              handleClickRoleCard={handleClickRoleCard}
              page={rolePage}
              rowsPerPage={roleRowsPerPage}
              handleChangePage={handleChangeRolePage}
              offset={roleOffset}
              onClickCertify={onClickCertify}
              onClickTestAssign={onClickTestAssign}
              onClickAddRole={onClickAddRole}
              onClickRejectOrPause={onClickRejectOrPause}
              onClickReason={onClickReason}
              onClickResumeTest={onClickResumeTest}
            />
          </Suspense>
        </Grid>

        <Grid item xs={12}>
          <CertificationTest
            userInfo={userInfo!}
            selectedJobInfo={selectedJobInfo}
            onClickBasicTestAction={onClickBasicTestAction}
            onClickTestDetails={onClickTestDetails}
            onClickCertify={onClickCertify}
            onClickSkillTestAction={onClickSkillTestAction}
          />
        </Grid>
        <Grid item xs={12}>
          <CommentsAboutPro
            userInfo={userInfo!.commentsOnPro!}
            user={userInfo}
            page={commentsProPage}
            rowsPerPage={commentsProRowsPerPage}
            handleChangePage={handleChangeCommentsProPage}
            offset={commentsProOffset}
            userId={user!.id}
            onClickEditConfirmComment={onClickEditConfirmComment}
            setClickedEditComment={setClickedEditComment}
            clickedEditComment={clickedEditComment}
            onClickEditComment={onClickEditComment}
            selectedComment={selectedComment}
            handleCommentChange={handleCommentChange}
            onClickEditCancelComment={onClickEditCancelComment}
            comment={comment}
            onClickAddComment={onClickAddComment}
            clickedAddComment={clickedAddComment}
            onClickAddConfirmComment={onClickAddConfirmComment}
            onClickAddCancelComment={onClickAddCancelComment}
            handleAddCommentChange={handleAddCommentChange}
            onClickDeleteComment={onClickDeleteComment}
            addComment={addComment}
          />
        </Grid>

        <Grid item xs={12} display='flex' gap='24px'>
          <Grid item xs={6}>
            <Contracts userInfo={userInfo!} onClickContracts={onClickFile} />
          </Grid>
          <Grid item xs={6}>
            <Specialties userInfo={userInfo!} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

// ** TODO : 렐,백엔드와 논의 후 수정
OnboardingDetails.acl = {
  subject: 'onboarding',
  action: 'read',
}

const DesignedCard = styled(Card)`
  position: relative;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)
      ),
      #666cff;
  }
`

export default OnboardingDetails
