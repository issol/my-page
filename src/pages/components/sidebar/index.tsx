import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** styles
import styled from '@emotion/styled'

// ** types
import { Button } from '@mui/material'

import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import { CalendarEventType } from '@src/types/common/calendar.type'

type Props<T> = {
  title?: string
  alertIconStatus?: string
  event: Array<CalendarEventType<T>>
  month: number
  mdAbove: boolean
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
  setCurrentListId: (id: number) => void
}
export default function CalendarSideBar<T>({
  title,
  alertIconStatus = 'Overdue',
  event,
  mdAbove,
  month,
  leftSidebarWidth,
  leftSidebarOpen,
  handleLeftSidebarToggle,
  setCurrentListId,
}: Props<T>) {
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
        {title ?? 'Projects in'}
      </Typography>

      {currEvent.length
        ? currEvent?.map((item: any) => {
            return (
              <BoxFeature
                key={item.id}
                onClick={() => setCurrentListId(item.id)}
                bg={item.extendedProps.calendar}
                $bgSize={item.status === alertIconStatus ? '5px 5px' : ''}
                color={
                  item.status === alertIconStatus
                    ? item.extendedProps.calendar
                    : ''
                }
              >
                {item.status === alertIconStatus
                  ? `🔴 ${item.status}`
                  : item.status}
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

const BoxFeature = styled(Box)<{
  bg: string
  $bgSize?: string
  color?: string
}>`
  width: 100%;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 4px 10px;
  color: ${({ color }) => color ?? 'rgba(76, 78, 100, 0.87)'};
  font-size: 1rem;
  background: ${({ bg }) =>
    `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${bg}` ??
    ''};

  ${({ $bgSize }) => ($bgSize ? `background-size : ${$bgSize}` : '')}
`
const MoreBtn = styled(Button)`
  text-transform: none;
  padding: 0;
  color: rgba(76, 78, 100, 0.87);
`
