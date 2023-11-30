import { Icon } from '@iconify/react'
import { Box, IconButton, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { ProAppliedRolesStatusType } from '@src/types/pro-certification-test/applied-roles'

type Props = {
  onClose: any
  vary:
    | 'error'
    | 'info'
    | 'error-report'
    | 'progress'
    | 'successful'
    | 'question-info'

  status: ProAppliedRolesStatusType
}

const ReasonModal = ({ vary, status, onClose }: Props) => {
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
            mb: '8px',
          }}
        >
          <AlertIcon type={vary} />
        </Box>
        <Typography
          variant='body2'
          fontSize={16}
          sx={{ whiteSpace: 'pre-line !important' }}
        >
          {status === 'Test in preparation' ? (
            <>
              There are no tests currently available for the role you have
              applied for.
              <br />
              <br /> Once tests are created, you will be able to take them after
              going through the TAD verification process.
            </>
          ) : (
            ''
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export default ReasonModal
