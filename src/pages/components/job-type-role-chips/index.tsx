import Box from '@mui/material/Box'

import { styled } from '@mui/system'
import { v4 as uuidv4 } from 'uuid'
import JobTypeRoleChips from './role-chip'
import { Tooltip } from '@mui/material'

type Props = {
  jobInfo: {
    jobType: string
    role: string
  }[]
  visibleType?: 'all' | 'jobType' | 'role'
}

const JobTypeRole = ({ jobInfo, visibleType }: Props) => {
  return (
    <Tooltip
      title={
        jobInfo.length > 2 ? (
          <ul style={{ paddingLeft: '16px' }}>
            {jobInfo.map(value => {
              return <li key={uuidv4()}>{value.role}</li>
            })}
          </ul>
        ) : null
      }
    >
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {!jobInfo.length
          ? '-'
          : jobInfo.map((item, idx) =>
              visibleType !== 'role' ? (
                idx === 0 && (
                  <JobTypeRoleChips
                    jobType={item.jobType}
                    role={item.role}
                    visibleChip={visibleType ? visibleType : 'all'}
                    key={uuidv4()}
                  />
                )
              ) : (
                <JobTypeRoleChips
                  jobType={item.jobType}
                  role={item.role}
                  visibleChip={visibleType ? visibleType : 'all'}
                  key={uuidv4()}
                />
              ),
            )}
        {jobInfo.length > 1 && visibleType !== 'role' ? (
          <CountChip>+{jobInfo.length - 1}</CountChip>
        ) : null}
      </Box>
    </Tooltip>
  )
}

const CountChip = styled('p')`
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
