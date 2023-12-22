import React, { useEffect } from 'react'
import { Backdrop, Box } from '@mui/material'
import Fab from '@mui/material/Fab'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import Zoom from '@mui/material/Zoom'
import { useTheme } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'

interface FloatingCalendarProps {
  children: React.ReactNode
}
const FloatingCalendar = ({ children }: FloatingCalendarProps) => {
  const [active, setActive] = React.useState(false)
  const trigger = useScrollTrigger({
    threshold: 180,
    disableHysteresis: true,
  })

  useEffect(() => {
    if (!trigger) {
      setActive(false)
    }
  }, [trigger])

  const getHeaderView = () => {
    if (!trigger) {
      return false
    }
    return active
  }

  return (
    <>
      <Box
        sx={{
          visibility: trigger ? 'visible' : 'hidden',
          position: 'fixed',
          top: 320,
          right: 280,
          zIndex: theme => theme.zIndex.drawer + 2,
        }}
      >
        <Fab
          variant='extended'
          size='large'
          sx={{
            width: '63px',
            height: '63px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            transform: trigger ? 'scale(1)' : 'scale(0.1)',
            transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onClick={() => setActive(!active)}
        >
          <CalendarTodayIcon color='primary' />
        </Fab>
      </Box>
      <Box
        sx={{
          width: '736px',
          position: 'fixed',
          top: 316,
          right: 358,
          visibility: getHeaderView() ? 'visible' : 'hidden',
          opacity: getHeaderView() ? 1 : 0,
          transformOrigin: 'center right',
          transform: getHeaderView() ? 'scaleX(1)' : 'scaleX(0.1)',
          transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: theme => theme.zIndex.drawer + 2,
        }}
      >
        {children}
      </Box>
      {getHeaderView() && (
        <Backdrop
          sx={{
            zIndex: theme => theme.zIndex.drawer + 1,
          }}
          open={true}
        />
      )}
    </>
  )
}

export default FloatingCalendar
