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

import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import {
  ClientInvoiceCalendarEventType,
  ClientProjectCalendarEventType,
} from '@src/apis/client.api'

type Props = {
  event: Array<ClientInvoiceCalendarEventType>
  month: number
  mdAbove: boolean
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
  setCurrentListId: (id: number) => void
}
export default function ClientInvoiceCalendarSideBar({
  event,
  mdAbove,
  month,
  leftSidebarWidth,
  leftSidebarOpen,
  handleLeftSidebarToggle,
  setCurrentListId,
}: Props) {
  console.log(event)

  const bgColors = UseBgColor()

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: {
      color: 'rgba(76, 78, 100, 0.87)',
      backgroundColor: hexToRGBA('#8C3131', 0.12),
    },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
    overdue: {
      color: bgColors.errorLight.color,
      backgroundColor:
        'linear-gradient(135deg, rgba(255, 77, 73, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 77, 73, 0.2) 50%, rgba(255, 77, 73, 0.2) 75%, transparent 75%, transparent)',
      backgroundSize: '5px 5px',
    },
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
        Invoice status
      </Typography>

      {currEvent.length
        ? currEvent?.map((item: ClientInvoiceCalendarEventType) => {
            return (
              <BoxFeature
                key={item.id}
                onClick={() => setCurrentListId(item.id)}
                bg={hexToRGBA(item?.extendedProps?.calendar!, 0.12)}
                $bgSize={colors[item?.extendedProps?.calendar!]?.backgroundSize}
                color={
                  item.invoiceStatus === 'Overdue' ||
                  item.invoiceStatus === 'Overdue (Reminder sent)'
                    ? '#FF4D49'
                    : ''
                }
              >
                {/* {item.title} */}
                {item.invoiceStatus === 'Overdue' ||
                item.invoiceStatus === 'Overdue (Reminder sent)'
                  ? `🔴 ${item.invoiceStatus}`
                  : item.invoiceStatus}
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
  padding: 3px 0px 3px 10px;
  color: ${({ color }) => color ?? 'rgba(76, 78, 100, 0.87)'};
  font-size: 1rem;
  background: ${({ bg }) => bg ?? ''};
  ${({ $bgSize }) => ($bgSize ? `background-size : ${$bgSize}` : '')}
`
const MoreBtn = styled(Button)`
  text-transform: none;
  padding: 0;
  color: rgba(76, 78, 100, 0.87);
`
