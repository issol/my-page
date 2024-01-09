import {
  Card,
  CardHeader,
  Grid,
  SelectChangeEvent,
  Typography,
} from '@mui/material'

import { useRouter } from 'next/router'

import { Box } from '@mui/system'

import styled from 'styled-components'
import toast from 'react-hot-toast'

import { ChangeEvent, Suspense, useContext, useEffect, useState } from 'react'
import {
  AddRolePayloadType,
  AddRoleType,
  CommentsOnProType,
} from '@src/types/onboarding/list'
import { useMutation, useQueryClient } from 'react-query'

import { ModalContext } from '@src/context/ModalContext'

import { RoleType } from '@src/context/types'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'

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
import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import NegativeActionsTestModal from '@src/pages/components/pro-detail-modal/modal/negative-actions-test-modal'
import CertifyRoleModal from '@src/pages/components/pro-detail-modal/modal/certify-role-modal'
import ResumeTestModal from '@src/pages/components/pro-detail-modal/modal/resume-test-modal'
import AppliedRoleModal from '@src/pages/components/pro-detail-modal/dialog/applied-role-modal'
import TestDetailsModal from '@src/pages/components/pro-detail-modal/dialog/test-details-modal'

import BasicTestActionModal from '@src/pages/components/pro-detail-modal/modal/basic-test-action-modal'
import CancelSaveCommentModal from '@src/pages/components/pro-detail-modal/modal/cancel-comment-modal'

import DeleteCommentModal from '@src/pages/components/pro-detail-modal/modal/delete-comment-modal'
import CancelEditCommentModal from '@src/pages/components/pro-detail-modal/modal/edit-cancel-comment-modal'
import EditCommentModal from '@src/pages/components/pro-detail-modal/modal/edit-comment-modal'
import FilePreviewDownloadModal from '@src/pages/components/pro-detail-modal/modal/file-preview-download-modal'
import ReasonModal from '@src/pages/components/pro-detail-modal/modal/reason-modal'
import SaveCommentModal from '@src/pages/components/pro-detail-modal/modal/save-comment-modal'
import SkillTestActionModal from '@src/pages/components/pro-detail-modal/modal/skill-test-action-modal'
import TestAssignModal from '@src/pages/components/pro-detail-modal/modal/test-assign-modal'
import About from '@src/pages/components/pro-detail-component/about'
import AppliedRole from '@src/pages/components/pro-detail-component/applied-role'

import CommentsAboutPro from '@src/pages/components/pro-detail-component/comments-pro'
import Experience from '@src/pages/components/pro-detail-component/experience'
import NoteFromPro from '@src/pages/components/pro-detail-component/note-pro'
import Resume from '@src/pages/components/pro-detail-component/resume'
import Specialties from '@src/pages/components/pro-detail-component/specialities'
import Contracts from '@src/pages/components/pro-detail-component/contracts'
import CertificationTest from '@src/pages/components/pro-detail-component/certification-test'
import { AbilityContext } from '@src/layouts/components/acl/Can'
import {
  useGetProOverview,
  useGetProWorkDays,
} from '@src/queries/pro/pro-details.query'
import { changeProStatus } from '@src/apis/pro/pro-details.api'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import AvailableCalendarWrapper from '@src/@core/styles/libs/available-calendar'
import WorkDaysCalendar from '@src/views/mypage/overview/work-days-calendar'
import TimelineDot from '@src/@core/components/mui/timeline-dot'
import useModal from '@src/hooks/useModal'
import { currentRoleSelector } from '@src/states/permission'
import ProStatusChangeModal from '@src/pages/components/pro-detail-modal/modal/proStatusChangeModal'
import ProActiveStatusChangeModal from '@src/pages/components/pro-detail-modal/modal/proActiveStatusChangeModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import languageHelper from '@src/shared/helpers/language.helper'

export const ProDetailOverviews = () => (
  <Suspense fallback={<FallbackSpinner />}>
    <ProDetailOverview />
  </Suspense>
)

