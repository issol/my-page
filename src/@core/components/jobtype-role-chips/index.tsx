import { v4 as uuidv4 } from 'uuid'
import { JobInfoType } from 'src/types/sign/personalInfoTypes'
import Box from '@mui/material/Box'
import Chip from 'src/@core/components/mui/chip'

import React from 'react'
import { JobTypeColor, RoleColor } from 'src/shared/const/chipColors'

type Props = {
  jobInfo: JobInfoType
}

const JobTypeRoleChips = ({ jobInfo }: Props) => {
  return (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      <Chip
        key={uuidv4()}
        size='medium'
        type='jobType'
        label={jobInfo.jobType}
        /* @ts-ignore */
        customColor={JobTypeColor[jobInfo.jobType]}
        sx={{
          textTransform: 'capitalize',
          '& .MuiChip-label': { lineHeight: '18px' },
          mr: 1,
        }}
      />
      <Chip
        key={uuidv4()}
        size='medium'
        type='role'
        label={jobInfo.role}
        /* @ts-ignore */
        customColor={RoleColor[jobInfo.role]}
        sx={{
          textTransform: 'capitalize',
          '& .MuiChip-label': { lineHeight: '18px' },
          mr: 1,
        }}
      />
    </Box>
  )
}

export default JobTypeRoleChips
