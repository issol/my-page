import { OnboardingListType } from 'src/types/onboarding/list'
import { getLegalName } from 'src/shared/helpers/legalname.helper'
import Box from '@mui/material/Box'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { TestStatusColor } from 'src/shared/const/chipColors'
import { v4 as uuidv4 } from 'uuid'
import Chip from 'src/@core/components/mui/chip'

import { OnboardingListCellType } from 'src/types/onboarding/list'
const TestStatus = ({ row }: OnboardingListCellType) => {
  return (
    <Box>
      {!row?.jobInfo.length
        ? '-'
        : row?.jobInfo.map(
            (item, idx) =>
              idx === 0 && (
                <Chip
                  size='medium'
                  key={uuidv4()}
                  type='testStatus'
                  label={item.status}
                  /* @ts-ignore */
                  customColor={TestStatusColor[item.status]}
                  sx={{
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { lineHeight: '18px' },
                    mr: 1,
                  }}
                />
              ),
          )}
    </Box>
  )
}

export default TestStatus
