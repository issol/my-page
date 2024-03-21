import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import FileItem from '@src/@core/components/fileItem'
import { saveJobInfo } from '@src/apis/jobs/job-detail.api'
import useModal from '@src/hooks/useModal'
import { useGetStatusList } from '@src/queries/common.query'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import {
  DownloadAllFiles,
  DownloadFile,
} from '@src/shared/helpers/downlaod-file'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { timezoneSelector } from '@src/states/permission'
import { FileType } from '@src/types/common/file.type'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { statusType } from '@src/types/common/status.type'
import {
  JobAssignProRequestsType,
  JobRequestsProType,
} from '@src/types/jobs/jobs.type'
import { SaveJobInfoParamsType } from '@src/types/orders/job-detail'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import InfoEditModal from './edit-modal'
import {
  LanguagePairTypeInItem,
  ProjectInfoType,
  ProjectTeamListType,
} from '@src/types/orders/order-detail'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import Message from '../assign-pro/message-modal'

type Props = {
  jobInfo: JobType
  jobAssign: JobAssignProRequestsType[]
  projectTeam: ProjectTeamListType[]
  items: JobItemType | undefined
  languagePair: LanguagePairTypeInItem[]
  setJobId: Dispatch<SetStateAction<number[]>>
}

const JobInfo = ({
  jobInfo,
  jobAssign,
  projectTeam,
  items,
  languagePair,
  setJobId,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contactPersonList, setContactPersonList] = useState<
    { value: string; label: string; userId: any }[]
  >([])

  const { data: jobStatusList } = useGetStatusList('Job')
  const [filteredJobStatus, setFilteredJobStatus] = useState<Array<statusType>>(
    jobStatusList ?? [],
  )
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const saveJobInfoMutation = useMutation(
    (data: { jobId: number; data: SaveJobInfoParamsType }) =>
      saveJobInfo(data.jobId, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.id === variables.jobId) {
          queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
          queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
          queryClient.invalidateQueries([
            'jobAssignProRequests',
            variables.jobId,
          ])
        } else {
          setJobId(prev =>
            prev.map(id => (id === variables.jobId ? data.id : id)),
          )
        }
        // setSuccess && setSuccess(true)
      },
    },
  )

  const fileList = (file: FileType[], type: string) => {
    return file.map((value: FileType) => {
      if (value.type === type) {
        return (
          <Box
            key={uuidv4()}
            onClick={() => DownloadFile(value, S3FileType.JOB)}
          >
            <FileItem key={value.name} file={value} />
          </Box>
        )
      }
    })
  }

  const handleChange = (status: number) => {
    const res: SaveJobInfoParamsType = {
      contactPersonId: jobInfo.contactPerson?.userId!,
      description: jobInfo.description ?? null,
      startDate: jobInfo.startedAt ? jobInfo.startedAt.toString() : null,
      startTimezone: jobInfo.startTimezone ?? null,

      dueDate: jobInfo.dueAt.toString(),
      dueTimezone: jobInfo.dueTimezone,
      status: Number(status),
      sourceLanguage: jobInfo.sourceLanguage,
      targetLanguage: jobInfo.targetLanguage,
      name: jobInfo.name,
      isShowDescription: jobInfo.isShowDescription,
    }

    saveJobInfoMutation.mutate(
      {
        jobId: jobInfo.id,
        data: res,
      },
      {
        onSuccess: () => {
          // setJobStatus(Number(event.target.value))
          closeModal('StatusAlertModal')
          filterStatus(Number(status))
        },
      },
    )
  }

  const onChangeStatus = (event: SelectChangeEvent) => {
    const currentJobStatus = Number(event.target.value)
    if (
      currentJobStatus === 60600 ||
      currentJobStatus === 601000 ||
      currentJobStatus === 60900
    ) {
      openModal({
        type: 'StatusAlertModal',
        children: (
          <CustomModalV2
            title={
              currentJobStatus === 60600
                ? 'Approve job?'
                : currentJobStatus === 601000
                  ? 'Cancel payment?'
                  : 'Set the status Without invoice?'
            }
            subtitle={
              currentJobStatus === 60600 ? (
                <>
                  Are you sure you want to approve the job?
                  <br />
                  <br /> The job must be approved between the 16th and the 31st
                  of the month in which it is completed.
                  <br />
                  <br /> A notification that the job has been approved will be
                  sent to the assigned Pro.
                </>
              ) : currentJobStatus === 601000 ? (
                <>
                  Are you sure you set the job status as Canceled? This action
                  is irreversible.
                  <br />
                  <br /> A notification that the job has been canceled will be
                  sent to the assigned Pro.
                </>
              ) : (
                <>
                  Are you sure you want to set the job status as Without
                  invoice?
                  <br />
                  <br /> A notification that the job status has been set as
                  Without invoice will be sent to the assigned Pro.
                </>
              )
            }
            rightButtonText='Proceed'
            vary={currentJobStatus === 60600 ? 'successful' : 'error-alert'}
            onClose={() => closeModal('StatusAlertModal')}
            onClick={() => handleChange(currentJobStatus)}
          />
        ),
      })
    } else handleChange(currentJobStatus)
  }

  function filterStatus(statusCode: number) {
    switch (statusCode) {
      case 60000: //"In preparation"
        setFilteredJobStatus(
          jobStatusList?.filter(list => [60000, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60100: //"Requested"
        setFilteredJobStatus(
          jobStatusList?.filter(list => [60100, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60200: //"In progress"
        setFilteredJobStatus(
          jobStatusList?.filter(list => [60200, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60300: //"Overdue"
        setFilteredJobStatus(
          jobStatusList?.filter(list => [60300, 601000].includes(list.value))!,
        ) // Canceled
        break
      case 60400: //"Partially delivered"
        setFilteredJobStatus(
          jobStatusList?.filter(list =>
            [60400, 60600, 601000, 60900].includes(list.value),
          )!,
        ) //Approved, Canceled, Without invoice
        break
      case 60500: //"Delivered"
        setFilteredJobStatus(
          jobStatusList?.filter(list =>
            [60500, 60600, 601000, 60900].includes(list.value),
          )!,
        ) //Approved, Canceled, Without invoice
        break
      case 60600: //Approved
        setFilteredJobStatus(
          jobStatusList?.filter(list =>
            [60600, 601000, 60900].includes(list.value),
          )!,
        ) //Canceled, Without invoice
        break
      case 60700: //Invoiced
        setFilteredJobStatus(
          jobStatusList?.filter(list =>
            [60700, 601000, 60900].includes(list.value),
          )!,
        ) //Canceled, Without invoice
        break
      case 601100:
        setFilteredJobStatus(
          jobStatusList?.filter(list => [60800, 601100].includes(list.value))!,
        ) //TODO Payment canceled 고도화때 반영 예정
        break
      case 60900: //Without invoice
        setFilteredJobStatus(
          jobStatusList?.filter(list =>
            [60900, 601000, 60900].includes(list.value),
          )!,
        ) //Canceled, Approved
        break
      default:
        setFilteredJobStatus(
          jobStatusList?.filter(list => list.value === statusCode)!,
        )
    }
  }

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)
    let size = 0
    files.forEach((file: FileType) => {
      size += file.size
    })

    return size
  }

  const onClickEdit = () => {
    console.log(items, 'getValues')

    openModal({
      type: 'InfoEditModal',
      children: (
        <InfoEditModal
          onClose={() => closeModal('InfoEditModal')}
          statusList={jobStatusList ?? []}
          jobInfo={jobInfo}
          contactPersonList={contactPersonList}
          items={items}
          languagePair={languagePair}
          saveJobInfoMutation={saveJobInfoMutation}
        />
      ),
    })
  }

  const onClickRedeliveryReason = () => {
    console.log(jobInfo.pro)

    openModal({
      type: 'SelectRequestRedeliveryReasonModal',
      children: (
        <CustomModal
          noButton
          closeButton
          onClose={() => closeModal('SelectRequestRedeliveryReasonModal')}
          title={
            <>
              <Typography fontSize={20} fontWeight={500}>
                Requested reason
              </Typography>

              <ul>
                {jobInfo.redeliveryHistory?.deleteReason.map(
                  (reason, index) => (
                    <li key={uuidv4()}>
                      <Typography
                        fontSize={16}
                        color='#8D8E9A'
                        fontWeight={400}
                        textAlign={'left'}
                      >
                        {reason}
                      </Typography>
                    </li>
                  ),
                )}
              </ul>

              <Typography fontSize={20} fontWeight={500} mt='16px'>
                Message to Pro
              </Typography>
              <Typography
                fontSize={16}
                color='#8D8E9A'
                fontWeight={400}
                mt='10px'
              >
                {jobInfo.redeliveryHistory?.message ?? '-'}
              </Typography>
            </>
          }
          onClick={() => closeModal('SelectRequestRedeliveryReasonModal')}
          vary='question-info'
          rightButtonText=''
        />
      ),
    })
  }

  const onClickMessage = (row: {
    userId: number
    firstName: string
    middleName: string | null
    lastName: string
  }) => {
    openModal({
      type: 'AssignProMessageModal',
      children: (
        <Message
          jobId={jobInfo.id}
          info={row}
          onClose={() => closeModal('AssignProMessageModal')}
        />
      ),
    })
  }
  useEffect(() => {
    if (jobInfo && jobStatusList) filterStatus(jobInfo.status)
  }, [jobInfo, jobStatusList])

  useEffect(() => {
    if (projectTeam) {
      const contactPerson = projectTeam.map(value => ({
        label: getLegalName({
          firstName: value.firstName,
          middleName: value.middleName,
          lastName: value.lastName,
        }),
        value: getLegalName({
          firstName: value.firstName,
          middleName: value.middleName,
          lastName: value.lastName,
        }),
        userId: Number(value.userId),
      }))
      setContactPersonList(contactPerson)
    }
  }, [projectTeam])

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Box sx={{ padding: '10px 20px', background: '#FFF6E5' }}>
        <Typography fontSize={12} fontWeight={400} color='#4C4E64'>
          {jobAssign.length === 0
            ? 'The information will be delivered to Pro along with the job request'
            : jobAssign.length > 0
              ? 'Changes will only be applied to new requests'
              : jobAssign.some(job => job.requestCompleted === true)
                ? 'Changes will also be applied to the Pro’s job detail page'
                : null}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #D8D8DD',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Typography fontSize={20} fontWeight={500}>
                {jobInfo.corporationId}
              </Typography>
              <IconButton
                sx={{ padding: 0 }}
                onClick={() =>
                  onClickMessage({
                    userId: jobInfo.pro?.id!,
                    firstName: jobInfo.pro?.firstName!,
                    middleName: jobInfo.pro?.middleName!,
                    lastName: jobInfo.pro?.lastName!,
                  })
                }
              >
                <Icon icon='mdi:message-text' />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {jobInfo.autoNextJob ? (
                <Image
                  src='/images/icons/job-icons/trigger.svg'
                  alt=''
                  width={24}
                  height={24}
                ></Image>
              ) : null}
              <Box
                sx={{
                  padding: '3px 4px',
                  borderRadius: '5px',
                  background: jobInfo.autoNextJob ? '#EEFBE5' : '#E9EAEC',
                }}
              >
                <Typography
                  fontSize={13}
                  color={jobInfo.autoNextJob ? '#6AD721' : '#BBBCC4'}
                >
                  {jobInfo.autoNextJob ? 'On' : 'Off'}
                </Typography>
              </Box>
              <Box>
                <IconButton sx={{ padding: 0 }} onClick={handleMenuClick}>
                  <Icon icon='mdi:dots-vertical' />
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={anchorEl}
                  id='customized-menu'
                  onClose={handleMenuClose}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem
                    sx={{
                      gap: 2,
                      '&:hover': {
                        background: 'inherit',
                        cursor: 'default',
                      },
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      padding: 0,
                    }}
                  >
                    <Button
                      startIcon={
                        <Icon
                          icon='mdi:pencil-outline'
                          color='#4C4E648A'
                          fontSize={24}
                        />
                      }
                      fullWidth
                      onClick={() => {
                        handleMenuClose()
                        onClickEdit()
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '6px 16px',
                        fontSize: 16,
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        borderRadius: 0,
                      }}
                    >
                      Edit
                    </Button>
                  </MenuItem>

                  <MenuItem
                    sx={{
                      gap: 2,
                      '&:hover': {
                        background: 'inherit',
                        cursor: 'default',
                      },
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      padding: 0,
                    }}
                  >
                    <Button
                      startIcon={
                        <Icon
                          icon='ic:sharp-read-more'
                          color='#4C4E648A'
                          fontSize={24}
                        />
                      }
                      fullWidth
                      onClick={() => {
                        handleMenuClose()
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '6px 16px',
                        fontSize: 16,
                        fontWeight: 400,
                        color: 'rgba(76, 78, 100, 0.87)',
                        borderRadius: 0,
                      }}
                    >
                      Move on to the next job
                    </Button>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
          <Divider />
          <Grid container spacing={4} rowSpacing={6}>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Job name
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {jobInfo.name ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container alignItems={'center'}>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Status
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Select
                      value={String(jobInfo.status)}
                      onChange={onChangeStatus}
                      size='small'
                      fullWidth
                      // sx={{ width: '253px' }}
                    >
                      {filteredJobStatus?.map(status => {
                        return (
                          <MenuItem key={uuidv4()} value={status.value}>
                            {status.label}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={onClickRedeliveryReason}
                    >
                      <Icon
                        icon='mdi:question-mark-circle-outline'
                        color='rgba(141, 142, 154, 1)'
                        fontSize={20}
                      />
                    </IconButton>
                    {/* {jobInfo.pro ? (

                  ) : null} */}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Contact person for job
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {getLegalName({
                      firstName: jobInfo.contactPerson?.firstName!,
                      middleName: jobInfo.contactPerson?.middleName,
                      lastName: jobInfo.contactPerson?.lastName!,
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Service type
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <ServiceTypeChip label={jobInfo.serviceType} size='small' />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Language pair
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {jobInfo.sourceLanguage && jobInfo.targetLanguage ? (
                      <>
                        {languageHelper(jobInfo.sourceLanguage)} &rarr;{' '}
                        {languageHelper(jobInfo.targetLanguage)}
                      </>
                    ) : (
                      'Language-independent'
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={4} rowSpacing={6}>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Job start date
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {jobInfo.startedAt && jobInfo.startTimezone
                      ? convertTimeToTimezone(
                          jobInfo.startedAt,
                          jobInfo.startTimezone,
                          timezone.getValue(),
                        )
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={jobInfo.pro === null ? 6 : 12}>
              <Grid container>
                <Grid item xs={jobInfo.pro === null ? 4.32 : 3.054}>
                  <Typography fontSize={14} fontWeight={600}>
                    Job due date
                  </Typography>
                </Grid>
                <Grid item xs={jobInfo.pro === null ? 7.68 : 8.946}>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {convertTimeToTimezone(
                      jobInfo.dueAt,
                      jobInfo.dueTimezone,
                      timezone.getValue(),
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography fontSize={14} fontWeight={600}>
                Job description
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox disabled />
                <Typography fontSize={14} fontWeight={400} color='#BBBCC4'>
                  Show job description to Pro
                </Typography>
              </Box>
            </Box>
            <Typography
              fontSize={14}
              fontWeight={400}
              color='rgba(76, 78, 100, 0.60)'
            >
              {jobInfo.description && jobInfo.description !== ''
                ? jobInfo.description
                : '-'}
            </Typography>
          </Box>
          {jobInfo.pro ? null : (
            <>
              {' '}
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: jobInfo.files && jobInfo.files.length ? '20px' : 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Typography fontSize={14} fontWeight={600}>
                    Sample files to pro
                  </Typography>
                  <Button
                    variant='outlined'
                    sx={{
                      height: '30px',
                      border: '1px solid #BBBCC4 !important',
                      color: '#BBBCC4 !important',
                    }}
                    disabled={
                      !(
                        jobInfo.files &&
                        jobInfo.files.find(value => value.type === 'SAMPLE')
                      )
                    }
                    onClick={() =>
                      DownloadAllFiles(
                        jobInfo.files!.filter(value => value.type === 'SAMPLE'),
                        S3FileType.JOB,
                      )
                    }
                  >
                    <Icon icon='mdi:download' fontSize={18} />
                    &nbsp; Download all
                  </Button>
                </Box>

                <Box
                  sx={{
                    display:
                      jobInfo.files && jobInfo.files.length ? 'grid' : 'none',
                    gridTemplateColumns: 'repeat(2, 1fr)',

                    width: '100%',
                    gap: '20px',
                  }}
                >
                  {jobInfo.files && fileList(jobInfo.files, 'SAMPLE')}
                </Box>

                <Box>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {formatFileSize(
                      jobInfo.files ? getFileSize(jobInfo?.files, 'SAMPLE') : 0,
                    )}
                    / {byteToGB(MAXIMUM_FILE_SIZE)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default JobInfo
