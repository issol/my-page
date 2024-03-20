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
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { authState } from '@src/states/auth'
import { FileType } from '@src/types/common/file.type'
import {
  JobPricesDetailType,
  JobsFileType,
  ProJobDetailType,
} from '@src/types/jobs/jobs.type'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useRecoilValueLoadable } from 'recoil'

import InformationModal from '@src/@core/components/common-modal/information-modal'
import { ProJobStatusType } from '@src/types/jobs/common.type'

import dynamic from 'next/dynamic'

import dayjs from 'dayjs'
import PriceUnitGuideline from './components/modal/price-unit-guideline'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { useMutation, useQueryClient } from 'react-query'
import {
  handleJobAssignStatus,
  patchProJobDetail,
  patchProJobSourceFileDownload,
} from '@src/apis/jobs/job-detail.api'
import { timezoneSelector } from '@src/states/permission'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import styled from '@emotion/styled'
import CustomChip from '@src/@core/components/mui/chip'
import { v4 as uuidv4 } from 'uuid'
import InfoDialogButton from '@src/views/pro/infoDialog'

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

const excludedStatusCodes = [60100, 70000, 70100, 70200, 70400, 70500]

const ProJobInfo = ({
  jobInfo,
  jobPrices,
  statusList,
  jobDetailDots,
}: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
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
      handleJobAssignStatus(data.jobId, data.proId, data.status, 'pro'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proJobDetail'])
      },
    },
  )

  const fileSize = useMemo(() => {
    const excludeStatus = [70000, 70100, 70200, 70300, 70400, 70500, 60100]

    if (jobInfo?.files?.length > 0) {
      return jobInfo.files
        ?.filter(value => {
          if (!excludeStatus.includes(jobInfo.status)) {
            return value.type === 'SOURCE'
          } else {
            return value.type === 'SAMPLE'
          }
        })
        .reduce((res, { size }) => (res += size), 0)
    }
    return 0
  }, [jobInfo])

  const fetchFile = (file: JobsFileType | FileType) => {
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

  const downloadOneFile = (file: JobsFileType | FileType) => {
    fetchFile(file)
  }

  const downloadAllFiles = (
    files: Array<JobsFileType> | [] | undefined | Array<FileType>,
  ) => {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file)
    })
  }

  const fileList = jobInfo.files
    ?.filter(value => {
      if (
        jobInfo.status !== 70000 &&
        jobInfo.status !== 70100 &&
        jobInfo.status !== 70200 &&
        jobInfo.status !== 70300 &&
        jobInfo.status !== 70400 &&
        jobInfo.status !== 70500 &&
        jobInfo.status !== 60100
      ) {
        return value.type === 'SOURCE'
      } else {
        return value.type === 'SAMPLE'
      }
    })
    .map((file: JobsFileType, index) => (
      <Box key={`${file.id}-${index}`}>
        <Box
          sx={{ display: 'flex', gap: '10px', alignItems: 'center', mb: '5px' }}
        >
          {jobDetailDots.includes('download') && file.isDownloaded ? null : (
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
            {convertTimeToTimezone(
              file.createdAt,
              auth.getValue().user?.timezone,
              timezone.getValue(),
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
    console.log('status', status)
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
          ) : [601000, 70400].includes(status) ? (
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
            status === 60300 && (
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
                  value: convertTimeToTimezone(
                    jobInfo.dueAt,
                    auth.getValue()?.user?.timezone,
                    timezone.getValue(),
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

  const getJobDateDiff = (jobDueDate: string, deliveredDate?: string) => {
    const now = deliveredDate ? dayjs(deliveredDate) : dayjs()
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
            {convertTimeToTimezone(
              jobDueDate,
              auth.getValue().user?.timezone,
              timezone.getValue(),
            )}
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

  // status가 Overdue일 때, onClickOnClickStatusMoreInfo를 호출하여 디테일 페이지 진입시 모달을 띄워준다.
  useEffect(() => {
    if (jobInfo) {
      if (jobInfo.status === 60300) {
        onClickOnClickStatusMoreInfo(jobInfo.status as ProJobStatusType)
      }
    }
  }, [jobInfo])

  return (
    <Grid container width='100%' xs={12} spacing={4} padding={0}>
      <Grid item xs={9.25}>
        <Card sx={{ padding: '20px', marginBottom: '24px' }}>
          <Box width='100%' display='flex' gap='10px'>
            <NextPrevItemCard
              title='Previous job'
              userInfo={{
                isOnboarded: true,
                isActive: true,
                firstName: 'Jenny',
                lastName: 'Wilson',
                email: 'proemail@example.com',
              }}
              date='09/03/2023, 05:30 PM (KST)'
            />
            <NextPrevItemCard
              title='Next job'
              userInfo={{
                isOnboarded: true,
                isActive: true,
                firstName: 'Jenny',
                lastName: 'Wilson',
                email: 'proemail@example.com',
              }}
              date='09/03/2023, 05:30 PM (KST)'
            />
          </Box>
        </Card>

        <Card sx={{ padding: '20px' }}>
          <Box display='flex' flexDirection='column' gap='36px'>
            <Box display='flex' alignItems='center' gap='10px'>
              {jobDetailDots.includes('name') && (
                <Badge
                  variant='dot'
                  color='primary'
                  sx={{ marginLeft: '4px' }}
                />
              )}
              <Typography variant='h6'>{jobInfo.name}</Typography>
            </Box>

            <Box display='flex' flexDirection='column' gap='20px'>
              <RowItem
                label='Status'
                isBadge={jobDetailDots.includes('status')}
              >
                {ProJobStatusChip(
                  statusLabel,
                  jobInfo.status as ProJobStatusType,
                )}

                {/* TODO status 체크해야함 */}
                {jobInfo.status === 60900 ||
                  jobInfo.status === 70400 ||
                  (jobInfo.status === 60300 && (
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
                  ))}
              </RowItem>
              <Rows>
                <RowItem
                  label='Contact person'
                  isBadge={jobDetailDots.includes('contactPersonId')}
                >
                  <Typography variant='body2'>
                    {getLegalName({
                      firstName: jobInfo.contactPerson?.firstName,
                      lastName: jobInfo.contactPerson?.lastName,
                      middleName: jobInfo.contactPerson?.middleName,
                    })}
                    &nbsp;({jobInfo.contactPerson?.email})
                  </Typography>
                </RowItem>
                <RowItem label='Client'>
                  <Typography variant='body2'>
                    {jobInfo.order?.client?.name}
                  </Typography>
                </RowItem>
              </Rows>
              <Rows>
                <RowItem label='Category / Service type'>
                  {jobInfo.category ? (
                    <JobTypeChip
                      size='small'
                      label={jobInfo.category}
                      type={jobInfo.category}
                    />
                  ) : (
                    '-'
                  )}
                  {jobInfo.serviceType ? (
                    <ServiceTypeChip size='small' label={jobInfo.serviceType} />
                  ) : (
                    '-'
                  )}
                </RowItem>
                <RowItem label='Language pair'>
                  <Typography variant='body2'>
                    {languageHelper(jobInfo.sourceLanguage)} &rarr;&nbsp;
                    {languageHelper(jobInfo.targetLanguage)}
                  </Typography>
                </RowItem>
              </Rows>
              <Divider sx={{ margin: '0 !important' }} />
              <Rows>
                <RowItem label='Requested date'>
                  <Typography variant='body2'>
                    {convertTimeToTimezone(
                      jobInfo.requestedAt,
                      auth.getValue()?.user?.timezone,
                      timezone.getValue(),
                    )}
                  </Typography>
                </RowItem>
                <RowItem
                  label={
                    !excludedStatusCodes.includes(jobInfo.status)
                      ? 'Job start date'
                      : 'Job due date'
                  }
                >
                  <Typography variant='body2'>
                    {convertTimeToTimezone(
                      !excludedStatusCodes.includes(jobInfo.status)
                        ? jobInfo.startedAt
                        : jobInfo.dueAt,
                      auth.getValue()?.user?.timezone,
                      timezone.getValue(),
                    )}
                  </Typography>
                </RowItem>
              </Rows>
              {!excludedStatusCodes.includes(jobInfo.status) && (
                <RowItem label='Job due date'>
                  {[60300, 60500].includes(jobInfo.status) ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {getJobDateDiff(
                        jobInfo.dueAt,
                        jobInfo.finalProDeliveredAt,
                      )}
                    </Box>
                  ) : (
                    <Typography variant='body2'>
                      {convertTimeToTimezone(
                        jobInfo.dueAt,
                        auth.getValue()?.user?.timezone,
                        timezone.getValue(),
                      )}
                    </Typography>
                  )}
                </RowItem>
              )}

              <Divider sx={{ margin: '0 !important' }} />

              {jobInfo.status === 70200 ||
              jobInfo.status === 70400 ||
              jobInfo.status === 70500 ? null : (
                <>
                  <RowItem
                    label='Quantity / price unit'
                    alignItems='flex-start'
                    infoButton={
                      <InfoDialogButton
                        title='Quantity / Price unit Guidelines'
                        contents={<InfoDialogContent />}
                      />
                    }
                  >
                    <Box>
                      {jobPrices?.isUsedCAT && (
                        <>
                          <CustomChip
                            label='Involves CAT tool'
                            size='small'
                            sx={{ width: '130px' }}
                          />
                        </>
                      )}

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
                              <Typography variant='body2' component={'span'}>
                                {value.quantity} {value.unit} /{' '}
                                {formatCurrency(
                                  value?.unitPrice ?? 0,
                                  jobPrices.initialPrice?.currency ?? 'KRW',
                                  2,
                                )}{' '}
                                per {value.title}
                              </Typography>
                            </li>
                          )
                        }
                      })}
                    </Box>
                  </RowItem>
                  <RowItem label='Total'>
                    <Typography variant='body2'>
                      {/* ${jobPrices.totalPrice} */}
                      {formatCurrency(
                        jobPrices.totalPrice,
                        jobPrices.initialPrice?.currency ?? 'KRW',
                      )}
                    </Typography>
                  </RowItem>
                  <Divider sx={{ margin: '0 !important' }} />
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
                      {jobInfo.description === '' ||
                      !jobInfo.description ||
                      !jobInfo.isShowDescription
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
      <Grid item xs={2.75} padding={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {(fileList && fileList.length === 0) ||
          [70200, 70300, 70400, 70500, 601000].includes(
            jobInfo.status,
          ) ? null : (
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
                    jobInfo.status !== 70300 &&
                    jobInfo.status !== 70400 &&
                    jobInfo.status !== 70500 &&
                    jobInfo.status !== 60100
                      ? 'Source files'
                      : 'Sample files'}
                  </Typography>
                  <Typography variant='body2'>
                    {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                  </Typography>
                </Box>
                {fileList?.length === 0 &&
                jobInfo.status !== 70200 &&
                jobInfo.status !== 70400 &&
                jobInfo.status !== 70500 ? null : fileList?.length > 0 ? (
                  <Button
                    variant='outlined'
                    fullWidth
                    startIcon={<Icon icon='mdi:download' />}
                    onClick={() => downloadAllFiles(jobInfo?.files)}
                    disabled={
                      fileList?.length === 0 ||
                      jobInfo.status === 70200 ||
                      jobInfo.status === 70400 ||
                      jobInfo.status === 70500 ||
                      jobInfo.status === 601000
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
                {fileList?.length > 0 ? fileList : null}
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

interface NextPrevItemCardProps {
  title: string
  date?: string
  userInfo?: {
    isOnboarded: boolean
    isActive: boolean
    firstName: string
    middleName?: string | null
    lastName: string
    email: string
  }
  link?: string
}

const NextPrevItemCard = ({
  title,
  userInfo,
  link,
  date,
}: NextPrevItemCardProps) => {
  return (
    <Box width='100%'>
      <Typography variant='body2' fontWeight={500} color='#8D8E9A'>
        {title}
      </Typography>
      <Box
        width='100%'
        display='flex'
        alignItems='center'
        height={86}
        padding='8px 20px'
        border='1px solid #D8D8DD'
        borderRadius='10px'
        marginTop='8px'
      >
        {!userInfo && (
          <Box width='100%' display='flex' justifyContent='space-between'>
            <Typography variant='body2'>-</Typography>
            <ServiceTypeChip size='small' label='Approved' />
          </Box>
        )}
        {userInfo && (
          <Box display='flex' width='100%' flexWrap='wrap'>
            <Box display='flex' alignItems='center' gap='20px'>
              <LegalNameEmail row={{ ...userInfo }} link={link} />
              <ServiceTypeChip size='small' label='Approved' />
            </Box>
            <Typography
              width='100%'
              variant='body2'
              fontWeight={400}
              color='#8D8E9A'
              sx={{ mt: '8px', display: date ? 'block' : 'none' }}
            >
              <span style={{ fontWeight: 600 }}>Start date</span>:{date}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const Rows = styled(Box)`
  display: flex;
`

interface RowItemProps {
  label: string
  isBadge?: boolean
  alignItems?: string
  infoButton?: React.ReactNode
  children: React.ReactNode
}

const RowItem = ({
  label,
  isBadge,
  alignItems = 'center',
  infoButton,
  children,
}: RowItemProps) => {
  return (
    <Box display='flex' width='50%' gap='8px'>
      <Box display='flex' alignItems={alignItems} gap='10px' width='38.5%'>
        {isBadge && (
          <Badge variant='dot' color='primary' sx={{ marginLeft: '4px' }} />
        )}
        <Typography
          variant='subtitle1'
          fontSize='14px'
          fontWeight={600}
          sx={{ position: 'relative' }}
        >
          {label}
          <Box position='absolute' right={-24} top={0}>
            {infoButton}
          </Box>
        </Typography>
      </Box>
      <Box display='flex' gap='8px' alignItems='center'>
        <Box display='flex' gap='8px' alignItems='center'>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

const InfoDialogContent = () => {
  return (
    <div>
      <p>
        Please note that a single task might incorporate multiple quantity and
        price unit.
      </p>
      <ul
        style={{
          width: '100%',
          listStyle: 'none',
          margin: 0,
          padding: '20px',
          border: '1px solid rgba(76, 78, 100, 0.22)',
          borderRadius: '10px',
        }}
      >
        <li
          style={{
            width: '100%',
            display: 'flex',
            textAlign: 'left',
            marginBottom: '8px',
          }}
        >
          <Typography
            variant='body2'
            fontWeight={600}
            color='rgba(76, 78, 100, 0.87)'
            sx={{ width: '82px' }}
          >
            Quantity:
          </Typography>
          <Typography variant='body2' sx={{ width: '195px' }}>
            The amount of the work(words, minutes, etc.).
          </Typography>
        </li>
        <li
          style={{
            width: '100%',
            display: 'flex',
            textAlign: 'left',
          }}
        >
          <Typography
            variant='body2'
            whiteSpace='nowrap'
            fontWeight={600}
            color='rgba(76, 78, 100, 0.87)'
            sx={{ width: '82px' }}
          >
            Price unit:
          </Typography>
          <Typography variant='body2' sx={{ width: '195px' }}>
            The standard for calculating translation rates. Rates are applied
            based on the price unit.
          </Typography>
        </li>
      </ul>
      <p
        style={{
          color: 'rgba(76, 78, 100, 0.87)',
          fontWeight: 600,
        }}
      >
        The total equals to the product of the quantity and the price unit.
      </p>
    </div>
  )
}

export default ProJobInfo
