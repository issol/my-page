import { Box, Button, Typography } from '@mui/material'
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  message: string
  title?: string
  iconType?: AlertType
  leftButtonName?: string
  rightButtonName?: string
  onClose: () => void
  onClick: () => void
}
export default function ModalWithButtonName({
  message,
  title,
  iconType,
  leftButtonName,
  rightButtonName,
  onClose,
  onClick,
}: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={true}
    >
      <SmallModalContainer>
        <AlertIcon type={iconType ?? 'successful'} />
        <Typography variant='body1' textAlign='center' mt='10px'>
          {message}
        </Typography>
        {title ? <TitleTypography>{title}</TitleTypography> : null}
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='outlined' onClick={onClose}>
            {leftButtonName ? leftButtonName : 'Cancel'}
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onClick()
              onClose()
            }}
          >
            {rightButtonName ? rightButtonName : 'Okay'}
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
