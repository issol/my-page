import { Card, Grid, Typography } from '@mui/material'

import { useRouter } from 'next/router'

import { Box } from '@mui/system'

import styled from 'styled-components'
import toast from 'react-hot-toast'

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
import TestDetailsModal from '../../components/pro-detail-modal/dialog/test-details-modal'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  useGetAppliedRole,
  useGetCertifiedRole,
  useGetOnboardingProDetails,
} from 'src/queries/onboarding/onboarding-query'
import AppliedRoleModal from '../../components/pro-detail-modal/dialog/applied-role-modal'
import { RoleType } from 'src/context/types'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import Button from '@mui/material/Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { assignTestSchema } from 'src/types/schema/onboarding.schema'

import { getLegalName } from 'src/shared/helpers/legalname.helper'
import FallbackSpinner from 'src/@core/components/spinner'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

import { AppliedRoleType, TestType } from 'src/types/onboarding/details'
import {
  addCommentOnPro,
  addCreatedAppliedRole,
  deleteCommentOnPro,
  editCommentOnPro,
  patchAppliedRole,
  patchTestStatus,
  setCertifiedRole,
} from 'src/apis/onboarding.api'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import modal from '@src/@core/components/modal'

import About from '@src/pages/components/pro-detail-component/about'
import AppliedRole from '@src/pages/components/pro-detail-component/applied-role'
import CertifiedRole from '@src/pages/components/pro-detail-component/certified-role'
import CommentsAboutPro from '@src/pages/components/pro-detail-component/comments-pro'
import Experience from '@src/pages/components/pro-detail-component/experience'
import NoteFromPro from '@src/pages/components/pro-detail-component/note-pro'
import Resume from '@src/pages/components/pro-detail-component/resume'
import Specialties from '@src/pages/components/pro-detail-component/specialities'
import AssignRoleModal from '@src/pages/components/pro-detail-modal/modal/assign-role-modal'
import AssignTestModal from '@src/pages/components/pro-detail-modal/modal/assign-test.modal'
import BasicTestActionModal from '@src/pages/components/pro-detail-modal/modal/basic-test-action-modal'
import CancelSaveCommentModal from '@src/pages/components/pro-detail-modal/modal/cancel-comment-modal'
import CancelRoleModal from '@src/pages/components/pro-detail-modal/modal/cancel-role-modal'
import CancelTestModal from '@src/pages/components/pro-detail-modal/modal/cancel-test-modal'
import CertifyRoleModal from '@src/pages/components/pro-detail-modal/modal/certify-role-modal'
import DeleteCommentModal from '@src/pages/components/pro-detail-modal/modal/delete-comment-modal'
import CancelEditCommentModal from '@src/pages/components/pro-detail-modal/modal/edit-cancel-comment-modal'
import EditCommentModal from '@src/pages/components/pro-detail-modal/modal/edit-comment-modal'
import FilePreviewDownloadModal from '@src/pages/components/pro-detail-modal/modal/file-preview-download-modal'
import NegativeActionsTestModal from '@src/pages/components/pro-detail-modal/modal/negative-actions-test-modal'
import ReasonModal from '@src/pages/components/pro-detail-modal/modal/reason-modal'
import ResumeTestModal from '@src/pages/components/pro-detail-modal/modal/resume-test-modal'
import SaveCommentModal from '@src/pages/components/pro-detail-modal/modal/save-comment-modal'
import SkillTestActionModal from '@src/pages/components/pro-detail-modal/modal/skill-test-action-modal'
import TestAssignModal from '@src/pages/components/pro-detail-modal/modal/test-assign-modal'
import Contracts from '@src/pages/components/pro-detail-component/contracts'
import CertificationTest from '@src/pages/components/pro-detail-component/certification-test'
import logger from '@src/@core/utils/logger'

