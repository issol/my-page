import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'

const Notice = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{ backgroundColor: 'rgba(253, 181, 40, 0.1)', padding: '20px' }}
    >
      <Typography color='rgba(253, 181, 40, 1)' fontWeight={600}>
        Notice
      </Typography>
      <Typography fontSize='14px'>
        Setting a date filter allows you to view data within the time period.
        The area displaying data for that specific period shows the date once
        more. Regardless of the time you set, the date is not displayed in the
        area that presents data from the current moment.
      </Typography>
    </Box>
  )
}

export default Notice
