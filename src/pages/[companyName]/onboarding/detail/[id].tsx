import { Card, Divider, Grid, Typography } from '@mui/material'

import { useRouter } from 'next/router'

import { Box, styled } from '@mui/system'
import toast from 'react-hot-toast'

import { ChangeEvent, Suspense, useContext, useEffect, useState } from 'react'
import {
  AddRolePayloadType,
  AddRoleType,
  CommentsOnProType,
} from '@src/types/onboarding/list'
import { useMutation, useQueryClient } from 'react-query'

import TestDetailsModal from '../../components/pro-detail-modal/dialog/test-details-modal'

import {
  useGetAppliedRole,
  useGetCertifiedRole,
  useGetOnboardingProDetails,
} from '@src/queries/onboarding/onboarding-query'
import AppliedRoleModal from '../../components/pro-detail-modal/dialog/applied-role-modal'
import { RoleType } from '@src/context/types'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

import { getLegalName } from '@src/shared/helpers/legalname.helper'
import FallbackSpinner from '@src/@core/components/spinner'
import Icon from '@src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

import { AppliedRoleType, TestType } from '@src/types/onboarding/details'
import {
  addCommentOnPro,
  addCreateProAppliedRole,
  addCreateProAppliedTest,
  deleteCommentOnPro,
  editCommentOnPro,
  patchAppliedRole,
  patchTestStatus,
} from '@src/apis/onboarding.api'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

import About from 'src/pages/[companyName]/components/pro-detail-component/about'
import AppliedRole from 'src/pages/[companyName]/components/pro-detail-component/applied-role'
import CertifiedRole from 'src/pages/[companyName]/components/pro-detail-component/certified-role'
import CommentsAboutPro from 'src/pages/[companyName]/components/pro-detail-component/comments-pro'
import Experience from 'src/pages/[companyName]/components/pro-detail-component/experience'
import NoteFromPro from 'src/pages/[companyName]/components/pro-detail-component/note-pro'
import Resume from 'src/pages/[companyName]/components/pro-detail-component/resume'
import Specialties from 'src/pages/[companyName]/components/pro-detail-component/specialities'

import FilePreviewDownloadModal from 'src/pages/[companyName]/components/pro-detail-modal/modal/file-preview-download-modal'
import NegativeActionsTestModal from 'src/pages/[companyName]/components/pro-detail-modal/modal/negative-actions-test-modal'
import ReasonModal from 'src/pages/[companyName]/components/pro-detail-modal/modal/reason-modal'

import Contracts from 'src/pages/[companyName]/components/pro-detail-component/contracts'
import CertificationTest from 'src/pages/[companyName]/components/pro-detail-component/certification-test'

