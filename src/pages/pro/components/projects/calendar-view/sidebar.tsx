import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** styles
import styled from 'styled-components'
import UseBgColor, { UseBgColorType } from '@src/@core/hooks/useBgColor'

// ** types
import { Button } from '@mui/material'
import { CalendarEventType } from '@src/apis/pro-projects.api'

type Props = {
  event: Array<CalendarEventType>
  month: number
  mdAbove: boolean
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
}
export default function CalendarSideBar({
  event,
  mdAbove,
  month,
  leftSidebarWidth,
  leftSidebarOpen,
  handleLeftSidebarToggle,
}: Props) {
  const bgColors = UseBgColor()

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
  }

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(new Date().getFullYear(), month),
  )

  const [currEvent, setCurrEvent] = useState<typeof event>([])

  useEffect(() => {
    setCurrEvent(event.slice(0, 10))
  }, [event])

  function onMoreClick() {
    setCurrEvent([...event])
  }

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        zIndex: 2,
        display: 'block',
        position: mdAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          boxShadow: 'none',
          width: leftSidebarWidth,
          borderTopRightRadius: 0,
          alignItems: 'flex-start',
          borderBottomRightRadius: 0,
          p: theme => theme.spacing(5),
          zIndex: mdAbove ? 2 : 'drawer',
          position: mdAbove ? 'static' : 'absolute',
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute',
        },
      }}
    >
      <Typography
        variant='body2'
        sx={{ mt: 7, mb: 2.5, textTransform: 'none', fontWeight: 'bold' }}
      >
        Projects in {monthName}
      </Typography>

      {currEvent.length
        ? currEvent?.map((item: any) => {
            return (
              <BoxFeature
                key={item.id}
                bg={colors[item?.extendedProps?.calendar]?.backgroundColor}
              >
                {item.title}
              </BoxFeature>
            )
          })
        : ''}
      {currEvent.length < event.length ? (
        <MoreBtn onClick={onMoreClick}>+More</MoreBtn>
      ) : (
        ''
      )}
    </Drawer>
  )
}

const BoxFeature = styled(Box)<{ bg: string }>`
  width: 100%;
  margin-bottom: 10px;
  padding: 4px 10px;
  color: rgba(76, 78, 100, 0.87);
  font-size: 1rem;
  background: ${({ bg }) => bg ?? ''};
  cursor: pointer;
`
const MoreBtn = styled(Button)`
  text-transform: none;
  padding: 0;
  color: rgba(76, 78, 100, 0.87);
`
