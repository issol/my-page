import { Icon } from '@iconify/react'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'
import {
  ProAppliedRolesStatusType,
  ProAppliedRolesType,
} from '@src/types/pro-certification-test/applied-roles'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import dayjs from 'dayjs'

type Props = {
  onClose: any
  vary:
    | 'error'
    | 'info'
    | 'error-report'
    | 'progress'
    | 'successful'
    | 'question-info'

  row: ProAppliedRolesType
  timezone: CountryType
}

const ReasonModal = ({ vary, row, onClose, timezone }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '361px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close' />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            mb: '24px',
          }}
        >
          <AlertIcon type={vary} />
        </Box>

        {row.status === 'Rejected by TAD' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='h6'>
                {row.reason.type}&nbsp; reason
              </Typography>
              <Typography variant='body1'>{row.reason.reason}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='h6'>
                Message from {row.reason.from}
              </Typography>
              <Box
                sx={{
                  border: '1px solid rgba(76, 78, 100, 0.22)',
                  borderRadius: '10px',
                  padding: '20px',
                }}
              >
                <Typography
                  variant='body1'
                  // fontSize={16}
                  sx={{ whiteSpace: 'pre-line !important' }}
                >
                  {row.reason.message}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography variant='h6'>Retest date</Typography>
              <Typography
                variant='body1'
                // fontSize={16}
                // sx={{ whiteSpace: 'pre-line !important' }}
              >
                Please wait until{' '}
                {FullDateTimezoneHelper(row.reason.retestDate, timezone)} to
                reapply for the role.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography
            variant='body2'
            fontSize={16}
            sx={{ whiteSpace: 'pre-line !important' }}
          >
            {row.status === 'Test in preparation' ? (
              <>
                There are no tests currently available for the role you have
                applied for.
                <br />
                <br /> Once tests are created, you will be able to take them
                after going through the TAD verification process.
              </>
            ) : row.status === 'Skill test Ready' && row.basicTest.isSkipped ? (
              <>
                TAD has waived the requirement for the basic test for you.
                <br />
                <br /> There is no need to submit the basic test, even if you
                have already commenced it.
                <br />
                <br /> Please proceed with the skill test.
              </>
            ) : row.status === 'Skill test Ready' && !row.basicTest.isPassed ? (
              <>
                TAD has decided to proceed with the skill test regardless of the
                Basic test results.
                <br />
                <br />
                Please proceed with the Skill test.
              </>
            ) : row.status === 'Basic failed' ? (
              <>
                You failed the basic test.
                <br />
                <br /> To reapply to the same role, please wait until{' '}
                {FullDateTimezoneHelper(
                  dayjs(row.basicTest.testStartedAt).add(6, 'month'),
                  timezone,
                )}{' '}
                before proceeding.
              </>
            ) : row.status === 'Skill failed' ? (
              <>
                You failed the skill test.
                <br />
                <br /> To reapply to the same role, please wait until{' '}
                {dayjs(row.skillTest.testStartedAt).format('MM/DD/YYYY')}&nbsp;
                before proceeding.
              </>
            ) : (
              ''
            )}
          </Typography>
        )}
        {row.status === 'Skill test Ready' && row.basicTest.isSkipped && (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              mt: '16px',
            }}
          >
            <Button variant='contained' onClick={onClose}>
              Okay
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReasonModal
