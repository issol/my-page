import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import FileItem from '@src/@core/components/fileItem'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { addJobFeedback, saveJobInfo } from '@src/apis/jobs/job-detail.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'

// import { JobStatus } from '@src/shared/const/status/statuses'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'

import { SaveJobInfoParamsType } from '@src/types/orders/job-detail'
import { PositionType } from '@src/types/orders/order-detail'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'

import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import {
  ProJobDeliveryType,
  ProJobFeedbackType,
} from '@src/types/jobs/jobs.type'
import { useRouter } from 'next/router'
import useModal from '@src/hooks/useModal'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'
import JobFeedback from '../../../components/job-feedback'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { JobStatus, StatusItem } from '@src/types/common/status.type'

type Props = {
  row: JobType
  jobDeliveriesFeedbacks:
    | {
        deliveries: ProJobDeliveryType[]
        feedbacks: ProJobFeedbackType[]
      }
    | undefined
  setEditJobInfo?: Dispatch<SetStateAction<boolean>>
  type: string
  projectTeam: {
    userId: number
    position: PositionType
    firstName: string
    middleName: string | null
    lastName: string
    email: string
    jobTitle: string
  }[]
  item: JobItemType

  setSuccess?: Dispatch<SetStateAction<boolean>>
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        id: number
        cooperationId: string
        items: JobItemType[]
      },
      unknown
    >
  >
  statusList: Array<{ value: number; label: string }> | undefined
  auth?: {
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }
  role?: Array<UserRoleType>
  setJobId?: (n: number) => void
}
const ViewJobInfo = ({
  row,
  jobDeliveriesFeedbacks,
  setEditJobInfo,
  type,
  projectTeam,
  item,

  setSuccess,
  refetch,
  statusList,
  auth,
  role,
  setJobId,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const [filteredJobStatus, setFilteredJobStatus] = useState<Array<StatusItem>>(
    statusList!,
  )
  const [useJobFeedbackForm, setUseJobFeedbackForm] = useState<boolean>(false)
  const [addJobFeedbackData, setAddJobFeedbackData] = useState<string>('')

  const [feedbackPage, setFeedbackPage] = useState(0)
  const [feedbackRowsPerPage, setFeedbackRowsPerPage] = useState(3)
  const feedbackOffset = feedbackPage * feedbackRowsPerPage
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const queryClient = useQueryClient()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const router = useRouter()
  const saveJobInfoMutation = useMutation(
    (data: { jobId: number; data: SaveJobInfoParamsType }) =>
      saveJobInfo(data.jobId, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.id === variables.jobId) {
          setSuccess && setSuccess(true)
          queryClient.invalidateQueries('jobInfo')
          refetch && refetch()
        } else {
          setJobId && setJobId(data.id)
        }
      },
    },
  )
  const addJobFeedbackMutation = useMutation(
    (data: { jobId: number; data: string }) =>
      addJobFeedback(data.jobId, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.job.id === variables.jobId) {
          setSuccess && setSuccess(true)
          queryClient.invalidateQueries('jobInfo')
          queryClient.invalidateQueries(['proJobDeliveries', variables.jobId])
          refetch && refetch()
        } else {
          setJobId && setJobId(data.job.id)
        }
      },
    },
  )
  const DownloadAllFiles = (
    file:
      | {
          name: string
          size: number
          file: string // s3 key
          type: 'SAMPLE' | 'SOURCE' | 'TARGET'
        }[]
      | null,
  ) => {
    if (file) {
      file.map(value => {
        getDownloadUrlforCommon(
          S3FileType.JOB,
          encodeURIComponent(value.file),
        ).then(res => {
          fetch(res.url, { method: 'GET' })
            .then(res => {
              return res.blob()
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${value.name}`
              document.body.appendChild(a)
              a.click()
              setTimeout((_: any) => {
                window.URL.revokeObjectURL(url)
              }, 60000)
              a.remove()
              // onClose()
            })
            .catch(error =>
              toast.error(
                'Something went wrong while uploading files. Please try again.',
                {
                  position: 'bottom-left',
                },
              ),
            )
        })
      })
    }
  }

  const DownloadFile = (file: FileType) => {
    if (file) {
      getDownloadUrlforCommon(
        S3FileType.JOB,
        encodeURIComponent(file.file!),
      ).then(res => {
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
            // onClose()
          })
          .catch(error =>
            toast.error(
              'Something went wrong while uploading files. Please try again.',
              {
                position: 'bottom-left',
              },
            ),
          )
      })
    }
  }

  const onChangeStatus = (event: SelectChangeEvent) => {
    const currentJobStatus = Number(event.target.value)
    if (currentJobStatus === 60600) {
      //Approve
      statusModals('approve', event)
    } else if (currentJobStatus === 601000) {
      //Cancel
      statusModals('cancel', event)
    } else if (currentJobStatus === 60900) {
      //Without Invoice
      statusModals('withoutInvoice', event)
    } else handleChange(event)
  }

  const statusModals = (
    type: 'approve' | 'cancel' | 'withoutInvoice',
    event: SelectChangeEvent,
  ) => {
    const approveMessage = `
      Are you sure you want to approve the
      job?\n
      The job must be approved between the
      16th and the 31st of the month in which it
      is completed.\n
      A notification that the job has been
      approved will be sent to the assigned
      Pro.`
    const cancelMessage = `
      Are you sure you set the job status as
      Canceled? This action is irreversible.\n
      A notification that the job has been
      canceled will be sent to the assigned Pro.`
    const withoutInvoiceMessage = `
      Are you sure you want to set the job
      status as Without invoice?\n
      A notification that the job status has
      been set as Without invoice will be sent
      to the assigned Pro.`
    openModal({
      type: 'statusModal',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('statusModal')}
          onConfirm={() => {
            handleChange(event)
          }}
          closeButtonText={'Cancel'}
          confirmButtonText={'Proceed'}
          message={
            type === 'approve'
              ? approveMessage
              : type === 'cancel'
                ? cancelMessage
                : withoutInvoiceMessage
          }
          vary={type === 'approve' ? 'successful' : 'error'}
          textAlign={'center'}
        />
      ),
    })
  }

  const handleChange = (event: SelectChangeEvent) => {
    if (Number(event.target.value) === 60600) {
    }
    const res: SaveJobInfoParamsType = {
      contactPersonId: row.contactPerson?.userId!,
      description: row.description ?? null,
      startDate: row.startedAt ? row.startedAt.toString() : null,
      startTimezone: row.startTimezone ?? null,

      dueDate: row.dueAt.toString(),
      dueTimezone: row.dueTimezone,
      status: Number(event.target.value),
      sourceLanguage: row.sourceLanguage,
      targetLanguage: row.targetLanguage,
      name: row.name,
      isShowDescription: row.isShowDescription,
    }

    saveJobInfoMutation.mutate(
      {
        jobId: row.id,
        data: res,
      },
      {
        onSuccess: () => {
          // setJobStatus(Number(event.target.value))
          filterStatus(Number(event.target.value))
        },
      },
    )
  }

  function filterStatus(statusCode: number) {
    switch (statusCode) {
      case 60000: //"In preparation"
        setFilteredJobStatus(
          statusList?.filter(list => [60000, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60100: //"Requested"
        setFilteredJobStatus(
          statusList?.filter(list => [60100, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60200: //"In progress"
        setFilteredJobStatus(
          statusList?.filter(list => [60200, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60300: //"Overdue"
        setFilteredJobStatus(
          statusList?.filter(list => [60300, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60400: //"Partially delivered"
        setFilteredJobStatus(
          statusList?.filter(list =>
            [60400, 60600, 601000, 60900].includes(list.value),
          )!,
        ) //Approved, Canceled, Without invoice
        break
      case 60500: //"Delivered"
        setFilteredJobStatus(
          statusList?.filter(list =>
            [60500, 60600, 601000, 60900].includes(list.value),
          )!,
        ) //Approved, Canceled, Without invoice
        break
      case 60600: //Approved
        setFilteredJobStatus(
          statusList?.filter(list =>
            [60600, 601000, 60900].includes(list.value),
          )!,
        ) //Canceled, Without invoice
        break
      case 60700: //Invoiced
        setFilteredJobStatus(
          statusList?.filter(list =>
            [60700, 601000, 60900].includes(list.value),
          )!,
        ) //Canceled, Without invoice
        break
      case 601100:
        setFilteredJobStatus(
          statusList?.filter(list => [60800, 601100].includes(list.value))!,
        ) //TODO Payment canceled 고도화때 반영 예정
        break
      case 60900: //Without invoice
        setFilteredJobStatus(
          statusList?.filter(list =>
            [60900, 601000, 60900].includes(list.value),
          )!,
        ) //Canceled, Approved
        break
      default:
        setFilteredJobStatus(
          statusList?.filter(list => list.value === statusCode)!,
        )
    }
  }

  useEffect(() => {
    if (row && statusList) filterStatus(row.status)
  }, [])

  const fileList = (file: FileType[], type: string) => {
    return file.map((value: FileType) => {
      if (value.type === type) {
        return (
          <Box key={uuidv4()} onClick={() => DownloadFile(value)}>
            <FileItem key={value.name} file={value} />
          </Box>
        )
      }
    })
  }

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)
    let size = 0
    files.forEach((file: FileType) => {
      size += file.size
    })

    return size
  }

  const isJobMember = () => {
    if (row.contactPerson?.userId === auth?.user?.id) return true
    return false
  }

  const hasGeneralPermission = () => {
    let flag = false
    if (role) {
      role.map(item => {
        if (
          (item.name === 'LPM' || item.name === 'TAD') &&
          item.type === 'General'
        )
          flag = true
      })
    }
    return flag
  }

  const onAddFeedback = () => {
    addJobFeedbackMutation.mutate(
      {
        jobId: row.id,
        data: addJobFeedbackData,
      },
      {
        onSuccess: () => {
          setAddJobFeedbackData('')
          setUseJobFeedbackForm(false)
          setFeedbackPage(0)
        },
      },
    )
  }

  const onClickDiscardFeedback = () => {
    const message = `Are you sure you want to discard this
      feedback?`

    openModal({
      type: 'discardFeedbackModal',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('discardFeedbackModal')}
          onConfirm={() => {
            setAddJobFeedbackData('')
            setUseJobFeedbackForm(false)
          }}
          closeButtonText={'Cancel'}
          confirmButtonText={'Discard'}
          message={message}
          vary={'error'}
          textAlign={'center'}
        />
      ),
    })
  }

  const onClickAddFeedback = () => {
    const message = `Are you sure you want to add this
      feedback? It will be delivered to the Pro
      as well.`

    openModal({
      type: 'addFeedbackModal',
      children: (
        <SimpleMultilineAlertModal
          onClose={() => closeModal('addFeedbackModal')}
          onConfirm={() => {
            onAddFeedback()
          }}
          closeButtonText={'Cancel'}
          confirmButtonText={'Add'}
          message={message}
          vary={'successful'}
          textAlign={'center'}
        />
      ),
    })
  }

  const handleChangeFeedbackPage = (direction: string) => {
    // window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const changedPage =
      direction === 'prev'
        ? Math.max(feedbackPage - 1, 0)
        : direction === 'next'
          ? feedbackPage + 1
          : 0

    setFeedbackPage(changedPage)
  }

  const userInTeamMember = () => {
    return projectTeam.some(value => value.userId === auth?.user?.userId)
  }
  const canUseAddComment = () => {
    if (
      (auth?.user?.roles?.some(role => ['General'].includes(role.type)) &&
        userInTeamMember()) ||
      auth?.user?.roles?.some(role => ['Master', 'Manager'].includes(role.type))
    )
      return true
    return false
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {type === 'history' ? null : !hasGeneralPermission() || isJobMember() ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Typography variant='subtitle2'>
            {!row.pro
              ? '*Changes will only be applied to new requests'
              : '*Changes will also be applied to the Pro’s job detail page'}
          </Typography>
          <Button
            variant='outlined'
            // disabled={!!row.assignedPro}
            onClick={() => setEditJobInfo && setEditJobInfo(true)}
          >
            <Icon icon='mdi:pencil-outline' fontSize={24} />
            &nbsp;
            {!row.pro ? 'Edit before request' : 'Edit'}
          </Button>
        </Box>
      ) : null}

      <Card sx={{ padding: '20px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18.5px' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              fontSize={14}
              width={174}
            >
              Job name
            </Typography>
            <Typography variant='subtitle2' fontWeight={400}>
              {row.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={174}
              >
                Status
              </Typography>
              {type === 'history' ? (
                JobsStatusChip(row.status as JobStatus, statusList!)
              ) : (
                <Select
                  value={String(row.status)}
                  onChange={onChangeStatus}
                  size='small'
                  sx={{ width: '253px' }}
                >
                  {filteredJobStatus?.map(status => {
                    return (
                      <MenuItem key={uuidv4()} value={status.value}>
                        {status.label}
                      </MenuItem>
                    )
                  })}
                </Select>
              )}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={174}
              >
                Contact person for job
              </Typography>
              <Typography variant='subtitle2' fontWeight={400}>
                {getLegalName({
                  firstName: row.contactPerson?.firstName!,
                  middleName: row.contactPerson?.middleName,
                  lastName: row.contactPerson?.lastName!,
                })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={174}
              >
                Service type
              </Typography>
              <ServiceTypeChip label={row.serviceType} />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={174}
              >
                Language pair
              </Typography>
              <Typography variant='subtitle2' fontWeight={400}>
                {row.sourceLanguage && row.targetLanguage ? (
                  <>
                    {languageHelper(row.sourceLanguage)} &rarr;{' '}
                    {languageHelper(row.targetLanguage)}
                  </>
                ) : (
                  'Language-independent'
                )}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={174}
              >
                Job start date
              </Typography>
              <Typography variant='subtitle2' fontWeight={400}>
                {row.startedAt && row.startTimezone
                  ? convertTimeToTimezone(
                      row.startedAt,
                      row.startTimezone,
                      timezone.getValue(),
                    )
                  : '-'}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                fontSize={14}
                width={174}
              >
                Job due date
              </Typography>
              <Typography variant='subtitle2' fontWeight={400}>
                {convertTimeToTimezone(
                  row.dueAt,
                  row.dueTimezone,
                  timezone.getValue(),
                )}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              fontSize={14}
              width={174}
            >
              Job description
            </Typography>
            <Typography variant='subtitle2' fontWeight={400}>
              {row.description && row.description !== ''
                ? row.description
                : '-'}
            </Typography>
          </Box>
        </Box>
      </Card>
      <Divider />
      <Card sx={{ padding: '20px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Typography variant='body1' fontWeight={600}>
              Sample files to pro
            </Typography>
            <Button
              variant='contained'
              disabled={
                !(row.files && row.files.find(value => value.type === 'SAMPLE'))
              }
              onClick={() =>
                DownloadAllFiles(
                  row.files!.filter(value => value.type === 'SAMPLE'),
                )
              }
            >
              <Icon icon='mdi:download' fontSize={18} />
              &nbsp; Download all
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',

              width: '100%',
              gap: '20px',
            }}
          >
            {row.files && fileList(row.files, 'SAMPLE')}
          </Box>

          <Box>
            <Typography variant='subtitle2'>
              {formatFileSize(
                row.files ? getFileSize(row?.files, 'SAMPLE') : 0,
              )}
              / {byteToGB(MAXIMUM_FILE_SIZE)}
            </Typography>
          </Box>
        </Box>
      </Card>
      {type === 'history' ? null : (
        <>
          <Divider />
          <Card sx={{ padding: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Typography variant='body1' fontWeight={600}>
                  Target files from Pro
                </Typography>
              </Box>
              {jobDeliveriesFeedbacks?.deliveries &&
              jobDeliveriesFeedbacks?.deliveries.some(delivery =>
                delivery.files.some(files => files.type === 'TARGET'),
              ) ? (
                jobDeliveriesFeedbacks?.deliveries.map(delivery => (
                  <Box
                    key={delivery.id}
                    sx={{
                      padding: '20px',
                      border: '1px solid #4C4E6454',
                      borderRadius: '8px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <Typography variant='body1' fontWeight={600}>
                        {delivery.deliveredDate
                          ? convertTimeToTimezone(
                              delivery.deliveredDate,
                              auth?.user?.timezone!,
                              timezone.getValue(),
                            )
                          : '-'}
                      </Typography>
                      {delivery.files.length ? (
                        <Button
                          variant='outlined'
                          disabled={
                            !(
                              delivery.files &&
                              delivery.files.find(
                                value => value.type === 'TARGET',
                              )
                            )
                          }
                          sx={{
                            height: '30px',
                            borderRadius: '8',
                          }}
                        >
                          <Icon icon='mdi:download' fontSize={18} />
                          &nbsp; Download all
                        </Button>
                      ) : null}
                    </Box>
                    <Box sx={{ marginBottom: '10px' }}>
                      {delivery.files.length ? (
                        <Typography variant='subtitle2'>
                          {formatFileSize(
                            delivery.files
                              ? getFileSize(delivery?.files, 'TARGET')
                              : 0,
                          )}
                        </Typography>
                      ) : null}
                    </Box>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        width: '100%',
                        gap: '20px',
                      }}
                    >
                      {fileList(delivery.files, 'TARGET')}
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <Typography variant='body1' fontWeight={600}>
                        Notes from from Pro
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '16px',
                      }}
                    >
                      <Typography variant='body1' fontWeight={400}>
                        {delivery.note ?? '-'}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant='subtitle2'>
                  There are no files delivered from Pro
                </Typography>
              )}
            </Box>
          </Card>
          <Divider />
        </>
      )}

      {row.pro &&
      [60400, 60500, 60600, 60700, 60800, 60900, 601100].includes(
        row.status,
      ) ? (
        <JobFeedback
          feedbacks={jobDeliveriesFeedbacks?.feedbacks}
          useJobFeedbackForm={useJobFeedbackForm}
          setUseJobFeedbackForm={setUseJobFeedbackForm}
          auth={auth!}
          addJobFeedbackData={addJobFeedbackData}
          setAddJobFeedbackData={setAddJobFeedbackData}
          onClickAddFeedback={onClickAddFeedback}
          onClickDiscardFeedback={onClickDiscardFeedback}
          page={feedbackPage}
          rowsPerPage={feedbackRowsPerPage}
          offset={feedbackOffset}
          handleChangePage={handleChangeFeedbackPage}
          canUseAddComment={canUseAddComment()}
        />
      ) : null}
    </Box>
  )
}

export default ViewJobInfo
