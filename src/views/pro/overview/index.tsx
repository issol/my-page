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
import { useRecoilValueLoadable } from 'recoil'
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
import WorkDaysCalendar from '@src/pages/mypage/pro/components/overview/work-days-calendar'
import TimelineDot from '@src/@core/components/mui/timeline-dot'
import useModal from '@src/hooks/useModal'

export const ProDetailOverviews = () => (
  <Suspense fallback={<FallbackSpinner />}>
    <ProDetailOverview />
  </Suspense>
)

function ProDetailOverview() {
  const router = useRouter()
  const { id } = router.query
  const [validUser, setValidUser] = useState(false)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const { data: userInfo, isError, isFetched } = useGetProOverview(Number(id!))

  const { data: offDays } = useGetProWorkDays(Number(id!), year, month)

  const userId = isFetched && !isError ? userInfo!.userId : undefined
  // const { data: appliedRole } = useGetAppliedRole(userId!)

  const auth = useRecoilValueLoadable(authState)

  const [hideFailedTest, setHideFailedTest] = useState(false)

  const [appliedRoleList, setAppliedRoleList] = useState<
    AppliedRoleType[] | null
  >(userInfo!.appliedRoles!)

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

  const [status, setStatus] = useState(userInfo?.status)
  const ability = useContext(AbilityContext)
  const languageList = getGloLanguage()

  const { openModal, closeModal } = useModal()

  const { setModal } = useContext(ModalContext)

  const queryClient = useQueryClient()

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

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string)
    changeProStatusMutation.mutate({
      userId: Number(id!),
      status: event.target.value,
    })
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

        prevState = res
        setAppliedRoleList(prevState)
      } else {
        let prevState = userInfo!.appliedRoles!

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
        id={id}
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
        id={id}
      />,
    )
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

  const handleAssignTest = (jobInfo: AddRoleType) => {
    const res: AddRolePayloadType[] = jobInfo.jobInfo.map(value => ({
      userId: userInfo!.userId,
      userCompany: 'GloZ',
      jobType: value.jobType.label,
      role: value.role.label,
      source: value.source?.value ?? null,
      target: value.target?.value ?? null,
    }))

    // console.log(res)

    //** TODO : Assign 연결 */

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
      setModal(
        <FilePreviewDownloadModal
          open={true}
          onClose={() => setModal(null)}
          docs={[file]}
        />,
      )
    })
  }

  return (
    <Grid container xs={12} spacing={6}>
      {isFetched && !isError ? (
        <>
          <Grid
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
              {/* <CertifiedRole userInfo={certifiedRole!} /> */}
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

export default ProDetailOverviews