import { Box, Button, Typography } from '@mui/material'
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import Dialog from '@mui/material/Dialog'
import { TitleTypography } from '@src/@core/styles/typography'

type Props = {
  vary?: AlertType
  message: string
  title?: string
  onClose: () => void
}
export default function SimpleAlertModal({
  vary = 'error',
  message,
  title,
  onClose,
}: Props) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='price-unit-add-dialog'
      open={true}
    >
      <SmallModalContainer>
        <AlertIcon type={vary} />
        <Typography variant='body1' textAlign='center' mt='10px'>
          {message}
        </Typography>
        {title ? (
          <TitleTypography
            mt='8px'
            variant='body2'
            fontSize='1rem'
            fontWeight='bold'
          >
            {title}
          </TitleTypography>
        ) : null}
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button variant='contained' onClick={onClose}>
            Okay
          </Button>
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}