import { AbilityContext } from '@src/layouts/components/acl/Can'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import languageHelper from '@src/shared/helpers/language.helper'
import ProClients from '../../components/pro-detail-component/pro-clients'
import ProClientsHistory from '../../components/pro-detail-component/pro-clients-history'
import SecondaryLanguages from '../../components/pro-detail-component/secondary-languages'
import {
  useGetProClients,
  useGetProSecondaryLanguages,
} from '@src/queries/pro/pro-details.query'
import EditClientsModal from '@src/views/pro/overview/edit-clients-modal'

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
    refetch,
  } = useGetOnboardingProDetails(Number(id!))

  const { data: appliedRole } = useGetAppliedRole(Number(id!))
  const { data: certifiedRole } = useGetCertifiedRole(Number(id!))
  const { data: secondaryLanguages } = useGetProSecondaryLanguages(Number(id!))
  const { data: clients } = useGetProClients(Number(id!))

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

  const [clickedEditComment, setClickedEditComment] = useState(false)
  const [selectedComment, setSelectedComment] =
    useState<CommentsOnProType | null>(null)
  const [comment, setComment] = useState<string>('')
  const [addComment, setAddComment] = useState<string>('')
  const [clickedAddComment, setClickedAddComment] = useState(false)

  const languageList = getGloLanguage()

  const { openModal, closeModal } = useModal()

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
    (jobInfo: AddRolePayloadType[]) => addCreateProAppliedRole(jobInfo),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`applied-role-${variables[0].userId}`)
        closeModal('AssignRoleModal')
        queryClient.invalidateQueries(['onboarding-pro-details'])
      },
    },
  )

  const addRoleMutation = useMutation(
    (jobInfo: AddRolePayloadType[]) => addCreateProAppliedTest(jobInfo),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
        closeModal('AssignRoleModal')
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

  useEffect(() => {
    refetch()
  }, [id])
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
    console.log(id)

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
    openModal({
      type: 'NegativeActionsTestModal',
      children: (
        <NegativeActionsTestModal
          onClose={() => closeModal('NegativeActionsTestModal')}
          type={type}
          jobInfo={jobInfo}
          userInfo={userInfo!}
          handleRejectRole={handleRejectRole}
          handlePauseRole={handlePauseRole}
          vary='error'
        />
      ),
    })
  }

  const onClickCertify = (jobInfo: AppliedRoleType) => {
    setActionId(jobInfo.id)
    openModal({
      type: 'CertifyRoleModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure you want to certify this role?
              <Typography variant='body2' fontWeight={600}>
                {jobInfo.jobType}, {jobInfo.role},{' '}
                {jobInfo.source &&
                jobInfo.target &&
                jobInfo.source !== '' &&
                jobInfo.target !== '' ? (
                  <>
                    {jobInfo.source.toUpperCase()} &rarr;{' '}
                    {jobInfo.target.toUpperCase()}
                  </>
                ) : (
                  ''
                )}
              </Typography>
            </>
          }
          onClose={() => closeModal('CertifyRoleModal')}
          vary='successful'
          onClick={() => {
            closeModal('CertifyRoleModal')
            handleCertifyRole(jobInfo.id)
          }}
          rightButtonText='Certify'
        />
      ),
    })
  }

  const onClickResumeTest = (jobInfo: AppliedRoleType) => {
    setActionId(jobInfo.id)
    openModal({
      type: 'ResumeTestModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure you want to resume this test?
              <Typography variant='body2' fontWeight={600}>
                {jobInfo.jobType}, {jobInfo.role},{' '}
                {jobInfo.source &&
                jobInfo.target &&
                jobInfo.source !== '' &&
                jobInfo.target !== '' ? (
                  <>
                    {jobInfo.source.toUpperCase()} &rarr;{' '}
                    {jobInfo.target.toUpperCase()}
                  </>
                ) : (
                  ''
                )}
              </Typography>
            </>
          }
          onClose={() => closeModal('ResumeTestModal')}
          vary='successful'
          onClick={() => {
            closeModal('ResumeTestModal')
            handleCertifyRole(jobInfo.id)
          }}
          rightButtonText='Resume'
        />
      ),
    })
  }

  const onClickReason = (type: string, message: string, reason: string) => {
    openModal({
      type: 'ReasonModal',
      children: (
        <ReasonModal
          onClose={() => closeModal('ReasonModal')}
          type={type}
          messageToUser={message}
          reason={reason}
        />
      ),
    })
  }

  const onClickTestAssign = (jobInfo: AppliedRoleType, status?: string) => {
    setActionId(jobInfo.id)

    openModal({
      type: 'TestAssignModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure you want to assign this test?
              <Typography
                variant='body2'
                sx={{ fontWeight: 600, fontSize: '16px', textAlign: 'center' }}
              >
                {jobInfo.jobType}, {jobInfo.role},{' '}
                {jobInfo.source &&
                jobInfo.target &&
                jobInfo.source !== '' &&
                jobInfo.target !== '' ? (
                  <>
                    {jobInfo.source.toUpperCase()} &rarr;{' '}
                    {jobInfo.target.toUpperCase()}
                  </>
                ) : (
                  ''
                )}
              </Typography>
            </>
          }
          onClose={() => closeModal('TestAssignModal')}
          vary='successful'
          onClick={() => {
            closeModal('TestAssignModal')
            handleTestAssign(jobInfo.id, status ?? 'none')
          }}
          rightButtonText='Assign'
        />
      ),
    })
  }

  const onClickBasicTestAction = (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => {
    setActionId(id)

    openModal({
      type: 'BasicTestActionModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure&nbsp;
              {type === 'Skipped'
                ? 'you want to skip'
                : type === 'Basic test Ready'
                  ? 'you want to proceed'
                  : type === 'Basic failed'
                    ? 'you want to fail'
                    : type === 'Basic passed'
                      ? 'to proceed'
                      : null}
              &nbsp;this basic test?
              <Typography
                variant='body2'
                sx={{ fontWeight: 600, fontSize: '16px', textAlign: 'center' }}
              >
                {basicTest.targetLanguage && basicTest.targetLanguage !== '' ? (
                  <>
                    {basicTest.targetLanguage.toUpperCase()}&nbsp;
                    {`(${languageHelper(basicTest.targetLanguage)})`}
                  </>
                ) : (
                  ''
                )}
              </Typography>
            </>
          }
          onClose={() => closeModal('BasicTestActionModal')}
          vary={type === 'Basic failed' ? 'error' : 'successful'}
          onClick={() => {
            closeModal('BasicTestActionModal')
            if (type === 'Skipped' || type === 'Basic passed') {
              handleActionBasicTest(basicTest.testId, type)
            } else {
              // handleActionBasicTest(basicTest.testId, type)
              handleActionBasicTest(id, type)
            }
          }}
          rightButtonText={
            type === 'Skipped'
              ? 'Skip'
              : type === 'Basic test Ready'
                ? 'Proceed'
                : type === 'Basic failed'
                  ? 'Fail'
                  : type === 'Basic passed'
                    ? 'Pass'
                    : ''
          }
        />
      ),
    })
  }

  const handleAssignTest = (jobInfo: AddRoleType) => {
    const res: AddRolePayloadType[] = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      jobType: value.jobType.label,
      role: value.role.label,
      source: value.source?.value ?? null,
      target: value.target?.value ?? null,
    }))

    addTestMutation.mutate(res)
  }

  const handleAssignRole = (jobInfo: AddRoleType) => {
    const res: AddRolePayloadType[] = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      userEmail: userInfo!.email,
      firstName: userInfo!.firstName,
      middleName: userInfo!.middleName,
      lastName: userInfo!.lastName,
      jobType: value.jobType.label,
      role: value.role.label,
      source: value.source?.value ?? null,
      target: value.target?.value ?? null,
    }))

    addRoleMutation.mutate(res)
  }

  const onClickSkillTestAction = (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => {
    setActionId(id)
    openModal({
      type: 'SkillTestActionModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure you want to&nbsp;
              {type === 'Awaiting assignment' ? (
                'cancel this skill test?'
              ) : type === 'Cancelled' ? (
                'cancel this skill test?'
              ) : type === 'Skill test Ready' ? (
                'proceed this skill test?'
              ) : type === 'Skill failed' ? (
                <>
                  <span
                    style={{
                      color: '#666CFF',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    fail
                  </span>
                  &nbsp;this Pro
                </>
              ) : null}
            </>
          }
          vary={
            type === 'Awaiting assignment' ||
            type === 'Skill failed' ||
            type === 'Cancelled'
              ? 'error'
              : 'successful'
          }
          onClose={() => closeModal('SkillTestActionModal')}
          onClick={() => {
            closeModal('SkillTestActionModal')

            handleActionSkillTest(id, type)
          }}
          rightButtonText={
            type === 'Awaiting assignment'
              ? 'Cancel'
              : type === 'Skill test Ready'
                ? 'Proceed'
                : type === 'Skill failed'
                  ? 'Fail'
                  : type === 'Cancelled'
                    ? 'Cancel'
                    : ''
          }
          leftButtonText={
            type === 'Awaiting assignment'
              ? 'No'
              : type === 'Skill test Ready'
                ? 'Cancel'
                : type === 'Skill failed'
                  ? 'Cancel'
                  : type === 'Cancelled'
                    ? 'No'
                    : ''
          }
        />
      ),
    })
  }

  const onClickAddRole = () => {
    openModal({
      type: 'AssignRoleModal',
      children: (
        <AppliedRoleModal
          onClose={() => {
            closeModal('AssignRoleModal')
          }}
          languageList={languageList}
          proId={Number(id)}
          handleAssignTest={handleAssignTest}
          handleAssignRole={handleAssignRole}
        />
      ),
    })
    // setAppliedRoleModalOpen(true)
  }

  const onClickTestDetails = (skillTest: TestType, type: string) => {
    openModal({
      type: 'TestDetailsModal',
      children: (
        <TestDetailsModal
          skillTest={skillTest}
          // reviewerList={reviewerList!}
          // history={history!}
          onClose={() => closeModal('TestDetailsModal')}
          type={type}
          user={auth.getValue().user!}
        />
      ),
    })
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
    openModal({
      type: 'EditCommentModal',
      children: (
        <CustomModal
          title='Are you sure to edit this comment?'
          onClose={() => closeModal('EditCommentModal')}
          onClick={() => {
            closeModal('EditCommentModal')
            handleEditComment()
          }}
          vary='successful'
          rightButtonText='Confirm'
        />
      ),
    })
  }

  const onClickEditCancelComment = () => {
    openModal({
      type: 'CancelEditCommentModal',
      children: (
        <CustomModal
          title='Are you sure to cancel the edit of this comment?'
          onClose={() => closeModal('CancelEditCommentModal')}
          onClick={() => {
            closeModal('CancelEditCommentModal')
            handleEditCancelComment()
          }}
          vary='error'
          rightButtonText='Confirm'
        />
      ),
    })
  }

  const onClickAddConfirmComment = () => {
    openModal({
      type: 'SaveCommentModal',
      children: (
        <CustomModal
          title='Are you sure to save this comment?'
          onClose={() => closeModal('SaveCommentModal')}
          onClick={() => {
            closeModal('SaveCommentModal')
            handleAddComment()
          }}
          vary='successful'
          rightButtonText='Confirm'
        />
      ),
    })
  }

  const onClickAddCancelComment = () => {
    openModal({
      type: 'CancelSaveCommentModal',
      children: (
        <CustomModal
          title='Are you sure you want to discard this comment?'
          onClose={() => closeModal('CancelSaveCommentModal')}
          onClick={() => {
            closeModal('CancelSaveCommentModal')
            handleAddCancelComment()
          }}
          vary='error'
          rightButtonText='Discard'
        />
      ),
    })
  }

  const onClickDeleteComment = (comment: CommentsOnProType) => {
    openModal({
      type: 'DeleteCommentModal',
      children: (
        <CustomModal
          title='Are you sure to delete this comment?'
          onClose={() => closeModal('DeleteCommentModal')}
          onClick={() => {
            closeModal('DeleteCommentModal')
            handleDeleteComment(comment)
          }}
          vary='error'
          rightButtonText='Delete'
        />
      ),
    })
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
        url: res,
        fileName: file.fileName,
        fileExtension: file.fileExtension,
      }
      openModal({
        type: 'FilePreviewDownloadModal',
        children: (
          <FilePreviewDownloadModal
            onClose={() => closeModal('FilePreviewDownloadModal')}
            docs={[file]}
          />
        ),
      })
    })
  }

  const onClickEditClients = () => {
    openModal({
      type: 'EditClientsModal',
      children: (
        <EditClientsModal
          clients={clients ?? []}
          userId={Number(id!)}
          onClose={() => closeModal('EditClientsModal')}
        />
      ),
    })
  }

  return (
    <Grid container xs={12} spacing={6}>
      {/* <AssignTestModal
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
      /> */}
      {isFetched && !isError && userInfo ? (
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
                      src={getProfileImg('PRO')}
                      alt=''
                    />
                  </Card>

                  <Box
                    display='flex'
                    alignItems='center'
                    alignSelf='self-end'
                    gap='8px'
                    flexDirection='column'
                  >
                    <Box
                      display='flex'
                      alignItems='center'
                      alignSelf='self-end'
                      gap='8px'
                      height='32px'
                    >
                      <Typography variant='h5'>
                        {getLegalName({
                          firstName: userInfo.firstName,
                          lastName: userInfo.lastName,
                          middleName: userInfo.middleName,
                        })}
                      </Typography>
                      <Typography
                        fontSize={16}
                        fontWeight={400}
                        color='#8D8E9A'
                      >
                        {userInfo?.legalNamePronunciation
                          ? `(${userInfo?.legalNamePronunciation})`
                          : '-'}
                      </Typography>
                      <Box display='flex' width='24px' height='24px'>
                        <img
                          alt=''
                          aria-hidden
                          src={
                            userInfo.isOnboarded && userInfo.isActive
                              ? `/images/icons/onboarding-icons/icon-pro-onboarding.svg`
                              : !userInfo.isOnboarded
                                ? `/images/icons/onboarding-icons/pro-onboarding.png`
                                : userInfo.isOnboarded && !userInfo.isActive
                                  ? `/images/icons/onboarding-icons/pro-inactive.png`
                                  : ''
                          }
                        />
                      </Box>

                      <Divider
                        orientation='vertical'
                        flexItem
                        variant='middle'
                        sx={{
                          color: 'rgba(76, 78, 100, 0.60)',
                          borderWidth: 1,
                        }}
                      />
                      <Typography variant='body2' fontSize={16}>
                        {userInfo.email}
                      </Typography>
                    </Box>
                    <Typography
                      fontSize={16}
                      fontWeight={600}
                      color='rgba(76, 78, 100, 0.6)'
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {userInfo?.experience
                        ? `${userInfo?.experience} of experience`
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
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <Resume userInfo={userInfo!} onClickResume={onClickFile} />
                  </Grid>
                  <Grid item xs={6}>
                    <Contracts
                      userInfo={userInfo!}
                      onClickContracts={onClickFile}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <ProClients
                      onClickEditClients={onClickEditClients}
                      clients={clients ?? []}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ProClientsHistory
                      history={userInfo?.clientHistory ?? []}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6}>
                  <Grid item xs={6}>
                    <Specialties userInfo={userInfo!} />
                  </Grid>
                  <Grid item xs={6}>
                    <SecondaryLanguages
                      secondaryLanguages={secondaryLanguages ?? []}
                    />
                  </Grid>
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
