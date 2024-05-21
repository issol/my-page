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
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import { CompanyOptionType } from '@src/types/options.type'
import {
  JobRequestReviewFormType,
  JobRequestReviewListType,
} from '@src/types/orders/job-detail'
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
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { requestReviewSchema } from '@src/types/schema/job-detail'
import { Icon } from '@iconify/react'
import { FileType } from '@src/types/common/file.type'
import Image from 'next/image'
import { videoExtensions } from '@src/shared/const/upload-file-extention/file-extension'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import {
  DownloadAllFiles,
  DownloadFile,
} from '@src/shared/helpers/downlaod-file'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { useMutation, useQueryClient } from 'react-query'
import { completeRequestReview } from '@src/apis/jobs/job-detail.api'
import UploadReviewedFilesModal from './upload-reviewed-files-modal'
import { useDropzone } from 'react-dropzone'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

type Props = {
  // requestReviewList: {
  //   jobId: number
  //   data: JobRequestReviewListType[]
  // }
  jobId: number
  lspList: CompanyOptionType[]
  jobInfo: JobType
}

interface JobReviewedGroupedFileType {
  createdAt: string

  data: FileType[]
}

const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE

// const ReviewRequest = ({ requestReviewList, lspList }: Props) => {
const ReviewRequest = ({ jobId, lspList, jobInfo }: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()
  const leftContainer = useRef<Array<HTMLDivElement | null>>([])

  const completeRequestReviewMutation = useMutation(
    (data: { id: number; completed: boolean }) =>
      completeRequestReview(data.id, data.completed),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['jobRequestReview'])
      },
    },
  )

  const [checked, setChecked] = useState(true)

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)

    let size = 0
    files.forEach((file: FileType) => {
      size += Number(file.size)
    })

    return size
  }

  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [lsp, setLsp] = useState<string[]>(['all'])

  const { data: requestReviewList, isLoading } = useGetJobRequestReview(
    jobId,
    lsp,
  )
  const [selectedLsp, setSelectedLsp] = useState<
    { value: string; label: string }[]
  >([{ value: 'all', label: 'All' }])
  const [lspListOptions, setLspListOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const handleChange = (event: SelectChangeEvent<typeof lsp>) => {
    const {
      target: { value },
    } = event

    const result = lspListOptions.filter(option => value.includes(option.value))

    setLsp(typeof value === 'string' ? value.split(',') : value)
    setSelectedLsp(result)
  }

  const [expanded, setExpanded] = useState<string | false>(false)
  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
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
            // reset()
            closeModal('RequestReviewModal')
          }}
          // control={control}
          // handleSubmit={handleSubmit}

          jobSourceFiles={
            jobInfo.files?.filter(value => value.type === 'SOURCE') || []
          }
          jobTargetFiles={
            jobInfo.files?.filter(value => value.type === 'TARGET') || []
          }
          type={type}
          jobId={jobId}
          requestInfo={info}
          // watch={watch}
          // errors={errors}
          // setFocus={setFocus}
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
                    setChecked(true)
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
                    setChecked(false)
                  },
                },
              )
            }}
            vary='error-report'
          />
        ),
      })
    }
    // setChecked(event.target.checked)
  }

  const onClickUploadReviewedFiles = (id: number) => {
    openModal({
      type: 'UploadReviewedFilesModal',
      children: (
        <UploadReviewedFilesModal
          onClose={() => closeModal('UploadReviewedFilesModal')}
        />
      ),
    })
  }

  const getGroupedReviewedFiles = (files: FileType[]) => {
    const groupedFiles = files
      .filter(value => value.type === 'REVIEWED')
      .reduce((acc: JobReviewedGroupedFileType[], curr: FileType) => {
        const existingGroup = acc.find(
          group => group.createdAt === curr.createdAt,
        )
        if (existingGroup) {
          existingGroup.data.push(curr)
        } else {
          acc.push({
            createdAt: curr.createdAt!,
            data: [curr],
          })
        }
        return acc
      }, [])
    return groupedFiles
  }

  useEffect(() => {
    const res = lspList.map(lsp => ({
      label: lsp.name,
      value: lsp.id,
    }))
    const result = [{ label: 'All', value: 'all' }, ...res]
    setLspListOptions(result)
  }, [lspList])

  useEffect(() => {
    if (leftContainer.current) {
      console.log(leftContainer.current)
    }
  }, [leftContainer])

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
                <Select
                  multiple
                  value={lsp}
                  onChange={handleChange}
                  input={<OutlinedInput />}
                  // MenuProps={MenuProps}
                  renderValue={selected =>
                    selectedLsp.map(value => value.label).join(', ')
                  }
                >
                  {lspListOptions.map(option => (
                    <MenuItem key={uuidv4()} value={option.value}>
                      <Checkbox checked={lsp.indexOf(option.value) > -1} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {requestReviewList.length > 0 ? (
                requestReviewList.map((item, index) => (
                  <Accordion
                    key={uuidv4()}
                    expanded={expanded === item.id.toString()}
                    onChange={handleAccordionChange(item.id.toString())}
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
                            {item.corporationId}.
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
                              auth.getValue().user?.timezone!,
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
                            {item.requestor}
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
                            {item.assignee}
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
                          sx={{ borderRight: '1px solid #F7F7F9' }}
                          ref={el => (leftContainer.current[index] = el)}
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
                                    item.desiredDueAt,
                                    item.desiredDueTimezone,
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
                            {item.note !== '' && item.note ? (
                              <Box
                                sx={{
                                  padding: '20px 12px',
                                  borderRadius: '10px',
                                  background: '#F7F7F9',
                                }}
                              >
                                <Typography fontSize={14} fontWeight={400}>
                                  {item.note ?? '-'}
                                </Typography>
                              </Box>
                            ) : null}

                            <Divider />
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
                                                        src={`/images/icons/file-icons/${
                                                          videoExtensions.includes(
                                                            file.name
                                                              ?.split('.')
                                                              .pop()
                                                              ?.toLowerCase() ??
                                                              '',
                                                          )
                                                            ? 'video'
                                                            : 'document'
                                                        }.svg`}
                                                        alt=''
                                                        width={32}
                                                        height={32}
                                                      />
                                                    </Box>
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
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
                                                            overflow: 'hidden',
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
                                                        DownloadFile(
                                                          file,
                                                          S3FileType.JOB,
                                                        )
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
                                              value => value.type === 'TARGET',
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
                                                          src={`/images/icons/file-icons/${
                                                            videoExtensions.includes(
                                                              file.name
                                                                ?.split('.')
                                                                .pop()
                                                                ?.toLowerCase() ??
                                                                '',
                                                            )
                                                              ? 'video'
                                                              : 'document'
                                                          }.svg`}
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
                                                        onClick={() =>
                                                          DownloadFile(
                                                            file,
                                                            S3FileType.JOB,
                                                          )
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
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={5.5}
                          sx={{
                            height: leftContainer.current[index]
                              ? `${leftContainer.current[index]?.offsetHeight}px`
                              : '100%',
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
                                    checked={checked}
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
                                <Button
                                  sx={{ flex: 1, display: 'flex' }}
                                  variant='outlined'
                                >
                                  <Icon
                                    icon='material-symbols:rate-review-outline'
                                    fontSize={20}
                                  />
                                  &nbsp;&nbsp;Review in GloSub
                                </Button>
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
                            <>
                              {getGroupedReviewedFiles(item.files).length >
                              0 ? (
                                <Box>
                                  {getGroupedReviewedFiles(item.files).map(
                                    value => {
                                      return (
                                        <Box key={uuidv4()}>
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              mb: '20px',
                                            }}
                                          >
                                            <Typography
                                              fontSize={14}
                                              fontWeight={600}
                                            >
                                              {convertTimeToTimezone(
                                                value.createdAt,
                                                auth.getValue().user?.timezone,
                                                timezone.getValue(),
                                              )}
                                            </Typography>

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
                                                  value.data,
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
                                              gridTemplateColumns:
                                                'repeat(2,1fr)',
                                              gridGap: '16px',
                                            }}
                                          >
                                            {value.data.map(item => {
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
                                                          src={`/images/icons/file-icons/${
                                                            videoExtensions.includes(
                                                              item.name
                                                                ?.split('.')
                                                                .pop()
                                                                ?.toLowerCase() ??
                                                                '',
                                                            )
                                                              ? 'video'
                                                              : 'document'
                                                          }.svg`}
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
                                                        onClick={() =>
                                                          DownloadFile(
                                                            item,
                                                            S3FileType.JOB,
                                                          )
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
                                            })}
                                          </Box>
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
                                    There are reviewed files
                                  </Typography>
                                </Box>
                              )}
                            </>
                            {item.reviewedNote && (
                              <Box
                                sx={{
                                  borderRadius: '10px',
                                  background: '#F7F7F9',
                                  padding: '20px 12px',
                                }}
                              >
                                <Typography fontSize={14} fontWeight={400}>
                                  {item.reviewedNote}
                                </Typography>
                              </Box>
                            )}
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