import { AbilityContext } from '@src/layouts/components/acl/Can'
import { getDownloadUrlforCommon } from 'src/apis/common.api'

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

  const {
    data: userInfo,
    isError,
    isFetched,
  } = useGetOnboardingProDetails(Number(id!))

  const { data: appliedRole } = useGetAppliedRole(Number(id!))
  const { data: certifiedRole } = useGetCertifiedRole(Number(id!))

  const auth = useRecoilValueLoadable(authState)
  const ability = useContext(AbilityContext)

  const [hideFailedTest, setHideFailedTest] = useState(false)

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
        // queryClient.invalidateQueries(`applied-role-${userInfo?.userId}`)
        // queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(['onboarding-pro-details'])
      },
    },
  )

  const patchTestStatusMutation = useMutation(
    (value: { id: number; status: string }) =>
      patchTestStatus(value.id, value.status),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`applied-role-${userInfo?.userId}`)
        // queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(['onboarding-pro-details'])
      },
    },
  )

  const addTestMutation = useMutation(
    (jobInfo: AddRolePayloadType[]) => addCreatedAppliedRole(jobInfo),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`applied-role-${variables[0].userId}`)
        queryClient.invalidateQueries(['onboarding-pro-details'])
      },
    },
  )

  const addRoleMutation = useMutation(
    (jobInfo: AddRolePayloadType[]) => setCertifiedRole(jobInfo),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(['onboarding-pro-details'])
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
        queryClient.invalidateQueries(['onboarding-pro-details'])
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
        queryClient.invalidateQueries(['onboarding-pro-details'])
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
        queryClient.invalidateQueries(['onboarding-pro-details'])
      },
    },
  )
  const handleChangeRolePage = (direction: string) => {
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
    setActionId(0)
    setSelectedJobInfo(null)

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

  const handleActionBasicTest = (
    id: number,
    type: string,
    skillTestId?: number,
    skillTestStatus?: string,
  ) => {
    patchTestStatusMutation.mutate(
      {
        id: id,
        status: type,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['Applied-roles'])
        },
      },
    )
  }

  const handleActionSkillTest = (id: number, status: string) => {
    patchTestStatusMutation.mutate(
      { id: id, status: status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['Applied-roles'])
        },
      },
    )
  }

  const onClickRejectOrPause = (jobInfo: AppliedRoleType, type: string) => {
    setActionId(jobInfo.id)
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

  const onClickBasicTestAction = (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => {
    setActionId(id)

    setModal(
      <BasicTestActionModal
        open={true}
        onClose={() => setModal(null)}
        skillTest={skillTest}
        basicTest={basicTest}
        type={type}
        handleActionBasicTest={handleActionBasicTest}
      />,
    )
  }

  const onClickSkillTestAction = (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => {
    setActionId(id)
    setModal(
      <SkillTestActionModal
        open={true}
        onClose={() => setModal(null)}
        skillTest={skillTest}
        basicTest={basicTest}
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
      if (item === 'role' && (value === 'DTPer' || value === 'DTP QCer')) {
        newVal = { ...filtered, [item]: value, source: '', target: '' }
      }
      update(index, newVal)
      trigger('jobInfo')
    } else if (type === 'role') {
      const filtered = roleJobInfoFields.filter(f => f.id! === id)[0]
      const index = roleJobInfoFields.findIndex(f => f.id! === id)
      let newVal = { ...filtered, [item]: value }
      if (item === 'role' && (value === 'DTPer' || value === 'DTP QCer')) {
        newVal = { ...filtered, [item]: value, source: '', target: '' }
      }
      roleUpdate(index, newVal)
      roleTrigger('jobInfo')
    }
  }

  const onClickTestDetails = (skillTest: TestType, type: string) => {
    setModal(
      <TestDetailsModal
        skillTest={skillTest}
        // reviewerList={reviewerList!}
        // history={history!}
        type={type}
        user={auth.getValue().user!}
      />,
    )
  }

  const onClickAssignTest = (data: AddRoleType) => {
    setAssignTestJobInfo(data)
    setAssignTestModalOpen(true)
  }

  const onClickCancelTest = () => {
    setCancelTestModalOpen(true)
  }

  const handleAssignTest = (jobInfo: AddRoleType) => {
    const res: AddRolePayloadType[] = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      jobType: value.jobType,
      role: value.role,
      source: value.source,
      target: value.target,
    }))

    // console.log(res)

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
    const res: AddRolePayloadType[] = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      userEmail: userInfo!.email,
      firstName: userInfo!.firstName,
      middleName: userInfo!.middleName,
      lastName: userInfo!.lastName,
      jobType: value.jobType,
      role: value.role,
      source: value.source,
      target: value.target,
    }))

    addRoleMutation.mutate(res)
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
    if (actionId > 0) {
      const res = appliedRole?.find(value => value.id === actionId)
      // console.log(res)

      handleClickRoleCard(res!)
    }
  }, [appliedRole])

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
      const previewFile = {
        url: res.url,
        fileName: file.fileName,
        fileExtension: file.fileExtension,
      }
      setModal(
        <FilePreviewDownloadModal
          open={true}
          onClose={() => setModal(null)}
          docs={[previewFile]}
        />,
      )
    })
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
          // console.log('close')

          onCloseModal('role')
        }}
      />
      {isFetched && !isError ? (
        <>
          <Grid item xs={12}>
            <DesignedCard>
              <Card sx={{ padding: '24px' }}>
                <Box
                  sx={{ position: 'relative', display: 'flex', gap: '30px' }}
                >
                  <Card>
                    <img
                      width={110}
                      height={110}
                      src={getProfileImg('TAD')}
                      alt=''
                    />
                  </Card>
                  <Box sx={{ alignSelf: 'self-end' }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
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
                            ? `/images/icons/onboarding-icons/pro-onboarding.svg`
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
            xs={4}
            gap='24px'
            display='flex'
            direction='column'
            height='100%'
          >
            <Grid item xs={12}>
              <About
                userInfo={{
                  preferredName: userInfo?.preferredName!,
                  preferredNamePronunciation:
                    userInfo?.preferredNamePronunciation!,
                  pronounce: userInfo?.pronounce!,
                  email: userInfo?.email!,
                  timezone: userInfo?.timezone!,
                  mobilePhone: userInfo?.mobilePhone!,
                  telephone: userInfo?.telephone!,
                  status: userInfo?.status!,
                  address:
                    userInfo?.addresses && userInfo.addresses.length > 0
                      ? userInfo.addresses[0]
                      : null,
                }}
                type='onboarding'
              />
            </Grid>
            <Grid item xs={12}>
              <CertifiedRole userInfo={certifiedRole!} />
            </Grid>
            <Grid item xs={12}>
              <NoteFromPro userInfo={userInfo!} />
            </Grid>
          </Grid>

          <Grid item xs={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
              }}
            >
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
                    totalCount={appliedRole?.length!}
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
                    type='onboarding'
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
                  userInfo={userInfo!}
                  user={auth.getValue().user!}
                  page={commentsProPage}
                  rowsPerPage={commentsProRowsPerPage}
                  handleChangePage={handleChangeCommentsProPage}
                  offset={commentsProOffset}
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
                  ability={ability}
                />
              </Grid>
              <Grid item xs={12} display='flex' gap='24px'>
                <Grid item xs={6}>
                  <Contracts
                    userInfo={userInfo!}
                    onClickContracts={onClickFile}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Specialties userInfo={userInfo!} />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </>
      ) : null}
    </Grid>
  )
}

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
