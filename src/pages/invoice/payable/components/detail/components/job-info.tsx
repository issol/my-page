// ** style components
import { Box, Card, Divider, Typography } from '@mui/material'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'

// ** helpers
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'

// ** types
import { JobType } from '@src/types/common/item.type'
import { statusType } from '@src/types/common/status.type'
import { JobStatusType } from '@src/types/jobs/jobs.type'

type Props = {
  row: JobType
  jobStatusList: Array<statusType>
}
const ViewJobInfo = ({ row, jobStatusList }: Props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              {JobsStatusChip(row.status as JobStatusType, jobStatusList)}
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
                  ? convertTimeToTimezone(row.startedAt, row.startTimezone)
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
                {convertTimeToTimezone(row.dueAt, row.dueTimezone)}
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
    </Box>
  )
}

export default ViewJobInfo
