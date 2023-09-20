import { Icon } from '@iconify/react'
import {
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
import { useGetGuideLines } from '@src/queries/client-guideline.query'
import PriceUnit from '@src/pages/components/standard-prices/component/price-unit'
import dayjs from 'dayjs'
import PriceUnitGuideline from './components/modal/price-unit-guideline'
import { JobType } from '@src/types/common/item.type'

type Props = {
  jobInfo: ProJobDetailType
  jobPrices: JobPricesDetailType
}

const ClientGuidelineView = dynamic(
  () => import('./components/modal/client-guideline-view'),
  { ssr: false },
)

const ProJobInfo = ({ jobInfo, jobPrices }: Props) => {
  const auth = useRecoilValueLoadable(authState)

  const { openModal, closeModal } = useModal()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const fileSize = useMemo(() => {
    if (jobInfo?.files.length > 0) {
      return jobInfo.files
        ?.filter(value => {
          if (
            jobInfo.status !== 'Requested from LPM' &&
            jobInfo.status !== 'Canceled' &&
            jobInfo.status !== 'Unassigned' &&
            jobInfo.status !== 'Awaiting approval' &&
            jobInfo.status !== 'Declined'
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
        jobInfo.status !== 'Requested from LPM' &&
        jobInfo.status !== 'Canceled' &&
        jobInfo.status !== 'Unassigned' &&
        jobInfo.status !== 'Awaiting approval' &&
        jobInfo.status !== 'Declined'
      ) {
        return value.type === 'SOURCE'
      } else {
        return value.type === 'SAMPLE'
      }
    })
    .map((file: JobsFileType) => (
      <Box key={uuidv4()}>
        <Typography
          variant='body2'
          fontSize={14}
          fontWeight={400}
          sx={{ mb: '5px' }}
        >
          {FullDateTimezoneHelper(
            file.createdAt,
            auth.getValue().user?.timezone,
          )}
        </Typography>
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
          {jobInfo.status === 'Declined' ||
          jobInfo.status === 'Canceled' ? null : (
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
  const handleNotifyAvailable = (response: 'Decline' | 'Notify') => {
    // TODO API 연결
    closeModal('AvailableModal')
    closeModal('DeclineModal')
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
          onClick={() => handleNotifyAvailable('Notify')}
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
          onClick={() => handleNotifyAvailable('Decline')}
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
          {status === 'Unassigned' ? (
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
          ) : status === 'Canceled' ? (
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
            status === 'Job overdue' && (
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
      <Grid item xs={8.75}>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6'>{jobInfo.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                    {ProJobStatusChip(jobInfo.status as ProJobStatusType)}
                    {jobInfo.status === 'Unassigned' ||
                    jobInfo.status === 'Canceled' ||
                    jobInfo.status === 'Job overdue' ? (
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
                      <JobTypeChip
                        label={jobInfo.category}
                        type={jobInfo.category}
                      />
                      <ServiceTypeChip label={jobInfo.serviceType} />
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
                      {jobInfo.status !== 'Requested from LPM' &&
                      jobInfo.status !== 'Canceled' &&
                      jobInfo.status !== 'Unassigned' &&
                      jobInfo.status !== 'Awaiting approval' &&
                      jobInfo.status !== 'Declined'
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
                          jobInfo.status !== 'Requested from LPM' &&
                            jobInfo.status !== 'Canceled' &&
                            jobInfo.status !== 'Unassigned' &&
                            jobInfo.status !== 'Awaiting approval' &&
                            jobInfo.status !== 'Declined'
                            ? jobInfo.startedAt
                            : jobInfo.dueAt,
                          auth.getValue()?.user?.timezone,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {jobInfo.status !== 'Requested from LPM' &&
              jobInfo.status !== 'Canceled' &&
              jobInfo.status !== 'Unassigned' &&
              jobInfo.status !== 'Awaiting approval' &&
              jobInfo.status !== 'Declined' ? (
                <Box sx={{ display: 'flex', width: '50%', gap: '8px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',

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
                      {jobInfo.status === 'Job overdue' ? (
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
              {jobInfo.status === 'Declined' ||
              jobInfo.status === 'Unassigned' ||
              jobInfo.status === 'Canceled' ? null : (
                <>
                  <Box sx={{ display: 'flex', width: '50%', gap: '8px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center',
                        width: '38.5%',
                      }}
                    >
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
                        sx={{ padding: 0 }}
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
                        <Typography variant='body2'>
                          {FullDateTimezoneHelper(
                            jobInfo.requestedAt,
                            auth.getValue()?.user?.timezone,
                          )}
                        </Typography>
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
                          ${jobPrices.totalPrice}
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
          {fileList.length === 0 &&
          jobInfo.status !== 'Requested from LPM' &&
          jobInfo.status !== 'Canceled' &&
          jobInfo.status !== 'Unassigned' &&
          jobInfo.status !== 'Awaiting approval' &&
          jobInfo.status !== 'Declined' ? null : (
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
                    {jobInfo.status !== 'Requested from LPM' &&
                    jobInfo.status !== 'Canceled' &&
                    jobInfo.status !== 'Unassigned' &&
                    jobInfo.status !== 'Awaiting approval' &&
                    jobInfo.status !== 'Declined'
                      ? 'Source files'
                      : 'Sample files'}
                  </Typography>
                  <Typography variant='body2'>
                    {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                  </Typography>
                </Box>
                {fileList.length === 0 &&
                jobInfo.status !== 'Requested from LPM' &&
                jobInfo.status !== 'Canceled' &&
                jobInfo.status !== 'Unassigned' &&
                jobInfo.status !== 'Awaiting approval' &&
                jobInfo.status !== 'Declined' ? null : fileList.length > 0 ? (
                  <Button
                    variant='outlined'
                    fullWidth
                    startIcon={<Icon icon='mdi:download' />}
                    onClick={() => downloadAllFiles(jobInfo?.files)}
                    disabled={
                      fileList.length === 0 ||
                      jobInfo.status === 'Declined' ||
                      jobInfo.status === 'Canceled'
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
                {fileList.length === 0 &&
                jobInfo.status !== 'Requested from LPM' &&
                jobInfo.status !== 'Canceled' &&
                jobInfo.status !== 'Unassigned' &&
                jobInfo.status !== 'Awaiting approval' &&
                jobInfo.status !== 'Declined'
                  ? null
                  : fileList.length > 0
                  ? fileList
                  : null}
              </Box>
            </Card>
          )}

          {jobInfo.status === 'Requested from LPM' ? (
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
          ) : jobInfo.status === 'In progress' ? (
            <Card
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Typography variant='body1' fontSize={14} fontWeight={600}>
                Client guidelines
              </Typography>
              <Button
                variant='outlined'
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
