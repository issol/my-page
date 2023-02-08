import { Card, Grid, Typography } from '@mui/material'
import { RoleType } from 'src/context/types'
import { useRouter } from 'next/router'
import { useGetUserInfoWithResume } from 'src/queries/userInfo/userInfo-query'
import { Box } from '@mui/system'

import styled from 'styled-components'
import { UserInfoResType } from 'src/apis/user.api'
import About from '../components/detail/about'
import Tax from '../components/detail/note-pro'
import AppliedRole from '../components/detail/applied-role'
import CertificationTest from '../components/detail/certification-test'
import NoteFromPro from '../components/detail/note-pro'
import Specialties from '../components/detail/specialities'
import Contracts from '../components/detail/contracts'
import CommentsAboutPro from '../components/detail/comments-pro'
import Resume from '../components/detail/resume'
import Experience from '../components/detail/experience'
import { useEffect, useState } from 'react'
import { JobInfoType } from 'src/types/sign/personalInfoTypes'
import _ from 'lodash'
import { SelectedJobInfoType } from 'src/types/onboarding/list'
import { useMutation, useQueryClient } from 'react-query'
import { certifyRole, testAction } from 'src/apis/onboarding.api'

export default function OnboardingDetail() {
  const router = useRouter()
  const { id } = router.query
  const { data: userInfo } = useGetUserInfoWithResume(id)
  const [hideFailedTest, setHideFailedTest] = useState(false)
  const [selectedUserInfo, setSelectedUserInfo] = useState(userInfo)
  const [selectedJobInfo, setSelectedJobInfo] =
    useState<SelectedJobInfoType | null>(null)

  const [actionId, setActionId] = useState(0)

  const [rolePage, setRolePage] = useState(0)
  const [roleRowsPerPage, setRoleRowsPerPage] = useState(4)
  const roleOffset = rolePage * roleRowsPerPage

  const [commentsProPage, setCommentsProPage] = useState(0)
  const [commentsProRowsPerPage, setCommentProRowsPerPage] = useState(3)
  const commentsProOffset = commentsProPage * commentsProRowsPerPage

  const queryClient = useQueryClient()

  const certifyRoleMutation = useMutation(
    (value: { userId: number; jobInfoId: number }) =>
      certifyRole(value.userId, value.jobInfoId),
    {
      onSuccess: (data, variables) => {
        alert('delete')
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
        alert('success')
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

  useEffect(() => {
    const tempUserInfo = userInfo

    const res = userInfo.jobInfo.map((value: any) => ({
      ...value,
      selected: value.id === actionId ? true : false,
    }))

    const selectedResult = res.filter((value: any) => value.id === actionId)

    tempUserInfo['jobInfo'] = res

    setSelectedUserInfo(tempUserInfo)
    if (actionId) {
      setSelectedJobInfo(selectedResult[0])
    }
    // setSelectedJobInfo(res)
  }, [userInfo])

  return (
    <Grid container xs={12} spacing={6}>
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
                    src='/images/icons/project-icons/onboarding-activate.png'
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
                  {userInfo.legalName_pronunciation
                    ? userInfo.legalName_pronunciation
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
          />
        </Grid>

        <Grid item xs={12}>
          <CertificationTest
            userInfo={userInfo}
            selectedJobInfo={selectedJobInfo}
            onClickAction={onClickAction}
          />
        </Grid>
        <Grid item xs={12}>
          <CommentsAboutPro
            userInfo={userInfo?.commentsOnPro}
            page={commentsProPage}
            rowsPerPage={commentsProRowsPerPage}
            handleChangePage={handleChangeCommentsProPage}
            offset={commentsProOffset}
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
