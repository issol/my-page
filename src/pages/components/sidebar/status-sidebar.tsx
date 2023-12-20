// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'

// ** styles
import styled from 'styled-components'
import { Typography } from '@mui/material'

type Props = {
  alertIconStatus?: string
  status: Array<{
    value: number | string
    label: string
    color: string
  }>

  mdAbove: boolean
  leftSidebarWidth: number
  title: string
}
export default function CalendarStatusSideBar({
  alertIconStatus,
  status,
  mdAbove,
  leftSidebarWidth,
  title,
}: Props) {
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
      {title === 'Project' ? null : (
        <Box sx={{ paddingTop: '12px', paddingBottom: '10px' }}>
          <Typography variant='body2' fontWeight={600}>
            {title} status
          </Typography>
        </Box>
      )}

      {status.length
        ? status?.map(
            (item: {
              value: number | string
              label: string
              color: string
            }) => {
              return (
                <BoxFeature
                  key={item.value}
                  bg={item.color}
                  canceled={
                    item.label === alertIconStatus ||
                    item.label === 'Overdue' ||
                    item.label === 'Overdue (Reminder sent)'
                  }
                  // small={item.label === 'Overdue (Reminder sent)'}
                  $bgSize={
                    item.label === alertIconStatus ||
                    item.label === 'Overdue' ||
                    item.label === 'Overdue (Reminder sent)' ||
                    item.label === 'Canceled'
                      ? '7px 7px'
                      : ''
                  }
                  color={
                    item.label === alertIconStatus ||
                    item.label === 'Overdue' ||
                    item.label === 'Overdue (Reminder sent)' ||
                    item.label === 'Canceled'
                      ? item.color
                      : ''
                  }
                >
                  {item.label === alertIconStatus ||
                  item.label === 'Overdue' ? (
                    `🔴 ${item.label}`
                  ) : item.label === 'Overdue (Reminder sent)' ? (
                    <>
                      <span>🔴 Overdue </span>
                      <span
                        style={{ fontSize: '14px' }}
                      >{`(Reminder sent)`}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </BoxFeature>
              )
            },
          )
        : ''}
    </Drawer>
  )
}

const BoxFeature = styled(Box)<{
  bg: string
  $bgSize?: string
  color?: string
  canceled: boolean
}>`
  width: 100%;
  margin-bottom: 10px;
  padding: 4px 10px;
  color: ${({ color }) => color ?? 'rgba(76, 78, 100, 0.87)'};

  background: ${({ bg, canceled }) =>
    canceled
      ? `linear-gradient(45deg,
        #F0CCCB 25%, #FFEAE9 0, #FFEAE9 50%,
        #F0CCCB 0, #F0CCCB 75%, #FFEAE9 0);`
      : `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${bg}` ??
        ''};

  ${({ $bgSize }) => ($bgSize ? `background-size : ${$bgSize}` : '')}
`
