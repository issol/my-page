import React, { ReactElement } from 'react'
import { IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import useDialog from '@src/hooks/useDialog'
import Box from '@mui/material/Box'
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
import Dialog from '@mui/material/Dialog'

interface InfoDialogProps {
  title: string
  iconName?: string
  alertType?: AlertType
  contents: ReactElement | string
  style?: React.CSSProperties
  buttonIconSize?: number
}

const InfoDialogButton = ({
  title,
  contents,
  alertType = 'info',
  style,
  buttonIconSize = 15,
  iconName = 'material-symbols:info-outline',
}: InfoDialogProps) => {
  const { isOpen, onOpen, onClose } = useDialog()
  return (
    <>
      <IconButton
        onClick={() => onOpen()}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          width: '24px',
          height: '24px',
          ...style,
        }}
      >
        <Icon icon={iconName} fontSize={buttonIconSize} color='#8D8E9A' />
      </IconButton>
      <Dialog onClose={onClose} open={isOpen}>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          padding='20px'
          sx={{ maxWidth: 360 }}
        >
          <AlertIcon type={alertType} />
          <Typography
            variant='h6'
            textAlign='center'
            mt='10px'
            color='rgba(76, 78, 100, 0.87)'
            margin='8px 0'
          >
            {title}
          </Typography>
          <Typography
            component='div'
            variant='body1'
            textAlign='center'
            color='#8D8E9A'
          >
            {contents}
          </Typography>
        </Box>
      </Dialog>
    </>
  )
}

export default InfoDialogButton
