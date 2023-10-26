import { Icon } from '@iconify/react'
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  JobTypeChip,
  ProJobStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import useModal from '@src/hooks/useModal'
import {
  FileBox,
  FileName,
} from '@src/pages/invoice/receivable/detail/components/invoice-info'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import {
  byteToGB,
  byteToMB,
  formatFileSize,
} from '@src/shared/helpers/file-size.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { authState } from '@src/states/auth'
import { FileType } from '@src/types/common/file.type'
import {
  JobPricesDetailType,
  JobsFileType,
  ProJobDetailType,
} from '@src/types/jobs/jobs.type'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import InformationModal from '@src/@core/components/common-modal/information-modal'
import { ProJobStatusType } from '@src/types/jobs/common.type'

import dynamic from 'next/dynamic'

import dayjs from 'dayjs'
import PriceUnitGuideline from './components/modal/price-unit-guideline'
import CustomChip from 'src/@core/components/mui/chip'
import {
  formatByRoundingProcedure,
  formatCurrency,
} from '@src/shared/helpers/price.helper'
import { useMutation, useQueryClient } from 'react-query'
import {
  handleJobAssignStatus,
  patchProJobDetail,
  patchProJobSourceFileDownload,
} from '@src/apis/job-detail.api'

type Props = {
  jobInfo: ProJobDetailType
  jobPrices: JobPricesDetailType
  statusList: { label: string; value: number }[]
  jobDetailDots: string[]
}

const ClientGuidelineView = dynamic(
  () => import('./components/modal/client-guideline-view'),
  { ssr: false },
)

