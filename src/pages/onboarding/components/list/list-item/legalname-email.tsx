import { getLegalName } from '@src/shared/helpers/legalname.helper'
import Box from '@mui/material/Box'
import Link from 'next/link'
import Typography from '@mui/material/Typography'

const LegalNameEmail = ({
  row,
  link,
}: {
  row: {
    isOnboarded: boolean
    isActive: boolean
    firstName: string
    middleName?: string | null
    lastName: string
    email: string
  }
  link?: string
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',

        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '32px',
          height: '32px',
        }}
      >
        <img
          alt=''
          aria-hidden
          src={
            row.isOnboarded && row.isActive
              ? `/images/icons/onboarding-icons/pro-active.png`
              : !row.isOnboarded
                ? `/images/icons/onboarding-icons/pro-onboarding.png`
                : row.isOnboarded && !row.isActive
                  ? `/images/icons/onboarding-icons/pro-inactive.png`
                  : ''
          }
        />
      </Box>

      <Box
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {link ? (
          <Link href={link} style={{ textDecoration: 'none' }}>
            <Typography
              variant='body2'
              color='#4C4E64DE'
              sx={{
                fontWeight: '600',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {getLegalName({
                firstName: row.firstName,
                middleName: row.middleName,
                lastName: row.lastName,
              })}
            </Typography>
          </Link>
        ) : (
          <Typography
            variant='body2'
            color='#4C4E64DE'
            sx={{
              fontWeight: '600',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getLegalName({
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
            })}
          </Typography>
        )}

        <Typography
          variant='body2'
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.email}
        </Typography>
      </Box>
    </Box>
  )
}

export default LegalNameEmail
