import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { renderStatusChip } from '@src/@core/components/chips/chips'
import LoginRequiredModal from '@src/@core/components/common-modal/login-modal'
import { StyledViewer } from '@src/@core/components/editor/customEditor'
import { LinkReadOnlyItem } from '@src/@core/components/linkItem'
import PageHeader from '@src/@core/components/page-header'
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import FallbackSpinner from '@src/@core/components/spinner'
import useModal from '@src/hooks/useModal'
import UserLayout from '@src/layouts/UserLayout'
import { useGetJobOpeningDetail } from '@src/queries/pro/pro-job-openings'
import {
  FullDateTimezoneHelper,
  convertDateByTimezone,
} from '@src/shared/helpers/date.helper'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { authState } from '@src/states/auth'
import {
  JobOpeningDetailType,
  applyResponseEnum,
} from '@src/types/pro/pro-job-openings'
import { EditorState, convertFromRaw } from 'draft-js'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValueLoadable } from 'recoil'
import CustomChip from 'src/@core/components/mui/chip'
import ApplyModal from '../components/apply-modal'
import {
  createJobInfo,
  getJobOpeningApplyStatus,
} from '@src/apis/pro/pro-job-openings.api'
import { useMutation } from 'react-query'
import { AddRolePayloadType } from '@src/types/onboarding/list'
import { addCreateProAppliedRole } from '@src/apis/onboarding.api'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { c } from 'msw/lib/glossary-de6278a9'
import { JobPostingDetailType } from '@src/apis/jobPosting.api'

