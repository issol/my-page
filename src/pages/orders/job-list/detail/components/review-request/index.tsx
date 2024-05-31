import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import { CompanyOptionType } from '@src/types/options.type'
import { JobRequestReviewListType } from '@src/types/orders/job-detail'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import CustomChip from '@src/@core/components/mui/chip'
import { useGetJobRequestReview } from '@src/queries/order/job.query'
import FallbackSpinner from '@src/@core/components/spinner'
import { JobType } from '@src/types/common/item.type'
import useModal from '@src/hooks/useModal'
import RequestReviewModal from './request-review-modal'

import { Icon } from '@iconify/react'
import { FileType } from '@src/types/common/file.type'
import Image from 'next/image'

import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { DownloadAllFiles } from '@src/shared/helpers/downlaod-file'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { useMutation, useQueryClient } from 'react-query'
import { completeRequestReview } from '@src/apis/jobs/job-detail.api'
import UploadReviewedFilesModal from './upload-reviewed-files-modal'

import { useGetMemberList } from '@src/queries/quotes.query'

import {
  getCurrentRole,
  getUserTokenFromBrowser,
} from '@src/shared/auth/storage'
import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import toast from 'react-hot-toast'

type Props = {
  jobId: number
  lspList: CompanyOptionType[]
  jobInfo: JobType
}

interface JobReviewedGroupedFileType {
  savedAt: string

  data: FileType[]
}

const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE

