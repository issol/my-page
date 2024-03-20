import { Box } from '@mui/material'
import { JobType } from '@src/types/common/item.type'
import { JobAssignProRequestsType } from '@src/types/jobs/jobs.type'

type Props = {
  jobInfo: JobType
  jobAssign: JobAssignProRequestsType[]
}

const JobInfo = ({ jobInfo, jobAssign }: Props) => {
  return (
    <Box sx={{ padding: '20px', border: '1px solid' }}>
      <Box sx={{ padding: '10px 20px' }}></Box>
    </Box>
  )
}

export default JobInfo
