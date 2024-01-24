import Box from '@mui/material/Box'

import { TestStatusColor } from '@src/shared/const/chipColors'
import { v4 as uuidv4 } from 'uuid'
import Chip from '@src/@core/components/mui/chip'

const TestStatus = ({
  row,
}: {
  row: { jobInfo: Array<{ testStatus: string }> }
}) => {
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
                  label={item.testStatus}
                  /* @ts-ignore */
                  customcolor={TestStatusColor[item.testStatus]}
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
