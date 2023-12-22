import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import Chip from '@src/@core/components/mui/chip'
import { JobPostingDetailType } from '@src/apis/jobPosting.api'
import languageHelper from '@src/shared/helpers/language.helper'
import { JobOpeningDetailType } from '@src/types/pro/pro-job-openings'
import { JobTypeColor, RoleColor } from 'src/shared/const/chipColors'

type Props = {
  onClick: any
  onClose: any
  vary:
    | 'error'
    | 'info'
    | 'error-report'
    | 'progress'
    | 'successful'
    | 'guideline-info'
    | 'question-info'
  rightButtonText: string
  title: string
  subtitle?: string
  row: JobOpeningDetailType
}

const ApplyModal = ({
  onClick,
  onClose,
  vary,
  rightButtonText,
  title,
  subtitle,
  row,
}: Props) => {
  return (
    <Box
      sx={{
        maxWidth: '382px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertIcon type={vary} />

          <Typography variant='h6' textAlign='center' mt='10px'>
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant='body1'
              textAlign='center'
              // color={subtitleColor ?? 'secondary'}
              sx={{ fontWeight: 400, fontSize: '16px' }}
            >
              {subtitle}
            </Typography>
          ) : null}

          <Box
            sx={{
              mt: '20px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid rgba(76, 78, 100, 0.22)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Typography variant='body1' fontSize={14} fontWeight={400}>
              Test info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '2px' }}>
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={600}
                sx={{ width: '85px' }}
              >
                Job type:
              </Typography>
              <Chip
                size='medium'
                type='jobType'
                label={row.jobType}
                /* @ts-ignore */
                customcolor={JobTypeColor[row.jobType]}
                sx={{
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { lineHeight: '18px' },
                  mr: 1,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={600}
                sx={{ width: '85px' }}
              >
                Role:
              </Typography>
              <Chip
                size='medium'
                type='role'
                label={row.role}
                /* @ts-ignore */
                customcolor={RoleColor[row.role]}
                sx={{
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { lineHeight: '18px' },
                  mr: 1,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={600}
                sx={{ width: '85px' }}
              >
                Source:
              </Typography>
              <Typography variant='body1' fontSize={14}>
                {languageHelper(row.sourceLanguage)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={600}
                sx={{ width: '85px' }}
              >
                Target:
              </Typography>
              <Typography variant='body1' fontSize={14}>
                {languageHelper(row.targetLanguage)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            mt: '16px',
          }}
        >
          <Button variant='outlined' onClick={onClose}>
            Cancel
          </Button>

          <Button variant='contained' onClick={onClick}>
            {rightButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ApplyModal