const ProJobInfo = ({
  jobInfo,
  jobPrices,
  statusList,
  jobDetailDots,
}: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const queryClient = useQueryClient()
  const statusLabel =
    statusList?.find(i => i.value === jobInfo.status)?.label || ''
  const { openModal, closeModal } = useModal()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const updateJob = useMutation(
    (status: ProJobStatusType) =>
      patchProJobDetail(jobInfo.id, { status: status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proJobDetail'])
      },
    },
  )

  const patchProJobSourceFileDownloadMutation = useMutation(
    (fileIds: number[]) => patchProJobSourceFileDownload(jobInfo.id, fileIds),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proJobDetail'])
        queryClient.invalidateQueries(['proJobDots'])
      },
    },
  )

  const selectAssignMutation = useMutation(
    (data: { jobId: number; proId: number; status: number }) =>
      handleJobAssignStatus(data.jobId, data.proId, data.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proJobDetail'])
      },
    },
  )

  const fileSize = useMemo(() => {
    if (jobInfo?.files.length > 0) {
      return jobInfo.files
        ?.filter(value => {
          if (
            jobInfo.status !== 60100 &&
            jobInfo.status !== 60400 &&
            jobInfo.status !== 60600 &&
            jobInfo.status !== 60200 &&
            jobInfo.status !== 60300
          ) {
            return value.type === 'SOURCE'
          } else {
            return value.type === 'SAMPLE'
          }
        })
        .reduce((res, { size }) => (res += size), 0)
    }
    return 0
  }, [jobInfo])

  function fetchFile(file: JobsFileType | FileType) {
    getDownloadUrlforCommon(S3FileType.JOB, file.file!).then(res => {
      fetch(res.url, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${file.name}`
          document.body.appendChild(a)
          a.click()
          setTimeout((_: any) => {
            window.URL.revokeObjectURL(url)
          }, 60000)
          a.remove()
          patchProJobSourceFileDownloadMutation.mutate([file.id!])
        })
        .catch(err =>
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          ),
        )
    })
  }

  function downloadOneFile(file: JobsFileType | FileType) {
    fetchFile(file)
  }

  function downloadAllFiles(
    files: Array<JobsFileType> | [] | undefined | Array<FileType>,
  ) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file)
    })
  }

  const fileList = jobInfo.files
    ?.filter(value => {
      if (
        jobInfo.status !== 60100 &&
        jobInfo.status !== 60400 &&
        jobInfo.status !== 60600 &&
        jobInfo.status !== 60200 &&
        jobInfo.status !== 60300
      ) {
        return value.type === 'SOURCE'
      } else {
        return value.type === 'SAMPLE'
      }
    })
    .map((file: JobsFileType) => (
      <Box key={uuidv4()}>
        <Box
          sx={{ display: 'flex', gap: '10px', alignItems: 'center', mb: '5px' }}
        >
          {file.isDownloaded ? null : (
            <Badge
              variant='dot'
              color='primary'
              sx={{ marginLeft: '4px' }}
            ></Badge>
          )}

          <Typography
            variant='body2'
            fontSize={14}
            fontWeight={400}
            color={file.isDownloaded ? 'rgba(76, 78, 100, 0.60)' : '#666CFF'}
          >
            {FullDateTimezoneHelper(
              file.createdAt,
              auth.getValue().user?.timezone,
            )}
          </Typography>
        </Box>

        <FileBox>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ marginRight: '8px', display: 'flex' }}>
              <Icon
                icon='material-symbols:file-present-outline'
                style={{ color: 'rgba(76, 78, 100, 0.54)' }}
                fontSize={24}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Tooltip title={file.name}>
                <FileName variant='body1'>{file.name}</FileName>
              </Tooltip>

              <Typography variant='caption' lineHeight={'14px'}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          </Box>
          {jobInfo.status === 60300 || jobInfo.status === 60400 ? null : (
            <IconButton
              onClick={() => downloadOneFile(file)}
              // disabled={jobInfo.status === 'Declined'}
              // disabled={isFileUploading || !isUserInTeamMember}
            >
              <Icon icon='mdi:download' fontSize={24} />
            </IconButton>
          )}
        </FileBox>
      </Box>
    ))
  const handleJobStatus = (response: 'Decline' | 'Notify') => {
    // TODO API 연결
    selectAssignMutation.mutate(
      {
        jobId: jobInfo.id,
        proId: auth.getValue().user?.id!,
        status: response === 'Decline' ? 70200 : 70100,
      },
      {
        onSuccess: () => {
          if (response === 'Decline') {
            closeModal('DeclineModal')
          } else {
            closeModal('AvailableModal')
          }
        },
      },
    )
    // updateJob.mutate(response === 'Decline' ? 60300 : 60200, {})
  }

  const onClickAvailable = () => {
    openModal({
      type: 'AvailableModal',
      children: (
        <CustomModal
          onClose={() => closeModal('AvailableModal')}
          vary='successful'
          title={
            <>
              Would you like to notify the LPM that you're available for the
              task?
              <br />
              <br />
              You will be notified via the registered email once your approval
              to proceed with the job is granted.
            </>
          }
          rightButtonText='Notify'
          onClick={() => handleJobStatus('Notify')}
        />
      ),
    })
  }

  const onClickDecline = () => {
    openModal({
      type: 'DeclineModal',
      children: (
        <CustomModal
          onClose={() => closeModal('DeclineModal')}
          vary='error'
          title={
            <>
              Are you sure you want to notify that you're unavailable for the
              job?
              <br />
              <br />
              The request will be declined and you’ll be unable to proceed with
              this job.
            </>
          }
          rightButtonText='Decline'
          onClick={() => handleJobStatus('Decline')}
        />
      ),
    })
  }

  const onClickQuantityPriceUnitMoreInfo = () => {
    openModal({
      type: 'QuantityPriceUnitMoreInfoModal',
      children: (
        <PriceUnitGuideline
          vary='info'
          title='Quantity / Price unit Guidelines'
          subtitle='Please note that a single task might incorporate multiple quantity and price unit.'
          firstItem={{
            title: 'Quantity',
            value: 'The amount of the work(words, minutes, etc.).',
            titleWidth: 82,
            valueWidth: 195,
          }}
          secondItem={{
            title: 'Price unit',
            value:
              'The standard for calculating translation rates. Rates are applied based on the price unit.',
            titleWidth: 82,
            valueWidth: 195,
          }}
          notify='The total equals to the product of the quantity and the price unit.'
          onClose={() => closeModal('MoreInfoModal')}
        />
      ),
    })
  }

  const onClickOnClickStatusMoreInfo = (status: ProJobStatusType) => {
    openModal({
      type: 'StatusMoreInfoModal',
      children: (
        <>
          {status === 60600 ? (
            <InformationModal
              vary='info'
              onClose={() => closeModal('StatusMoreInfoModal')}
              title=''
              align='left'
              subtitle={
                <>
                  The job position has been filled.
                  <br />
                  <br />
                  By sharing your availability, you can potentially enhance your
                  prospects for future job requests.
                  <br />
                  <br />
                  We're looking forward to keeping in touch with you for
                  upcoming opportunities.
                </>
              }
            />
          ) : status === 60900 ? (
            <InformationModal
              vary='info'
              onClose={() => closeModal('StatusMoreInfoModal')}
              title=''
              align='left'
              subtitle={
                <>
                  This task is not being considered for the purpose of
                  generating an invoice.
                </>
              }
            />
          ) : status === 60400 ? (
            <PriceUnitGuideline
              vary='info'
              subtitle='We’re sorry to inform that O-000001-TRA-001 has been canceled due to internal circumstances.'
              firstItem={{
                title: 'Job number',
                value: jobInfo.corporationId,
                titleWidth: 122,
                valueWidth: 156,
              }}
              secondItem={{
                title: 'Contact person',
                value: (
                  <>
                    {getLegalName({
                      firstName: jobInfo.contactPerson?.firstName,
                      lastName: jobInfo.contactPerson?.lastName,
                      middleName: jobInfo.contactPerson?.middleName,
                    })}
                    <br />({jobInfo.contactPerson?.email})
                  </>
                ),
                titleWidth: 122,
                valueWidth: 156,
              }}
              onClose={() => closeModal('StatusMoreInfoModal')}
              extra={`If you need any assistance related to this matter, please contact ${jobInfo.contactPerson?.email}.`}
            />
          ) : (
            status === 601000 && (
              <PriceUnitGuideline
                subtitle={
                  <>
                    The due date has been exceeded.
                    <br />
                    <br />
                    There could be consequences due to the delayed submission,
                    so we kindly request you to submit the files as soon as
                    possible.
                  </>
                }
                vary='error'
                firstItem={{
                  title: 'Job number',
                  value: jobInfo.corporationId,
                  titleWidth: 122,
                  valueWidth: 156,
                }}
                secondItem={{
                  title: 'Due date',
                  value: FullDateTimezoneHelper(
                    jobInfo.dueAt,
                    auth.getValue()?.user?.timezone,
                  ),
                  titleWidth: 122,
                  valueWidth: 156,
                }}
                thirdItem={{
                  title: 'Contact person',
                  value: (
                    <>
                      {getLegalName({
                        firstName: jobInfo.contactPerson?.firstName,
                        lastName: jobInfo.contactPerson?.lastName,
                        middleName: jobInfo.contactPerson?.middleName,
                      })}
                      <br />({jobInfo.contactPerson?.email})
                    </>
                  ),
                  titleWidth: 122,
                  valueWidth: 156,
                }}
                onClose={() => closeModal('StatusMoreInfoModal')}
                extra={`If you need any assistance related to this matter, please contact ${jobInfo.contactPerson?.email}.`}
              />
            )
          )}
        </>
      ),
    })
  }

  const onClickClientGuidelineView = () => {
    if (jobInfo.guideLines) {
      openModal({
        type: 'ClientGuidelineViewModal',
        isCloseable: false,
        children: (
          <ClientGuidelineView
            onClose={() => closeModal('ClientGuidelineViewModal')}
            downloadAllFiles={downloadAllFiles}
            guideLines={jobInfo.guideLines}
            downloadOneFile={downloadOneFile}
          />
        ),
      })
    }
  }

  const getJobDateDiff = (jobDueDate: string) => {
    const now = dayjs()
    const dueDate = dayjs(jobDueDate)
    const diff = dueDate.diff(now, 'second')
    const isPast = diff < 0

    const days = Math.abs(Math.floor(diff / 86400))
    const hours = Math.abs(Math.floor((diff % 86400) / 3600))
    const minutes = Math.abs(Math.floor((diff % 3600) / 60))

    if (isPast) {
      return (
        <>
          <Typography
            variant='body1'
            fontWeight={600}
            fontSize={14}
            color='#e04440'
          >
            {FullDateTimezoneHelper(jobDueDate, auth.getValue().user?.timezone)}
          </Typography>
          <Typography
            variant='body1'
            fontWeight={400}
            fontSize={14}
            color='#e04440'
          >{`${days > 0 ? days : ''} day(s) ${hours
            .toString()
            .padStart(2, '0')} hr(s) ${minutes
            .toString()
            .padStart(2, '0')} min(s) over`}</Typography>
        </>
      )
    }
  }

  return (
    <Grid container xs={12} spacing={4}>
      <Grid item xs={9.25}>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <Box
              sx={{
                display: 'flex',
                // justifyContent: 'space-between',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              {jobDetailDots.includes('name') ? (
                <Badge
                  variant='dot'
                  color='primary'
                  sx={{ marginLeft: '4px' }}
                ></Badge>
              ) : null}
              <Typography variant='h6'>{jobInfo.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Box sx={{ display: 'flex', width: '50%', gap: '8px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    width: '38.5%',
                  }}
                >
                  {jobDetailDots.includes('status') ? (
                    <Badge
                      variant='dot'
                      color='primary'
                      sx={{ marginLeft: '4px' }}
                    ></Badge>
                  ) : null}
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    Status
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '59.73%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    {ProJobStatusChip(
                      statusLabel,
                      jobInfo.status as ProJobStatusType,
                    )}
                    {/* TODO status 체크해야함 */}
                    {jobInfo.status === 60900 ||
                    jobInfo.status === 70400 ||
                    jobInfo.status === 60300 ? (
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={() =>
                          onClickOnClickStatusMoreInfo(
                            jobInfo.status as ProJobStatusType,
                          )
                        }
                      >
                        <Icon icon='fe:question' fontSize={18}></Icon>
                      </IconButton>
                    ) : null}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1, gap: '8px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      width: '38.5%',
                    }}
                  >
                    {jobDetailDots.includes('contactPersonId') ? (
                      <Badge
                        variant='dot'
                        color='primary'
                        sx={{ marginLeft: '4px' }}
                      ></Badge>
                    ) : null}
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Contact person
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2'>
                        {getLegalName({
                          firstName: jobInfo.contactPerson?.firstName,
                          lastName: jobInfo.contactPerson?.lastName,
                          middleName: jobInfo.contactPerson?.middleName,
                        })}
                        &nbsp;({jobInfo.contactPerson?.email})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '38.5%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Client
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2'>
                        {jobInfo.order.client.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1, gap: '8px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '38.5%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Category / Service type
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      {jobInfo.category ? (
                        <JobTypeChip
                          label={jobInfo.category}
                          type={jobInfo.category}
                        />
                      ) : (
                        '-'
                      )}
                      {jobInfo.serviceType ? (
                        <ServiceTypeChip label={jobInfo.serviceType} />
                      ) : (
                        '-'
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '38.5%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Language pair
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2'>
                        {languageHelper(jobInfo.sourceLanguage)} &rarr;&nbsp;
                        {languageHelper(jobInfo.targetLanguage)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1, gap: '8px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '38.5%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Requested date
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2'>
                        {FullDateTimezoneHelper(
                          jobInfo.requestedAt,
                          auth.getValue()?.user?.timezone,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '38.5%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      {jobInfo.status !== 60100 &&
                      jobInfo.status !== 70000 &&
                      jobInfo.status !== 70100 &&
                      jobInfo.status !== 70200 &&
                      jobInfo.status !== 70400 &&
                      jobInfo.status !== 70500
                        ? 'Job start date'
                        : 'Job due date'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2'>
                        {FullDateTimezoneHelper(
                          jobInfo.status !== 60100 &&
                            jobInfo.status !== 70000 &&
                            jobInfo.status !== 70100 &&
                            jobInfo.status !== 70200 &&
                            jobInfo.status !== 70400 &&
                            jobInfo.status !== 70500
                            ? jobInfo.startedAt
                            : jobInfo.dueAt,
                          auth.getValue()?.user?.timezone,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {jobInfo.status !== 60100 &&
                jobInfo.status !== 70000 &&
                jobInfo.status !== 70100 &&
                jobInfo.status !== 70200 &&
                jobInfo.status !== 70400 &&
                jobInfo.status !== 70500 ? (
                <Box sx={{ display: 'flex', width: '50%', gap: '8px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',

                      width: '38.5%',
                      alignItems: 'center',
                    }}
                  >
                    {jobDetailDots.includes('dueAt') ||
                    jobDetailDots.includes('dueAtTimezone') ? (
                      <Badge
                        variant='dot'
                        color='primary'
                        sx={{ marginLeft: '4px' }}
                      ></Badge>
                    ) : null}
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Job due date
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',

                      alignItems: 'center',
                      width: '59.73%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      {jobInfo.status === 601000 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {getJobDateDiff(jobInfo.dueAt)}
                        </Box>
                      ) : (
                        <Typography variant='body2'>
                          {FullDateTimezoneHelper(
                            jobInfo.dueAt,
                            auth.getValue()?.user?.timezone,
                          )}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : null}
              <Divider />
              {jobInfo.status === 60300 ||
              jobInfo.status === 60600 ||
              jobInfo.status === 60400 ? null : (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '50%',
                      gap: '8px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'start',
                        width: '38.5%',
                      }}
                    >
                      {jobDetailDots.includes('prices') ? (
                        <Badge
                          variant='dot'
                          color='primary'
                          sx={{ marginLeft: '4px' }}
                        ></Badge>
                      ) : null}
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        Quantity / price unit
                      </Typography>
                      <IconButton
                        sx={{ padding: '2px 0 0 0' }}
                        onClick={onClickQuantityPriceUnitMoreInfo}
                      >
                        <Icon
                          icon='streamline:interface-alert-information-circle-information-frame-info-more-help-point-circle'
                          fontSize={18}
                        />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '59.73%',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            'li::marker': {
                              color: 'rgba(76, 78, 100, 0.60)',
                            },
                          }}
                        >
                          {jobPrices?.isUsedCAT ? (
                            <>
                              <CustomChip
                                label='Involves CAT tool'
                                size='small'
                                sx={{ width: '130px' }}
                              />
                            </>
                          ) : null}

                          {jobPrices.detail?.map(value => {
                            if (jobPrices.detail?.length === 1) {
                              return (
                                <Typography variant='body2' key={uuidv4()}>
                                  {value.quantity} {value.unit}
                                </Typography>
                              )
                            } else {
                              return (
                                <li key={uuidv4()}>
                                  <Typography
                                    variant='body2'
                                    component={'span'}
                                  >
                                    {value.quantity} {value.unit} /{' '}
                                    {jobPrices.currency} {value.unitPrice} per{' '}
                                    {value.title}
                                  </Typography>
                                </li>
                              )
                            }
                          })}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', width: '50%', gap: '8px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '38.5%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Total
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '59.73%',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='body2'>
                          {/* ${jobPrices.totalPrice} */}
                          {formatCurrency(
                            jobPrices.totalPrice,
                            jobPrices.currency,
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider />
                </>
              )}

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    width: '38.5%',
                  }}
                >
                  {jobDetailDots.includes('description') ? (
                    <Badge
                      variant='dot'
                      color='primary'
                      sx={{ marginLeft: '4px' }}
                    ></Badge>
                  ) : null}
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    Job description
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant='body2'>
                      {jobInfo.description === '' || !jobInfo.description
                        ? '-'
                        : jobInfo.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={2.75}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {fileList.length === 0 ||
          (jobInfo.status !== 70000 &&
            jobInfo.status !== 70100 &&
            jobInfo.status !== 70200 &&
            jobInfo.status !== 70300 &&
            jobInfo.status !== 70400 &&
            jobInfo.status !== 70500) ? null : (
            <Card>
              <Box
                sx={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <Box display='flex' justifyContent='space-between'>
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                    {jobInfo.status !== 70000 &&
                    jobInfo.status !== 70100 &&
                    jobInfo.status !== 70200 &&
                    jobInfo.status !== 70400 &&
                    jobInfo.status !== 70500
                      ? 'Source files'
                      : 'Sample files'}
                  </Typography>
                  <Typography variant='body2'>
                    {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                  </Typography>
                </Box>
                {fileList.length === 0 &&
                jobInfo.status !== 70000 &&
                jobInfo.status !== 70100 &&
                jobInfo.status !== 70200 &&
                jobInfo.status !== 70400 &&
                jobInfo.status !== 70500 ? null : fileList.length > 0 ? (
                  <Button
                    variant='outlined'
                    fullWidth
                    startIcon={<Icon icon='mdi:download' />}
                    onClick={() => downloadAllFiles(jobInfo?.files)}
                    disabled={
                      fileList.length === 0 ||
                      jobInfo.status === 70200 ||
                      jobInfo.status === 70400 ||
                      jobInfo.status === 70500
                    }
                  >
                    Download all
                  </Button>
                ) : null}
              </Box>
              <Box
                sx={{
                  padding: '0 20px',
                  overflow: 'scroll',
                  marginBottom: '12px',
                  maxHeight: '300px',
                  // height: '300px',

                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {fileList.length > 0 ? fileList : null}
              </Box>
            </Card>
          )}

          {[60100, 70000].includes(jobInfo.status) ? (
            <Card sx={{ padding: '20px' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <Button variant='contained' onClick={onClickAvailable}>
                  I'm available
                </Button>
                <Button variant='outlined' onClick={onClickDecline}>
                  Decline
                </Button>
              </Box>
            </Card>
          ) : (jobInfo.status === 70300 ||
              jobInfo.status === 60200 ||
              jobInfo.status === 60400 ||
              jobInfo.status === 60500 ||
              jobInfo.status === 60600 ||
              jobInfo.status === 60700 ||
              jobInfo.status === 60900) &&
            jobInfo.guideLines ? (
            <Card
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Icon
                  icon='fluent:book-information-20-regular'
                  fontSize={20}
                ></Icon>
                <Typography variant='body1' fontSize={14} fontWeight={600}>
                  Client guidelines
                </Typography>
              </Box>

              <Button
                variant='contained'
                fullWidth
                onClick={onClickClientGuidelineView}
              >
                View
              </Button>
            </Card>
          ) : null}
        </Box>
      </Grid>
    </Grid>
  )
}

export default ProJobInfo
