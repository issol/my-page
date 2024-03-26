import { getLegalName } from '@src/shared/helpers/legalname.helper'
import Box from '@mui/material/Box'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { Tooltip } from '@mui/material'

interface LegalNameEmailProps {
  row: {
    isOnboarded: boolean
    isActive: boolean
    firstName: string
    middleName?: string | null
    lastName: string
    email: string
  }
  link?: string
}

const LegalNameEmail = ({ row, link }: LegalNameEmailProps) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      gap='12px'
      whiteSpace='nowrap'
      overflow='hidden'
      textOverflow='ellipsis'
    >
      <Box display='flex' width='32px' height='32px'>
        <img
          alt=''
          aria-hidden
          src={
            row.isOnboarded && row.isActive
              ? `/images/icons/onboarding-icons/icon-pro-onboarding.svg`
              : !row.isOnboarded
                ? `/images/icons/onboarding-icons/pro-onboarding.png`
                : row.isOnboarded && !row.isActive
                  ? `/images/icons/onboarding-icons/pro-inactive.png`
                  : ''
          }
        />
      </Box>

      <Box whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
        {link ? (
          <Link href={link} style={{ textDecoration: 'none' }}>
            <Typography
              variant='body1'
              whiteSpace='nowrap'
              overflow='hidden'
              textOverflow='ellipsis'
              fontWeight={600}
              color='rgba(76, 78, 100, 0.87)'
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
            variant='body1'
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
            fontWeight={600}
            color='rgba(76, 78, 100, 0.87)'
          >
            {getLegalName({
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
            })}
          </Typography>
        )}
        <Tooltip title={row.email}>
          <Typography
            variant='body2'
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
            fontWeight={400}
          >
            {row.email}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  )
}

export const LegalName = ({ row }: Omit<LegalNameEmailProps, 'link'>) => {
  return (
    <Box
      display='flex'
      alignItems='center'
      gap='12px'
      whiteSpace='nowrap'
      overflow='hidden'
      textOverflow='ellipsis'
    >
      <Box display='flex' width='32px' height='32px'>
        <img
          alt=''
          aria-hidden
          src={
            row.isOnboarded && row.isActive
              ? `/images/icons/onboarding-icons/icon-pro-onboarding.svg`
              : !row.isOnboarded
                ? `/images/icons/onboarding-icons/pro-onboarding.png`
                : row.isOnboarded && !row.isActive
                  ? `/images/icons/onboarding-icons/pro-inactive.png`
                  : ''
          }
        />
      </Box>

      <Box whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
        <Typography
          variant='body2'
          whiteSpace='nowrap'
          overflow='hidden'
          textOverflow='ellipsis'
          fontWeight={600}
          sx={{ color: `#4C4E64DE` }}
        >
          {getLegalName({
            firstName: row.firstName,
            middleName: row.middleName,
            lastName: row.lastName,
          })}
        </Typography>
      </Box>
    </Box>
  )
}
export default LegalNameEmail
