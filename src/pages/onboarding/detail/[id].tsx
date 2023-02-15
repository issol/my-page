import { Card, Grid, Typography } from '@mui/material'

import { useRouter } from 'next/router'
import { useGetUserInfoWithResume } from 'src/queries/userInfo/userInfo-query'
import { Box } from '@mui/system'

import styled from 'styled-components'
import toast from 'react-hot-toast'
import { UserInfoResType } from 'src/apis/user.api'
import About from '../components/detail/about'
import AppliedRole from '../components/detail/applied-role'
import CertificationTest from '../components/detail/certification-test'
import NoteFromPro from '../components/detail/note-pro'
import Specialties from '../components/detail/specialities'
import Contracts from '../components/detail/contracts'
import CommentsAboutPro from '../components/detail/comments-pro'
import Resume from '../components/detail/resume'
import Experience from '../components/detail/experience'
import {
  ChangeEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { JobInfoType } from 'src/types/sign/personalInfoTypes'

import _ from 'lodash'
import {
  AddRoleType,
  SelectedJobInfoType,
  TestHistoryType,
  CommentsOnProType,
} from 'src/types/onboarding/list'
import { useMutation, useQueryClient } from 'react-query'
import {
  addTest,
  certifyRole,
  testAction,
  deleteComment,
  editComment,
  addingComment,
} from 'src/apis/onboarding.api'
import { ModalContext } from 'src/context/ModalContext'
import TestDetailsModal from '../components/detail/dialog/test-details-modal'
import { useFieldArray, useForm } from 'react-hook-form'
import { useGetReviewerList } from 'src/queries/onboarding/onboarding-query'
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

import dayjs from 'dayjs'

const defaultValues: AddRoleType = {
  jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
}
export default function OnboardingDetail() {
  const router = useRouter()
  const { id } = router.query
  const { data: userInfo } = useGetUserInfoWithResume(id)
  const { data: reviewerList } = useGetReviewerList()
  const [hideFailedTest, setHideFailedTest] = useState(false)
  const [selectedUserInfo, setSelectedUserInfo] = useState(userInfo)
  const [jobInfo, setJobInfo] = useState(userInfo?.jobInfo)

  const [selectedJobInfo, setSelectedJobInfo] =
    useState<SelectedJobInfoType | null>(null)

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

  const [testStatus, setTestStatus] = useState<{
    value: string
    label: string
  } | null>(null)

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
    mode: 'onBlur',
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

  const certifyRoleMutation = useMutation(
    (value: { userId: number; jobInfoId: number }) =>
      certifyRole(value.userId, value.jobInfoId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`${variables.userId}`)
        // displayUndoToast(variables.user, variables.payload.reply)
      },
    },
  )

  const testActionMutation = useMutation(
    (value: { userId: number; jobInfoId: number; status: string }) =>
      testAction(value.userId, value.jobInfoId, value.status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`${variables.userId}`)
      },
    },
  )

  const addTestMutation = useMutation(
    (value: { userId: number; jobInfo: AddRoleType }) =>
      addTest(value.userId, value.jobInfo),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`${variables.userId}`)
      },
    },
  )

  const deleteCommentMutation = useMutation(
    (value: { userId: number; commentId: number }) =>
      deleteComment(value.userId, value.commentId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`${variables.userId}`)
      },
    },
  )

  const editCommentMutation = useMutation(
    (value: { userId: number; comment: CommentsOnProType }) =>
      editComment(value.userId, value.comment),
    {
      onSuccess: (data, variables) => {
        toast.success('Successfully edited!', {
          position: 'bottom-right',
        })
        queryClient.invalidateQueries(`${variables.userId}`)
      },
    },
  )

  const addCommentMutation = useMutation(
    (value: { userId: number; comment: CommentsOnProType }) =>
      addingComment(value.userId, value.comment),
    {
      onSuccess: (data, variables) => {
        toast.success('Successfully saved!', {
          position: 'bottom-right',
        })
        queryClient.invalidateQueries(`${variables.userId}`)
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

  function getLegalName(row: UserInfoResType) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? ' (' + row.middleName + ')' : '') +
          ` ${row.lastName}`
  }

  if (!userInfo) {
    return null
  }

  const handleHideFailedTestChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHideFailedTest(event.target.checked)

    if (event.target.checked) {
      let prevState = selectedUserInfo

      const res = prevState.jobInfo.filter(
        (value: any) =>
          !(
            value.status === 'Test failed' || value.status === 'General failed'
          ),
      )

      prevState['jobInfo'] = res
      setSelectedUserInfo(prevState)
    } else {
      let prevState = selectedUserInfo

      prevState['jobInfo'] = jobInfo
      setSelectedUserInfo(prevState)
    }
  }

  const handleClickRoleCard = (jobInfo: SelectedJobInfoType) => {
    setSelectedJobInfo(jobInfo)
    const prevState = selectedUserInfo
    const res = selectedUserInfo.jobInfo.map((value: any) => {
      if (value.id === jobInfo.id) {
        return { ...value, selected: true }
      } else {
        return { ...value, selected: false }
      }
    })
    prevState['jobInfo'] = res
    setSelectedUserInfo(prevState)
  }

  const onClickCertify = (jobInfoId: number) => {
    setActionId(jobInfoId)
    certifyRoleMutation.mutate({ userId: Number(id), jobInfoId: jobInfoId })
  }

  const onClickAction = (jobInfoId: number, status: string) => {
    setActionId(jobInfoId)
    testActionMutation.mutate({
      userId: Number(id),
      jobInfoId: jobInfoId,
      status: status,
    })
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

  const onChangeTestStatus = (
    event: SyntheticEvent,
    newValue: { value: string; label: string } | null,
  ) => {
    setTestStatus(newValue)
  }

  const onClickTestDetails = (jobInfo: SelectedJobInfoType) => {
    setModal(<TestDetailsModal jobInfo={jobInfo} reviewerList={reviewerList} />)
  }

  const onClickAssignTest = (data: AddRoleType) => {
    setAssignTestJobInfo(data)
    setAssignTestModalOpen(true)
  }

  const onClickCancelTest = () => {
    setCancelTestModalOpen(true)
  }

  const handleAssignTest = (jobInfo: AddRoleType) => {
    //** TODO : Assign 연결 */
    console.log(jobInfo)
    addTestMutation.mutate({ userId: Number(id), jobInfo: jobInfo })
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
    const res = {
      ...selectedComment!,
      comment: comment,
    }

    editCommentMutation.mutate({ userId: Number(id), comment: res })

    setClickedEditComment(false)

    setSelectedComment(null)
  }

  const handleEditCancelComment = () => {
    setClickedEditComment(false)

    setSelectedComment(null)
  }

  const handleAddComment = () => {
    const res = {
      id: 0,
      userId: Number(id),
      firstName: userInfo.firstName,
      middleName: userInfo.middleName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      createdAt: '2023-02-15T21:40:10Z',
      updatedAt: '2023-02-15T21:40:10Z',
      comment: addComment,
    }
    setAddComment('')
    setClickedAddComment(false)
    addCommentMutation.mutate({ userId: Number(id), comment: res })
  }

  const handleAddCancelComment = () => {
    setAddComment('')
    setClickedAddComment(false)
  }

  const handleDeleteComment = (comment: CommentsOnProType) => {
    deleteCommentMutation.mutate({ userId: Number(id), commentId: comment.id })
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
    let tempUserInfo = userInfo

    const res = userInfo.jobInfo.map((value: any) => ({
      ...value,
      selected: value.id === actionId ? true : false,
    }))

    const selectedResult = res.filter((value: any) => value.id === actionId)

    tempUserInfo['jobInfo'] = res

    setSelectedUserInfo(tempUserInfo)
    setJobInfo(res)
    if (actionId) {
      setSelectedJobInfo(selectedResult[0])
    }
    // setSelectedJobInfo(res)
  }, [userInfo])

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
                  <Typography variant='h5'>{getLegalName(userInfo)}</Typography>
                  <img
                    width={32}
                    height={32}
                    src={
                      userInfo.isOnboarded && userInfo.isActive
                        ? `/images/icons/onboarding-icons/pro-active.png`
                        : !userInfo.isOnboarded
                        ? `/images/icons/onboarding-icons/pro-onboarding.png`
                        : userInfo.isOnboarded && !userInfo.isActive
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
                  {userInfo.legalNamePronunciation
                    ? userInfo.legalNamePronunciation
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
          <About userInfo={userInfo} />
        </Grid>
        <Grid item xs={12}>
          <NoteFromPro userInfo={userInfo} />
        </Grid>
      </Grid>

      <Grid item xs={7} display='flex' gap='24px' direction='column'>
        <Grid item xs={12} display='flex' gap='24px'>
          <Grid item xs={6}>
            <Resume userInfo={userInfo} />
          </Grid>
          <Grid item xs={6}>
            <Experience userInfo={userInfo} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <AppliedRole
            userInfo={selectedUserInfo?.jobInfo}
            hideFailedTest={hideFailedTest}
            handleHideFailedTestChange={handleHideFailedTestChange}
            selectedJobInfo={selectedJobInfo}
            handleClickRoleCard={handleClickRoleCard}
            page={rolePage}
            rowsPerPage={roleRowsPerPage}
            handleChangePage={handleChangeRolePage}
            offset={roleOffset}
            onClickCertify={onClickCertify}
            onClickAction={onClickAction}
            onClickAddRole={onClickAddRole}
          />
        </Grid>

        <Grid item xs={12}>
          <CertificationTest
            userInfo={userInfo}
            selectedJobInfo={selectedJobInfo}
            onClickAction={onClickAction}
            onClickTestDetails={onClickTestDetails}
          />
        </Grid>
        <Grid item xs={12}>
          <CommentsAboutPro
            userInfo={userInfo?.commentsOnPro}
            user={userInfo}
            page={commentsProPage}
            rowsPerPage={commentsProRowsPerPage}
            handleChangePage={handleChangeCommentsProPage}
            offset={commentsProOffset}
            userId={Number(id!)}
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
            <Contracts userInfo={userInfo} />
          </Grid>
          <Grid item xs={6}>
            <Specialties userInfo={userInfo} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

// ** TODO : 렐,백엔드와 논의 후 수정
OnboardingDetail.acl = {
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
