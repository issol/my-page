import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'

// ** styles
import styled from 'styled-components'

// ** types
import { Button } from '@mui/material'

import { CalendarEventType } from '@src/types/common/calendar.type'

type Props<T> = {
  alertIconStatus?: string
  event: Array<CalendarEventType<T>>
  mdAbove: boolean
  leftSidebarWidth: number
}
export default function CalendarStatusSideBar<T>({
  alertIconStatus,
  event,
  mdAbove,
  leftSidebarWidth
}: Props<T>) {

  const [currEvent, setCurrEvent] = useState<typeof event>([])

  useEffect(() => {
    setCurrEvent(event.slice(0, 10))
  }, [event])

  return (
    <Drawer
      variant={mdAbove ? 'permanent' : 'temporary'}
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

      {event.length
        ? event?.map((item: any) => {
            return (
              <BoxFeature
                key={item.id}
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
    </Drawer>
  )
}

const BoxFeature = styled(Box)<{
  bg: string
  $bgSize?: string
  color?: string
}>`
  width: 100%;
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
