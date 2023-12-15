import CalendarStatusSideBar from '@src/pages/components/sidebar/status-sidebar'
import Calendar from '@src/views/dashboard/calendar/calender'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { useState } from 'react'
import useCalenderResize from '@src/hooks/useCalenderResize'
import Box from '@mui/material/Box'
import CalendarWrapper from '@src/@core/styles/libs/fullcalendar'

const ProCalendar = () => {
  const { containerRef, containerWidth } = useCalenderResize()

  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const [statuses, setStatuses] = useState<
    Array<{ color: string; value: number; label: string }>
  >([])

  return (
    <Box sx={{ width: '100%' }}>
      <CalendarWrapper className='app-calendar'>
        <Box
          sx={{
            width: '280px',
            padding: '20px',
          }}
        >
          Invoice status
        </Box>
        <Box ref={containerRef} sx={{ width: '100%', height: '876px' }}>
          <Calendar containerWidth={containerWidth + 40} />
        </Box>
      </CalendarWrapper>
    </Box>
  )
}

export default ProCalendar
