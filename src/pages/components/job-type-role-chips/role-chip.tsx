import { v4 as uuidv4 } from 'uuid'

import Box from '@mui/material/Box'
import Chip from 'src/@core/components/mui/chip'

import React from 'react'
import { JobTypeColor, RoleColor } from 'src/shared/const/chipColors'

type Props = {
  jobType: string
  role: string
}

const JobTypeRoleChips = ({ jobType, role }: Props) => {
  return (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      <Chip
        key={uuidv4()}
        size='medium'
        type='jobType'
        label={jobType}
        /* @ts-ignore */
        customcolor={JobTypeColor[jobType]}
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
        label={role}
        /* @ts-ignore */
        customcolor={RoleColor[role]}
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
