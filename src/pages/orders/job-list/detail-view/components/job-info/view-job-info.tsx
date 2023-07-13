import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import FileItem from '@src/@core/components/fileItem'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { saveJobInfo } from '@src/apis/job-detail.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'

import { JobStatus } from '@src/shared/const/status/statuses'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { JobStatusType } from '@src/types/jobs/common.type'
import { SaveJobInfoParamsType } from '@src/types/orders/job-detail'
import { PositionType } from '@src/types/orders/order-detail'
import { ro } from 'date-fns/locale'
import { f } from 'msw/lib/glossary-de6278a9'
import { Dispatch, SetStateAction, useState } from 'react'
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

type Props = {
  row: JobType
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
}
const ViewJobInfo = ({
  row,
  setEditJobInfo,
  type,
  projectTeam,
  item,

  setSuccess,
  refetch,
}: Props) => {
  const [jobStatus, setJobStatus] = useState<JobStatusType>(row.status)
  const [jobFeedback, setJobFeedback] = useState<string>(row.feedback ?? '')
  const queryClient = useQueryClient()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.CERTIFICATION_TEST

  const saveJobInfoMutation = useMutation(
    (data: { jobId: number; data: SaveJobInfoParamsType }) =>
      saveJobInfo(data.jobId, data.data),
    {
      onSuccess: () => {
        setSuccess && setSuccess(true)
        queryClient.invalidateQueries('jobInfo')
        refetch && refetch()
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

  const handleChange = (event: SelectChangeEvent) => {
    const res: SaveJobInfoParamsType = {
      contactPersonId: row.contactPerson?.userId!,
      description: row.description ?? null,
      startDate: row.startedAt ? row.startedAt.toString() : null,
      startTimezone: row.startTimezone ?? null,

      dueDate: row.dueAt.toString(),
      dueTimezone: row.dueTimezone,
      status: event.target.value as JobStatusType,
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
          setJobStatus(event.target.value as JobStatusType)
        },
      },
    )
  }

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {type === 'history' ? null : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Typography variant='subtitle2'>
            *Changes will only be applied to new requests
          </Typography>
          <Button
            variant='outlined'
            // disabled={!!row.assignedPro}
            onClick={() => setEditJobInfo && setEditJobInfo(true)}
          >
            <Icon icon='mdi:pencil-outline' fontSize={24} />
            &nbsp; Edit before request
          </Button>
        </Box>
      )}

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
                JobsStatusChip(row.status)
              ) : (
                <Select
                  value={jobStatus}
                  onChange={handleChange}
                  size='small'
                  sx={{ width: '253px' }}
                >
                  {JobStatus.map(status => {
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
                {languageHelper(row.sourceLanguage)} &rarr;{' '}
                {languageHelper(row.targetLanguage)}
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
                {row.startedAt
                  ? FullDateTimezoneHelper(row.startedAt, row.startTimezone)
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
                {FullDateTimezoneHelper(row.dueAt, row.dueTimezone)}
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
              {row.description}
            </Typography>
          </Box>
        </Box>
      </Card>
      <Divider />
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
              row.files
                ? getFileSize(row?.files, 'SAMPLE')
                : 0
            )}
            / {byteToGB(MAXIMUM_FILE_SIZE)}
          </Typography>
        </Box>
      </Box>
      {type === 'history' ? null : (
        <>
          <Divider />
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
              <Button
                variant='contained'
                disabled={
                  !(
                    row.files &&
                    row.files.find(value => value.type === 'TARGET')
                  )
                }
              >
                <Icon icon='mdi:download' fontSize={18} />
                &nbsp; Download all
              </Button>
            </Box>
            {row.files &&
            row.files.filter(value => value.type === 'TARGET').length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',

                  width: '100%',
                  gap: '20px',
                }}
              >
                {fileList(row.files, 'TARGET')}
              </Box>
            ) : (
              <Typography variant='subtitle2'>
                There are no files delivered from Pro
              </Typography>
            )}
          </Box>
          <Divider />
        </>
      )}

      {row.assignedPro ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Typography variant='body1' fontWeight={600}>
              Job feedback
            </Typography>
            {row.feedback ? (
              <Typography variant='subtitle2'>{row.feedback}</Typography>
            ) : (
              <TextField
                multiline
                fullWidth
                rows={4}
                value={jobFeedback}
                placeholder='Write down a job description.'
                onChange={event => {
                  setJobFeedback(event.target.value)
                }}
                id='textarea-standard-controlled'
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontSize: '12px',
              lineHeight: '25px',
              color: '#888888',
            }}
          >
            {jobFeedback?.length ?? 0}/500
          </Box>
          {row.feedback ? null : (
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px' }}
            >
              <Button variant='contained' disabled={jobFeedback?.length === 0}>
                <Icon icon='mdi:send-outline' fontSize={18} />
                &nbsp;&nbsp;Send feedback to Pro
              </Button>
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  )
}

export default ViewJobInfo