const JobOpeningDetail = () => {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const id = Number(router.query.id)
  const { data, isLoading } = useGetJobOpeningDetail(id)
  const [content, setContent] = useState(EditorState.createEmpty())
  const { openModal, closeModal } = useModal()

  const copyTextOnClick = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Copied ${text} to clipboard`)
      })
      .catch(err => {
        toast.error('Failed to copy text: ', err)
      })
  }

  const createJobInfoMutation = useMutation(
    (data: { jobType: string; role: string; source: string; target: string }) =>
      createJobInfo(auth.getValue().user?.id!, data),
    {
      onSuccess: () => {
        openModal({
          type: 'TestNotExistModal',
          children: (
            <CustomModal
              vary='successful'
              title={
                <Box>
                  <Typography variant='h6'>
                    Application successfully completed!
                  </Typography>
                  <Typography variant='body1' sx={{ mt: '20px' }}>
                    We will directly authorize you to proceed with the project
                    upon reviewing your resume.
                  </Typography>
                </Box>
              }
              onClose={() => closeModal('TestNotExistModal')}
              onClick={() => {
                // TODO API 연결 필요
                closeModal('ApplySuccessModal')
              }}
              rightButtonText='Got it!'
              soloButton
            />
          ),
        })
      },
    },
  )

  const applyTestMutation = useMutation(
    (jobInfo: AddRolePayloadType[]) => addCreateProAppliedRole(jobInfo),
    {
      onSuccess: (data, variables) => {
        closeModal('AutoApplyModal')
        openModal({
          type: 'ApplySuccessModal',
          children: (
            <CustomModal
              buttonDirection='column-reverse'
              vary='successful'
              title={
                <Box>
                  <Typography variant='body1' fontWeight={500} fontSize={20}>
                    Your{' '}
                    <Typography
                      variant='body1'
                      fontWeight={700}
                      fontSize={20}
                      component={'span'}
                    >
                      certification test
                    </Typography>{' '}
                    is successfully applied!
                  </Typography>
                  <Typography variant='body1' sx={{ mt: '20px' }}>
                    Would you like to check your test application status?
                  </Typography>
                </Box>
              }
              onClose={() => closeModal('ApplySuccessModal')}
              onClick={() => {
                closeModal('ApplySuccessModal')
                router.push('/certification-test/pro')
              }}
              rightButtonText='Go to Certification test'
              leftButtonText='Later'
            />
          ),
        })
      },
    },
  )

  const onClickApplyNow = (data: JobPostingDetailType) => {
    if (auth.getValue().user === null) {
      openModal({
        type: 'LoginRequiredModal',
        children: (
          <LoginRequiredModal
            onClick={() => closeModal('LoginRequiredModal')}
            onClose={() => closeModal('LoginRequiredModal')}
            path={router.asPath}
            jobId={data.id}
          />
        ),
      })
    } else {
      getJobOpeningApplyStatus(data.id).then(res => {
        switch (res.code) {
          case applyResponseEnum.TEST_EXISTS:
            openModal({
              type: 'AutoApplyModal',
              children: (
                <ApplyModal
                  onClick={() => {
                    applyTestMutation.mutate([
                      {
                        userId: auth.getValue().user?.id!,
                        userCompany: auth.getValue().user?.company!,
                        jobType: data.jobType,
                        role: data.role,
                        source: data.sourceLanguage,
                        target: data.targetLanguage,
                      },
                    ])
                  }}
                  onClose={() => closeModal('AutoApplyModal')}
                  vary='info'
                  rightButtonText='Auto-Apply'
                  title='Would you like to apply for the Certification test?'
                  subtitle='This job requires a certified role.'
                  row={data}
                />
              ),
            })

          case applyResponseEnum.UNABLE_PROCEED_TEST:
            openModal({
              type: 'TestHoldModal',
              children: (
                <ApplyModal
                  onClick={() => {
                    closeModal('TestHoldModal')
                    router.push('/certification-test/pro')
                  }}
                  onClose={() => closeModal('TestHoldModal')}
                  vary='error'
                  rightButtonText='Go to Certification test'
                  title='Certification test on hold'
                  row={data}
                />
              ),
            })

          case applyResponseEnum.TEST_NOT_EXIST:
            createJobInfoMutation.mutate({
              jobType: data.jobType,
              role: data.role,
              source: data.sourceLanguage,
              target: data.targetLanguage,
            })

          case applyResponseEnum.ALREADY_HAVE_A_ROLE:
            openModal({
              type: 'AlreadyHaveARoleModal',
              children: (
                <CustomModal
                  vary='info'
                  title={
                    <Box>
                      <Typography variant='h6' fontSize={16}>
                        Thank you for your interest.
                      </Typography>
                      <Typography variant='body2' fontSize={16}>
                        You already have a qualified role for the job.
                      </Typography>
                      <Typography variant='body1' sx={{ mt: '20px' }}>
                        Since you’re already in the linguist pool, people in
                        charge will reach out to you If they decide to work with
                        you.
                      </Typography>
                    </Box>
                  }
                  onClose={() => closeModal('AlreadyHaveARoleModal')}
                  onClick={() => {
                    closeModal('ApplySuccessModal')
                  }}
                  rightButtonText=''
                  noButton
                  closeButton
                />
              ),
            })

          case applyResponseEnum.TEST_COUNT_EXCEEDED:
            openModal({
              type: 'TestCountExceededModal',
              children: (
                <CustomModal
                  vary='error'
                  title={
                    <Box>
                      <Typography variant='h6'>
                        You cannot apply for additional roles at the moment as
                        the maximum limit of 10 roles is already being reviewed.
                      </Typography>
                      <Typography variant='body1' sx={{ mt: '20px' }}>
                        Please reapply after finishing the ongoing test
                        procedures.
                      </Typography>
                    </Box>
                  }
                  onClose={() => closeModal('TestCountExceededModal')}
                  onClick={() => {
                    closeModal('ApplySuccessModal')
                  }}
                  noButton
                  closeButton
                  rightButtonText=''
                />
              ),
            })

          case applyResponseEnum.TESTING_IN_PROGRESS:
            openModal({
              type: 'TestingInProgressModal',
              children: (
                <ApplyModal
                  onClick={() => {
                    closeModal('TestingInProgressModal')
                    router.push('/certification-test/pro')
                  }}
                  onClose={() => closeModal('TestHoldModal')}
                  vary='info'
                  rightButtonText='Go to Certification test'
                  title='Certification test in progress'
                  subtitle='You can proceed after the passing the certification test.'
                  row={data}
                />
              ),
            })

          case applyResponseEnum.ALREADY_APPLIED:
            openModal({
              type: 'AlreadyAppliedModal',
              children: (
                <CustomModal
                  vary='info'
                  closeButton
                  noButton
                  onClick={() => closeModal('AlreadyAppliedModal')}
                  onClose={() => closeModal('AlreadyAppliedModal')}
                  rightButtonText=''
                  title={
                    <Box>
                      <Typography variant='h6' fontSize={16}>
                        Currently Review is in progress.
                      </Typography>
                      <Typography
                        variant='body2'
                        fontSize={16}
                        sx={{ mt: '20px' }}
                      >
                        Once the role is assigned, you can check it on the
                        Certification test tab.
                      </Typography>
                    </Box>
                  }
                />
              ),
            })
        }
      })
    }
  }

  const renderTable = (
    label: string,
    value: number | string | undefined | null,
  ) => {
    return (
      <Grid container mb={'11px'}>
        <Grid item xs={5}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography
            variant='body2'
            sx={{ display: 'flex', alignItems: 'center', minHeight: '20px' }}
          >
            {value ?? '-'}
            {label === 'Job post link' && (
              <IconButton onClick={() => copyTextOnClick(value as string)}>
                <Icon
                  icon='mdi:content-copy'
                  fontSize={18}
                  opacity={0.7}
                  cursor='pointer'
                />
              </IconButton>
            )}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  useEffect(() => {
    if (data?.content) {
      const content = convertFromRaw(data?.content as any)
      const editorState = EditorState.createWithContent(content)
      setContent(editorState)
    }
  }, [data])
  return (
    <>
      {data && !isLoading ? (
        <StyledViewer style={{ margin: '0 70px' }}>
          <PageHeader
            title={
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon
                  icon='material-symbols:arrow-back-ios-new'
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.back()}
                />
                <Typography variant='h5'>Job posting list</Typography>
              </Box>
            }
          />

          <Grid container spacing={6} sx={{ paddingTop: '20px' }}>
            <Grid item md={9} xs={12}>
              <Card sx={{ padding: '30px 20px 20px' }}>
                <Box display='flex' justifyContent='space-between' mb='26px'>
                  <Box display='flex' gap='10px'>
                    <CustomChip
                      label={data?.id}
                      skin='light'
                      color='primary'
                      size='small'
                    />
                  </Box>

                  <Box display='flex' flexDirection='column' gap='8px'>
                    <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                      Posted date: &nbsp;
                      {FullDateTimezoneHelper(
                        data?.createdAt,
                        data?.createdTimezone,
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={12} pt='20px'>
                  <Grid item xs={6}>
                    {renderTable('Job type', data?.jobType)}
                    {renderTable(
                      'Source language',
                      data?.sourceLanguage?.toUpperCase(),
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {renderTable('Role', data?.role)}
                    {renderTable(
                      'Target language',
                      data?.targetLanguage?.toUpperCase(),
                    )}
                  </Grid>
                </Grid>

                <Divider />
                <Grid container spacing={12} pt='20px'>
                  <Grid item xs={6}>
                    {renderTable(
                      'Years of experience',
                      data?.yearsOfExperience,
                    )}
                    {renderTable(
                      'Due date',
                      convertDateByTimezone(
                        data?.dueDate!,
                        data?.dueDateTimezone?.code! ?? 'KR',
                        auth.getValue().user?.timezone?.code ?? 'KR',
                      ),
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    {renderTable('', '')}
                    {renderTable(
                      `Vendor's timezone`,
                      getGmtTimeEng(auth.getValue().user?.timezone?.code),
                    )}
                  </Grid>
                </Grid>
                <Divider />
                <Box sx={{ pt: '20px' }}>
                  <ReactDraftWysiwyg editorState={content} readOnly={true} />
                </Box>
              </Card>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <Button
                  variant='contained'
                  fullWidth
                  onClick={() => onClickApplyNow(data)}
                >
                  Apply now
                </Button>
              </Card>
            </Grid>
          </Grid>
        </StyledViewer>
      ) : (
        <FallbackSpinner />
      )}
    </>
  )
}

export default JobOpeningDetail

JobOpeningDetail.guestGuard = true
JobOpeningDetail.getLayout = function getLayout(page: ReactNode) {
  return <UserLayout>{page}</UserLayout>
}
