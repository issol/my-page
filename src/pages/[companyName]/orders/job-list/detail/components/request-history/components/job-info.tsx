import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Typography,
  Card,
} from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import FileItem from '@src/@core/components/fileItem'
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
import { JobType } from '@src/types/common/item.type'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  jobInfo: JobType
}

const HistoryJobInfo = ({ jobInfo }: Props) => {
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const getFileSize = (file: FileType[], type: string) => {
    const files = file.filter((file: FileType) => file.type === type)
    let size = 0
    files.forEach((file: FileType) => {
      size += file.size
    })

    return size
  }

  const fileList = (file: FileType[], type: string) => {
    return file.map((value: FileType) => {
      if (value.type === type) {
        return (
          <Box key={uuidv4()}>
            <FileItem
              key={value.name}
              file={value}
              onClick={() => DownloadFile(value, S3FileType.JOB)}
            />
          </Box>
        )
      }
    })
  }
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        mt: '30px',
      }}
    >
      <Typography fontSize={20} fontWeight={500}>
        {jobInfo?.corporationId}
      </Typography>
      <Grid container spacing={4} rowSpacing={6}>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={4.32}>
              <Typography fontSize={14} fontWeight={600}>
                Job name
              </Typography>
            </Grid>
            <Grid item xs={7.68}>
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

        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={4.32}>
              <Typography fontSize={14} fontWeight={600}>
                Contact person for job
              </Typography>
            </Grid>
            <Grid item xs={7.68}>
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
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={4.32}>
              <Typography fontSize={14} fontWeight={600}>
                Service type
              </Typography>
            </Grid>
            <Grid item xs={7.68}>
              <ServiceTypeChip label={jobInfo.serviceType} size='small' />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={4.32}>
              <Typography fontSize={14} fontWeight={600}>
                Language pair
              </Typography>
            </Grid>
            <Grid item xs={7.68}>
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
                  '-'
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={4} rowSpacing={6}>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={4.32}>
              <Typography fontSize={14} fontWeight={600}>
                Job start date
              </Typography>
            </Grid>
            <Grid item xs={7.68}>
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
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={4.32}>
              <Typography fontSize={14} fontWeight={600}>
                Job due date
              </Typography>
            </Grid>
            <Grid item xs={7.68}>
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
            <Checkbox disabled checked={jobInfo.isShowDescription} />
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

      <>
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
              display: jobInfo.files && jobInfo.files.length ? 'grid' : 'none',
              gridTemplateColumns: 'repeat(3, 1fr)',

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
    </Card>
  )
}

export default HistoryJobInfo