const ProDetailOverview = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const auth = useRecoilValueLoadable(authState)
  const [currentRole] = useRecoilStateLoadable(currentRoleSelector)

  const { id } = router.query

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const [hideFailedTest, setHideFailedTest] = useState(false)
  const [seeOnlyCertRoles, setSeeOnlyCertRoles] = useState(false)
  const [showTestInfo, setShowTestInfo] = useState(false)

  const { data: userInfo, isError, isFetched } = useGetProOverview(Number(id!))
  const { data: offDays } = useGetProWorkDays(Number(id!), year, month)

  const [appliedRoleList, setAppliedRoleList] = useState<
    AppliedRoleType[] | null
  >(userInfo!.appliedRoles!)

  const [selectedJobInfo, setSelectedJobInfo] =
    useState<AppliedRoleType | null>(null)

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
  const [status, setStatus] = useState(userInfo?.status)

  const ability = useContext(AbilityContext)
  const languageList = getGloLanguage()

  const { openModal, closeModal } = useModal()

  const changeProStatusMutation = useMutation(
    (value: { userId: number; status: string }) =>
      changeProStatus(value.userId, value.status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['pro-overview'])
      },
    },
  )

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
        queryClient.invalidateQueries(['pro-overview'])
      },
    },
  )

  const patchTestStatusMutation = useMutation(
    (value: { id: number; status: string }) =>
      patchTestStatus(value.id, value.status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['pro-overview'])
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
        queryClient.invalidateQueries(['pro-overview'])
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
        queryClient.invalidateQueries(['pro-overview'])
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
        queryClient.invalidateQueries(['pro-overview'])
      },
    },
  )

  const handleChangeProStatus = (status: string) => {
    setStatus(status)
    changeProStatusMutation.mutate({
      userId: Number(id!),
      status: status,
    })
  }

  const handleChangeActiveStatus = (status: string) => {
    setStatus(status)
    changeProStatusMutation.mutate({
      userId: Number(id!),
      status: status,
    })
  }

  const handleChangeStatus = (event: SelectChangeEvent) => {
    const tad = ['Off-board', 'On-hold Do not assign', 'Do not Contact']
    const proActive = ['Onboard', 'Netflix Onboard']

    const curStatus = event.target.value

    if (currentRole.contents.name === 'TAD' && tad.includes(curStatus)) {
      openModal({
        type: 'ProStatusChangeModal',
        children: (
          <CustomModal
            title={`Are you sure to change this Pro's status as [${curStatus}]?`}
            rightButtonText='Save'
            vary='error'
            onClick={() => {
              closeModal('ProStatusChangeModal')
              handleChangeProStatus(curStatus)
            }}
            onClose={() => closeModal('ProStatusChangeModal')}
          />
        ),
      })
    } else if (proActive.includes(curStatus)) {
      openModal({
        type: 'ProActiveStatusChangeModal',
        children: (
          <CustomModal
            title={`Are you sure to change this Pro's status as [${curStatus}]?`}
            rightButtonText='Save'
            vary='successful'
            onClick={() => {
              closeModal('ProActiveStatusChangeModal')
              handleChangeActiveStatus(curStatus)
            }}
            onClose={() => closeModal('ProActiveStatusChangeModal')}
          />
        ),
      })
    }

    // setStatus(event.target.value as string)
    // changeProStatusMutation.mutate({
    //   userId: Number(id!),
    //   status: event.target.value,
    // })
  }
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
    const changedPage =
      direction === 'prev'
        ? Math.max(commentsProPage - 1, 0)
        : direction === 'next'
        ? commentsProPage + 1
        : 0

    setCommentsProPage(changedPage)
  }

  const handleHideFailedTestChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideFailedTest(event.target.checked)
    let prevState = userInfo!.appliedRoles!

    if (seeOnlyCertRoles) {
      prevState = prevState?.filter(item => item.requestStatus === 'Certified')
    }

    if (event.target.checked) {
      prevState = prevState.filter((value: AppliedRoleType) => {
        const basicTest = value.test.find(value => value.testType === 'basic')
        const skillTest = value.test.find(value => value.testType === 'skill')

        const includesJobTypeAndRoles =
          value.role === 'DTPer' ||
          value.role === 'DTP QCer' ||
          value.jobType === 'Interpretation'

        const isNoTestStatus =
          basicTest &&
          skillTest &&
          ((basicTest!.status === 'NO_TEST' &&
            skillTest!.status === 'NO_TEST') ||
            (basicTest!.status !== 'NO_TEST' &&
              skillTest!.status === 'NO_TEST'))

        return !(
          value.testStatus === 'Skill failed' ||
          value.testStatus === 'Basic failed' ||
          value.requestStatus === 'Rejected' ||
          value.requestStatus === 'Paused' ||
          includesJobTypeAndRoles ||
          isNoTestStatus
        )
      })

      setAppliedRoleList(prevState)
    } else {
      setAppliedRoleList([...prevState])
    }
  }

  const handleOnlyCertRolesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSeeOnlyCertRoles(event.target.checked)

    let prevState = userInfo!.appliedRoles!

    if (hideFailedTest) {
      prevState = prevState.filter((value: AppliedRoleType) => {
        const basicTest = value.test.find(value => value.testType === 'basic')
        const skillTest = value.test.find(value => value.testType === 'skill')

        const includesJobTypeAndRoles =
          value.role === 'DTPer' ||
          value.role === 'DTP QCer' ||
          value.jobType === 'Interpretation'

        const isNoTestStatus =
          basicTest &&
          skillTest &&
          ((basicTest!.status === 'NO_TEST' &&
            skillTest!.status === 'NO_TEST') ||
            (basicTest!.status !== 'NO_TEST' &&
              skillTest!.status === 'NO_TEST'))

        return !(
          value.testStatus === 'Skill failed' ||
          value.testStatus === 'Basic failed' ||
          value.requestStatus === 'Rejected' ||
          value.requestStatus === 'Paused' ||
          includesJobTypeAndRoles ||
          isNoTestStatus
        )
      })
    }

    if (!event.target.checked) {
      setAppliedRoleList(prevState)
      return
    }

    const filterList = prevState?.filter(
      item => item.requestStatus === 'Certified',
    )
    setAppliedRoleList(filterList || [])
  }

  const handleShowTestInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowTestInfo(event.target.checked)
    if (!event.target.checked) {
      getCertifiedAppliedRolesData()
      return
    }
    setShowTestInfo(event.target.checked)
    setAppliedRoleList(userInfo!.appliedRoles || [])
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
            handleTestAssign(jobInfo.id, status)
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

  const onClickSkillTestAction = (
    id: number,
    basicTest: TestType,
    skillTest: TestType,
    type: string,
  ) => {
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

  const handleAssignTest = async (jobInfo: AddRoleType) => {
    const res: AddRolePayloadType[] = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      jobType: value.jobType.label,
      role: value.role.label,
      source: value.source?.value ?? null,
      target: value.target?.value ?? null,
    }))

    addTestMutation.mutate(res)
    await queryClient.invalidateQueries(['pro-overview'])
  }

  const handleAssignRole = async (jobInfo: AddRoleType) => {
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
    await queryClient.invalidateQueries(['pro-overview'])
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

  const getCertifiedAppliedRolesData = () => {
    const appliedRoles = userInfo?.appliedRoles.filter(
      item => item.requestStatus === 'Certified',
    )
    setAppliedRoleList(appliedRoles || [])
    return
  }

  useEffect(() => {
    if (currentRole.contents.name === 'LPM') {
      getCertifiedAppliedRolesData()
    }

    setAppliedRoleList(userInfo?.appliedRoles!)
  }, [userInfo])

  useEffect(() => {
    setStatus(userInfo?.status)
  }, [userInfo])

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
      // setModal(
      //   <FilePreviewDownloadModal
      //     open={true}
      //     onClose={() => setModal(null)}
      //     docs={[file]}
      //   />,
      // )
      openModal({
        type: 'FilePreviewDownloadModal',
        children: (
          <FilePreviewDownloadModal
            open={true}
            onClose={() => closeModal('FilePreviewDownloadModal')}
            docs={[file]}
          />
        ),
      })
    })
  }

  return (
    <Grid container xs={12} spacing={6}>
      {isFetched && !isError ? (
        <>
          <Grid
            container
            item
            xs={3.6}
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
                  birthday: userInfo?.birthday!,
                  status: userInfo?.status!,
                  address:
                    userInfo?.addresses && userInfo.addresses.length > 0
                      ? userInfo.addresses[0]
                      : null,
                }}
                type={'pro'}
                handleChangeStatus={handleChangeStatus}
                status={status}
              />
            </Grid>
            <Grid item xs={12}>
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
                        <Typography variant='h6'>
                          Available work days
                        </Typography>
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
                    showReason={true}
                  />
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    gap='10px'
                    mt='11px'
                  >
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
            </Grid>
            <Grid item xs={12}>
              <NoteFromPro userInfo={userInfo!} />
            </Grid>
          </Grid>

          <Grid item xs={8.4}>
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
                    totalCount={userInfo!.appliedRoles?.length!}
                    userInfo={appliedRoleList! ?? []}
                    hideFailedTest={hideFailedTest}
                    handleHideFailedTestChange={handleHideFailedTestChange}
                    handleOnlyCertRolesChange={handleOnlyCertRolesChange}
                    seeOnlyCertRoles={seeOnlyCertRoles}
                    handleShowTestInfoChange={handleShowTestInfoChange}
                    showTestInfo={showTestInfo}
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
                    type='pro'
                    status={status}
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
                  ability={ability}
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

ProDetailOverview.acl = {
  subject: 'pro',
  action: 'read',
}

export default ProDetailOverview
