import Box from '@mui/material/Box'

import { styled } from '@mui/system'
import { v4 as uuidv4 } from 'uuid'
import JobTypeRoleChips from './role-chip'

type Props = {
  jobInfo: {
    jobType: string
    role: string
  }[]
  visibleChip?: 'all' | 'jobType' | 'role'
}

const JobTypeRole = ({ jobInfo, visibleChip }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center', // Add this line
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
                  visibleChip={visibleChip ? visibleChip : 'all'}
                  key={uuidv4()}
                />
              ),
          )}
      {jobInfo.length > 1 ? <CountChip>+{jobInfo.length - 1}</CountChip> : null}
    </Box>
  )
}

const CountChip = styled('p')`
  text-align: center;
  height: 24px;
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
}
`
export default JobTypeRole
