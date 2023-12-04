import { Box, ButtonGroup, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import BlankLayout from '@src/@core/layouts/BlankLayout'
import BlankLayoutWithAppBar from '@src/@core/layouts/BlankLayoutWithAppBar'
import OpenLayout from '@src/@core/layouts/OpenLayout'
import { ReactNode } from 'react'

const JobOpenings = () => {
  return (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0 24px'
      >
        <PageHeader
          title={<Typography variant='h5'>Job openings</Typography>}
        />
      </Box>
    </Box>
  )
}

export default JobOpenings

JobOpenings.guestGuard = true
JobOpenings.getLayout = (page: ReactNode) => <OpenLayout>{page}</OpenLayout>
