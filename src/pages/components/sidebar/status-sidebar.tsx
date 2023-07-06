// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'

// ** styles
import styled from 'styled-components'

type Props = {
  alertIconStatus?: string
  status: Array<{ value: string; label: string }>
  mdAbove: boolean
  leftSidebarWidth: number
}
export default function CalendarStatusSideBar({
  alertIconStatus,
  status,
  mdAbove,
  leftSidebarWidth,
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
      {status.length
        ? status?.map((item: any) => {
            return (
              <BoxFeature
                key={item.value}
                bg={item.label}
                $bgSize={item.value === alertIconStatus ? '5px 5px' : ''}
                color={item.value === alertIconStatus ? item.label : ''}
              >
                {item.value === alertIconStatus
                  ? `🔴 ${item.value}`
                  : item.value}
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
