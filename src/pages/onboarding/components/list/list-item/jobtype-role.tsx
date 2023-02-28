import { OnboardingListType } from 'src/types/onboarding/list'
import { getLegalName } from 'src/shared/helpers/legalname.helper'
import Box from '@mui/material/Box'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import JobTypeRoleChips from 'src/@core/components/jobtype-role-chips'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  jobInfo: {
    jobType: string
    role: string
  }[]
}

const JobTypeRole = ({ jobInfo }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      {!jobInfo.length
        ? '-'
        : jobInfo.map(
            (item, idx) =>
              idx === 0 && (
                <JobTypeRoleChips
                  jobType={item.jobType}
                  role={item.role}
                  key={uuidv4()}
                />
              ),
          )}
      {jobInfo.length > 1 ? <CountChip>+{jobInfo.length - 1}</CountChip> : null}
    </Box>
  )
}

const CountChip = styled.p`
  padding: 3px 4px;
  text-align: center;
  width: 40px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #6d788d;
  border: 1px solid rgba(76, 78, 100, 0.6);
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.813rem;
`

export default JobTypeRole
