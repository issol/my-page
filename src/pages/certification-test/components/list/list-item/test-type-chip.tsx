import { v4 as uuidv4 } from 'uuid'

import Box from '@mui/material/Box'
import Chip from 'src/@core/components/mui/chip'

import React from 'react'
import { TestTypeColor } from 'src/shared/const/chipColors'

type Props = {
  testType: string
}

const TestTypeChip = ({ testType }: Props) => {
  console.log(testType)

  return (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      <Chip
        key={uuidv4()}
        size='medium'
        type={`testType-${testType}`}
        label={testType}
        /* @ts-ignore */
        customcolor={TestTypeColor[testType]}
        sx={{
          // textTransform: 'capitalize',
          '& .MuiChip-label': { lineHeight: '18px' },
          mr: 1,
        }}
      />
    </Box>
  )
}

export default TestTypeChip
