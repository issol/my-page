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
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import FileItem from '@src/@core/components/fileItem'
import { JobStatus } from '@src/shared/const/status/statuses'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { FileType } from '@src/types/common/file.type'
import { JobType } from '@src/types/common/item.type'
import { JobStatusType } from '@src/types/jobs/common.type'
import { ro } from 'date-fns/locale'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  row: JobType
}
const ViewJobInfo = ({ row }: Props) => {
  const [jobStatus, setJobStatus] = useState<JobStatusType>(row.status)
  const [jobFeedback, setJobFeedback] = useState<string>(row.feedback ?? '')

  const handleChange = (event: SelectChangeEvent) => {
    setJobStatus(event.target.value as JobStatusType)
    // const data = getProjectInfo()
    // patchProjectInfoMutation.mutate({
    //   id: projectInfo.id,
    //   form: { ...data, status: event.target.value as OrderStatusType },
    // })
  }

  const fileList = (file: FileType[], type: string) => {
    console.log(file, type)

    return file.map((file: FileType) => {
      if (file.type === type) {
        return (
          <Box key={uuidv4()}>
            <FileItem key={file.name} file={file} />
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
        <Button variant='outlined' disabled={!!row.assignedPro}>
          <Icon icon='mdi:pencil-outline' fontSize={24} />
          &nbsp; Edit before request
        </Button>
      </Box>
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
              {row.jobName}
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
                {row.contactPerson}
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
          <Button variant='contained'>
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
          {fileList(row.files, 'SAMPLE')}
        </Box>

        <Box>
          <Typography variant='subtitle2'>
            {getFileSize(row.files, 'SAMPLE') === 0
              ? 0
              : Math.round(getFileSize(row.files, 'SAMPLE') / 100) / 10 > 1000
              ? `${(
                  Math.round(getFileSize(row.files, 'SAMPLE') / 100) / 10000
                ).toFixed(1)} mb`
              : `${(
                  Math.round(getFileSize(row.files, 'SAMPLE') / 100) / 10
                ).toFixed(1)} kb`}
            /2gb
          </Typography>
        </Box>
      </Box>
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
          <Button variant='contained'>
            <Icon icon='mdi:download' fontSize={18} />
            &nbsp; Download all
          </Button>
        </Box>
        {row.files.filter(value => value.type === 'TARGET').length > 0 ? (
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
              <Button variant='contained'>
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