const ReviewRequest = ({ jobId, lspList, jobInfo }: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()
  const currentRole = getCurrentRole()
  const leftContainer = useRef<Array<HTMLDivElement | null>>([])

  const [memberList, setMemberList] = useState<
    Array<{ value: number; label: string; jobTitle?: string }>
  >([])

  const { data: members } = useGetMemberList()

  const completeRequestReviewMutation = useMutation(
    (data: { id: number; completed: boolean }) =>
      completeRequestReview(data.id, data.completed),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['jobRequestReview'])
      },
    },
  )

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)

    let size = 0
    files.forEach((file: FileType) => {
      size += Number(file.size)
    })

    return size
  }

  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [lsp, setLsp] = useState<number[]>([])

  const { data: requestReviewList, isLoading } = useGetJobRequestReview(
    jobId,
    lsp,
  )

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})

  const handleAccordionChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded({ ...expanded, [panel]: isExpanded })
    }

  const onClickRequestReview = (
    type: 'create' | 'edit',
    info?: JobRequestReviewListType,
  ) => {
    openModal({
      type: 'RequestReviewModal',
      children: (
        <RequestReviewModal
          onClose={() => {
            closeModal('RequestReviewModal')
          }}
          // jobSourceFiles={
          //   jobInfo.files?.filter(value => value.type === 'SOURCE') || []
          // }
          // jobTargetFiles={
          //   jobInfo.files?.filter(value => value.type === 'TARGET') || []
          // }
          type={type}
          jobId={jobId}
          requestInfo={info}
          setExpanded={setExpanded}
          expanded={expanded}
        />
      ),
    })
  }

  const onClickCompleteReview = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (event.target.checked) {
      openModal({
        type: 'MarkAsCompleteModal',
        children: (
          <CustomModalV2
            title='Mark as completed?'
            subtitle='Are you sure you want to mark this review as completed?'
            onClose={() => {
              closeModal('MarkAsCompleteModal')
            }}
            onClick={() => {
              closeModal('MarkAsCompleteModal')
              completeRequestReviewMutation.mutate(
                { id: id, completed: true },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(['jobRequestReview'])
                  },
                },
              )
            }}
            rightButtonText='Confirm'
            vary='successful'
          />
        ),
      })
    } else {
      openModal({
        type: 'MarkAsIncompleteModal',
        children: (
          <CustomModalV2
            title='Mark as incomplete?'
            subtitle='Are you sure you want to mark this review as incomplete?'
            rightButtonText='Confirm'
            onClose={() => {
              closeModal('MarkAsIncompleteModal')
            }}
            onClick={() => {
              closeModal('MarkAsIncompleteModal')
              completeRequestReviewMutation.mutate(
                { id: id, completed: false },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(['jobRequestReview'])
                  },
                },
              )
            }}
            vary='error-report'
          />
        ),
      })
    }
  }

  const onClickUploadReviewedFiles = (id: number) => {
    openModal({
      type: 'UploadReviewedFilesModal',
      children: (
        <UploadReviewedFilesModal
          onClose={() => closeModal('UploadReviewedFilesModal')}
          id={id}
          jobId={jobId}
        />
      ),
    })
  }

  const getGroupedReviewedFiles = (files: FileType[]) => {
    const groupedFiles = files
      .filter(value => value.type === 'REVIEWED')
      .reduce((acc: JobReviewedGroupedFileType[], curr: FileType) => {
        const existingGroup = acc.find(group => group.savedAt === curr.savedAt)
        if (existingGroup) {
          existingGroup.data.push(curr)
        } else {
          acc.push({
            savedAt: curr.savedAt!,
            data: [curr],
          })
        }
        return acc
      }, [])
    return groupedFiles
  }

  useEffect(() => {
    if (members) {
      let init = [...members].sort((a, b) => a.label.localeCompare(b.label))
      init.unshift({ value: -1, label: 'Not specified', jobTitle: '' })
      setMemberList(init)
    }
  }, [members])

  const reviewInGlosubButtonStatus = () => {
    const status = jobInfo.status

    if (status) {
      if (
        status === 60600 ||
        status === 60700 ||
        status === 60800 ||
        status === 60900
      ) {
        return 'This job is already completed.'
      } else if (status === 601000 || status === 601100) {
        return 'This job is no longer available.'
      } else {
        return 'active'
      }
    } else {
      return 'deActive'
    }
  }

  const downloadFile = (file: FileType) => {
    const parts = file.path?.split('/') || []
    const index = parts.indexOf('project')
    const result = parts.slice(index).join('/')
    getDownloadUrlforCommon(S3FileType.JOB, result).then((res: any) => {
      fetch(res, { method: 'GET' })
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
        .catch(err => {
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          )
        })
    })
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {isLoading ? <FallbackSpinner /> : null}
      {requestReviewList && !isLoading ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography fontSize={20} fontWeight={500}>
              Review requests (
              {requestReviewList.length
                ? requestReviewList.length.toLocaleString()
                : 0}
              )
            </Typography>
            <Tooltip title=''>
              <Box>
                <Button
                  variant='contained'
                  sx={{ height: '36px' }}
                  onClick={() => onClickRequestReview('create')}
                  disabled={
                    jobInfo.status === 60600 ||
                    jobInfo.status === 60700 ||
                    jobInfo.status === 60800 ||
                    jobInfo.status === 60900 ||
                    jobInfo.status === 601000 ||
                    jobInfo.status === 601100
                  }
                >
                  Request review
                </Button>
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '16px 0',
                gap: '8px',
              }}
            >
              <Typography fontSize={14} fontWeight={400}>
                See requests assigned to:
              </Typography>
              <Box
                className='filterFormAutoCompleteV2'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '1px 3px !important',
                    width: '200px',
                    maxWidth: '200px',
                  },
                }}
              >
                <Autocomplete
                  multiple
                  limitTags={1}
                  value={memberList?.filter(value => lsp.includes(value.value))}
                  onChange={(event, newValue) => {
                    setLsp(newValue.map(value => value.value))
                  }}
                  options={memberList || []}
                  renderInput={params => (
                    <TextField {...params} autoComplete='off' />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} sx={{ mr: 2 }} />
                      {option.label}
                    </li>
                  )}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {requestReviewList.length > 0 ? (
                requestReviewList.map((item, index) => (
                  <Accordion
                    key={uuidv4()}
                    expanded={expanded[item.id]}
                    onChange={handleAccordionChange(item.id)}
                    disableGutters
                    sx={{
                      borderRadius: '10px !important',
                      boxShadow: 'none !important',
                      border: '1px solid #D8D8DD',
                      margin: '0 !important',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        borderRadius: '10px !important',
                        padding: '20px',
                        background: '#F7F8FF',
                        '& .MuiAccordionSummary-content': {
                          margin: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          width: '90%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                          }}
                        >
                          <Typography fontSize={14} fontWeight={600}>
                            {/* {item.index.toString().padStart(3, '0')}. */}
                            {item.corporationId}
                          </Typography>
                          <Divider
                            flexItem
                            orientation='vertical'
                            sx={{
                              color: '#D8D8DD',
                              borderWidth: 1,
                            }}
                          />
                          <Typography fontSize={14} fontWeight={600}>
                            {convertTimeToTimezone(
                              item.createdAt,
                              auth.getValue().user?.timezone,
                              timezone.getValue(),
                            )}
                          </Typography>
                          <Divider
                            flexItem
                            orientation='vertical'
                            sx={{
                              color: '#D8D8DD',
                              borderWidth: 1,
                            }}
                          />
                          <Typography fontSize={14}>Requestor:</Typography>
                          <Typography fontSize={14} fontWeight={600}>
                            {item.requestorInfo.name}
                          </Typography>
                          <Divider
                            flexItem
                            orientation='vertical'
                            sx={{
                              color: '#D8D8DD',
                              borderWidth: 1,
                            }}
                          />
                          <Typography fontSize={14}>Assignee:</Typography>
                          <Typography fontSize={14} fontWeight={600}>
                            {item.assigneeInfo.name ?? '-'}
                          </Typography>
                        </Box>
                        {item.isCompleted && (
                          <Box>
                            <CustomChip
                              skin='light'
                              size='small'
                              label={'Completed'}
                              color='success'
                              sx={{
                                border: '1px solid #6AD721',
                                color: '#64C623',
                                fontWeight: 500,
                                background:
                                  'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128',
                                // 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #BEB033',
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: 0 }}>
                      <Grid container>
                        <Grid
                          item
                          xs={6.5}
                          sx={{
                            borderRight: '1px solid #F7F7F9',
                          }}
                        >
                          <Box
                            sx={{
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '20px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography fontSize={16} fontWeight={600}>
                                Request info
                              </Typography>
                              <IconButton
                                sx={{ padding: 0 }}
                                onClick={() => {
                                  onClickRequestReview('edit', item)
                                }}
                                // onClick={() => setEdit!(true)}
                              >
                                <Icon icon='mdi:pencil-outline' />
                              </IconButton>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '13px',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <Typography
                                  fontSize={14}
                                  fontWeight={600}
                                  sx={{ width: '130px' }}
                                >
                                  Desired due date
                                </Typography>
                                <Typography fontSize={14} fontWeight={400}>
                                  {convertTimeToTimezone(
                                    item.dueDate,
                                    item.dueDateTimezone,
                                    timezone.getValue(),
                                  )}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flex: 1,
                                  }}
                                >
                                  <Typography
                                    fontSize={14}
                                    fontWeight={600}
                                    sx={{ width: '130px' }}
                                  >
                                    Runtime
                                  </Typography>
                                  <Typography fontSize={14} fontWeight={400}>
                                    {item.runtime ?? '-'}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flex: 1,
                                  }}
                                >
                                  <Typography
                                    fontSize={14}
                                    fontWeight={600}
                                    sx={{ width: '130px' }}
                                  >
                                    Word count
                                  </Typography>
                                  <Typography fontSize={14} fontWeight={400}>
                                    {item.wordCount ?? '-'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            {item.noteToAssignee !== '' &&
                            item.noteToAssignee ? (
                              <Box
                                sx={{
                                  padding: '20px 12px',
                                  borderRadius: '10px',
                                  background: '#F7F7F9',
                                }}
                              >
                                <Typography fontSize={14} fontWeight={400}>
                                  {item.noteToAssignee ?? '-'}
                                </Typography>
                              </Box>
                            ) : null}

                            {((item.files.length > 0 &&
                              item.files.filter(
                                value => value.type === 'SOURCE',
                              ).length > 0) ||
                              (item.files.length > 0 &&
                                item.files.filter(
                                  value => value.type === 'TARGET',
                                ).length > 0)) && <Divider />}

                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                              }}
                              ref={el => (leftContainer.current[index] = el)}
                            >
                              {item.files.length > 0 &&
                                item.files.filter(
                                  value => value.type === 'SOURCE',
                                ).length > 0 && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '20px',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                        }}
                                      >
                                        <Typography
                                          fontSize={14}
                                          fontWeight={600}
                                        >
                                          Source files
                                        </Typography>
                                        <Typography
                                          fontSize={12}
                                          fontWeight={400}
                                          color='rgba(76, 78, 100, 0.60)'
                                        >
                                          {formatFileSize(
                                            getFileSize(item.files, 'SOURCE'),
                                          )}{' '}
                                          / {byteToGB(MAXIMUM_FILE_SIZE)}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        color='#8D8E9A'
                                        fontSize={14}
                                        fontWeight={500}
                                        sx={{
                                          textDecoration: 'underline',
                                          cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                          DownloadAllFiles(
                                            item.files!.filter(
                                              value => value.type === 'SOURCE',
                                            ),
                                            S3FileType.JOB,
                                          )
                                        }
                                      >
                                        Download all
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',

                                        width: '100%',
                                        gap: '20px',
                                      }}
                                    >
                                      {item.files.length > 0 &&
                                        item.files
                                          .filter(
                                            value => value.type === 'SOURCE',
                                          )
                                          .map(
                                            (file: FileType, index: number) => {
                                              return (
                                                <Box key={uuidv4()}>
                                                  <Box
                                                    sx={{
                                                      display: 'flex',
                                                      marginBottom: '8px',
                                                      width: '100%',
                                                      justifyContent:
                                                        'space-between',
                                                      borderRadius: '8px',
                                                      padding: '10px 12px',
                                                      border:
                                                        '1px solid rgba(76, 78, 100, 0.22)',
                                                      background: '#f9f8f9',
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          marginRight: '8px',
                                                          display: 'flex',
                                                        }}
                                                      >
                                                        <Image
                                                          src={`/images/icons/file-icons/${extractFileExtension(
                                                            file.name,
                                                          )}.svg`}
                                                          alt=''
                                                          width={32}
                                                          height={32}
                                                        />
                                                      </Box>
                                                      <Box
                                                        sx={{
                                                          display: 'flex',
                                                          flexDirection:
                                                            'column',
                                                        }}
                                                      >
                                                        <Tooltip
                                                          title={file.name}
                                                        >
                                                          <Typography
                                                            variant='body1'
                                                            fontSize={14}
                                                            fontWeight={600}
                                                            lineHeight={'20px'}
                                                            sx={{
                                                              overflow:
                                                                'hidden',
                                                              wordBreak:
                                                                'break-all',
                                                              textOverflow:
                                                                'ellipsis',
                                                              display:
                                                                '-webkit-box',
                                                              WebkitLineClamp: 1,
                                                              WebkitBoxOrient:
                                                                'vertical',
                                                            }}
                                                          >
                                                            {file.name}
                                                          </Typography>
                                                        </Tooltip>

                                                        <Typography
                                                          variant='caption'
                                                          lineHeight={'14px'}
                                                        >
                                                          {formatFileSize(
                                                            file.size,
                                                          )}
                                                        </Typography>
                                                      </Box>
                                                    </Box>
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                      }}
                                                    >
                                                      <IconButton
                                                        onClick={() => {
                                                          downloadFile(file)
                                                        }}
                                                      >
                                                        <Icon
                                                          icon='ic:sharp-download'
                                                          fontSize={24}
                                                        />
                                                      </IconButton>
                                                    </Box>
                                                  </Box>
                                                </Box>
                                              )
                                            },
                                          )}
                                    </Box>
                                  </Box>
                                )}
                              {item.files.length > 0 &&
                                item.files.filter(
                                  value => value.type === 'TARGET',
                                ).length > 0 && (
                                  <>
                                    <Divider />
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '20px',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                          }}
                                        >
                                          <Typography
                                            fontSize={14}
                                            fontWeight={600}
                                          >
                                            Target files
                                          </Typography>
                                          <Typography
                                            fontSize={12}
                                            fontWeight={400}
                                            color='rgba(76, 78, 100, 0.60)'
                                          >
                                            {formatFileSize(
                                              getFileSize(item.files, 'TARGET'),
                                            )}{' '}
                                            / {byteToGB(MAXIMUM_FILE_SIZE)}
                                          </Typography>
                                        </Box>
                                        <Typography
                                          color='#8D8E9A'
                                          fontSize={14}
                                          fontWeight={500}
                                          sx={{
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                          }}
                                          onClick={() =>
                                            DownloadAllFiles(
                                              item.files!.filter(
                                                value =>
                                                  value.type === 'TARGET',
                                              ),
                                              S3FileType.JOB,
                                            )
                                          }
                                        >
                                          Download all
                                        </Typography>
                                      </Box>

                                      <Box
                                        sx={{
                                          display: 'grid',
                                          gridTemplateColumns: 'repeat(2, 1fr)',

                                          width: '100%',
                                          gap: '20px',
                                        }}
                                      >
                                        {item.files.length > 0 &&
                                          item.files
                                            .filter(
                                              value => value.type === 'TARGET',
                                            )
                                            .map(
                                              (
                                                file: FileType,
                                                index: number,
                                              ) => {
                                                return (
                                                  <Box key={uuidv4()}>
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        marginBottom: '8px',
                                                        width: '100%',
                                                        justifyContent:
                                                          'space-between',
                                                        borderRadius: '8px',
                                                        padding: '10px 12px',
                                                        border:
                                                          '1px solid rgba(76, 78, 100, 0.22)',
                                                        background: '#f9f8f9',
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        <Box
                                                          sx={{
                                                            marginRight: '8px',
                                                            display: 'flex',
                                                          }}
                                                        >
                                                          <Image
                                                            src={`/images/icons/file-icons/${extractFileExtension(
                                                              file.name,
                                                            )}.svg`}
                                                            alt=''
                                                            width={32}
                                                            height={32}
                                                          />
                                                        </Box>
                                                        <Box
                                                          sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                              'column',
                                                          }}
                                                        >
                                                          <Tooltip
                                                            title={file.name}
                                                          >
                                                            <Typography
                                                              variant='body1'
                                                              fontSize={14}
                                                              fontWeight={600}
                                                              lineHeight={
                                                                '20px'
                                                              }
                                                              sx={{
                                                                overflow:
                                                                  'hidden',
                                                                wordBreak:
                                                                  'break-all',
                                                                textOverflow:
                                                                  'ellipsis',
                                                                display:
                                                                  '-webkit-box',
                                                                WebkitLineClamp: 1,
                                                                WebkitBoxOrient:
                                                                  'vertical',
                                                              }}
                                                            >
                                                              {file.name}
                                                            </Typography>
                                                          </Tooltip>

                                                          <Typography
                                                            variant='caption'
                                                            lineHeight={'14px'}
                                                          >
                                                            {formatFileSize(
                                                              file.size,
                                                            )}
                                                          </Typography>
                                                        </Box>
                                                      </Box>
                                                      <Box
                                                        sx={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        <IconButton
                                                          onClick={() =>
                                                            downloadFile(file)
                                                          }
                                                        >
                                                          <Icon
                                                            icon='ic:sharp-download'
                                                            fontSize={24}
                                                          />
                                                        </IconButton>
                                                      </Box>
                                                    </Box>
                                                  </Box>
                                                )
                                              },
                                            )}
                                      </Box>
                                    </Box>
                                  </>
                                )}
                            </div>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={5.5}
                          sx={{
                            // height: '100%',
                            maxHeight: '565px',

                            overflowY: 'scroll',
                            '&::-webkit-scrollbar': { width: 4 },
                            '&::-webkit-scrollbar-thumb': {
                              borderRadius: 20,
                              background: '#CCCCCC',
                            },
                            // height: leftContainer.current[index]
                            //   ? `${leftContainer.current[index]?.offsetHeight}px`
                            //   : '100%',
                          }}
                        >
                          <Box
                            sx={{
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              height: '100%',

                              gap: '20px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                  }}
                                >
                                  <Typography fontSize={16} fontWeight={600}>
                                    Reviewed files
                                  </Typography>
                                  <Typography
                                    fontSize={12}
                                    fontWeight={400}
                                    color='rgba(76, 78, 100, 0.60)'
                                  >
                                    {formatFileSize(
                                      getFileSize(item.files, 'REVIEWED'),
                                    )}{' '}
                                    / {byteToGB(MAXIMUM_FILE_SIZE)}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <Checkbox
                                    checked={item.isCompleted}
                                    onChange={event =>
                                      onClickCompleteReview(event, item.id)
                                    }
                                  />
                                  <Typography
                                    fontSize={14}
                                    fontWeight={400}
                                    color='rgba(76, 78, 100, 0.60)'
                                  >
                                    Completed
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: '12px',
                                  alignItems: 'center',
                                }}
                              >
                                <Tooltip
                                  title={reviewInGlosubButtonStatus()}
                                  disableHoverListener={
                                    reviewInGlosubButtonStatus() === 'active'
                                  }
                                >
                                  <Box sx={{ flex: 1, display: 'flex' }}>
                                    <Button
                                      variant='outlined'
                                      fullWidth
                                      disabled={
                                        reviewInGlosubButtonStatus() !==
                                        'active'
                                      }
                                      sx={{ borderColor: '#B3B6FF' }}
                                      onClick={() => {
                                        window.open(
                                          `${process.env.NEXT_PUBLIC_GLOSUB_DOMAIN ?? 'https://glosub-dev.gloground.com'}/?jobId=${jobInfo.id}&token=${getUserTokenFromBrowser()}&role=${currentRole?.name}&mode=qc`,
                                          '_blank',
                                        )
                                      }}
                                    >
                                      <Image
                                        src='/images/icons/job-icons/glosub.svg'
                                        alt=''
                                        width={20}
                                        height={20}
                                      />
                                      &nbsp; Review in GloSub
                                    </Button>
                                  </Box>
                                </Tooltip>
                                {/* <Button
                                  sx={{ flex: 1, display: 'flex' }}
                                  variant='outlined'
                                >
                                  <Icon
                                    icon='material-symbols:rate-review-outline'
                                    fontSize={20}
                                  />
                                  &nbsp;&nbsp;Review in GloSub
                                </Button> */}
                                <Button
                                  sx={{ flex: 1, display: 'flex' }}
                                  variant='contained'
                                  onClick={() =>
                                    onClickUploadReviewedFiles(item.id)
                                  }
                                >
                                  Upload
                                </Button>
                              </Box>
                            </Box>
                            <Divider />
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',

                                height: '100%',
                              }}
                            >
                              {item.reviewedFileGroup.length > 0 ? (
                                <Box>
                                  {item.reviewedFileGroup.map(
                                    (value, index) => {
                                      return (
                                        <Box
                                          key={uuidv4()}
                                          sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '20px',
                                            mb:
                                              index ===
                                              item.reviewedFileGroup.length - 1
                                                ? '20px'
                                                : '0',
                                          }}
                                        >
                                          {index > 0 && (
                                            <Divider
                                              sx={{ mt: '20px !important' }}
                                              // sx={{ my: '20px !important' }}
                                            />
                                          )}
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              // alignItems: 'center',

                                              justifyContent: 'space-between',

                                              // mb: '20px',
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '4px',
                                              }}
                                            >
                                              <Typography
                                                fontSize={14}
                                                fontWeight={600}
                                              >
                                                {convertTimeToTimezone(
                                                  value.createdAt,
                                                  auth.getValue().user
                                                    ?.timezone,
                                                  timezone.getValue(),
                                                )}
                                              </Typography>
                                              <Typography
                                                fontSize={14}
                                                fontWeight={400}
                                                color='#8D8E9A'
                                              >
                                                {value.reviewerInfo.name ?? '-'}
                                              </Typography>
                                            </Box>

                                            <Typography
                                              color='#8D8E9A'
                                              fontSize={14}
                                              fontWeight={500}
                                              sx={{
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                              }}
                                              onClick={() =>
                                                DownloadAllFiles(
                                                  value.files,
                                                  S3FileType.JOB,
                                                )
                                              }
                                            >
                                              Download all
                                            </Typography>
                                          </Box>
                                          {value.files.length > 0 && (
                                            <Box
                                              sx={{
                                                display: 'grid',
                                                gridTemplateColumns:
                                                  'repeat(2,1fr)',
                                                gridGap: '16px',
                                              }}
                                            >
                                              {value.files.map(item => {
                                                return (
                                                  <Box key={uuidv4()}>
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        marginBottom: '8px',
                                                        width: '100%',
                                                        justifyContent:
                                                          'space-between',
                                                        borderRadius: '8px',
                                                        padding: '10px 12px',
                                                        border:
                                                          '1px solid rgba(76, 78, 100, 0.22)',
                                                        background: '#f9f8f9',
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        <Box
                                                          sx={{
                                                            marginRight: '8px',
                                                            display: 'flex',
                                                          }}
                                                        >
                                                          <Image
                                                            src={`/images/icons/file-icons/${extractFileExtension(
                                                              item.name,
                                                            )}.svg`}
                                                            alt=''
                                                            width={32}
                                                            height={32}
                                                          />
                                                        </Box>
                                                        <Box
                                                          sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                              'column',
                                                          }}
                                                        >
                                                          <Tooltip
                                                            title={item.name}
                                                          >
                                                            <Typography
                                                              variant='body1'
                                                              fontSize={14}
                                                              fontWeight={600}
                                                              lineHeight={
                                                                '20px'
                                                              }
                                                              sx={{
                                                                overflow:
                                                                  'hidden',
                                                                wordBreak:
                                                                  'break-all',
                                                                textOverflow:
                                                                  'ellipsis',
                                                                display:
                                                                  '-webkit-box',
                                                                WebkitLineClamp: 1,
                                                                WebkitBoxOrient:
                                                                  'vertical',
                                                              }}
                                                            >
                                                              {item.name}
                                                            </Typography>
                                                          </Tooltip>

                                                          <Typography
                                                            variant='caption'
                                                            lineHeight={'14px'}
                                                          >
                                                            {formatFileSize(
                                                              item.size,
                                                            )}
                                                          </Typography>
                                                        </Box>
                                                      </Box>
                                                      <Box
                                                        sx={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        <IconButton
                                                          onClick={() => {
                                                            downloadFile(item)
                                                          }}
                                                        >
                                                          <Icon
                                                            icon='ic:sharp-download'
                                                            fontSize={24}
                                                          />
                                                        </IconButton>
                                                      </Box>
                                                    </Box>
                                                  </Box>
                                                )
                                              })}
                                            </Box>
                                          )}

                                          {value.note && (
                                            <Box
                                              sx={{
                                                borderRadius: '10px',
                                                background: '#F7F7F9',
                                                padding: '20px 12px',
                                              }}
                                            >
                                              <Typography
                                                fontSize={14}
                                                fontWeight={400}
                                              >
                                                {value.note ?? '-'}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>
                                      )
                                    },
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    padding: '20px',
                                    borderRadius: '10px',
                                    border: '1px solid #D8D8DD',
                                    background: '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                  }}
                                >
                                  <Typography
                                    fontSize={14}
                                    fontWeight={400}
                                    color='#8D8E9A'
                                  >
                                    There are no reviewed files
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '20vh',
                    borderRadius: '10px',
                    border: '1px solid #D8D8DD',
                  }}
                >
                  <Typography fontSize={14} fontWeight={400}>
                    There are no review requests
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  )
}

export default ReviewRequest
